// src/features/collaborators/components/AddProviderForm.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ServiceProvider, ServiceProviderCategory } from '../../../types/collaborators';

interface AddProviderFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (provider: Partial<ServiceProvider>) => void;
  initialData?: Partial<ServiceProvider>;
}

const CATEGORIES: { value: ServiceProviderCategory; label: string; icon: string }[] = [
  { value: 'health', label: 'Health', icon: 'hospital-box' },
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'finance', label: 'Finance', icon: 'cash' },
  { value: 'legal', label: 'Legal', icon: 'gavel' },
  { value: 'auto', label: 'Auto', icon: 'car' },
  { value: 'education', label: 'Education', icon: 'school' },
  { value: 'other', label: 'Other', icon: 'dots-horizontal' },
];

export const AddProviderForm: React.FC<AddProviderFormProps> = ({
  visible,
  onClose,
  onSave,
  initialData,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<Partial<ServiceProvider>>({
    name: initialData?.name || '',
    category: initialData?.category || 'other',
    specialization: initialData?.specialization || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    notes: initialData?.notes || '',
  });

  const handleSave = () => {
    // Validation
    if (!formData.name?.trim()) {
      Alert.alert('Required Field', 'Please enter a name');
      return;
    }

    if (!formData.phone?.trim()) {
      Alert.alert('Required Field', 'Please enter a phone number');
      return;
    }

    if (!formData.specialization?.trim()) {
      Alert.alert('Required Field', 'Please enter a specialization');
      return;
    }

    onSave({
      ...formData,
      isBookmarked: false,
      isExternal: false,
    });

    // Reset form
    setFormData({
      name: '',
      category: 'other',
      specialization: '',
      phone: '',
      email: '',
      notes: '',
    });
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      name: initialData?.name || '',
      category: initialData?.category || 'other',
      specialization: initialData?.specialization || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      notes: initialData?.notes || '',
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.utility.secondaryText + '20' }]}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <Text style={[styles.cancelText, { color: theme.colors.utility.secondaryText }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.utility.primaryText }]}>
            {initialData ? 'Edit Provider' : 'Add Service Provider'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            <Text style={[styles.saveText, { color: theme.colors.brand.primary }]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Name */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: theme.colors.utility.primaryText }]}>
              Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.utility.secondaryBackground,
                  color: theme.colors.utility.primaryText,
                  borderColor: theme.colors.utility.secondaryText + '20',
                }
              ]}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter provider name"
              placeholderTextColor={theme.colors.utility.secondaryText}
            />
          </View>

          {/* Category */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: theme.colors.utility.primaryText }]}>
              Category <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: formData.category === cat.value
                        ? theme.colors.brand.primary + '20'
                        : theme.colors.utility.secondaryBackground,
                      borderColor: formData.category === cat.value
                        ? theme.colors.brand.primary
                        : theme.colors.utility.secondaryText + '20',
                    }
                  ]}
                  onPress={() => setFormData({ ...formData, category: cat.value })}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={cat.icon as any}
                    size={24}
                    color={formData.category === cat.value
                      ? theme.colors.brand.primary
                      : theme.colors.utility.secondaryText
                    }
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      {
                        color: formData.category === cat.value
                          ? theme.colors.brand.primary
                          : theme.colors.utility.secondaryText
                      }
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Specialization */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: theme.colors.utility.primaryText }]}>
              Specialization <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.utility.secondaryBackground,
                  color: theme.colors.utility.primaryText,
                  borderColor: theme.colors.utility.secondaryText + '20',
                }
              ]}
              value={formData.specialization}
              onChangeText={(text) => setFormData({ ...formData, specialization: text })}
              placeholder="e.g., Cardiologist, Plumber, Accountant"
              placeholderTextColor={theme.colors.utility.secondaryText}
            />
          </View>

          {/* Phone */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: theme.colors.utility.primaryText }]}>
              Phone Number <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.utility.secondaryBackground,
                  color: theme.colors.utility.primaryText,
                  borderColor: theme.colors.utility.secondaryText + '20',
                }
              ]}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="+1 (555) 123-4567"
              placeholderTextColor={theme.colors.utility.secondaryText}
              keyboardType="phone-pad"
            />
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: theme.colors.utility.primaryText }]}>
              Email (Optional)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.utility.secondaryBackground,
                  color: theme.colors.utility.primaryText,
                  borderColor: theme.colors.utility.secondaryText + '20',
                }
              ]}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="provider@example.com"
              placeholderTextColor={theme.colors.utility.secondaryText}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Notes */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: theme.colors.utility.primaryText }]}>
              Notes (Optional)
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: theme.colors.utility.secondaryBackground,
                  color: theme.colors.utility.primaryText,
                  borderColor: theme.colors.utility.secondaryText + '20',
                }
              ]}
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              placeholder="Add any additional information..."
              placeholderTextColor={theme.colors.utility.secondaryText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
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
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    minWidth: 60,
  },
  cancelText: {
    fontSize: 16,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  formContent: {
    padding: 20,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  required: {
    color: '#F44336',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
