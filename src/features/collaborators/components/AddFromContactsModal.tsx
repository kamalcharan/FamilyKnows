// src/features/collaborators/components/AddFromContactsModal.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import { ServiceProvider, ServiceProviderCategory } from '../../../types/collaborators';

interface AddFromContactsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectContact: (contact: Partial<ServiceProvider>) => void;
}

interface ContactItem {
  id: string;
  name: string;
  phoneNumbers: string[];
  emails: string[];
}

export const AddFromContactsModal: React.FC<AddFromContactsModalProps> = ({
  visible,
  onClose,
  onSelectContact,
}) => {
  const { theme } = useTheme();
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (visible) {
      requestContactsPermission();
    }
  }, [visible]);

  const requestContactsPermission = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status === 'granted') {
        loadContacts();
      } else {
        Alert.alert(
          'Permission Required',
          'FamilyKnows needs access to your contacts to add service providers. Please grant permission in your device settings.',
          [{ text: 'OK', onPress: onClose }]
        );
      }
    } catch (error) {
      console.error('Error requesting contacts permission:', error);
      Alert.alert('Error', 'Failed to request contacts permission');
    }
  };

  const loadContacts = async () => {
    setLoading(true);
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.Name,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Emails,
        ],
        sort: Contacts.SortTypes.FirstName,
      });

      const formattedContacts: ContactItem[] = data
        .filter((contact) => contact.name) // Only contacts with names
        .map((contact) => ({
          id: contact.id,
          name: contact.name || 'Unknown',
          phoneNumbers: contact.phoneNumbers?.map((p) => p.number || '') || [],
          emails: contact.emails?.map((e) => e.email || '') || [],
        }));

      setContacts(formattedContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
      Alert.alert('Error', 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleContactPress = (contact: ContactItem) => {
    // Create a partial ServiceProvider from the contact
    const serviceProvider: Partial<ServiceProvider> = {
      name: contact.name,
      phone: contact.phoneNumbers[0] || '',
      email: contact.emails[0],
      category: 'other' as ServiceProviderCategory,
      specialization: 'To be specified',
      isBookmarked: false,
      isExternal: false,
    };

    onSelectContact(serviceProvider);
    onClose();
  };

  const renderContact = ({ item }: { item: ContactItem }) => (
    <TouchableOpacity
      style={[styles.contactItem, { backgroundColor: theme.colors.utility.secondaryBackground }]}
      onPress={() => handleContactPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.contactAvatar, { backgroundColor: theme.colors.brand.primary + '20' }]}>
        <Text style={[styles.contactInitial, { color: theme.colors.brand.primary }]}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, { color: theme.colors.utility.primaryText }]}>
          {item.name}
        </Text>
        {item.phoneNumbers.length > 0 && (
          <Text style={[styles.contactDetail, { color: theme.colors.utility.secondaryText }]}>
            {item.phoneNumbers[0]}
          </Text>
        )}
        {item.emails.length > 0 && (
          <Text style={[styles.contactDetail, { color: theme.colors.utility.secondaryText }]}>
            {item.emails[0]}
          </Text>
        )}
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={theme.colors.utility.secondaryText}
      />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.utility.secondaryText + '20' }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons
              name="close"
              size={28}
              color={theme.colors.utility.primaryText}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.utility.primaryText }]}>
            Select from Contacts
          </Text>
          <View style={styles.closeButton} />
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.brand.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.utility.secondaryText }]}>
              Loading contacts...
            </Text>
          </View>
        ) : contacts.length > 0 ? (
          <>
            <View style={styles.infoBar}>
              <MaterialCommunityIcons
                name="information"
                size={20}
                color={theme.colors.brand.primary}
              />
              <Text style={[styles.infoText, { color: theme.colors.utility.secondaryText }]}>
                Select a contact to add as a service provider. You can edit details later.
              </Text>
            </View>
            <FlatList
              data={contacts}
              renderItem={renderContact}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={true}
            />
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="contacts-outline"
              size={64}
              color={theme.colors.utility.secondaryText}
            />
            <Text style={[styles.emptyText, { color: theme.colors.utility.secondaryText }]}>
              No contacts found
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInitial: {
    fontSize: 20,
    fontWeight: '600',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactDetail: {
    fontSize: 13,
    marginBottom: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
  },
});
