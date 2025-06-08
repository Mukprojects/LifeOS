import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

interface AIAnalysisPanelProps {
  strengths: string[];
  challenges: string[];
  recommendations: string[];
}

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ strengths, challenges, recommendations }) => {
  if (!strengths?.length && !challenges?.length && !recommendations?.length) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-blue-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="bg-blue-100 p-1 rounded">
          <Lightbulb className="h-5 w-5 text-blue-600" />
        </span>
        AI Analysis
      </h3>

      <div className="space-y-4">
        {strengths?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Strengths
            </h4>
            <ul className="list-disc list-inside space-y-1">
              {strengths.map((strength, index) => (
                <li key={index} className="text-sm text-gray-600">{strength}</li>
              ))}
            </ul>
          </div>
        )}

        {challenges?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Potential Challenges
            </h4>
            <ul className="list-disc list-inside space-y-1">
              {challenges.map((challenge, index) => (
                <li key={index} className="text-sm text-gray-600">{challenge}</li>
              ))}
            </ul>
          </div>
        )}

        {recommendations?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Strategic Recommendations</h4>
            <ul className="list-disc list-inside space-y-1">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-gray-600">{recommendation}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysisPanel; 