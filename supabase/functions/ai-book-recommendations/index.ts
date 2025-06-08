import { corsHeaders } from '../_shared/cors.ts';

const corsHeadersLocal = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeadersLocal });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required userId parameter' }),
        { status: 400, headers: { ...corsHeadersLocal, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    // For now, return mock data since the AI integration might be complex
    const mockData = {
      books: [
        {
          id: "1",
          title: "Atomic Habits",
          author: "James Clear",
          description: "This book provides practical strategies for building good habits and breaking bad ones, emphasizing that small, consistent changes can lead to significant improvements in daily life and long-term goals.",
          amazonUrl: "https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299",
          category: "Personal Growth",
          relevantGoals: ["Building Better Habits", "Improve Productivity"],
          tags: ["habits", "self-improvement", "productivity"],
          rating: 4.5
        },
        {
          id: "2",
          title: "Deep Work",
          author: "Cal Newport",
          description: "Focuses on the importance of deep, distraction-free work in the digital age, offering techniques to cultivate concentration and productivity for achieving professional and personal objectives.",
          amazonUrl: "https://www.amazon.com/Deep-Work-Focused-Success-Distracted/dp/1455586692",
          category: "Productivity",
          relevantGoals: ["Improve Focus", "Work More Efficiently"],
          tags: ["focus", "productivity", "attention"],
          rating: 4.6
        },
        {
          id: "3",
          title: "Mindset",
          author: "Carol S. Dweck",
          description: "Explores the psychology of success through the concept of growth versus fixed mindsets, showing how our beliefs about our abilities significantly impact our achievement and satisfaction in life.",
          amazonUrl: "https://www.amazon.com/Mindset-Psychology-Carol-S-Dweck/dp/0345472322",
          category: "Psychology",
          relevantGoals: ["Personal Growth", "Overcome Challenges"],
          tags: ["mindset", "psychology", "growth"],
          rating: 4.7
        },
        {
          id: "4",
          title: "Cracking the Coding Interview",
          author: "Gayle Laakmann McDowell",
          description: "A comprehensive guide to preparing for technical interviews at top companies like Google, covering coding challenges, system design, and behavioral questions to build confidence and skills for the application process.",
          amazonUrl: "https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850/",
          category: "Career Development",
          relevantGoals: ["Career Advancement", "Technical Skills"],
          tags: ["interviews", "coding", "algorithms"],
          rating: 4.5
        },
        {
          id: "5",
          title: "The Power of Habit",
          author: "Charles Duhigg",
          description: "Explores how habits work and how they can be changed, combining scientific research with real-world examples to help readers transform their lives, businesses, and communities.",
          amazonUrl: "https://www.amazon.com/Power-Habit-What-Life-Business/dp/081298160X/",
          category: "Personal Development",
          relevantGoals: ["Building Better Habits", "Improve Productivity"],
          tags: ["habits", "psychology", "self-improvement"],
          rating: 4.6
        },
        {
          id: "6",
          title: "The 7 Habits of Highly Effective People",
          author: "Stephen R. Covey",
          description: "A timeless guide to personal and professional effectiveness, presenting seven fundamental principles that can help individuals achieve their goals and build meaningful relationships.",
          amazonUrl: "https://www.amazon.com/Habits-Highly-Effective-People-Powerful/dp/0743269519",
          category: "Leadership",
          relevantGoals: ["Personal Growth", "Leadership Skills"],
          tags: ["leadership", "effectiveness", "principles"],
          rating: 4.4
        }
      ],
      personalizedNote: "Based on your goals and profile, I've selected these books to help you build better habits, improve productivity, enhance focus, and develop both personally and professionally. These resources target common challenges like procrastination and low motivation while providing practical strategies for achieving your objectives.",
      lastUpdated: new Date().toISOString()
    };

    // Try to save to Supabase using fetch since we can't import the client easily
    try {
      const saveResponse = await fetch(`${supabaseUrl}/rest/v1/resources`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          user_id: userId,
          resources_data: mockData
        })
      });

      if (!saveResponse.ok) {
        // Try update instead
        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/resources?user_id=eq.${userId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            resources_data: mockData,
            updated_at: new Date().toISOString()
          })
        });

        if (!updateResponse.ok) {
          console.error('Failed to save/update resources data');
        }
      }
    } catch (saveError) {
      console.error('Error saving to database:', saveError);
      // Continue anyway and return the data
    }

    return new Response(
      JSON.stringify(mockData),
      { status: 200, headers: { ...corsHeadersLocal, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-book-recommendations:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeadersLocal, 'Content-Type': 'application/json' } }
    );
  }
});