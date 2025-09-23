/* 
// COMMENTED OUT FOR NON-AUTH VERSION
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
*/

// Temporary mock auth context for non-auth version
import { createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  // Return mock user data for non-auth version
  return {
    currentUser: { uid: 'mock-user-id', email: 'user@example.com' },
    userProfile: { name: 'Demo User', avatar: null },
    signup: () => Promise.resolve(),
    signin: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    loading: false,
    updateUserProfile: () => Promise.resolve()
  };
};

export const AuthProvider = ({ children }) => {
  /*
  // COMMENTED OUT FULL AUTH PROVIDER FOR NON-AUTH VERSION
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  const signup = async (email, password, userData) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      // Create user document in Firestore
      const userDoc = {
        uid: user.uid,
        email: user.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'student',
        createdAt: new Date().toISOString(),
        profile: {
          avatar: null,
          bio: '',
          preferences: {
            notifications: true,
            privacy: 'private'
          }
        }
      };

      await setDoc(doc(db, 'users', user.uid), userDoc);
      setUserProfile(userDoc);
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Sign in function
  const signin = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Sign out function
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      throw error;
    }
  };

  // Load user profile from Firestore
  const loadUserProfile = async (user) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        setUserProfile(userDocSnap.data());
      } else {
        // Create basic profile if it doesn't exist
        const basicProfile = {
          uid: user.uid,
          email: user.email,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ')[1] || '',
          role: 'student',
          createdAt: new Date().toISOString(),
          profile: {
            avatar: null,
            bio: '',
            preferences: {
              notifications: true,
              privacy: 'private'
            }
          }
        };
        await setDoc(userDocRef, basicProfile);
        setUserProfile(basicProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, updates, { merge: true });
      setUserProfile(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await loadUserProfile(user);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    signin,
    logout,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
  */
  
  // Simple wrapper that just renders children without auth
  return <>{children}</>;
};