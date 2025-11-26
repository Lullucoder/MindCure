import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import studentService from '../services/studentService';
import ResourcesSection from '../components/resources/ResourcesSection';

import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  MessageSquare,
  X,
  Plus,
  Heart,
  MessageCircle,
  Send,
  Trash2
} from 'lucide-react';

const StudentDashboard = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [counselors, setCounselors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingReason, setBookingReason] = useState('');

  // Community Forum states
  const [forumCategories, setForumCategories] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [newPostAnonymous, setNewPostAnonymous] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentAnonymous, setCommentAnonymous] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === 'appointments') {
      loadAppointments();
      loadCounselors();
    }
    if (activeTab === 'community') {
      loadForumCategories();
      loadForumPosts();
    }
  }, [activeTab]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await studentService.getStudentDashboard();
      setDashboardData(response.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCounselors = async () => {
    try {
      const response = await studentService.getCounselors();
      setCounselors(response.data.counselors || []);
    } catch (err) {
      console.error('Failed to load counselors:', err);
    }
  };

  const loadAppointments = async () => {
    try {
      const response = await studentService.getMyAppointments();
      setAppointments(response.data.appointments || []);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    }
  };

  const loadAvailableSlots = async (counselorId, date) => {
    try {
      const response = await studentService.getAvailableSlots(counselorId, date);
      setAvailableSlots(response.data.availableSlots || []);
    } catch (err) {
      console.error('Failed to load slots:', err);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedCounselor || !selectedDate || !selectedSlot) {
      alert('Please select a counselor, date, and time slot');
      return;
    }
    try {
      await studentService.bookAppointment({
        counselorId: selectedCounselor._id,
        date: selectedDate,
        timeSlot: selectedSlot,
        reason: bookingReason
      });
      setShowBookingModal(false);
      setSelectedCounselor(null);
      setSelectedDate('');
      setSelectedSlot('');
      setBookingReason('');
      loadAppointments();
      alert('Appointment booked successfully!');
    } catch (err) {
      alert('Failed to book appointment: ' + err.message);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await studentService.cancelAppointment(id);
        loadAppointments();
      } catch (err) {
        console.error('Failed to cancel appointment:', err);
      }
    }
  };

  // ==================== FORUM FUNCTIONS ====================
  const loadForumCategories = async () => {
    try {
      const response = await studentService.getCategories();
      setForumCategories(response.data.categories || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadForumPosts = async (category = '') => {
    try {
      const params = category ? { category } : {};
      const response = await studentService.getPosts(params);
      setForumPosts(response.data.posts || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert('Please fill in title and content');
      return;
    }
    try {
      await studentService.createPost({
        title: newPostTitle,
        content: newPostContent,
        category: newPostCategory || undefined,
        isAnonymous: newPostAnonymous
      });
      setShowNewPostModal(false);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostCategory('');
      setNewPostAnonymous(false);
      loadForumPosts(selectedCategory);
    } catch (err) {
      alert('Failed to create post: ' + err.message);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await studentService.togglePostLike(postId);
      loadForumPosts(selectedCategory);
      if (selectedPost?._id === postId) {
        const response = await studentService.getPost(postId);
        setSelectedPost(response.data.post);
      }
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost) return;
    try {
      await studentService.addComment(selectedPost._id, newComment, commentAnonymous);
      setNewComment('');
      setCommentAnonymous(false);
      const response = await studentService.getPost(selectedPost._id);
      setSelectedPost(response.data.post);
      loadForumPosts(selectedCategory);
    } catch (err) {
      alert('Failed to add comment: ' + err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await studentService.deletePost(postId);
        setSelectedPost(null);
        loadForumPosts(selectedCategory);
      } catch (err) {
        alert('Failed to delete post: ' + err.message);
      }
    }
  };

  const handleViewPost = async (post) => {
    try {
      const response = await studentService.getPost(post._id);
      setSelectedPost(response.data.post);
    } catch (err) {
      console.error('Failed to load post:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'community', label: 'Community', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Welcome back, {userProfile?.firstName}! 👋
          </h1>
          <p className="mt-1 text-gray-600">
            Your mental health matters. Explore resources, book appointments, and connect with others.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 p-2">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 uppercase">Upcoming Sessions</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardData?.stats?.upcomingAppointments || 0}</p>
                  </div>
                  <Calendar className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 uppercase">Completed Sessions</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardData?.stats?.completedAppointments || 0}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 uppercase">Forum Posts</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardData?.stats?.totalPosts || 0}</p>
                  </div>
                  <MessageSquare className="h-10 w-10 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Next Appointment */}
            {dashboardData?.nextAppointment && (
              <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Your Next Appointment
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                    {dashboardData.nextAppointment.counselor?.firstName?.[0]}
                  </div>
                  <div>
                    <p className="font-bold text-xl">
                      {dashboardData.nextAppointment.counselor?.firstName} {dashboardData.nextAppointment.counselor?.lastName}
                    </p>
                    <p className="text-white/80">
                      {new Date(dashboardData.nextAppointment.date).toLocaleDateString()} at {dashboardData.nextAppointment.time}
                    </p>
                    <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                      {dashboardData.nextAppointment.status}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Resources Tab - Full ResourcesSection */}
        {activeTab === 'resources' && (
          <ResourcesSection showHeader={false} embedded={true} />
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
              <button
                onClick={() => setShowBookingModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-medium hover:shadow-lg transition flex items-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                Book Appointment
              </button>
            </div>

            {/* My Appointments */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">My Appointments</h3>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div key={apt._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-gray-50 rounded-xl gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {apt.counselor?.firstName?.[0]}{apt.counselor?.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">
                            {apt.counselor?.firstName} {apt.counselor?.lastName}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(apt.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {apt.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {apt.status}
                        </span>
                        {(apt.status === 'pending' || apt.status === 'confirmed') && (
                          <button
                            onClick={() => handleCancelAppointment(apt._id)}
                            className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments</h3>
                  <p className="mb-6">Book your first appointment with a counselor</p>
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium"
                  >
                    Book Appointment
                  </button>
                </div>
              )}
            </div>

            {/* Available Counselors */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Available Counselors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {counselors.map((counselor) => (
                  <div key={counselor._id} className="p-5 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold">
                        {counselor.firstName?.[0]}{counselor.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{counselor.firstName} {counselor.lastName}</p>
                        <p className="text-sm text-gray-500">{counselor.specializations?.join(', ') || 'General Counseling'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setSelectedCounselor(counselor); setShowBookingModal(true); }}
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Book Session
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Community Tab */}
        {activeTab === 'community' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-500" />
                  Community Forum
                </h2>
                <p className="text-gray-600 mt-1">Connect with others and share your experiences</p>
              </div>
              <button
                onClick={() => setShowNewPostModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-medium hover:shadow-lg transition flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                New Post
              </button>
            </div>

            {/* Categories Filter */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => { setSelectedCategory(''); loadForumPosts(''); }}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap transition ${
                    !selectedCategory ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  All Posts
                </button>
                {forumCategories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => { setSelectedCategory(cat._id); loadForumPosts(cat._id); }}
                    className={`px-4 py-2 rounded-xl whitespace-nowrap transition ${
                      selectedCategory === cat._id ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Posts List */}
              <div className="space-y-4">
                {forumPosts.length > 0 ? forumPosts.map((post) => (
                  <div
                    key={post._id}
                    onClick={() => handleViewPost(post)}
                    className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition ${
                      selectedPost?._id === post._id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {post.isAnonymous ? '?' : (post.author?.firstName?.[0] || 'U')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {post.isAnonymous ? 'Anonymous' : `${post.author?.firstName || 'User'} ${post.author?.lastName || ''}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {post.category && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                          {post.category.name || post.category}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleLikePost(post._id); }}
                        className={`flex items-center gap-1 hover:text-red-500 transition ${
                          post.likes?.includes(userProfile?._id) ? 'text-red-500' : ''
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${post.likes?.includes(userProfile?._id) ? 'fill-current' : ''}`} />
                        {post.likes?.length || 0}
                      </button>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-500 mb-4">Be the first to start a conversation!</p>
                    <button
                      onClick={() => setShowNewPostModal(true)}
                      className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium"
                    >
                      Create First Post
                    </button>
                  </div>
                )}
              </div>

              {/* Selected Post Detail */}
              <div className="lg:sticky lg:top-4">
                {selectedPost ? (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold">
                            {selectedPost.isAnonymous ? '?' : (selectedPost.author?.firstName?.[0] || 'U')}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {selectedPost.isAnonymous ? 'Anonymous' : `${selectedPost.author?.firstName || 'User'} ${selectedPost.author?.lastName || ''}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(selectedPost.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedPost.author?._id === userProfile?._id && (
                            <button
                              onClick={() => handleDeletePost(selectedPost._id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedPost(null)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-3">{selectedPost.title}</h2>
                      <p className="text-gray-600 whitespace-pre-wrap">{selectedPost.content}</p>
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                        <button
                          onClick={() => handleLikePost(selectedPost._id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                            selectedPost.likes?.includes(userProfile?._id)
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${selectedPost.likes?.includes(userProfile?._id) ? 'fill-current' : ''}`} />
                          {selectedPost.likes?.length || 0} Likes
                        </button>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="p-6 bg-gray-50 max-h-80 overflow-y-auto">
                      <h4 className="font-semibold text-gray-900 mb-4">Comments ({selectedPost.comments?.length || 0})</h4>
                      <div className="space-y-4">
                        {selectedPost.comments?.map((comment, idx) => (
                          <div key={idx} className="bg-white rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold">
                                {comment.isAnonymous ? '?' : (comment.author?.firstName?.[0] || 'U')}
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {comment.isAnonymous ? 'Anonymous' : `${comment.author?.firstName || 'User'}`}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm">{comment.content}</p>
                          </div>
                        ))}
                        {(!selectedPost.comments || selectedPost.comments.length === 0) && (
                          <p className="text-gray-500 text-center py-4">No comments yet</p>
                        )}
                      </div>
                    </div>

                    {/* Add Comment */}
                    <div className="p-4 border-t">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write a comment..."
                          className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                        <button
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition"
                        >
                          <Send className="h-5 w-5" />
                        </button>
                      </div>
                      <label className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={commentAnonymous}
                          onChange={(e) => setCommentAnonymous(e.target.checked)}
                          className="rounded"
                        />
                        Post anonymously
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a post</h3>
                    <p className="text-gray-500">Click on a post to view details and comments</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* New Post Modal */}
        {showNewPostModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Create New Post</h3>
                <button onClick={() => setShowNewPostModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="What's on your mind?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Share your thoughts, ask questions, or start a discussion..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category (Optional)</label>
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category...</option>
                    {forumCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newPostAnonymous}
                    onChange={(e) => setNewPostAnonymous(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Post anonymously</span>
                </label>
              </div>
              <div className="p-6 border-t flex gap-4">
                <button
                  onClick={handleCreatePost}
                  disabled={!newPostTitle.trim() || !newPostContent.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-medium disabled:opacity-50"
                >
                  Post
                </button>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900">Book Appointment</h3>
              </div>
              <div className="p-6 space-y-4">
                {!selectedCounselor && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Counselor</label>
                    <select
                      value={selectedCounselor?._id || ''}
                      onChange={(e) => setSelectedCounselor(counselors.find(c => c._id === e.target.value))}
                      className="w-full px-4 py-3 border rounded-xl"
                    >
                      <option value="">Choose a counselor...</option>
                      {counselors.map((c) => (
                        <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>
                      ))}
                    </select>
                  </div>
                )}
                {selectedCounselor && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedCounselor.firstName?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{selectedCounselor.firstName} {selectedCounselor.lastName}</p>
                      <p className="text-sm text-gray-500">{selectedCounselor.specializations?.join(', ')}</p>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      if (selectedCounselor) loadAvailableSlots(selectedCounselor._id, e.target.value);
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border rounded-xl"
                  />
                </div>
                {availableSlots.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-3 py-2 rounded-lg text-sm transition ${
                            selectedSlot === slot
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
                  <textarea
                    value={bookingReason}
                    onChange={(e) => setBookingReason(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border rounded-xl resize-none"
                    placeholder="Briefly describe what you'd like to discuss..."
                  />
                </div>
              </div>
              <div className="p-6 border-t flex gap-4">
                <button
                  onClick={handleBookAppointment}
                  disabled={!selectedCounselor || !selectedDate || !selectedSlot}
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium disabled:opacity-50"
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => { setShowBookingModal(false); setSelectedCounselor(null); }}
                  className="px-6 py-3 border border-gray-300 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
