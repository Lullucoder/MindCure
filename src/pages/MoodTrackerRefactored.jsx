import { useState } from 'react';
import { 
  Plus, 
  Heart,
  Save,
  Activity,
  TrendingUp,
  Calendar,
  Flame
} from 'lucide-react';

// Hooks
import { useMoodData } from '../hooks/useMoodData';
import { useModal } from '../hooks/useModal';

// Constants
import { EMOTIONS, ACTIVITIES, getMoodEmoji, getMoodColor, getMoodBgColor } from '../constants';

// UI Components
import { Card, CardContent, StatCard, EmptyState, Modal, ModalHeader, ModalBody, Button } from '../components/ui';

const MoodTracker = () => {
  const { 
    entries, 
    todayEntry, 
    stats, 
    addEntry, 
    hasEntryToday 
  } = useMoodData();
  
  const entryModal = useModal();
  
  // Form state
  const [moodRating, setMoodRating] = useState(3);
  const [moodNote, setMoodNote] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const handleSubmitMood = () => {
    if (!moodRating) return;

    addEntry({
      mood: moodRating,
      note: moodNote,
      emotions: selectedEmotions,
      activities: selectedActivities,
    });

    // Reset form
    setMoodRating(3);
    setMoodNote('');
    setSelectedEmotions([]);
    setSelectedActivities([]);
    entryModal.close();
  };

  const toggleEmotion = (emotionName) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotionName)
        ? prev.filter((e) => e !== emotionName)
        : [...prev, emotionName]
    );
  };

  const toggleActivity = (activityName) => {
    setSelectedActivities((prev) =>
      prev.includes(activityName)
        ? prev.filter((a) => a !== activityName)
        : [...prev, activityName]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Mood Tracker</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your emotions and discover patterns in your mental wellness journey
          </p>
        </header>

        {/* Today's Entry Section */}
        <section className="mb-8">
          {hasEntryToday ? (
            <Card variant="elevated" className="p-6">
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
                <Button variant="secondary" onClick={() => entryModal.open()}>
                  Update Mood
                </Button>
              </div>
            </Card>
          ) : (
            <div className="bg-gradient-to-r from-blue-400 to-green-400 rounded-2xl shadow-lg p-8 text-white text-center">
              <Heart className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">How are you feeling today?</h3>
              <p className="mb-6 opacity-90">Take a moment to check in with yourself</p>
              <Button 
                variant="secondary" 
                onClick={() => entryModal.open()}
                leftIcon={Plus}
                className="bg-white text-blue-600 hover:bg-gray-50"
              >
                Log Today's Mood
              </Button>
            </div>
          )}
        </section>

        {/* Stats Section */}
        {stats && (
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Average Mood"
              value={stats.averageMood.toFixed(1)}
              icon={TrendingUp}
              color="primary"
            />
            <StatCard
              title="Day Streak"
              value={stats.streak}
              icon={Flame}
              color="secondary"
            />
            <StatCard
              title="Total Entries"
              value={stats.totalEntries}
              icon={Calendar}
              color="purple"
            />
            <StatCard
              title="Common Emotion"
              value={stats.mostCommonEmotion}
              icon={Heart}
              color="accent"
            />
          </section>
        )}

        {/* Recent Entries */}
        <Card variant="elevated" className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Activity className="h-6 w-6 mr-3 text-blue-500" />
            Recent Mood Entries
          </h2>
          
          {entries.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No mood entries yet"
              description="Start tracking your mood to see patterns and insights"
              action={{
                label: 'Log Your First Mood',
                onClick: () => entryModal.open(),
                icon: Plus,
              }}
            />
          ) : (
            <div className="space-y-4">
              {entries.slice(0, 10).map((entry) => (
                <div 
                  key={entry.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
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
        </Card>

        {/* Mood Entry Modal */}
        <Modal 
          isOpen={entryModal.isOpen} 
          onClose={entryModal.close}
          size="lg"
        >
          <ModalHeader>How are you feeling?</ModalHeader>
          <ModalBody>
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
                        ? 'scale-110 shadow-lg border-2 ' + getMoodBgColor(rating)
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
                {EMOTIONS.slice(0, 8).map((emotion) => (
                  <button
                    key={emotion.name}
                    onClick={() => toggleEmotion(emotion.name)}
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
                {ACTIVITIES.slice(0, 8).map((activity) => (
                  <button
                    key={activity.name}
                    onClick={() => toggleActivity(activity.name)}
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
            <Button
              onClick={handleSubmitMood}
              className="w-full bg-gradient-to-r from-blue-400 to-green-400"
              leftIcon={Save}
            >
              Save Mood Entry
            </Button>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
};

export default MoodTracker;
