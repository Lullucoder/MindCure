/**
 * Date formatting utilities
 */

/**
 * Format a date for display
 * @param {Date|string} date - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 */
export const formatDate = (date, options = {}) => {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const defaultOptions = {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  
  return d.toLocaleDateString('en-US', defaultOptions);
};

/**
 * Format time for display
 */
export const formatTime = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Get relative date label (Today, Yesterday, or formatted date)
 */
export const getRelativeDateLabel = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(d, today)) return 'Today';
  if (isSameDay(d, yesterday)) return 'Yesterday';
  
  return formatDate(d);
};

/**
 * Check if a date is today
 */
export const isToday = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const today = new Date();
  
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
};

/**
 * Get the start of a day
 */
export const startOfDay = (date) => {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get the end of a day
 */
export const endOfDay = (date) => {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get days between two dates
 */
export const daysBetween = (date1, date2) => {
  const d1 = startOfDay(date1);
  const d2 = startOfDay(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
