// src/components/layout/MainLayout.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { AppHeader } from '../navigation/AppHeader';
import { BottomTabBar, TabRoute, InteractionMode } from '../navigation/BottomTabBar';
import { MenuDrawer } from '../navigation/MenuDrawer';
import { useNavigation } from '@react-navigation/native';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: TabRoute;
  showHeader?: boolean;
  showTabs?: boolean;
  headerTitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  activeMode?: InteractionMode;
  onModeChange?: (mode: InteractionMode) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeTab,
  showHeader = true,
  showTabs = true,
  headerTitle,
  showBack = false,
  onBackPress,
  activeMode,
  onModeChange,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);

  const handleTabPress = (route: TabRoute) => {
    // Navigate to the respective screen
    switch (route) {
      case 'home':
        // Navigate to home/dashboard
        break;
      case 'assets':
        // Navigate to assets screen
        break;
      case 'documents':
        // Navigate to documents screen
        break;
      case 'family':
        // Navigate to family screen
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}>
      {showHeader && (
        <AppHeader
          title={headerTitle}
          showMenu={!showBack}
          showBack={showBack}
          onMenuPress={() => setShowMenu(true)}
          onBackPress={onBackPress || (() => navigation.goBack())}
        />
      )}

      <View style={[styles.content, !showTabs && styles.contentNoTabs]}>
        {children}
      </View>

      {showTabs && (
        <BottomTabBar
          activeTab={activeTab}
          onTabPress={handleTabPress}
          activeMode={activeMode}
          onModeChange={onModeChange}
        />
      )}

      <MenuDrawer
        visible={showMenu}
        onClose={() => setShowMenu(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginBottom: 56, // Height of tab bar
  },
  contentNoTabs: {
    marginBottom: 0,
  },
});