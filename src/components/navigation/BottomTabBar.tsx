// src/components/navigation/BottomTabBar.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QuickActionCard } from '../shared/QuickActionCard';
import { defaultQuickActions } from '../../dummydata/quickActions';

export type TabRoute = 'home' | 'assets' | 'documents' | 'services' | 'family';
export type InteractionMode = 'chat' | 'keyboard'; // voice hidden for now

interface BottomTabBarProps {
  activeTab: TabRoute;
  onTabPress: (route: TabRoute) => void;
  activeMode?: InteractionMode;
  onModeChange?: (mode: InteractionMode) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabPress,
  activeMode: propActiveMode,
  onModeChange,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [showActions, setShowActions] = useState(false);
  const [localMode, setLocalMode] = useState<InteractionMode>('keyboard');

  // Use prop if provided, otherwise fall back to local state
  const activeMode = propActiveMode ?? localMode;

  // Animation values
  const plusRotation = useRef(new Animated.Value(0)).current;
  
  // Scale animations for mode buttons
  const modeScales = useRef({
    chat: new Animated.Value(activeMode === 'chat' ? 1.2 : 0.8),
    keyboard: new Animated.Value(activeMode === 'keyboard' ? 1.2 : 0.8),
  }).current;

  useEffect(() => {
    // Animate scale changes when mode changes
    const modes: InteractionMode[] = ['chat', 'keyboard'];

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
    // Animate plus button rotation
    Animated.timing(plusRotation, {
      toValue: showActions ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showActions, plusRotation]);

  const handleModeChange = (mode: InteractionMode) => {
    if (onModeChange) {
      onModeChange(mode);
    } else {
      setLocalMode(mode);
    }
    console.log('Interaction mode changed to:', mode);
  };

  const getModeIcon = (mode: InteractionMode) => {
    switch (mode) {
      case 'chat':
        return 'message-text';
      case 'keyboard':
        return 'keyboard';
    }
  };

  const getPositions = (mode: InteractionMode) => {
    // Return the order of modes based on which is active
    // With only 2 modes, we'll position them left and right
    switch (mode) {
      case 'chat':
        return ['keyboard', 'chat']; // Chat in center (right)
      case 'keyboard':
        return ['chat', 'keyboard']; // Keyboard in center (right, default)
      default:
        return ['chat', 'keyboard'];
    }
  };

  const getModeZIndex = (mode: InteractionMode) => {
    return mode === activeMode ? 10 : 1;
  };

  const renderModeButton = (mode: InteractionMode, position: 'left' | 'right') => {
    const isActive = mode === activeMode;
    const translateX = position === 'left' ? -30 : 30;
    
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
                  {renderModeButton(positions[1] as InteractionMode, 'right')}
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

      {/* Quick Action Card */}
      <QuickActionCard
        visible={showActions}
        onClose={() => setShowActions(false)}
        actions={defaultQuickActions}
      />
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
});