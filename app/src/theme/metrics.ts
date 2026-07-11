import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const metrics = {
  screenWidth: width,
  screenHeight: height,
  tabletMaxWidth: 768,
  
  // Border Radius
  radiusCard: 24, 
  radiusButton: 18,
  radiusInput: 18,
  radiusBottomSheet: 32,
  radiusDialog: 24,
  radiusDock: 32,
  radiusPill: 999,
  radiusS: 12,
  
  // Accessibility
  touchTarget: 44,

  // Spacing (Strict 8px system)
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  // Animation Timing Tokens (ms)
  animation: {
    fast: 150,
    normal: 250,
    slow: 400,
    spring: { damping: 15, stiffness: 120 },
    springBouncy: { damping: 12, stiffness: 180 },
    staggerDelay: 40, // per-item stagger for lists
  },

  // Z-Index Scale
  zIndex: {
    base: 0,
    card: 10,
    header: 40,
    modal: 100,
    toast: 200,
    dock: 50,
  },
  
  // Premium Shadows (Dark Theme)
  shadows: {
    soft: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 4,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.20,
      shadowRadius: 24,
      elevation: 8,
    },
    glow: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.35,
      shadowRadius: 20,
      elevation: 10,
    },
    glass: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.30,
      shadowRadius: 60,
      elevation: 20,
    },
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 40,
      elevation: 10,
    },
    dock: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 24 },
      shadowOpacity: 0.40,
      shadowRadius: 40,
      elevation: 24,
    }
  }
};

