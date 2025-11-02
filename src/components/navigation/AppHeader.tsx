// src/components/navigation/AppHeader.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppHeaderProps {
  title?: string;
  showMenu?: boolean;
  showBack?: boolean;
  showNotifications?: boolean;
  onMenuPress?: () => void;
  onBackPress?: () => void;
  onNotificationPress?: () => void;
  rightComponent?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showMenu = true,
  showBack = false,
  showNotifications = true,
  onMenuPress,
  onBackPress,
  onNotificationPress,
  rightComponent,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View 
      style={[
        styles.container,
        { 
          backgroundColor: theme.colors.utility.primaryBackground,
          paddingTop: insets.top,
        }
      ]}
    >
      <View style={styles.content}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={theme.colors.utility.primaryText}
              />
            </TouchableOpacity>
          ) : showMenu ? (
            <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
              <MaterialCommunityIcons
                name="menu"
                size={24}
                color={theme.colors.utility.primaryText}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconButton} />
          )}
        </View>

        {/* Center Section */}
        <View style={styles.centerSection}>
          {title && (
            <Text style={[styles.title, { color: theme.colors.utility.primaryText }]}>
              {title}
            </Text>
          )}
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {rightComponent ? (
            rightComponent
          ) : showNotifications ? (
            <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
              <MaterialCommunityIcons
                name="bell-outline"
                size={24}
                color={theme.colors.utility.primaryText}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconButton} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
  },
  leftSection: {
    width: 40,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});