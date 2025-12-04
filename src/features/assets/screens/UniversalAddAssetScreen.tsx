// src/features/assets/screens/UniversalAddAssetScreen.tsx
// Smart Lens Creation: Capture → Classify → Enrich
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
  Modal,
} from 'react-native';
import { Text, Button, Divider } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { useFamily } from '../../../context/FamilyContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// --- THE 7 PILLARS (Broad Categories) ---
const ASSET_TYPES = [
  { id: 'properties', label: 'Property', icon: 'home-city', color: '#4F46E5', description: 'Land, Flat, Commercial' },
  { id: 'mobility', label: 'Vehicle', icon: 'car', color: '#10B981', description: 'Car, Bike, Scooter' },
  { id: 'electronics', label: 'Electronics', icon: 'laptop', color: '#F59E0B', description: 'Devices, Appliances' },
  { id: 'protection', label: 'Insurance', icon: 'shield-check', color: '#8B5CF6', description: 'Life, Health, Vehicle' },
  { id: 'wellness', label: 'Health', icon: 'heart-pulse', color: '#EF4444', description: 'Medical Care, Conditions' },
  { id: 'valuables', label: 'Valuables', icon: 'diamond-stone', color: '#EC4899', description: 'Gold, Art, Watches' },
  { id: 'identity', label: 'Documents', icon: 'file-document', color: '#6B7280', description: 'Passports, IDs, Deeds' },
];

// --- SUB-TYPES for each category ---
const SUB_TYPES: { [key: string]: { id: string; label: string; icon: string }[] } = {
  properties: [
    { id: 'flat', label: 'Flat/Apartment', icon: 'office-building' },
    { id: 'house', label: 'Independent House', icon: 'home' },
    { id: 'land', label: 'Land/Plot', icon: 'terrain' },
    { id: 'commercial', label: 'Commercial', icon: 'store' },
  ],
  mobility: [
    { id: 'car', label: 'Car', icon: 'car' },
    { id: 'bike', label: 'Bike/Scooter', icon: 'motorbike' },
    { id: 'bicycle', label: 'Bicycle', icon: 'bicycle' },
  ],
  electronics: [
    { id: 'mobile', label: 'Mobile Phone', icon: 'cellphone' },
    { id: 'laptop', label: 'Laptop/Computer', icon: 'laptop' },
    { id: 'appliance', label: 'Home Appliance', icon: 'washing-machine' },
    { id: 'hvac', label: 'AC/Inverter', icon: 'air-conditioner' },
    { id: 'tv', label: 'TV/Entertainment', icon: 'television' },
  ],
  protection: [
    { id: 'life', label: 'Life Insurance', icon: 'shield-account' },
    { id: 'health', label: 'Health Insurance', icon: 'medical-bag' },
    { id: 'vehicle', label: 'Vehicle Insurance', icon: 'car-info' },
    { id: 'property', label: 'Property Insurance', icon: 'home-flood' },
  ],
  wellness: [
    { id: 'chronic', label: 'Chronic Condition', icon: 'heart-pulse' },
    { id: 'medication', label: 'Medication Tracking', icon: 'pill' },
    { id: 'specialist', label: 'Specialist Care', icon: 'stethoscope' },
    { id: 'dental', label: 'Dental Care', icon: 'tooth' },
  ],
  valuables: [
    { id: 'gold', label: 'Gold/Jewelry', icon: 'necklace' },
    { id: 'watch', label: 'Watch', icon: 'watch' },
    { id: 'art', label: 'Art/Collectibles', icon: 'palette' },
  ],
  identity: [
    { id: 'passport', label: 'Passport', icon: 'passport' },
    { id: 'aadhaar', label: 'Aadhaar Card', icon: 'card-account-details' },
    { id: 'pan', label: 'PAN Card', icon: 'credit-card' },
    { id: 'license', label: 'Driving License', icon: 'card-account-details-outline' },
    { id: 'deed', label: 'Property Deed', icon: 'file-document' },
  ],
};

export const UniversalAddAssetScreen: React.FC = () => {
  const { theme } = useTheme();
  const { members, getMemberById } = useFamily();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  // State
  const [step, setStep] = useState(1); // 1: Category, 2: Sub-type, 3: Details
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<string | null>(null);
  const [assetName, setAssetName] = useState('');

  // Linked Member State
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isSharedAsset, setIsSharedAsset] = useState(false);
  const [showMemberPicker, setShowMemberPicker] = useState(false);

  // Dynamic Fields State
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  // Get selected member details
  const selectedMember = selectedMemberId ? getMemberById(selectedMemberId) : null;

  // Get role label based on category
  const getRoleLabel = useMemo(() => {
    switch (selectedType) {
      case 'wellness': return 'Patient';
      case 'protection': return 'Policyholder';
      case 'mobility': return 'Owner';
      case 'identity': return 'Holder';
      case 'electronics': return 'Primary User';
      case 'valuables': return 'Owner';
      case 'properties': return 'Owner';
      default: return 'Owner';
    }
  }, [selectedType]);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Reset animation on step change
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [step]);

  const handleBack = () => {
    if (step === 1) {
      navigation.goBack();
    } else {
      setStep(step - 1);
    }
  };

  const handleCategorySelect = (typeId: string) => {
    setSelectedType(typeId);
    setStep(2);
  };

  const handleSubTypeSelect = (subTypeId: string) => {
    setSelectedSubType(subTypeId);
    setStep(3);
  };

  const handleSave = () => {
    // In real app, save to database
    navigation.navigate('AssetsHub');
  };

  const getTypeDetails = () => ASSET_TYPES.find(t => t.id === selectedType);
  const getSubTypes = () => selectedType ? SUB_TYPES[selectedType] || [] : [];

  // HELPER: Render member selector
  const renderMemberSelector = () => (
    <View style={styles.inputGroup}>
      <View style={styles.memberSelectorHeader}>
        <Text style={[styles.label, { color: theme.colors.utility.secondaryText, marginBottom: 0 }]}>
          {getRoleLabel}
        </Text>
        {/* Shared Toggle - Only for properties, protection, electronics */}
        {['properties', 'protection', 'electronics'].includes(selectedType || '') && (
          <TouchableOpacity
            style={[styles.sharedToggle, isSharedAsset && { backgroundColor: theme.colors.brand.primary + '15' }]}
            onPress={() => {
              setIsSharedAsset(!isSharedAsset);
              if (!isSharedAsset) setSelectedMemberId(null);
            }}
          >
            <MaterialCommunityIcons
              name="account-group"
              size={16}
              color={isSharedAsset ? theme.colors.brand.primary : theme.colors.utility.secondaryText}
            />
            <Text style={{ fontSize: 12, color: isSharedAsset ? theme.colors.brand.primary : theme.colors.utility.secondaryText, fontWeight: '600' }}>
              Family Shared
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isSharedAsset ? (
        <View style={[styles.sharedBadgeContainer, { backgroundColor: theme.colors.brand.primary + '10', borderColor: theme.colors.brand.primary + '30' }]}>
          <MaterialCommunityIcons name="account-group" size={22} color={theme.colors.brand.primary} />
          <View style={{ marginLeft: 12 }}>
            <Text style={[styles.sharedBadgeTitle, { color: theme.colors.utility.primaryText }]}>Shared with Family</Text>
            <Text style={[styles.sharedBadgeSubtitle, { color: theme.colors.utility.secondaryText }]}>This item will be visible to everyone</Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.memberSelectButton,
            {
              borderColor: selectedMember ? selectedMember.color : theme.colors.utility.secondaryText + '30',
              backgroundColor: selectedMember ? selectedMember.color + '10' : theme.colors.utility.secondaryBackground
            }
          ]}
          onPress={() => setShowMemberPicker(true)}
        >
          {selectedMember ? (
            <>
              {selectedMember.avatar ? (
                <Image source={{ uri: selectedMember.avatar }} style={styles.memberSelectAvatar} />
              ) : (
                <View style={[styles.memberSelectAvatar, { backgroundColor: selectedMember.color }]}>
                  <Text style={styles.memberSelectInitial}>{selectedMember.name.charAt(0)}</Text>
                </View>
              )}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.memberSelectName, { color: theme.colors.utility.primaryText }]}>
                  {selectedMember.displayRelationship}
                </Text>
                <Text style={[styles.memberSelectRole, { color: theme.colors.utility.secondaryText }]}>
                  {selectedMember.name} • {getRoleLabel}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-down" size={20} color={theme.colors.utility.secondaryText} />
            </>
          ) : (
            <>
              <View style={[styles.memberSelectPlaceholder, { backgroundColor: theme.colors.utility.secondaryText + '20' }]}>
                <MaterialCommunityIcons name="account" size={20} color={theme.colors.utility.secondaryText} />
              </View>
              <Text style={[styles.memberSelectText, { color: theme.colors.utility.secondaryText }]}>
                Select Family Member
              </Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color={theme.colors.utility.secondaryText} />
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  // HELPER: Render member picker modal
  const renderMemberPickerModal = () => (
    <Modal
      visible={showMemberPicker}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowMemberPicker(false)}
    >
      <View style={[styles.modalContainer, { backgroundColor: theme.colors.utility.primaryBackground }]}>
        <View style={[styles.modalHeader, { borderBottomColor: theme.colors.utility.secondaryText + '20' }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.utility.primaryText }]}>Select {getRoleLabel}</Text>
          <TouchableOpacity onPress={() => setShowMemberPicker(false)}>
            <MaterialCommunityIcons name="close" size={24} color={theme.colors.utility.secondaryText} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {members.map((member) => (
            <TouchableOpacity
              key={member.id}
              style={[
                styles.memberPickerItem,
                {
                  backgroundColor: theme.colors.utility.secondaryBackground,
                  borderColor: selectedMemberId === member.id ? member.color : 'transparent',
                  borderWidth: selectedMemberId === member.id ? 2 : 0,
                }
              ]}
              onPress={() => {
                setSelectedMemberId(member.id);
                setShowMemberPicker(false);
              }}
            >
              {member.avatar ? (
                <Image source={{ uri: member.avatar }} style={styles.memberPickerAvatar} />
              ) : (
                <View style={[styles.memberPickerAvatar, { backgroundColor: member.color }]}>
                  <Text style={styles.memberPickerInitial}>{member.name.charAt(0)}</Text>
                </View>
              )}
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={[styles.memberPickerName, { color: theme.colors.utility.primaryText }]}>
                  {member.displayRelationship}
                </Text>
                <Text style={[styles.memberPickerRelation, { color: theme.colors.utility.secondaryText }]}>
                  {member.name}
                </Text>
              </View>
              {selectedMemberId === member.id && (
                <MaterialCommunityIcons name="check-circle" size={24} color={member.color} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );

  // HELPER: Render dynamic fields based on type
  const renderDynamicFields = () => {
    const typeDetails = getTypeDetails();
    if (!typeDetails) return null;

    switch (selectedType) {
      case 'mobility':
        return (
          <>
            {renderMemberSelector()}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Registration Number</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}
                placeholder="KA-01-XX-1234"
                placeholderTextColor={theme.colors.utility.secondaryText + '80'}
                value={formData.regNumber}
                onChangeText={(text) => setFormData({ ...formData, regNumber: text })}
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Insurance Expiry</Text>
                <TouchableOpacity style={[styles.dateInput, { borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}>
                  <MaterialCommunityIcons name="calendar" size={20} color={theme.colors.brand.primary} />
                  <Text style={{ color: theme.colors.utility.secondaryText }}>Select Date</Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: 12 }} />
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Last Service</Text>
                <TouchableOpacity style={[styles.dateInput, { borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}>
                  <MaterialCommunityIcons name="calendar-check" size={20} color={theme.colors.brand.primary} />
                  <Text style={{ color: theme.colors.utility.secondaryText }}>Select Date</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        );

      case 'electronics':
        return (
          <>
            {renderMemberSelector()}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Location in Home</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}
                placeholder="e.g. Living Room, Utility Area"
                placeholderTextColor={theme.colors.utility.secondaryText + '80'}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Warranty / AMC Valid Until</Text>
              <TouchableOpacity style={[styles.dateInput, { borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}>
                <MaterialCommunityIcons name="shield-check" size={20} color={theme.colors.brand.primary} />
                <Text style={{ color: theme.colors.utility.secondaryText }}>Select Date</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.scanButton, { backgroundColor: theme.colors.brand.primary + '15' }]}>
              <MaterialCommunityIcons name="barcode-scan" size={24} color={theme.colors.brand.primary} />
              <Text style={{ color: theme.colors.brand.primary, fontWeight: '600' }}>Scan Invoice for Details</Text>
            </TouchableOpacity>
          </>
        );

      case 'protection':
        return (
          <>
            {renderMemberSelector()}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Policy Number</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}
                placeholder="e.g. POL-123456789"
                placeholderTextColor={theme.colors.utility.secondaryText + '80'}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Sum Insured / Cover Amount</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}
                placeholder="e.g. ₹50,00,000"
                placeholderTextColor={theme.colors.utility.secondaryText + '80'}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Premium Due</Text>
                <TouchableOpacity style={[styles.dateInput, { borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}>
                  <MaterialCommunityIcons name="calendar-alert" size={20} color={theme.colors.brand.primary} />
                  <Text style={{ color: theme.colors.utility.secondaryText }}>Select Date</Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: 12 }} />
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Validity</Text>
                <TouchableOpacity style={[styles.dateInput, { borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}>
                  <MaterialCommunityIcons name="calendar-check" size={20} color={theme.colors.brand.primary} />
                  <Text style={{ color: theme.colors.utility.secondaryText }}>Select Date</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={[styles.scanButton, { backgroundColor: theme.colors.brand.primary + '15' }]}>
              <MaterialCommunityIcons name="camera" size={24} color={theme.colors.brand.primary} />
              <Text style={{ color: theme.colors.brand.primary, fontWeight: '600' }}>Scan Policy Document</Text>
            </TouchableOpacity>
          </>
        );

      case 'wellness':
        return (
          <>
            {renderMemberSelector()}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Primary Doctor / Specialist</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}
                placeholder="e.g. Dr. Rao, Apollo Hospital"
                placeholderTextColor={theme.colors.utility.secondaryText + '80'}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Next Checkup / Appointment</Text>
              <TouchableOpacity style={[styles.dateInput, { borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}>
                <MaterialCommunityIcons name="calendar-heart" size={20} color={theme.colors.brand.primary} />
                <Text style={{ color: theme.colors.utility.secondaryText }}>Select Date</Text>
              </TouchableOpacity>
            </View>
          </>
        );

      case 'properties':
        return (
          <>
            {renderMemberSelector()}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Address</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground, height: 80, textAlignVertical: 'top' }]}
                placeholder="Full address..."
                placeholderTextColor={theme.colors.utility.secondaryText + '80'}
                multiline
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Property Tax Due</Text>
                <TouchableOpacity style={[styles.dateInput, { borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}>
                  <MaterialCommunityIcons name="calendar" size={20} color={theme.colors.brand.primary} />
                  <Text style={{ color: theme.colors.utility.secondaryText }}>Select</Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: 12 }} />
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Ownership</Text>
                <TouchableOpacity style={[styles.dateInput, { borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}>
                  <MaterialCommunityIcons name="account-group" size={20} color={theme.colors.brand.primary} />
                  <Text style={{ color: theme.colors.utility.secondaryText }}>Select</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        );

      case 'identity':
        return (
          <>
            {renderMemberSelector()}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Document Number</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}
                placeholder="e.g. J1234567"
                placeholderTextColor={theme.colors.utility.secondaryText + '80'}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Expiry / Renewal Date</Text>
              <TouchableOpacity style={[styles.dateInput, { borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}>
                <MaterialCommunityIcons name="calendar-clock" size={20} color={theme.colors.brand.primary} />
                <Text style={{ color: theme.colors.utility.secondaryText }}>Select Date</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.scanButton, { backgroundColor: theme.colors.brand.primary + '15' }]}>
              <MaterialCommunityIcons name="camera" size={24} color={theme.colors.brand.primary} />
              <Text style={{ color: theme.colors.brand.primary, fontWeight: '600' }}>Scan Document</Text>
            </TouchableOpacity>
          </>
        );

      default:
        return (
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Notes / Description</Text>
            <TextInput
              style={[styles.input, { height: 100, color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground, textAlignVertical: 'top' }]}
              placeholder="Add any relevant details..."
              placeholderTextColor={theme.colors.utility.secondaryText + '80'}
              multiline
            />
          </View>
        );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}
    >
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.utility.primaryText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.utility.primaryText }]}>
          {step === 1 ? 'Add to Vault' : step === 2 ? 'Select Type' : 'Enter Details'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {[1, 2, 3].map((s) => (
          <View
            key={s}
            style={[
              styles.progressDot,
              {
                backgroundColor: s <= step ? theme.colors.brand.primary : theme.colors.utility.secondaryText + '30',
                width: s === step ? 24 : 8,
              }
            ]}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* STEP 1: CATEGORY SELECTION */}
          {step === 1 && (
            <>
              {/* Smart Scan Option */}
              <TouchableOpacity style={[styles.scanHero, { backgroundColor: theme.colors.utility.secondaryBackground, borderColor: theme.colors.brand.primary + '30' }]}>
                <View style={[styles.scanIconContainer, { backgroundColor: theme.colors.brand.primary + '15' }]}>
                  <MaterialCommunityIcons name="camera-iris" size={40} color={theme.colors.brand.primary} />
                </View>
                <View style={styles.scanTextContainer}>
                  <Text style={[styles.scanTitle, { color: theme.colors.utility.primaryText }]}>Smart Scan</Text>
                  <Text style={[styles.scanSubtitle, { color: theme.colors.utility.secondaryText }]}>
                    Take a photo - AI will detect & fill details
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.utility.secondaryText} />
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.utility.secondaryText + '20' }]} />
                <Text style={[styles.dividerText, { color: theme.colors.utility.secondaryText }]}>OR CHOOSE CATEGORY</Text>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.utility.secondaryText + '20' }]} />
              </View>

              <View style={styles.grid}>
                {ASSET_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.typeCard, { backgroundColor: theme.colors.utility.secondaryBackground }]}
                    onPress={() => handleCategorySelect(type.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.iconBubble, { backgroundColor: type.color + '15' }]}>
                      <MaterialCommunityIcons name={type.icon as any} size={28} color={type.color} />
                    </View>
                    <Text style={[styles.typeLabel, { color: theme.colors.utility.primaryText }]}>{type.label}</Text>
                    <Text style={[styles.typeDescription, { color: theme.colors.utility.secondaryText }]}>{type.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* STEP 2: SUB-TYPE SELECTION */}
          {step === 2 && selectedType && (
            <>
              <View style={styles.selectedHeader}>
                <View style={[styles.selectedBadge, { backgroundColor: getTypeDetails()?.color + '15' }]}>
                  <MaterialCommunityIcons name={getTypeDetails()?.icon as any} size={20} color={getTypeDetails()?.color} />
                  <Text style={[styles.selectedBadgeText, { color: getTypeDetails()?.color }]}>{getTypeDetails()?.label}</Text>
                </View>
              </View>

              <Text style={[styles.stepTitle, { color: theme.colors.utility.primaryText }]}>What type of {getTypeDetails()?.label.toLowerCase()}?</Text>

              <View style={styles.subTypeList}>
                {getSubTypes().map((subType) => (
                  <TouchableOpacity
                    key={subType.id}
                    style={[styles.subTypeCard, { backgroundColor: theme.colors.utility.secondaryBackground }]}
                    onPress={() => handleSubTypeSelect(subType.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.subTypeIcon, { backgroundColor: getTypeDetails()?.color + '15' }]}>
                      <MaterialCommunityIcons name={subType.icon as any} size={22} color={getTypeDetails()?.color} />
                    </View>
                    <Text style={[styles.subTypeLabel, { color: theme.colors.utility.primaryText }]}>{subType.label}</Text>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.utility.secondaryText} />
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* STEP 3: DYNAMIC FORM */}
          {step === 3 && selectedType && (
            <View style={styles.formContainer}>
              {/* Selected Type Badge */}
              <View style={styles.formHeader}>
                <View style={[styles.formIconContainer, { backgroundColor: getTypeDetails()?.color }]}>
                  <MaterialCommunityIcons
                    name={getTypeDetails()?.icon as any}
                    size={32}
                    color="#FFF"
                  />
                </View>
              </View>

              {/* Common Fields */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Name / Title</Text>
                <TextInput
                  style={[styles.input, { color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}
                  placeholder={
                    selectedType === 'mobility' ? "e.g. Tata Safari" :
                    selectedType === 'electronics' ? "e.g. Samsung Washing Machine" :
                    selectedType === 'protection' ? "e.g. HDFC Health Insurance" :
                    selectedType === 'wellness' ? "e.g. Dad's Cardiac Care" :
                    "Enter name..."
                  }
                  placeholderTextColor={theme.colors.utility.secondaryText + '80'}
                  value={assetName}
                  onChangeText={setAssetName}
                />
              </View>

              {/* Photo Upload */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Photo (Optional)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity style={[styles.addPhotoBox, { borderColor: theme.colors.utility.secondaryText + '40', backgroundColor: theme.colors.utility.secondaryBackground }]}>
                    <MaterialCommunityIcons name="camera-plus" size={28} color={theme.colors.utility.secondaryText} />
                    <Text style={[styles.addPhotoText, { color: theme.colors.utility.secondaryText }]}>Add</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              <Divider style={{ marginVertical: 20 }} />

              {/* Category-specific title */}
              <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>
                {selectedType === 'mobility' ? 'Vehicle Details' :
                 selectedType === 'electronics' ? 'Device Details' :
                 selectedType === 'protection' ? 'Policy Details' :
                 selectedType === 'wellness' ? 'Health Details' :
                 selectedType === 'properties' ? 'Property Details' :
                 selectedType === 'identity' ? 'Document Details' :
                 'Details'}
              </Text>

              {/* Dynamic Fields */}
              {renderDynamicFields()}

              {/* Submit */}
              <View style={{ height: 30 }} />
              <Button
                title="Add to Vault"
                onPress={handleSave}
                buttonStyle={[styles.submitButton, { backgroundColor: theme.colors.brand.primary }]}
                titleStyle={{ fontWeight: '600', fontSize: 16 }}
                icon={<MaterialCommunityIcons name="check" size={20} color="#FFF" style={{ marginRight: 8 }} />}
              />
            </View>
          )}

        </Animated.View>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Member Picker Modal */}
      {renderMemberPickerModal()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Progress
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 16,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
  },

  content: { padding: 20 },

  // Scan Hero
  scanHero: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  scanIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanTextContainer: { flex: 1, marginLeft: 16 },
  scanTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  scanSubtitle: { fontSize: 13 },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 12, fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeLabel: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  typeDescription: { fontSize: 11, textAlign: 'center' },

  // Step 2
  selectedHeader: { marginBottom: 20 },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  selectedBadgeText: { fontWeight: '600', fontSize: 13 },
  stepTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  subTypeList: { gap: 10 },
  subTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
  },
  subTypeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subTypeLabel: { flex: 1, marginLeft: 14, fontSize: 16, fontWeight: '600' },

  // Step 3 Form
  formContainer: { marginTop: 10 },
  formHeader: { alignItems: 'center', marginBottom: 24 },
  formIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 13, marginBottom: 8, fontWeight: '600' },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  row: { flexDirection: 'row' },
  dateInput: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addPhotoBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addPhotoText: { fontSize: 11, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 10,
    marginTop: 8,
  },
  submitButton: {
    borderRadius: 25,
    height: 54,
  },

  // Member Selector
  memberSelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sharedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  sharedBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sharedBadgeTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  sharedBadgeSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  memberSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  memberSelectAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberSelectInitial: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  memberSelectName: {
    fontSize: 15,
    fontWeight: '600',
  },
  memberSelectRole: {
    fontSize: 12,
    marginTop: 2,
  },
  memberSelectPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberSelectText: {
    flex: 1,
    fontSize: 15,
  },

  // Modal
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  memberPickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  memberPickerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberPickerInitial: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  memberPickerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  memberPickerRelation: {
    fontSize: 13,
    marginTop: 2,
  },
});
