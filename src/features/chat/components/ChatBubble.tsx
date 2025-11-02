// src/features/chat/components/ChatBubble.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

interface ChatBubbleProps {
  type: 'assistant' | 'user';
  text: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ type, text }) => {
  const { theme } = useTheme();
  const isAssistant = type === 'assistant';

  return (
    <View style={[styles.container, isAssistant ? styles.assistantContainer : styles.userContainer]}>
      <View
        style={[
          styles.bubble,
          isAssistant
            ? { backgroundColor: theme.colors.utility.secondaryBackground }
            : { backgroundColor: theme.colors.brand.primary },
        ]}
      >
        <Text
          style={[
            styles.text,
            isAssistant
              ? { color: theme.colors.utility.primaryText }
              : { color: '#FFFFFF' },
          ]}
        >
          {text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
});
