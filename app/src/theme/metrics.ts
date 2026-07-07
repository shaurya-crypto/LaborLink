import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const metrics = {
  screenWidth: width,
  screenHeight: height,
  
  // Border Radius
  radiusCard: 20,
  radiusButton: 18,
  radiusInput: 16,
  radiusBottomSheet: 28,
  radiusDialog: 24,
  radiusPill: 50,
  radiusS: 12,
  
  // Spacing
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Shadows (Apple-like soft shadows)
  shadows: {
    soft: {
      shadowColor: '#111827',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 3,
    },
    medium: {
      shadowColor: '#111827',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 6,
    }
  }
};
