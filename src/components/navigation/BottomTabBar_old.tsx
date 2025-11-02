// src/components/navigation/BottomTabBar.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type TabRoute = 'home' | 'assets' | 'documents' | 'services' | 'family';

interface TabItem {
  route: TabRoute;
  icon: string;
  label: string;
}

interface BottomTabBarProps {
  activeTab: TabRoute;
  onTabPress: (route: TabRoute) => void;
}

const tabs: TabItem[] = [
  { route: 'home', icon: 'home', label: 'Home' },
  { route: 'assets', icon: 'cube-outline', label: 'Assets' },
  { route: 'documents', icon: 'file-document-outline', label: 'Documents' },
  { route: 'services', icon: 'handshake', label: 'Services' },
  { route: 'family', icon: 'account-group', label: 'Family' },
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabPress,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const renderTab = (tab: TabItem) => {
    const isActive = activeTab === tab.route;
    
    return (
      <TouchableOpacity
        key={tab.route}
        style={styles.tab}
        onPress={() => onTabPress(tab.route)}
      >
        <MaterialCommunityIcons
          name={tab.icon as any}
          size={24}
          color={isActive ? theme.colors.brand.primary : theme.colors.utility.secondaryText}
        />
        <Text
          style={[
            styles.tabLabel,
            {
              color: isActive ? theme.colors.brand.primary : theme.colors.utility.secondaryText,
              fontWeight: isActive ? '600' : '400',
            }
          ]}
        >
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.utility.secondaryBackground,
          paddingBottom: insets.bottom,
        }
      ]}
    >
      <View style={styles.content}>
        {tabs.map(renderTab)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    height: 60,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});