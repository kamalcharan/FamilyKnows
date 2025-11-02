// src/features/onboarding/screens/LanguageSelectionScreen.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { OnboardingStackParamList } from '../../../navigation/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supportedLanguages, Language } from '../../../constants/languages';

type LanguageSelectionNavigationProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  'LanguageSelection'
>;

type LanguageSelectionRouteProp = RouteProp<
  OnboardingStackParamList,
  'LanguageSelection'
>;

interface Props {
  navigation: LanguageSelectionNavigationProp;
  route: LanguageSelectionRouteProp;
}

export const LanguageSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { isFromSettings } = route.params;
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleContinue = () => {
    // Save language preference (we'll implement this with AsyncStorage/SQLite later)
    
    if (isFromSettings) {
      navigation.goBack();
    } else {
      navigation.navigate('GoogleDriveConnect', { isFromSettings: false });
    }
  };

  const handleSkip = () => {
    navigation.navigate('GoogleDriveConnect', { isFromSettings: false });
  };

  const renderLanguageOption = (language: Language) => {
    const isSelected = selectedLanguage === language.code;

    return (
      <TouchableOpacity
        key={language.code}
        style={[
          styles.languageCard,
          {
            backgroundColor: isSelected 
              ? theme.colors.brand.primary 
              : theme.colors.utility.secondaryBackground,
            borderColor: isSelected 
              ? theme.colors.brand.primary 
              : theme.colors.utility.secondaryBackground,
          }
        ]}
        onPress={() => setSelectedLanguage(language.code)}
      >
        <View style={styles.languageContent}>
          <Text style={[styles.languageFlag, { fontSize: 32 }]}>
            {language.flag}
          </Text>
          <View style={styles.languageText}>
            <Text 
              style={[
                styles.languageName,
                { 
                  color: isSelected 
                    ? '#fff' 
                    : theme.colors.utility.primaryText 
                }
              ]}
            >
              {language.name}
            </Text>
            <Text 
              style={[
                styles.languageNative,
                { 
                  color: isSelected 
                    ? '#ffffffcc' 
                    : theme.colors.utility.secondaryText 
                }
              ]}
            >
              {language.nativeName}
            </Text>
          </View>
        </View>
        
        {isSelected && (
          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color="#fff"
          />
        )}
      </TouchableOpacity>
    );
  };

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
                    width: '66.67%' // 4/6 steps
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.utility.secondaryText }]}>
              Step 4 of 6
            </Text>
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons 
            name="translate" 
            size={60} 
            color={theme.colors.brand.primary} 
          />
          <Text style={[styles.title, { color: theme.colors.utility.primaryText }]}>
            Choose Your Language
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.utility.secondaryText }]}>
            Select your preferred language for the app
          </Text>
        </View>

        {/* Language Options */}
        <View style={styles.languageList}>
          {supportedLanguages.map(renderLanguageOption)}
        </View>

        {/* Info Text */}
        <View style={[
          styles.infoContainer,
          { backgroundColor: theme.colors.accent.accent4 + '20' }
        ]}>
          <MaterialCommunityIcons 
            name="information" 
            size={20} 
            color={theme.colors.brand.primary} 
          />
          <Text style={[styles.infoText, { color: theme.colors.utility.secondaryText }]}>
            You can change the language anytime from settings
          </Text>
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

        {/* Skip Option - Only show during onboarding */}
        {!isFromSettings && (
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
  title: {
    fontSize: 24,
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
  languageList: {
    marginBottom: 20,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  languageText: {
    gap: 4,
  },
  languageFlag: {
    width: 40,
    textAlign: 'center',
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
  },
  languageNative: {
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
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
  skipButton: {
    alignItems: 'center',
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
});