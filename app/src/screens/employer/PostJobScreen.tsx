import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ScreenContainer, Button, TextInput } from '@/components';
import { colors, typography, metrics } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useEmployerStore } from '@/store/useEmployerStore';

const CATEGORIES = ['Electrician', 'Plumber', 'Carpenter', 'Welder', 'Painter', 'Driver', 'Cleaning', 'Construction', 'Helper'];

export const PostJobScreen = () => {
  const navigation = useNavigation();
  const { postJob } = useEmployerStore();
  const [step, setStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [workersCount, setWorkersCount] = useState('1');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [salaryType, setSalaryType] = useState<'Monthly'|'Daily'>('Monthly');
  const [experience, setExperience] = useState('1 - 3 years');
  const [isUrgent, setIsUrgent] = useState(false);

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const animateLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const handleNext = () => {
    if (step === 1 && (!title || !category || !description)) {
      Alert.alert('Required', 'Please fill all fields in this step.');
      return;
    }
    if (step === 2 && (!workersCount || !location || !experience)) {
      Alert.alert('Required', 'Please fill all fields in this step.');
      return;
    }
    if (step === 3 && !salary) {
      Alert.alert('Required', 'Please fill salary details.');
      return;
    }
    animateLayout();
    setStep(prev => prev + 1);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    await postJob({
      title, category, description, workersCount, location, salary, salaryType, experience, isUrgent
    });
    setIsPublishing(false);
    Alert.alert('Success', 'Job posted successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map(s => (
        <View key={s} style={styles.stepDotContainer}>
          <View style={[styles.stepDot, step >= s && styles.stepDotActive]} />
          {s < 4 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
        </View>
      ))}
    </View>
  );

  const renderChips = (options: string[], selected: string, onSelect: (val: string) => void) => (
    <View style={styles.chipsRow}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt}
          style={[styles.chip, selected === opt && styles.chipActive]}
          onPress={() => onSelect(opt)}
        >
          <Text style={[styles.chipText, selected === opt && styles.chipTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScreenContainer backgroundColor={colors.background}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            if (step > 1) {
              animateLayout();
              setStep(step - 1);
            } else {
              navigation.goBack();
            }
          }} 
          style={styles.backBtn}
        >
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post a Job</Text>
        <View style={{ width: 24 }} />
      </View>

      {renderStepIndicator()}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Basic Details</Text>
            
            <TextInput
              label="Job Title"
              placeholder="e.g. Senior Electrician"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.inputLabel}>Category</Text>
            {renderChips(CATEGORIES, category, setCategory)}

            <TextInput
              label="Description"
              placeholder="Describe the job responsibilities..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: 'top' }}
            />
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Requirements</Text>
            
            <TextInput
              label="Number of Workers Required"
              placeholder="e.g. 2"
              value={workersCount}
              onChangeText={setWorkersCount}
              keyboardType="number-pad"
            />

            <TextInput
              label="Location"
              placeholder="e.g. Andheri East, Mumbai"
              value={location}
              onChangeText={setLocation}
            />

            <Text style={styles.inputLabel}>Experience Required</Text>
            {renderChips(['Fresher', '1 - 3 years', '3 - 5 years', '5+ years'], experience, setExperience)}
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Compensation</Text>
            
            <Text style={styles.inputLabel}>Salary Type</Text>
            {renderChips(['Monthly', 'Daily'], salaryType, (v) => setSalaryType(v as 'Monthly'|'Daily'))}

            <TextInput
              label={salaryType === 'Monthly' ? "Monthly Salary (₹)" : "Daily Wage (₹)"}
              placeholder="e.g. 25000"
              value={salary}
              onChangeText={setSalary}
              keyboardType="number-pad"
            />

            <TouchableOpacity 
              style={styles.toggleRow} 
              onPress={() => setIsUrgent(!isUrgent)}
              activeOpacity={0.8}
            >
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleTitle}>Urgent Hiring</Text>
                <Text style={styles.toggleSubtitle}>Adds a "High Demand" badge to attract workers faster.</Text>
              </View>
              <View style={[styles.checkbox, isUrgent && styles.checkboxActive]}>
                {isUrgent && <Icon name="check" size={16} color={colors.surface} />}
              </View>
            </TouchableOpacity>
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Review & Publish</Text>
            
            <View style={styles.reviewCard}>
              <Text style={styles.reviewTitle}>{title || 'Untitled Job'}</Text>
              <Text style={styles.reviewCategory}>{category || 'No Category'}</Text>
              
              <View style={styles.divider} />
              
              <View style={styles.reviewRow}>
                <Icon name="map-pin" size={16} color={colors.textSecondary} />
                <Text style={styles.reviewText}>{location || 'No location set'}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Icon name="users" size={16} color={colors.textSecondary} />
                <Text style={styles.reviewText}>{workersCount} Worker(s) Needed</Text>
              </View>
              <View style={styles.reviewRow}>
                <Icon name="dollar-sign" size={16} color={colors.textSecondary} />
                <Text style={styles.reviewText}>₹{salary} / {salaryType}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Icon name="briefcase" size={16} color={colors.textSecondary} />
                <Text style={styles.reviewText}>{experience}</Text>
              </View>
            </View>

            {isUrgent && (
              <View style={styles.urgentNotice}>
                <Icon name="alert-circle" size={20} color={colors.warning} />
                <Text style={styles.urgentNoticeText}>This job will be marked as Urgent Hiring.</Text>
              </View>
            )}
          </View>
        )}

      </ScrollView>

      <View style={styles.footer}>
        {step < 4 ? (
          <Button title="Next Step" onPress={handleNext} style={styles.btn} />
        ) : (
          <Button 
            title="Publish Job" 
            onPress={handlePublish} 
            loading={isPublishing} 
            style={styles.btn}
          />
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: metrics.spacing.l,
    paddingVertical: metrics.spacing.m,
  },
  backBtn: {
    padding: metrics.spacing.xs,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: metrics.spacing.m,
    paddingHorizontal: metrics.spacing.xl,
  },
  stepDotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: {
    backgroundColor: colors.primary,
  },
  stepLine: {
    width: 30,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  content: {
    padding: metrics.spacing.l,
    paddingBottom: 100,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.xl,
  },
  inputLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.s,
    marginTop: metrics.spacing.m,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.s,
    marginBottom: metrics.spacing.l,
  },
  chip: {
    paddingHorizontal: metrics.spacing.m,
    paddingVertical: metrics.spacing.s,
    borderRadius: metrics.radiusPill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '1A', // 10% opacity
  },
  chipText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.primary,
    fontFamily: typography.fontFamily.semiBold,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: metrics.spacing.l,
    borderRadius: metrics.radiusCard,
    marginTop: metrics.spacing.m,
    ...metrics.shadows.soft,
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: metrics.spacing.m,
  },
  toggleTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusCard,
    padding: metrics.spacing.xl,
    ...metrics.shadows.medium,
  },
  reviewTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  reviewCategory: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: metrics.spacing.l,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: metrics.spacing.m,
    gap: metrics.spacing.s,
  },
  reviewText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
  },
  urgentNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '1A',
    padding: metrics.spacing.m,
    borderRadius: metrics.radiusS,
    marginTop: metrics.spacing.l,
    gap: metrics.spacing.s,
  },
  urgentNoticeText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.warning,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: metrics.spacing.l,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  btn: {
    width: '100%',
  }
});
