// src/features/auth/screens/LoginScreen.tsx
import React, { useState } from 'react';
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
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { GoogleIcon } from '../components/GoogleIcon';

const { width, height } = Dimensions.get('window');

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

export const LoginScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Google Sign-In
      // For now, simulate login and navigate to PhoneAuth (first onboarding step)
      setTimeout(() => {
        // Navigate to PhoneAuth which is the first step of onboarding
        navigation.replace('PhoneAuth' as any, { isFromSettings: false });
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
      <StatusBar backgroundColor={theme.colors.utility.primaryBackground} barStyle="dark-content" />
      
      {/* Top Section - Dark Background */}
      <View style={[styles.topSection, { backgroundColor: theme.colors.utility.primaryText }]}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../../assets/images/family-knows-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.brandName, { color: theme.colors.utility.secondaryBackground }]}>
            FamilyKnows
          </Text>
        </View>
        
        <Text style={[styles.tagline, { color: theme.colors.accent.accent4 }]}>
          Handcrafted in India
        </Text>
        
        <Text style={[styles.description, { color: theme.colors.utility.secondaryBackground }]}>
          A personal assistant service for making{'\n'}your life easier & productive
        </Text>
      </View>

      {/* Bottom Section - Light Background */}
      <View style={[styles.bottomSection, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
        <TouchableOpacity
          style={[
            styles.googleButton,
            { backgroundColor: theme.colors.brand.primary },
            isLoading && styles.disabledButton,
          ]}
          onPress={handleGoogleLogin}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.utility.secondaryBackground} />
          ) : (
            <>
              <GoogleIcon size={24} color={theme.colors.utility.secondaryBackground} />
              <Text style={[styles.buttonText, { color: theme.colors.utility.secondaryBackground }]}>
                Login with Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.termsContainer}>
          <Text style={[styles.termsText, { color: theme.colors.utility.secondaryText }]}>
            By continuing, you agree to our{' '}
          </Text>
          <TouchableOpacity>
            <Text style={[styles.linkText, { color: theme.colors.brand.primary }]}>
              Terms of Service
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
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 0.65,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  bottomSection: {
    flex: 0.35,
    paddingHorizontal: 40,
    paddingTop: 50,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 16,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 30,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 26,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  termsText: {
    fontSize: 12,
    lineHeight: 18,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});