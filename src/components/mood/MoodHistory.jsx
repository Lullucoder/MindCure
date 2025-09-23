import { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Edit3, Trash2, MessageCircle, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import moodService from '../../services/moodService';

const MoodHistory = ({ entries, onRefresh }) => {
  const { currentUser } = useAuth();
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const getMoodEmoji = (mood) => {
    const emojis = ['😢', '😞', '😐', '😊', '😃'];
    return emojis[Math.floor(mood) - 1] || '😐';
  };

  const getMoodLabel = (mood) => {
    const labels = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];
    return labels[Math.floor(mood) - 1] || 'Neutral';
  };

  const getMoodColor = (mood) => {
    if (mood >= 4) return 'text-green-600 bg-green-50 border-green-200';
    if (mood >= 3) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      await moodService.deleteMoodEntry(currentUser.uid, entryId);
      setShowDeleteConfirm(null);
      onRefresh();
    } catch (error) {
      console.error('Error deleting mood entry:', error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.toDate ? timestamp.toDate() : timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp.toDate ? timestamp.toDate() : timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupEntriesByDate = (entries) => {
    const grouped = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.timestamp.toDate ? entry.timestamp.toDate() : entry.timestamp);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          displayDate: formatDate(entry.timestamp),
          entries: []
        };
      }
      
      grouped[dateKey].entries.push(entry);
    });

    // Sort entries within each date by time (newest first)
    Object.values(grouped).forEach(group => {
      group.entries.sort((a, b) => {
        const dateA = new Date(a.timestamp.toDate ? a.timestamp.toDate() : a.timestamp);
        const dateB = new Date(b.timestamp.toDate ? b.timestamp.toDate() : b.timestamp);
        return dateB - dateA;
      });
    });

    // Return sorted groups (newest dates first)
    return Object.values(grouped).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  if (!entries || entries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary-600" />
          Mood History
        </h2>
        
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No mood entries yet</h3>
          <p className="text-gray-600">Start tracking your mood to build your wellness journey</p>
        </div>
      </div>
    );
  }

  const groupedEntries = groupEntriesByDate(entries);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-primary-600" />
        Mood History
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({entries.length} {entries.length === 1 ? 'entry' : 'entries'})
        </span>
      </h2>

      <div className="space-y-6">
        {groupedEntries.map((group) => (
          <div key={group.date}>
            {/* Date Header */}
            <div className="flex items-center mb-4">
              <div className="text-sm font-medium text-gray-900">
                {group.displayDate}
              </div>
              <div className="flex-1 ml-4 border-t border-gray-200"></div>
              <div className="ml-4 text-xs text-gray-500">
                {group.entries.length} {group.entries.length === 1 ? 'entry' : 'entries'}
              </div>
            </div>

            {/* Entries for this date */}
            <div className="space-y-3 ml-4">
              {group.entries.map((entry) => (
                <div key={entry.id} className="border border-gray-200 rounded-lg">
                  {/* Entry Header */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getMoodEmoji(entry.mood)}</div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getMoodColor(entry.mood)}`}>
                              {entry.mood}/5 - {getMoodLabel(entry.mood)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTime(entry.timestamp)}
                            </span>
                          </div>
                          
                          {entry.tags && entry.tags.length > 0 && (
                            <div className="flex items-center mt-1">
                              <Tag className="h-3 w-3 text-gray-400 mr-1" />
                              <div className="flex flex-wrap gap-1">
                                {entry.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs text-gray-600 bg-gray-100 px-1 py-0.5 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {entry.tags.length > 3 && (
                                  <span className="text-xs text-gray-500">
                                    +{entry.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setExpandedEntry(
                            expandedEntry === entry.id ? null : entry.id
                          )}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {expandedEntry === entry.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                        
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => setShowDeleteConfirm(entry.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedEntry === entry.id && (
                    <div className="border-t border-gray-100 p-4 bg-gray-50">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Energy</div>
                          <div className="text-lg font-semibold text-orange-600">
                            {entry.energy || 'N/A'}/5
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Anxiety</div>
                          <div className="text-lg font-semibold text-red-600">
                            {entry.anxiety || 'N/A'}/5
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Sleep</div>
                          <div className="text-lg font-semibold text-blue-600">
                            {entry.sleep || 'N/A'}/5
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Wellness</div>
                          <div className="text-lg font-semibold text-green-600">
                            {entry.wellness ? `${entry.wellness}/5` : 'N/A'}
                          </div>
                        </div>
                      </div>

                      {entry.notes && (
                        <div>
                          <div className="flex items-center mb-2">
                            <MessageCircle className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-700">Notes</span>
                          </div>
                          <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                            {entry.notes}
                          </p>
                        </div>
                      )}

                      {entry.tags && entry.tags.length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center mb-2">
                            <Tag className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-700">All Tags</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs text-gray-600 bg-white px-2 py-1 rounded border"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Mood Entry
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this mood entry? This action cannot be undone.
            </p>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEntry(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodHistory;