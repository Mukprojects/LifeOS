import { UserProfile, LifeSummary, Goal, Milestone, Task } from '../types';

export function generateLifeSummary(profile: UserProfile): LifeSummary {
  const age = profile.age;
  const profession = profile.profession;
  
  // Generate narrative based on user data
  const narratives = [
    `You're a ${age}-year-old ${profession} who recognizes the importance of growth and self-improvement. ${profile.frustrations ? `You're currently facing challenges with ${profile.frustrations.toLowerCase()}, ` : ''}but you've taken the crucial first step by seeking a structured approach to your goals. Your daily routine shows dedication, and your awareness of what you're proud of (${profile.proudHabit.toLowerCase()}) indicates strong self-reflection skills.`,
    
    `At ${age}, you're in a unique position as a ${profession} to make meaningful changes. You spend about ${profile.workHours} hours on work daily and ${profile.socialMediaHours} hours on social media. Your honesty about what you're avoiding (${profile.avoidingWhat.toLowerCase()}) shows courage and self-awareness that many lack. You're ready for the next level.`,
    
    `You're a thoughtful ${age}-year-old ${profession} who understands that growth requires intentional action. Your current habits and routines show promise, especially your pride in ${profile.proudHabit.toLowerCase()}. The fact that you're here, taking time to evaluate and improve your life, already sets you apart from most people your age.`
  ];

  // Calculate scores based on ratings
  const avgRating = (profile.productivity + profile.health + profile.motivation + profile.mentalHealth + profile.careerDirection) / 5;
  const score = {
    overall: Math.round(avgRating * 10),
    productivity: profile.productivity * 10,
    focus: Math.max(10, Math.round((profile.productivity + profile.motivation) * 5)),
    confidence: Math.max(15, Math.round((profile.mentalHealth + profile.careerDirection) * 5)),
    goalProgress: profile.goals.length > 0 ? Math.round(profile.goals.reduce((acc, goal) => acc + goal.progress, 0) / profile.goals.length) : 20
  };

  // Generate insights
  const insights = [
    profile.productivity < 5 ? "You have clarity on what you want, but need a more structured system." : "Your productivity foundation is solid and ready for optimization.",
    profile.socialMediaHours > 3 ? `You're spending ${profile.socialMediaHours}+ hours daily on social media - that's potential time for growth.` : "Your digital habits show good balance and intentionality.",
    profile.motivation < 6 ? "Building consistent daily rituals will unlock your natural motivation." : "Your motivation levels are strong - now we need to channel them effectively."
  ];

  const strengths = [
    "Self-awareness and willingness to grow",
    profile.proudHabit ? `Strong foundation with ${profile.proudHabit.toLowerCase()}` : "Recognition of personal patterns",
    "Clear communication of goals and challenges"
  ];

  const improvements = [
    profile.productivity < 5 ? "Implement a daily planning system" : "Optimize existing productivity systems",
    profile.socialMediaHours > 2 ? "Create intentional boundaries around screen time" : "Maintain healthy digital habits",
    "Develop consistent progress tracking habits"
  ];

  return {
    narrative: narratives[Math.floor(Math.random() * narratives.length)],
    score,
    insights,
    strengths,
    improvements
  };
}

export function generateGoalBreakdown(goal: Goal): Goal {
  const milestones: Milestone[] = [];
  const timeframeMonths = extractMonthsFromTimeframe(goal.timeframe);
  
  // Generate milestones based on goal category and timeframe
  const milestoneTemplates = getMilestoneTemplates(goal.category, goal.title);
  
  for (let i = 0; i < Math.min(timeframeMonths, milestoneTemplates.length); i++) {
    const tasks: Task[] = milestoneTemplates[i].tasks.map((taskTitle, index) => ({
      id: `task-${i}-${index}`,
      title: taskTitle,
      description: `Complete ${taskTitle.toLowerCase()} as part of ${milestoneTemplates[i].title}`,
      completed: false
    }));

    milestones.push({
      id: `milestone-${i}`,
      title: milestoneTemplates[i].title,
      description: milestoneTemplates[i].description,
      month: i + 1,
      tasks,
      completed: false
    });
  }

  return {
    ...goal,
    milestones
  };
}

function extractMonthsFromTimeframe(timeframe: string): number {
  const months = timeframe.match(/(\d+)\s*month/i);
  const years = timeframe.match(/(\d+)\s*year/i);
  
  if (months) return parseInt(months[1]);
  if (years) return parseInt(years[1]) * 12;
  return 6; // default
}

function getMilestoneTemplates(category: string, goalTitle: string) {
  const templates: { [key: string]: Array<{ title: string; description: string; tasks: string[] }> } = {
    career: [
      {
        title: "Skill Assessment & Learning Plan",
        description: "Identify required skills and create a structured learning path",
        tasks: ["Complete skills gap analysis", "Research industry requirements", "Choose 3 primary skills to develop", "Set up learning schedule"]
      },
      {
        title: "Portfolio Development",
        description: "Build a compelling portfolio showcasing your abilities",
        tasks: ["Create 2-3 portfolio projects", "Write compelling project descriptions", "Get feedback from industry professionals", "Optimize for target audience"]
      },
      {
        title: "Network Building",
        description: "Establish valuable professional connections",
        tasks: ["Join relevant professional groups", "Attend 2 networking events", "Connect with 10 industry professionals", "Schedule 3 informational interviews"]
      },
      {
        title: "Job Search Strategy",
        description: "Launch targeted job search and application process",
        tasks: ["Optimize LinkedIn profile", "Apply to 20 relevant positions", "Prepare for common interview questions", "Follow up on applications"]
      }
    ],
    fitness: [
      {
        title: "Foundation Building",
        description: "Establish basic fitness habits and routines",
        tasks: ["Complete fitness assessment", "Set up workout schedule", "Learn proper form for basic exercises", "Track daily activity"]
      },
      {
        title: "Strength Development",
        description: "Build core strength and endurance",
        tasks: ["Increase workout frequency", "Add progressive overload", "Track strength improvements", "Focus on consistency"]
      },
      {
        title: "Advanced Training",
        description: "Implement advanced techniques and specialization",
        tasks: ["Introduce advanced exercises", "Optimize nutrition plan", "Set performance benchmarks", "Consider specialized training"]
      }
    ],
    learning: [
      {
        title: "Learning Foundation",
        description: "Set up effective learning systems and habits",
        tasks: ["Choose primary learning resources", "Create study schedule", "Set up note-taking system", "Establish progress tracking"]
      },
      {
        title: "Deep Dive Phase",
        description: "Intensive learning and skill development",
        tasks: ["Complete core curriculum", "Practice consistently", "Apply knowledge to projects", "Seek feedback and guidance"]
      },
      {
        title: "Mastery & Application",
        description: "Achieve proficiency and practical application",
        tasks: ["Build practical projects", "Teach others what you've learned", "Join relevant communities", "Pursue advanced topics"]
      }
    ],
    default: [
      {
        title: "Planning & Preparation",
        description: "Set up the foundation for achieving your goal",
        tasks: ["Break down goal into specific steps", "Research best practices", "Identify potential obstacles", "Create accountability system"]
      },
      {
        title: "Implementation Phase",
        description: "Execute your plan with consistent action",
        tasks: ["Take daily action toward goal", "Track progress weekly", "Adjust strategy as needed", "Maintain motivation and momentum"]
      },
      {
        title: "Optimization & Growth",
        description: "Refine your approach and accelerate progress",
        tasks: ["Analyze what's working best", "Optimize your processes", "Expand your efforts", "Plan for long-term sustainability"]
      }
    ]
  };

  return templates[category] || templates.default;
}