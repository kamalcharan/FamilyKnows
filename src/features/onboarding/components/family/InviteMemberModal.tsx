// src/features/onboarding/components/family/InviteMemberModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Input, Button } from '@rneui/themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeContext';
import { UserRole } from '../../types/family';

interface InviteMemberModalProps {
  visible: boolean;
  onClose: () => void;
  onInvite: (email: string, role: UserRole) => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  visible,
  onClose,
  onInvite,
}) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('viewer');

  const handleInvite = () => {
    if (email.trim()) {
      onInvite(email, role);
      setEmail('');
      setRole('viewer');
    }
  };

  const getRoleIcon = (r: UserRole) => {
    switch (r) {
      case 'admin': return 'shield-crown';
      case 'editor': return 'pencil';
      case 'viewer': return 'eye';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.utility.primaryBackground }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.utility.primaryText }]}>
              Invite Member
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.utility.secondaryText}
              />
            </TouchableOpacity>
          </View>
          
          <Input
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            leftIcon={
              <MaterialCommunityIcons 
                name="email-outline" 
                size={20} 
                color={theme.colors.utility.secondaryText} 
              />
            }
            containerStyle={styles.inputContainer}
            inputContainerStyle={[
              styles.input,
              { backgroundColor: theme.colors.utility.secondaryBackground }
            ]}
            inputStyle={{ color: theme.colors.utility.primaryText }}
          />
          
          <View style={styles.roleSelector}>
            <Text style={[styles.roleSelectorLabel, { color: theme.colors.utility.primaryText }]}>
              Select Role:
            </Text>
            {(['viewer', 'editor', 'admin'] as UserRole[]).map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.roleOption,
                  { 
                    backgroundColor: role === r 
                      ? theme.colors.brand.primary + '20'
                      : theme.colors.utility.secondaryBackground,
                    borderColor: role === r
                      ? theme.colors.brand.primary
                      : 'transparent',
                  }
                ]}
                onPress={() => setRole(r)}
              >
                <MaterialCommunityIcons
                  name={getRoleIcon(r)}
                  size={20}
                  color={theme.colors.brand.primary}
                />
                <Text style={[styles.roleOptionText, { color: theme.colors.utility.primaryText }]}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Button
            title="Send Invitation"
            onPress={handleInvite}
            buttonStyle={[styles.modalButton, { backgroundColor: theme.colors.brand.primary }]}
            disabled={!email.trim()}
          />
        </View>
      </View>
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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  inputContainer: {
    paddingHorizontal: 0,
    marginBottom: 10,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  roleSelector: {
    marginBottom: 20,
  },
  roleSelectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
  },
  roleOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalButton: {
    borderRadius: 12,
    paddingVertical: 14,
  },
});