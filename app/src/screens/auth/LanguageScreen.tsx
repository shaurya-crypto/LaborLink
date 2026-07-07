import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { ScreenContainer, Button } from '@/components';
import { colors, metrics, typography } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';
import { useAppStore } from '@/store/useAppStore';

export const LanguageScreen = () => {
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi'>('en');
  const { setLanguage } = useAppStore();

  const handleContinue = () => {
    setLanguage(selectedLang);
  };

  const LanguageCard = ({ code, label, nativeLabel }: any) => {
    const isSelected = selectedLang === code;
    return (
      <TouchableOpacity 
        style={[styles.card, isSelected && styles.cardSelected]} 
        onPress={() => setSelectedLang(code)}
        activeOpacity={0.8}
      >
        <View style={styles.cardLeft}>
          <Icon name="globe" size={24} color={isSelected ? colors.primary : colors.icons} />
          <View style={styles.textGroup}>
            <Text style={[styles.label, isSelected && styles.textSelected]}>{label}</Text>
            <Text style={[styles.nativeLabel, isSelected && styles.textSelected]}>{nativeLabel}</Text>
          </View>
        </View>
        {isSelected && <Icon name="check-circle" size={24} color={colors.primary} />}
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer backgroundColor={colors.surface} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <Icon name="globe" size={40} color={colors.primary} />
        </View>
        <Text style={styles.title}>Select Language</Text>
        <Text style={styles.subtitle}>Choose your preferred language</Text>
      </View>

      <View style={styles.content}>
        <LanguageCard code="en" label="English" nativeLabel="English" />
        <LanguageCard code="hi" label="Hindi" nativeLabel="हिंदी" />
      </View>

      <View style={styles.footer}>
        <Button title="Continue" onPress={handleContinue} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: metrics.spacing.l,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: metrics.spacing.xxl,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.l,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.xs,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    marginTop: metrics.spacing.xxl,
    gap: metrics.spacing.m,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: metrics.spacing.l,
    borderRadius: metrics.radiusCard,
    borderWidth: 1.5,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.secondaryBackground,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.m,
  },
  textGroup: {
    flexDirection: 'column',
  },
  label: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
  },
  nativeLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
    marginTop: 2,
  },
  textSelected: {
    color: colors.primaryDark,
  },
  footer: {
    paddingBottom: metrics.spacing.l,
  }
});
