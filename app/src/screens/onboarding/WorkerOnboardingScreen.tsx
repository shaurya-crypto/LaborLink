import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Button, TextInput } from '@/components';
import { colors, metrics, typography } from '@/theme';
import { ChevronLeft, Camera, User, MapPin } from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInRight, FadeOutLeft, Layout } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

const SelectableChip = ({ label, selected, onSelect, styles }: any) => (
  <TouchableOpacity onPress={onSelect} activeOpacity={0.8}>
    <Animated.View style={[styles.chip, selected && styles.chipSelected]} layout={Layout.springify()}>
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
    </Animated.View>
  </TouchableOpacity>
);

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



  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradients.surface}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {step > 1 ? (
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <ChevronLeft size={28} color={colors.textPrimary} strokeWidth={2} />
            </TouchableOpacity>
          ) : <View style={styles.backBtnPlaceholder} />}
          <Text style={styles.stepText}>{step} of {totalSteps}</Text>
        </View>
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, { width: `${(step / totalSteps) * 100}%` }]} layout={Layout.springify()}>
            <LinearGradient
              colors={[colors.secondaryBrand, colors.primary, colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
      </View>

      <Animated.ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false} 
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 && (
          <Animated.View entering={FadeInRight.duration(400)} exiting={FadeOutLeft.duration(300)}>
            <Text style={styles.title}>Confirm your details</Text>
            <Text style={styles.subtitle}>Make sure your name and location are correct.</Text>
            
            <TouchableOpacity style={styles.photoPlaceholder} activeOpacity={0.8}>
              <Camera size={32} color={colors.textSecondary} strokeWidth={1.5} />
              <Text style={styles.photoText}>Add Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.skipPhotoContainer}>
              <Text style={styles.skipPhotoText}>Skip for now</Text>
            </TouchableOpacity>

            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              leftIcon={<User size={20} color={colors.textSecondary} strokeWidth={1.5} />}
            />
            <TextInput
              label="City"
              value={city || ''}
              editable={false} 
              leftIcon={<MapPin size={20} color={colors.textSecondary} strokeWidth={1.5} />}
            />
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View entering={FadeInRight.duration(400)} exiting={FadeOutLeft.duration(300)}>
            <Text style={styles.title}>What is your occupation?</Text>
            <Text style={styles.subtitle}>Select the primary work you do.</Text>
            <View style={styles.chipGroup}>
              {occupations.map(occ => (
                <SelectableChip 
                  key={occ} 
                  label={occ} 
                  selected={occupation === occ} 
                  onSelect={() => setOccupation(occ)}
                  styles={styles} 
                />
              ))}
            </View>
          </Animated.View>
        )}

        {step === 3 && (
          <Animated.View entering={FadeInRight.duration(400)} exiting={FadeOutLeft.duration(300)}>
            <Text style={styles.title}>How much experience do you have?</Text>
            <Text style={styles.subtitle}>Employers look for this to match you with the right jobs.</Text>
            <View style={styles.chipGroup}>
              {experiences.map(exp => (
                <SelectableChip 
                  key={exp} 
                  label={exp} 
                  selected={experience === exp} 
                  onSelect={() => setExperience(exp)}
                  styles={styles}
                />
              ))}
            </View>
          </Animated.View>
        )}

        {step === 4 && (
          <Animated.View entering={FadeInRight.duration(400)} exiting={FadeOutLeft.duration(300)}>
            <Text style={styles.title}>What is your availability?</Text>
            <Text style={styles.subtitle}>Let employers know if you are ready to work today.</Text>
            <View style={styles.chipGroup}>
              {availabilities.map(avl => (
                <SelectableChip 
                  key={avl} 
                  label={avl} 
                  selected={availability === avl} 
                  onSelect={() => setAvailability(avl)}
                  styles={styles}
                />
              ))}
            </View>
          </Animated.View>
        )}
      </Animated.ScrollView>

      <Animated.View layout={Layout.springify()} style={styles.footer}>
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
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: metrics.spacing.l,
    paddingTop: height * 0.08,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.xl,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -4,
  },
  backBtnPlaceholder: {
    width: 44,
    height: 44,
  },
  stepText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  progressContainer: {
    height: 4,
    backgroundColor: colors.glass,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  content: {
    flexGrow: 1,
    padding: metrics.spacing.l,
    paddingBottom: metrics.spacing.xxl,
  },
  title: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: typography.sizes.h1,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.xs,
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    marginBottom: metrics.spacing.xl,
    letterSpacing: -0.2,
  },
  photoPlaceholder: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.glass,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: metrics.spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    ...metrics.shadows.glow,
  },
  photoText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  skipPhotoContainer: {
    alignItems: 'center',
    marginBottom: metrics.spacing.xl,
    marginTop: -metrics.spacing.m,
  },
  skipPhotoText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body2,
    color: colors.primary,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.m,
  },
  chip: {
    paddingHorizontal: metrics.spacing.l,
    paddingVertical: metrics.spacing.m,
    borderRadius: metrics.radiusPill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryGlow,
  },
  chipLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
  },
  chipLabelSelected: {
    color: colors.primary,
    fontFamily: typography.fontFamily.semiBold,
  },
  footer: {
    padding: metrics.spacing.l,
    paddingBottom: metrics.spacing.xl,
  }
});
