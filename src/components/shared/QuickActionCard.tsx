// src/components/shared/QuickActionCard.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  color: string;
  onPress?: () => void;
}

interface QuickActionCardProps {
  visible: boolean;
  onClose: () => void;
  actions: QuickAction[];
  title?: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  visible,
  onClose,
  actions,
  title = 'Quick Actions',
}) => {
  const { theme } = useTheme();

  // Animation values
  const slideAnim = useRef(new Animated.Value(400)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
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
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleActionPress = (action: QuickAction) => {
    if (action.onPress) {
      action.onPress();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
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
                {title}
              </Text>

              {/* Action Grid */}
              <View style={styles.actionGrid}>
                {actions.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.actionItem}
                    onPress={() => handleActionPress(item)}
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
                onPress={onClose}
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
  );
};

const styles = StyleSheet.create({
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
