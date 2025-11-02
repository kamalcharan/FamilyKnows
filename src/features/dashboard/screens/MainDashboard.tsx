// src/features/dashboard/screens/MainDashboard.tsx (updated with theme-aware colors)
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Text } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MainLayout } from '../../../components/layout/MainLayout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const MainDashboard: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

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

  const renderDashboardCard = (card: any) => (
    <TouchableOpacity
      key={card.id}
      style={[
        styles.card,
        { backgroundColor: theme.colors.utility.secondaryBackground }
      ]}
      activeOpacity={0.7}
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

        {/* AI Assistant Card */}
        <TouchableOpacity
          style={[
            styles.aiCard,
            { 
              backgroundColor: theme.colors.brand.primary,
              // Add a subtle gradient effect using secondary color
              borderWidth: 1,
              borderColor: theme.colors.brand.secondary + '20',
            }
          ]}
          activeOpacity={0.8}
        >
          <View style={styles.aiCardContent}>
            <View style={styles.aiCardLeft}>
              <View style={[styles.aiIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <MaterialCommunityIcons
                  name="robot-happy"
                  size={36}
                  color="#fff"
                />
              </View>
              <View style={styles.aiCardText}>
                <Text style={styles.aiCardTitle}>Lucky Pop</Text>
                <Text style={styles.aiCardSubtitle}>Your own Virtual Assistant</Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name="microphone"
              size={24}
              color="#fff"
            />
          </View>
        </TouchableOpacity>

        {/* Dashboard Cards */}
        <View style={styles.cardsGrid}>
          {dashboardCards.map(renderDashboardCard)}
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