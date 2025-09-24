

// --- MOCK IMPLEMENTATION FOR OFFLINE DEMO ---
const MOCK_DELAY = 500; // Simulate network latency

const getMockMoodData = () => {
  try {
    const data = localStorage.getItem('mockMoodEntries');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading mock mood data from localStorage:', error);
    return [];
  }
};

const saveMockMoodData = (data) => {
  try {
    localStorage.setItem('mockMoodEntries', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving mock mood data to localStorage:', error);
  }
};

const mockMoodService = {
  async addMoodEntry(userId, moodData) {
    return new Promise(resolve => {
      setTimeout(() => {
        let entries = getMockMoodData();
        const newEntry = {
          id: `mock_${Date.now()}`,
          userId,
          ...moodData,
          timestamp: moodData.timestamp || new Date(),
          createdAt: new Date()
        };
        entries.push(newEntry);
        saveMockMoodData(entries);
        resolve(newEntry);
      }, MOCK_DELAY);
    });
  },

  async getUserMoodEntries(userId, limitCount = 30) {
    return new Promise(resolve => {
      setTimeout(() => {
        const entries = getMockMoodData()
          .filter(entry => entry.userId === userId)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, limitCount);
        resolve(entries);
      }, MOCK_DELAY);
    });
  },

  async deleteMoodEntry(userId, entryId) {
    return new Promise(resolve => {
      setTimeout(() => {
        let entries = getMockMoodData();
        const filteredEntries = entries.filter(entry => !(entry.id === entryId && entry.userId === userId));
        saveMockMoodData(filteredEntries);
        resolve(true);
      }, MOCK_DELAY);
    });
  },

  async getMoodStatistics(userId, days = 30) {
    return new Promise(async (resolve) => {
        const entries = await this.getUserMoodEntries(userId, 100);
        
        if (entries.length === 0) {
          resolve({
            averageMood: 0, averageEnergy: 0, averageAnxiety: 0, averageSleep: 0,
            totalEntries: 0, moodTrend: 'stable', bestDay: null, worstDay: null,
            currentStreak: 0, commonTags: []
          });
          return;
        }

        const averageMood = entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length;
        const averageEnergy = entries.reduce((sum, entry) => sum + (entry.energy || 3), 0) / entries.length;
        const averageAnxiety = entries.reduce((sum, entry) => sum + (entry.anxiety || 3), 0) / entries.length;
        const averageSleep = entries.reduce((sum, entry) => sum + (entry.sleep || 3), 0) / entries.length;

        // Simplified trend and other stats for mock
        const firstMood = entries[entries.length - 1]?.mood || 3;
        const lastMood = entries[0]?.mood || 3;
        let moodTrend = 'stable';
        if (lastMood > firstMood) moodTrend = 'improving';
        if (lastMood < firstMood) moodTrend = 'declining';

        const allTags = entries.flatMap(entry => entry.tags || []);
        const tagCounts = allTags.reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {});
        const commonTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);

        resolve({
          averageMood, averageEnergy, averageAnxiety, averageSleep,
          totalEntries: entries.length,
          moodTrend,
          bestDay: entries.reduce((best, entry) => (!best || entry.mood > best.mood) ? entry : best, null),
          worstDay: entries.reduce((worst, entry) => (!worst || entry.mood < worst.mood) ? entry : worst, null),
          currentStreak: 0, // Streak calculation is complex, omitted in mock
          commonTags
        });
    });
  }
};


// Original Firebase implementation
const firebaseMoodService = {
  // Add a new mood entry
  async addMoodEntry(userId, moodData) {
    try {
      const entry = {
        userId,
        mood: moodData.mood,
        energy: moodData.energy || 3,
        anxiety: moodData.anxiety || 3,
        sleep: moodData.sleep || 3,
        notes: moodData.notes || '',
        tags: moodData.tags || [],
        timestamp: moodData.timestamp || new Date(),
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'moodEntries'), entry);
      return { id: docRef.id, ...entry };
    } catch (error) {
      console.error('Error adding mood entry:', error);
      throw error;
    }
  },

  // Get user's mood entries
  async getUserMoodEntries(userId, limitCount = 30) {
    try {
      const q = query(
        collection(db, 'moodEntries'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const entries = [];
      
      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() });
      });

      return entries;
    } catch (error) {
      console.error('Error fetching mood entries:', error);
      throw error;
    }
  },

  // Delete a mood entry
  async deleteMoodEntry(userId, entryId) {
    try {
      const entryRef = doc(db, 'moodEntries', entryId);
      await deleteDoc(entryRef);
      return true;
    } catch (error) {
      console.error('Error deleting mood entry:', error);
      throw error;
    }
  },

  // Get mood statistics
  async getMoodStatistics(userId, days = 30) {
    try {
      const entries = await this.getUserMoodEntries(userId, 100);
      
      if (entries.length === 0) {
        return {
          averageMood: 0,
          averageEnergy: 0,
          averageAnxiety: 0,
          averageSleep: 0,
          totalEntries: 0,
          moodTrend: 'stable',
          bestDay: null,
          worstDay: null,
          currentStreak: 0,
          commonTags: []
        };
      }

      // Calculate averages
      const averageMood = entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length;
      const averageEnergy = entries.reduce((sum, entry) => sum + (entry.energy || 3), 0) / entries.length;
      const averageAnxiety = entries.reduce((sum, entry) => sum + (entry.anxiety || 3), 0) / entries.length;
      const averageSleep = entries.reduce((sum, entry) => sum + (entry.sleep || 3), 0) / entries.length;

      // Determine mood trend
      const recentEntries = entries.slice(0, Math.min(7, entries.length));
      const olderEntries = entries.slice(Math.min(7, entries.length));
      
      let moodTrend = 'stable';
      if (recentEntries.length > 0 && olderEntries.length > 0) {
        const recentAvg = recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length;
        const olderAvg = olderEntries.reduce((sum, entry) => sum + entry.mood, 0) / olderEntries.length;
        
        if (recentAvg > olderAvg + 0.3) {
          moodTrend = 'improving';
        } else if (recentAvg < olderAvg - 0.3) {
          moodTrend = 'declining';
        }
      }

      // Find best and worst days
      const bestDay = entries.reduce((best, entry) => 
        (!best || entry.mood > best.mood) ? entry : best
      );
      
      const worstDay = entries.reduce((worst, entry) => 
        (!worst || entry.mood < worst.mood) ? entry : worst
      );

      // Get common tags
      const tagCounts = {};
      entries.forEach(entry => {
        if (entry.tags && Array.isArray(entry.tags)) {
          entry.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });

      const commonTags = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([tag]) => tag);

      return {
        averageMood: Number(averageMood.toFixed(1)),
        averageEnergy: Number(averageEnergy.toFixed(1)),
        averageAnxiety: Number(averageAnxiety.toFixed(1)),
        averageSleep: Number(averageSleep.toFixed(1)),
        totalEntries: entries.length,
        moodTrend,
        bestDay: bestDay ? {
          mood: bestDay.mood,
          date: bestDay.timestamp
        } : null,
        worstDay: worstDay ? {
          mood: worstDay.mood,
          date: worstDay.timestamp
        } : null,
        currentStreak: 0, // Simplified for now
        commonTags
      };
    } catch (error) {
      console.error('Error calculating mood statistics:', error);
      throw error;
    }
  },

  // Get mood insights
  async getMoodInsights(userId) {
    try {
      const stats = await this.getMoodStatistics(userId, 30);
      const insights = [];

      // Mood trend insights
      if (stats.moodTrend === 'improving') {
        insights.push({
          type: 'trend',
          title: 'Positive Trend! 📈',
          message: `Your mood has been improving. Average: ${stats.averageMood}/5`,
          suggestion: 'Keep up the great work! Note what activities help your mood.'
        });
      } else if (stats.moodTrend === 'declining') {
        insights.push({
          type: 'trend',
          title: 'Mood Declining 📉',
          message: `Your mood has been lower recently. Average: ${stats.averageMood}/5`,
          suggestion: 'Consider talking to someone or practicing self-care.'
        });
      }

      // Energy insights
      if (stats.averageEnergy < 2.5) {
        insights.push({
          type: 'recommendation',
          title: 'Low Energy 🔋',
          message: 'You\'ve been experiencing low energy levels.',
          suggestion: 'Try gentle exercise or ensure better sleep quality.'
        });
      }

      // Anxiety insights
      if (stats.averageAnxiety > 3.5) {
        insights.push({
          type: 'recommendation',
          title: 'Anxiety Support 🧘‍♀️',
          message: 'Your anxiety levels have been higher than usual.',
          suggestion: 'Consider meditation or speaking with a counselor.'
        });
      }

      return insights;
    } catch (error) {
      console.error('Error generating mood insights:', error);
      return [];
    }
  }
};

// In an offline demo scenario, we use the mock service.
// To switch back to Firebase, change this to firebaseMoodService.
export default mockMoodService;