// src/features/dashboard/screens/MainDashboard.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import { Text } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MainLayout } from '../../../components/layout/MainLayout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AssistantCard } from '../components/AssistantCard';
import { CollaboratorsCard } from '../components/CollaboratorsCard';
import { ChatModeContent } from '../../chat';
import { CollaboratorsScreen } from '../../collaborators';
import { QuickActionCard } from '../../../components/shared/QuickActionCard';
import { defaultQuickActions } from '../../../dummydata/quickActions';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const RECENT_SCREENS_KEY = '@FamilyKnows:recentScreens';
const MODE_KEY = '@FamilyKnows:interfaceMode';

// Interactive Card Component with Scale Animation
const AnimatedCard = ({ children, onPress, style }: any) => {
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
    >
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export const MainDashboard: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  // State
  const [mode, setMode] = useState<'keyboard' | 'chat'>('keyboard');
  const [recentScreens, setRecentScreens] = useState<string[]>([]);
  const [activeScreen, setActiveScreen] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Animations
  const dashboardOpacity = useRef(new Animated.Value(1)).current;
  const chatOpacity = useRef(new Animated.Value(0)).current;

  // Dashboard Items Stagger Animation
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(20)).current;

  // Load saved mode and recent screens on mount
  useEffect(() => {
    loadSavedMode();
    loadRecentScreens();
    startEntranceAnimation();
  }, []);

  const startEntranceAnimation = () => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(contentTranslateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  };

  const loadSavedMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(MODE_KEY);
      if (savedMode === 'chat') {
        // If saved mode was chat, animate to it after a brief delay
        setTimeout(() => handleModeChange('chat'), 500);
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

  const trackScreenAccess = async (screenId: string) => {
    try {
      const updated = [screenId, ...recentScreens.filter(id => id !== screenId)].slice(0, 4);
      await AsyncStorage.setItem(RECENT_SCREENS_KEY, JSON.stringify(updated));
      setRecentScreens(updated);
    } catch (error) {
      console.error('Error tracking screen:', error);
    }
  };

  // Mode change handler - Clean full-screen transition (fade)
  const handleModeChange = useCallback((newMode: 'keyboard' | 'chat') => {
    if (newMode === mode) return; // Already in this mode

    // Save to AsyncStorage
    AsyncStorage.setItem(MODE_KEY, newMode).catch(console.error);

    if (newMode === 'chat') {
      // Transition TO AI Mode - Full screen with fade
      setMode('chat');
      Animated.parallel([
        Animated.timing(dashboardOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(chatOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Transition TO Dashboard (keyboard mode)
      Animated.parallel([
        Animated.timing(chatOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(dashboardOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setMode('keyboard');
      });
    }
  }, [mode, dashboardOpacity, chatOpacity]);

  // Toggle handler for AssistantCard
  const handleSwitchMode = useCallback(() => {
    const newMode = mode === 'keyboard' ? 'chat' : 'keyboard';
    handleModeChange(newMode);
  }, [mode, handleModeChange]);

  const handleCardPress = (screenId: string) => {
    trackScreenAccess(screenId);
    if (screenId === 'collaborators') {
      setActiveScreen('collaborators');
    }
  };

  // Dashboard Cards Configuration
  const dashboardCards = [
    {
      id: 'tasks',
      title: 'Tasks',
      icon: 'clipboard-check',
      color: theme.colors.accent.accent1,
      bgColor: theme.colors.accent.accent1 + '15',
      description: 'Daily tasks',
    },
    {
      id: 'assets',
      title: 'Assets',
      icon: 'cube-outline',
      color: theme.colors.accent.accent2,
      bgColor: theme.colors.accent.accent2 + '15',
      description: 'Track valuables',
    },
    {
      id: 'health',
      title: 'Health',
      icon: 'heart-pulse',
      color: theme.colors.accent.accent3,
      bgColor: theme.colors.accent.accent3 + '15',
      description: 'Health records',
    },
    {
      id: 'finance',
      title: 'Finance',
      icon: 'cash-multiple',
      color: theme.colors.accent.accent4,
      bgColor: theme.colors.accent.accent4 + '15',
      description: 'Manage finances',
    },
    {
      id: 'documents',
      title: 'Documents',
      icon: 'file-document-multiple',
      color: theme.colors.brand.primary,
      bgColor: theme.colors.brand.primary + '15',
      description: 'Store docs',
    },
    {
      id: 'events',
      title: 'Events',
      icon: 'calendar-star',
      color: theme.colors.brand.secondary,
      bgColor: theme.colors.brand.secondary + '15',
      description: 'Track events',
    },
  ];

  const getDisplayCards = () => {
    const recent = recentScreens
      .slice(0, 4)
      .map(id => dashboardCards.find(card => card.id === id))
      .filter(Boolean);

    if (recent.length < 4) {
      const remainingCards = dashboardCards.filter(
        card => !recent.find(r => r?.id === card.id)
      );
      recent.push(...remainingCards.slice(0, 4 - recent.length));
    }
    return recent;
  };

  const renderDashboardCard = (card: any) => (
    <AnimatedCard
      key={card.id}
      style={[
        styles.card,
        { backgroundColor: theme.colors.utility.secondaryBackground }
      ]}
      onPress={() => handleCardPress(card.id)}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.cardIconContainer, { backgroundColor: card.bgColor }]}>
          <MaterialCommunityIcons name={card.icon} size={24} color={card.color} />
        </View>
        <View style={[styles.arrowContainer, { backgroundColor: theme.colors.utility.primaryBackground }]}>
          <MaterialCommunityIcons name="arrow-right" size={16} color={theme.colors.utility.secondaryText} />
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: theme.colors.utility.primaryText }]}>
          {card.title}
        </Text>
        <Text style={[styles.cardDescription, { color: theme.colors.utility.secondaryText }]}>
          {card.description}
        </Text>
      </View>
    </AnimatedCard>
  );

  if (activeScreen === 'collaborators') {
    return <CollaboratorsScreen />;
  }

  // In AI mode: hide header and tabs for true full-screen
  const isAIMode = mode === 'chat';

  return (
    <MainLayout
      activeTab={isAIMode ? 'chat' : 'home'}
      headerTitle=""
      showHeader={!isAIMode}
      showTabs={!isAIMode}
      activeMode={mode}
      onModeChange={handleModeChange}
    >
      <StatusBar barStyle={isAIMode ? "light-content" : "dark-content"} />

      <View style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}>

        {/* DASHBOARD LAYER */}
        <Animated.View
          style={[
            styles.dashboardLayer,
            { opacity: dashboardOpacity }
          ]}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Animated Content Wrapper */}
            <Animated.View style={{
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }]
            }}>
              {/* Header Section */}
              <View style={styles.welcomeSection}>
                <View>
                  <Text style={[styles.greeting, { color: theme.colors.utility.secondaryText }]}>
                    Good Morning,
                  </Text>
                  <Text style={[styles.userName, { color: theme.colors.utility.primaryText }]}>
                    Kamal Charan
                  </Text>
                </View>
                <TouchableOpacity style={[styles.profileButton, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
                  <MaterialCommunityIcons name="account" size={24} color={theme.colors.brand.primary} />
                </TouchableOpacity>
              </View>

              {/* AI Assistant Trigger */}
              <View style={styles.assistantSection}>
                <AssistantCard mode={mode} onSwitchMode={handleSwitchMode} />
              </View>

              {/* Quick Actions Horizontal Scroll */}
              <View style={styles.quickActionsSection}>
                <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>
                  Quick Actions
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                  <TouchableOpacity
                    style={[styles.quickActionButton, { backgroundColor: theme.colors.brand.primary }]}
                    onPress={() => setShowQuickActions(true)}
                  >
                     <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
                     <Text style={[styles.quickActionText, { color: '#FFF' }]}>Add Asset</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.quickActionButton, { backgroundColor: theme.colors.utility.secondaryBackground }]}
                  >
                     <MaterialCommunityIcons name="file-upload-outline" size={24} color={theme.colors.brand.secondary} />
                     <Text style={[styles.quickActionText, { color: theme.colors.utility.primaryText }]}>Upload</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              {/* Main Grid */}
              <View style={styles.gridSection}>
                <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>
                  Overview
                </Text>
                <View style={styles.cardsGrid}>
                  {getDisplayCards().map((card) => renderDashboardCard(card))}
                </View>
              </View>

              {/* Collaborators */}
              <View style={styles.collaboratorSection}>
                <CollaboratorsCard onPress={() => handleCardPress('collaborators')} />
              </View>
            </Animated.View>
          </ScrollView>
        </Animated.View>

        {/* AI MODE LAYER (Full Screen) */}
        <Animated.View
          style={[
            styles.chatLayer,
            {
              opacity: chatOpacity,
              backgroundColor: theme.colors.utility.primaryBackground,
              paddingTop: insets.top,
            }
          ]}
          pointerEvents={isAIMode ? 'auto' : 'none'}
        >
          {/* AI Mode Header */}
          <View style={[styles.chatHeader, { backgroundColor: theme.colors.utility.primaryBackground, borderBottomColor: theme.colors.utility.secondaryText + '15' }]}>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: theme.colors.utility.secondaryBackground }]}
              onPress={handleSwitchMode}
            >
              <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.utility.primaryText} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <MaterialCommunityIcons name="robot-happy" size={22} color={theme.colors.brand.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.headerTitle, { color: theme.colors.utility.primaryText }]}>
                AI Assistant
              </Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          {/* Chat Content - Takes remaining space */}
          <View style={styles.chatContent}>
            <ChatModeContent userName="Kamal" />
          </View>
        </Animated.View>

        {/* Quick Action Card Modal */}
        <QuickActionCard
          visible={showQuickActions}
          onClose={() => setShowQuickActions(false)}
          actions={defaultQuickActions}
        />
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  dashboardLayer: {
    flex: 1,
    zIndex: 1,
  },
  chatLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, // Full screen - tab bar is hidden in AI mode
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
  },
  userName: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assistantSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  quickActionsSection: {
    marginBottom: 28,
  },
  horizontalScroll: {
    flexDirection: 'row',
    overflow: 'visible',
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginRight: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  quickActionText: {
    fontWeight: '600',
    fontSize: 14,
  },
  gridSection: {
    marginBottom: 28,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: (SCREEN_WIDTH - 52) / 2,
    padding: 16,
    borderRadius: 24,
    minHeight: 140,
    justifyContent: 'space-between',
    elevation: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  cardContent: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: 13,
    opacity: 0.7,
  },
  collaboratorSection: {
    marginBottom: 30,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -40, // Offset to center properly
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40, // Match backButton width for symmetry
  },
  chatContent: {
    flex: 1,
  },
});
