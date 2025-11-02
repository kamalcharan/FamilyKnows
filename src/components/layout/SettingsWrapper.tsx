// src/components/layout/SettingsWrapper.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MainLayout } from './MainLayout';
import { useTheme } from '../../theme/ThemeContext';

interface SettingsWrapperProps {
  children: React.ReactNode;
  title: string;
}

export const SettingsWrapper: React.FC<SettingsWrapperProps> = ({
  children,
  title,
}) => {
  const { theme } = useTheme();

  return (
    <MainLayout
      activeTab="home"
      showTabs={false}
      showVoiceButton={false}
      showBack={true}
      headerTitle={title}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}>
        {children}
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});