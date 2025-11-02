// src/navigation/stacks/AuthStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { SplashScreen } from '../../features/auth/screens/SplashScreen';
import { IntroScreens } from '../../features/auth/screens/IntroScreens';
import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { OnboardingScreen } from '../../features/auth/screens/OnboardingScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen 
        name="Intro" 
        component={IntroScreens}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};