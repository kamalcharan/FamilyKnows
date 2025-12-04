// src/features/assets/screens/AssetDashboardScreen.tsx
// Unified Entity Dashboard - Adapts to Assets, Insurance, Health, Documents
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Linking,
  Modal,
  Animated,
} from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

// --- CATEGORY CONFIG ---
const CATEGORY_CONFIG: { [key: string]: { color: string; icon: string; headerLabel: string } } = {
  protection: { color: '#8B5CF6', icon: 'shield-check', headerLabel: 'Policy Details' },
  wellness: { color: '#EF4444', icon: 'heart-pulse', headerLabel: 'Health Profile' },
  electronics: { color: '#F59E0B', icon: 'lightning-bolt', headerLabel: 'Device Details' },
  mobility: { color: '#10B981', icon: 'car', headerLabel: 'Vehicle Details' },
  properties: { color: '#4F46E5', icon: 'home-city', headerLabel: 'Property Details' },
  valuables: { color: '#EC4899', icon: 'diamond-stone', headerLabel: 'Valuation' },
  identity: { color: '#6B7280', icon: 'passport', headerLabel: 'Document Details' },
};

// --- UNIFIED MOCK DATA ---
const UNIFIED_DATA: { [key: string]: any } = {
  // INSURANCE
  'ins-1': {
    id: 'ins-1',
    category: 'protection',
    name: 'HDFC Ergo Health Optima',
    meta: 'Family Floater • Cover: ₹50L',
    image: 'https://placehold.co/100x100/8B5CF6/ffffff?text=HDFC',
    headerInfo: { label1: 'Policy No', value1: 'HEG-2024-778899', label2: 'Valid Until', value2: '12 Dec 2025' },
    cycles: [
      { id: 'c1', title: 'Annual Premium', frequency: 'Yearly', lastDone: '12 Dec 2024', nextDue: '12 Dec 2025', status: 'ok', instructions: 'Pay premium before due date to avoid lapse.' },
      { id: 'c2', title: 'Health Checkup Benefit', frequency: 'Yearly', lastDone: 'Not Used', nextDue: 'Before Dec 2025', status: 'warning', instructions: 'Free annual health checkup included. Book at network hospital.' },
    ],
    amc: null, // Insurance doesn't have AMC
    cot: [
      { id: '1', name: 'Agent Suresh', type: 'pro', phone: '9898989898', role: 'Insurance Agent', rating: 4.7 },
      { id: '2', name: 'HDFC Ergo Claims', type: 'pro', phone: '1800-266-0700', role: 'Claims Helpline' },
    ],
    documents: [
      { id: 'd1', name: 'Policy Document.pdf', type: 'pdf', date: '12 Dec 2024' },
      { id: 'd2', name: 'Cashless Network List.pdf', type: 'pdf', date: '12 Dec 2024' },
    ],
    familyAccess: [
      { id: 'f1', name: 'Kamal', avatar: 'https://i.pravatar.cc/150?u=dad', role: 'Policyholder' },
      { id: 'f2', name: 'Priya', avatar: 'https://i.pravatar.cc/150?u=mom', role: 'Covered' },
    ],
  },
  // HEALTH / WELLNESS
  'health-1': {
    id: 'health-1',
    category: 'wellness',
    name: 'Dad\'s Cardiac Care',
    meta: 'Dr. Rao • Apollo Hospital',
    image: 'https://placehold.co/100x100/EF4444/ffffff?text=❤️',
    headerInfo: { label1: 'Patient', value1: 'Kamal (Dad)', label2: 'Condition', value2: 'Hypertension' },
    cycles: [
      { id: 'c1', title: 'Cardiologist Visit', frequency: 'Every 6 Months', lastDone: '15 May 2024', nextDue: '15 Nov 2024', status: 'warning', instructions: 'Book appointment with Dr. Rao at Apollo. Carry previous reports.' },
      { id: 'c2', title: 'Lipid Profile Test', frequency: 'Every 3 Months', lastDone: '01 Sep 2024', nextDue: '01 Dec 2024', status: 'ok', instructions: 'Fasting blood test. Book at any network lab.' },
      { id: 'c3', title: 'Medication Refill', frequency: 'Monthly', lastDone: '01 Nov 2024', nextDue: '01 Dec 2024', status: 'ok', instructions: 'Refill Amlodipine 5mg and Atorvastatin 10mg from Apollo Pharmacy.' },
    ],
    amc: null,
    cot: [
      { id: '1', name: 'Dr. Rao', type: 'pro', phone: '9876543210', role: 'Cardiologist', rating: 4.9 },
      { id: '2', name: 'Apollo Pharmacy', type: 'pro', phone: '1800-123-4567', role: 'Home Delivery' },
    ],
    documents: [
      { id: 'd1', name: 'ECG Report - May 2024.pdf', type: 'pdf', date: '15 May 2024' },
      { id: 'd2', name: 'Prescription - Nov 2024.pdf', type: 'pdf', date: '01 Nov 2024' },
    ],
    familyAccess: [
      { id: 'f1', name: 'Priya', avatar: 'https://i.pravatar.cc/150?u=mom', role: 'Caregiver' },
    ],
  },
  // ELECTRONICS
  'elec-1': {
    id: 'elec-1',
    category: 'electronics',
    name: 'Luminous Inverter (1100VA)',
    meta: 'AMC Active • Utility Area',
    image: 'https://rukminim2.flixcart.com/image/850/1000/xif0q/inverter/y/i/n/-original-imagqhyq9g5g5z8h.jpeg?q=90',
    headerInfo: { label1: 'Purchased', value1: '15 Apr 2022', label2: 'Warranty', value2: '15 Apr 2027' },
    cycles: [
      { id: 'c1', title: 'Distilled Water Refill', frequency: 'Every 6 Months', lastDone: '10 Apr 2024', nextDue: '10 Oct 2024', status: 'overdue', instructions: 'Open battery caps, add distilled water up to max line.' },
      { id: 'c2', title: 'Battery Health Check', frequency: 'Yearly', lastDone: '10 Apr 2024', nextDue: '10 Apr 2025', status: 'ok', instructions: 'Check voltage levels, inspect terminals.' },
      { id: 'c3', title: 'Terminal Cleaning', frequency: 'Every 3 Months', lastDone: '15 Sep 2024', nextDue: '15 Dec 2024', status: 'ok', instructions: 'Clean with baking soda solution.' },
    ],
    amc: {
      hasAmc: true,
      provider: 'Luminous Care',
      policyNo: 'AMC-99887766',
      validUntil: '12 Dec 2025',
      supportPhone: '+91 98765 43210',
      supportEmail: 'support@luminous.com',
      coverageDetails: ['Unlimited service visits', 'Free spare parts', 'Priority support'],
    },
    cot: [
      { id: '1', name: 'Raju Electrician', type: 'pro', phone: '9898989898', role: 'Primary', rating: 4.8 },
    ],
    documents: [
      { id: 'd1', name: 'Purchase Invoice.pdf', type: 'pdf', date: '15 Apr 2022' },
      { id: 'd2', name: 'Warranty Card.pdf', type: 'pdf', date: '15 Apr 2022' },
      { id: 'd3', name: 'AMC Contract.pdf', type: 'pdf', date: '12 Dec 2023' },
    ],
    familyAccess: [
      { id: 'f1', name: 'Kamal', avatar: 'https://i.pravatar.cc/150?u=dad', role: 'Owner' },
    ],
  },
  // VEHICLE
  'veh-1': {
    id: 'veh-1',
    category: 'mobility',
    name: 'Tata Safari',
    meta: 'KA-01-MJ-1234 • 45,000 km',
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/142739/safari-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80',
    headerInfo: { label1: 'Reg. No', value1: 'KA-01-MJ-1234', label2: 'Insurance', value2: '10 Jan 2025' },
    cycles: [
      { id: 'c1', title: 'General Service', frequency: 'Every 10,000 km', lastDone: '15 Aug 2024', nextDue: '15 Nov 2024', status: 'warning', instructions: 'Book service at Tata authorized center.' },
      { id: 'c2', title: 'Insurance Renewal', frequency: 'Yearly', lastDone: '10 Jan 2024', nextDue: '10 Jan 2025', status: 'ok', instructions: 'Compare and renew insurance.' },
      { id: 'c3', title: 'PUC Certificate', frequency: 'Every 6 Months', lastDone: '15 Sep 2024', nextDue: '15 Mar 2025', status: 'ok', instructions: 'Get PUC from authorized center.' },
    ],
    amc: null,
    cot: [
      { id: '1', name: 'Tata Motors Service', type: 'pro', phone: '1800-209-7979', role: 'Authorized Service', rating: 4.5 },
    ],
    documents: [
      { id: 'd1', name: 'RC Book.pdf', type: 'pdf', date: '10 Jan 2023' },
      { id: 'd2', name: 'Insurance Policy.pdf', type: 'pdf', date: '10 Jan 2024' },
    ],
    familyAccess: [
      { id: 'f1', name: 'Kamal', avatar: 'https://i.pravatar.cc/150?u=dad', role: 'Owner' },
    ],
  },
  // PROPERTY
  'prop-1': {
    id: 'prop-1',
    category: 'properties',
    name: '3BHK Whitefield',
    meta: 'Owned • Dream Home',
    image: 'https://placehold.co/100x100/4F46E5/ffffff?text=🏠',
    headerInfo: { label1: 'Type', value1: 'Apartment', label2: 'Since', value2: '2019' },
    cycles: [
      { id: 'c1', title: 'Property Tax', frequency: 'Yearly', lastDone: 'Mar 2024', nextDue: 'Mar 2025', status: 'ok', instructions: 'Pay BBMP property tax online.' },
      { id: 'c2', title: 'Society Maintenance', frequency: 'Quarterly', lastDone: 'Oct 2024', nextDue: 'Jan 2025', status: 'ok', instructions: 'Pay to association account.' },
    ],
    amc: null,
    cot: [
      { id: '1', name: 'Building Manager', type: 'pro', phone: '9876543210', role: 'Facility', rating: 4.2 },
    ],
    documents: [
      { id: 'd1', name: 'Sale Deed.pdf', type: 'pdf', date: '15 Jun 2019' },
      { id: 'd2', name: 'Property Tax Receipt.pdf', type: 'pdf', date: 'Mar 2024' },
    ],
    familyAccess: [
      { id: 'f1', name: 'Kamal', avatar: 'https://i.pravatar.cc/150?u=dad', role: 'Owner' },
      { id: 'f2', name: 'Priya', avatar: 'https://i.pravatar.cc/150?u=mom', role: 'Co-owner' },
    ],
  },
  // VALUABLES
  'val-1': {
    id: 'val-1',
    category: 'valuables',
    name: 'Gold Jewelry (150g)',
    meta: 'Bank Locker • HDFC',
    image: 'https://placehold.co/100x100/EC4899/ffffff?text=💎',
    headerInfo: { label1: 'Weight', value1: '150 grams', label2: 'Location', value2: 'HDFC Locker' },
    cycles: [
      { id: 'c1', title: 'Valuation Update', frequency: 'Yearly', lastDone: 'Jan 2024', nextDue: 'Jan 2025', status: 'ok', instructions: 'Get valuation certificate from certified jeweler.' },
      { id: 'c2', title: 'Locker Rent', frequency: 'Yearly', lastDone: 'Jun 2024', nextDue: 'Jun 2025', status: 'ok', instructions: 'Pay locker rent at HDFC branch.' },
    ],
    amc: null,
    cot: [
      { id: '1', name: 'Tanishq (Valuation)', type: 'pro', phone: '1800-266-0999', role: 'Jeweler' },
    ],
    documents: [
      { id: 'd1', name: 'Valuation Certificate.pdf', type: 'pdf', date: 'Jan 2024' },
      { id: 'd2', name: 'Locker Agreement.pdf', type: 'pdf', date: 'Jun 2020' },
    ],
    familyAccess: [
      { id: 'f1', name: 'Priya', avatar: 'https://i.pravatar.cc/150?u=mom', role: 'Primary' },
    ],
  },
  // IDENTITY
  'doc-1': {
    id: 'doc-1',
    category: 'identity',
    name: 'Dad\'s Passport',
    meta: 'Valid • J1234567',
    image: 'https://placehold.co/100x100/6B7280/ffffff?text=🛂',
    headerInfo: { label1: 'Number', value1: 'J1234567', label2: 'Expiry', value2: 'Aug 2028' },
    cycles: [
      { id: 'c1', title: 'Renewal', frequency: '10 Years', lastDone: 'Aug 2018', nextDue: 'Aug 2028', status: 'ok', instructions: 'Apply for renewal 6 months before expiry.' },
    ],
    amc: null,
    cot: [],
    documents: [
      { id: 'd1', name: 'Passport Copy.pdf', type: 'pdf', date: 'Aug 2018' },
    ],
    familyAccess: [
      { id: 'f1', name: 'Kamal', avatar: 'https://i.pravatar.cc/150?u=dad', role: 'Owner' },
    ],
  },
};

// Fallback for old IDs
const LEGACY_MAP: { [key: string]: string } = {
  '1': 'elec-1',
  '2': 'elec-1',
  '3': 'veh-1',
};

export const AssetDashboardScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: { assetId?: string; category?: string } }, 'params'>>();
  const insets = useSafeAreaInsets();

  // Resolve asset ID (handle legacy IDs)
  const rawAssetId = route.params?.assetId || 'elec-1';
  const assetId = LEGACY_MAP[rawAssetId] || rawAssetId;
  const entity = UNIFIED_DATA[assetId] || UNIFIED_DATA['elec-1'];
  const categoryConfig = CATEGORY_CONFIG[entity.category] || CATEGORY_CONFIG.electronics;

  const [showCycleModal, setShowCycleModal] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<any>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleViewProfile = (contactId: string) => {
    // Navigate to full CoT profile
    navigation.navigate('CollaboratorsOrbit', { highlightId: contactId });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return theme.colors.semantic.success;
      case 'warning': return theme.colors.semantic.warning;
      case 'overdue': return theme.colors.semantic.error;
      default: return theme.colors.utility.secondaryText;
    }
  };

  // Dynamic section title based on category
  const getCycleSectionTitle = () => {
    switch (entity.category) {
      case 'protection': return 'Policy Milestones';
      case 'wellness': return 'Care Schedule';
      case 'mobility': return 'Service Schedule';
      case 'identity': return 'Renewals';
      default: return 'Maintenance Cycles';
    }
  };

  const getSupportSectionTitle = () => {
    switch (entity.category) {
      case 'protection': return 'Support Contacts';
      case 'wellness': return 'Care Team';
      default: return 'Service Support';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}>
      <StatusBar barStyle="light-content" />

      {/* HEADER - Dynamic color based on category */}
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: categoryConfig.color }]}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerBadge}>
            <MaterialCommunityIcons name={categoryConfig.icon as any} size={16} color="#FFF" />
            <Text style={styles.headerBadgeText}>{categoryConfig.headerLabel}</Text>
          </View>
          <TouchableOpacity style={styles.navButton}>
            <MaterialCommunityIcons name="pencil" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.entityProfile}>
          <Image source={{ uri: entity.image }} style={styles.entityImage} />
          <View style={styles.entityMeta}>
            <Text style={styles.entityName}>{entity.name}</Text>
            <Text style={styles.entitySubtitle}>{entity.meta}</Text>
            <View style={styles.headerInfoRow}>
              <View style={styles.headerInfoItem}>
                <Text style={styles.headerInfoLabel}>{entity.headerInfo.label1}</Text>
                <Text style={styles.headerInfoValue}>{entity.headerInfo.value1}</Text>
              </View>
              <View style={styles.headerInfoItem}>
                <Text style={styles.headerInfoLabel}>{entity.headerInfo.label2}</Text>
                <Text style={styles.headerInfoValue}>{entity.headerInfo.value2}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        {/* CYCLES / MILESTONES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>
              {getCycleSectionTitle()}
            </Text>
            <TouchableOpacity>
              <MaterialCommunityIcons name="plus-circle" size={24} color={categoryConfig.color} />
            </TouchableOpacity>
          </View>

          {entity.cycles.map((cycle: any) => (
            <TouchableOpacity
              key={cycle.id}
              style={[styles.cycleCard, { backgroundColor: theme.colors.utility.secondaryBackground }]}
              onPress={() => {
                setSelectedCycle(cycle);
                setShowCycleModal(true);
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.cycleIcon, { backgroundColor: getStatusColor(cycle.status) + '20' }]}>
                <MaterialCommunityIcons
                  name={cycle.status === 'overdue' ? 'alert-circle' : cycle.status === 'warning' ? 'clock-alert' : 'check-circle'}
                  size={24}
                  color={getStatusColor(cycle.status)}
                />
              </View>
              <View style={styles.cycleInfo}>
                <Text style={[styles.cycleTitle, { color: theme.colors.utility.primaryText }]}>{cycle.title}</Text>
                <Text style={[styles.cycleFreq, { color: theme.colors.utility.secondaryText }]}>{cycle.frequency}</Text>
              </View>
              <View style={styles.cycleRight}>
                <Text style={[styles.cycleDueLabel, { color: theme.colors.utility.secondaryText }]}>
                  {cycle.status === 'overdue' ? 'Overdue' : cycle.status === 'warning' ? 'Due Soon' : 'Next Due'}
                </Text>
                <Text style={[styles.cycleDate, { color: getStatusColor(cycle.status) }]}>{cycle.nextDue}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* AMC / CONTRACT (Only for electronics/appliances) */}
        {entity.amc && entity.amc.hasAmc && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>
              Annual Maintenance (AMC)
            </Text>

            <View style={[styles.amcCard, { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }]}>
              <View style={styles.extractedTag}>
                <MaterialCommunityIcons name="text-recognition" size={12} color="#0369A1" />
                <Text style={styles.extractedText}>Smart Extracted</Text>
              </View>

              <View style={styles.amcRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.amcLabel}>Provider</Text>
                  <Text style={styles.amcValue}>{entity.amc.provider}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.amcLabel}>Valid Until</Text>
                  <Text style={[styles.amcValue, { color: '#0369A1' }]}>{entity.amc.validUntil}</Text>
                </View>
              </View>

              <View style={styles.amcActions}>
                <TouchableOpacity
                  style={[styles.callButton, { backgroundColor: categoryConfig.color }]}
                  onPress={() => handleCall(entity.amc.supportPhone)}
                >
                  <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
                  <Text style={styles.callButtonText}>Call Support</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.viewDocButton, { borderColor: categoryConfig.color }]}>
                  <MaterialCommunityIcons name="file-document-outline" size={18} color={categoryConfig.color} />
                  <Text style={[styles.viewDocText, { color: categoryConfig.color }]}>View Contract</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* SUPPORT / CARE TEAM */}
        {entity.cot.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>
              {getSupportSectionTitle()}
            </Text>

            {entity.cot.filter((c: any) => c.type === 'pro').map((contact: any) => (
              <TouchableOpacity
                key={contact.id}
                style={[styles.contactCard, { backgroundColor: theme.colors.utility.secondaryBackground }]}
                onPress={() => handleViewProfile(contact.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.contactAvatar, { backgroundColor: categoryConfig.color + '20' }]}>
                  <MaterialCommunityIcons
                    name={entity.category === 'wellness' ? 'stethoscope' : entity.category === 'protection' ? 'account-tie' : 'account-wrench'}
                    size={24}
                    color={categoryConfig.color}
                  />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactName, { color: theme.colors.utility.primaryText }]}>{contact.name}</Text>
                  <View style={styles.contactMeta}>
                    <Text style={[styles.contactRole, { color: theme.colors.utility.secondaryText }]}>{contact.role}</Text>
                    {contact.rating && (
                      <View style={styles.ratingBadge}>
                        <MaterialCommunityIcons name="star" size={12} color="#F59E0B" />
                        <Text style={styles.ratingText}>{contact.rating}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.contactCallBtn, { backgroundColor: '#10B98115' }]}
                  onPress={() => handleCall(contact.phone)}
                >
                  <MaterialCommunityIcons name="phone" size={22} color="#10B981" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            {/* Marketplace Fallback */}
            <View style={styles.fallbackContainer}>
              <View style={[styles.fallbackLine, { backgroundColor: theme.colors.utility.secondaryText + '30' }]} />
              <Text style={[styles.fallbackText, { color: theme.colors.utility.secondaryText }]}>Need alternatives?</Text>
              <View style={[styles.fallbackLine, { backgroundColor: theme.colors.utility.secondaryText + '30' }]} />
            </View>

            <TouchableOpacity style={[styles.marketButton, { borderColor: categoryConfig.color }]}>
              <MaterialCommunityIcons name="store-search" size={22} color={categoryConfig.color} />
              <Text style={[styles.marketButtonText, { color: categoryConfig.color }]}>
                {entity.category === 'wellness' ? 'Find Specialists' : 'Find in Marketplace'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* DOCUMENTS */}
        {entity.documents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>
                Linked Documents
              </Text>
              <TouchableOpacity>
                <MaterialCommunityIcons name="plus-circle" size={24} color={categoryConfig.color} />
              </TouchableOpacity>
            </View>

            {entity.documents.map((doc: any) => (
              <TouchableOpacity
                key={doc.id}
                style={[styles.docCard, { backgroundColor: theme.colors.utility.secondaryBackground }]}
              >
                <MaterialCommunityIcons name="file-pdf-box" size={32} color="#EF4444" />
                <View style={styles.docInfo}>
                  <Text style={[styles.docName, { color: theme.colors.utility.primaryText }]}>{doc.name}</Text>
                  <Text style={[styles.docDate, { color: theme.colors.utility.secondaryText }]}>{doc.date}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={22} color={theme.colors.utility.secondaryText} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* FAMILY ACCESS */}
        {entity.familyAccess.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>Family Access</Text>
            <View style={styles.familyRow}>
              {entity.familyAccess.map((member: any) => (
                <View key={member.id} style={styles.familyMember}>
                  <Image source={{ uri: member.avatar }} style={styles.familyAvatar} />
                  <Text style={[styles.familyName, { color: theme.colors.utility.primaryText }]}>{member.name}</Text>
                  <Text style={[styles.familyRole, { color: theme.colors.utility.secondaryText }]}>{member.role}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.familyMember}>
                <View style={[styles.familyAvatar, { backgroundColor: theme.colors.utility.secondaryBackground, borderWidth: 2, borderColor: categoryConfig.color, borderStyle: 'dashed' }]}>
                  <MaterialCommunityIcons name="plus" size={20} color={categoryConfig.color} />
                </View>
                <Text style={[styles.familyName, { color: categoryConfig.color }]}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* CYCLE DETAIL MODAL */}
      <Modal
        visible={showCycleModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCycleModal(false)}
      >
        {selectedCycle && (
          <View style={[styles.modalContainer, { backgroundColor: theme.colors.utility.primaryBackground }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.utility.secondaryText + '20' }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.utility.primaryText }]}>{selectedCycle.title}</Text>
              <TouchableOpacity onPress={() => setShowCycleModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color={theme.colors.utility.secondaryText} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <View style={[styles.cycleStatusBanner, { backgroundColor: getStatusColor(selectedCycle.status) + '15' }]}>
                <MaterialCommunityIcons
                  name={selectedCycle.status === 'overdue' ? 'alert-circle' : 'clock'}
                  size={24}
                  color={getStatusColor(selectedCycle.status)}
                />
                <View>
                  <Text style={[styles.cycleStatusLabel, { color: getStatusColor(selectedCycle.status) }]}>
                    {selectedCycle.status === 'overdue' ? 'Overdue!' : 'Due Date'}
                  </Text>
                  <Text style={[styles.cycleStatusDate, { color: theme.colors.utility.primaryText }]}>
                    {selectedCycle.nextDue}
                  </Text>
                </View>
              </View>

              <View style={styles.cycleDetailRow}>
                <Text style={[styles.cycleDetailLabel, { color: theme.colors.utility.secondaryText }]}>Frequency</Text>
                <Text style={[styles.cycleDetailValue, { color: theme.colors.utility.primaryText }]}>{selectedCycle.frequency}</Text>
              </View>

              <View style={styles.cycleDetailRow}>
                <Text style={[styles.cycleDetailLabel, { color: theme.colors.utility.secondaryText }]}>Last Completed</Text>
                <Text style={[styles.cycleDetailValue, { color: theme.colors.utility.primaryText }]}>{selectedCycle.lastDone}</Text>
              </View>

              <View style={[styles.instructionsCard, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
                <Text style={[styles.instructionsTitle, { color: theme.colors.utility.primaryText }]}>Instructions</Text>
                <Text style={[styles.instructionsText, { color: theme.colors.utility.secondaryText }]}>
                  {selectedCycle.instructions}
                </Text>
              </View>

              <Button
                title="Mark as Complete"
                onPress={() => setShowCycleModal(false)}
                buttonStyle={[styles.completeButton, { backgroundColor: categoryConfig.color }]}
                icon={<MaterialCommunityIcons name="check" size={20} color="#FFF" style={{ marginRight: 8 }} />}
              />
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    paddingBottom: 24,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  headerBadgeText: { fontSize: 13, fontWeight: '600', color: '#FFF' },
  entityProfile: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  entityImage: { width: 70, height: 70, borderRadius: 14, backgroundColor: '#FFF' },
  entityMeta: { flex: 1, marginLeft: 16 },
  entityName: { fontSize: 18, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  entitySubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 10 },
  headerInfoRow: { flexDirection: 'row', gap: 20 },
  headerInfoItem: {},
  headerInfoLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, textTransform: 'uppercase' },
  headerInfoValue: { color: '#FFF', fontSize: 12, fontWeight: '600' },

  content: { padding: 20, paddingBottom: 50 },
  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },

  // Cycles
  cycleCard: { flexDirection: 'row', padding: 14, borderRadius: 14, marginBottom: 10, alignItems: 'center' },
  cycleIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cycleInfo: { flex: 1 },
  cycleTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  cycleFreq: { fontSize: 12 },
  cycleRight: { alignItems: 'flex-end' },
  cycleDueLabel: { fontSize: 10, textTransform: 'uppercase', marginBottom: 2 },
  cycleDate: { fontSize: 13, fontWeight: '700' },

  // AMC Card
  amcCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 12 },
  extractedTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E0F2FE', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, marginBottom: 14, gap: 6 },
  extractedText: { fontSize: 11, color: '#0369A1', fontWeight: '700' },
  amcRow: { flexDirection: 'row', marginBottom: 16 },
  amcLabel: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  amcValue: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  amcActions: { flexDirection: 'row', gap: 12 },
  callButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, gap: 8 },
  callButtonText: { color: '#FFF', fontWeight: '600' },
  viewDocButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, gap: 8, borderWidth: 1 },
  viewDocText: { fontWeight: '600' },

  // Contacts
  contactCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, marginBottom: 10 },
  contactAvatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  contactInfo: { flex: 1, marginLeft: 14 },
  contactName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  contactMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  contactRole: { fontSize: 13 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: 12, fontWeight: '600', color: '#F59E0B' },
  contactCallBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },

  fallbackContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 14 },
  fallbackLine: { flex: 1, height: 1 },
  fallbackText: { marginHorizontal: 12, fontSize: 12 },
  marketButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', gap: 8 },
  marketButtonText: { fontWeight: '600', fontSize: 14 },

  // Documents
  docCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 10 },
  docInfo: { flex: 1, marginLeft: 12 },
  docName: { fontSize: 14, fontWeight: '600' },
  docDate: { fontSize: 12, marginTop: 2 },

  // Family
  familyRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  familyMember: { alignItems: 'center', width: 70 },
  familyAvatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  familyName: { fontSize: 13, fontWeight: '600' },
  familyRole: { fontSize: 11, marginTop: 2 },

  // Modal
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  cycleStatusBanner: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, gap: 12, marginBottom: 20 },
  cycleStatusLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  cycleStatusDate: { fontSize: 18, fontWeight: '700' },
  cycleDetailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  cycleDetailLabel: { fontSize: 14 },
  cycleDetailValue: { fontSize: 14, fontWeight: '600' },
  instructionsCard: { padding: 16, borderRadius: 12, marginTop: 20, marginBottom: 24 },
  instructionsTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  instructionsText: { fontSize: 14, lineHeight: 22 },
  completeButton: { borderRadius: 14, paddingVertical: 16 },
});
