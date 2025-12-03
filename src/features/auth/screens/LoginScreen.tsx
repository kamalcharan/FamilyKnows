// src/features/auth/screens/LoginScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { GoogleIcon } from '../components/GoogleIcon';

const { width, height } = Dimensions.get('window');

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

type LoginScreenRouteProp = RouteProp<AuthStackParamList, 'Login'>;

// Animated Button Component
const AnimatedButton = ({ children, onPress, style, disabled }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export const LoginScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute<LoginScreenRouteProp>();
  const [isLoading, setIsLoading] = useState(false);

  // Extract prefill data from StoryOnboarding
  const { userName, familyName } = route.params || {};

  // Animation values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandTranslateY = useRef(new Animated.Value(20)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const descriptionOpacity = useRef(new Animated.Value(0)).current;
  const bottomSectionTranslateY = useRef(new Animated.Value(50)).current;
  const bottomSectionOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      // Logo entrance
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Brand name
      Animated.parallel([
        Animated.timing(brandOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(brandTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // Tagline
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Description
      Animated.timing(descriptionOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Bottom section
      Animated.parallel([
        Animated.timing(bottomSectionOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(bottomSectionTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Google Sign-In
      setTimeout(() => {
        // Pass prefill data forward to PhoneAuth
        navigation.replace('PhoneAuth' as any, {
          isFromSettings: false,
          prefillName: userName,
          prefillFamily: familyName,
        });
      }, 2000);
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar backgroundColor={theme.colors.utility.primaryText} barStyle="light-content" />

      {/* Top Section - Dark Background */}
      <View style={[styles.topSection, { backgroundColor: theme.colors.utility.primaryText }]}>
        {/* Decorative circles */}
        <View style={[styles.decorCircle, styles.decorCircle1, { backgroundColor: theme.colors.brand.primary + '15' }]} />
        <View style={[styles.decorCircle, styles.decorCircle2, { backgroundColor: theme.colors.brand.primary + '10' }]} />

        <View style={styles.topContent}>
          {/* Logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <View style={[styles.logoWrapper, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
              <Image
                source={require('../../../../assets/images/family-knows-logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </Animated.View>

          {/* Brand Name */}
          <Animated.Text
            style={[
              styles.brandName,
              {
                color: theme.colors.utility.secondaryBackground,
                opacity: brandOpacity,
                transform: [{ translateY: brandTranslateY }],
              },
            ]}
          >
            FamilyKnows
          </Animated.Text>

          {/* Tagline */}
          <Animated.Text
            style={[
              styles.tagline,
              {
                color: theme.colors.accent.accent4,
                opacity: taglineOpacity,
              },
            ]}
          >
            Handcrafted in India
          </Animated.Text>

          {/* Description */}
          <Animated.Text
            style={[
              styles.description,
              {
                color: theme.colors.utility.secondaryBackground,
                opacity: descriptionOpacity,
              },
            ]}
          >
            A personal assistant service for making{'\n'}your life easier & productive
          </Animated.Text>
        </View>
      </View>

      {/* Bottom Section - Light Background with curved top */}
      <Animated.View
        style={[
          styles.bottomSection,
          {
            backgroundColor: theme.colors.utility.secondaryBackground,
            opacity: bottomSectionOpacity,
            transform: [{ translateY: bottomSectionTranslateY }],
          },
        ]}
      >
        {/* Curved top overlay */}
        <View style={[styles.curvedTop, { backgroundColor: theme.colors.utility.secondaryBackground }]} />

        {/* Login Button */}
        <AnimatedButton
          style={[
            styles.googleButton,
            { backgroundColor: theme.colors.brand.primary },
            isLoading && styles.disabledButton,
          ]}
          onPress={handleGoogleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.utility.secondaryBackground} />
          ) : (
            <>
              <View style={styles.googleIconWrapper}>
                <GoogleIcon size={22} color={theme.colors.utility.secondaryBackground} />
              </View>
              <Text style={[styles.buttonText, { color: theme.colors.utility.secondaryBackground }]}>
                Continue with Google
              </Text>
            </>
          )}
        </AnimatedButton>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: theme.colors.utility.secondaryText + '30' }]} />
          <Text style={[styles.dividerText, { color: theme.colors.utility.secondaryText }]}>or</Text>
          <View style={[styles.divider, { backgroundColor: theme.colors.utility.secondaryText + '30' }]} />
        </View>

        {/* Other login options placeholder */}
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.colors.utility.secondaryText + '40' }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.colors.utility.primaryText }]}>
            Sign in with Phone Number
          </Text>
        </TouchableOpacity>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <Text style={[styles.termsText, { color: theme.colors.utility.secondaryText }]}>
            By continuing, you agree to our{' '}
          </Text>
          <TouchableOpacity>
            <Text style={[styles.linkText, { color: theme.colors.brand.primary }]}>
              Terms
            </Text>
          </TouchableOpacity>
          <Text style={[styles.termsText, { color: theme.colors.utility.secondaryText }]}>
            {' '}and{' '}
          </Text>
          <TouchableOpacity>
            <Text style={[styles.linkText, { color: theme.colors.brand.primary }]}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 0.58,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  decorCircle1: {
    width: width * 0.8,
    height: width * 0.8,
    top: -width * 0.2,
    right: -width * 0.2,
  },
  decorCircle2: {
    width: width * 0.6,
    height: width * 0.6,
    bottom: -width * 0.1,
    left: -width * 0.2,
  },
  topContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logo: {
    width: 70,
    height: 70,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 24,
  },
  description: {
    fontSize: 17,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.9,
  },
  bottomSection: {
    flex: 0.42,
    paddingHorizontal: 30,
    paddingTop: 40,
    alignItems: 'center',
    position: 'relative',
  },
  curvedTop: {
    position: 'absolute',
    top: -30,
    left: 0,
    right: 0,
    height: 60,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  googleIconWrapper: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 13,
    fontWeight: '500',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
  },
  termsText: {
    fontSize: 12,
    lineHeight: 18,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
