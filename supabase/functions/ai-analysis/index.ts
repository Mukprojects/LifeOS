const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()

    if (!type || !data) {
      throw new Error('Missing type or data in request')
    }

    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lifeos.app",
        "X-Title": "LifeOS",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
          {
            role: "system",
            content: "You are a professional life coach AI. You must respond with ONLY valid JSON - no additional text, explanations, or conversational elements. The JSON may optionally be wrapped in markdown code blocks (```json). Do not include any preambles, postambles, or commentary outside the JSON structure. Be encouraging and actionable in your analysis within the JSON content itself."
          },
          {
            role: "user",
            content: generatePrompt(type, data)
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    })

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text()
      console.error('OpenRouter API error:', errorText)
      // Return structured error instead of throwing
      return new Response(
        JSON.stringify({ 
          error: 'AI_API_ERROR',
          message: `OpenRouter API error: ${openRouterResponse.status}`,
          details: errorText
        }),
        {
          status: 200, // Return 200 so client can handle the error gracefully
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const result = await openRouterResponse.json()
    
    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      // Return structured error instead of throwing
      return new Response(
        JSON.stringify({ 
          error: 'INVALID_AI_RESPONSE',
          message: 'Invalid response format from OpenRouter',
          details: 'Missing choices or message in response'
        }),
        {
          status: 200, // Return 200 so client can handle the error gracefully
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }
    
    let content = result.choices[0].message.content || ''

    if (!content.trim()) {
      // Return structured error instead of throwing
      return new Response(
        JSON.stringify({ 
          error: 'EMPTY_AI_RESPONSE',
          message: 'Empty response from AI',
          details: 'AI returned no content'
        }),
        {
          status: 200, // Return 200 so client can handle the error gracefully
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // Extract JSON using robust parsing logic
    const extractedJSON = extractJSONFromResponse(content)
    
    if (!extractedJSON) {
      console.error('Failed to extract JSON from response:', content)
      // Return structured error instead of throwing
      return new Response(
        JSON.stringify({ 
          error: 'JSON_EXTRACTION_FAILED',
          message: 'Could not extract valid JSON from AI response',
          details: content.substring(0, 500) // Include first 500 chars for debugging
        }),
        {
          status: 200, // Return 200 so client can handle the error gracefully
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    return new Response(
      JSON.stringify({ content: extractedJSON }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in ai-analysis function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'FUNCTION_ERROR',
        message: error.message || 'Unknown error occurred',
        details: error.toString()
      }),
      {
        status: 200, // Return 200 so client can handle the error gracefully
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

function extractJSONFromResponse(content: string): string | null {
  // Helper function to test if a string is valid JSON
  function isValidJSON(str: string): boolean {
    try {
      JSON.parse(str)
      return true
    } catch {
      return false
    }
  }

  // Helper function to clean up common JSON formatting issues
  function cleanJSONString(str: string): string {
    return str
      .trim()
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
      .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Quote unquoted keys
  }

  // First, try to extract JSON from markdown code blocks
  const markdownMatches = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/g)
  if (markdownMatches) {
    for (const match of markdownMatches) {
      const extracted = match.replace(/```(?:json)?\s*/, '').replace(/\s*```$/, '').trim()
      if (extracted && (extracted.startsWith('{') || extracted.startsWith('['))) {
        const cleaned = cleanJSONString(extracted)
        if (isValidJSON(cleaned)) {
          return cleaned
        }
      }
    }
  }

  // Try to find the most complete JSON object or array
  const jsonCandidates = []

  // Look for JSON objects
  let braceCount = 0
  let startIndex = -1
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') {
      if (braceCount === 0) {
        startIndex = i
      }
      braceCount++
    } else if (content[i] === '}') {
      braceCount--
      if (braceCount === 0 && startIndex !== -1) {
        const candidate = content.substring(startIndex, i + 1)
        jsonCandidates.push(candidate)
      }
    }
  }

  // Look for JSON arrays
  let bracketCount = 0
  startIndex = -1
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '[') {
      if (bracketCount === 0) {
        startIndex = i
      }
      bracketCount++
    } else if (content[i] === ']') {
      bracketCount--
      if (bracketCount === 0 && startIndex !== -1) {
        const candidate = content.substring(startIndex, i + 1)
        jsonCandidates.push(candidate)
      }
    }
  }

  // Test each candidate and return the first valid one
  for (const candidate of jsonCandidates) {
    const cleaned = cleanJSONString(candidate)
    if (isValidJSON(cleaned)) {
      return cleaned
    }
  }

  // If no valid JSON found, try simple boundary detection as fallback
  const firstBrace = content.indexOf('{')
  const lastBrace = content.lastIndexOf('}')
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const extracted = content.substring(firstBrace, lastBrace + 1)
    const cleaned = cleanJSONString(extracted)
    if (isValidJSON(cleaned)) {
      return cleaned
    }
  }

  const firstBracket = content.indexOf('[')
  const lastBracket = content.lastIndexOf(']')
  
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    const extracted = content.substring(firstBracket, lastBracket + 1)
    const cleaned = cleanJSONString(extracted)
    if (isValidJSON(cleaned)) {
      return cleaned
    }
  }

  // Final attempt: check if the entire content is valid JSON
  const cleaned = cleanJSONString(content)
  if (isValidJSON(cleaned)) {
    return cleaned
  }

  return null
}

function generatePrompt(type: string, data: any): string {
  if (type === 'life-summary') {
    return `Analyze this person's life situation and provide a JSON response with their life summary.

Profile Data:
- Age: ${data.age}
- Profession: ${data.profession}
- Location: ${data.location}
- Work Hours/Day: ${data.workHours}
- Social Media Hours/Day: ${data.socialMediaHours}
- Main Frustrations: ${data.frustrations}
- Daily Routine: ${data.dailyRoutine}
- Proud Habit: ${data.proudHabit}
- Currently Avoiding: ${data.avoidingWhat}
- Self Ratings (1-10):
  - Productivity: ${data.productivity}
  - Health: ${data.health}
  - Motivation: ${data.motivation}
  - Mental Health: ${data.mentalHealth}
  - Career Direction: ${data.careerDirection}

Return ONLY this JSON structure with no additional text:
{
  "narrative": "A 2-3 sentence personal narrative about their current life situation and potential",
  "score": {
    "overall": 75,
    "productivity": 80,
    "focus": 70,
    "confidence": 65,
    "goalProgress": 60
  },
  "insights": ["insight1", "insight2", "insight3"],
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"]
}

Make the analysis personal, actionable, and encouraging. Base scores on their self-ratings and profile data.`
  } else if (type === 'goal-breakdown') {
    return `Break down this goal into a comprehensive action plan with milestones, subtasks, timelines, and checkpoints.

Goal Details:
- Title: ${data.title}
- Description: ${data.description}
- Timeframe: ${data.timeframe}
- Category: ${data.category}

Return ONLY this JSON structure with no additional text:
{
  "milestones": [
    {
      "id": "milestone-1",
      "title": "Milestone Title",
      "description": "Detailed description of what this milestone achieves",
      "month": 1,
      "tasks": [
        {
          "id": "task-1-1",
          "title": "Specific task title",
          "description": "What exactly needs to be done",
          "completed": false,
          "priority": "high",
          "estimatedHours": 2,
          "resources": ["https://example.com/resource", "Book: Relevant Title"]
        }
      ],
      "completed": false,
      "subtasks": [
        {
          "id": "subtask-1-1-1",
          "title": "Granular subtask title",
          "description": "Very specific action item",
          "completed": false,
          "parentTaskId": "task-1-1"
        }
      ],
      "timeline": {
        "startDate": "2025-01-01",
        "endDate": "2025-01-31",
        "keyDates": [
          {
            "date": "2025-01-15",
            "description": "Mid-milestone check-in"
          }
        ]
      }
    }
  ],
  "checkpoints": [
    {
      "id": "checkpoint-1",
      "title": "Initial Progress Review",
      "description": "Evaluate progress after first milestone",
      "targetDate": "2025-01-31",
      "achieved": false,
      "milestoneId": "milestone-1"
    }
  ],
  "aiAnalysis": {
    "strengths": [
      "Key strength or advantage for this goal"
    ],
    "challenges": [
      "Potential obstacle to overcome"
    ],
    "recommendations": [
      "Strategic advice for success"
    ]
  }
}

Create 3-6 milestones depending on the timeframe. Each milestone should have 3-5 specific, actionable tasks with appropriate subtasks. Include realistic timelines and strategic checkpoints. The AI analysis should provide personalized insights based on the goal details.`
  }
  
  return 'Invalid request type'
}