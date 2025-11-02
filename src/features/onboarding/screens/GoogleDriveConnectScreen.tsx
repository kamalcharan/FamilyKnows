// src/features/onboarding/screens/GoogleDriveConnectScreen.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { OnboardingStackParamList } from '../../../navigation/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type GoogleDriveConnectNavigationProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  'GoogleDriveConnect'
>;

type GoogleDriveConnectRouteProp = RouteProp<
  OnboardingStackParamList,
  'GoogleDriveConnect'
>;

interface Props {
  navigation: GoogleDriveConnectNavigationProp;
  route: GoogleDriveConnectRouteProp;
}

export const GoogleDriveConnectScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { isFromSettings } = route.params;
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Mock Google Drive connection
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  const handleContinue = () => {
    if (isFromSettings) {
      navigation.goBack();
    } else {
      navigation.navigate('FamilySetup', { isFromSettings: false });
    }
  };

  const handleSkip = () => {
    navigation.navigate('FamilySetup', { isFromSettings: false });
  };

  const benefits = [
    {
      icon: 'cloud-upload',
      title: 'Automatic Backup',
      description: 'Your documents and photos are safely backed up',
    },
    {
      icon: 'sync',
      title: 'Sync Across Devices',
      description: 'Access your family data from any device',
    },
    {
      icon: 'shield-check',
      title: 'Secure Storage',
      description: 'Enterprise-grade security for your family data',
    },
    {
      icon: 'folder-multiple',
      title: 'Organized Files',
      description: 'All family documents in one organized place',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Progress Bar - Only show during onboarding */}
        {!isFromSettings && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: theme.colors.brand.primary,
                    width: '83.33%' // 5/6 steps
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.utility.secondaryText }]}>
              Step 5 of 6
            </Text>
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name="google-drive" 
              size={60} 
              color="#4285F4" 
            />
            {isConnected && (
              <View style={[styles.connectedBadge, { backgroundColor: theme.colors.semantic.success }]}>
                <MaterialCommunityIcons name="check" size={16} color="#fff" />
              </View>
            )}
          </View>
          
          <Text style={[styles.title, { color: theme.colors.utility.primaryText }]}>
            {isConnected ? 'Google Drive Connected!' : 'Connect Google Drive'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.utility.secondaryText }]}>
            {isConnected 
              ? 'Your family data is now backed up securely'
              : 'Backup and sync your family documents automatically'
            }
          </Text>
        </View>

        {/* Connection Status */}
        {!isConnected ? (
          <>
            {/* Benefits List */}
            <View style={styles.benefitsContainer}>
              {benefits.map((benefit, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.benefitCard,
                    { backgroundColor: theme.colors.utility.secondaryBackground }
                  ]}
                >
                  <MaterialCommunityIcons 
                    name={benefit.icon as any} 
                    size={24} 
                    color={theme.colors.brand.primary} 
                  />
                  <View style={styles.benefitText}>
                    <Text style={[styles.benefitTitle, { color: theme.colors.utility.primaryText }]}>
                      {benefit.title}
                    </Text>
                    <Text style={[styles.benefitDescription, { color: theme.colors.utility.secondaryText }]}>
                      {benefit.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Connect Button */}
            <Button
              title={isConnecting ? "Connecting..." : "Connect with Google"}
              onPress={handleConnect}
              buttonStyle={[
                styles.connectButton,
                { backgroundColor: '#4285F4' }
              ]}
              titleStyle={styles.connectButtonText}
              loading={isConnecting}
              disabled={isConnecting}
              icon={
                !isConnecting && (
                  <MaterialCommunityIcons 
                    name="google" 
                    size={20} 
                    color="#fff" 
                    style={{ marginRight: 8 }}
                  />
                )
              }
            />
          </>
        ) : (
          <>
            {/* Connected State */}
            <View style={[
              styles.connectedCard,
              { backgroundColor: theme.colors.semantic.success + '10' }
            ]}>
              <MaterialCommunityIcons 
                name="check-circle" 
                size={48} 
                color={theme.colors.semantic.success} 
              />
              <Text style={[styles.connectedText, { color: theme.colors.utility.primaryText }]}>
                Successfully connected to Google Drive
              </Text>
              <Text style={[styles.connectedEmail, { color: theme.colors.utility.secondaryText }]}>
                mockuser@gmail.com
              </Text>
              
              <TouchableOpacity 
                style={styles.disconnectButton}
                onPress={handleDisconnect}
              >
                <Text style={[styles.disconnectText, { color: theme.colors.semantic.error }]}>
                  Disconnect
                </Text>
              </TouchableOpacity>
            </View>

            {/* Continue Button */}
            <Button
              title="Continue"
              onPress={handleContinue}
              buttonStyle={[
                styles.continueButton,
                { backgroundColor: theme.colors.brand.primary }
              ]}
              titleStyle={styles.continueButtonText}
            />
          </>
        )}

        {/* Privacy Note */}
        <View style={[
          styles.privacyNote,
          { backgroundColor: theme.colors.accent.accent4 + '20' }
        ]}>
          <MaterialCommunityIcons 
            name="lock" 
            size={16} 
            color={theme.colors.utility.secondaryText} 
          />
          <Text style={[styles.privacyText, { color: theme.colors.utility.secondaryText }]}>
            Your data is encrypted and private. We only access files you explicitly share with FamilyKnows.
          </Text>
        </View>

        {/* Skip Option - Only show during onboarding and when not connected */}
        {!isFromSettings && !isConnected && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={[styles.skipText, { color: theme.colors.utility.secondaryText }]}>
              Set up Later
            </Text>
          </TouchableOpacity>
        )}
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
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  progressContainer: {
    marginTop: 60,
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  connectedBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  benefitsContainer: {
    marginBottom: 30,
  },
  benefitCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    gap: 16,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  connectButton: {
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 20,
    flexDirection: 'row',
  },
  connectButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  connectedCard: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  connectedText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  connectedEmail: {
    fontSize: 14,
    marginBottom: 20,
  },
  disconnectButton: {
    padding: 8,
  },
  disconnectText: {
    fontSize: 14,
    fontWeight: '500',
  },
  continueButton: {
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 20,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  privacyNote: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    alignItems: 'flex-start',
  },
  privacyText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  skipButton: {
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
});