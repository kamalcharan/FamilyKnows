// src/features/onboarding/screens/PricingScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../../navigation/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PricingNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Pricing'
>;

type PricingRouteProp = RouteProp<
  AuthStackParamList,
  'Pricing'
>;

interface Props {
  navigation: PricingNavigationProp;
  route: PricingRouteProp;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PlanType = 'free' | 'individual' | 'family';

interface PlanFeature {
  feature: string;
  included: boolean;
  limit?: string;
}

// Animated Plan Card Component
const AnimatedPlanCard = ({ children, delay, onPress, isSelected, style }: any) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
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
    >
      <Animated.View
        style={[
          style,
          {
            opacity: opacityAnim,
            transform: [{ scale: Animated.multiply(scaleAnim, pressScale) }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export const PricingScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('family');

  // Entrance animations
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(headerTranslateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const freePlanFeatures: PlanFeature[] = [
    { feature: 'Personal Asset Management', included: true, limit: 'Up to 8 assets' },
    { feature: 'Basic Document Storage', included: true },
    { feature: 'AI Assistant - Lucky Pop', included: true, limit: '10 queries/month' },
    { feature: 'Family Collaboration', included: false },
    { feature: 'Google Drive Integration', included: false },
    { feature: 'Service Provider Network', included: false },
    { feature: 'Priority Support', included: false },
  ];

  const individualPlanFeatures: PlanFeature[] = [
    { feature: 'Personal Asset Management', included: true, limit: 'Unlimited' },
    { feature: 'Advanced Document Storage', included: true },
    { feature: 'AI Assistant - Lucky Pop', included: true, limit: '100 queries/month' },
    { feature: 'Family Collaboration', included: true, limit: 'Up to 3 members' },
    { feature: 'Google Drive Integration', included: true },
    { feature: 'Service Provider Network', included: true },
    { feature: 'Email Support', included: true },
    { feature: 'Data Export & Backup', included: true },
  ];

  const familyPlanFeatures: PlanFeature[] = [
    { feature: 'Unlimited Asset Management', included: true },
    { feature: 'Premium Document Storage', included: true, limit: '100GB' },
    { feature: 'AI Assistant - Lucky Pop', included: true, limit: 'Unlimited' },
    { feature: 'Family Collaboration', included: true, limit: 'Up to 10 members' },
    { feature: 'Google Drive Integration', included: true },
    { feature: 'Service Provider Network', included: true, limit: 'Priority access' },
    { feature: 'Priority Support', included: true, limit: '24/7' },
    { feature: 'Advanced Analytics', included: true },
    { feature: 'Family Tree Builder', included: true },
    { feature: 'Legacy Planning Tools', included: true },
  ];

  const handleContinue = async () => {
    // Save selected plan
    await AsyncStorage.setItem('@FamilyKnows:selectedPlan', selectedPlan);
    
    if (selectedPlan !== 'free') {
      // Start 14-day trial for paid plans
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14);
      await AsyncStorage.setItem('@FamilyKnows:trialEndDate', trialEndDate.toISOString());
    }
    
    // Navigate to main app (dashboard)
    navigation.navigate('Main' as any);
  };

  const renderFeature = (feature: PlanFeature, index: number) => (
    <View key={index} style={styles.featureRow}>
      <MaterialCommunityIcons
        name={feature.included ? 'check-circle' : 'close-circle'}
        size={20}
        color={feature.included ? theme.colors.semantic.success : theme.colors.semantic.error}
      />
      <View style={styles.featureTextContainer}>
        <Text style={[
          styles.featureText,
          { 
            color: feature.included 
              ? theme.colors.utility.primaryText 
              : theme.colors.utility.secondaryText 
          }
        ]}>
          {feature.feature}
        </Text>
        {feature.limit && feature.included && (
          <Text style={[styles.featureLimit, { color: theme.colors.utility.secondaryText }]}>
            {feature.limit}
          </Text>
        )}
      </View>
    </View>
  );

  const renderPlanCard = (
    planType: PlanType,
    title: string,
    price: string,
    subtitle: string,
    features: PlanFeature[],
    isPopular?: boolean
  ) => {
    const isSelected = selectedPlan === planType;
    
    return (
      <TouchableOpacity
        style={[
          styles.planCard,
          {
            backgroundColor: theme.colors.utility.secondaryBackground,
            borderColor: isSelected ? theme.colors.brand.primary : theme.colors.utility.secondaryBackground,
            borderWidth: isSelected ? 2 : 1,
          }
        ]}
        onPress={() => setSelectedPlan(planType)}
      >
        {isPopular && (
          <View style={[styles.popularBadge, { backgroundColor: theme.colors.brand.primary }]}>
            <Text style={styles.popularText}>MOST POPULAR</Text>
          </View>
        )}
        
        <View style={styles.planHeader}>
          <Text style={[styles.planTitle, { color: theme.colors.utility.primaryText }]}>
            {title}
          </Text>
          <Text style={[styles.planPrice, { color: theme.colors.brand.primary }]}>
            {price}
          </Text>
          <Text style={[styles.planSubtitle, { color: theme.colors.utility.secondaryText }]}>
            {subtitle}
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => renderFeature(feature, index))}
        </View>

        {isSelected && (
          <View style={[styles.selectedIndicator, { backgroundColor: theme.colors.brand.primary }]}>
            <MaterialCommunityIcons name="check" size={16} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslateY }],
            }
          ]}
        >
          <MaterialCommunityIcons
            name="crown"
            size={60}
            color={theme.colors.brand.primary}
          />
          <Text style={[styles.title, { color: theme.colors.utility.primaryText }]}>
            Choose Your Plan
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.utility.secondaryText }]}>
            Start with a 14-day free trial. No credit card required.
          </Text>
        </Animated.View>

        {/* Plans */}
        <View style={styles.plansContainer}>
          {renderPlanCard(
            'free',
            'Free Forever',
            '₹0',
            'Basic features for personal use',
            freePlanFeatures
          )}
          
          {renderPlanCard(
            'individual',
            'Individual',
            '₹299/month',
            'Perfect for personal & small family',
            individualPlanFeatures
          )}
          
          {renderPlanCard(
            'family',
            'Family',
            '₹499/month',
            'Best for large families',
            familyPlanFeatures,
            true
          )}
        </View>

        {/* Trial Badge */}
        {selectedPlan !== 'free' && (
          <View style={[styles.trialBadge, { backgroundColor: theme.colors.semantic.success + '20' }]}>
            <MaterialCommunityIcons 
              name="gift" 
              size={20} 
              color={theme.colors.semantic.success} 
            />
            <Text style={[styles.trialText, { color: theme.colors.semantic.success }]}>
              14-day free trial included!
            </Text>
          </View>
        )}

        {/* Comparison Note */}
        {selectedPlan === 'individual' && (
          <View style={[styles.comparisonNote, { backgroundColor: theme.colors.accent.accent4 + '20' }]}>
            <MaterialCommunityIcons 
              name="information" 
              size={16} 
              color={theme.colors.brand.primary} 
            />
            <Text style={[styles.comparisonText, { color: theme.colors.utility.secondaryText }]}>
              Upgrade to Family plan anytime for unlimited AI queries and more members
            </Text>
          </View>
        )}

        {/* Continue Button */}
        <Button
          title={
            selectedPlan === 'free' 
              ? 'Continue with Free Plan' 
              : selectedPlan === 'individual'
              ? 'Start Individual Trial'
              : 'Start Family Trial'
          }
          onPress={handleContinue}
          buttonStyle={[
            styles.continueButton,
            { backgroundColor: theme.colors.brand.primary }
          ]}
          titleStyle={styles.continueButtonText}
        />

        {/* Terms */}
        <Text style={[styles.termsText, { color: theme.colors.utility.secondaryText }]}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
          {selectedPlan !== 'free' && ' You can cancel anytime during the trial period.'}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  plansContainer: {
    gap: 16,
    marginBottom: 20,
  },
  planCard: {
    borderRadius: 16,
    padding: 20,
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  planHeader: {
    marginBottom: 20,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 14,
  },
  featuresContainer: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureText: {
    fontSize: 15,
    lineHeight: 20,
  },
  featureLimit: {
    fontSize: 13,
    marginTop: 2,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  trialText: {
    fontSize: 16,
    fontWeight: '600',
  },
  comparisonNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  comparisonText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  continueButton: {
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 16,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});