import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ResourcesSection from '../components/resources/ResourcesSection';
import CommunityForum from '../components/community/CommunityForum';

import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Settings,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  X,
  Video,
  Link,
  ExternalLink
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AUTH_STORAGE_KEY = 'mindcure.auth';

const getAuthHeader = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    const auth = raw ? JSON.parse(raw) : null;
    return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
  } catch {
    return {};
  }
};

const CounselorDashboard = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(userProfile?.isAvailable ?? true);
  
  // Google Meet link modal state
  const [showMeetLinkModal, setShowMeetLinkModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');

  useEffect(() => {
    loadDashboard();
    // Initialize availability from userProfile
    setIsAvailable(userProfile?.isAvailable ?? true);
  }, [userProfile]);

  useEffect(() => {
    if (activeTab === 'appointments') {
      loadAppointments();
    }
  }, [activeTab]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/counselor/dashboard`, {
        headers: getAuthHeader()
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAppointments = async () => {
    try {
      const response = await fetch(`${API_BASE}/counselor/appointments`, {
        headers: getAuthHeader()
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const response = await fetch(`${API_BASE}/counselor/availability`, {
        method: 'PATCH',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !isAvailable })
      });
      if (response.ok) {
        setIsAvailable(!isAvailable);
      }
    } catch (err) {
      console.error('Failed to update availability:', err);
    }
  };


  // Open modal to get Google Meet link before confirming
  const openMeetLinkModal = (id) => {
    setSelectedAppointmentId(id);
    setMeetingLink('');
    setShowMeetLinkModal(true);
  };

  // Confirm appointment with Google Meet link
  const handleConfirmWithMeetLink = async () => {
    if (!selectedAppointmentId) return;
    
    try {
      const response = await fetch(`${API_BASE}/counselor/appointments/${selectedAppointmentId}/confirm`, {
        method: 'PATCH',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingLink })
      });
      if (response.ok) {
        setShowMeetLinkModal(false);
        setSelectedAppointmentId(null);
        setMeetingLink('');
        loadAppointments();
        loadDashboard();
      }
    } catch (err) {
      console.error('Failed to confirm appointment:', err);
    }
  };

  const handleConfirmAppointment = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/counselor/appointments/${id}/confirm`, {
        method: 'PATCH',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        loadAppointments();
        loadDashboard();
      }
    } catch (err) {
      console.error('Failed to confirm appointment:', err);
    }
  };

  const handleCompleteAppointment = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/counselor/appointments/${id}/complete`, {
        method: 'PATCH',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        loadAppointments();
        loadDashboard();
      }
    } catch (err) {
      console.error('Failed to complete appointment:', err);
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/counselor/appointments/${id}/cancel`, {
        method: 'PATCH',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        loadAppointments();
        loadDashboard();
      }
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'resources', label: 'Manage Resources', icon: BookOpen },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Counselor Dashboard <TrendingUp className="h-6 w-6 text-green-500" />
          </h1>
          <p className="mt-1 text-gray-600">
            Welcome back, {userProfile?.firstName}! Manage resources, view appointments, and help your students.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 uppercase">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardData?.stats?.totalStudents || 0}</p>
                  </div>
                  <Users className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 uppercase">Pending</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardData?.stats?.pendingAppointments || 0}</p>
                  </div>
                  <Clock className="h-10 w-10 text-amber-500" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 uppercase">Completed</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardData?.stats?.completedAppointments || 0}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 uppercase">Resources</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardData?.stats?.totalResources || 0}</p>
                  </div>
                  <BookOpen className="h-10 w-10 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Today's Appointments */}
            {dashboardData?.todayAppointments?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-blue-500" />
                  Today's Appointments
                </h3>
                <div className="space-y-4">
                  {dashboardData.todayAppointments.map((apt) => (
                    <div key={apt._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold">
                          {apt.student?.firstName?.[0]}{apt.student?.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {apt.student?.firstName} {apt.student?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{apt.time}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions Info */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Manage Your Resources</h3>
              <p className="text-white/80 mb-6">
                Create and manage mental health resources for your students. Add articles, videos, breathing exercises, 
                and meditation guides. All resources you create will appear in the student dashboard.
              </p>
              <button
                onClick={() => setActiveTab('resources')}
                className="px-6 py-3 bg-white text-blue-600 rounded-xl font-medium hover:shadow-lg transition"
              >
                Go to Resources
              </button>
            </div>
          </div>
        )}

        {/* Resources Tab - Full ResourcesSection with management */}
        {activeTab === 'resources' && (
          <ResourcesSection showHeader={false} embedded={true} />
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">All Appointments</h2>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div key={apt._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-gray-50 rounded-xl gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {apt.student?.firstName?.[0]}{apt.student?.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">
                            {apt.student?.firstName} {apt.student?.lastName}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(apt.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {apt.timeSlot || apt.time}
                            </span>
                          </div>
                          {apt.reason && (
                            <p className="text-sm text-gray-500 mt-1">Reason: {apt.reason}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {apt.status}
                        </span>
                        
                        {apt.status === 'pending' && (
                          <>
                            <button
                              onClick={() => openMeetLinkModal(apt._id)}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleCancelAppointment(apt._id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        
                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => handleCompleteAppointment(apt._id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                          >
                            Mark Complete
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
                  <p>You don't have any appointments yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Community Tab */}
        {activeTab === 'community' && <CommunityForum />}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="h-6 w-6 text-gray-500" />
              Settings
            </h2>

            {/* Availability Toggle */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Availability Status</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">Accept New Appointments</p>
                  <p className="text-sm text-gray-500">
                    {isAvailable 
                      ? 'Students can book appointments with you' 
                      : 'You are currently not accepting new appointments'}
                  </p>
                </div>
                <button
                  onClick={handleToggleAvailability}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    isAvailable ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      isAvailable ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Profile Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-500">Full Name</span>
                  <p className="font-semibold text-gray-900">{userProfile?.firstName} {userProfile?.lastName}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-500">Email</span>
                  <p className="font-semibold text-gray-900">{userProfile?.email}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-500">Role</span>
                  <p className="font-semibold text-gray-900 capitalize">{userProfile?.role}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-500">Status</span>
                  <p className={`font-semibold ${isAvailable ? 'text-green-600' : 'text-gray-600'}`}>
                    {isAvailable ? 'Available' : 'Not Available'}
                  </p>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile?.specializations?.length > 0 ? (
                  userProfile.specializations.map((spec, index) => (
                    <span key={index} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {spec}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No specializations set</p>
                )}
              </div>
            </div>

            {/* Stats Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-3xl font-bold text-blue-600">{dashboardData?.stats?.totalResources || 0}</p>
                  <p className="text-sm text-gray-600">Total Resources</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-3xl font-bold text-green-600">{dashboardData?.stats?.publishedResources || 0}</p>
                  <p className="text-sm text-gray-600">Published</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <p className="text-3xl font-bold text-amber-600">{dashboardData?.stats?.pendingAppointments || 0}</p>
                  <p className="text-sm text-gray-600">Pending Apt.</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <p className="text-3xl font-bold text-purple-600">{dashboardData?.stats?.completedAppointments || 0}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Google Meet Link Modal */}
      {showMeetLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Video className="h-6 w-6 text-green-600" />
                Add Google Meet Link
              </h3>
              <button 
                onClick={() => setShowMeetLinkModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Please paste the Google Meet link for this counseling session. The student will use this link to join the meeting.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Link
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              {meetingLink && !meetingLink.includes('meet.google.com') && (
                <p className="text-amber-600 text-sm mt-1">
                  Please enter a valid Google Meet link
                </p>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowMeetLinkModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWithMeetLink}
                disabled={!meetingLink || !meetingLink.includes('meet.google.com')}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-5 w-5" />
                Confirm Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselorDashboard;