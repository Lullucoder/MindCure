import { TrendingUp, TrendingDown, Calendar, Target, Zap, Heart } from 'lucide-react';

const MoodStats = ({ stats }) => {
  if (!stats) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Mood Statistics
        </h3>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No data available yet</p>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'declining':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getMoodColor = (mood) => {
    if (mood >= 4) return 'text-green-600';
    if (mood >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Heart className="h-5 w-5 mr-2 text-primary-600" />
        Mood Statistics
      </h3>

      <div className="space-y-6">
        {/* Average Mood */}
        <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
          <div className="flex items-center">
            <div className="text-2xl mr-3">
              {stats.averageMood >= 4 ? '😊' : stats.averageMood >= 3 ? '😐' : '😞'}
            </div>
            <div>
              <div className="text-sm text-gray-600">Average Mood</div>
              <div className={`text-lg font-bold ${getMoodColor(stats.averageMood)}`}>
                {stats.averageMood.toFixed(1)}/5
              </div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full border text-sm ${getTrendColor(stats.moodTrend)}`}>
            <div className="flex items-center space-x-1">
              {getTrendIcon(stats.moodTrend)}
              <span className="capitalize">{stats.moodTrend}</span>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <Zap className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-orange-600">
              {stats.averageEnergy.toFixed(1)}
            </div>
            <div className="text-xs text-gray-600">Avg Energy</div>
          </div>

          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-blue-600">
              {stats.totalEntries}
            </div>
            <div className="text-xs text-gray-600">Total Entries</div>
          </div>
        </div>

        {/* Streak Information */}
        {stats.currentStreak > 0 && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-800 font-medium">Current Streak</div>
                <div className="text-xs text-green-600">Keep it up!</div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {stats.currentStreak} 🔥
              </div>
            </div>
          </div>
        )}

        {/* Best/Worst Days */}
        {(stats.bestDay || stats.worstDay) && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Recent Highlights</h4>
            
            {stats.bestDay && (
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <div className="flex items-center">
                  <span className="text-lg mr-2">😊</span>
                  <div>
                    <div className="text-xs text-green-800">Best Day</div>
                    <div className="text-xs text-green-600">
                      {new Date(stats.bestDay.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-green-600">
                  {stats.bestDay.mood}/5
                </div>
              </div>
            )}

            {stats.worstDay && (
              <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                <div className="flex items-center">
                  <span className="text-lg mr-2">😞</span>
                  <div>
                    <div className="text-xs text-red-800">Challenging Day</div>
                    <div className="text-xs text-red-600">
                      {new Date(stats.worstDay.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-red-600">
                  {stats.worstDay.mood}/5
                </div>
              </div>
            )}
          </div>
        )}

        {/* Most Common Tags */}
        {stats.commonTags && stats.commonTags.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Top Influences</h4>
            <div className="flex flex-wrap gap-1">
              {stats.commonTags.slice(0, 6).map((tag, index) => (
                <span
                  key={tag}
                  className={`px-2 py-1 text-xs rounded-full ${
                    index === 0 
                      ? 'bg-primary-100 text-primary-800 font-medium' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodStats;