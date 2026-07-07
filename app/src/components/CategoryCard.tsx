import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors, typography, metrics } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';

interface CategoryCardProps {
  name: string;
  iconName: string;
  onPress: () => void;
  selected?: boolean;
}

export const CategoryCard = ({ name, iconName, onPress, selected = false }: CategoryCardProps) => {
  return (
    <TouchableOpacity 
      style={[styles.container, selected && styles.containerSelected]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconWrapper, selected && styles.iconWrapperSelected]}>
        <Icon name={iconName} size={24} color={selected ? colors.primary : colors.textSecondary} />
      </View>
      <Text style={[styles.name, selected && styles.nameSelected]} numberOfLines={1}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    alignItems: 'center',
    marginRight: metrics.spacing.m,
  },
  containerSelected: {
    // Optional container styles for selection
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.s,
    ...metrics.shadows.soft,
  },
  iconWrapperSelected: {
    backgroundColor: colors.primary + '1A',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  name: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  nameSelected: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.semiBold,
  }
});
