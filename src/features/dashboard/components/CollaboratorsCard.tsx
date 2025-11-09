// src/features/dashboard/components/CollaboratorsCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useWorkspace } from '../../../contexts/WorkspaceContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CollaboratorsCardProps {
  onPress: () => void;
}

export const CollaboratorsCard: React.FC<CollaboratorsCardProps> = ({ onPress }) => {
  const { theme } = useTheme();
  const { activeWorkspace } = useWorkspace();

  const familyCount = activeWorkspace?.members.length || 0;
  // In real app, this would come from service providers data
  const providersCount = 10; // Placeholder

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.utility.secondaryBackground }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.accent.accent4 + '15' }]}>
          <MaterialCommunityIcons
            name="account-group"
            size={28}
            color={theme.colors.accent.accent4}
          />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: theme.colors.utility.primaryText }]}>
            Collaborators
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.utility.secondaryText }]}>
            Manage family & service providers
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={theme.colors.utility.secondaryText}
        />
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.brand.primary }]}>
            {familyCount}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.utility.secondaryText }]}>
            Family Members
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.colors.utility.secondaryText + '30' }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.accent.accent2 }]}>
            {providersCount}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.utility.secondaryText }]}>
            Service Providers
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 40,
  },
});
