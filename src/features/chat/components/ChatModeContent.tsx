// src/features/chat/components/ChatModeContent.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Text } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { ChatMessage, ChatIntent } from '../../../types/chat';
import { mainIntents, assistantResponses } from '../../../dummydata/chatIntents';
import { ChatBubble } from './ChatBubble';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ChatModeContentProps {
  userName?: string;
}

// Wrapper for animating individual messages
const AnimatedMessage = ({ children }: { children: React.ReactNode }) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        marginBottom: 16,
      }}
    >
      {children}
    </Animated.View>
  );
};

export const ChatModeContent: React.FC<ChatModeContentProps> = ({ userName = 'User' }) => {
  const { theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentIntents, setCurrentIntents] = useState<ChatIntent[]>(mainIntents);
  const [intentHistory, setIntentHistory] = useState<ChatIntent[][]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Animation for the Bottom Panel (Intents + Input)
  const panelSlide = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    // Initial greeting with delay for effect
    const greeting = assistantResponses.greeting.replace('{name}', userName);
    setTimeout(() => {
      addAssistantMessage(greeting, mainIntents);

      // Slide in the bottom panel
      Animated.spring(panelSlide, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, 500);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

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
    addUserMessage(intent.label);

    if (intent.subIntents && intent.subIntents.length > 0) {
      setIntentHistory((prev) => [...prev, currentIntents]);
      const response = assistantResponses[intent.action] || `I'll help you with ${intent.label.toLowerCase()}.`;

      // Simulate "Typing..." delay
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addAssistantMessage(response, intent.subIntents);
      }, 600);
    } else {
      const response = `I'll ${intent.label.toLowerCase()} for you.`;

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addAssistantMessage(response);

        // Return to main menu after action
        setTimeout(() => {
          addAssistantMessage("Is there anything else?", mainIntents);
          setIntentHistory([]);
        }, 1500);
      }, 600);
    }
  };

  const handleSend = () => {
    if (inputText.trim()) {
      addUserMessage(inputText);
      setInputText('');
      // Mock response for free text
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addAssistantMessage("I'm processing that request. (AI Integration Coming Soon)");
      }, 800);
    }
  };

  const handleBackIntent = () => {
    if (intentHistory.length > 0) {
      const previousIntents = intentHistory[intentHistory.length - 1];
      setCurrentIntents(previousIntents);
      setIntentHistory((prev) => prev.slice(0, -1));
      addAssistantMessage("Back to previous options.", previousIntents);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Message Stream */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.spacer} />
        {messages.map((message) => (
          <AnimatedMessage key={message.id}>
            <ChatBubble
              type={message.type}
              text={message.text}
            />
          </AnimatedMessage>
        ))}
        {isTyping && (
          <AnimatedMessage key="typing">
            <ChatBubble
              type="assistant"
              text="Typing..."
              isTyping
            />
          </AnimatedMessage>
        )}
      </ScrollView>

      {/* "Glass" Command Panel */}
      <Animated.View
        style={[
          styles.commandPanel,
          {
            backgroundColor: theme.colors.utility.secondaryBackground + 'F2',
            transform: [{ translateY: panelSlide }]
          }
        ]}
      >
        {/* Horizontal Chips (Intents) */}
        <View style={styles.chipsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContent}
          >
            {intentHistory.length > 0 && (
              <TouchableOpacity
                style={[styles.chip, styles.backChip, { borderColor: theme.colors.utility.secondaryText + '40' }]}
                onPress={handleBackIntent}
              >
                <MaterialCommunityIcons name="arrow-left" size={16} color={theme.colors.utility.secondaryText} />
              </TouchableOpacity>
            )}

            {currentIntents.map((intent) => (
              <TouchableOpacity
                key={intent.id}
                style={[
                  styles.chip,
                  {
                    backgroundColor: theme.colors.brand.primary + '10',
                    borderColor: theme.colors.brand.primary + '30',
                  }
                ]}
                activeOpacity={0.7}
                onPress={() => handleIntentPress(intent)}
              >
                <MaterialCommunityIcons
                  name={(intent.icon as any) || "star-four-points"}
                  size={16}
                  color={theme.colors.brand.primary}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.chipText, { color: theme.colors.brand.primary }]}>
                  {intent.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Field */}
        <View style={[styles.inputContainer, { borderColor: theme.colors.utility.secondaryText + '20' }]}>
          <TextInput
            style={[styles.input, { color: theme.colors.utility.primaryText }]}
            placeholder="Ask FamilyKnows..."
            placeholderTextColor={theme.colors.utility.secondaryText + '80'}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: inputText.trim() ? theme.colors.brand.primary : theme.colors.utility.secondaryText + '20' }
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <MaterialCommunityIcons name="arrow-up" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  spacer: {
    height: 20,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  commandPanel: {
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  chipsContainer: {
    marginBottom: 16,
    height: 40,
  },
  chipsContent: {
    paddingHorizontal: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  backChip: {
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    backgroundColor: '#F9FAFB',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
