import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  TrendingUp, 
  Plus, 
  BarChart3, 
  Heart,
  Zap,
  Cloud,
  Moon,
  Target,
  Smile,
  Meh,
  Frown,
  Sun,
  Star,
  Save,
  Activity
} from 'lucide-react';

// Local storage helper functions
const getMoodEntries = () => {
  const entries = localStorage.getItem('moodEntries');
  return entries ? JSON.parse(entries) : [];
};

const saveMoodEntries = (entries) => {
  localStorage.setItem('moodEntries', JSON.stringify(entries));
};

const MoodTracker = () => {
  const { userProfile } = useAuth();
  const [moodEntries, setMoodEntries] = useState([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [todayEntry, setTodayEntry] = useState(null);
  
  // Form state
  const [moodRating, setMoodRating] = useState(3);
  const [moodNote, setMoodNote] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);

  useEffect(() => {
    loadMoodData();
  }, []);

  const loadMoodData = () => {
    const entries = getMoodEntries();
    setMoodEntries(entries);

    // Check if user has logged mood today
    const today = new Date().toDateString();
    const todaysEntry = entries.find(entry => 
      new Date(entry.date).toDateString() === today
    );
    setTodayEntry(todaysEntry);
  };

  const getMoodEmoji = (mood) => {
    const emojis = ['😢', '😞', '😐', '😊', '😃'];
    return emojis[Math.floor(mood) - 1] || '😐';
  };

  const getMoodColor = (mood) => {
    if (mood >= 4) return 'text-green-500';
    if (mood >= 3) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMoodBgColor = (mood) => {
    if (mood >= 4) return 'bg-green-50 border-green-200';
    if (mood >= 3) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const emotions = [
    { name: 'Happy', icon: '😊', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Sad', icon: '😢', color: 'bg-blue-100 text-blue-700' },
    { name: 'Anxious', icon: '😰', color: 'bg-purple-100 text-purple-700' },
    { name: 'Calm', icon: '😌', color: 'bg-green-100 text-green-700' },
    { name: 'Excited', icon: '🤩', color: 'bg-orange-100 text-orange-700' },
    { name: 'Frustrated', icon: '😤', color: 'bg-red-100 text-red-700' },
    { name: 'Grateful', icon: '🙏', color: 'bg-pink-100 text-pink-700' },
    { name: 'Lonely', icon: '😔', color: 'bg-gray-100 text-gray-700' }
  ];

  const activities = [
    { name: 'Exercise', icon: '🏃‍♂️' },
    { name: 'Meditation', icon: '🧘‍♀️' },
    { name: 'Reading', icon: '📚' },
    { name: 'Music', icon: '🎵' },
    { name: 'Friends', icon: '👥' },
    { name: 'Work/Study', icon: '📝' },
    { name: 'Sleep', icon: '😴' },
    { name: 'Nature', icon: '🌳' }
  ];

  const handleSubmitMood = () => {
    if (!moodRating) return;

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mood: moodRating,
      note: moodNote,
      emotions: selectedEmotions,
      activities: selectedActivities,
      timestamp: new Date()
    };

    const updatedEntries = [newEntry, ...moodEntries];
    setMoodEntries(updatedEntries);
    saveMoodEntries(updatedEntries);
    setTodayEntry(newEntry);
    
    // Reset form
    setMoodRating(3);
    setMoodNote('');
    setSelectedEmotions([]);
    setSelectedActivities([]);
    setShowEntryForm(false);
  };

  const getStats = () => {
    if (moodEntries.length === 0) return null;
    
    const recent = moodEntries.slice(0, 7); // Last 7 entries
    const avgMood = recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length;
    const streak = calculateStreak();
    
    return {
      averageMood: avgMood,
      totalEntries: moodEntries.length,
      streak: streak,
      mostCommonEmotion: getMostCommonEmotion()
    };
  };

  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateString = checkDate.toDateString();
      
      const hasEntry = moodEntries.some(entry => 
        new Date(entry.date).toDateString() === dateString
      );
      
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getMostCommonEmotion = () => {
    const emotionCount = {};
    moodEntries.forEach(entry => {
      entry.emotions?.forEach(emotion => {
        emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
      });
    });
    
    return Object.keys(emotionCount).reduce((a, b) => 
      emotionCount[a] > emotionCount[b] ? a : b, 'N/A'
    );
  };

    const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Mood Tracker</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your emotions and discover patterns in your mental wellness journey
          </p>
        </div>

        {/* Today's Entry Section */}
        <div className="mb-8">
          {todayEntry ? (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{getMoodEmoji(todayEntry.mood)}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Today's Mood</h3>
                    <p className="text-gray-600">You're feeling {todayEntry.mood}/5 today</p>
                    {todayEntry.note && (
                      <p className="text-sm text-gray-500 mt-1">"{todayEntry.note}"</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowEntryForm(true)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors"
                >
                  Update Mood
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-400 to-green-400 rounded-2xl shadow-lg p-8 text-white text-center">
              <Heart className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">How are you feeling today?</h3>
              <p className="mb-6 opacity-90">Take a moment to check in with yourself</p>
              <button
                onClick={() => setShowEntryForm(true)}
                className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Log Today's Mood</span>
              </button>
            </div>
          )}
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {stats.averageMood.toFixed(1)}
              </div>
              <div className="text-gray-600">Average Mood</div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">
                {stats.streak}
              </div>
              <div className="text-gray-600">Day Streak</div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">
                {stats.totalEntries}
              </div>
              <div className="text-gray-600">Total Entries</div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-xl font-bold text-pink-500 mb-2">
                {stats.mostCommonEmotion}
              </div>
              <div className="text-gray-600">Common Emotion</div>
            </div>
          </div>
        )}

        {/* Mood Entry Form Modal */}
        {showEntryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">How are you feeling?</h2>
                  <button
                    onClick={() => setShowEntryForm(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Mood Rating */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold text-gray-800 mb-4">
                    Rate your mood (1-5)
                  </label>
                  <div className="flex justify-center space-x-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMoodRating(rating)}
                        className={`w-16 h-16 rounded-full text-2xl transition-all duration-200 ${
                          moodRating === rating
                            ? 'scale-110 shadow-lg ' + getMoodBgColor(rating)
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {getMoodEmoji(rating)}
                      </button>
                    ))}
                  </div>
                  <div className="text-center mt-2 text-gray-600">
                    Selected: {moodRating}/5
                  </div>
                </div>

                {/* Emotions */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold text-gray-800 mb-4">
                    What emotions are you experiencing?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {emotions.map((emotion) => (
                      <button
                        key={emotion.name}
                        onClick={() => {
                          setSelectedEmotions(prev => 
                            prev.includes(emotion.name)
                              ? prev.filter(e => e !== emotion.name)
                              : [...prev, emotion.name]
                          );
                        }}
                        className={`p-3 rounded-xl transition-all duration-200 ${
                          selectedEmotions.includes(emotion.name)
                            ? emotion.color + ' ring-2 ring-blue-400'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <div className="text-2xl mb-1">{emotion.icon}</div>
                        <div className="text-sm font-medium">{emotion.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Activities */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold text-gray-800 mb-4">
                    What activities did you do today?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {activities.map((activity) => (
                      <button
                        key={activity.name}
                        onClick={() => {
                          setSelectedActivities(prev => 
                            prev.includes(activity.name)
                              ? prev.filter(a => a !== activity.name)
                              : [...prev, activity.name]
                          );
                        }}
                        className={`p-3 rounded-xl transition-all duration-200 ${
                          selectedActivities.includes(activity.name)
                            ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-400'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <div className="text-2xl mb-1">{activity.icon}</div>
                        <div className="text-sm font-medium">{activity.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold text-gray-800 mb-4">
                    Any additional thoughts? (Optional)
                  </label>
                  <textarea
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                    placeholder="What's on your mind today?"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                    rows="4"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitMood}
                  className="w-full bg-gradient-to-r from-blue-400 to-green-400 text-white py-4 rounded-xl font-semibold hover:from-blue-500 hover:to-green-500 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Save Mood Entry</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Entries */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Activity className="h-6 w-6 mr-3 text-blue-500" />
            Recent Mood Entries
          </h2>
          
          {moodEntries.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No mood entries yet</p>
              <p className="text-gray-400">Start tracking your mood to see patterns and insights</p>
            </div>
          ) : (
            <div className="space-y-4">
              {moodEntries.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{getMoodEmoji(entry.mood)}</div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-sm text-gray-600">
                        Mood: {entry.mood}/5
                        {entry.emotions?.length > 0 && (
                          <span> • {entry.emotions.join(', ')}</span>
                        )}
                      </div>
                      {entry.note && (
                        <div className="text-sm text-gray-500 mt-1">"{entry.note}"</div>
                      )}
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${getMoodColor(entry.mood)}`}>
                    {entry.mood}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MoodTracker;
            
