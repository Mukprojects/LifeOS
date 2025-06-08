import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Subtask } from '../../types';

interface SubtaskListProps {
  subtasks: Subtask[];
  onToggleComplete: (subtaskId: string) => void;
}

const SubtaskList: React.FC<SubtaskListProps> = ({ subtasks, onToggleComplete }) => {
  if (!subtasks || subtasks.length === 0) return null;
  
  return (
    <div className="mt-3 ml-6 border-l-2 border-dashed border-gray-200 pl-4">
      <h5 className="text-sm font-medium text-gray-700 mb-2">Subtasks</h5>
      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
            <button
              onClick={() => onToggleComplete(subtask.id)}
              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                subtask.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              {subtask.completed && <CheckCircle className="h-2 w-2" />}
            </button>
            <div className="flex-1">
              <span className={`text-sm ${subtask.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                {subtask.title}
              </span>
            </div>
            <ArrowRight className="h-3 w-3 text-gray-300" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubtaskList; 