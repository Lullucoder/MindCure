import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AssessmentHistory from '../components/AssessmentHistory';
import { 
  MessageCircle, 
  BarChart3, 
  BookOpen, 
  Phone, 
  Heart,
  TrendingUp,
  Calendar,
  AlertCircle,
  Smile,
  Meh,
  Frown,
  ClipboardList,
  Users,
  Brain,
  Shield,
  Clock,
  ArrowRight,
  Sparkles,
  Target,
  Award
} from 'lucide-react';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const [recentMoods, setRecentMoods] = useState([]);
  const [showAssessmentHistory, setShowAssessmentHistory] = useState(false);
  const [weeklyStats, setWeeklyStats] = useState({
    averageMood: 3.5,
    totalEntries: 12,
    streak: 5
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockMoods = [
      { date: '2025-09-23', mood: 4, note: 'Feeling good after morning walk' },
      { date: '2025-09-22', mood: 3, note: 'Okay day, bit tired' },
      { date: '2025-09-21', mood: 5, note: 'Great day! Finished project' },
      { date: '2025-09-20', mood: 2, note: 'Stressed about exams' },
    ];
    setRecentMoods(mockMoods);
  }, []);

  const quickActions = [
    {
      title: 'Virtual Counseling',
      description: 'Book a session with professional counselors',
      icon: MessageCircle,
      link: '/chat',
      gradient: 'from-teal-400 to-teal-600',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600'
    },
    {
      title: 'Self-Help Library',
      description: 'Access mindfulness and stress resources',
      icon: BookOpen,
      link: '/resources',
      gradient: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Peer Support Groups',
      description: 'Connect with others in safe forums',
      icon: Users,
      link: '/mood',
      gradient: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Crisis Support',
      description: 'Get immediate help when you need it',
      icon: Phone,
      link: '/crisis',
      gradient: 'from-red-400 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    }
  ];

  const getMoodIcon = (mood) => {
    if (mood >= 4) return <Smile className="h-5 w-5 text-green-500" />;
    if (mood >= 3) return <Meh className="h-5 w-5 text-yellow-500" />;
    return <Frown className="h-5 w-5 text-red-500" />;
  };

  const getMoodColor = (mood) => {
    if (mood >= 4) return 'text-green-600';
    if (mood >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome back, {userProfile?.firstName || 'Demo User'}! 
            </h1>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Your mental wellness journey continues. How are you feeling today?
            </p>
            
            {/* Quick mood check */}
            <div className="flex justify-center space-x-4 mb-8">
              <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl px-6 py-4 hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2">
                <Smile className="h-6 w-6" />
                <span className="font-medium">Great</span>
              </button>
              <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl px-6 py-4 hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2">
                <Meh className="h-6 w-6" />
                <span className="font-medium">Okay</span>
              </button>
              <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl px-6 py-4 hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2">
                <Frown className="h-6 w-6" />
                <span className="font-medium">Struggling</span>
              </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold mb-2">{weeklyStats.averageMood.toFixed(1)}/5</div>
                <div className="text-teal-100">Average Mood</div>
              </div>
              <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold mb-2">{weeklyStats.streak}</div>
                <div className="text-teal-100">Day Streak</div>
              </div>
              <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold mb-2">{weeklyStats.totalEntries}</div>
                <div className="text-teal-100">Total Entries</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Services Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Mental Health Toolkit
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for your wellness journey, all in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.link}
                  className="group relative"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${action.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {action.description}
                    </p>
                    
                    {/* CTA */}
                    <div className="flex items-center text-teal-600 font-semibold group-hover:text-teal-700 transition-colors">
                      <span>Get Started</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  {/* Gradient border effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`}></div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Mood Tracking */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Heart className="h-6 w-6 mr-3 text-red-500" />
                Recent Mood Entries
              </h3>
              <Link to="/mood" className="text-teal-600 hover:text-teal-700 font-medium flex items-center">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentMoods.slice(0, 3).map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                      {getMoodIcon(entry.mood)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {entry.note}
                      </div>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${getMoodColor(entry.mood)}`}>
                    {entry.mood}/5
                  </div>
                </div>
              ))}
            </div>
            
            <Link
              to="/mood"
              className="block w-full mt-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold text-center hover:from-teal-600 hover:to-teal-700 transition-all duration-200"
            >
              Track Mood Today
            </Link>
          </div>

          {/* Achievements & Progress */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Award className="h-6 w-6 mr-3 text-yellow-500" />
                Your Progress
              </h3>
            </div>
            
            <div className="space-y-6">
              {/* Weekly Goal */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Weekly Check-ins</span>
                  <span className="text-sm text-gray-600">5/7 days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full" style={{width: '71%'}}></div>
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">5-Day Streak!</div>
                    <div className="text-sm text-gray-600">Keep up the consistency</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Resource Explorer</div>
                    <div className="text-sm text-gray-600">Accessed 12 resources</div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200">
                View All Achievements
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;