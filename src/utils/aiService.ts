import { UserProfile, LifeSummary, Goal, Milestone } from '../types';
import { supabase } from '../lib/supabase';

// Utility function to extract JSON from markdown code blocks
function extractJSONFromMarkdown(response: string): string {
  // Remove markdown code block markers if present
  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  
  // Try to find JSON object in the response
  const jsonStart = response.indexOf('{');
  const jsonEnd = response.lastIndexOf('}');
  
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    return response.substring(jsonStart, jsonEnd + 1);
  }
  
  // If no JSON found, return the response as-is
  return response.trim();
}

async function callAIFunction(type: string, data: any): Promise<string> {
  try {
    // Get the current session to ensure we're authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      throw new Error('User not authenticated');
    }

    const { data: result, error } = await supabase.functions.invoke('ai-analysis', {
      body: { type, data },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`Failed to call AI service: ${error.message}`);
    }

    if (!result) {
      throw new Error('No result received from AI service');
    }

    // Check if the result contains a structured error
    if (result.error) {
      console.error('AI service returned error:', result);
      throw new Error(`AI service error: ${result.message || result.error}`);
    }

    if (!result.content) {
      throw new Error('No content received from AI service');
    }

    return result.content;
  } catch (error) {
    console.error('Error calling AI function:', error);
    throw error;
  }
}

export async function generateLifeSummary(profile: UserProfile): Promise<LifeSummary> {
  try {
    const response = await callAIFunction('life-summary', profile);
    
    // Extract JSON from markdown code blocks if present
    const cleanedResponse = extractJSONFromMarkdown(response);
    
    // Parse the JSON response
    let aiData;
    try {
      aiData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response was:', cleanedResponse);
      throw new Error('Invalid JSON response from AI service');
    }
    
    // Validate and sanitize the response
    if (!aiData || typeof aiData !== 'object') {
      throw new Error('Invalid AI response format');
    }
    
    return {
      narrative: aiData.narrative || `You're a ${profile.age}-year-old ${profile.profession} with great potential for growth.`,
      score: {
        overall: Math.min(100, Math.max(0, aiData.score?.overall || 50)),
        productivity: Math.min(100, Math.max(0, aiData.score?.productivity || profile.productivity * 10)),
        focus: Math.min(100, Math.max(0, aiData.score?.focus || 50)),
        confidence: Math.min(100, Math.max(0, aiData.score?.confidence || 50)),
        goalProgress: Math.min(100, Math.max(0, aiData.score?.goalProgress || 20))
      },
      insights: Array.isArray(aiData.insights) ? aiData.insights : [
        "You have strong self-awareness and willingness to grow",
        "Building consistent daily systems will unlock your potential"
      ],
      strengths: Array.isArray(aiData.strengths) ? aiData.strengths : [
        "Self-awareness and willingness to grow",
        "Clear communication of goals and challenges"
      ],
      improvements: Array.isArray(aiData.improvements) ? aiData.improvements : [
        "Implement a daily planning system",
        "Develop consistent progress tracking habits"
      ]
    };
  } catch (error) {
    console.error('Error generating life summary:', error);
    // Fallback to a basic summary if AI fails
    return generateFallbackLifeSummary(profile);
  }
}

export async function generateGoalBreakdown(goal: Goal): Promise<Goal> {
  try {
    const response = await callAIFunction('goal-breakdown', goal);
    
    // Extract JSON from markdown code blocks if present
    const cleanedResponse = extractJSONFromMarkdown(response);
    
    // Parse the JSON response
    let aiData;
    try {
      aiData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON parse error for goal breakdown:', parseError);
      console.error('Response was:', cleanedResponse);
      throw new Error('Invalid JSON response from AI service');
    }
    
    // Validate the response
    if (!aiData || !Array.isArray(aiData.milestones)) {
      throw new Error('Invalid goal breakdown response format');
    }
    
    return {
      ...goal,
      milestones: aiData.milestones || [],
      checkpoints: aiData.checkpoints || [],
      aiAnalysis: aiData.aiAnalysis || {
        strengths: [],
        challenges: [],
        recommendations: []
      },
      progress: 0
    };
  } catch (error) {
    console.error('Error generating goal breakdown:', error);
    // Fallback to basic milestone structure if AI fails
    return generateFallbackGoalBreakdown(goal);
  }
}

// Fallback functions in case AI fails
function generateFallbackLifeSummary(profile: UserProfile): LifeSummary {
  const avgRating = (profile.productivity + profile.health + profile.motivation + profile.mentalHealth + profile.careerDirection) / 5;
  
  return {
    narrative: `You're a ${profile.age}-year-old ${profile.profession} who recognizes the importance of growth and self-improvement. Your awareness of your challenges and strengths shows great self-reflection skills, and you're ready for the next level of personal development.`,
    score: {
      overall: Math.round(avgRating * 10),
      productivity: profile.productivity * 10,
      focus: Math.max(10, Math.round((profile.productivity + profile.motivation) * 5)),
      confidence: Math.max(15, Math.round((profile.mentalHealth + profile.careerDirection) * 5)),
      goalProgress: 20
    },
    insights: [
      "You have strong self-awareness and willingness to grow",
      "Building consistent daily systems will unlock your potential",
      "Your motivation levels show promise for achieving your goals"
    ],
    strengths: [
      "Self-awareness and willingness to grow",
      "Clear communication of goals and challenges",
      "Recognition of personal patterns"
    ],
    improvements: [
      "Implement a daily planning system",
      "Create intentional boundaries around screen time",
      "Develop consistent progress tracking habits"
    ]
  };
}

function generateFallbackGoalBreakdown(goal: Goal): Goal {
  const timeframeMonths = extractMonthsFromTimeframe(goal.timeframe);
  const milestones: Milestone[] = [];
  const checkpoints = [];
  
  for (let i = 0; i < Math.min(timeframeMonths, 4); i++) {
    const milestoneId = `milestone-${i + 1}`;
    milestones.push({
      id: milestoneId,
      title: `${goal.title} - Phase ${i + 1}`,
      description: `Work towards ${goal.title} in month ${i + 1}`,
      month: i + 1,
      tasks: [
        {
          id: `task-${i + 1}-1`,
          title: `Research and plan for ${goal.title}`,
          description: `Gather information and create a plan`,
          completed: false,
          priority: 'high',
          estimatedHours: 2
        },
        {
          id: `task-${i + 1}-2`,
          title: `Take action towards ${goal.title}`,
          description: `Execute planned activities`,
          completed: false,
          priority: 'medium',
          estimatedHours: 4
        }
      ],
      subtasks: [
        {
          id: `subtask-${i + 1}-1-1`,
          title: `Break down research for ${goal.title}`,
          description: `Identify key areas to research`,
          completed: false,
          parentTaskId: `task-${i + 1}-1`
        }
      ],
      timeline: {
        startDate: new Date(new Date().setMonth(new Date().getMonth() + i)).toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + i + 1)).toISOString().split('T')[0],
        keyDates: [
          {
            date: new Date(new Date().setMonth(new Date().getMonth() + i, 15)).toISOString().split('T')[0],
            description: "Mid-month progress check"
          }
        ]
      },
      completed: false
    });
    
    // Add a checkpoint after each milestone
    if (i % 2 === 1) { // Add checkpoint every other milestone
      checkpoints.push({
        id: `checkpoint-${Math.floor(i/2) + 1}`,
        title: `Progress Review ${Math.floor(i/2) + 1}`,
        description: `Evaluate progress after milestone ${i + 1}`,
        targetDate: new Date(new Date().setMonth(new Date().getMonth() + i + 1)).toISOString().split('T')[0],
        achieved: false,
        milestoneId: milestoneId
      });
    }
  }
  
  return {
    ...goal,
    milestones,
    checkpoints,
    aiAnalysis: {
      strengths: ["Your clear goal definition will help with focus"],
      challenges: ["Maintaining consistency may require additional accountability"],
      recommendations: ["Break down each task into smaller steps", "Schedule regular progress reviews"]
    },
    progress: 0
  };
}

function extractMonthsFromTimeframe(timeframe: string): number {
  const months = timeframe.match(/(\d+)\s*month/i);
  const years = timeframe.match(/(\d+)\s*year/i);
  
  if (months) return parseInt(months[1]);
  if (years) return parseInt(years[1]) * 12;
  return 6; // default
}