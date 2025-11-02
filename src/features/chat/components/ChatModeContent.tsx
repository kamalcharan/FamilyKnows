// src/features/chat/components/ChatModeContent.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { ChatMessage, ChatIntent } from '../../../types/chat';
import { mainIntents, assistantResponses } from '../../../dummydata/chatIntents';
import { ChatBubble } from './ChatBubble';
import { IntentButton } from './IntentButton';

interface ChatModeContentProps {
  userName?: string;
}

export const ChatModeContent: React.FC<ChatModeContentProps> = ({ userName = 'User' }) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentIntents, setCurrentIntents] = useState<ChatIntent[]>(mainIntents);
  const [intentHistory, setIntentHistory] = useState<ChatIntent[][]>([]);

  useEffect(() => {
    // Initial greeting
    const greeting = assistantResponses.greeting.replace('{name}', userName);
    addAssistantMessage(greeting, mainIntents);
  }, []);

  const addAssistantMessage = (text: string, intents?: ChatIntent[]) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      text,
      timestamp: new Date(),
      intents,
    };
    setMessages((prev) => [...prev, newMessage]);
    if (intents) {
      setCurrentIntents(intents);
    }
  };

  const addUserMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleIntentPress = (intent: ChatIntent) => {
    // Add user's selection as a message
    addUserMessage(intent.label);

    // Check if this intent has sub-intents
    if (intent.subIntents && intent.subIntents.length > 0) {
      // Save current intents to history for back navigation
      setIntentHistory((prev) => [...prev, currentIntents]);

      // Show assistant response
      const response = assistantResponses[intent.action] || `I'll help you with ${intent.label.toLowerCase()}.`;
      addAssistantMessage(response, intent.subIntents);
    } else {
      // Terminal intent - would trigger actual action
      const response = `I'll ${intent.label.toLowerCase()} for you.`;
      addAssistantMessage(response);

      // Here you would navigate to the actual screen or trigger action
      // For now, show main intents again after a moment
      setTimeout(() => {
        addAssistantMessage("What else would you like to do?", mainIntents);
        setIntentHistory([]);
      }, 1000);
    }
  };

  const handleBack = () => {
    if (intentHistory.length > 0) {
      const previousIntents = intentHistory[intentHistory.length - 1];
      setCurrentIntents(previousIntents);
      setIntentHistory((prev) => prev.slice(0, -1));
      addUserMessage('⬅️ Back');
      addAssistantMessage("What would you like to do?", previousIntents);
    }
  };

  return (
    <View style={styles.container}>
      {/* Messages */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            type={message.type}
            text={message.text}
          />
        ))}
      </ScrollView>

      {/* Intent Buttons */}
      <View style={[styles.intentsContainer, { backgroundColor: theme.colors.utility.primaryBackground }]}>
        <ScrollView
          contentContainerStyle={styles.intentsContent}
          showsVerticalScrollIndicator={false}
        >
          {currentIntents.map((intent) => (
            <IntentButton
              key={intent.id}
              intent={intent}
              onPress={handleIntentPress}
            />
          ))}

          {/* Back button if not at main level */}
          {intentHistory.length > 0 && (
            <TouchableOpacity
              style={[styles.backIntentButton, { borderColor: theme.colors.utility.secondaryText }]}
              onPress={handleBack}
            >
              <Text style={[styles.backIntentText, { color: theme.colors.utility.secondaryText }]}>
                ⬅️ Back
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  intentsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    maxHeight: '40%',
  },
  intentsContent: {
    padding: 16,
  },
  backIntentButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 8,
  },
  backIntentText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
