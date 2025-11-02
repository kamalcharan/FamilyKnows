// src/features/auth/screens/OnboardingScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

export const OnboardingScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}>
      <Text style={[styles.title, { color: theme.colors.utility.primaryText }]}>
        Welcome to FamilyKnows!
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.utility.secondaryText }]}>
        Let's set up your family workspace
      </Text>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.brand.primary }]}
      >
        <Text style={[styles.buttonText, { color: theme.colors.utility.secondaryBackground }]}>
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 48,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});