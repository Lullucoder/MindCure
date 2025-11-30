/**
 * User Profile Page - View other users' public profiles
 * Features: Avatar, bio, mood status, friend button, chat button, achievements, stats
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userProfileService from '../services/userProfileService';
import friendService from '../services/friendService';
import messageService from '../services/messageService';
import {
  ArrowLeft,
  UserPlus,
  UserMinus,
  UserCheck,
  MessageCircle,
  Trophy,
  Flame,
  Heart,
  Target,
  Calendar,
  Clock,
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  Zap,
  Loader2,
  AlertCircle,
  Users,
  FileText
} from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';

const MOOD_ICONS = {
  5: { icon: Sun, color: 'text-green-500', bg: 'bg-green-100', label: 'Great' },
  4: { icon: CloudSun, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Good' },
  3: { icon: Cloud, color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'Okay' },
  2: { icon: CloudRain, color: 'text-orange-500', bg: 'bg-orange-100', label: 'Low' },
  1: { icon: Zap, color: 'text-red-500', bg: 'bg-red-100', label: 'Struggling' }
};

const ACHIEVEMENT_ICONS = {
  'first-checkin': '🎯',
  'streak-7': '🔥',
  'streak-30': '🔥',
  'mood-helper-1': '💚',
  'mood-helper-5': '💚',
  'mood-helper-10': '💚',
  'community-first-post': '💬',
  'first-message': '✉️',
  'first-friend': '👥'
};

export default function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { userProfile: currentUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await userProfileService.getUserProfile(userId);
      setProfile(data);
      
      // Load mood history if friends or own profile
      if (data.friendshipStatus === 'friends' || data.isOwnProfile) {
        const moodData = await userProfileService.getUserMoodHistory(userId);
        setMoodHistory(moodData.moodHistory || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFriendRequest = async () => {
    setActionLoading('friend');
    try {
      await friendService.sendFriendRequest(userId);
      setProfile(prev => ({
        ...prev,
        friendshipStatus: 'pending-sent'
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading('');
    }
  };

  const handleAcceptRequest = async () => {
    if (!profile.friendshipId) return;
    setActionLoading('accept');
    try {
      await friendService.acceptFriendRequest(profile.friendshipId);
      setProfile(prev => ({
        ...prev,
        friendshipStatus: 'friends',
        friendsCount: prev.friendsCount + 1
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading('');
    }
  };

  const handleRemoveFriend = async () => {
    setActionLoading('remove');
    try {
      await friendService.removeFriend(userId);
      setProfile(prev => ({
        ...prev,
        friendshipStatus: 'none',
        friendsCount: Math.max(0, prev.friendsCount - 1)
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading('');
    }
  };

  const handleStartChat = async () => {
    setActionLoading('chat');
    try {
      const conversation = await messageService.getOrCreateConversation(userId);
      navigate('/student', { state: { openMessages: true, conversationId: conversation._id } });
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading('');
    }
  };

  const renderFriendButton = () => {
    const status = profile?.friendshipStatus;
    
    if (status === 'friends') {
      return (
        <button
          onClick={handleRemoveFriend}
          disabled={actionLoading === 'remove'}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-md font-semibold w-full sm:w-auto"
        >
          {actionLoading === 'remove' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UserCheck className="w-4 h-4" />
          )}
          Friends ✓
        </button>
      );
    }
    
    if (status === 'pending-sent') {
      return (
        <button
          disabled
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-lg cursor-not-allowed shadow-md font-semibold w-full sm:w-auto"
        >
          <Clock className="w-4 h-4" />
          Request Sent
        </button>
      );
    }
    
    if (status === 'pending-received') {
      return (
        <button
          onClick={handleAcceptRequest}
          disabled={actionLoading === 'accept'}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all shadow-md font-semibold w-full sm:w-auto"
        >
          {actionLoading === 'accept' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UserCheck className="w-4 h-4" />
          )}
          Accept Request
        </button>
      );
    }
    
    return (
      <button
        onClick={handleSendFriendRequest}
        disabled={actionLoading === 'friend'}
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all shadow-md font-semibold w-full sm:w-auto"
      >
        {actionLoading === 'friend' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <UserPlus className="w-4 h-4" />
        )}
        Add Friend
      </button>
    );
  };

  const renderMoodBadge = () => {
    if (!profile?.currentMood) return null;
    
    const mood = MOOD_ICONS[profile.currentMood.score] || MOOD_ICONS[3];
    const MoodIcon = mood.icon;
    
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${mood.bg}`}>
        <MoodIcon className={`w-4 h-4 ${mood.color}`} />
        <span className={`text-sm font-medium ${mood.color}`}>
          Feeling {mood.label}
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-primary-500 hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Guard against null profile
  if (!profile || !profile.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">User profile not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-primary-500 hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {/* Profile Header */}
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar
                src={profile.user.avatar}
                name={profile.user.name}
                size="xl"
                className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-lg"
              />
              {profile.currentMood && (
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full ${MOOD_ICONS[profile.currentMood.score]?.bg || 'bg-gray-100'} flex items-center justify-center border-2 border-white`}>
                  {(() => {
                    const MoodIcon = MOOD_ICONS[profile.currentMood.score]?.icon || Cloud;
                    return <MoodIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${MOOD_ICONS[profile.currentMood.score]?.color || 'text-gray-500'}`} />;
                  })()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center">
              <h1 className="text-xl sm:text-2xl font-bold">{profile.user.name}</h1>
              <p className="text-indigo-200 capitalize">{profile.user.role}</p>
              
              {profile.user.bio && (
                <p className="mt-2 text-indigo-200 text-sm sm:text-base max-w-md mx-auto">{profile.user.bio}</p>
              )}

              {/* Stats Row */}
              <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4">
                <div className="text-center px-3 py-2 bg-white/10 rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold">{profile.friendsCount}</p>
                  <p className="text-xs text-indigo-200">Friends</p>
                </div>
                <div className="text-center px-3 py-2 bg-white/10 rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold">{profile.postsCount}</p>
                  <p className="text-xs text-indigo-200">Posts</p>
                </div>
                <div className="text-center px-3 py-2 bg-white/10 rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold">{profile.achievements?.length || 0}</p>
                  <p className="text-xs text-indigo-200">Badges</p>
                </div>
              </div>

              {/* Current Mood */}
              {profile.currentMood && (
                <div className="mt-4">
                  {renderMoodBadge()}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!profile.isOwnProfile && (
              <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-xs sm:max-w-none sm:w-auto">
                {renderFriendButton()}
                <button
                  onClick={handleStartChat}
                  disabled={actionLoading === 'chat'}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-md font-semibold w-full sm:w-auto"
                >
                  {actionLoading === 'chat' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MessageCircle className="w-4 h-4" />
                  )}
                  Send Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto pb-px">
          {['overview', 'achievements', 'mood'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-500" />
                Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Streak</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    {profile.stats.checkInStreak} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Longest Streak</span>
                  <span className="font-semibold">{profile.stats.longestStreak} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Check-ins</span>
                  <span className="font-semibold">{profile.stats.totalCheckIns}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Moods Helped</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Heart className="w-4 h-4 text-pink-500" />
                    {profile.stats.moodsHelped}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Recent Achievements
              </h3>
              {profile.achievements && profile.achievements.length > 0 ? (
                <div className="space-y-3">
                  {profile.achievements.slice(0, 4).map((achievement) => (
                    <div 
                      key={achievement.id}
                      className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-2xl">
                        {ACHIEVEMENT_ICONS[achievement.id] || '🏆'}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">{achievement.name}</p>
                        <p className="text-xs text-gray-500">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No achievements yet</p>
              )}
            </div>

            {/* Member Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Member Since
              </h3>
              <p className="text-gray-600">
                {new Date(profile.user.joinedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">All Achievements</h3>
            {profile.achievements && profile.achievements.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl text-center"
                  >
                    <span className="text-4xl">
                      {ACHIEVEMENT_ICONS[achievement.id] || '🏆'}
                    </span>
                    <p className="font-semibold text-gray-800 mt-2">{achievement.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                    <p className="text-xs text-yellow-600 mt-2">
                      +{achievement.xp} XP
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No achievements unlocked yet</p>
            )}
          </div>
        )}

        {/* Mood Tab */}
        {activeTab === 'mood' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Mood History (Last 7 Days)</h3>
            {profile.friendshipStatus === 'friends' || profile.isOwnProfile ? (
              moodHistory.length > 0 ? (
                <div className="space-y-3">
                  {moodHistory.map((entry, index) => {
                    const mood = MOOD_ICONS[entry.moodScore] || MOOD_ICONS[3];
                    const MoodIcon = mood.icon;
                    return (
                      <div 
                        key={index}
                        className={`flex items-center gap-4 p-3 rounded-lg ${mood.bg}`}
                      >
                        <MoodIcon className={`w-6 h-6 ${mood.color}`} />
                        <div className="flex-1">
                          <p className={`font-medium ${mood.color}`}>{mood.label}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No mood entries in the last 7 days</p>
              )
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Become friends to see mood history</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
