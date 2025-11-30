import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const MoodChart = ({ entries, period }) => {
  const [chartType, setChartType] = useState('line'); // line, area

  const chartData = useMemo(() => {
    if (!entries || entries.length === 0) return [];

    // Sort entries by date
    const sortedEntries = [...entries].sort((a, b) => {
      const dateA = new Date(a.timestamp.toDate ? a.timestamp.toDate() : a.timestamp);
      const dateB = new Date(b.timestamp.toDate ? b.timestamp.toDate() : b.timestamp);
      return dateA - dateB;
    });

    // Group entries by date and calculate averages
    const grouped = {};
    
    sortedEntries.forEach(entry => {
      const date = new Date(entry.timestamp.toDate ? entry.timestamp.toDate() : entry.timestamp);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          displayDate: date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          fullDate: date,
          entries: [],
          mood: 0,
          energy: 0,
          anxiety: 0,
          sleep: 0,
          wellness: 0
        };
      }
      
      grouped[dateKey].entries.push(entry);
    });

    // Calculate averages for each date
    const processedData = Object.values(grouped).map(day => {
      const avgMood = day.entries.reduce((sum, entry) => sum + entry.mood, 0) / day.entries.length;
      const avgEnergy = day.entries.reduce((sum, entry) => sum + (entry.energy || 3), 0) / day.entries.length;
      const avgAnxiety = day.entries.reduce((sum, entry) => sum + (entry.anxiety || 3), 0) / day.entries.length;
      const avgSleep = day.entries.reduce((sum, entry) => sum + (entry.sleep || 3), 0) / day.entries.length;
      
      // Calculate wellness score (inverse anxiety for positive correlation)
      const wellness = (avgMood + avgEnergy + (6 - avgAnxiety) + avgSleep) / 4;
      
      return {
        ...day,
        mood: Number(avgMood.toFixed(1)),
        energy: Number(avgEnergy.toFixed(1)),
        anxiety: Number(avgAnxiety.toFixed(1)),
        sleep: Number(avgSleep.toFixed(1)),
        wellness: Number(wellness.toFixed(1))
      };
    });

    // Filter data based on period
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (period) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case 'quarter':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      default:
        cutoffDate.setDate(now.getDate() - 7);
    }

    return processedData
      .filter(day => day.fullDate >= cutoffDate)
      .slice(-30); // Limit to last 30 data points for performance
  }, [entries, period]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{data.displayDate}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600">Mood:</span>
              <span className="text-sm font-medium">{data.mood}/5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-orange-600">Energy:</span>
              <span className="text-sm font-medium">{data.energy}/5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-red-600">Anxiety:</span>
              <span className="text-sm font-medium">{data.anxiety}/5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{color: 'var(--primary-600)'}}>Sleep:</span>
              <span className="text-sm font-medium">{data.sleep}/5</span>
            </div>
            <div className="border-t pt-1 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 font-medium">Wellness:</span>
                <span className="text-sm font-bold text-green-600">{data.wellness}/5</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No mood data yet</h3>
          <p className="text-gray-600">Start tracking your mood to see trends and insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart Type Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Mood</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Energy</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Anxiety</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'var(--primary-500)'}}></div>
            <span>Sleep</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Wellness</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded text-sm ${
              chartType === 'line' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1 rounded text-sm ${
              chartType === 'area' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Area
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="displayDate" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                domain={[1, 5]}
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="energy" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="anxiety" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="sleep" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="wellness" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: '#10b981', strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="displayDate" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                domain={[1, 5]}
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Area 
                type="monotone" 
                dataKey="mood" 
                stackId="1"
                stroke="#3b82f6" 
                fill="#3b82f6"
                fillOpacity={0.1}
              />
              <Area 
                type="monotone" 
                dataKey="wellness" 
                stackId="2"
                stroke="#10b981" 
                fill="#10b981"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-gray-100">
        {chartData.length > 0 && (
          <>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {(chartData.reduce((sum, day) => sum + day.mood, 0) / chartData.length).toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Avg Mood</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {(chartData.reduce((sum, day) => sum + day.energy, 0) / chartData.length).toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Avg Energy</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">
                {(chartData.reduce((sum, day) => sum + day.anxiety, 0) / chartData.length).toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Avg Anxiety</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold" style={{color: 'var(--primary-600)'}}>
                {(chartData.reduce((sum, day) => sum + day.sleep, 0) / chartData.length).toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Avg Sleep</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {(chartData.reduce((sum, day) => sum + day.wellness, 0) / chartData.length).toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Avg Wellness</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MoodChart;