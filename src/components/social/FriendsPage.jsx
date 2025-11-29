/**
 * Friends Page - Friend list, requests, and user search
 * "Support Circle" feature
 */

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Clock, 
  Check, 
  X, 
  Search, 
  MessageCircle,
  MoreVertical,
  Ban,
  Bell,
  Sparkles
} from 'lucide-react';
import friendService from '../../services/friendService';
import messageService from '../../services/messageService';
import Avatar from '../ui/Avatar';
import Spinner from '../ui/Spinner';

export default function FriendsPage({ onStartChat }) {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [friendsData, requestsData] = await Promise.all([
        friendService.getFriends(),
        friendService.getPendingRequests(),
      ]);
      setFriends(friendsData.friends || []);
      setPendingRequests(requestsData.requests || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load friends data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError('');
    try {
      const data = await friendService.searchUsers(searchQuery.trim());
      setSearchResults(data.users || []);
      if (data.users?.length === 0) {
        setSuccessMessage('No users found');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setError('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (userId) => {
    setActionLoading(prev => ({ ...prev, [userId]: 'sending' }));
    try {
      await friendService.sendRequest(userId);
      setSuccessMessage('Friend request sent!');
      setTimeout(() => setSuccessMessage(''), 3000);
      // Update search results to reflect sent request
      setSearchResults(prev => prev.map(u => 
        u._id === userId ? { ...u, friendshipStatus: 'pending' } : u
      ));
    } catch (error) {
      console.error('Error sending request:', error);
      setError(error.message || 'Failed to send friend request');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }));
    }
  };

  const handleAcceptRequest = async (friendshipId) => {
    setActionLoading(prev => ({ ...prev, [friendshipId]: 'accepting' }));
    try {
      await friendService.acceptRequest(friendshipId);
      setSuccessMessage('Friend request accepted!');
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadData();
    } catch (error) {
      console.error('Error accepting request:', error);
      setError('Failed to accept request');
    } finally {
      setActionLoading(prev => ({ ...prev, [friendshipId]: null }));
    }
  };

  const handleRejectRequest = async (friendshipId) => {
    setActionLoading(prev => ({ ...prev, [friendshipId]: 'rejecting' }));
    try {
      await friendService.rejectRequest(friendshipId);
      setPendingRequests(prev => prev.filter(r => r._id !== friendshipId));
      setSuccessMessage('Friend request declined');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error rejecting request:', error);
      setError('Failed to reject request');
    } finally {
      setActionLoading(prev => ({ ...prev, [friendshipId]: null }));
    }
  };

  const handleRemoveFriend = async (friendshipId, friendName) => {
    if (!confirm(`Remove ${friendName} from your Support Circle?`)) return;

    setActionLoading(prev => ({ ...prev, [friendshipId]: 'removing' }));
    try {
      await friendService.removeFriend(friendshipId);
      setFriends(prev => prev.filter(f => f.friendshipId !== friendshipId));
      setSuccessMessage('Friend removed');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error removing friend:', error);
      setError('Failed to remove friend');
    } finally {
      setActionLoading(prev => ({ ...prev, [friendshipId]: null }));
    }
  };

  const handleStartChat = async (friend) => {
    try {
      const data = await messageService.getOrCreateConversation(friend._id);
      onStartChat?.(data.conversation, friend);
    } catch (error) {
      console.error('Error starting chat:', error);
      setError('Failed to start chat');
    }
  };

  const tabs = [
    { id: 'friends', label: 'Support Circle', icon: Users, count: friends.length },
    { id: 'requests', label: 'Requests', icon: Clock, count: pendingRequests.length },
    { id: 'search', label: 'Find Friends', icon: UserPlus },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Users className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Support Circle</h2>
            <p className="text-sm text-gray-500">Connect with friends who care about your wellbeing</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Messages */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
          <button onClick={() => setError('')} className="ml-2 text-red-500 hover:underline">
            Dismiss
          </button>
        </div>
      )}
      {successMessage && (
        <div className="mx-6 mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
          {successMessage}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* Friends Tab */}
            {activeTab === 'friends' && (
              <div>
                {friends.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 mb-2">Your Support Circle is empty</p>
                    <p className="text-sm text-gray-400 mb-4">
                      Add friends to receive support and notifications when they need help
                    </p>
                    <button
                      onClick={() => setActiveTab('search')}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      <UserPlus className="w-4 h-4 inline mr-2" />
                      Find Friends
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {friends.map(friend => (
                      <div
                        key={friend._id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <Avatar name={friend.name} size="lg" userId={friend._id} clickable />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{friend.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{friend.role}</p>
                          {friend.lastMood && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-sm">
                                {friend.lastMood.score >= 4 ? '😊' : friend.lastMood.score <= 2 ? '😔' : '😐'}
                              </span>
                              <span className="text-xs text-gray-400">
                                {friend.lastMood.mood}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStartChat(friend)}
                            className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors"
                            title="Send message"
                          >
                            <MessageCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleRemoveFriend(friend.friendshipId, friend.name)}
                            disabled={actionLoading[friend.friendshipId]}
                            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                            title="Remove from circle"
                          >
                            {actionLoading[friend.friendshipId] === 'removing' ? (
                              <Spinner size="sm" />
                            ) : (
                              <UserMinus className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">Support Circle Notifications</p>
                      <p className="text-sm text-blue-600 mt-1">
                        When your friends log a low mood, you'll receive a notification so you can 
                        reach out and support them. You'll also be notified when your support helps 
                        improve their mood!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pending Requests Tab */}
            {activeTab === 'requests' && (
              <div>
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No pending friend requests</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingRequests.map(request => (
                      <div
                        key={request._id}
                        className="flex items-center gap-4 p-4 bg-yellow-50 rounded-xl"
                      >
                        <Avatar name={request.requester?.name} size="lg" userId={request.requester?._id} clickable />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{request.requester?.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{request.requester?.role}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Sent {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAcceptRequest(request._id)}
                            disabled={actionLoading[request._id]}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            title="Accept"
                          >
                            {actionLoading[request._id] === 'accepting' ? (
                              <Spinner size="sm" className="text-white" />
                            ) : (
                              <Check className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request._id)}
                            disabled={actionLoading[request._id]}
                            className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                            title="Decline"
                          >
                            {actionLoading[request._id] === 'rejecting' ? (
                              <Spinner size="sm" />
                            ) : (
                              <X className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Search Tab */}
            {activeTab === 'search' && (
              <div>
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSearching || !searchQuery.trim()}
                      className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSearching ? <Spinner size="sm" className="text-white" /> : 'Search'}
                    </button>
                  </div>
                </form>

                {searchResults.length > 0 ? (
                  <div className="space-y-3">
                    {searchResults.map(user => {
                      const isFriend = user.friendshipStatus === 'accepted';
                      const isPending = user.friendshipStatus === 'pending';
                      
                      return (
                        <div
                          key={user._id}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                        >
                          <Avatar name={user.name} size="lg" userId={user._id} clickable />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{user.name}</p>
                            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                          </div>
                          <div>
                            {isFriend ? (
                              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center gap-1">
                                <Check className="w-4 h-4" />
                                Friends
                              </span>
                            ) : isPending ? (
                              <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Pending
                              </span>
                            ) : (
                              <button
                                onClick={() => handleSendRequest(user._id)}
                                disabled={actionLoading[user._id]}
                                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
                              >
                                {actionLoading[user._id] === 'sending' ? (
                                  <Spinner size="sm" className="text-white" />
                                ) : (
                                  <>
                                    <UserPlus className="w-4 h-4" />
                                    Add Friend
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Search for users to add to your Support Circle</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Find classmates, counselors, or other students
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
