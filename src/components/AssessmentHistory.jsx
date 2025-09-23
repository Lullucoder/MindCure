import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  Clock, 
  Award,
  AlertCircle,
  CheckCircle,
  Download,
  Share2,
  Filter,
  Eye
} from 'lucide-react';

const AssessmentHistory = ({ onClose }) => {
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('3months');
  const [selectedAssessmentType, setSelectedAssessmentType] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // list or chart

  // Mock assessment history data
  useEffect(() => {
    const mockHistory = [
      {
        id: 1,
        type: 'phq9',
        title: 'Depression Assessment (PHQ-9)',
        score: 8,
        severity: 'Mild',
        date: '2024-01-15',
        recommendations: ['Practice stress management techniques', 'Maintain regular exercise'],
        needsAttention: false
      },
      {
        id: 2,
        type: 'gad7',
        title: 'Anxiety Assessment (GAD-7)',
        score: 12,
        severity: 'Moderate',
        date: '2024-01-10',
        recommendations: ['Consider seeking professional help', 'Practice anxiety management techniques'],
        needsAttention: true
      },
      {
        id: 3,
        type: 'pss10',
        title: 'Stress Level Assessment (PSS-10)',
        score: 18,
        severity: 'Moderate',
        date: '2024-01-05',
        recommendations: ['Implement regular stress reduction activities', 'Practice relaxation techniques'],
        needsAttention: false
      },
      {
        id: 4,
        type: 'phq9',
        title: 'Depression Assessment (PHQ-9)',
        score: 6,
        severity: 'Mild',
        date: '2023-12-20',
        recommendations: ['Continue with healthy lifestyle habits', 'Practice stress management techniques'],
        needsAttention: false
      },
      {
        id: 5,
        type: 'gad7',
        title: 'Anxiety Assessment (GAD-7)',
        score: 9,
        severity: 'Mild',
        date: '2023-12-15',
        recommendations: ['Practice relaxation techniques', 'Limit caffeine'],
        needsAttention: false
      }
    ];
    setAssessmentHistory(mockHistory);
  }, []);

  const assessmentTypes = [
    { value: 'all', label: 'All Assessments' },
    { value: 'phq9', label: 'Depression (PHQ-9)' },
    { value: 'gad7', label: 'Anxiety (GAD-7)' },
    { value: 'pss10', label: 'Stress (PSS-10)' }
  ];

  const timeRanges = [
    { value: '1month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ];

  const filteredHistory = assessmentHistory.filter(assessment => {
    const typeMatch = selectedAssessmentType === 'all' || assessment.type === selectedAssessmentType;
    
    // Simple date filtering - in a real app, you'd implement proper date logic
    let dateMatch = true;
    if (selectedTimeRange !== 'all') {
      const assessmentDate = new Date(assessment.date);
      const now = new Date();
      const monthsBack = selectedTimeRange === '1month' ? 1 : 
                        selectedTimeRange === '3months' ? 3 :
                        selectedTimeRange === '6months' ? 6 : 12;
      const cutoffDate = new Date(now.setMonth(now.getMonth() - monthsBack));
      dateMatch = assessmentDate >= cutoffDate;
    }
    
    return typeMatch && dateMatch;
  });

  const getAssessmentIcon = (type) => {
    switch (type) {
      case 'phq9':
        return '❤️';
      case 'gad7':
        return '🧠';
      case 'pss10':
        return '⚡';
      default:
        return '📊';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'minimal':
      case 'low':
        return 'text-green-600 bg-green-50';
      case 'mild':
        return 'text-yellow-600 bg-yellow-50';
      case 'moderate':
        return 'text-orange-600 bg-orange-50';
      case 'severe':
      case 'high':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const calculateProgress = () => {
    if (filteredHistory.length < 2) return null;
    
    const sorted = [...filteredHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
    const latest = sorted[sorted.length - 1];
    const previous = sorted[sorted.length - 2];
    
    if (latest.type !== previous.type) return null;
    
    const scoreDiff = latest.score - previous.score;
    const isImprovement = scoreDiff < 0; // Lower scores are better for these assessments
    
    return {
      direction: isImprovement ? 'improved' : 'worsened',
      change: Math.abs(scoreDiff),
      percentage: Math.round((Math.abs(scoreDiff) / previous.score) * 100)
    };
  };

  const progress = calculateProgress();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assessment History</h1>
              <p className="text-gray-600">Track your mental health progress over time</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Type</label>
                <select
                  value={selectedAssessmentType}
                  onChange={(e) => setSelectedAssessmentType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {assessmentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {timeRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'
                }`}
              >
                <Eye className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'chart' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        {progress && (
          <div className="p-6 border-b border-gray-200">
            <div className={`p-4 rounded-lg ${progress.direction === 'improved' ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <div className="flex items-center">
                <TrendingUp className={`h-6 w-6 mr-3 ${progress.direction === 'improved' ? 'text-green-600' : 'text-yellow-600'}`} />
                <div>
                  <h3 className={`font-semibold ${progress.direction === 'improved' ? 'text-green-900' : 'text-yellow-900'}`}>
                    Progress Update
                  </h3>
                  <p className={`text-sm ${progress.direction === 'improved' ? 'text-green-700' : 'text-yellow-700'}`}>
                    Your latest assessment shows a {progress.change} point {progress.direction === 'improved' ? 'improvement' : 'increase'} 
                    ({progress.percentage}% change) compared to your previous assessment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assessment History</h3>
              <p className="text-gray-600 mb-6">
                Take your first assessment to start tracking your mental health progress.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Take Assessment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((assessment) => (
                <div key={assessment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="text-2xl">{getAssessmentIcon(assessment.type)}</div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{assessment.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(assessment.severity)}`}>
                            {assessment.severity}
                          </span>
                          {assessment.needsAttention && (
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(assessment.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-1" />
                            Score: {assessment.score}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Key Recommendations:</h4>
                          <ul className="space-y-1">
                            {assessment.recommendations.slice(0, 2).map((rec, index) => (
                              <li key={index} className="flex items-start text-sm text-gray-600">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        View Details
                      </button>
                      <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        Retake
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredHistory.length} assessments
            </div>
            
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors">
                Export Data
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Take New Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentHistory;