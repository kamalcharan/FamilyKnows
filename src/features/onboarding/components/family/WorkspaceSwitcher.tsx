// src/features/onboarding/components/family/WorkspaceSwitcher.tsx
import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';
import { Badge } from '@rneui/themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeContext';
import { FamilyWorkspace } from '../../types/family';

interface WorkspaceSwitcherProps {
  visible: boolean;
  workspaces: FamilyWorkspace[];
  activeWorkspace: FamilyWorkspace | null;
  onClose: () => void;
  onSwitch: (workspace: FamilyWorkspace) => void;
}

export const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({
  visible,
  workspaces,
  activeWorkspace,
  onClose,
  onSwitch,
}) => {
  const { theme } = useTheme();

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
              Switch Workspace
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.utility.secondaryText}
              />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={workspaces}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.workspaceItem,
                  { 
                    backgroundColor: item.id === activeWorkspace?.id 
                      ? theme.colors.brand.primary + '20'
                      : theme.colors.utility.secondaryBackground 
                  }
                ]}
                onPress={() => {
                  onSwitch(item);
                  onClose();
                }}
              >
                <View style={styles.workspaceItemLeft}>
                  <Text style={[styles.workspaceItemName, { color: theme.colors.utility.primaryText }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.workspaceItemInfo, { color: theme.colors.utility.secondaryText }]}>
                    {item.members.length} members
                  </Text>
                </View>
                <View style={styles.workspaceItemRight}>
                  {item.isDefault && (
                    <Badge
                      value="Default"
                      badgeStyle={{ backgroundColor: theme.colors.brand.primary }}
                      textStyle={{ fontSize: 10 }}
                    />
                  )}
                  {item.id === activeWorkspace?.id && (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color={theme.colors.brand.primary}
                    />
                  )}
                </View>
              </TouchableOpacity>
            )}
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
    maxHeight: '80%',
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
  workspaceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  workspaceItemLeft: {
    flex: 1,
  },
  workspaceItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  workspaceItemInfo: {
    fontSize: 14,
  },
  workspaceItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});