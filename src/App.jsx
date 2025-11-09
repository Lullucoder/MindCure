import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

// Placeholder components for routes that will be implemented later
const ProfilePage = () => <div className="p-8 text-center">Profile - Coming Soon!</div>;
const SettingsPage = () => <div className="p-8 text-center">Settings - Coming Soon!</div>;

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

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
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

          {/* Redirect to dashboard instead of home for demo */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
