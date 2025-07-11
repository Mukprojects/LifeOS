import React from 'react';
import { ArrowRight, TrendingUp, Star, Lightbulb, Target, CheckCircle, Brain } from 'lucide-react';
import { LifeSummary as LifeSummaryType } from '../types';

interface LifeSummaryProps {
  summary: LifeSummaryType;
  onContinue: () => void;
}

const LifeSummary: React.FC<LifeSummaryProps> = ({ summary, onContinue }) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 70) return 'bg-green-600';
    if (score >= 50) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your AI Life Analysis</h1>
          <p className="text-gray-600">Generated by DeepSeek AI based on your personal profile</p>
        </div>

        <div className="space-y-8">
          {/* Life Narrative */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-600" />
              Your Story
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
              <p className="text-gray-700 leading-relaxed text-lg">{summary.narrative}</p>
            </div>
          </div>

          {/* Life Scores */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Life Score Analysis</h2>
            
            {/* Overall Score */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Overall Life Score</h3>
                  <p className="text-blue-100">Your current life effectiveness rating</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{summary.score.overall}</div>
                  <div className="text-sm text-blue-100">out of 100</div>
                </div>
              </div>
            </div>

            {/* Individual Scores */}
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { label: 'Productivity', score: summary.score.productivity },
                { label: 'Focus', score: summary.score.focus },
                { label: 'Confidence', score: summary.score.confidence },
                { label: 'Goal Progress', score: summary.score.goalProgress }
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{item.label}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(item.score)}`}>
                      {item.score}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${getScoreBarColor(item.score)}`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-yellow-600" />
              AI Insights
            </h2>
            <div className="space-y-4">
              {summary.insights.map((insight, index) => (
                <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <p className="text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Areas for Improvement */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Strengths */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Your Strengths
              </h2>
              <div className="space-y-3">
                {summary.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-green-100 p-1 rounded-full mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-gray-700">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                Growth Opportunities
              </h2>
              <div className="space-y-3">
                {summary.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-blue-100 p-1 rounded-full mt-1">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-gray-700">{improvement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Build Your AI-Powered Action Plan?</h2>
            <p className="text-blue-100 mb-6">
              Now that AI has analyzed your situation, let's create a personalized roadmap to achieve your goals.
            </p>
            <button
              onClick={onContinue}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200 flex items-center gap-2 mx-auto"
            >
              See My AI-Generated Plan
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeSummary;