// src/features/assets/screens/UniversalAddAssetScreen.tsx
// Entity Wizard: Scan → Classify → Link → Save
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
} from 'react-native';
import { Text, Button, Divider } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { useFamily } from '../../../context/FamilyContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// --- THE 7 PILLARS (Entity Taxonomy) ---
// Ordered by frequency of use: Protection & Wellness first
const ENTITY_TYPES = [
  { id: 'protection', label: 'Insurance', icon: 'shield-check', color: '#8B5CF6', desc: 'Life, Health, Vehicle, Term' },
  { id: 'wellness', label: 'Wellness', icon: 'heart-pulse', color: '#EF4444', desc: 'Health Records, Conditions, Checkups' },
  { id: 'mobility', label: 'Vehicle', icon: 'car', color: '#10B981', desc: 'Car, Bike, Scooter' },
  { id: 'properties', label: 'Property', icon: 'home-city', color: '#4F46E5', desc: 'House, Flat, Land' },
  { id: 'electronics', label: 'Device', icon: 'laptop', color: '#F59E0B', desc: 'Gadgets, Appliances' },
  { id: 'valuables', label: 'Valuable', icon: 'diamond-stone', color: '#EC4899', desc: 'Gold, Jewelry, Art' },
  { id: 'identity', label: 'Identity', icon: 'card-account-details', color: '#6B7280', desc: 'Passports, IDs, Deeds' },
];

export const UniversalAddAssetScreen: React.FC = () => {
  const { theme } = useTheme();
  const { members, getMemberById } = useFamily();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  // State
  const [step, setStep] = useState(1); // 1: Category, 2: Details
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [entityName, setEntityName] = useState('');

  // Linked Member State
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isSharedAsset, setIsSharedAsset] = useState(false);

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

  const handleSave = () => {
    // In real app, save to database with:
    // { entityName, selectedType, selectedMemberId, isSharedAsset, formData }
    navigation.navigate('AssetsHub');
  };

  const getTypeDetails = () => ENTITY_TYPES.find(t => t.id === selectedType);

  // --- MEMBER SELECTOR (Inline Radio Style) ---
  const renderMemberSelector = () => (
    <View style={styles.inputGroup}>
      <View style={styles.memberSelectorHeader}>
        <Text style={[styles.label, { color: theme.colors.utility.secondaryText, marginBottom: 0 }]}>
          {getRoleLabel}
        </Text>
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
            <Text style={[styles.sharedBadgeSubtitle, { color: theme.colors.utility.secondaryText }]}>Visible to everyone</Text>
          </View>
        </View>
      ) : (
        <View style={styles.memberRadioContainer}>
          {members.map((member) => {
            const isSelected = selectedMemberId === member.id;
            return (
              <TouchableOpacity
                key={member.id}
                style={[
                  styles.memberRadioItem,
                  {
                    borderColor: isSelected ? member.color : theme.colors.utility.secondaryText + '20',
                    backgroundColor: isSelected ? member.color + '12' : theme.colors.utility.secondaryBackground,
                  }
                ]}
                onPress={() => setSelectedMemberId(member.id)}
                activeOpacity={0.7}
              >
                {/* Radio Circle */}
                <View style={[
                  styles.radioCircle,
                  { borderColor: isSelected ? member.color : theme.colors.utility.secondaryText + '40' }
                ]}>
                  {isSelected && (
                    <View style={[styles.radioCircleFilled, { backgroundColor: member.color }]} />
                  )}
                </View>

                {/* Avatar */}
                {member.avatar ? (
                  <Image source={{ uri: member.avatar }} style={styles.memberRadioAvatar} />
                ) : (
                  <View style={[styles.memberRadioAvatar, { backgroundColor: member.color }]}>
                    <Text style={styles.memberRadioInitial}>{member.name.charAt(0)}</Text>
                  </View>
                )}

                {/* Info */}
                <View style={styles.memberRadioInfo}>
                  <Text style={[
                    styles.memberRadioName,
                    { color: isSelected ? member.color : theme.colors.utility.primaryText }
                  ]}>
                    {member.displayRelationship}
                  </Text>
                  <Text style={[styles.memberRadioRelation, { color: theme.colors.utility.secondaryText }]}>
                    {member.name}
                  </Text>
                </View>

                {/* Check Icon when selected */}
                {isSelected && (
                  <MaterialCommunityIcons name="check-circle" size={20} color={member.color} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );

  // --- DYNAMIC FIELDS based on Entity Type ---
  const renderDynamicFields = () => {
    switch (selectedType) {
      case 'protection': // INSURANCE
        return (
          <>
            {renderMemberSelector()}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Policy Number</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}
                placeholder="e.g. POL-99887766"
                placeholderTextColor={theme.colors.utility.secondaryText + '50'}
                value={formData.policyNumber}
                onChangeText={(text) => setFormData({ ...formData, policyNumber: text })}
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Premium</Text>
                <TextInput
                  style={[styles.input, { color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}
                  placeholder="₹ 15,000"
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.utility.secondaryText + '50'}
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Renewal Date</Text>
                <TouchableOpacity style={[styles.dateInput, { borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}>
                  <MaterialCommunityIcons name="calendar-refresh" size={20} color={theme.colors.brand.primary} />
                  <Text style={{ color: theme.colors.utility.secondaryText }}>Select</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={[styles.scanButton, { backgroundColor: '#8B5CF615' }]}>
              <MaterialCommunityIcons name="camera" size={24} color="#8B5CF6" />
              <Text style={{ color: '#8B5CF6', fontWeight: '600' }}>Scan Policy Document</Text>
            </TouchableOpacity>
          </>
        );

      case 'wellness': // HEALTH
        return (
          <>
            {renderMemberSelector()}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Condition / Category</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}
                placeholder="e.g. Cardiac Care, Diabetes Management"
                placeholderTextColor={theme.colors.utility.secondaryText + '50'}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Primary Doctor</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}
                placeholder="e.g. Dr. Rao, Apollo Hospital"
                placeholderTextColor={theme.colors.utility.secondaryText + '50'}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Next Appointment</Text>
              <TouchableOpacity style={[styles.dateInput, { borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}>
                <MaterialCommunityIcons name="calendar-heart" size={20} color="#EF4444" />
                <Text style={{ color: theme.colors.utility.secondaryText }}>Select Date</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.scanButton, { backgroundColor: '#EF444415' }]}>
              <MaterialCommunityIcons name="file-document-outline" size={24} color="#EF4444" />
              <Text style={{ color: '#EF4444', fontWeight: '600' }}>Attach Latest Report</Text>
            </TouchableOpacity>
          </>
        );

      case 'mobility': // VEHICLE
        return (
          <>
            {renderMemberSelector()}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Registration Number</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}
                placeholder="KA-01-XX-1234"
                placeholderTextColor={theme.colors.utility.secondaryText + '50'}
                value={formData.regNumber}
                onChangeText={(text) => setFormData({ ...formData, regNumber: text })}
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Insurance Expiry</Text>
                <TouchableOpacity style={[styles.dateInput, { borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}>
                  <MaterialCommunityIcons name="shield-clock" size={20} color={theme.colors.brand.primary} />
                  <Text style={{ color: theme.colors.utility.secondaryText }}>Select</Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: 12 }} />
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Last Service</Text>
                <TouchableOpacity style={[styles.dateInput, { borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}>
                  <MaterialCommunityIcons name="car-wrench" size={20} color={theme.colors.brand.primary} />
                  <Text style={{ color: theme.colors.utility.secondaryText }}>Select</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        );

      case 'properties': // PROPERTY
        return (
          <>
            {renderMemberSelector()}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Address</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground, height: 80, textAlignVertical: 'top' }]}
                placeholder="Full address..."
                placeholderTextColor={theme.colors.utility.secondaryText + '50'}
                multiline
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Property Tax Due</Text>
              <TouchableOpacity style={[styles.dateInput, { borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}>
                <MaterialCommunityIcons name="calendar" size={20} color={theme.colors.brand.primary} />
                <Text style={{ color: theme.colors.utility.secondaryText }}>Select Date</Text>
              </TouchableOpacity>
            </View>
          </>
        );

      case 'electronics': // DEVICES
        return (
          <>
            {renderMemberSelector()}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Location in Home</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}
                placeholder="e.g. Living Room, Utility Area"
                placeholderTextColor={theme.colors.utility.secondaryText + '50'}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Warranty Valid Until</Text>
              <TouchableOpacity style={[styles.dateInput, { borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}>
                <MaterialCommunityIcons name="shield-check" size={20} color={theme.colors.brand.primary} />
                <Text style={{ color: theme.colors.utility.secondaryText }}>Select Date</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.scanButton, { backgroundColor: '#F59E0B15' }]}>
              <MaterialCommunityIcons name="barcode-scan" size={24} color="#F59E0B" />
              <Text style={{ color: '#F59E0B', fontWeight: '600' }}>Scan Invoice for Details</Text>
            </TouchableOpacity>
          </>
        );

      case 'identity': // DOCUMENTS
        return (
          <>
            {renderMemberSelector()}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Document Number</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}
                placeholder="e.g. J1234567"
                placeholderTextColor={theme.colors.utility.secondaryText + '50'}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Expiry / Renewal Date</Text>
              <TouchableOpacity style={[styles.dateInput, { borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}>
                <MaterialCommunityIcons name="calendar-clock" size={20} color={theme.colors.brand.primary} />
                <Text style={{ color: theme.colors.utility.secondaryText }}>Select Date</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.scanButton, { backgroundColor: '#6B728015' }]}>
              <MaterialCommunityIcons name="camera" size={24} color="#6B7280" />
              <Text style={{ color: '#6B7280', fontWeight: '600' }}>Scan Document</Text>
            </TouchableOpacity>
          </>
        );

      case 'valuables': // VALUABLES
        return (
          <>
            {renderMemberSelector()}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Description / Weight</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}
                placeholder="e.g. 22K Gold Necklace, 50g"
                placeholderTextColor={theme.colors.utility.secondaryText + '50'}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Storage Location</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}
                placeholder="e.g. HDFC Bank Locker"
                placeholderTextColor={theme.colors.utility.secondaryText + '50'}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Next Valuation</Text>
              <TouchableOpacity style={[styles.dateInput, { borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}>
                <MaterialCommunityIcons name="calendar" size={20} color="#EC4899" />
                <Text style={{ color: theme.colors.utility.secondaryText }}>Select Date</Text>
              </TouchableOpacity>
            </View>
          </>
        );

      default:
        return (
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Notes</Text>
            <TextInput
              style={[styles.input, { height: 100, color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground, textAlignVertical: 'top' }]}
              placeholder="Add any relevant details..."
              placeholderTextColor={theme.colors.utility.secondaryText + '50'}
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
          {step === 1 ? 'Add to Vault' : 'Entity Details'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* STEP 1: CHOOSE ENTITY TYPE */}
          {step === 1 && (
            <>
              {/* Smart Camera Hero */}
              <View style={styles.heroCapture}>
                <TouchableOpacity style={[styles.cameraButton, { backgroundColor: theme.colors.utility.secondaryBackground, borderColor: theme.colors.brand.primary + '40' }]}>
                  <View style={[styles.cameraIconContainer, { backgroundColor: theme.colors.brand.primary }]}>
                    <MaterialCommunityIcons name="camera-iris" size={40} color="#FFF" />
                  </View>
                  <Text style={[styles.cameraText, { color: theme.colors.utility.primaryText }]}>Auto-Scan Entity</Text>
                  <Text style={[styles.cameraSub, { color: theme.colors.utility.secondaryText }]}>
                    Point at a Policy, RC Book, Bill, or Report
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.sectionTitle, { color: theme.colors.utility.secondaryText }]}>SELECT MANUALLY</Text>

              {/* Entity Type List */}
              <View style={[styles.listContainer, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
                {ENTITY_TYPES.map((type, index) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeRow,
                      index < ENTITY_TYPES.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.colors.utility.secondaryText + '15' }
                    ]}
                    onPress={() => handleCategorySelect(type.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconBox, { backgroundColor: type.color + '15' }]}>
                      <MaterialCommunityIcons name={type.icon as any} size={24} color={type.color} />
                    </View>
                    <View style={styles.typeInfo}>
                      <Text style={[styles.typeLabel, { color: theme.colors.utility.primaryText }]}>{type.label}</Text>
                      <Text style={[styles.typeDesc, { color: theme.colors.utility.secondaryText }]}>{type.desc}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.utility.secondaryText + '50'} />
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* STEP 2: DYNAMIC DETAILS FORM */}
          {step === 2 && selectedType && (
            <View style={styles.formContainer}>
              {/* Selected Type Header */}
              <View style={styles.formHeader}>
                <View style={[styles.selectedIcon, { backgroundColor: getTypeDetails()?.color }]}>
                  <MaterialCommunityIcons
                    name={getTypeDetails()?.icon as any}
                    size={36}
                    color="#FFF"
                  />
                </View>
                <Text style={[styles.selectedLabel, { color: theme.colors.utility.primaryText }]}>
                  New {getTypeDetails()?.label}
                </Text>
              </View>

              {/* Universal Name Field */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.utility.secondaryText }]}>Title / Name</Text>
                <TextInput
                  style={[styles.input, { color: theme.colors.utility.primaryText, borderColor: theme.colors.utility.secondaryText + '30', backgroundColor: theme.colors.utility.secondaryBackground }]}
                  placeholder={
                    selectedType === 'protection' ? "e.g. HDFC Life Max" :
                    selectedType === 'wellness' ? "e.g. Cardiac Care" :
                    selectedType === 'mobility' ? "e.g. Tata Safari" :
                    selectedType === 'properties' ? "e.g. 3BHK Whitefield" :
                    selectedType === 'electronics' ? "e.g. Samsung Washing Machine" :
                    selectedType === 'valuables' ? "e.g. Gold Jewelry" :
                    selectedType === 'identity' ? "e.g. Passport" :
                    "Enter name..."
                  }
                  placeholderTextColor={theme.colors.utility.secondaryText + '50'}
                  value={entityName}
                  onChangeText={setEntityName}
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

              {/* Dynamic Fields based on Category */}
              {renderDynamicFields()}

              {/* Submit */}
              <View style={{ height: 30 }} />
              <Button
                title="Create Entity"
                onPress={handleSave}
                buttonStyle={[styles.submitButton, { backgroundColor: getTypeDetails()?.color || theme.colors.brand.primary }]}
                titleStyle={{ fontWeight: '700', fontSize: 16 }}
                icon={<MaterialCommunityIcons name="check" size={20} color="#FFF" style={{ marginRight: 8 }} />}
              />
            </View>
          )}

        </Animated.View>
        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  backButton: { padding: 8 },

  content: { padding: 20 },

  // Hero Camera Section
  heroCapture: { marginBottom: 30 },
  cameraButton: {
    width: '100%',
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  cameraIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3B82F6',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  cameraText: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  cameraSub: { fontSize: 13, textAlign: 'center' },

  sectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 12 },

  // Entity Type List
  listContainer: { borderRadius: 20, overflow: 'hidden' },
  typeRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  typeInfo: { flex: 1 },
  typeLabel: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  typeDesc: { fontSize: 12 },

  // Form Styles
  formContainer: { marginTop: 10 },
  formHeader: { alignItems: 'center', marginBottom: 30 },
  selectedIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  selectedLabel: { fontSize: 22, fontWeight: '700' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 12, marginBottom: 8, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  row: { flexDirection: 'row' },
  dateInput: {
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addPhotoBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addPhotoText: { fontSize: 11, marginTop: 4 },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 10,
    marginTop: 8,
  },
  submitButton: {
    borderRadius: 16,
    height: 56,
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
    borderRadius: 16,
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

  // Radio Style Member Selector
  memberRadioContainer: {
    gap: 10,
  },
  memberRadioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioCircleFilled: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  memberRadioAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberRadioInitial: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  memberRadioInfo: {
    flex: 1,
  },
  memberRadioName: {
    fontSize: 15,
    fontWeight: '600',
  },
  memberRadioRelation: {
    fontSize: 12,
    marginTop: 2,
  },
});
