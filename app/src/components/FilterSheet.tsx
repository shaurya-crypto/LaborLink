import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';
import { colors, typography, metrics } from '@/theme';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export const FilterSheet = ({ visible, onClose, onApply }: FilterSheetProps) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const categories = ['All', 'Electrician', 'Plumber', 'Carpenter', 'Welder', 'Driver'];

  const handleReset = () => {
    setSelectedCategory(null);
  };

  const handleApply = () => {
    onApply({ category: selectedCategory });
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Filter Jobs">
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.chipGroup}>
            {categories.map(cat => (
              <TouchableOpacity 
                key={cat} 
                style={[styles.chip, selectedCategory === cat && styles.chipSelected]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextSelected]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distance</Text>
          <Text style={styles.placeholderText}>Distance slider placeholder (Phase 1.2A)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Salary Range</Text>
          <Text style={styles.placeholderText}>Salary range placeholder (Phase 1.2A)</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Reset" variant="text" onPress={handleReset} style={styles.resetBtn} />
        <Button title="Apply Filters" onPress={handleApply} style={styles.applyBtn} />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  scroll: {
    maxHeight: 400,
  },
  section: {
    marginBottom: metrics.spacing.xl,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.m,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.s,
  },
  chip: {
    paddingHorizontal: metrics.spacing.m,
    paddingVertical: 8,
    borderRadius: metrics.radiusPill,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  chipSelected: {
    backgroundColor: colors.primary + '1A',
    borderColor: colors.primary,
  },
  chipText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.primaryDark,
  },
  placeholderText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: metrics.spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    gap: metrics.spacing.m,
  },
  resetBtn: {
    flex: 1,
  },
  applyBtn: {
    flex: 2,
  }
});
