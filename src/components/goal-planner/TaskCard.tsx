import React, { useState } from 'react';
import { CheckCircle, Clock, Link, ArrowDown, ArrowRight, AlertCircle } from 'lucide-react';
import { Task } from '../../types';
import SubtaskList from './SubtaskList';

interface TaskCardProps {
  task: Task;
  milestoneId: string;
  goalId: string;
  onToggleComplete: (goalId: string, milestoneId: string, taskId: string) => void;
  onToggleSubtaskComplete?: (subtaskId: string) => void;
  subtasks?: any[]; // Using any[] since subtasks are optional in our data model
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  milestoneId, 
  goalId, 
  onToggleComplete,
  onToggleSubtaskComplete,
  subtasks = []
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const getPriorityColor = (priority: string = 'medium') => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-amber-100 text-amber-700',
      low: 'bg-green-100 text-green-700'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getPriorityIcon = (priority: string = 'medium') => {
    if (priority === 'high') return <AlertCircle className="h-3 w-3" />;
    if (priority === 'low') return <ArrowDown className="h-3 w-3" />;
    return null;
  };

  const filteredSubtasks = subtasks.filter(subtask => subtask.parentTaskId === task.id);
  const hasDetails = task.estimatedHours || task.resources?.length > 0 || filteredSubtasks.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleComplete(goalId, milestoneId, task.id)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              task.completed
                ? 'bg-green-600 border-green-600 text-white'
                : 'border-gray-300 hover:border-green-400'
            }`}
          >
            {task.completed && <CheckCircle className="h-3 w-3" />}
          </button>
          <div className="flex-1">
            <h4 className={`font-medium ${
              task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>
              {task.title}
            </h4>
            <p className="text-sm text-gray-600">{task.description}</p>
            
            {/* Task metadata */}
            <div className="flex flex-wrap gap-2 mt-2">
              {task.priority && (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {getPriorityIcon(task.priority)}
                  {task.priority} priority
                </span>
              )}
              
              {task.estimatedHours && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                  <Clock className="h-3 w-3" />
                  {task.estimatedHours}h
                </span>
              )}
              
              {task.dueDate && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          
          {hasDetails && (
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-gray-400 hover:text-gray-600"
            >
              {expanded ? <ArrowDown className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 pt-0">
          {/* Resources */}
          {task.resources && task.resources.length > 0 && (
            <div className="mb-3">
              <h5 className="text-xs font-medium text-gray-700 mb-1">Resources</h5>
              <div className="space-y-1">
                {task.resources.map((resource, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Link className="h-3 w-3 text-blue-500" />
                    <a 
                      href={resource.startsWith('http') ? resource : '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline truncate"
                    >
                      {resource}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Subtasks */}
          {filteredSubtasks.length > 0 && (
            <SubtaskList 
              subtasks={filteredSubtasks} 
              onToggleComplete={onToggleSubtaskComplete || (() => {})}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard; 