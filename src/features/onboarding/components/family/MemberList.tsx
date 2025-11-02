// src/features/onboarding/components/family/MembersList.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Avatar } from '@rneui/themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeContext';
import { FamilyMember, UserRole } from '../../types/family';

interface MembersListProps {
  members: FamilyMember[];
  currentUserId: string;
  isAdmin: boolean;
  onAddMember: () => void;
  onMemberPress: (member: FamilyMember) => void;
}

export const MembersList: React.FC<MembersListProps> = ({
  members,
  currentUserId,
  isAdmin,
  onAddMember,
  onMemberPress,
}) => {
  const { theme } = useTheme();

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'shield-crown';
      case 'editor':
        return 'pencil';
      case 'viewer':
        return 'eye';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return theme.colors.semantic.error;
      case 'editor':
        return theme.colors.semantic.warning;
      case 'viewer':
        return theme.colors.semantic.info;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.utility.primaryText }]}>
          Members
        </Text>
        {isAdmin && (
          <TouchableOpacity onPress={onAddMember}>
            <MaterialCommunityIcons
              name="account-plus"
              size={24}
              color={theme.colors.brand.primary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {members.map((member) => (
        <TouchableOpacity
          key={member.id}
          style={[styles.memberCard, { backgroundColor: theme.colors.utility.secondaryBackground }]}
          onPress={() => isAdmin && member.id !== currentUserId && onMemberPress(member)}
          disabled={!isAdmin || member.id === currentUserId}
        >
          <Avatar
            rounded
            title={member.name.split(' ').map(n => n[0]).join('')}
            size={40}
            containerStyle={{ backgroundColor: theme.colors.brand.primary }}
          />
          <View style={styles.memberInfo}>
            <View style={styles.memberNameRow}>
              <Text style={[styles.memberName, { color: theme.colors.utility.primaryText }]}>
                {member.name} {member.id === currentUserId && '(You)'}
              </Text>
              <MaterialCommunityIcons
                name={getRoleIcon(member.role)}
                size={16}
                color={getRoleColor(member.role)}
              />
            </View>
            <Text style={[styles.memberEmail, { color: theme.colors.utility.secondaryText }]}>
              {member.email}
            </Text>
          </View>
          {isAdmin && member.id !== currentUserId && (
            <MaterialCommunityIcons
              name="dots-vertical"
              size={20}
              color={theme.colors.utility.secondaryText}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
  },
  memberEmail: {
    fontSize: 14,
    marginTop: 2,
  },
});