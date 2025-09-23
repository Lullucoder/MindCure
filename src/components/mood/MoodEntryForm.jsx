import { useState } from 'react';
import { X, Heart, Zap, Moon, Activity, Brain, MessageCircle } from 'lucide-react';

const MoodEntryForm = ({ onSubmit, onClose, existingEntry }) => {
  const [formData, setFormData] = useState({
    mood: existingEntry?.mood || 3,
    energy: existingEntry?.energy || 3,
    anxiety: existingEntry?.anxiety || 3,
    sleep: existingEntry?.sleep || 3,
    notes: existingEntry?.notes || '',
    tags: existingEntry?.tags || []
  });

  const [selectedTags, setSelectedTags] = useState(existingEntry?.tags || []);

  const moodLabels = [
    { value: 1, label: 'Very Low', emoji: '😢', color: 'text-red-500' },
    { value: 2, label: 'Low', emoji: '😞', color: 'text-orange-500' },
    { value: 3, label: 'Neutral', emoji: '😐', color: 'text-yellow-500' },
    { value: 4, label: 'Good', emoji: '😊', color: 'text-green-500' },
    { value: 5, label: 'Excellent', emoji: '😃', color: 'text-blue-500' }
  ];

  const predefinedTags = [
    'work', 'school', 'family', 'friends', 'exercise', 'meditation',
    'stressed', 'grateful', 'productive', 'tired', 'excited', 'peaceful',
    'anxious', 'motivated', 'lonely', 'confident', 'overwhelmed', 'happy'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      tags: selectedTags,
      timestamp: new Date()
    };
    
    onSubmit(submissionData);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const ScaleInput = ({ label, value, onChange, icon: Icon, color = 'primary' }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 flex items-center">
          <Icon className={`h-4 w-4 mr-2 text-${color}-600`} />
          {label}
        </label>
        <span className={`text-sm font-medium text-${color}-600`}>
          {value}/5
        </span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min="1"
          max="5"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-${color}`}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Heart className="h-6 w-6 mr-3 text-primary-600" />
            {existingEntry ? 'Update Today\'s Mood' : 'How are you feeling?'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Mood Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Overall Mood</h3>
            <div className="grid grid-cols-5 gap-3">
              {moodLabels.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, mood: mood.value }))}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.mood === mood.value
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{mood.emoji}</div>
                  <div className={`text-xs font-medium ${
                    formData.mood === mood.value ? 'text-primary-700' : 'text-gray-600'
                  }`}>
                    {mood.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScaleInput
              label="Energy Level"
              value={formData.energy}
              onChange={(value) => setFormData(prev => ({ ...prev, energy: value }))}
              icon={Zap}
              color="orange"
            />
            
            <ScaleInput
              label="Anxiety Level"
              value={formData.anxiety}
              onChange={(value) => setFormData(prev => ({ ...prev, anxiety: value }))}
              icon={Brain}
              color="red"
            />
            
            <ScaleInput
              label="Sleep Quality"
              value={formData.sleep}
              onChange={(value) => setFormData(prev => ({ ...prev, sleep: value }))}
              icon={Moon}
              color="blue"
            />
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Activity className="h-4 w-4 mr-2 text-green-600" />
                Overall Wellness
              </label>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round((formData.mood + formData.energy + (6 - formData.anxiety) + formData.sleep) / 4 * 20)}%
                </div>
                <div className="text-sm text-gray-500">Wellness Score</div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">What's influencing your mood?</h3>
            <div className="flex flex-wrap gap-2">
              {predefinedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MessageCircle className="h-4 w-4 mr-2 text-secondary-600" />
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="How are you feeling? What happened today? Any thoughts you'd like to record..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {existingEntry ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoodEntryForm;