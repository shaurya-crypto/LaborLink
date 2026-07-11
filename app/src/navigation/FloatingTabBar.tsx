import React from 'react';
import { View, StyleSheet, TouchableOpacity, } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, withSpring, useDerivedValue, FadeIn, FadeOut } from 'react-native-reanimated';
import { Home, Search, Briefcase, MessageCircle, User, PlusCircle, Bookmark } from 'lucide-react-native';
import { colors, metrics } from '@/theme';

const TabIcon = ({ name, isFocused }: { name: string, isFocused: boolean }) => {
  const IconComponent = (() => {
    switch (name) {
      case 'HomeTab': return Home;
      case 'SearchTab': return Search;
      case 'ApplicationsTab': return Briefcase;
      case 'ChatTab': return MessageCircle;
      case 'ProfileTab': return User;
      case 'PostJobTab': return PlusCircle;
      case 'ManageJobsTab': return Briefcase;
      case 'ApplicantsTab': return User;
      case 'SavedTab': return Bookmark;
      default: return Home;
    }
  })();

  const animatedScale = useDerivedValue(() => {
    return withSpring(isFocused ? 1.2 : 1, { damping: 15 });
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: animatedScale.value }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <IconComponent 
        color={isFocused ? colors.primary : colors.textMuted} 
        size={24} 
        strokeWidth={isFocused ? 2.5 : 2}
      />
    </Animated.View>
  );
};

export const FloatingTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.dock}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.8}
            >
              <TabIcon name={route.name} isFocused={isFocused} />
              
              {isFocused && (
                <Animated.View 
                  style={styles.activeIndicator} 
                  entering={FadeIn.duration(200)}
                  exiting={FadeOut.duration(200)}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  dock: {
    flexDirection: 'row',
    backgroundColor: colors.headerGlass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: metrics.radiusDock,
    paddingHorizontal: metrics.spacing.s,
    paddingVertical: metrics.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    ...metrics.shadows.dock,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: metrics.spacing.s,
    marginHorizontal: metrics.spacing.xs,
    height: 54,
    width: 54,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  }
});
