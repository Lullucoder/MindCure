import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';
import CommunityForum from '../components/community/CommunityForum';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Resource form
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    content: '',
    type: 'article',
    category: 'general',
    url: '',
    duration: '',
    isFeatured: false
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }
    fetchDashboardData();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'appointments') fetchAppointments();
    if (activeTab === 'resources') fetchResources();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { users } = await adminService.getUsers();
      setUsers(users);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const fetchAppointments = async () => {
    try {
      const { appointments } = await adminService.getAppointments();
      setAppointments(appointments);
    } catch (err) {
      setError('Failed to load appointments');
    }
  };

  const fetchResources = async () => {
    try {
      const { resources } = await adminService.getResources();
      setResources(resources);
    } catch (err) {
      setError('Failed to load resources');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  const handleSaveResource = async (e) => {
    e.preventDefault();
    try {
      if (editingResource) {
        await adminService.updateResource(editingResource._id, resourceForm);
      } else {
        await adminService.createResource(resourceForm);
      }
      setShowResourceForm(false);
      setEditingResource(null);
      setResourceForm({
        title: '',
        description: '',
        content: '',
        type: 'article',
        category: 'general',
        url: '',
        duration: '',
        isFeatured: false
      });
      fetchResources();
    } catch (err) {
      setError('Failed to save resource');
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await adminService.deleteResource(resourceId);
      fetchResources();
    } catch (err) {
      setError('Failed to delete resource');
    }
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setResourceForm({
      title: resource.title,
      description: resource.description,
      content: resource.content || '',
      type: resource.type,
      category: resource.category,
      url: resource.url || '',
      duration: resource.duration || '',
      isFeatured: resource.isFeatured
    });
    setShowResourceForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <span className="text-5xl mb-4 block">🚫</span>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'users', label: '👥 Users', icon: '👥' },
    { id: 'appointments', label: '📅 Appointments', icon: '📅' },
    { id: 'resources', label: '📚 Resources', icon: '📚' },
    { id: 'community', label: '💬 Community', icon: '💬' },
  ];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🛠️ Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, appointments, and resources</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
          <button onClick={() => setError('')} className="ml-4 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
              <p className="text-blue-100 text-sm">Total Users</p>
              <p className="text-3xl font-bold">{stats.stats.totalUsers}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
              <p className="text-green-100 text-sm">Students</p>
              <p className="text-3xl font-bold">{stats.stats.totalStudents}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
              <p className="text-purple-100 text-sm">Counselors</p>
              <p className="text-3xl font-bold">{stats.stats.totalCounselors}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
              <p className="text-orange-100 text-sm">Pending Appointments</p>
              <p className="text-3xl font-bold">{stats.stats.pendingAppointments}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Appointments */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Recent Appointments</h3>
              {stats.recentAppointments?.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No appointments yet</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentAppointments?.map((apt) => (
                    <div key={apt._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {apt.student?.firstName} → {apt.counselor?.firstName}
                        </p>
                        <p className="text-sm text-gray-500">{formatDate(apt.date)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Posts */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Recent Forum Posts</h3>
              {stats.recentPosts?.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No posts yet</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentPosts?.map((post) => (
                    <div key={post._id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                      <p className="text-sm text-gray-500">
                        by {post.author?.firstName || 'Anonymous'} • {formatDate(post.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">User</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Role</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Joined</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <span className="font-medium text-gray-900">
                        {u.firstName} {u.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${
                        u.role === 'admin' ? 'bg-red-100 text-red-800' :
                        u.role === 'counselor' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}
                      disabled={u._id === user.id}
                    >
                      <option value="student">Student</option>
                      <option value="counselor">Counselor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{formatDate(u.createdAt)}</td>
                  <td className="px-6 py-4">
                    {u._id === user.id ? (
                      <span className="text-xs text-gray-400">You</span>
                    ) : (
                      <button className="text-indigo-600 hover:underline text-sm">View</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Student</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Counselor</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Time</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Type</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No appointments found
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {apt.student?.firstName} {apt.student?.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {apt.counselor?.firstName} {apt.counselor?.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(apt.date)}</td>
                    <td className="px-6 py-4 text-gray-600">{apt.timeSlot}</td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{apt.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Mental Health Resources</h2>
            <button
              onClick={() => {
                setEditingResource(null);
                setResourceForm({
                  title: '',
                  description: '',
                  content: '',
                  type: 'article',
                  category: 'general',
                  url: '',
                  duration: '',
                  isFeatured: false
                });
                setShowResourceForm(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              ➕ Add Resource
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.length === 0 ? (
              <div className="col-span-full bg-gray-50 rounded-xl p-8 text-center">
                <span className="text-4xl mb-4 block">📚</span>
                <p className="text-gray-600">No resources added yet</p>
              </div>
            ) : (
              resources.map((resource) => (
                <div key={resource._id} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      resource.isFeatured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {resource.type}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditResource(resource)}
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteResource(resource._id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                    <span className="capitalize">{resource.category}</span>
                    {resource.duration && <span>• {resource.duration}</span>}
                    <span>• {resource.views} views</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Resource Form Modal */}
      {showResourceForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {editingResource ? 'Edit Resource' : 'Add New Resource'}
                </h2>
                <button
                  onClick={() => setShowResourceForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveResource} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={resourceForm.type}
                    onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="article">Article</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="pdf">PDF</option>
                    <option value="link">External Link</option>
                    <option value="exercise">Exercise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={resourceForm.category}
                    onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="general">General</option>
                    <option value="anxiety">Anxiety</option>
                    <option value="depression">Depression</option>
                    <option value="stress">Stress</option>
                    <option value="sleep">Sleep</option>
                    <option value="relationships">Relationships</option>
                    <option value="self-esteem">Self-Esteem</option>
                    <option value="mindfulness">Mindfulness</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content (for articles)</label>
                <textarea
                  value={resourceForm.content}
                  onChange={(e) => setResourceForm({ ...resourceForm, content: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL (for links/videos)</label>
                  <input
                    type="url"
                    value={resourceForm.url}
                    onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={resourceForm.duration}
                    onChange={(e) => setResourceForm({ ...resourceForm, duration: e.target.value })}
                    placeholder="e.g., 5 min read, 10 min video"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={resourceForm.isFeatured}
                  onChange={(e) => setResourceForm({ ...resourceForm, isFeatured: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600"
                />
                <span className="text-gray-700">Featured resource</span>
              </label>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowResourceForm(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {editingResource ? 'Save Changes' : 'Create Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Community Tab */}
      {activeTab === 'community' && <CommunityForum />}
    </div>
  );
};

export default AdminDashboard;
