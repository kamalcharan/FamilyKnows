// src/features/chat/components/ChatBubble.tsx
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

interface ChatBubbleProps {
  type: 'assistant' | 'user';
  text: string;
  isTyping?: boolean;
}

// Typing indicator dots
const TypingDots = ({ color }: { color: string }) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = animateDot(dot1, 0);
    const anim2 = animateDot(dot2, 150);
    const anim3 = animateDot(dot3, 300);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  const getDotStyle = (dot: Animated.Value) => ({
    transform: [
      {
        translateY: dot.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -4],
        }),
      },
    ],
    opacity: dot.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1],
    }),
  });

  return (
    <View style={styles.typingContainer}>
      <Animated.View style={[styles.dot, { backgroundColor: color }, getDotStyle(dot1)]} />
      <Animated.View style={[styles.dot, { backgroundColor: color }, getDotStyle(dot2)]} />
      <Animated.View style={[styles.dot, { backgroundColor: color }, getDotStyle(dot3)]} />
    </View>
  );
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({ type, text, isTyping = false }) => {
  const { theme } = useTheme();
  const isAssistant = type === 'assistant';

  // Entrance animation
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, isAssistant ? styles.assistantContainer : styles.userContainer]}>
      <Animated.View
        style={[
          styles.bubble,
          isAssistant
            ? [
                styles.assistantBubble,
                { backgroundColor: theme.colors.utility.secondaryBackground }
              ]
            : [
                styles.userBubble,
                { backgroundColor: theme.colors.brand.primary }
              ],
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {isTyping ? (
          <TypingDots color={theme.colors.utility.secondaryText} />
        ) : (
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
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  assistantBubble: {
    borderRadius: 20,
    borderTopLeftRadius: 4,
  },
  userBubble: {
    borderRadius: 20,
    borderTopRightRadius: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
