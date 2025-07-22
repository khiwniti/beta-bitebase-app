/**
 * BiteBase Theme Configuration
 * Consistent theme colors and styles across the application
 */

export const bitebaseTheme = {
  // Primary Brand Colors (BiteBase Mantis Green)
  primary: {
    50: '#f0f9ee',
    100: '#e8f5e5',
    200: '#c8e6c0',
    300: '#a8d79b',
    400: '#8ed080',
    500: '#74C365', // Main brand color
    600: '#5fa854',
    700: '#4a8d43',
    800: '#357232',
    900: '#205721',
  },

  // Accent Colors
  accent: {
    red: {
      light: '#f8e6e3',
      main: '#E23D28',
      dark: '#c73520',
    },
    saffron: {
      light: '#fef7e0',
      main: '#F4C431',
      dark: '#e0b02a',
    }
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #74C365 0%, #5fa854 100%)',
    primaryLight: 'linear-gradient(135deg, #f0f9ee 0%, #e8f5e5 50%, #c8e6c0 100%)',
    primaryDark: 'linear-gradient(135deg, #357232 0%, #4a8d43 50%, #5fa854 100%)',
    brand: 'linear-gradient(135deg, #74C365 0%, #E23D28 50%, #F4C431 100%)',
  },

  // Component Styles
  components: {
    button: {
      primary: 'bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors',
      secondary: 'bg-white border border-green-600 text-green-600 hover:bg-green-50 font-medium px-4 py-2 rounded-lg transition-colors',
      accent: 'bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors',
    },
    input: {
      default: 'border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent',
      search: 'pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent',
    },
    card: {
      default: 'bg-white rounded-lg shadow-sm border border-gray-200',
      hover: 'bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow',
      primary: 'bg-green-50 rounded-lg border border-green-200',
    },
    text: {
      primary: 'text-green-900',
      secondary: 'text-green-700',
      muted: 'text-green-600',
      light: 'text-green-500',
    }
  },

  // Page Backgrounds
  backgrounds: {
    light: 'bg-gray-50',
    primaryLight: 'linear-gradient(135deg, #f0f9ee 0%, #e8f5e5 50%, #c8e6c0 100%)',
    primaryDark: 'linear-gradient(135deg, #357232 0%, #4a8d43 50%, #5fa854 100%)',
    dashboard: 'bg-gradient-to-br from-green-50 to-green-100',
  }
};

// Utility functions for theme usage
export const getThemeColor = (color: string, shade: number = 500) => {
  return bitebaseTheme.primary[shade as keyof typeof bitebaseTheme.primary] || color;
};

export const getGradient = (type: keyof typeof bitebaseTheme.gradients) => {
  return bitebaseTheme.gradients[type];
};

export const getComponentStyle = (component: string, variant: string = 'default') => {
  const comp = bitebaseTheme.components[component as keyof typeof bitebaseTheme.components];
  return comp ? comp[variant as keyof typeof comp] : '';
};

// CSS Custom Properties for dynamic theming
export const cssVariables = `
  :root {
    --bitebase-primary: #74C365;
    --bitebase-primary-dark: #5fa854;
    --bitebase-primary-light: #e8f5e5;
    --bitebase-accent-red: #E23D28;
    --bitebase-accent-saffron: #F4C431;
    --bitebase-gradient-primary: linear-gradient(135deg, #74C365 0%, #5fa854 100%);
    --bitebase-gradient-dark: linear-gradient(135deg, #357232 0%, #4a8d43 50%, #5fa854 100%);
    --bitebase-gradient-light: linear-gradient(135deg, #f0f9ee 0%, #e8f5e5 50%, #c8e6c0 100%);
  }
`;

export default bitebaseTheme;