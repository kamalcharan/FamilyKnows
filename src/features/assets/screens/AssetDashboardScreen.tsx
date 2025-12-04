// src/features/assets/screens/AssetDashboardScreen.tsx
// Asset Lifecycle Dashboard - Cycles, AMC, Service Support
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
  Easing,
} from 'react-native';
import { Text, Button, Divider } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

// --- MOCK DATA ---
const ASSETS_DATA: { [key: string]: any } = {
  '1': {
    id: '1',
    name: 'Luminous Inverter (1100 VA)',
    category: 'Electronics',
    location: 'Utility Area, 1st Floor',
    purchaseDate: '15 Apr 2022',
    warrantyUntil: '15 Apr 2027',
    image: 'https://rukminim2.flixcart.com/image/850/1000/xif0q/inverter/y/i/n/-original-imagqhyq9g5g5z8h.jpeg?q=90',
    cycles: [
      {
        id: 'c1',
        title: 'Distilled Water Refill',
        frequency: 'Every 6 Months',
        lastDone: '10 Apr 2024',
        nextDue: '10 Oct 2024',
        status: 'overdue',
        instructions: 'Open battery caps, add distilled water up to max line, avoid overfilling.',
      },
      {
        id: 'c2',
        title: 'Battery Health Check',
        frequency: 'Yearly',
        lastDone: '10 Apr 2024',
        nextDue: '10 Apr 2025',
        status: 'ok',
        instructions: 'Check voltage levels, inspect terminals for corrosion.',
      },
      {
        id: 'c3',
        title: 'Terminal Cleaning',
        frequency: 'Every 3 Months',
        lastDone: '15 Sep 2024',
        nextDue: '15 Dec 2024',
        status: 'ok',
        instructions: 'Clean battery terminals with baking soda solution.',
      },
    ],
    amc: {
      hasAmc: true,
      provider: 'Luminous Care',
      policyNo: 'AMC-99887766',
      validFrom: '12 Dec 2023',
      validUntil: '12 Dec 2025',
      supportPhone: '+91 98765 43210',
      supportEmail: 'support@luminous.com',
      coverageDetails: ['Unlimited service visits', 'Free spare parts', 'Priority support'],
      scannedImage: 'https://placehold.co/600x400/png?text=Scanned+AMC+Contract',
    },
    cot: [
      { id: '1', name: 'Raju Electrician', type: 'pro', phone: '9898989898', role: 'Primary', rating: 4.8, avatar: null },
      { id: '2', name: 'Kamal (Dad)', type: 'family', role: 'Owner', phone: '9876543210', avatar: 'https://i.pravatar.cc/150?u=dad' },
    ],
    documents: [
      { id: 'd1', name: 'Purchase Invoice.pdf', type: 'pdf', date: '15 Apr 2022' },
      { id: 'd2', name: 'Warranty Card.pdf', type: 'pdf', date: '15 Apr 2022' },
      { id: 'd3', name: 'AMC Contract.pdf', type: 'pdf', date: '12 Dec 2023' },
    ],
  },
  '2': {
    id: '2',
    name: 'Samsung Washing Machine',
    category: 'Appliances',
    location: 'Laundry Room',
    purchaseDate: '20 Mar 2023',
    warrantyUntil: '20 Mar 2026',
    image: 'https://images.samsung.com/is/image/samsung/p6pim/in/ww80t4020ce1tl/gallery/in-front-loading-washer-ww80t4020ce1tl-ww80t4020ce-tl-532860477?$684_547_PNG$',
    cycles: [
      { id: 'c1', title: 'Drum Cleaning', frequency: 'Monthly', lastDone: '01 Nov 2024', nextDue: '01 Dec 2024', status: 'ok', instructions: 'Run drum clean cycle with empty drum.' },
      { id: 'c2', title: 'Filter Cleaning', frequency: 'Every 2 Weeks', lastDone: '15 Nov 2024', nextDue: '29 Nov 2024', status: 'ok', instructions: 'Remove and clean the lint filter.' },
      { id: 'c3', title: 'AMC Renewal', frequency: 'Yearly', lastDone: '15 Nov 2024', nextDue: '15 Nov 2025', status: 'ok', instructions: 'Renew AMC before expiry.' },
    ],
    amc: {
      hasAmc: true,
      provider: 'Samsung Care+',
      policyNo: 'SC-2024-778899',
      validFrom: '15 Nov 2024',
      validUntil: '15 Nov 2025',
      supportPhone: '1800 40 7267864',
      supportEmail: 'support@samsung.com',
      coverageDetails: ['2 free visits/year', 'Labor charges covered', 'Genuine parts'],
    },
    cot: [
      { id: '1', name: 'Priya (Mom)', type: 'family', role: 'Primary User', phone: '9876543211', avatar: 'https://i.pravatar.cc/150?u=mom' },
    ],
    documents: [],
  },
  '3': {
    id: '3',
    name: 'Tata Safari',
    category: 'Vehicle',
    location: 'Garage - Dream Home',
    purchaseDate: '10 Jan 2023',
    warrantyUntil: '10 Jan 2028',
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/142739/safari-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80',
    cycles: [
      { id: 'c1', title: 'General Service', frequency: 'Every 10,000 km', lastDone: '15 Aug 2024', nextDue: '15 Nov 2024', status: 'warning', instructions: 'Book service at authorized center.' },
      { id: 'c2', title: 'Insurance Renewal', frequency: 'Yearly', lastDone: '10 Jan 2024', nextDue: '10 Jan 2025', status: 'ok', instructions: 'Compare and renew insurance.' },
      { id: 'c3', title: 'PUC Certificate', frequency: 'Every 6 Months', lastDone: '15 Sep 2024', nextDue: '15 Mar 2025', status: 'ok', instructions: 'Get PUC from authorized center.' },
    ],
    amc: { hasAmc: false },
    cot: [
      { id: '1', name: 'Tata Motors Service', type: 'pro', phone: '1800-209-7979', role: 'Authorized Service', rating: 4.5 },
      { id: '2', name: 'Kamal (Dad)', type: 'family', role: 'Owner', avatar: 'https://i.pravatar.cc/150?u=dad' },
    ],
    documents: [
      { id: 'd1', name: 'RC Book.pdf', type: 'pdf', date: '10 Jan 2023' },
      { id: 'd2', name: 'Insurance Policy.pdf', type: 'pdf', date: '10 Jan 2024' },
    ],
  },
};

// Default fallback asset
const DEFAULT_ASSET = ASSETS_DATA['1'];

export const AssetDashboardScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: { assetId?: string } }, 'params'>>();
  const insets = useSafeAreaInsets();

  const assetId = route.params?.assetId || '1';
  const asset = ASSETS_DATA[assetId] || DEFAULT_ASSET;

  const [showAmcModal, setShowAmcModal] = useState(false);
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

  const handleMarkComplete = (cycleId: string) => {
    // In real app, this would update the database
    setShowCycleModal(false);
    // Show success feedback
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return theme.colors.semantic.success;
      case 'warning': return theme.colors.semantic.warning;
      case 'overdue': return theme.colors.semantic.error;
      default: return theme.colors.utility.secondaryText;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}>
      <StatusBar barStyle="light-content" />

      {/* 1. ASSET HEADER */}
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: theme.colors.utility.primaryText }]}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Asset Dashboard</Text>
          <TouchableOpacity style={styles.navButton}>
            <MaterialCommunityIcons name="pencil" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.assetProfile}>
          <Image source={{ uri: asset.image }} style={styles.assetImage} />
          <View style={styles.assetMeta}>
            <Text style={styles.assetName}>{asset.name}</Text>
            <View style={styles.locationTag}>
              <MaterialCommunityIcons name="map-marker" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.locationText}>{asset.location}</Text>
            </View>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Purchased</Text>
                <Text style={styles.metaValue}>{asset.purchaseDate}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Warranty</Text>
                <Text style={styles.metaValue}>{asset.warrantyUntil}</Text>
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
        {/* 2. MAINTENANCE CYCLES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>
              Maintenance Cycles
            </Text>
            <TouchableOpacity>
              <MaterialCommunityIcons name="plus-circle" size={24} color={theme.colors.brand.primary} />
            </TouchableOpacity>
          </View>

          {asset.cycles.map((cycle: any) => (
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

        {/* 3. DIGITAL AMC */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>
              Annual Maintenance (AMC)
            </Text>
            {!asset.amc.hasAmc && (
              <TouchableOpacity>
                <Text style={{ color: theme.colors.brand.primary, fontWeight: '600' }}>+ Add AMC</Text>
              </TouchableOpacity>
            )}
          </View>

          {asset.amc.hasAmc ? (
            <TouchableOpacity
              style={[styles.amcCard, { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }]}
              onPress={() => setShowAmcModal(true)}
              activeOpacity={0.9}
            >
              {/* Extracted Data Tag */}
              <View style={styles.extractedTag}>
                <MaterialCommunityIcons name="text-recognition" size={12} color="#0369A1" />
                <Text style={styles.extractedText}>Smart Extracted</Text>
              </View>

              <View style={styles.amcRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.amcLabel}>Provider</Text>
                  <Text style={styles.amcValue}>{asset.amc.provider}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.amcLabel}>Valid Until</Text>
                  <Text style={[styles.amcValue, { color: '#0369A1' }]}>{asset.amc.validUntil}</Text>
                </View>
              </View>

              <View style={styles.amcActions}>
                <TouchableOpacity
                  style={[styles.callButton, { backgroundColor: theme.colors.brand.primary }]}
                  onPress={() => handleCall(asset.amc.supportPhone)}
                >
                  <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
                  <Text style={styles.callButtonText}>Call Support</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.viewDocButton, { borderColor: theme.colors.brand.primary }]}>
                  <MaterialCommunityIcons name="file-document-outline" size={18} color={theme.colors.brand.primary} />
                  <Text style={[styles.viewDocText, { color: theme.colors.brand.primary }]}>View Contract</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={[styles.noAmcCard, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
              <MaterialCommunityIcons name="file-document-outline" size={40} color={theme.colors.utility.secondaryText} />
              <Text style={[styles.noAmcText, { color: theme.colors.utility.secondaryText }]}>
                No AMC attached. Scan or add manually.
              </Text>
              <TouchableOpacity style={[styles.scanButton, { backgroundColor: theme.colors.brand.primary }]}>
                <MaterialCommunityIcons name="camera" size={18} color="#FFF" />
                <Text style={styles.scanButtonText}>Scan AMC Contract</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 4. SERVICE SUPPORT (CoT + Marketplace) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>Service Support</Text>

          {/* Primary Contacts */}
          {asset.cot.filter((c: any) => c.type === 'pro').map((pro: any) => (
            <View key={pro.id} style={[styles.proCard, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
              <View style={[styles.proAvatar, { backgroundColor: theme.colors.brand.primary + '20' }]}>
                <Text style={{ fontSize: 20 }}>👨‍🔧</Text>
              </View>
              <View style={styles.proInfo}>
                <Text style={[styles.proName, { color: theme.colors.utility.primaryText }]}>{pro.name}</Text>
                <View style={styles.proMeta}>
                  <Text style={[styles.proRole, { color: theme.colors.utility.secondaryText }]}>{pro.role}</Text>
                  {pro.rating && (
                    <View style={styles.ratingBadge}>
                      <MaterialCommunityIcons name="star" size={12} color="#F59E0B" />
                      <Text style={styles.ratingText}>{pro.rating}</Text>
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={[styles.proCallBtn, { backgroundColor: '#10B98115' }]}
                onPress={() => handleCall(pro.phone)}
              >
                <MaterialCommunityIcons name="phone" size={24} color="#10B981" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Fallback to Marketplace */}
          <View style={styles.fallbackContainer}>
            <View style={[styles.fallbackLine, { backgroundColor: theme.colors.utility.secondaryText + '30' }]} />
            <Text style={[styles.fallbackText, { color: theme.colors.utility.secondaryText }]}>Not answering?</Text>
            <View style={[styles.fallbackLine, { backgroundColor: theme.colors.utility.secondaryText + '30' }]} />
          </View>

          <TouchableOpacity style={[styles.marketButton, { borderColor: theme.colors.brand.primary }]}>
            <MaterialCommunityIcons name="store-search" size={24} color={theme.colors.brand.primary} />
            <Text style={[styles.marketButtonText, { color: theme.colors.brand.primary }]}>
              Find Alternative in Marketplace
            </Text>
          </TouchableOpacity>
        </View>

        {/* 5. LINKED DOCUMENTS */}
        {asset.documents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>
                Linked Documents
              </Text>
              <TouchableOpacity>
                <MaterialCommunityIcons name="plus-circle" size={24} color={theme.colors.brand.primary} />
              </TouchableOpacity>
            </View>

            {asset.documents.map((doc: any) => (
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

        {/* 6. FAMILY ACCESS */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>Family Access</Text>
          <View style={styles.familyRow}>
            {asset.cot.filter((c: any) => c.type === 'family').map((member: any) => (
              <View key={member.id} style={styles.familyMember}>
                {member.avatar ? (
                  <Image source={{ uri: member.avatar }} style={styles.familyAvatar} />
                ) : (
                  <View style={[styles.familyAvatar, { backgroundColor: theme.colors.brand.primary }]}>
                    <Text style={{ color: '#FFF', fontWeight: '700' }}>{member.name.charAt(0)}</Text>
                  </View>
                )}
                <Text style={[styles.familyName, { color: theme.colors.utility.primaryText }]}>{member.name.split(' ')[0]}</Text>
                <Text style={[styles.familyRole, { color: theme.colors.utility.secondaryText }]}>{member.role}</Text>
              </View>
            ))}
            <TouchableOpacity style={[styles.familyMember, styles.addMember]}>
              <View style={[styles.familyAvatar, { backgroundColor: theme.colors.utility.secondaryBackground, borderWidth: 2, borderColor: theme.colors.brand.primary, borderStyle: 'dashed' }]}>
                <MaterialCommunityIcons name="plus" size={20} color={theme.colors.brand.primary} />
              </View>
              <Text style={[styles.familyName, { color: theme.colors.brand.primary }]}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

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
                onPress={() => handleMarkComplete(selectedCycle.id)}
                buttonStyle={[styles.completeButton, { backgroundColor: theme.colors.brand.primary }]}
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
    marginBottom: 20,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#FFF' },
  assetProfile: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  assetImage: { width: 70, height: 70, borderRadius: 14, backgroundColor: '#FFF' },
  assetMeta: { flex: 1, marginLeft: 16 },
  assetName: { fontSize: 18, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  locationTag: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  locationText: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  metaRow: { flexDirection: 'row', gap: 16 },
  metaItem: {},
  metaLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, textTransform: 'uppercase' },
  metaValue: { color: '#FFF', fontSize: 12, fontWeight: '600' },

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
  amcCard: { padding: 16, borderRadius: 16, borderWidth: 1 },
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

  noAmcCard: { padding: 24, borderRadius: 16, alignItems: 'center', gap: 12 },
  noAmcText: { fontSize: 14, textAlign: 'center' },
  scanButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, gap: 8, marginTop: 8 },
  scanButtonText: { color: '#FFF', fontWeight: '600' },

  // Service Support
  proCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, marginBottom: 12 },
  proAvatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  proInfo: { flex: 1, marginLeft: 14 },
  proName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  proMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  proRole: { fontSize: 13 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: 12, fontWeight: '600', color: '#F59E0B' },
  proCallBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },

  fallbackContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  fallbackLine: { flex: 1, height: 1 },
  fallbackText: { marginHorizontal: 12, fontSize: 12 },
  marketButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', gap: 10 },
  marketButtonText: { fontWeight: '600', fontSize: 15 },

  // Documents
  docCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 10 },
  docInfo: { flex: 1, marginLeft: 12 },
  docName: { fontSize: 14, fontWeight: '600' },
  docDate: { fontSize: 12, marginTop: 2 },

  // Family
  familyRow: { flexDirection: 'row', gap: 16 },
  familyMember: { alignItems: 'center', width: 70 },
  familyAvatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  familyName: { fontSize: 13, fontWeight: '600' },
  familyRole: { fontSize: 11, marginTop: 2 },
  addMember: {},

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
