// src/navigation/MainNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainDashboard } from '../features/dashboard/screens/MainDashboard';

// Import all screens that can be accessed from settings
import { UserProfileScreen } from '../features/onboarding/screens/UserProfileScreen';
import { PhoneAuthScreen } from '../features/onboarding/screens/PhoneAuthScreen';
import { ThemeSelectionScreen } from '../features/onboarding/screens/ThemeSelectionScreen';
import { LanguageSelectionScreen } from '../features/onboarding/screens/LanguageSelectionScreen';
import { GoogleDriveConnectScreen } from '../features/onboarding/screens/GoogleDriveConnectScreen';
import { FamilySetupScreen } from '../features/onboarding/screens/FamilySetupScreen';
import { PricingScreen } from '../features/onboarding/screens/PricingScreen';

export type MainStackParamList = {
  Dashboard: undefined;
  // Settings screens
  SettingsProfile: { isFromSettings: boolean };
  SettingsPhone: { isFromSettings: boolean };
  SettingsTheme: { isFromSettings: boolean };
  SettingsLanguage: { isFromSettings: boolean };
  SettingsGoogleDrive: { isFromSettings: boolean };
  SettingsFamily: { isFromSettings: boolean };
  SettingsPricing: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Dashboard" component={MainDashboard} />
      
      {/* Settings Screens */}
      <Stack.Screen 
        name="SettingsProfile" 
        component={UserProfileScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="SettingsPhone" 
        component={PhoneAuthScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="SettingsTheme" 
        component={ThemeSelectionScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="SettingsLanguage" 
        component={LanguageSelectionScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="SettingsGoogleDrive" 
        component={GoogleDriveConnectScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="SettingsFamily" 
        component={FamilySetupScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="SettingsPricing" 
        component={PricingScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
};