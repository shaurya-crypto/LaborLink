import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { colors, metrics, typography } from '@/theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  backgroundColor?: string;
  lightStatus?: boolean;
  noSafeArea?: boolean;
  title?: string; // New premium header title
  headerRight?: React.ReactNode;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  style,
  backgroundColor = colors.background,
  lightStatus = true, // Default to true for Dark Theme
  noSafeArea = false,
  title,
  headerRight,
}) => {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [40, 80], [0, 1], Extrapolate.CLAMP);
    const borderOpacity = interpolate(scrollY.value, [60, 80], [0, 0.3], Extrapolate.CLAMP);
    
    return {
      backgroundColor: `rgba(15, 23, 42, ${opacity * 0.9})`,
      borderBottomColor: `rgba(255, 255, 255, ${borderOpacity})`,
      borderBottomWidth: 1,
    };
  });

  const smallTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [60, 80], [0, 1], Extrapolate.CLAMP);
    const translateY = interpolate(scrollY.value, [60, 80], [10, 0], Extrapolate.CLAMP);
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const largeTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 50], [1, 0], Extrapolate.CLAMP);
    const translateY = interpolate(scrollY.value, [0, 50], [0, -15], Extrapolate.CLAMP);
    const scale = interpolate(scrollY.value, [-100, 0], [1.1, 1], Extrapolate.CLAMP);
    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  const content = (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {title && (
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <Animated.Text style={[styles.smallTitle, smallTitleStyle]} numberOfLines={1}>
            {title}
          </Animated.Text>
          {headerRight && <View style={styles.headerRight}>{headerRight}</View>}
        </Animated.View>
      )}

      {scrollable ? (
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={[
            styles.scrollContent,
            title && { paddingTop: 60 }, // Space for fixed header
            style
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {title && (
            <Animated.View style={[styles.largeTitleContainer, largeTitleStyle]}>
              <Animated.Text style={styles.largeTitle}>{title}</Animated.Text>
            </Animated.View>
          )}
          {children}
        </Animated.ScrollView>
      ) : (
        <View style={[styles.flex, title && { paddingTop: 60 }, style]}>
          {title && (
            <Animated.View style={[styles.largeTitleContainer, largeTitleStyle]}>
              <Animated.Text style={styles.largeTitle}>{title}</Animated.Text>
            </Animated.View>
          )}
          {children}
        </View>
      )}
    </KeyboardAvoidingView>
  );

  const Container = noSafeArea ? View : SafeAreaView;

  return (
    <Container style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={lightStatus ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.responsiveWrapper}>
        {content}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  responsiveWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 768,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  
  // Premium Header Styles
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: metrics.spacing.m,
  },
  smallTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerRight: {
    position: 'absolute',
    right: metrics.spacing.m,
  },
  largeTitleContainer: {
    paddingHorizontal: metrics.spacing.l,
    paddingTop: metrics.spacing.s,
    paddingBottom: metrics.spacing.m,
  },
  largeTitle: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: typography.sizes.hero, // 36px
    color: colors.textPrimary,
    letterSpacing: -1,
  }
});
