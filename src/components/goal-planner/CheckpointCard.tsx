import React from 'react';
import { Flag, Calendar, CheckCircle } from 'lucide-react';
import { Checkpoint } from '../../types';

interface CheckpointCardProps {
  checkpoint: Checkpoint;
  onToggleComplete: (checkpointId: string) => void;
}

const CheckpointCard: React.FC<CheckpointCardProps> = ({ checkpoint, onToggleComplete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${checkpoint.achieved ? 'bg-green-100' : 'bg-purple-100'}`}>
            {checkpoint.achieved ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Flag className="h-5 w-5 text-purple-600" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{checkpoint.title}</h4>
            <p className="text-sm text-gray-600">{checkpoint.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">Target: {new Date(checkpoint.targetDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onToggleComplete(checkpoint.id)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            checkpoint.achieved
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {checkpoint.achieved ? 'Completed' : 'Mark Complete'}
        </button>
      </div>
    </div>
  );
};

export default CheckpointCard; 