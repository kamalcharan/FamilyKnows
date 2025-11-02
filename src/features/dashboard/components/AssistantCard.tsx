// src/features/dashboard/components/AssistantCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

interface AssistantCardProps {
  mode: 'keyboard' | 'chat';
  onSwitchMode: () => void;
}

export const AssistantCard: React.FC<AssistantCardProps> = ({ mode, onSwitchMode }) => {
  const { theme } = useTheme();

  const isKeyboardMode = mode === 'keyboard';

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.brand.primary }]}
      onPress={onSwitchMode}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{isKeyboardMode ? '💬' : '⌨️'}</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>FamilyKnows</Text>
          <Text style={styles.subtitle}>Your Family Assistant</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.currentMode}>
          Currently: {isKeyboardMode ? 'Keyboard Mode' : 'Chat Mode'}
        </Text>
        <View style={styles.switchButton}>
          <Text style={styles.switchText}>
            {isKeyboardMode ? 'Switch to Chat Mode' : 'Switch to Keyboard Mode'}
          </Text>
          <Text style={styles.switchIcon}>🔄</Text>
        </View>
      </View>

      {isKeyboardMode && (
        <Text style={styles.helpText}>
          Tap to chat with your assistant
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 32,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    paddingTop: 12,
  },
  currentMode: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  switchText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  switchIcon: {
    fontSize: 20,
  },
  helpText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
