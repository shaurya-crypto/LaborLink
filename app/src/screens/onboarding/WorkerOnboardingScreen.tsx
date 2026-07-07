import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenContainer, Button, TextInput } from '@/components';
import { colors, metrics, typography } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';

export const WorkerOnboardingScreen = () => {
  const { user, updateProfile } = useAuthStore();
  const { completeOnboarding, city } = useAppStore();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [name, setName] = useState(user?.name || '');
  const [occupation, setOccupation] = useState(user?.occupation || '');
  const [experience, setExperience] = useState('');
  const [availability, setAvailability] = useState('');

  const occupations = ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'Welder', 'Mechanic', 'Helper', 'Driver'];
  const experiences = ['Less than 1 year', '1 - 3 years', '3 - 5 years', '5+ years'];
  const availabilities = ['Available Today', 'Busy', 'On Leave'];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      updateProfile({ name, occupation, experience, city: city || undefined });
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const SelectableChip = ({ label, selected, onSelect }: any) => (
    <TouchableOpacity 
      style={[styles.chip, selected && styles.chipSelected]} 
      onPress={onSelect}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer backgroundColor={colors.surface} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {step > 1 ? (
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <Icon name="chevron-left" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          ) : <View style={styles.backBtnPlaceholder} />}
          <Text style={styles.stepText}>{step} of {totalSteps}</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${(step / totalSteps) * 100}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {step === 1 && (
          <View>
            <Text style={styles.title}>Confirm your details</Text>
            <Text style={styles.subtitle}>Make sure your name and location are correct.</Text>
            
            <TouchableOpacity style={styles.photoPlaceholder} activeOpacity={0.8}>
              <Icon name="camera" size={32} color={colors.icons} />
              <Text style={styles.photoText}>Add Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.skipPhotoContainer}>
              <Text style={styles.skipPhotoText}>Skip for now</Text>
            </TouchableOpacity>

            <TextInput
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              label="City"
              placeholder="Your city"
              value={city || ''}
              editable={false} // Managed by LocationPermissionScreen, ideally editable here but keep it simple
            />
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.title}>What is your occupation?</Text>
            <Text style={styles.subtitle}>Select the primary work you do.</Text>
            <View style={styles.chipGroup}>
              {occupations.map(opt => (
                <SelectableChip
                  key={opt}
                  label={opt}
                  selected={occupation === opt}
                  onSelect={() => setOccupation(opt)}
                />
              ))}
            </View>
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={styles.title}>How much experience do you have?</Text>
            <Text style={styles.subtitle}>Employers look for this to match you with the right jobs.</Text>
            <View style={styles.chipGroup}>
              {experiences.map(opt => (
                <SelectableChip
                  key={opt}
                  label={opt}
                  selected={experience === opt}
                  onSelect={() => setExperience(opt)}
                />
              ))}
            </View>
          </View>
        )}

        {step === 4 && (
          <View>
            <Text style={styles.title}>What is your current availability?</Text>
            <Text style={styles.subtitle}>Let employers know if you are ready to work today.</Text>
            <View style={styles.chipGroup}>
              {availabilities.map(opt => (
                <SelectableChip
                  key={opt}
                  label={opt}
                  selected={availability === opt}
                  onSelect={() => setAvailability(opt)}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title={step === totalSteps ? 'Complete Profile' : 'Continue'} 
          onPress={handleNext} 
          disabled={
            (step === 1 && !name) ||
            (step === 2 && !occupation) ||
            (step === 3 && !experience) ||
            (step === 4 && !availability)
          }
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: metrics.spacing.l,
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
  backBtnPlaceholder: {
    width: 40,
    height: 40,
  },
  stepText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
  },
  progressContainer: {
    height: 6,
    backgroundColor: colors.divider,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  content: {
    flexGrow: 1,
    paddingBottom: metrics.spacing.xxl,
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
    lineHeight: 24,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.secondaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: metrics.spacing.xl,
    borderWidth: 1,
    borderColor: colors.divider,
    borderStyle: 'dashed',
  },
  photoText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 8,
  },
  skipPhotoContainer: {
    alignItems: 'center',
    marginBottom: metrics.spacing.xl,
    marginTop: -metrics.spacing.m,
  },
  skipPhotoText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.primary,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.s,
  },
  chip: {
    paddingHorizontal: metrics.spacing.m,
    paddingVertical: metrics.spacing.m,
    borderRadius: metrics.radiusPill,
    borderWidth: 1.5,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '1A', // 10% opacity
  },
  chipLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
  },
  chipLabelSelected: {
    color: colors.primaryDark,
  },
  footer: {
    paddingBottom: metrics.spacing.l,
    paddingTop: metrics.spacing.m,
    backgroundColor: colors.surface,
  }
});
