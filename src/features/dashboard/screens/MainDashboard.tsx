// src/features/dashboard/screens/MainDashboard.tsx (updated with theme-aware colors)
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Text } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MainLayout } from '../../../components/layout/MainLayout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AssistantCard } from '../components/AssistantCard';
import { ChatModeScreen } from '../../chat';
import { CollaboratorsScreen } from '../../collaborators';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const RECENT_SCREENS_KEY = '@FamilyKnows:recentScreens';
const MODE_KEY = '@FamilyKnows:interfaceMode';

export const MainDashboard: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<'keyboard' | 'chat'>('keyboard');
  const [recentScreens, setRecentScreens] = useState<string[]>([]);
  const [activeScreen, setActiveScreen] = useState<string | null>(null);

  // Load saved mode and recent screens on mount
  useEffect(() => {
    loadSavedMode();
    loadRecentScreens();
  }, []);

  const loadSavedMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(MODE_KEY);
      if (savedMode === 'chat' || savedMode === 'keyboard') {
        setMode(savedMode);
      }
    } catch (error) {
      console.error('Error loading mode:', error);
    }
  };

  const loadRecentScreens = async () => {
    try {
      const saved = await AsyncStorage.getItem(RECENT_SCREENS_KEY);
      if (saved) {
        setRecentScreens(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading recent screens:', error);
    }
  };

  const saveMode = async (newMode: 'keyboard' | 'chat') => {
    try {
      await AsyncStorage.setItem(MODE_KEY, newMode);
      setMode(newMode);
    } catch (error) {
      console.error('Error saving mode:', error);
    }
  };

  const trackScreenAccess = async (screenId: string) => {
    try {
      // Add to beginning of array, remove duplicates, keep only last 4
      const updated = [screenId, ...recentScreens.filter(id => id !== screenId)].slice(0, 4);
      await AsyncStorage.setItem(RECENT_SCREENS_KEY, JSON.stringify(updated));
      setRecentScreens(updated);
    } catch (error) {
      console.error('Error tracking screen:', error);
    }
  };

  const handleSwitchMode = () => {
    const newMode = mode === 'keyboard' ? 'chat' : 'keyboard';
    saveMode(newMode);
  };

  const handleCardPress = (screenId: string) => {
    trackScreenAccess(screenId);
    if (screenId === 'collaborators') {
      setActiveScreen('collaborators');
    }
    // Add more screen navigation here
  };

  // Use theme colors for dashboard cards
  const dashboardCards = [
    {
      id: 'tasks',
      title: 'Tasks',
      icon: 'clipboard-check',
      color: theme.colors.accent.accent1,
      bgColor: theme.colors.accent.accent1 + '15', // 15% opacity
      description: 'Manage your daily tasks',
    },
    {
      id: 'assets',
      title: 'Assets',
      icon: 'cube-outline',
      color: theme.colors.accent.accent2,
      bgColor: theme.colors.accent.accent2 + '15',
      description: 'Track your valuables',
    },
    {
      id: 'health',
      title: 'Health',
      icon: 'heart-pulse',
      color: theme.colors.accent.accent3,
      bgColor: theme.colors.accent.accent3 + '15',
      description: 'Health records & reminders',
    },
    {
      id: 'collaborators',
      title: 'Collaborators',
      icon: 'account-group',
      color: theme.colors.accent.accent4,
      bgColor: theme.colors.accent.accent4 + '15',
      description: 'Family members',
    },
  ];

  // Get cards to display - prioritize recent screens (top 3) + collaborators always at bottom
  const getDisplayCards = () => {
    const recent = recentScreens
      .slice(0, 3)
      .map(id => dashboardCards.find(card => card.id === id))
      .filter(Boolean);

    // If less than 3 recent, fill with other cards
    if (recent.length < 3) {
      const remainingCards = dashboardCards.filter(
        card => !recent.find(r => r?.id === card.id) && card.id !== 'collaborators'
      );
      recent.push(...remainingCards.slice(0, 3 - recent.length));
    }

    // Always add collaborators at the end
    const collaboratorsCard = dashboardCards.find(card => card.id === 'collaborators');
    if (collaboratorsCard) {
      return [...recent, collaboratorsCard];
    }
    return recent;
  };

  const renderDashboardCard = (card: any) => (
    <TouchableOpacity
      key={card.id}
      style={[
        styles.card,
        { backgroundColor: theme.colors.utility.secondaryBackground }
      ]}
      activeOpacity={0.7}
      onPress={() => handleCardPress(card.id)}
    >
      <View style={[styles.cardIconContainer, { backgroundColor: card.bgColor }]}>
        <MaterialCommunityIcons
          name={card.icon}
          size={28}
          color={card.color}
        />
      </View>
      <Text style={[styles.cardTitle, { color: theme.colors.utility.primaryText }]}>
        {card.title}
      </Text>
      <Text style={[styles.cardDescription, { color: theme.colors.utility.secondaryText }]}>
        {card.description}
      </Text>
      <MaterialCommunityIcons
        name="arrow-right"
        size={20}
        color={theme.colors.brand.primary}
        style={styles.cardArrow}
      />
    </TouchableOpacity>
  );

  // Show different screen based on activeScreen
  if (activeScreen === 'collaborators') {
    return <CollaboratorsScreen />;
  }

  // Show chat mode if active
  if (mode === 'chat') {
    return <ChatModeScreen userName="User" onSwitchToKeyboard={handleSwitchMode} />;
  }

  return (
    <MainLayout activeTab="home" headerTitle="FamilyKnows">
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 80 + insets.bottom }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.greeting, { color: theme.colors.utility.secondaryText }]}>
            Welcome back,
          </Text>
          <Text style={[styles.userName, { color: theme.colors.utility.primaryText }]}>
            User
          </Text>
        </View>

        {/* Assistant Mode Switcher Card */}
        <AssistantCard mode={mode} onSwitchMode={handleSwitchMode} />

        {/* Dashboard Cards - Recent + Collaborators */}
        <View style={styles.cardsGrid}>
          {getDisplayCards().map(renderDashboardCard)}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionButtons}>
            <TouchableOpacity
              style={[
                styles.quickActionButton,
                { 
                  backgroundColor: theme.colors.utility.secondaryBackground,
                  borderWidth: 1,
                  borderColor: theme.colors.brand.primary + '20',
                }
              ]}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="plus-circle"
                size={24}
                color={theme.colors.brand.primary}
              />
              <Text style={[styles.quickActionText, { color: theme.colors.utility.primaryText }]}>
                Add Asset
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.quickActionButton,
                { 
                  backgroundColor: theme.colors.utility.secondaryBackground,
                  borderWidth: 1,
                  borderColor: theme.colors.brand.secondary + '20',
                }
              ]}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="file-document-outline"
                size={24}
                color={theme.colors.brand.secondary}
              />
              <Text style={[styles.quickActionText, { color: theme.colors.utility.primaryText }]}>
                Upload Doc
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.recentSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>
            Recent Activity
          </Text>
          <View style={[
            styles.emptyState, 
            { 
              backgroundColor: theme.colors.utility.secondaryBackground,
              borderWidth: 1,
              borderColor: theme.colors.utility.secondaryText + '10',
            }
          ]}>
            <MaterialCommunityIcons
              name="history"
              size={48}
              color={theme.colors.utility.secondaryText}
            />
            <Text style={[styles.emptyStateText, { color: theme.colors.utility.secondaryText }]}>
              No recent activity
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.colors.utility.secondaryText }]}>
              Your recent actions will appear here
            </Text>
          </View>
        </View>
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
  },
  aiCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  aiCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiCardText: {
    gap: 4,
  },
  aiCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  aiCardSubtitle: {
    fontSize: 14,
    color: '#ffffffcc',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  card: {
    width: (SCREEN_WIDTH - 56) / 2,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    marginBottom: 12,
  },
  cardArrow: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  quickActions: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  recentSection: {
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
    gap: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});