// src/features/onboarding/components/family/PendingInvites.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeContext';
import { PendingInvite } from '../../types/family';

interface PendingInvitesProps {
  invites: PendingInvite[];
}

export const PendingInvites: React.FC<PendingInvitesProps> = ({ invites }) => {
  const { theme } = useTheme();

  const pendingInvites = invites.filter(i => i.status === 'pending');

  if (pendingInvites.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.utility.primaryText }]}>
        Pending Invitations
      </Text>
      {pendingInvites.map((invite) => (
        <View
          key={invite.id}
          style={[styles.inviteCard, { backgroundColor: theme.colors.accent.accent4 + '20' }]}
        >
          <MaterialCommunityIcons
            name="email-outline"
            size={24}
            color={theme.colors.semantic.warning}
          />
          <View style={styles.inviteInfo}>
            <Text style={[styles.inviteEmail, { color: theme.colors.utility.primaryText }]}>
              {invite.email || invite.phone}
            </Text>
            <Text style={[styles.inviteRole, { color: theme.colors.utility.secondaryText }]}>
              Invited as {invite.role}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inviteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  inviteInfo: {
    flex: 1,
  },
  inviteEmail: {
    fontSize: 16,
    fontWeight: '500',
  },
  inviteRole: {
    fontSize: 14,
    marginTop: 2,
  },
});