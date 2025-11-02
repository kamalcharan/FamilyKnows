// src/features/auth/screens/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const INTRO_SHOWN_KEY = '@FamilyKnows:introShown';

type SplashScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Splash'
>;

export const SplashScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<SplashScreenNavigationProp>();
  
  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Start animations
    Animated.sequence([
      // Logo animation
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 10,
          friction: 2,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Tagline animation
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(taglineTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // TEMPORARY: Always show intro during development
    // TODO: Uncomment the AsyncStorage check for production
    const timer = setTimeout(() => {
      navigation.replace('Intro');
    }, 3000);

    return () => clearTimeout(timer);

    // PRODUCTION CODE (currently commented out):
    /*
    const checkIntroAndNavigate = async () => {
      try {
        const introShown = await AsyncStorage.getItem(INTRO_SHOWN_KEY);
        const timer = setTimeout(() => {
          if (introShown === 'true') {
            navigation.replace('Login');
          } else {
            navigation.replace('Intro');
          }
        }, 3000);
        
        return () => clearTimeout(timer);
      } catch (error) {
        const timer = setTimeout(() => {
          navigation.replace('Intro');
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    };

    checkIntroAndNavigate();
    */
  }, [navigation, logoScale, logoOpacity, taglineOpacity, taglineTranslateY]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.brand.primary }]}>
      <StatusBar backgroundColor={theme.colors.brand.primary} barStyle="light-content" />
      
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
          },
        ]}
      >
        <View style={[styles.logo, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
          <Text style={[styles.logoText, { color: theme.colors.brand.primary }]}>FK</Text>
        </View>
        <Text style={[styles.appName, { color: theme.colors.utility.secondaryBackground }]}>
          FamilyKnows
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.taglineContainer,
          {
            opacity: taglineOpacity,
            transform: [{ translateY: taglineTranslateY }],
          },
        ]}
      >
        <Text style={[styles.tagline, { color: theme.colors.utility.secondaryBackground }]}>
          Your AI-Powered Family Intelligence Platform
        </Text>
        <Text style={[styles.subTagline, { color: theme.colors.accent.accent4 }]}>
          Manage • Protect • Optimize
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '700',
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 1,
  },
  taglineContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  subTagline: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
});