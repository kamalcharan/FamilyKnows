// src/features/onboarding/components/KeyboardSetupGuide.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

interface KeyboardSetupGuideProps {
  visible: boolean;
  language: string;
  languageName: string;
  onClose: () => void;
}

const setupGuides: Record<string, { android: string[]; ios: string[] }> = {
  te: {
    android: [
      'Open Settings on your phone',
      'Go to System → Languages & Input',
      'Select Virtual Keyboard → Gboard (or your keyboard app)',
      'Tap Languages → Add Keyboard',
      'Select తెలుగు (Telugu)',
      'Return to FamilyKnows app',
    ],
    ios: [
      'Open Settings on your phone',
      'Go to General → Keyboard',
      'Tap Keyboards → Add New Keyboard',
      'Select Telugu from the list',
      'Return to FamilyKnows app',
    ],
  },
  hi: {
    android: [
      'Open Settings on your phone',
      'Go to System → Languages & Input',
      'Select Virtual Keyboard → Gboard',
      'Tap Languages → Add Keyboard',
      'Select हिंदी (Hindi)',
      'Return to FamilyKnows app',
    ],
    ios: [
      'Open Settings on your phone',
      'Go to General → Keyboard',
      'Tap Keyboards → Add New Keyboard',
      'Select Hindi from the list',
      'Return to FamilyKnows app',
    ],
  },
  ta: {
    android: [
      'Open Settings on your phone',
      'Go to System → Languages & Input',
      'Select Virtual Keyboard → Gboard',
      'Tap Languages → Add Keyboard',
      'Select தமிழ் (Tamil)',
      'Return to FamilyKnows app',
    ],
    ios: [
      'Open Settings on your phone',
      'Go to General → Keyboard',
      'Tap Keyboards → Add New Keyboard',
      'Select Tamil from the list',
      'Return to FamilyKnows app',
    ],
  },
};

export const KeyboardSetupGuide: React.FC<KeyboardSetupGuideProps> = ({
  visible,
  language,
  languageName,
  onClose,
}) => {
  const { theme } = useTheme();
  const platform = Platform.OS;

  const steps = setupGuides[language]?.[platform] || [];

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  if (!steps.length) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.utility.primaryText }]}>
              Keyboard Setup Guide
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.utility.secondaryText }]}>
              To type in {languageName}, please enable the keyboard on your phone
            </Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={[styles.stepsContainer, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
              <Text style={[styles.stepsTitle, { color: theme.colors.utility.primaryText }]}>
                {platform === 'ios' ? 'Steps for iPhone:' : 'Steps for Android:'}
              </Text>

              {steps.map((step, index) => (
                <View key={index} style={styles.stepRow}>
                  <View style={[styles.stepNumber, { backgroundColor: theme.colors.brand.primary }]}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.stepText, { color: theme.colors.utility.primaryText }]}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>

            <View style={[styles.infoBox, { backgroundColor: theme.colors.accent.accent1 + '20' }]}>
              <Text style={[styles.infoText, { color: theme.colors.utility.primaryText }]}>
                💡 After enabling the keyboard, you can switch between languages while typing by tapping
                the globe icon (🌐) on your keyboard.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.settingsButton, { backgroundColor: theme.colors.brand.primary }]}
              onPress={handleOpenSettings}
            >
              <Text style={styles.buttonText}>📱 Open Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.closeButton, { borderColor: theme.colors.utility.secondaryText }]}
              onPress={onClose}
            >
              <Text style={[styles.closeButtonText, { color: theme.colors.utility.primaryText }]}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 32,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  content: {
    paddingHorizontal: 24,
  },
  stepsContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  infoBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  settingsButton: {},
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
