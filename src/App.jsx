import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';  // Keep for minimal context
import Layout from './components/layout/Layout';
// import ProtectedRoute from './components/auth/ProtectedRoute';  // COMMENTED OUT FOR NON-AUTH VERSION

// Pages
import LandingPage from './pages/LandingPage';
// import Login from './components/auth/Login';  // COMMENTED OUT FOR NON-AUTH VERSION
// import Register from './components/auth/Register';  // COMMENTED OUT FOR NON-AUTH VERSION
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import SelfHelpResources from './pages/SelfHelpResources';
import CrisisPage from './pages/CrisisPage';
import ChatInterface from './components/chat/ChatInterface';

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

          {/* COMMENTED OUT LOGIN/REGISTER ROUTES FOR NON-AUTH VERSION
          <Route path="/login" element={
            <Layout showFooter={false}>
              <Login />
            </Layout>
          } />
          
          <Route path="/register" element={
            <Layout showFooter={false}>
              <Register />
            </Layout>
          } />
          */}

          {/* All Routes - Made accessible without protection for non-auth version */}
          <Route path="/dashboard" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />

          <Route path="/chat" element={
            <Layout>
              <ChatInterface />
            </Layout>
          } />

          <Route path="/mood" element={
            <Layout>
              <MoodTracker />
            </Layout>
          } />

          <Route path="/resources" element={
            <Layout>
              <SelfHelpResources />
            </Layout>
          } />

          <Route path="/crisis" element={
            <Layout>
              <CrisisPage />
            </Layout>
          } />

          <Route path="/profile" element={
            <Layout>
              <ProfilePage />
            </Layout>
          } />

          <Route path="/settings" element={
            <Layout>
              <SettingsPage />
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
