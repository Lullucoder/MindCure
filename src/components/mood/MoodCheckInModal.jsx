/**
 * Daily Mood Check-in Modal
 * Pops up when student logs in if they haven't checked in today
 * Also allows updating today's mood if feeling better
 */

import { useState, useEffect } from 'react';
import { X, Sun, CloudSun, Cloud, CloudRain, Zap, Check, Sparkles } from 'lucide-react';
import moodService from '../../services/moodService';

const MOOD_OPTIONS = [
  { score: 5, mood: 'great', label: 'Great', emoji: '😄', icon: Sun, color: 'bg-green-500', description: 'Feeling fantastic!' },
  { score: 4, mood: 'good', label: 'Good', emoji: '🙂', icon: CloudSun, color: 'bg-blue-500', description: 'Pretty good day' },
  { score: 3, mood: 'okay', label: 'Okay', emoji: '😐', icon: Cloud, color: 'bg-yellow-500', description: 'Just okay' },
  { score: 2, mood: 'low', label: 'Low', emoji: '😔', icon: CloudRain, color: 'bg-orange-500', description: 'Not my best' },
  { score: 1, mood: 'struggling', label: 'Struggling', emoji: '😢', icon: Zap, color: 'bg-red-500', description: 'Having a hard time' },
];

const ACTIVITY_OPTIONS = [
  { id: 'exercise', label: 'Exercise', emoji: '🏃' },
  { id: 'meditation', label: 'Meditation', emoji: '🧘' },
  { id: 'socializing', label: 'Socializing', emoji: '👥' },
  { id: 'work', label: 'Work/Study', emoji: '💼' },
  { id: 'nature', label: 'Nature', emoji: '🌳' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'reading', label: 'Reading', emoji: '📚' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'creative', label: 'Creative', emoji: '🎨' },
  { id: 'rest', label: 'Resting', emoji: '😴' },
];

const TAG_OPTIONS = [
  { id: 'anxious', label: 'Anxious', color: 'bg-purple-100 text-purple-700' },
  { id: 'calm', label: 'Calm', color: 'bg-blue-100 text-blue-700' },
  { id: 'energetic', label: 'Energetic', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'tired', label: 'Tired', color: 'bg-gray-100 text-gray-700' },
  { id: 'motivated', label: 'Motivated', color: 'bg-green-100 text-green-700' },
  { id: 'stressed', label: 'Stressed', color: 'bg-red-100 text-red-700' },
  { id: 'grateful', label: 'Grateful', color: 'bg-pink-100 text-pink-700' },
  { id: 'lonely', label: 'Lonely', color: 'bg-indigo-100 text-indigo-700' },
];

export default function MoodCheckInModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  isUpdate = false,
  existingEntry = null 
}) {
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [newAchievements, setNewAchievements] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize with existing entry if updating
  useEffect(() => {
    if (isUpdate && existingEntry) {
      const moodOption = MOOD_OPTIONS.find(m => m.mood === existingEntry.mood || m.score === existingEntry.score);
      setSelectedMood(moodOption || null);
      setSelectedActivities(existingEntry.activities || []);
      setSelectedTags(existingEntry.tags || []);
      setNotes(existingEntry.notes || '');
    }
  }, [isUpdate, existingEntry]);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setStep(2);
  };

  const toggleActivity = (activityId) => {
    setSelectedActivities(prev => 
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const toggleTag = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;

    setIsSubmitting(true);
    setError('');

    try {
      const moodData = {
        score: selectedMood.score,
        mood: selectedMood.mood,
        activities: selectedActivities,
        tags: selectedTags,
        notes: notes.trim(),
      };

      let result;
      if (isUpdate) {
        result = await moodService.updateTodaysMood(moodData);
      } else {
        result = await moodService.checkIn(moodData);
      }

      // Check for new achievements
      if (result.newAchievements && result.newAchievements.length > 0) {
        setNewAchievements(result.newAchievements);
      }

      setShowSuccess(true);
      
      // Wait a bit to show success animation
      setTimeout(() => {
        onSuccess?.(result);
        onClose();
      }, newAchievements.length > 0 ? 3000 : 1500);

    } catch (err) {
      setError(err.message || 'Failed to save mood. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedMood(null);
    setSelectedActivities([]);
    setSelectedTags([]);
    setNotes('');
    setError('');
    setShowSuccess(false);
    setNewAchievements([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={resetAndClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Close button */}
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Success State */}
        {showSuccess ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isUpdate ? 'Mood Updated!' : 'Check-in Complete!'}
            </h2>
            <p className="text-gray-600 mb-4">
              {selectedMood?.score >= 4 
                ? "Great to hear you're doing well! 🌟" 
                : selectedMood?.score <= 2 
                  ? "Thank you for sharing. Your friends who care about you have been notified. 💙"
                  : "Thanks for checking in today! 🙌"
              }
            </p>

            {/* New Achievements */}
            {newAchievements.length > 0 && (
              <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-700">New Achievement Unlocked!</span>
                </div>
                {newAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center justify-center gap-3 py-2">
                    <span className="text-3xl">{achievement.icon || '🏆'}</span>
                    <div className="text-left">
                      <p className="font-medium text-gray-800">{achievement.name}</p>
                      <p className="text-sm text-gray-500">+{achievement.xp} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">
                {isUpdate ? '📝 Update Your Mood' : '🌅 Daily Check-in'}
              </h2>
              <p className="text-gray-500 mt-1">
                {isUpdate 
                  ? 'Feeling different? Update how you feel now.'
                  : 'How are you feeling today?'
                }
              </p>
              {/* Progress indicator */}
              <div className="flex gap-2 mt-4">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      s <= step ? 'bg-primary-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Step 1: Mood Selection */}
              {step === 1 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Select the mood that best describes how you feel right now
                  </p>
                  {MOOD_OPTIONS.map((mood) => {
                    const Icon = mood.icon;
                    return (
                      <button
                        key={mood.mood}
                        onClick={() => handleMoodSelect(mood)}
                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                          selectedMood?.mood === mood.mood
                            ? `border-primary-500 bg-primary-50`
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-3xl">{mood.emoji}</span>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-gray-800">{mood.label}</p>
                          <p className="text-sm text-gray-500">{mood.description}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${mood.color}`} />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Step 2: Activities & Tags */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Selected mood summary */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-2xl">{selectedMood?.emoji}</span>
                    <div>
                      <p className="font-medium text-gray-800">Feeling {selectedMood?.label}</p>
                      <button 
                        onClick={() => setStep(1)}
                        className="text-sm text-primary-600 hover:underline"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Activities */}
                  <div>
                    <p className="font-medium text-gray-700 mb-3">What have you been up to?</p>
                    <div className="flex flex-wrap gap-2">
                      {ACTIVITY_OPTIONS.map((activity) => (
                        <button
                          key={activity.id}
                          onClick={() => toggleActivity(activity.id)}
                          className={`px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                            selectedActivities.includes(activity.id)
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <span>{activity.emoji}</span>
                          {activity.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <p className="font-medium text-gray-700 mb-3">How would you describe your feelings?</p>
                    <div className="flex flex-wrap gap-2">
                      {TAG_OPTIONS.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => toggleTag(tag.id)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            selectedTags.includes(tag.id)
                              ? 'bg-primary-500 text-white'
                              : tag.color
                          }`}
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 px-4 py-3 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Notes & Submit */}
              {step === 3 && (
                <div className="space-y-6">
                  {/* Selected mood summary */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-2xl">{selectedMood?.emoji}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Feeling {selectedMood?.label}</p>
                      {selectedActivities.length > 0 && (
                        <p className="text-sm text-gray-500">
                          {selectedActivities.map(a => 
                            ACTIVITY_OPTIONS.find(opt => opt.id === a)?.emoji
                          ).join(' ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <p className="font-medium text-gray-700 mb-3">
                      Anything else you'd like to share? (Optional)
                    </p>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Write your thoughts here..."
                      className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>

                  {/* Low mood notice */}
                  {selectedMood?.score <= 2 && (
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <p className="text-sm text-blue-700">
                        💙 When you check in with a low mood, your friends in your Support Circle 
                        will receive a notification so they can reach out and support you.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          {isUpdate ? 'Update Mood' : 'Complete Check-in'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
