// src/components/navigation/BottomTabBar.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type TabRoute = 'home' | 'assets' | 'documents' | 'services' | 'family';
export type InteractionMode = 'chat' | 'voice' | 'keyboard';

interface ActionItem {
  id: string;
  icon: string;
  label: string;
  color: string;
}

interface BottomTabBarProps {
  activeTab: TabRoute;
  onTabPress: (route: TabRoute) => void;
}

const actionItems: ActionItem[] = [
  { id: 'assetvault', icon: 'safe-square-outline', label: 'Asset Vault', color: '#4CAF50' },
  { id: 'utilities', icon: 'home-city', label: 'Utilities', color: '#2196F3' },
  { id: 'health', icon: 'hospital-box', label: 'Health', color: '#F44336' },
  { id: 'insurance', icon: 'shield-check', label: 'Insurance', color: '#FF9800' },
  { id: 'contracts', icon: 'file-sign', label: 'Contracts', color: '#9C27B0' },
  { id: 'shopping', icon: 'cart', label: 'Shopping', color: '#00BCD4' },
  { id: 'tasks', icon: 'checkbox-marked-circle', label: 'Tasks', color: '#4CAF50' },
  { id: 'events', icon: 'calendar-check', label: 'Events', color: '#E91E63' },
  { id: 'finance', icon: 'cash', label: 'Finance', color: '#795548' },
  { id: 'payments', icon: 'credit-card', label: 'Payments', color: '#607D8B' },
  { id: 'todo', icon: 'format-list-checks', label: 'To-Do', color: '#009688' },
  { id: 'document', icon: 'file-document-outline', label: 'Documents', color: '#FF5722' }, // Fixed icon name
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabPress,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [showActions, setShowActions] = useState(false);
  const [activeMode, setActiveMode] = useState<InteractionMode>('voice'); // Local state for mode
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(400)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const plusRotation = useRef(new Animated.Value(0)).current;
  
  // Scale animations for mode buttons
  const modeScales = useRef({
    chat: new Animated.Value(activeMode === 'chat' ? 1.2 : 0.8),
    voice: new Animated.Value(activeMode === 'voice' ? 1.2 : 0.8),
    keyboard: new Animated.Value(activeMode === 'keyboard' ? 1.2 : 0.8),
  }).current;

  useEffect(() => {
    // Animate scale changes when mode changes
    const modes: InteractionMode[] = ['chat', 'voice', 'keyboard'];
    
    modes.forEach((mode) => {
      Animated.spring(modeScales[mode], {
        toValue: mode === activeMode ? 1.2 : 0.8,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    });
  }, [activeMode, modeScales]);

  useEffect(() => {
    if (showActions) {
      // Animate modal in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(plusRotation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate modal out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 400,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(plusRotation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showActions, slideAnim, fadeAnim, plusRotation]);

  const handleActionPress = (actionId: string) => {
    console.log('Action pressed:', actionId);
    setShowActions(false);
    // Handle navigation to specific feature
  };

  const handleModeChange = (mode: InteractionMode) => {
    setActiveMode(mode);
    console.log('Interaction mode changed to:', mode);
    // Handle mode change - activate chat, voice, or keyboard input
  };

  const getModeIcon = (mode: InteractionMode) => {
    switch (mode) {
      case 'chat':
        return 'message-text';
      case 'voice':
        return 'microphone';
      case 'keyboard':
        return 'keyboard';
    }
  };

  const getPositions = (mode: InteractionMode) => {
    // Return the order of modes based on which is active
    switch (mode) {
      case 'chat':
        return ['voice', 'chat', 'keyboard']; // Chat in center
      case 'voice':
        return ['chat', 'voice', 'keyboard']; // Voice in center (default)
      case 'keyboard':
        return ['chat', 'keyboard', 'voice']; // Keyboard in center
      default:
        return ['chat', 'voice', 'keyboard'];
    }
  };

  const getModeZIndex = (mode: InteractionMode) => {
    return mode === activeMode ? 10 : 1;
  };

  const renderModeButton = (mode: InteractionMode, position: 'left' | 'center' | 'right') => {
    const isActive = mode === activeMode;
    const translateX = position === 'left' ? -60 : position === 'right' ? 60 : 0;
    
    return (
      <Animated.View
        key={`${mode}-${position}`}
        style={[
          styles.modeButton,
          {
            transform: [
              { translateX },
              { scale: modeScales[mode] },
            ],
            zIndex: getModeZIndex(mode),
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.modeButtonInner,
            {
              backgroundColor: isActive ? theme.colors.brand.primary : theme.colors.utility.secondaryBackground,
              width: isActive ? 50 : 40,
              height: isActive ? 50 : 40,
              shadowOpacity: isActive ? 0.3 : 0.1,
            }
          ]}
          onPress={() => handleModeChange(mode)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={getModeIcon(mode) as any}
            size={isActive ? 26 : 20}
            color={isActive ? '#fff' : theme.colors.utility.secondaryText}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const rotateInterpolate = plusRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <>
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
          {/* Dashboard Button */}
          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={() => onTabPress('home')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="view-dashboard"
              size={28}
              color={activeTab === 'home' ? theme.colors.brand.primary : theme.colors.utility.secondaryText}
            />
          </TouchableOpacity>

          {/* Center Mode Buttons */}
          <View style={styles.centerSection}>
            {(() => {
              const positions = getPositions(activeMode);
              return (
                <>
                  {renderModeButton(positions[0] as InteractionMode, 'left')}
                  {renderModeButton(positions[1] as InteractionMode, 'center')}
                  {renderModeButton(positions[2] as InteractionMode, 'right')}
                </>
              );
            })()}
          </View>

          {/* Add Button */}
          <Animated.View
            style={{
              transform: [{ rotate: rotateInterpolate }],
            }}
          >
            <TouchableOpacity
              style={styles.addButtonContainer}
              onPress={() => setShowActions(!showActions)}
              activeOpacity={0.8}
            >
              <View style={[styles.addButton, { backgroundColor: theme.colors.brand.primary }]}>
                <MaterialCommunityIcons
                  name="plus"
                  size={28}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* Action Sheet Modal */}
      <Modal
        visible={showActions}
        transparent
        animationType="none"
        onRequestClose={() => setShowActions(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowActions(false)}>
          <Animated.View 
            style={[
              styles.modalOverlay,
              {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                opacity: fadeAnim,
              }
            ]}
          >
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.actionSheet,
                  {
                    backgroundColor: theme.colors.utility.primaryBackground,
                    transform: [{ translateY: slideAnim }],
                  }
                ]}
              >
                {/* Handle bar */}
                <View style={styles.handleBar}>
                  <View style={[styles.handle, { backgroundColor: theme.colors.utility.secondaryText + '40' }]} />
                </View>

                {/* Action Sheet Title */}
                <Text style={[styles.actionSheetTitle, { color: theme.colors.utility.primaryText }]}>
                  Quick Actions
                </Text>

                {/* Action Grid */}
                <View style={styles.actionGrid}>
                  {actionItems.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.actionItem}
                      onPress={() => handleActionPress(item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.actionIconContainer, { backgroundColor: item.color + '15' }]}>
                        <MaterialCommunityIcons
                          name={item.icon as any}
                          size={28}
                          color={item.color}
                        />
                      </View>
                      <Text style={[styles.actionLabel, { color: theme.colors.utility.primaryText }]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Close Button */}
                <TouchableOpacity
                  style={[styles.closeButton, { backgroundColor: theme.colors.utility.secondaryBackground }]}
                  onPress={() => setShowActions(false)}
                >
                  <Text style={[styles.closeText, { color: theme.colors.utility.secondaryText }]}>
                    Close
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
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
    height: 65,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  dashboardButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerSection: {
    flex: 1,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  modeButton: {
    position: 'absolute',
  },
  modeButtonInner: {
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  addButtonContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  actionSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '80%',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  handleBar: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  actionSheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 25,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  closeButton: {
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
  },
});