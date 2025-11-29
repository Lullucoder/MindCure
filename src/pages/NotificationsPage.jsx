import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../lib/apiClient';
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  MessageSquare,
  Heart,
  AlertCircle,
  Info,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import '../styles/notifications.css';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/notifications');
      setNotifications(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Set mock notifications for demo
      setNotifications(getMockNotifications());
    } finally {
      setLoading(false);
    }
  };

  const getMockNotifications = () => [
    {
      _id: '1',
      type: 'appointment',
      title: 'Appointment Reminder',
      message: 'You have an upcoming appointment tomorrow at 10:00 AM',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    },
    {
      _id: '2',
      type: 'mood',
      title: 'Daily Check-in',
      message: "Don't forget to log your mood today!",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      _id: '3',
      type: 'message',
      title: 'New Message',
      message: 'Your counselor has sent you a message',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      _id: '4',
      type: 'system',
      title: 'Welcome to MindCure!',
      message: 'Thank you for joining us on your mental wellness journey',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    },
  ];

  const markAsRead = async (id) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Optimistic update even if API fails
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
      // Optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const deleteNotification = async (id) => {
    try {
      await apiClient.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Optimistic update
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    }
  };

  const clearAll = async () => {
    try {
      await apiClient.delete('/notifications');
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
      setNotifications([]);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="notification-icon appointment" />;
      case 'message':
        return <MessageSquare className="notification-icon message" />;
      case 'mood':
        return <Heart className="notification-icon mood" />;
      case 'alert':
        return <AlertCircle className="notification-icon alert" />;
      default:
        return <Info className="notification-icon system" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-loading">
          <Loader2 className="animate-spin" size={48} />
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        {/* Header */}
        <div className="notifications-header">
          <div className="header-left">
            <Link to="/dashboard" className="back-link">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1>
                <Bell size={28} />
                Notifications
                {unreadCount > 0 && (
                  <span className="unread-badge">{unreadCount}</span>
                )}
              </h1>
              <p>Stay updated with your activity</p>
            </div>
          </div>

          <div className="header-actions">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn btn-ghost"
                title="Mark all as read"
              >
                <CheckCheck size={18} />
                <span>Mark all read</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="btn btn-ghost danger"
                title="Clear all notifications"
              >
                <Trash2 size={18} />
                <span>Clear all</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="notifications-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </button>
          <button
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <BellOff size={64} />
              <h3>No notifications</h3>
              <p>
                {filter === 'all'
                  ? "You're all caught up!"
                  : `No ${filter} notifications`}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => !notification.read && markAsRead(notification._id)}
              >
                <div className="notification-icon-wrapper">
                  {getIcon(notification.type)}
                </div>

                <div className="notification-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span className="notification-time">
                    {formatTime(notification.createdAt)}
                  </span>
                </div>

                <div className="notification-actions">
                  {!notification.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification._id);
                      }}
                      className="action-btn"
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification._id);
                    }}
                    className="action-btn delete"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
