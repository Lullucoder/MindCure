import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';

const moodService = {
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

      // Calculate trend
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

export default moodService;