import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { authService } from '@/services/AuthService';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { SplashScreen } from '@/screens/auth/SplashScreen';
import { LanguageScreen } from '@/screens/auth/LanguageScreen';

export const RootNavigator = () => {
  const { isAuthenticated, restoreAuth } = useAuthStore();
  const { hasSelectedLanguage, role, hasCompletedOnboarding, restoreAppState } = useAppStore();
  
  const [isReady, setIsReady] = useState(false);
  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      await authService.init();
      await restoreAuth();
      await restoreAppState();
      setIsReady(true);
    };
    initApp();
  }, [restoreAuth, restoreAppState]);

  if (!isReady || !splashFinished) {
    return <SplashScreen onFinish={() => setSplashFinished(true)} />;
  }

  if (!hasSelectedLanguage) {
    return <LanguageScreen />;
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : (!role || (role === 'worker' && !hasCompletedOnboarding)) ? (
        <OnboardingNavigator />
      ) : (
        <MainNavigator />
      )}
    </NavigationContainer>
  );
};
