import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../lib/apiClient';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bio: ''
  });
  
  const [locationInfo, setLocationInfo] = useState({
    city: '',
    country: ''
  });
  
  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    phone: '',
    relationship: ''
  });
  
  const [mentalHealthInfo, setMentalHealthInfo] = useState({
    goals: [],
    challenges: [],
    copingStrategies: []
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reminders: true,
    weeklyDigest: false
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [stats, setStats] = useState(null);
  
  // New item input states
  const [newGoal, setNewGoal] = useState('');
  const [newChallenge, setNewChallenge] = useState('');
  const [newStrategy, setNewStrategy] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get('/profile');
      const profile = response.data.profile;
      setUser(profile);
      
      // Populate form states
      setPersonalInfo({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
        gender: profile.gender || '',
        bio: profile.bio || ''
      });
      
      setLocationInfo({
        city: profile.location?.city || '',
        country: profile.location?.country || ''
      });
      
      setEmergencyContact({
        name: profile.emergencyContact?.name || '',
        phone: profile.emergencyContact?.phone || '',
        relationship: profile.emergencyContact?.relationship || ''
      });
      
      setMentalHealthInfo({
        goals: profile.mentalHealthGoals || [],
        challenges: profile.currentChallenges || [],
        copingStrategies: profile.preferredCopingStrategies || []
      });
      
      setNotifications({
        email: profile.notificationPreferences?.email ?? true,
        push: profile.notificationPreferences?.push ?? true,
        reminders: profile.notificationPreferences?.reminders ?? true,
        weeklyDigest: profile.notificationPreferences?.weeklyDigest ?? false
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/profile/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const updateData = {
        name: personalInfo.name,
        phone: personalInfo.phone,
        dateOfBirth: personalInfo.dateOfBirth || null,
        gender: personalInfo.gender,
        bio: personalInfo.bio,
        location: locationInfo,
        emergencyContact: emergencyContact,
        mentalHealthGoals: mentalHealthInfo.goals,
        currentChallenges: mentalHealthInfo.challenges,
        preferredCopingStrategies: mentalHealthInfo.copingStrategies,
        notificationPreferences: notifications
      };
      
      const response = await apiClient.put('/profile', updateData);
      setUser(response.data.profile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Update stored auth data
      const authData = JSON.parse(localStorage.getItem('mental-health-app.auth') || '{}');
      if (authData.user) {
        authData.user = { ...authData.user, name: personalInfo.name };
        localStorage.setItem('mental-health-app.auth', JSON.stringify(authData));
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      await apiClient.put('/profile/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Failed to change password:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
    } finally {
      setSaving(false);
    }
  };

  const addItem = (type) => {
    if (type === 'goal' && newGoal.trim()) {
      setMentalHealthInfo(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()]
      }));
      setNewGoal('');
    } else if (type === 'challenge' && newChallenge.trim()) {
      setMentalHealthInfo(prev => ({
        ...prev,
        challenges: [...prev.challenges, newChallenge.trim()]
      }));
      setNewChallenge('');
    } else if (type === 'strategy' && newStrategy.trim()) {
      setMentalHealthInfo(prev => ({
        ...prev,
        copingStrategies: [...prev.copingStrategies, newStrategy.trim()]
      }));
      setNewStrategy('');
    }
  };

  const removeItem = (type, index) => {
    if (type === 'goal') {
      setMentalHealthInfo(prev => ({
        ...prev,
        goals: prev.goals.filter((_, i) => i !== index)
      }));
    } else if (type === 'challenge') {
      setMentalHealthInfo(prev => ({
        ...prev,
        challenges: prev.challenges.filter((_, i) => i !== index)
      }));
    } else if (type === 'strategy') {
      setMentalHealthInfo(prev => ({
        ...prev,
        copingStrategies: prev.copingStrategies.filter((_, i) => i !== index)
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'mental-health', label: 'Mental Health', icon: '🧠' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'stats', label: 'My Stats', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-teal-600 transition-colors mb-4"
          >
            <span className="mr-2">←</span> Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl">
                {user?.avatar || '👤'}
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="opacity-90">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={personalInfo.name}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={personalInfo.dateOfBirth}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      value={personalInfo.gender}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={personalInfo.bio}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    placeholder="Tell us a bit about yourself..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={locationInfo.city}
                        onChange={(e) => setLocationInfo(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Your city"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        value={locationInfo.country}
                        onChange={(e) => setLocationInfo(prev => ({ ...prev, country: e.target.value }))}
                        placeholder="Your country"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={emergencyContact.name}
                        onChange={(e) => setEmergencyContact(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Contact name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={emergencyContact.phone}
                        onChange={(e) => setEmergencyContact(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                      <input
                        type="text"
                        value={emergencyContact.relationship}
                        onChange={(e) => setEmergencyContact(prev => ({ ...prev, relationship: e.target.value }))}
                        placeholder="e.g., Parent, Spouse"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Mental Health Tab */}
            {activeTab === 'mental-health' && (
              <div className="space-y-8">
                {/* Goals */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">🎯 Mental Health Goals</h3>
                  <div className="space-y-3">
                    {mentalHealthInfo.goals.map((goal, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                        <span className="text-gray-800">{goal}</span>
                        <button
                          onClick={() => removeItem('goal', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="Add a new goal..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        onKeyPress={(e) => e.key === 'Enter' && addItem('goal')}
                      />
                      <button
                        onClick={() => addItem('goal')}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Challenges */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">💪 Current Challenges</h3>
                  <div className="space-y-3">
                    {mentalHealthInfo.challenges.map((challenge, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="text-gray-800">{challenge}</span>
                        <button
                          onClick={() => removeItem('challenge', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newChallenge}
                        onChange={(e) => setNewChallenge(e.target.value)}
                        placeholder="Add a current challenge..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        onKeyPress={(e) => e.key === 'Enter' && addItem('challenge')}
                      />
                      <button
                        onClick={() => addItem('challenge')}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Coping Strategies */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">🌱 Coping Strategies</h3>
                  <div className="space-y-3">
                    {mentalHealthInfo.copingStrategies.map((strategy, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-800">{strategy}</span>
                        <button
                          onClick={() => removeItem('strategy', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newStrategy}
                        onChange={(e) => setNewStrategy(e.target.value)}
                        placeholder="Add a coping strategy..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        onKeyPress={(e) => e.key === 'Enter' && addItem('strategy')}
                      />
                      <button
                        onClick={() => addItem('strategy')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <p className="text-gray-600 mb-6">Choose how you want to receive notifications</p>
                
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                    { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                    { key: 'reminders', label: 'Appointment Reminders', desc: 'Get reminded about upcoming sessions' },
                    { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of your weekly progress' }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.label}</h4>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key]}
                          onChange={(e) => setNotifications(prev => ({
                            ...prev,
                            [item.key]: e.target.checked
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        required
                        minLength={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>

                <div className="border-t pt-8">
                  <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
                  <p className="text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                        // Would implement delete account flow
                        alert('Account deletion requires password confirmation. Feature coming soon.');
                      }
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl">
                    <div className="text-3xl font-bold text-teal-600">
                      {stats?.stats?.sessionsCompleted || 0}
                    </div>
                    <div className="text-sm text-gray-600">Sessions Completed</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600">
                      {stats?.stats?.totalChatMessages || 0}
                    </div>
                    <div className="text-sm text-gray-600">Chat Messages</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600">
                      {stats?.stats?.appointmentsBooked || 0}
                    </div>
                    <div className="text-sm text-gray-600">Appointments</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                    <div className="text-3xl font-bold text-green-600">
                      {stats?.stats?.resourcesViewed || 0}
                    </div>
                    <div className="text-sm text-gray-600">Resources Viewed</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                    <div className="text-3xl font-bold text-orange-600">
                      {stats?.stats?.moodCheckIns || 0}
                    </div>
                    <div className="text-sm text-gray-600">Mood Check-ins</div>
                  </div>
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl">
                    <div className="text-3xl font-bold text-pink-600">
                      {stats?.daysSinceJoined || 0}
                    </div>
                    <div className="text-sm text-gray-600">Days as Member</div>
                  </div>
                </div>

                {stats?.memberSince && (
                  <div className="text-center text-gray-500 mt-8">
                    Member since {new Date(stats.memberSince).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
