import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import studentService from '../services/studentService';
import moodService from '../services/moodService';
import ResourcesSection from '../components/resources/ResourcesSection';
import CommunityForum from '../components/community/CommunityForum';
import MoodCheckInModal from '../components/mood/MoodCheckInModal';
import { MessagesPage, FriendsPage, AchievementsSection, NotificationsDropdown } from '../components/social';

import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  MessageSquare,
  MessageCircle,
  Heart,
  Trophy,
  Smile,
  RefreshCw
} from 'lucide-react';

const StudentDashboard = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [counselors, setCounselors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mood check-in states
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);
  const [todaysMood, setTodaysMood] = useState(null);
  const [showUpdateMood, setShowUpdateMood] = useState(false);

  // Booking states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingReason, setBookingReason] = useState('');

  useEffect(() => {
    loadDashboard();
    checkMoodStatus();
  }, []);

  // Check if user has checked in today
  const checkMoodStatus = async () => {
    try {
      const data = await moodService.hasCheckedInToday();
      if (!data.hasCheckedIn) {
        // Show mood check-in popup
        setShowMoodCheckIn(true);
      } else {
        setTodaysMood(data.todaysEntry);
      }
    } catch (error) {
      console.error('Error checking mood status:', error);
    }
  };

  const handleMoodCheckInSuccess = (result) => {
    setTodaysMood(result.moodEntry);
    setShowMoodCheckIn(false);
    setShowUpdateMood(false);
  };

  const handleNavigateFromNotification = (section, subSection) => {
    if (section === 'friends') {
      setActiveTab('friends');
    } else if (section === 'messages') {
      setActiveTab('messages');
    } else if (section === 'achievements') {
      setActiveTab('achievements');
    }
  };

  useEffect(() => {
    if (activeTab === 'appointments') {
      loadAppointments();
      loadCounselors();
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
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'friends', label: 'Support Circle', icon: Heart },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'community', label: 'Community', icon: Users }
  ];

  // Mood display helper
  const getMoodEmoji = (mood) => {
    const moods = {
      'great': '😄',
      'good': '🙂',
      'okay': '😐',
      'low': '😔',
      'struggling': '😢'
    };
    return moods[mood] || '😐';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Notifications */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Welcome back, {userProfile?.firstName}! 👋
            </h1>
            <p className="mt-1 text-gray-600">
              Your mental health matters. Explore resources, book appointments, and connect with others.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Today's Mood */}
            {todaysMood && (
              <button
                onClick={() => setShowUpdateMood(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
                title="Update your mood"
              >
                <span className="text-2xl">{getMoodEmoji(todaysMood.mood)}</span>
                <span className="text-sm text-gray-600 hidden sm:inline">Today's mood</span>
                <RefreshCw className="w-4 h-4 text-gray-400" />
              </button>
            )}
            {/* Notifications */}
            <NotificationsDropdown onNavigate={handleNavigateFromNotification} />
          </div>
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
        {activeTab === 'community' && <CommunityForum />}

        {/* Messages Tab */}
        {activeTab === 'messages' && <MessagesPage />}

        {/* Friends/Support Circle Tab */}
        {activeTab === 'friends' && (
          <FriendsPage 
            onStartChat={(conversation, friend) => {
              setActiveTab('messages');
            }} 
          />
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && <AchievementsSection />}

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

        {/* Daily Mood Check-in Modal */}
        <MoodCheckInModal
          isOpen={showMoodCheckIn}
          onClose={() => setShowMoodCheckIn(false)}
          onSuccess={handleMoodCheckInSuccess}
          isUpdate={false}
        />

        {/* Update Mood Modal */}
        <MoodCheckInModal
          isOpen={showUpdateMood}
          onClose={() => setShowUpdateMood(false)}
          onSuccess={handleMoodCheckInSuccess}
          isUpdate={true}
          existingEntry={todaysMood}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
