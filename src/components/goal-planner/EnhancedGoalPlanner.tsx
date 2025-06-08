import React, { useState } from 'react';
import { Target, Calendar, Brain, ArrowRight, Flag } from 'lucide-react';
import { Goal } from '../../types';
import MilestoneCard from './MilestoneCard';
import CheckpointCard from './CheckpointCard';
import AIAnalysisPanel from './AIAnalysisPanel';

interface EnhancedGoalPlannerProps {
  goals: Goal[];
  onGoalsUpdate: (goals: Goal[]) => void;
  onContinue: () => void;
}

const EnhancedGoalPlanner: React.FC<EnhancedGoalPlannerProps> = ({ goals, onGoalsUpdate, onContinue }) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(goals[0]?.id || null);
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set());

  const toggleMilestone = (milestoneId: string) => {
    const newExpanded = new Set(expandedMilestones);
    if (newExpanded.has(milestoneId)) {
      newExpanded.delete(milestoneId);
    } else {
      newExpanded.add(milestoneId);
    }
    setExpandedMilestones(newExpanded);
  };

  const toggleTaskComplete = (goalId: string, milestoneId: string, taskId: string) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(milestone => {
          if (milestone.id === milestoneId) {
            const updatedTasks = milestone.tasks.map(task => 
              task.id === taskId ? { ...task, completed: !task.completed } : task
            );
            const completedTasks = updatedTasks.filter(task => task.completed).length;
            const milestoneCompleted = completedTasks === updatedTasks.length;
            
            return {
              ...milestone,
              tasks: updatedTasks,
              completed: milestoneCompleted
            };
          }
          return milestone;
        });

        // Calculate overall goal progress
        const totalTasks = updatedMilestones.reduce((acc, m) => acc + m.tasks.length, 0);
        const completedTasks = updatedMilestones.reduce((acc, m) => 
          acc + m.tasks.filter(t => t.completed).length, 0
        );
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          ...goal,
          milestones: updatedMilestones,
          progress
        };
      }
      return goal;
    });

    onGoalsUpdate(updatedGoals);
  };

  const toggleSubtaskComplete = (goalId: string, milestoneId: string, subtaskId: string) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(milestone => {
          if (milestone.id === milestoneId && milestone.subtasks) {
            const updatedSubtasks = milestone.subtasks.map(subtask => 
              subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
            );
            
            return {
              ...milestone,
              subtasks: updatedSubtasks
            };
          }
          return milestone;
        });

        return {
          ...goal,
          milestones: updatedMilestones
        };
      }
      return goal;
    });

    onGoalsUpdate(updatedGoals);
  };

  const toggleCheckpointComplete = (goalId: string, checkpointId: string) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId && goal.checkpoints) {
        const updatedCheckpoints = goal.checkpoints.map(checkpoint => 
          checkpoint.id === checkpointId ? { ...checkpoint, achieved: !checkpoint.achieved } : checkpoint
        );
        
        return {
          ...goal,
          checkpoints: updatedCheckpoints
        };
      }
      return goal;
    });

    onGoalsUpdate(updatedGoals);
  };

  const selectedGoalData = goals.find(goal => goal.id === selectedGoal);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      career: 'bg-blue-100 text-blue-800',
      fitness: 'bg-green-100 text-green-800',
      learning: 'bg-purple-100 text-purple-800',
      finance: 'bg-yellow-100 text-yellow-800',
      relationships: 'bg-pink-100 text-pink-800',
      creative: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your AI-Generated Roadmap</h1>
          <p className="text-gray-600">DeepSeek AI has created personalized action plans for each of your goals</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Goals Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Goals</h2>
              <div className="space-y-3">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedGoal === goal.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{goal.title}</h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(goal.category)}`}>
                          {goal.category}
                        </span>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                            <span>AI Progress</span>
                            <span>{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Goal Details */}
          <div className="lg:col-span-2">
            {selectedGoalData ? (
              <div className="space-y-6">
                {/* Goal Header */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedGoalData.title}</h2>
                      <p className="text-gray-600 mb-4">{selectedGoalData.description}</p>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedGoalData.category)}`}>
                          {selectedGoalData.category}
                        </span>
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {selectedGoalData.timeframe}
                        </span>
                        <span className="text-sm text-blue-600 flex items-center gap-1">
                          <Brain className="h-4 w-4" />
                          AI Generated
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">{selectedGoalData.progress}%</div>
                      <div className="text-sm text-gray-600">Complete</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${selectedGoalData.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* AI Analysis */}
                {selectedGoalData.aiAnalysis && (
                  <AIAnalysisPanel 
                    strengths={selectedGoalData.aiAnalysis.strengths || []}
                    challenges={selectedGoalData.aiAnalysis.challenges || []}
                    recommendations={selectedGoalData.aiAnalysis.recommendations || []}
                  />
                )}

                {/* Checkpoints */}
                {selectedGoalData.checkpoints && selectedGoalData.checkpoints.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Flag className="h-5 w-5 text-purple-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Progress Checkpoints</h3>
                    </div>
                    <div className="space-y-3">
                      {selectedGoalData.checkpoints.map((checkpoint) => (
                        <CheckpointCard 
                          key={checkpoint.id}
                          checkpoint={checkpoint}
                          onToggleComplete={(checkpointId) => toggleCheckpointComplete(selectedGoalData.id, checkpointId)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Milestones */}
                <div className="space-y-4">
                  {selectedGoalData.milestones.map((milestone, index) => (
                    <MilestoneCard
                      key={milestone.id}
                      milestone={milestone}
                      index={index}
                      goalId={selectedGoalData.id}
                      onToggleTaskComplete={toggleTaskComplete}
                      onToggleSubtaskComplete={(subtaskId) => toggleSubtaskComplete(selectedGoalData.id, milestone.id, subtaskId)}
                      expanded={expandedMilestones.has(milestone.id)}
                      onToggleExpand={() => toggleMilestone(milestone.id)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Goal</h3>
                <p className="text-gray-600">Choose a goal from the sidebar to see your AI-generated action plan.</p>
              </div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onContinue}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 mx-auto"
          >
            Go to Dashboard
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedGoalPlanner; 