/**
 * App.jsx - Main Application Entry Point
 * 
 * Features:
 * - Centralized routing with lazy loading
 * - Role-based access control
 * - Error boundary for graceful error handling
 * - Authentication context provider
 */

import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import PageLoader from './components/ui/PageLoader';

// ============================================
// Lazy-loaded Pages for Code Splitting
// ============================================
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const MoodTracker = lazy(() => import('./pages/MoodTracker'));
const SelfHelpResources = lazy(() => import('./pages/SelfHelpResources'));
const CrisisPage = lazy(() => import('./pages/CrisisPage'));
const TherapyChatInterface = lazy(() => import('./components/chat/TherapyChatInterface'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CounselorDashboard = lazy(() => import('./pages/CounselorDashboard'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// ============================================
// Role-Based Dashboard Component
// ============================================
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

// ============================================
// Role-Protected Route Guard
// ============================================
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { userProfile } = useAuth();

  if (!userProfile) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(userProfile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// ============================================
// Route Configuration
// ============================================
const publicRoutes = [
  { path: '/', element: <LandingPage />, layout: { showFooter: true, showCrisisRibbon: true } },
  { path: '/login', element: <Login />, layout: { showFooter: false, showCrisisRibbon: false } },
  { path: '/register', element: <Register />, layout: { showFooter: false, showCrisisRibbon: false } },
  { path: '/crisis', element: <CrisisPage />, layout: { showFooter: true, showCrisisRibbon: true } },
];

const protectedRoutes = [
  { path: '/dashboard', element: <RoleBasedDashboard /> },
  { path: '/student', element: <StudentDashboard /> },
  { path: '/chat', element: <TherapyChatInterface /> },
  { path: '/mood', element: <MoodTracker /> },
  { path: '/resources', element: <SelfHelpResources /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/user/:userId', element: <UserProfilePage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/notifications', element: <NotificationsPage /> },
  { path: '/appointments', element: <StudentDashboard /> },
  { path: '/forum', element: <StudentDashboard /> },
];

const roleProtectedRoutes = [
  { path: '/counselor', element: <CounselorDashboard />, allowedRoles: ['counselor', 'admin'] },
  { path: '/admin', element: <AdminDashboard />, allowedRoles: ['admin'] },
];

// ============================================
// Main App Component
// ============================================
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              {publicRoutes.map(({ path, element, layout }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <Layout
                      showFooter={layout?.showFooter ?? true}
                      showCrisisRibbon={layout?.showCrisisRibbon ?? true}
                    >
                      {element}
                    </Layout>
                  }
                />
              ))}

              {/* Protected Routes */}
              {protectedRoutes.map(({ path, element }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ProtectedRoute>
                      <Layout>{element}</Layout>
                    </ProtectedRoute>
                  }
                />
              ))}

              {/* Role-Protected Routes */}
              {roleProtectedRoutes.map(({ path, element, allowedRoles }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <RoleProtectedRoute allowedRoles={allowedRoles}>
                          {element}
                        </RoleProtectedRoute>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              ))}

              {/* 404 Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
