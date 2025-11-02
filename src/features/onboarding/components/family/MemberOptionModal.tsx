// src/features/onboarding/components/family/MemberOptionsModal.tsx
import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Avatar, Divider } from '@rneui/themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeContext';
import { FamilyMember, UserRole } from '../../types/family';

interface MemberOptionsModalProps {
  visible: boolean;
  member: FamilyMember | null;
  onClose: () => void;
  onChangeRole: (role: UserRole) => void;
  onRemove: () => void;
}

export const MemberOptionsModal: React.FC<MemberOptionsModalProps> = ({
  visible,
  member,
  onClose,
  onChangeRole,
  onRemove,
}) => {
  const { theme } = useTheme();

  if (!member) return null;

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'shield-crown';
      case 'editor': return 'pencil';
      case 'viewer': return 'eye';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return theme.colors.semantic.error;
      case 'editor': return theme.colors.semantic.warning;
      case 'viewer': return theme.colors.semantic.info;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={[styles.modalContent, { backgroundColor: theme.colors.utility.primaryBackground }]}>
          <View style={styles.memberHeader}>
            <Avatar
              rounded
              title={member.name.split(' ').map(n => n[0]).join('')}
              size={40}
              containerStyle={{ backgroundColor: theme.colors.brand.primary }}
            />
            <View style={styles.memberInfo}>
              <Text style={[styles.memberName, { color: theme.colors.utility.primaryText }]}>
                {member.name}
              </Text>
              <Text style={[styles.memberEmail, { color: theme.colors.utility.secondaryText }]}>
                {member.email}
              </Text>
            </View>
          </View>
          
          <Divider style={{ marginVertical: 16 }} />
          
          <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>
            Change Role
          </Text>
          
          {(['viewer', 'editor', 'admin'] as UserRole[]).map((role) => (
            <TouchableOpacity
              key={role}
              style={styles.roleOption}
              onPress={() => {
                onChangeRole(role);
                onClose();
              }}
            >
              <MaterialCommunityIcons
                name={getRoleIcon(role)}
                size={24}
                color={getRoleColor(role)}
              />
              <Text style={[styles.roleText, { color: theme.colors.utility.primaryText }]}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Text>
              {member.role === role && (
                <MaterialCommunityIcons
                  name="check"
                  size={20}
                  color={theme.colors.brand.primary}
                  style={{ marginLeft: 'auto' }}
                />
              )}
            </TouchableOpacity>
          ))}
          
          <Divider style={{ marginVertical: 16 }} />
          
          <TouchableOpacity
            style={styles.dangerOption}
            onPress={() => {
              onRemove();
              onClose();
            }}
          >
            <MaterialCommunityIcons
              name="account-remove"
              size={24}
              color={theme.colors.semantic.error}
            />
            <Text style={[styles.dangerText, { color: theme.colors.semantic.error }]}>
              Remove from Workspace
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
  },
  memberEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  roleText: {
    fontSize: 16,
  },
  dangerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '500',
  },
});