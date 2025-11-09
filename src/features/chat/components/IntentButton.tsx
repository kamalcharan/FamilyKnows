// src/features/chat/components/IntentButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { ChatIntent } from '../../../types/chat';

interface IntentButtonProps {
  intent: ChatIntent;
  onPress: (intent: ChatIntent) => void;
}

export const IntentButton: React.FC<IntentButtonProps> = ({ intent, onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.colors.utility.secondaryBackground }]}
      onPress={() => onPress(intent)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{intent.icon}</Text>
        <Text style={[styles.label, { color: theme.colors.utility.primaryText }]}>
          {intent.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});
