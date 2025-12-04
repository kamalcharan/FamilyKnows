// src/features/dashboard/screens/MainDashboard.tsx
// Fluid Morph Dashboard - Dual Layer Architecture
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
import { useNavigation } from '@react-navigation/native';
import { AssistantCard } from '../components/AssistantCard';
import { CollaboratorsCard } from '../components/CollaboratorsCard';
import { ChatModeContent } from '../../chat';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const RECENT_SCREENS_KEY = '@FamilyKnows:recentScreens';

// Interactive Card with Scale Animation
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
  const navigation = useNavigation<any>();

  // State
  const [mode, setMode] = useState<'keyboard' | 'chat'>('keyboard');
  const [recentScreens, setRecentScreens] = useState<string[]>([]);

  // DUAL-LAYER ANIMATIONS
  // Dashboard Recede Animation (0 = normal, 1 = receded)
  const dashboardAnim = useRef(new Animated.Value(0)).current;
  // Chat Slide Animation (starts off-screen)
  const chatSlideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Entrance animation
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
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

  const loadRecentScreens = async () => {
    try {
      const saved = await AsyncStorage.getItem(RECENT_SCREENS_KEY);
      if (saved) setRecentScreens(JSON.parse(saved));
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

  // --- FLUID TRANSITION LOGIC ---
  const handleSwitchMode = useCallback(() => {
    const targetMode = mode === 'keyboard' ? 'chat' : 'keyboard';

    if (targetMode === 'chat') {
      setMode('chat');
      // OPEN CHAT: Slide up + Recede Dashboard
      Animated.parallel([
        Animated.timing(dashboardAnim, {
          toValue: 1, // Receded state
          duration: 400,
          useNativeDriver: true,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        Animated.spring(chatSlideAnim, {
          toValue: 0, // Slide to visible
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // CLOSE CHAT: Slide down + Restore Dashboard
      Animated.parallel([
        Animated.timing(dashboardAnim, {
          toValue: 0, // Restored state
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(chatSlideAnim, {
          toValue: SCREEN_HEIGHT, // Slide away
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setMode('keyboard'));
    }
  }, [mode, dashboardAnim, chatSlideAnim]);

  // Dashboard Interpolations
  const dashboardScale = dashboardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.92],
  });

  const dashboardOpacity = dashboardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.6],
  });

  const dashboardBorderRadius = dashboardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 24],
  });

  const handleCardPress = (screenId: string) => {
    trackScreenAccess(screenId);

    if (screenId === 'assets') {
      navigation.navigate('AssetsHub');
    } else if (screenId === 'health') {
      navigation.navigate('HealthTimeline');
    } else if (screenId === 'collaborators') {
      navigation.navigate('CollaboratorsOrbit');
    } else if (screenId === 'documents') {
      navigation.navigate('DocumentsVault');
    }
  };

  // Dashboard Cards with LIVE STATUS BADGES
  const dashboardCards = [
    {
      id: 'tasks',
      title: 'Tasks',
      icon: 'clipboard-check',
      color: theme.colors.accent.accent1,
      bgColor: theme.colors.accent.accent1 + '15',
      badge: '2 Due',
      badgeColor: theme.colors.semantic.warning,
    },
    {
      id: 'assets',
      title: 'Assets',
      icon: 'cube-outline',
      color: theme.colors.accent.accent2,
      bgColor: theme.colors.accent.accent2 + '15',
      badge: '1 Alert',
      badgeColor: theme.colors.semantic.error,
    },
    {
      id: 'health',
      title: 'Health',
      icon: 'heart-pulse',
      color: theme.colors.accent.accent3,
      bgColor: theme.colors.accent.accent3 + '15',
      badge: null,
      badgeColor: null,
    },
    {
      id: 'finance',
      title: 'Finance',
      icon: 'cash-multiple',
      color: theme.colors.accent.accent4,
      bgColor: theme.colors.accent.accent4 + '15',
      badge: '+12%',
      badgeColor: theme.colors.semantic.success,
    },
    {
      id: 'documents',
      title: 'Documents',
      icon: 'file-document-multiple',
      color: theme.colors.brand.primary,
      bgColor: theme.colors.brand.primary + '15',
      badge: null,
      badgeColor: null,
    },
    {
      id: 'events',
      title: 'Events',
      icon: 'calendar-star',
      color: theme.colors.brand.secondary,
      bgColor: theme.colors.brand.secondary + '15',
      badge: 'Today',
      badgeColor: theme.colors.brand.primary,
    },
  ];

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
        {/* LIVE STATUS BADGE */}
        {card.badge && (
          <View style={[styles.badge, { backgroundColor: card.badgeColor + '20' }]}>
            <Text style={[styles.badgeText, { color: card.badgeColor }]}>{card.badge}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.cardTitle, { color: theme.colors.utility.primaryText }]}>
        {card.title}
      </Text>
    </AnimatedCard>
  );

  const isAIMode = mode === 'chat';

  return (
    <MainLayout
      activeTab={isAIMode ? 'chat' : 'home'}
      headerTitle=""
      showHeader={!isAIMode}
      showTabs={true}
      activeMode={mode}
      onModeChange={handleSwitchMode}
    >
      <StatusBar barStyle={isAIMode ? "light-content" : "dark-content"} />

      {/* Container with dark background for recede effect */}
      <View style={[styles.container, { backgroundColor: '#000' }]}>

        {/* --- LAYER 1: DASHBOARD (Receding) --- */}
        <Animated.View
          style={[
            styles.dashboardLayer,
            {
              backgroundColor: theme.colors.utility.primaryBackground,
              transform: [{ scale: dashboardScale }],
              opacity: dashboardOpacity,
              borderRadius: dashboardBorderRadius,
              overflow: 'hidden',
            }
          ]}
        >
          <ScrollView
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

              {/* Quick Actions */}
              <View style={styles.quickActionsSection}>
                <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>
                  Quick Actions
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                  <TouchableOpacity
                    style={[styles.quickActionButton, { backgroundColor: theme.colors.brand.primary }]}
                    onPress={() => navigation.navigate('AddAsset')}
                  >
                    <MaterialCommunityIcons name="plus" size={20} color="#FFF" />
                    <Text style={styles.quickActionTextLight}>Add Entity</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.quickActionButton, { backgroundColor: theme.colors.utility.secondaryBackground }]}
                  >
                    <MaterialCommunityIcons name="file-upload-outline" size={20} color={theme.colors.utility.primaryText} />
                    <Text style={[styles.quickActionText, { color: theme.colors.utility.primaryText }]}>Upload</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.quickActionButton, { backgroundColor: theme.colors.utility.secondaryBackground }]}
                  >
                    <MaterialCommunityIcons name="qrcode-scan" size={20} color={theme.colors.utility.primaryText} />
                    <Text style={[styles.quickActionText, { color: theme.colors.utility.primaryText }]}>Scan</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              {/* Live Overview Grid */}
              <View style={styles.gridSection}>
                <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>
                  Overview
                </Text>
                <View style={styles.cardsGrid}>
                  {dashboardCards.map((card) => renderDashboardCard(card))}
                </View>
              </View>

              {/* Collaborators */}
              <View style={styles.collaboratorSection}>
                <CollaboratorsCard onPress={() => handleCardPress('collaborators')} />
              </View>
            </Animated.View>
          </ScrollView>
        </Animated.View>

        {/* --- LAYER 2: CHAT (Sliding Up as Bottom Sheet) --- */}
        <Animated.View
          style={[
            styles.chatLayer,
            {
              transform: [{ translateY: chatSlideAnim }],
              backgroundColor: theme.mode === 'dark' ? 'rgba(30, 41, 59, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            }
          ]}
          pointerEvents={isAIMode ? 'auto' : 'none'}
        >
          {/* Drag Handle */}
          <TouchableOpacity onPress={handleSwitchMode} style={styles.chatHandle} activeOpacity={0.8}>
            <View style={[styles.handleBar, { backgroundColor: theme.colors.utility.secondaryText + '40' }]} />
          </TouchableOpacity>

          {/* Chat Header */}
          <View style={[styles.chatHeader, { borderBottomColor: theme.colors.utility.secondaryText + '15' }]}>
            <View style={styles.chatHeaderContent}>
              <View style={[styles.aiIconContainer, { backgroundColor: theme.colors.brand.primary + '15' }]}>
                <MaterialCommunityIcons name="robot-happy" size={24} color={theme.colors.brand.primary} />
              </View>
              <View style={styles.chatHeaderText}>
                <Text style={[styles.chatTitle, { color: theme.colors.utility.primaryText }]}>
                  Hi Kamal
                </Text>
                <Text style={[styles.chatSubtitle, { color: theme.colors.utility.secondaryText }]}>
                  How can I help you today?
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: theme.colors.utility.secondaryBackground }]}
                onPress={handleSwitchMode}
              >
                <MaterialCommunityIcons name="close" size={20} color={theme.colors.utility.secondaryText} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Chat Content */}
          <View style={styles.chatContent}>
            <ChatModeContent userName="Kamal" />
          </View>
        </Animated.View>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },

  // --- DASHBOARD LAYER ---
  dashboardLayer: {
    flex: 1,
    zIndex: 1,
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

  // Quick Actions
  quickActionsSection: {
    marginBottom: 28,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    gap: 8,
  },
  quickActionText: {
    fontWeight: '600',
    fontSize: 14,
  },
  quickActionTextLight: {
    fontWeight: '600',
    fontSize: 14,
    color: '#FFF',
  },

  // Grid
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
    borderRadius: 20,
    minHeight: 120,
    justifyContent: 'space-between',
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },

  // Live Status Badges
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  collaboratorSection: {
    marginBottom: 30,
  },

  // --- CHAT LAYER (Bottom Sheet) ---
  chatLayer: {
    position: 'absolute',
    top: 50, // Gap at top to see receded dashboard
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 24,
    zIndex: 10,
  },
  chatHandle: {
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
  },
  chatHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  chatHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  chatSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContent: {
    flex: 1,
  },
});
