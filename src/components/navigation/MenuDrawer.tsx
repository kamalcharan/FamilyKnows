// src/components/navigation/MenuDrawer.tsx
import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

interface MenuDrawerProps {
  visible: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
}

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  visible,
  onClose,
  userName = 'User',
  userEmail = 'user@example.com',
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const menuItems = [
    {
      id: 'profile',
      title: 'Profile',
      icon: 'account-circle',
      screen: 'SettingsProfile',
      params: { isFromSettings: true },
    },
    {
      id: 'phone',
      title: 'Phone Number',
      icon: 'phone',
      screen: 'SettingsPhone',
      params: { isFromSettings: true },
    },
    {
      id: 'theme',
      title: 'Theme',
      icon: 'palette',
      screen: 'SettingsTheme',
      params: { isFromSettings: true },
    },
    {
      id: 'language',
      title: 'Language',
      icon: 'translate',
      screen: 'SettingsLanguage',
      params: { isFromSettings: true },
    },
    {
      id: 'gdrive',
      title: 'Google Drive',
      icon: 'google-drive',
      screen: 'SettingsGoogleDrive',
      params: { isFromSettings: true },
    },
    {
      id: 'family',
      title: 'Family Settings',
      icon: 'account-group',
      screen: 'SettingsFamily',
      params: { isFromSettings: true },
    },
    {
      id: 'pricing',
      title: 'Subscription',
      icon: 'crown',
      screen: 'SettingsPricing',
      params: {},
    },
    {
      id: 'divider',
      isDivider: true,
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle',
      action: 'help',
    },
    {
      id: 'about',
      title: 'About',
      icon: 'information',
      action: 'about',
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: 'logout',
      action: 'logout',
    },
  ];

  const handleMenuItemPress = (item: any) => {
    onClose();
    
    if (item.screen) {
      navigation.navigate(item.screen as any, item.params);
    } else if (item.action) {
      switch (item.action) {
        case 'logout':
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          break;
        case 'help':
          // Handle help
          break;
        case 'about':
          // Handle about
          break;
      }
    }
  };

  const renderMenuItem = (item: any) => {
    if (item.isDivider) {
      return (
        <View 
          key={item.id}
          style={[styles.menuDivider, { backgroundColor: theme.colors.utility.secondaryText + '20' }]} 
        />
      );
    }

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.menuItem}
        onPress={() => handleMenuItemPress(item)}
      >
        <MaterialCommunityIcons
          name={item.icon}
          size={24}
          color={item.id === 'logout' ? theme.colors.semantic.error : theme.colors.utility.primaryText}
        />
        <Text style={[
          styles.menuItemText,
          { color: item.id === 'logout' ? theme.colors.semantic.error : theme.colors.utility.primaryText }
        ]}>
          {item.title}
        </Text>
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={theme.colors.utility.secondaryText}
        />
      </TouchableOpacity>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={[
              styles.menuContainer,
              { backgroundColor: theme.colors.utility.primaryBackground }
            ]}>
              {/* Menu Header */}
              <View style={styles.menuHeader}>
                <View style={styles.menuProfile}>
                  <View style={[styles.profileAvatar, { backgroundColor: theme.colors.brand.primary }]}>
                    <Text style={styles.profileInitials}>{getInitials(userName)}</Text>
                  </View>
                  <View>
                    <Text style={[styles.profileName, { color: theme.colors.utility.primaryText }]}>
                      {userName}
                    </Text>
                    <Text style={[styles.profileEmail, { color: theme.colors.utility.secondaryText }]}>
                      {userEmail}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={onClose}>
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color={theme.colors.utility.secondaryText}
                  />
                </TouchableOpacity>
              </View>

              {/* Menu Items */}
              <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
                {menuItems.map(renderMenuItem)}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  menuItems: {
    flex: 1,
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    flex: 1,
  },
  menuDivider: {
    height: 1,
    marginVertical: 16,
  },
});