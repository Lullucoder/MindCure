/**
 * LocalStorage Utility
 * Centralized localStorage operations with type safety and error handling
 */

const STORAGE_PREFIX = 'mental-health-app';

/**
 * Storage keys used throughout the application
 */
export const STORAGE_KEYS = {
  AUTH: `${STORAGE_PREFIX}.auth`,
  USER_PREFERENCES: `${STORAGE_PREFIX}.preferences`,
  THEME: `${STORAGE_PREFIX}.theme`,
  ONBOARDING_COMPLETE: `${STORAGE_PREFIX}.onboarding`,
  RECENT_MOODS: `${STORAGE_PREFIX}.recent-moods`,
  DRAFT_POST: `${STORAGE_PREFIX}.draft-post`,
  NOTIFICATION_SETTINGS: `${STORAGE_PREFIX}.notifications`,
};

/**
 * Safely get item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Parsed value or default
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 * @returns {boolean} Success status
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Error writing localStorage key "${key}":`, error);
    // Handle quota exceeded
    if (error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded. Consider clearing old data.');
    }
    return false;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key to remove
 * @returns {boolean} Success status
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Clear all app-related items from localStorage
 * Only clears items with the app prefix
 */
export const clearAppStorage = () => {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.warn('Error clearing app storage:', error);
    return false;
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
export const isStorageAvailable = () => {
  try {
    const testKey = `${STORAGE_PREFIX}.test`;
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get storage usage info
 * @returns {{ used: number, available: boolean }}
 */
export const getStorageInfo = () => {
  let used = 0;
  try {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length * 2; // UTF-16 = 2 bytes per char
      }
    }
  } catch (error) {
    console.warn('Error calculating storage usage:', error);
  }
  
  return {
    used,
    usedKB: Math.round(used / 1024),
    available: isStorageAvailable(),
  };
};

// ============================================
// Specialized Storage Functions
// ============================================

/**
 * Get auth data from storage
 * @returns {{ user: object, accessToken: string, refreshToken: string } | null}
 */
export const getAuthData = () => {
  return getItem(STORAGE_KEYS.AUTH, null);
};

/**
 * Set auth data in storage
 * @param {object} authData - Auth data to store
 */
export const setAuthData = (authData) => {
  return setItem(STORAGE_KEYS.AUTH, authData);
};

/**
 * Clear auth data from storage
 */
export const clearAuthData = () => {
  return removeItem(STORAGE_KEYS.AUTH);
};

/**
 * Get user preferences
 * @returns {object}
 */
export const getPreferences = () => {
  return getItem(STORAGE_KEYS.USER_PREFERENCES, {
    notifications: true,
    soundEffects: true,
    reducedMotion: false,
    language: 'en',
  });
};

/**
 * Update user preferences
 * @param {object} preferences - Preferences to merge
 */
export const updatePreferences = (preferences) => {
  const current = getPreferences();
  return setItem(STORAGE_KEYS.USER_PREFERENCES, { ...current, ...preferences });
};

/**
 * Get theme preference
 * @returns {'light' | 'dark' | 'system'}
 */
export const getTheme = () => {
  return getItem(STORAGE_KEYS.THEME, 'system');
};

/**
 * Set theme preference
 * @param {'light' | 'dark' | 'system'} theme
 */
export const setTheme = (theme) => {
  return setItem(STORAGE_KEYS.THEME, theme);
};

/**
 * Save draft post for later
 * @param {object} draft - Draft post data
 */
export const saveDraftPost = (draft) => {
  return setItem(STORAGE_KEYS.DRAFT_POST, {
    ...draft,
    savedAt: new Date().toISOString(),
  });
};

/**
 * Get saved draft post
 * @returns {object | null}
 */
export const getDraftPost = () => {
  return getItem(STORAGE_KEYS.DRAFT_POST, null);
};

/**
 * Clear draft post
 */
export const clearDraftPost = () => {
  return removeItem(STORAGE_KEYS.DRAFT_POST);
};

export default {
  getItem,
  setItem,
  removeItem,
  clearAppStorage,
  isStorageAvailable,
  getStorageInfo,
  getAuthData,
  setAuthData,
  clearAuthData,
  getPreferences,
  updatePreferences,
  getTheme,
  setTheme,
  saveDraftPost,
  getDraftPost,
  clearDraftPost,
  STORAGE_KEYS,
};
