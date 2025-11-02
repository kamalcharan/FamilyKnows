// src/features/onboarding/screens/ThemeSelectionScreen.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Dimensions,
} from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { OnboardingStackParamList } from '../../../navigation/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type ThemeSelectionNavigationProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  'ThemeSelection'
>;

type ThemeSelectionRouteProp = RouteProp<
  OnboardingStackParamList,
  'ThemeSelection'
>;

interface Props {
  navigation: ThemeSelectionNavigationProp;
  route: ThemeSelectionRouteProp;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const THEME_CARD_WIDTH = (SCREEN_WIDTH - 60 - 10) / 2; // 2 columns with gap

export const ThemeSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme, setTheme, isDarkMode, toggleDarkMode, availableThemes, currentThemeId } = useTheme();
  const { isFromSettings } = route.params;
  const [selectedThemeId, setSelectedThemeId] = useState(currentThemeId);

  const handleContinue = () => {
    // Apply the selected theme
    setTheme(selectedThemeId);
    
    if (isFromSettings) {
      navigation.goBack();
    } else {
      navigation.navigate('LanguageSelection', { isFromSettings: false });
    }
  };

  const handleSkip = () => {
    navigation.navigate('LanguageSelection', { isFromSettings: false });
  };

  const renderThemeCard = (themeItem: any) => {
    const isSelected = selectedThemeId === themeItem.id;
    const colors = isDarkMode && themeItem.darkMode 
      ? themeItem.darkMode.colors 
      : themeItem.colors;

    return (
      <TouchableOpacity
        key={themeItem.id}
        style={[
          styles.themeCard,
          {
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: isSelected ? colors.brand.primary : colors.utility.secondaryBackground,
            borderWidth: isSelected ? 3 : 1,
          }
        ]}
        onPress={() => setSelectedThemeId(themeItem.id)}
      >
        {/* Theme Preview */}
        <View style={styles.themePreview}>
          <View 
            style={[
              styles.previewHeader,
              { backgroundColor: colors.brand.primary }
            ]}
          >
            <View style={styles.previewDots}>
              <View style={[styles.dot, { backgroundColor: colors.brand.secondary }]} />
              <View style={[styles.dot, { backgroundColor: colors.brand.tertiary }]} />
              <View style={[styles.dot, { backgroundColor: colors.brand.alternate }]} />
            </View>
          </View>
          
          <View style={styles.previewContent}>
            <View 
              style={[
                styles.previewLine,
                { backgroundColor: colors.utility.primaryText, width: '70%' }
              ]} 
            />
            <View 
              style={[
                styles.previewLine,
                { backgroundColor: colors.utility.secondaryText, width: '90%' }
              ]} 
            />
            <View style={styles.previewAccents}>
              <View style={[styles.accentBox, { backgroundColor: colors.accent.accent1 }]} />
              <View style={[styles.accentBox, { backgroundColor: colors.accent.accent2 }]} />
              <View style={[styles.accentBox, { backgroundColor: colors.accent.accent3 }]} />
              <View style={[styles.accentBox, { backgroundColor: colors.accent.accent4 }]} />
            </View>
          </View>
        </View>

        {/* Theme Name */}
        <Text style={[styles.themeName, { color: colors.utility.primaryText }]}>
          {themeItem.name}
        </Text>

        {/* Selected Indicator */}
        {isSelected && (
          <View style={[styles.selectedBadge, { backgroundColor: colors.brand.primary }]}>
            <MaterialCommunityIcons name="check" size={16} color="#fff" />
          </View>
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
                    width: '50%' // 3/6 steps
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.utility.secondaryText }]}>
              Step 3 of 6
            </Text>
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons 
            name="palette" 
            size={60} 
            color={theme.colors.brand.primary} 
          />
          <Text style={[styles.title, { color: theme.colors.utility.primaryText }]}>
            Choose Your Theme
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.utility.secondaryText }]}>
            Personalize your app experience
          </Text>
        </View>

        {/* Dark Mode Toggle */}
        <View style={[
          styles.darkModeContainer,
          { backgroundColor: theme.colors.utility.secondaryBackground }
        ]}>
          <View style={styles.darkModeLeft}>
            <MaterialCommunityIcons 
              name={isDarkMode ? "weather-night" : "white-balance-sunny"} 
              size={24} 
              color={theme.colors.brand.primary} 
            />
            <Text style={[styles.darkModeText, { color: theme.colors.utility.primaryText }]}>
              Dark Mode
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ 
              false: theme.colors.utility.secondaryText + '40', 
              true: theme.colors.brand.primary + '40' 
            }}
            thumbColor={isDarkMode ? theme.colors.brand.primary : '#f4f3f4'}
          />
        </View>

        {/* Theme Grid */}
        <View style={styles.themeGrid}>
          {availableThemes.map(renderThemeCard)}
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
  },
  darkModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  darkModeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  darkModeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 30,
  },
  themeCard: {
    width: THEME_CARD_WIDTH,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  themePreview: {
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  previewHeader: {
    height: 30,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  previewDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  previewContent: {
    flex: 1,
    padding: 8,
    gap: 6,
  },
  previewLine: {
    height: 8,
    borderRadius: 4,
  },
  previewAccents: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 'auto',
  },
  accentBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  themeName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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