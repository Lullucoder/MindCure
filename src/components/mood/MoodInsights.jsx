import { Lightbulb, TrendingUp, Target, Heart, Zap, Brain } from 'lucide-react';

const MoodInsights = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-primary-600" />
          Insights
        </h3>
        <div className="text-center py-6">
          <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">
            Track your mood for a few days to unlock personalized insights
          </p>
        </div>
      </div>
    );
  }

  const getInsightIcon = (type) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="h-4 w-4" />;
      case 'recommendation':
        return <Target className="h-4 w-4" />;
      case 'pattern':
        return <Brain className="h-4 w-4" />;
      case 'achievement':
        return <Heart className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'trend':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'recommendation':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pattern':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'achievement':
        return 'text-pink-600 bg-pink-50 border-pink-200';
      default:
        return 'text-primary-600 bg-primary-50 border-primary-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Lightbulb className="h-5 w-5 mr-2 text-primary-600" />
        Personalized Insights
      </h3>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-1 rounded ${getInsightColor(insight.type)} flex-shrink-0`}>
                {getInsightIcon(insight.type)}
              </div>
              
              <div className="flex-1">
                <h4 className={`font-medium text-sm mb-1 ${getInsightColor(insight.type).split(' ')[0]}`}>
                  {insight.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {insight.message}
                </p>
                
                {insight.suggestion && (
                  <div className="mt-2 p-2 bg-white bg-opacity-50 rounded border-l-2 border-current">
                    <p className="text-xs text-gray-700">
                      <strong>Suggestion:</strong> {insight.suggestion}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          💡 Quick Wellness Tips
        </h4>
        
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center p-2 bg-green-50 rounded text-sm">
            <Zap className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
            <span className="text-green-800">Try 5 minutes of deep breathing</span>
          </div>
          
          <div className="flex items-center p-2 bg-blue-50 rounded text-sm">
            <Heart className="h-3 w-3 text-blue-600 mr-2 flex-shrink-0" />
            <span className="text-blue-800">Practice gratitude journaling</span>
          </div>
          
          <div className="flex items-center p-2 bg-purple-50 rounded text-sm">
            <Target className="h-3 w-3 text-purple-600 mr-2 flex-shrink-0" />
            <span className="text-purple-800">Set small, achievable goals</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodInsights;