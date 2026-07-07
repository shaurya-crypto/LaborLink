import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer, Button, TextInput } from '@/components';
import { colors, metrics, typography } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';
import { useAuthStore } from '@/store/useAuthStore';

export const EmployerSetupScreen = () => {
  const navigation = useNavigation<any>();
  const { user, updateProfile } = useAuthStore();
  
  const [name, setName] = useState(user?.name || '');
  const [businessName, setBusinessName] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');

  const handleFinish = () => {
    updateProfile({ 
      name, 
      // In a real app we'd save these to a specific employer profile document
    });
    // Setting a flag that setup is complete so they can post jobs
    // For now we just return back to home
    navigation.goBack();
  };

  return (
    <ScreenContainer backgroundColor={colors.surface} scrollable style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <Icon name="briefcase" size={40} color={colors.primary} />
        </View>
        <Text style={styles.title}>Employer Setup</Text>
        <Text style={styles.subtitle}>Let's set up your business profile before you post your first job.</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label="Your Name"
          placeholder="e.g. John Doe"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          label="Business / Company Name (Optional)"
          placeholder="e.g. Doe Construction"
          value={businessName}
          onChangeText={setBusinessName}
        />
        <TextInput
          label="Business Location (Optional)"
          placeholder="e.g. Downtown Office"
          value={businessLocation}
          onChangeText={setBusinessLocation}
        />
      </View>

      <View style={styles.footer}>
        <Button 
          title="Complete Setup" 
          onPress={handleFinish} 
          disabled={!name.trim()}
        />
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
    marginBottom: metrics.spacing.xl,
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
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  footer: {
    paddingBottom: metrics.spacing.l,
  }
});
