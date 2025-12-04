// src/features/chat/components/ChatModeContent.tsx
// AI Mode Content - Interactive assistant with intent-based navigation
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
  Easing,
} from 'react-native';
import { Text } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { ChatMessage, ChatIntent, ChatWidgetType } from '../../../types/chat';
import { mainIntents, assistantResponses } from '../../../dummydata/chatIntents';
import { ChatBubble } from './ChatBubble';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { OrbitWidget } from './widgets/OrbitWidget';

interface ChatModeContentProps {
  userName?: string;
}

// Wrapper for animating individual messages
const AnimatedMessage = ({ children }: { children: React.ReactNode }) => {
  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
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
        marginBottom: 12,
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
  const [panelReady, setPanelReady] = useState(false);

  // Animation for the Bottom Panel (Intents + Input)
  const panelOpacity = useRef(new Animated.Value(0)).current;
  const panelTranslateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Initial greeting with delay for effect
    const greeting = assistantResponses.greeting.replace('{name}', userName);

    const timer = setTimeout(() => {
      addAssistantMessage(greeting, mainIntents);
      setPanelReady(true);

      // Animate panel in
      Animated.parallel([
        Animated.timing(panelOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(panelTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const addAssistantMessage = (
    text: string,
    intents?: ChatIntent[],
    widget?: ChatWidgetType,
    widgetData?: any
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      text,
      timestamp: new Date(),
      intents,
      widget,
      widgetData,
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

    // Check for collaborators-related intents to show the OrbitWidget
    const isCollaboratorIntent =
      intent.id === 'collaborators' ||
      intent.action === 'view_family' ||
      intent.action === 'view_collaborators' ||
      intent.category === 'collaborators';

    if (isCollaboratorIntent) {
      // Special handling: Show the holographic OrbitWidget
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addAssistantMessage(
          "Here is your current Trusted Network:",
          intent.subIntents,
          'orbit',
          { nodeCount: 3 }
        );
      }, 600);
      return;
    }

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
          addAssistantMessage("Is there anything else I can help with?", mainIntents);
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
        addAssistantMessage("I'm processing that request. AI integration coming soon!");
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

  // Helper to check if icon is an emoji
  const isEmoji = (str: string) => {
    return /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(str);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Message Stream */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.spacer} />
        {messages.map((message) => (
          <AnimatedMessage key={message.id}>
            <ChatBubble
              type={message.type}
              text={message.text}
            />
            {/* Render widget if present */}
            {message.widget === 'orbit' && (
              <View style={styles.widgetContainer}>
                <OrbitWidget
                  title="Your Trusted Network"
                  nodeCount={message.widgetData?.nodeCount || 3}
                />
                <Text style={[styles.widgetHint, { color: theme.colors.utility.secondaryText }]}>
                  Tap to expand view
                </Text>
              </View>
            )}
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
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* "Glass" Command Panel */}
      <Animated.View
        style={[
          styles.commandPanel,
          {
            backgroundColor: theme.colors.utility.secondaryBackground + 'F5',
            opacity: panelOpacity,
            transform: [{ translateY: panelTranslateY }],
          }
        ]}
      >
        {/* Horizontal Chips (Intents) */}
        <View style={styles.chipsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContent}
            keyboardShouldPersistTaps="handled"
          >
            {intentHistory.length > 0 && (
              <TouchableOpacity
                style={[
                  styles.chip,
                  styles.backChip,
                  { borderColor: theme.colors.utility.secondaryText + '40' }
                ]}
                onPress={handleBackIntent}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={18}
                  color={theme.colors.utility.secondaryText}
                />
              </TouchableOpacity>
            )}

            {currentIntents.map((intent) => (
              <TouchableOpacity
                key={intent.id}
                style={[
                  styles.chip,
                  {
                    backgroundColor: theme.colors.brand.primary + '15',
                    borderColor: theme.colors.brand.primary + '30',
                  }
                ]}
                activeOpacity={0.7}
                onPress={() => handleIntentPress(intent)}
              >
                {intent.icon && isEmoji(intent.icon) ? (
                  <Text style={styles.chipIcon}>{intent.icon}</Text>
                ) : (
                  <MaterialCommunityIcons
                    name="star-four-points"
                    size={16}
                    color={theme.colors.brand.primary}
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text style={[styles.chipText, { color: theme.colors.brand.primary }]}>
                  {intent.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Field */}
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: theme.colors.utility.secondaryText + '20',
              backgroundColor: theme.colors.utility.primaryBackground,
            }
          ]}
        >
          <TextInput
            style={[styles.input, { color: theme.colors.utility.primaryText }]}
            placeholder="Ask anything..."
            placeholderTextColor={theme.colors.utility.secondaryText + '80'}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim()
                  ? theme.colors.brand.primary
                  : theme.colors.utility.secondaryText + '30'
              }
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="send"
              size={18}
              color={inputText.trim() ? '#FFF' : theme.colors.utility.secondaryText}
            />
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
    height: 16,
  },
  bottomSpacer: {
    height: 20,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  commandPanel: {
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  chipsContainer: {
    marginBottom: 12,
    minHeight: 44,
  },
  chipsContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    marginRight: 8,
    borderWidth: 1,
  },
  backChip: {
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  chipIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 28,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  widgetContainer: {
    marginTop: -4,
    marginBottom: 8,
  },
  widgetHint: {
    fontSize: 11,
    marginLeft: 20,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
