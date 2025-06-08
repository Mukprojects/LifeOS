import { createClient } from '@supabase/supabase-js';
import { Goal, ResourcesData } from '../types';

const supabaseUrl = "https://dzhhwnsewoptxwvgjwqd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6aGh3bnNld29wdHh3dmdqd3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMTU4MzAsImV4cCI6MjA2NDg5MTgzMH0.cN-EBcsB4RoyjiAXP4AGIkA7C_SyRDkBOooR1638RD8";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to enhance goals with the new structure
export async function enhanceGoalStructure(goals: Goal[]): Promise<Goal[]> {
  return goals.map(goal => {
    // Add checkpoints if they don't exist
    if (!goal.checkpoints) {
      goal.checkpoints = goal.milestones
        .filter((_, index) => index % 2 === 1) // Create checkpoint every other milestone
        .map((milestone, index) => ({
          id: `checkpoint-${index + 1}`,
          title: `Progress Review ${index + 1}`,
          description: `Evaluate progress after milestone ${milestone.title}`,
          targetDate: new Date(new Date().setMonth(new Date().getMonth() + milestone.month)).toISOString().split('T')[0],
          achieved: false,
          milestoneId: milestone.id
        }));
    }

    // Add AI analysis if it doesn't exist
    if (!goal.aiAnalysis) {
      goal.aiAnalysis = {
        strengths: [
          "Clear goal definition helps with focus",
          `Your experience in ${goal.category} will be valuable`
        ],
        challenges: [
          "Maintaining consistency may require additional accountability",
          "Time management will be critical for success"
        ],
        recommendations: [
          "Break down each task into smaller steps",
          "Schedule regular progress reviews",
          "Find an accountability partner for this goal"
        ]
      };
    }

    // Enhance milestones with subtasks and timeline
    goal.milestones = goal.milestones.map(milestone => {
      // Add subtasks if they don't exist
      if (!milestone.subtasks) {
        milestone.subtasks = milestone.tasks.flatMap(task => {
          // Create 2 subtasks for each task
          return [
            {
              id: `subtask-${task.id}-1`,
              title: `Prepare for ${task.title}`,
              description: `Gather resources and plan for ${task.title}`,
              completed: false,
              parentTaskId: task.id
            },
            {
              id: `subtask-${task.id}-2`,
              title: `Review ${task.title}`,
              description: `Evaluate results of ${task.title}`,
              completed: false,
              parentTaskId: task.id
            }
          ];
        });
      }

      // Add timeline if it doesn't exist
      if (!milestone.timeline) {
        const monthOffset = milestone.month - 1;
        const startDate = new Date(new Date().setMonth(new Date().getMonth() + monthOffset));
        const endDate = new Date(new Date().setMonth(startDate.getMonth() + 1));
        const midDate = new Date(new Date().setMonth(startDate.getMonth(), startDate.getDate() + 15));
        
        milestone.timeline = {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          keyDates: [
            {
              date: midDate.toISOString().split('T')[0],
              description: "Mid-milestone progress check"
            }
          ]
        };
      }

      // Add priority and estimated hours to tasks if they don't exist
      milestone.tasks = milestone.tasks.map((task, index) => {
        return {
          ...task,
          priority: task.priority || (index === 0 ? 'high' : index === 1 ? 'medium' : 'low'),
          estimatedHours: task.estimatedHours || Math.floor(Math.random() * 5) + 1,
          resources: task.resources || [
            `https://example.com/resources/${goal.category.toLowerCase()}`,
            `Book: ${goal.category} Mastery Guide`
          ]
        };
      });

      return milestone;
    });

    return goal;
  });
}

// Resources functions
export const getResourcesData = async (userId: string): Promise<ResourcesData | null> => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('resources_data')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching resources data:', error);
      return null;
    }

    return data?.resources_data as ResourcesData || null;
  } catch (error) {
    console.error('Error in getResourcesData:', error);
    return null;
  }
};

export const generateBookRecommendations = async (userId: string): Promise<ResourcesData | null> => {
  try {
    console.log('Generating book recommendations for user:', userId);
    
    // Get the current session to ensure we're authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('User not authenticated for book recommendations');
      throw new Error('User not authenticated');
    }

    // Try to call the edge function
    const { data, error } = await supabase.functions.invoke('ai-book-recommendations', {
      body: { userId },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }

    if (data) {
      console.log('Successfully generated book recommendations');
      return data as ResourcesData;
    }

    throw new Error('No data returned from edge function');
  } catch (error) {
    console.error('Error generating book recommendations:', error);
    
    // Fallback with mock data if edge function fails
    console.log('Using fallback mock book recommendations data');
    const mockData: ResourcesData = {
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
        }
      ],
      personalizedNote: "Based on your goals and profile, I've selected these books to help you build better habits, improve productivity, enhance focus, and develop both personally and professionally. These resources target common challenges like procrastination and low motivation while providing practical strategies for achieving your objectives.",
      lastUpdated: new Date().toISOString()
    };

    // Try to save mock data to database
    try {
      const { error: saveError } = await supabase
        .from('resources')
        .upsert({ 
          user_id: userId,
          resources_data: mockData,
          updated_at: new Date().toISOString()
        });

      if (saveError) {
        console.error('Error saving fallback data:', saveError);
      } else {
        console.log('Successfully saved fallback book recommendations');
      }
    } catch (saveError) {
      console.error('Error saving fallback data:', saveError);
    }
    
    return mockData;
  }
};