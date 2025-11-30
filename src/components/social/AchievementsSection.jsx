/**
 * Achievements Section - Display user achievements and stats
 */

import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Star, 
  Flame, 
  Heart, 
  MessageCircle, 
  Users,
  Award,
  Target,
  Zap,
  Lock
} from 'lucide-react';
import achievementService from '../../services/achievementService';
import Spinner from '../ui/Spinner';

const ACHIEVEMENT_ICONS = {
  'first-checkin': Target,
  'streak-7': Flame,
  'streak-30': Flame,
  'mood-helper-1': Heart,
  'mood-helper-5': Heart,
  'mood-helper-10': Heart,
  'community-first-post': MessageCircle,
  'community-10-posts': MessageCircle,
  'first-message': MessageCircle,
  'first-friend': Users,
};

const TIER_STYLES = {
  gold: { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-700', icon: 'text-yellow-500' },
  silver: { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700', icon: 'text-gray-500' },
  bronze: { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-700', icon: 'text-orange-500' },
};

export default function AchievementsSection({ userId = null }) {
  const [achievements, setAchievements] = useState([]);
  const [definitions, setDefinitions] = useState([]);
  const [stats, setStats] = useState(null);
  const [totalXP, setTotalXP] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('earned');

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [achievementsData, definitionsData, statsData] = await Promise.all([
        achievementService.getMyAchievements(),
        achievementService.getDefinitions(),
        achievementService.getStatsSummary(),
      ]);
      
      setAchievements(achievementsData.achievements || []);
      setTotalXP(achievementsData.totalXP || 0);
      // Ensure definitions is always an array
      setDefinitions(Array.isArray(definitionsData) ? definitionsData : []);
      setStats(statsData || {});
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLevel = (xp) => {
    if (xp >= 1000) return { level: 5, title: 'Mental Health Champion', nextXP: null };
    if (xp >= 500) return { level: 4, title: 'Wellness Warrior', nextXP: 1000 };
    if (xp >= 200) return { level: 3, title: 'Support Star', nextXP: 500 };
    if (xp >= 50) return { level: 2, title: 'Rising Helper', nextXP: 200 };
    return { level: 1, title: 'Newcomer', nextXP: 50 };
  };

  const levelInfo = getLevel(totalXP);
  const progressToNext = levelInfo.nextXP 
    ? ((totalXP / levelInfo.nextXP) * 100).toFixed(0)
    : 100;

  const earnedIds = achievements.map(a => a.achievementId);
  const lockedAchievements = definitions.filter(d => !earnedIds.includes(d.id));

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Level Card */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">Level {levelInfo.level}</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
                {totalXP} XP
              </span>
            </div>
            <p className="text-primary-100">{levelInfo.title}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        {levelInfo.nextXP && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-primary-100 mb-1">
              <span>Progress to Level {levelInfo.level + 1}</span>
              <span>{totalXP} / {levelInfo.nextXP} XP</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <Flame className="w-5 h-5" />
              <span className="text-sm text-gray-500">Current Streak</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.currentStreak || 0}</p>
            <p className="text-xs text-gray-400">days</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <Target className="w-5 h-5" />
              <span className="text-sm text-gray-500">Total Check-ins</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.totalCheckIns || 0}</p>
            <p className="text-xs text-gray-400">entries</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <Heart className="w-5 h-5" />
              <span className="text-sm text-gray-500">Moods Fixed</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.moodsFixed || 0}</p>
            <p className="text-xs text-gray-400">helped</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <Users className="w-5 h-5" />
              <span className="text-sm text-gray-500">Friends Helped</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.friendsHelped || 0}</p>
            <p className="text-xs text-gray-400">friends</p>
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('earned')}
            className={`flex-1 py-4 px-4 font-medium transition-colors ${
              activeTab === 'earned'
                ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Trophy className="w-5 h-5 inline mr-2" />
            Earned ({achievements.length})
          </button>
          <button
            onClick={() => setActiveTab('locked')}
            className={`flex-1 py-4 px-4 font-medium transition-colors ${
              activeTab === 'locked'
                ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Lock className="w-5 h-5 inline mr-2" />
            Locked ({lockedAchievements.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'earned' ? (
            achievements.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No achievements earned yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Start your wellness journey to unlock achievements!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map(achievement => {
                  const def = definitions.find(d => d.id === achievement.achievementId) || {};
                  const tier = achievementService.getAchievementTier(def.xp || 0);
                  const tierStyle = TIER_STYLES[tier.tier];
                  const Icon = ACHIEVEMENT_ICONS[achievement.achievementId] || Award;
                  
                  return (
                    <div
                      key={achievement._id}
                      className={`p-4 rounded-xl border-2 ${tierStyle.bg} ${tierStyle.border}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-3 bg-white rounded-lg shadow-sm ${tierStyle.icon}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`font-semibold ${tierStyle.text}`}>
                              {def.name || achievement.achievementId}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${tierStyle.bg} ${tierStyle.text}`}>
                              +{def.xp || 0} XP
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {def.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            lockedAchievements.length === 0 ? (
              <div className="text-center py-8">
                <Star className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                <p className="text-gray-800 font-semibold">All achievements unlocked!</p>
                <p className="text-sm text-gray-500 mt-2">
                  You're a true Mental Health Champion! 🎉
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lockedAchievements.map(def => {
                  const tier = achievementService.getAchievementTier(def.xp || 0);
                  const Icon = ACHIEVEMENT_ICONS[def.id] || Award;
                  
                  return (
                    <div
                      key={def.id}
                      className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50 opacity-75"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-3 bg-gray-200 rounded-lg text-gray-400">
                          <Lock className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-500">{def.name}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-500">
                              +{def.xp} XP
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">
                            {def.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
