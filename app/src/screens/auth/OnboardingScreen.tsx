import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { ScreenContainer, Button } from '@/components';
import { colors, metrics, typography } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';

export const OnboardingScreen = () => {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [occupation, setOccupation] = useState('');
  const [experience, setExperience] = useState('');

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding, update backend, switch to MainNavigator
      // This is handled by RootNavigator reacting to AuthService state changes
      // For now, we simulate by navigating to a Main screen if possible,
      // or just logging out since we don't have full global state yet.
      navigation.navigate('Home'); 
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const SelectableOption = ({ label, selected, onSelect }: any) => (
    <TouchableOpacity 
      style={[styles.optionCard, selected && styles.optionCardSelected]} 
      onPress={onSelect}
    >
      <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{label}</Text>
      {selected && <Icon name="check" size={20} color={colors.primary} />}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer backgroundColor={colors.surface} scrollable style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Icon name="chevron-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.stepText}>{step} of {totalSteps}</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${(step / totalSteps) * 100}%` }]} />
        </View>
      </View>

      <View style={styles.content}>
        {step === 1 && (
          <>
            <Text style={styles.title}>What's your occupation?</Text>
            <Text style={styles.subtitle}>Select the option that best describes you</Text>
            <View style={styles.grid}>
              {['Electrician', 'Plumber', 'Carpenter', 'Painter', 'Welder', 'Mechanic'].map(opt => (
                <SelectableOption
                  key={opt}
                  label={opt}
                  selected={occupation === opt}
                  onSelect={() => setOccupation(opt)}
                />
              ))}
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>How much experience do you have?</Text>
            <Text style={styles.subtitle}>This helps us match you with better opportunities</Text>
            <View style={styles.list}>
              {['Less than 1 year', '1 - 3 years', '3 - 5 years', '5+ years'].map(opt => (
                <SelectableOption
                  key={opt}
                  label={opt}
                  selected={experience === opt}
                  onSelect={() => setExperience(opt)}
                />
              ))}
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.title}>Almost done!</Text>
            <Text style={styles.subtitle}>Review your details before we set up your profile</Text>
            <View style={styles.reviewCard}>
              <View style={styles.reviewRow}>
                <Icon name="briefcase" size={20} color={colors.textSecondary} />
                <Text style={styles.reviewLabel}>Occupation</Text>
                <Text style={styles.reviewValue}>{occupation || 'Not specified'}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Icon name="clock" size={20} color={colors.textSecondary} />
                <Text style={styles.reviewLabel}>Experience</Text>
                <Text style={styles.reviewValue}>{experience || 'Not specified'}</Text>
              </View>
            </View>
          </>
        )}
      </View>

      <View style={styles.footer}>
        <Button title={step === totalSteps ? 'Finish' : 'Continue'} onPress={handleNext} />
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
    marginTop: metrics.spacing.m,
    marginBottom: metrics.spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.m,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginLeft: -8,
  },
  stepText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
  },
  progressContainer: {
    height: 4,
    backgroundColor: colors.divider,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
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
    marginBottom: metrics.spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.s,
  },
  list: {
    gap: metrics.spacing.m,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: metrics.spacing.m,
    borderRadius: metrics.radiusInput,
    borderWidth: 1.5,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.secondaryBackground,
  },
  optionLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
  },
  optionLabelSelected: {
    color: colors.primaryDark,
  },
  reviewCard: {
    backgroundColor: colors.secondaryBackground,
    padding: metrics.spacing.l,
    borderRadius: metrics.radiusCard,
    gap: metrics.spacing.l,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
    marginLeft: metrics.spacing.s,
    width: 100,
  },
  reviewValue: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    paddingBottom: metrics.spacing.l,
  }
});
