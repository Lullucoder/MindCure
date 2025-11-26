/**
 * String manipulation utilities
 */

/**
 * Capitalize the first letter of a string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert string to title case
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Truncate string with ellipsis
 */
export const truncate = (str, maxLength = 50) => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
};

/**
 * Generate initials from a name
 */
export const getInitials = (name, maxLength = 2) => {
  if (!name) return '';
  
  const parts = name.trim().split(/\s+/);
  const initials = parts.map(part => part[0]).join('');
  
  return initials.toUpperCase().slice(0, maxLength);
};

/**
 * Slugify a string for URLs
 */
export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Pluralize a word based on count
 */
export const pluralize = (word, count, plural) => {
  if (count === 1) return word;
  return plural || `${word}s`;
};
