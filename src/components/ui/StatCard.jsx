/**
 * Stat card component for displaying metrics
 * 
 * @example
 * <StatCard
 *   title="Total Entries"
 *   value={42}
 *   icon={BarChart}
 *   trend="+12%"
 *   trendUp
 * />
 */

import { TrendingUp, TrendingDown } from 'lucide-react';

const colorSchemes = {
  primary: {
    bg: 'bg-gradient-to-br from-primary-50 to-primary-100',
    icon: 'bg-primary-100 text-primary-600',
    value: 'text-primary-600',
  },
  secondary: {
    bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
    icon: 'bg-emerald-100 text-emerald-600',
    value: 'text-emerald-600',
  },
  accent: {
    bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
    icon: 'bg-orange-100 text-orange-600',
    value: 'text-orange-600',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
    icon: 'bg-purple-100 text-purple-600',
    value: 'text-purple-600',
  },
  neutral: {
    bg: 'bg-white',
    icon: 'bg-gray-100 text-gray-600',
    value: 'text-gray-800',
  },
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp = true,
  color = 'neutral',
  className = '',
}) => {
  const scheme = colorSchemes[color] || colorSchemes.neutral;

  return (
    <div className={`rounded-2xl shadow-lg p-6 ${scheme.bg} ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${scheme.value}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-xl ${scheme.icon}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1">
          {trendUp ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
          <span className="text-sm text-gray-500">vs last week</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
