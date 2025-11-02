// src/features/onboarding/components/FamilyActionSheet.tsx
import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

interface FamilyActionSheetProps {
  visible: boolean;
  onClose: () => void;
  familyName: string;
  inviteCode: string;
  onShare: () => void;
  onComplete: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FamilyActionSheet({
  visible,
  onClose,
  familyName,
  inviteCode,
  onShare,
  onComplete,
}: FamilyActionSheetProps) {
  const { theme } = useTheme();

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(inviteCode);
    // You could show a toast here
  };

  const handleComplete = () => {
    onClose();
    onComplete();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View 
              style={[
                styles.modalContent, 
                { backgroundColor: theme.colors.utility.primaryBackground }
              ]}
            >
              {/* Success Icon */}
              <View style={[styles.successIcon, { backgroundColor: theme.colors.semantic.success + '20' }]}>
                <MaterialCommunityIcons 
                  name="check-circle" 
                  size={48} 
                  color={theme.colors.semantic.success} 
                />
              </View>

              {/* Title */}
              <Text style={[styles.title, { color: theme.colors.utility.primaryText }]}>
                Family Created Successfully!
              </Text>

              {/* Family Name */}
              <Text style={[styles.familyName, { color: theme.colors.utility.secondaryText }]}>
                {familyName}
              </Text>

              {/* Invite Code Section */}
              <View style={[
                styles.codeContainer,
                { backgroundColor: theme.colors.utility.secondaryBackground }
              ]}>
                <Text style={[styles.codeLabel, { color: theme.colors.utility.secondaryText }]}>
                  Invite Code
                </Text>
                <View style={styles.codeRow}>
                  <Text style={[styles.codeText, { color: theme.colors.brand.primary }]}>
                    {inviteCode}
                  </Text>
                  <TouchableOpacity onPress={copyToClipboard}>
                    <MaterialCommunityIcons 
                      name="content-copy" 
                      size={24} 
                      color={theme.colors.brand.primary} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Share Options */}
              <View style={styles.shareContainer}>
                <Text style={[styles.shareLabel, { color: theme.colors.utility.primaryText }]}>
                  Invite Family Members
                </Text>
                
                <View style={styles.shareOptions}>
                  <TouchableOpacity 
                    style={[
                      styles.shareButton,
                      { backgroundColor: '#25D366' }
                    ]}
                    onPress={onShare}
                  >
                    <MaterialCommunityIcons name="whatsapp" size={24} color="#fff" />
                    <Text style={styles.shareButtonText}>WhatsApp</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[
                      styles.shareButton,
                      { backgroundColor: theme.colors.brand.primary }
                    ]}
                    onPress={onShare}
                  >
                    <MaterialCommunityIcons name="share-variant" size={24} color="#fff" />
                    <Text style={styles.shareButtonText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Info Text */}
              <Text style={[styles.infoText, { color: theme.colors.utility.secondaryText }]}>
                Family members will need this code to join your family workspace
              </Text>

              {/* Actions */}
              <View style={styles.actions}>
                <Button
                  title="Done"
                  onPress={handleComplete}
                  buttonStyle={[
                    styles.doneButton,
                    { backgroundColor: theme.colors.brand.primary }
                  ]}
                  titleStyle={styles.doneButtonText}
                />
                
                <TouchableOpacity style={styles.inviteLaterButton} onPress={handleComplete}>
                  <Text style={[styles.inviteLaterText, { color: theme.colors.utility.secondaryText }]}>
                    I'll invite later
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 30,
    paddingBottom: 40,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  familyName: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  codeContainer: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  codeLabel: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  codeText: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 4,
  },
  shareContainer: {
    marginBottom: 20,
  },
  shareLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  shareOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  actions: {
    gap: 12,
  },
  doneButton: {
    borderRadius: 25,
    paddingVertical: 15,
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  inviteLaterButton: {
    alignItems: 'center',
    padding: 10,
  },
  inviteLaterText: {
    fontSize: 16,
    fontWeight: '500',
  },
});