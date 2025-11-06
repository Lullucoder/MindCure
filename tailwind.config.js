/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // WCAG AA compliant colors for better accessibility
        accessible: {
          // Text colors that meet 4.5:1 contrast ratio on white
          'text-primary': '#1a365d',     // Dark blue, 7.8:1 ratio
          'text-secondary': '#2d3748',   // Dark gray, 9.4:1 ratio  
          'text-muted': '#4a5568',       // Medium gray, 5.2:1 ratio
          'text-link': '#2b6cb0',        // Blue link, 4.9:1 ratio
          'text-link-hover': '#1a365d',  // Darker blue hover, 7.8:1 ratio
          
          // Interactive element colors with proper contrast
          'interactive-primary': '#2b6cb0',    // 4.9:1 ratio
          'interactive-primary-hover': '#1a365d', // 7.8:1 ratio
          'interactive-secondary': '#4a5568',  // 5.2:1 ratio
          'interactive-secondary-hover': '#2d3748', // 9.4:1 ratio
          
          // Background colors for interactive elements
          'bg-interactive': '#e2e8f0',         // Light background
          'bg-interactive-hover': '#cbd5e1',   // Hover background
          'bg-focus': '#fef5e7',               // Focus background (warm)
          
          // Status colors with proper contrast
          'success-text': '#22543d',     // Dark green, 6.5:1 ratio
          'success-bg': '#f0fff4',       // Light green background
          'warning-text': '#744210',     // Dark amber, 5.8:1 ratio  
          'warning-bg': '#fffbeb',       // Light amber background
          'error-text': '#742a2a',       // Dark red, 6.2:1 ratio
          'error-bg': '#fed7d7',         // Light red background
          
          // High contrast borders
          'border-primary': '#4a5568',   // Visible borders
          'border-focus': '#3182ce',     // Focus indicator
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}