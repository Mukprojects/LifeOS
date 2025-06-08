import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';
import { OpenAI } from 'https://esm.sh/openai@4.28.0';

interface RequestPayload {
  userId: string;
  goals?: any[];
  lifeScore?: any;
  userProfile?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, goals, lifeScore, userProfile } = await req.json() as RequestPayload;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required userId parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    // Fetch user's goals if not provided
    let userGoals = goals;
    let userLifeScore = lifeScore;
    let profile = userProfile;

    if (!userGoals || !userLifeScore || !profile) {
      // Fetch goals
      const { data: goalsData, error: goalsError } = await supabaseClient
        .from('goals')
        .select('*')
        .eq('user_id', userId);

      if (goalsError) throw goalsError;
      userGoals = goalsData;

      // Fetch life score
      const { data: scoreData, error: scoreError } = await supabaseClient
        .from('life_scores')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (scoreError) throw scoreError;
      userLifeScore = scoreData?.[0] || null;

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      profile = profileData;
    }

    // Generate book recommendations using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `You are a personalized book recommendation assistant that provides tailored book suggestions based on a user's goals, life score, and profile information. 
          
          Your task is to recommend 5-10 books that would help the user achieve their goals and improve their life. 
          
          For each book, provide:
          - Title
          - Author
          - Brief description (2-3 sentences)
          - Why it's relevant to their specific goals
          - A category (e.g., "Personal Growth", "Productivity", "Relationships", etc.)
          - 2-3 relevant tags
          
          Also include a personalized note explaining your recommendations.
          
          Format your response as a JSON object with the following structure:
          {
            "books": [
              {
                "id": "unique-id-1", 
                "title": "Book Title",
                "author": "Author Name",
                "description": "Brief description of the book",
                "coverUrl": "", 
                "amazonUrl": "",
                "category": "Category",
                "relevantGoals": ["Goal 1", "Goal 2"],
                "tags": ["tag1", "tag2", "tag3"],
                "rating": 4.5
              }
            ],
            "personalizedNote": "A personalized note explaining the recommendations",
            "lastUpdated": "current date in ISO format"
          }`
        },
        {
          role: "user",
          content: `Please provide book recommendations based on the following user data:
          
          Goals: ${JSON.stringify(userGoals)}
          Life Score: ${JSON.stringify(userLifeScore)}
          Profile: ${JSON.stringify(profile)}
          
          Return only the JSON response with book recommendations.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const recommendations = JSON.parse(response.choices[0].message.content);
    
    // Save recommendations to database
    const { data: existingResource, error: fetchError } = await supabaseClient
      .from('resources')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existingResource) {
      // Update existing record
      const { error: updateError } = await supabaseClient
        .from('resources')
        .update({ 
          resources_data: recommendations,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;
    } else {
      // Insert new record
      const { error: insertError } = await supabaseClient
        .from('resources')
        .insert({ 
          user_id: userId,
          resources_data: recommendations
        });

      if (insertError) throw insertError;
    }

    return new Response(
      JSON.stringify(recommendations),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 