import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import apiClient, {
  clearAuth,
  setAccessToken,
  setRefreshHandler
} from '../lib/apiClient.js';

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'mental-health-app.auth';

const getStoredAuth = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Failed to parse stored auth state:', error);
    return null;
  }
};

const persistAuthState = (user, token) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (user && token) {
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ user, token })
    );
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const storedAuthRef = useRef(getStoredAuth());
  const [currentUser, setCurrentUser] = useState(storedAuthRef.current?.user ?? null);
  const [userProfile, setUserProfile] = useState(storedAuthRef.current?.user ?? null);
  const [loading, setLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const accessTokenRef = useRef(storedAuthRef.current?.token ?? null);

  const clearAuthState = useCallback(() => {
    clearAuth();
    accessTokenRef.current = null;
    storedAuthRef.current = null;
    setCurrentUser(null);
    setUserProfile(null);
    persistAuthState(null, null);
  }, []);

  const handleAuthSuccess = useCallback((user, token) => {
    accessTokenRef.current = token;
    storedAuthRef.current = { user, token };
    setAccessToken(token);
    setCurrentUser(user);
    setUserProfile(user);
    persistAuthState(user, token);
    return user;
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const { data } = await apiClient.post('/auth/refresh');
      const { user, accessToken } = data;
      handleAuthSuccess(user, accessToken);
      return accessToken;
    } catch (error) {
      clearAuthState();
      throw error;
    }
  }, [clearAuthState, handleAuthSuccess]);

  const signup = useCallback(
    async (email, password, { firstName, lastName, role } = {}) => {
      setLoading(true);
      try {
        const { data } = await apiClient.post('/auth/signup', {
          email,
          password,
          firstName,
          lastName,
          role
        });
        const { user, accessToken } = data;
        return handleAuthSuccess(user, accessToken);
      } catch (error) {
        throw error.response?.data?.message || 'Unable to create account';
      } finally {
        setLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  const signin = useCallback(
    async (email, password) => {
      setLoading(true);
      try {
        const { data } = await apiClient.post('/auth/login', {
          email,
          password
        });
        const { user, accessToken } = data;
        return handleAuthSuccess(user, accessToken);
      } catch (error) {
        throw error.response?.data?.message || 'Invalid email or password';
      } finally {
        setLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      clearAuthState();
    }
  }, [clearAuthState]);

  const updateUserProfile = useCallback((updates) => {
    setCurrentUser((prev) => {
      if (!prev) {
        return prev;
      }
      const nextUser = { ...prev, ...updates };
      storedAuthRef.current = storedAuthRef.current
        ? { user: nextUser, token: storedAuthRef.current.token }
        : { user: nextUser, token: accessTokenRef.current };
      persistAuthState(nextUser, accessTokenRef.current);
      return nextUser;
    });

    setUserProfile((prev) => {
      if (!prev) {
        return prev;
      }
      return { ...prev, ...updates };
    });
  }, []);

  useEffect(() => {
    const initialiseAuth = async () => {
      if (accessTokenRef.current) {
        setAccessToken(accessTokenRef.current);
      }

      if (!storedAuthRef.current?.token) {
        setAuthReady(true);
        return;
      }

      try {
        await refreshSession();
      } catch (error) {
        console.warn('Session refresh failed:', error);
      } finally {
        setAuthReady(true);
      }
    };

    initialiseAuth();
    // No cleanup required beyond axios interceptor reset handled in clearAuthState
  }, [refreshSession]);

  useEffect(() => {
    setRefreshHandler(() => refreshSession);
  }, [refreshSession, currentUser]);

  const value = useMemo(
    () => ({
      currentUser,
      userProfile,
      loading,
      authReady,
      signup,
      signin,
      logout,
      refreshSession,
      updateUserProfile
    }),
    [authReady, currentUser, loading, logout, refreshSession, signin, signup, updateUserProfile, userProfile]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};