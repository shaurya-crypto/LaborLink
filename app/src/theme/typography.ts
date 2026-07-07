import { Platform } from 'react-native';

export const typography = {
  fontFamily: {
    regular: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    medium: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    semiBold: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    bold: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
  },
  sizes: {
    h1: 28,
    h2: 24,
    h3: 20,
    body1: 16,
    body2: 14,
    caption: 12,
  },
  lineHeights: {
    h1: 34,
    h2: 30,
    h3: 26,
    body1: 24,
    body2: 20,
    caption: 16,
  }
};
