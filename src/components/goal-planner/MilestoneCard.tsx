import React, { useState } from 'react';
import { CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Milestone, Subtask } from '../../types';
import TaskCard from './TaskCard';
import TimelineView from './TimelineView';

interface MilestoneCardProps {
  milestone: Milestone;
  index: number;
  goalId: string;
  onToggleTaskComplete: (goalId: string, milestoneId: string, taskId: string) => void;
  onToggleSubtaskComplete: (subtaskId: string) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  index,
  goalId,
  onToggleTaskComplete,
  onToggleSubtaskComplete,
  expanded,
  onToggleExpand
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <button
        onClick={onToggleExpand}
        className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              milestone.completed 
                ? 'bg-green-100 text-green-600' 
                : 'bg-blue-100 text-blue-600'
            }`}>
              {milestone.completed ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span className="font-semibold">{index + 1}</span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
              <p className="text-gray-600">Month {milestone.month} • AI Generated</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">
                {milestone.tasks.filter(t => t.completed).length} / {milestone.tasks.length} tasks
              </div>
              <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${milestone.tasks.length > 0 ? 
                      (milestone.tasks.filter(t => t.completed).length / milestone.tasks.length) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
            {expanded ? (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </button>
      
      {expanded && (
        <div className="px-6 pb-6">
          <p className="text-gray-600 mb-4">{milestone.description}</p>
          
          {/* Timeline if available */}
          {milestone.timeline && (
            <TimelineView timeline={milestone.timeline} />
          )}
          
          {/* Tasks with subtasks */}
          <div className="mt-4 space-y-3">
            {milestone.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                milestoneId={milestone.id}
                goalId={goalId}
                onToggleComplete={onToggleTaskComplete}
                onToggleSubtaskComplete={onToggleSubtaskComplete}
                subtasks={milestone.subtasks || []}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneCard; 