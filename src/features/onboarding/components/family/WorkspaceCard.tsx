// src/features/onboarding/components/WorkspaceCard.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Badge } from '@rneui/themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeContext';
import { FamilyWorkspace } from '../../types/family';

interface WorkspaceCardProps {
  workspace: FamilyWorkspace;
  isAdmin: boolean;
  onPress: () => void;
  onShare: () => void;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  workspace,
  isAdmin,
  onPress,
  onShare,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.utility.secondaryBackground }]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>
            Current Workspace
          </Text>
          <Text style={[styles.name, { color: theme.colors.utility.primaryText }]}>
            {workspace.name}
          </Text>
        </View>
        <View style={styles.headerRight}>
          {workspace.isDefault && (
            <Badge
              value="Default"
              badgeStyle={{ backgroundColor: theme.colors.brand.primary }}
              textStyle={{ fontSize: 10 }}
            />
          )}
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color={theme.colors.utility.secondaryText}
          />
        </View>
      </View>
      
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.colors.brand.primary }]}>
            {workspace.members.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.utility.secondaryText }]}>
            Members
          </Text>
        </View>
        {isAdmin && (
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.colors.semantic.warning }]}>
              {workspace.pendingInvites.filter(i => i.status === 'pending').length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.utility.secondaryText }]}>
              Pending
            </Text>
          </View>
        )}
        <View style={styles.stat}>
          <TouchableOpacity onPress={onShare}>
            <MaterialCommunityIcons
              name="share-variant"
              size={24}
              color={theme.colors.brand.primary}
            />
          </TouchableOpacity>
          <Text style={[styles.statLabel, { color: theme.colors.utility.secondaryText }]}>
            Share
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});