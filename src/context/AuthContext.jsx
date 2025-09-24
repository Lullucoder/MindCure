

// Temporary mock auth context for non-auth version
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    name: 'Demo User',
    avatar: null,
    firstName: 'Demo',
    lastName: 'User',
    email: 'user@example.com',
    role: 'student',
    profile: {
      bio: 'This is a demo account. All data is stored locally.',
      preferences: {
        notifications: true,
        privacy: 'private'
      }
    }
  });

  const mockAuth = {
    currentUser: { uid: 'mock-user-id', email: 'user@example.com', displayName: 'Demo User' },
    userProfile,
    signup: () => Promise.resolve(),
    signin: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    loading: false,
    updateUserProfile: (updates) => {
      setUserProfile(prev => ({ ...prev, ...updates }));
      return Promise.resolve();
    }
  };
  
  return (
    <AuthContext.Provider value={mockAuth}>
      {children}
    </AuthContext.Provider>
  );
};