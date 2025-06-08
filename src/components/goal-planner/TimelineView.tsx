import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Timeline } from '../../types';

interface TimelineViewProps {
  timeline: Timeline;
}

const TimelineView: React.FC<TimelineViewProps> = ({ timeline }) => {
  if (!timeline) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateDuration = () => {
    const start = new Date(timeline.startDate);
    const end = new Date(timeline.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else {
      const months = Math.round(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    }
  };

  return (
    <div className="mt-4 bg-gray-50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Timeline</span>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {calculateDuration()}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span>Start: {formatDate(timeline.startDate)}</span>
        <span>End: {formatDate(timeline.endDate)}</span>
      </div>
      
      <div className="relative h-2 bg-gray-200 rounded-full mb-3">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '50%' }}></div>
      </div>
      
      {timeline.keyDates && timeline.keyDates.length > 0 && (
        <div className="mt-3">
          <h6 className="text-xs font-medium text-gray-700 mb-2">Key Dates</h6>
          <div className="space-y-2">
            {timeline.keyDates.map((keyDate, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-xs font-medium text-gray-700">{formatDate(keyDate.date)}</span>
                <span className="text-xs text-gray-500">- {keyDate.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineView; 