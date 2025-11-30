import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'moodEntries';

/**
 * Custom hook for managing mood data with localStorage persistence
 * Extracts all mood-related logic from MoodTracker component
 */
export const useMoodData = () => {
  const [entries, setEntries] = useLocalStorage(STORAGE_KEY, []);
  const [todayEntry, setTodayEntry] = useState(null);

  // Check for today's entry when entries change
  useEffect(() => {
    const today = new Date().toDateString();
    const todaysEntry = entries.find(
      (entry) => new Date(entry.date).toDateString() === today
    );
    setTodayEntry(todaysEntry || null);
  }, [entries]);

  // Add a new mood entry
  const addEntry = useCallback((entryData) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      ...entryData,
    };

    setEntries((prev) => [newEntry, ...prev]);
    return newEntry;
  }, [setEntries]);

  // Update an existing entry
  const updateEntry = useCallback((id, updates) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry
      )
    );
  }, [setEntries]);

  // Delete an entry
  const deleteEntry = useCallback((id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, [setEntries]);

  // Calculate streak (consecutive days)
  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateString = checkDate.toDateString();

      const hasEntry = entries.some(
        (entry) => new Date(entry.date).toDateString() === dateString
      );

      if (hasEntry) {
        count++;
      } else if (i > 0) {
        // Allow missing today, but break on any other gap
        break;
      }
    }

    return count;
  }, [entries]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (entries.length === 0) return null;

    const recent = entries.slice(0, 7);
    const avgMood = recent.reduce((sum, e) => sum + e.mood, 0) / recent.length;

    // Find most common emotion
    const emotionCount = {};
    entries.forEach((entry) => {
      entry.emotions?.forEach((emotion) => {
        emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
      });
    });

    const mostCommonEmotion = Object.entries(emotionCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || 'N/A';

    // Find most common activity
    const activityCount = {};
    entries.forEach((entry) => {
      entry.activities?.forEach((activity) => {
        activityCount[activity] = (activityCount[activity] || 0) + 1;
      });
    });

    const mostCommonActivity = Object.entries(activityCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || 'N/A';

    return {
      averageMood: Math.round(avgMood * 10) / 10,
      totalEntries: entries.length,
      streak,
      mostCommonEmotion,
      mostCommonActivity,
      weeklyEntries: recent.length,
    };
  }, [entries, streak]);

  // Get entries for a specific period
  const getEntriesForPeriod = useCallback((period) => {
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        return entries;
    }

    return entries.filter((entry) => new Date(entry.date) >= startDate);
  }, [entries]);

  // Clear all data
  const clearAllData = useCallback(() => {
    setEntries([]);
  }, [setEntries]);

  return {
    entries,
    todayEntry,
    stats,
    streak,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntriesForPeriod,
    clearAllData,
    hasEntryToday: !!todayEntry,
  };
};

export default useMoodData;
