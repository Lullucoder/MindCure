import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import SelfHelpResources from './pages/SelfHelpResources';
import CrisisPage from './pages/CrisisPage';
import TherapyChatInterface from './components/chat/TherapyChatInterface';
import AppointmentBooking from './pages/AppointmentBooking';
import SupportGroups from './pages/SupportGroups';
import AdminDashboard from './pages/AdminDashboard';
import CounselorDashboard from './pages/CounselorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ProfilePage from './pages/ProfilePage';
import UserProfilePage from './pages/UserProfilePage';

// Placeholder components for routes that will be implemented later
const SettingsPage = () => <div className="p-8 text-center">Settings - Coming Soon!</div>;

// Role-based dashboard redirect component
const RoleBasedDashboard = () => {
  const { userProfile } = useAuth();

  if (!userProfile) return <Navigate to="/login" replace />;

  switch (userProfile.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'counselor':
      return <CounselorDashboard />;
    case 'student':
    default:
      return <StudentDashboard />;
  }
};

// Protected route for specific roles
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { userProfile } = useAuth();

  if (!userProfile) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(userProfile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <Layout>
              <LandingPage />
            </Layout>
          } />

          <Route path="/login" element={
            <Layout showFooter={false} showCrisisRibbon={false}>
              <Login />
            </Layout>
          } />

          <Route path="/register" element={
            <Layout showFooter={false} showCrisisRibbon={false}>
              <Register />
            </Layout>
          } />

          {/* Role-based Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <RoleBasedDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Counselor-only routes */}
          <Route path="/counselor" element={
            <ProtectedRoute>
              <Layout>
                <RoleProtectedRoute allowedRoles={['counselor', 'admin']}>
                  <CounselorDashboard />
                </RoleProtectedRoute>
              </Layout>
            </ProtectedRoute>
          } />

          {/* Admin-only routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <Layout>
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleProtectedRoute>
              </Layout>
            </ProtectedRoute>
          } />

          {/* Student routes (accessible by all authenticated users) */}
          <Route path="/student" element={
            <ProtectedRoute>
              <Layout>
                <StudentDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/chat" element={
            <ProtectedRoute>
              <Layout>
                <TherapyChatInterface />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/mood" element={
            <ProtectedRoute>
              <Layout>
                <MoodTracker />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/resources" element={
            <ProtectedRoute>
              <Layout>
                <SelfHelpResources />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* User Profile - View other users */}
          <Route path="/user/:userId" element={
            <ProtectedRoute>
              <Layout>
                <UserProfilePage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/crisis" element={
            <Layout>
              <CrisisPage />
            </Layout>
          } />

          {/* Legacy routes - redirect to dashboard for role-based handling */}
          <Route path="/appointments" element={
            <ProtectedRoute>
              <Layout>
                <StudentDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/forum" element={
            <ProtectedRoute>
              <Layout>
                <StudentDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Redirect to dashboard instead of home for demo */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
