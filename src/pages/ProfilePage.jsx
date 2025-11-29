import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../lib/apiClient';
import {
  User,
  Shield,
  BarChart3,
  Save,
  Loader2,
  Camera,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Calendar,
  MessageSquare,
  BookOpen,
  Heart,
  Clock,
} from 'lucide-react';
import '../styles/profile.css';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState(null);

  // Profile form state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bio: '',
    avatar: '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
  ];

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/users/profile');
      const userData = response.data.data || response.data;
      setProfile({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth
          ? new Date(userData.dateOfBirth).toISOString().split('T')[0]
          : '',
        gender: userData.gender || '',
        bio: userData.bio || '',
        avatar: userData.avatar || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      showMessage('error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/users/stats');
      setStats(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default stats if fetch fails
      setStats({
        totalSessions: 0,
        totalMessages: 0,
        totalAppointments: 0,
        resourcesViewed: 0,
        moodCheckIns: 0,
        memberSince: user?.createdAt || new Date().toISOString(),
      });
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await apiClient.put('/users/profile', profile);
      const updatedUser = response.data.data || response.data;
      updateUser(updatedUser);
      showMessage('success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      showMessage('error', error.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      showMessage('error', 'Password must be at least 8 characters');
      return;
    }

    try {
      setSaving(true);
      await apiClient.put('/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      showMessage('success', 'Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      showMessage('error', error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      showMessage('error', 'Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Image must be less than 5MB');
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const avatarUrl = response.data.data?.avatar || response.data.avatar;
      setProfile((prev) => ({ ...prev, avatar: avatarUrl }));
      updateUser({ ...user, avatar: avatarUrl });
      showMessage('success', 'Avatar updated successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showMessage('error', 'Failed to upload avatar');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateDaysSince = (dateString) => {
    if (!dateString) return 0;
    const start = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return { level: 'weak', color: 'var(--color-error)', width: '33%' };
    if (strength <= 3) return { level: 'medium', color: 'var(--color-warning)', width: '66%' };
    return { level: 'strong', color: 'var(--color-success)', width: '100%' };
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <Loader2 className="animate-spin" size={48} />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  const renderPersonalTab = () => (
    <form onSubmit={handleSaveProfile} className="profile-form">
      {/* Avatar Section */}
      <div className="avatar-section">
        <div className="avatar-wrapper">
          {profile.avatar ? (
            <img src={profile.avatar} alt="Avatar" className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">
              <User size={48} />
            </div>
          )}
          <label className="avatar-upload">
            <Camera size={20} />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>
        <p className="avatar-hint">Click the camera icon to upload a new photo</p>
      </div>

      {/* Form Fields */}
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            placeholder="Enter your email"
            required
            disabled
          />
          <span className="input-hint">Email cannot be changed</span>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={profile.phone}
            onChange={handleProfileChange}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={profile.dateOfBirth}
            onChange={handleProfileChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={profile.gender}
            onChange={handleProfileChange}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          name="bio"
          value={profile.bio}
          onChange={handleProfileChange}
          placeholder="Tell us a little about yourself..."
          rows={4}
          maxLength={500}
        />
        <span className="input-hint">{profile.bio.length}/500 characters</span>
      </div>

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Saving...
          </>
        ) : (
          <>
            <Save size={18} />
            Save Changes
          </>
        )}
      </button>
    </form>
  );

  const renderSecurityTab = () => {
    const strength = getPasswordStrength(passwordForm.newPassword);

    return (
      <div className="security-section">
        <div className="section-header">
          <Shield size={24} />
          <div>
            <h3>Change Password</h3>
            <p>Keep your account secure with a strong password</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="password-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                id="currentPassword"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPasswords((prev) => ({ ...prev, current: !prev.current }))
                }
                aria-label={showPasswords.current ? 'Hide password' : 'Show password'}
              >
                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                required
                minLength={8}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                }
                aria-label={showPasswords.new ? 'Hide password' : 'Show password'}
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordForm.newPassword && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: strength.width,
                      backgroundColor: strength.color,
                    }}
                  />
                </div>
                <span style={{ color: strength.color }}>
                  Password strength: {strength.level}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
                }
                aria-label={showPasswords.confirm ? 'Hide password' : 'Show password'}
              >
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordForm.confirmPassword &&
              passwordForm.newPassword !== passwordForm.confirmPassword && (
                <span className="input-error">Passwords do not match</span>
              )}
            {passwordForm.confirmPassword &&
              passwordForm.newPassword === passwordForm.confirmPassword && (
                <span className="input-success">
                  <CheckCircle size={14} /> Passwords match
                </span>
              )}
          </div>

          <div className="password-requirements">
            <h4>Password Requirements:</h4>
            <ul>
              <li className={passwordForm.newPassword.length >= 8 ? 'met' : ''}>
                <CheckCircle size={14} /> At least 8 characters
              </li>
              <li
                className={
                  /[a-z]/.test(passwordForm.newPassword) &&
                  /[A-Z]/.test(passwordForm.newPassword)
                    ? 'met'
                    : ''
                }
              >
                <CheckCircle size={14} /> Upper & lowercase letters
              </li>
              <li className={/\d/.test(passwordForm.newPassword) ? 'met' : ''}>
                <CheckCircle size={14} /> At least one number
              </li>
              <li
                className={
                  /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword) ? 'met' : ''
                }
              >
                <CheckCircle size={14} /> At least one special character
              </li>
            </ul>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              saving ||
              !passwordForm.currentPassword ||
              !passwordForm.newPassword ||
              passwordForm.newPassword !== passwordForm.confirmPassword
            }
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Updating...
              </>
            ) : (
              <>
                <Shield size={18} />
                Update Password
              </>
            )}
          </button>
        </form>

        <div className="security-info">
          <AlertCircle size={20} />
          <div>
            <h4>Security Tips</h4>
            <ul>
              <li>Never share your password with anyone</li>
              <li>Use a unique password for this account</li>
              <li>Consider using a password manager</li>
              <li>Enable two-factor authentication when available</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderStatsTab = () => (
    <div className="stats-section">
      <div className="section-header">
        <BarChart3 size={24} />
        <div>
          <h3>Your Activity Statistics</h3>
          <p>Track your engagement and progress on MindCure</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon sessions">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.totalSessions || 0}</span>
            <span className="stat-label">Total Sessions</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon messages">
            <MessageSquare size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.totalMessages || 0}</span>
            <span className="stat-label">Chat Messages</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon appointments">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.totalAppointments || 0}</span>
            <span className="stat-label">Appointments</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon resources">
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.resourcesViewed || 0}</span>
            <span className="stat-label">Resources Viewed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon moods">
            <Heart size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.moodCheckIns || 0}</span>
            <span className="stat-label">Mood Check-ins</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon member">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {calculateDaysSince(stats?.memberSince || user?.createdAt)}
            </span>
            <span className="stat-label">Days as Member</span>
          </div>
        </div>
      </div>

      <div className="member-since">
        <p>
          Member since: <strong>{formatDate(stats?.memberSince || user?.createdAt)}</strong>
        </p>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account settings and preferences</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`profile-alert ${message.type}`}>
            {message.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="profile-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          {activeTab === 'personal' && renderPersonalTab()}
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'stats' && renderStatsTab()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
