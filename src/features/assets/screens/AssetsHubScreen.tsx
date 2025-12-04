// src/features/assets/screens/AssetsHubScreen.tsx
// Unified Family Vault - Assets, Insurance, Health, Documents all in one place
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
  Animated,
} from 'react-native';
import { Text } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { useFamily } from '../../../context/FamilyContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// --- THE 7 PILLARS TAXONOMY ---
type AssetCategory =
  | 'properties'    // Land, Flats, Commercial
  | 'mobility'      // Cars, Bikes
  | 'electronics'   // Inverters, Laptops, Phones
  | 'protection'    // Life Insurance, Health Insurance
  | 'wellness'      // Health conditions, Medical care
  | 'valuables'     // Gold, Art, Watches
  | 'identity';     // Passports, Aadhaar, Deeds

// Role types based on category
type LinkedMemberRole = 'owner' | 'patient' | 'policyholder' | 'covered' | 'holder' | 'primary';

interface UnifiedAsset {
  id: string;
  title: string;              // Generic title (e.g., "Cardiac Care", not "Dad's Cardiac Care")
  category: AssetCategory;
  icon: string;
  color: string;
  status: 'good' | 'warning' | 'critical';
  nextCycle: string;
  dueDate: string;
  daysUntilDue?: number;
  meta: string;
  image: string;
  // Linked member fields
  linkedMemberId?: string;    // Reference to family member
  linkedMemberRole?: LinkedMemberRole;
  isShared?: boolean;         // For family-wide assets (property, insurance floater)
}

// --- UNIFIED DATA MODEL ---
// Now with linkedMemberId instead of hardcoded names
const UNIFIED_ASSETS: UnifiedAsset[] = [
  // PROTECTION (Insurance)
  {
    id: 'ins-1',
    title: 'HDFC Ergo Health Optima',
    category: 'protection',
    icon: 'shield-check',
    color: '#8B5CF6',
    status: 'good',
    nextCycle: 'Premium Due',
    dueDate: '12 Dec 2025',
    daysUntilDue: 373,
    meta: 'Cover: ₹50L',
    image: 'https://placehold.co/100x100/8B5CF6/ffffff?text=HDFC',
    isShared: true, // Family Floater
    linkedMemberRole: 'policyholder',
  },
  {
    id: 'ins-2',
    title: 'LIC Term Plan',
    category: 'protection',
    icon: 'shield-account',
    color: '#8B5CF6',
    status: 'good',
    nextCycle: 'Premium Due',
    dueDate: '15 Mar 2025',
    daysUntilDue: 101,
    meta: 'Cover: ₹1Cr',
    image: 'https://placehold.co/100x100/8B5CF6/ffffff?text=LIC',
    linkedMemberId: 'member-1', // Dad
    linkedMemberRole: 'policyholder',
  },
  // WELLNESS (Health)
  {
    id: 'health-1',
    title: 'Cardiac Care',
    category: 'wellness',
    icon: 'heart-pulse',
    color: '#EF4444',
    status: 'warning',
    nextCycle: 'Cardiologist Visit',
    dueDate: 'Due in 5 Days',
    daysUntilDue: 5,
    meta: 'Dr. Rao • Apollo Hospital',
    image: 'https://placehold.co/100x100/EF4444/ffffff?text=❤️',
    linkedMemberId: 'member-1', // Dad
    linkedMemberRole: 'patient',
  },
  {
    id: 'health-2',
    title: 'Thyroid Management',
    category: 'wellness',
    icon: 'medical-bag',
    color: '#EF4444',
    status: 'good',
    nextCycle: 'TSH Test',
    dueDate: '20 Jan 2025',
    daysUntilDue: 47,
    meta: 'Dr. Sharma • Endocrinologist',
    image: 'https://placehold.co/100x100/EF4444/ffffff?text=🩺',
    linkedMemberId: 'member-2', // Mom
    linkedMemberRole: 'patient',
  },
  // ELECTRONICS
  {
    id: 'elec-1',
    title: 'Luminous Inverter (1100VA)',
    category: 'electronics',
    icon: 'lightning-bolt',
    color: '#F59E0B',
    status: 'critical',
    nextCycle: 'Water Top-up',
    dueDate: 'Overdue (2 Days)',
    daysUntilDue: -2,
    meta: 'AMC Active • Utility Area',
    image: 'https://rukminim2.flixcart.com/image/850/1000/xif0q/inverter/y/i/n/-original-imagqhyq9g5g5z8h.jpeg?q=90',
    isShared: true,
  },
  {
    id: 'elec-2',
    title: 'Samsung Washing Machine',
    category: 'electronics',
    icon: 'washing-machine',
    color: '#F59E0B',
    status: 'good',
    nextCycle: 'Drum Cleaning',
    dueDate: '01 Dec 2024',
    daysUntilDue: 27,
    meta: 'Warranty till Mar 2026',
    image: 'https://images.samsung.com/is/image/samsung/p6pim/in/ww80t4020ce1tl/gallery/in-front-loading-washer-ww80t4020ce1tl-ww80t4020ce-tl-532860477?$684_547_PNG$',
    linkedMemberId: 'member-2', // Mom (primary user)
    linkedMemberRole: 'primary',
  },
  // MOBILITY
  {
    id: 'veh-1',
    title: 'Tata Safari',
    category: 'mobility',
    icon: 'car',
    color: '#10B981',
    status: 'warning',
    nextCycle: 'General Service',
    dueDate: 'Due Soon',
    daysUntilDue: 10,
    meta: 'KA-01-MJ-1234 • 45,000 km',
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/142739/safari-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80',
    linkedMemberId: 'member-1', // Dad
    linkedMemberRole: 'owner',
  },
  {
    id: 'veh-2',
    title: 'Honda Activa',
    category: 'mobility',
    icon: 'motorbike',
    color: '#10B981',
    status: 'warning',
    nextCycle: 'Insurance Renewal',
    dueDate: 'Due in 10 Days',
    daysUntilDue: 10,
    meta: 'KA-01-AB-5678',
    image: 'https://bd.gaadicdn.com/processedimages/honda/activa-6g/640X309/activa-6g6543d1fd2c9a.jpg',
    linkedMemberId: 'member-2', // Mom
    linkedMemberRole: 'owner',
  },
  // PROPERTIES
  {
    id: 'prop-1',
    title: '3BHK Whitefield',
    category: 'properties',
    icon: 'home-city',
    color: '#4F46E5',
    status: 'good',
    nextCycle: 'Property Tax',
    dueDate: 'Mar 2025',
    daysUntilDue: 120,
    meta: 'Owned • Dream Home',
    image: 'https://placehold.co/100x100/4F46E5/ffffff?text=🏠',
    isShared: true,
  },
  // VALUABLES
  {
    id: 'val-1',
    title: 'Gold Jewelry (150g)',
    category: 'valuables',
    icon: 'diamond-stone',
    color: '#EC4899',
    status: 'good',
    nextCycle: 'Valuation Update',
    dueDate: 'Jan 2025',
    daysUntilDue: 60,
    meta: 'Bank Locker • HDFC',
    image: 'https://placehold.co/100x100/EC4899/ffffff?text=💎',
    linkedMemberId: 'member-2', // Mom
    linkedMemberRole: 'primary',
  },
  // IDENTITY
  {
    id: 'doc-1',
    title: 'Passport',
    category: 'identity',
    icon: 'passport',
    color: '#6B7280',
    status: 'good',
    nextCycle: 'Renewal',
    dueDate: 'Aug 2028',
    daysUntilDue: 1350,
    meta: 'Valid • J1234567',
    image: 'https://placehold.co/100x100/6B7280/ffffff?text=🛂',
    linkedMemberId: 'member-1', // Dad
    linkedMemberRole: 'holder',
  },
  {
    id: 'doc-2',
    title: 'Passport',
    category: 'identity',
    icon: 'passport',
    color: '#6B7280',
    status: 'good',
    nextCycle: 'Renewal',
    dueDate: 'Dec 2026',
    daysUntilDue: 750,
    meta: 'Valid • K9876543',
    image: 'https://placehold.co/100x100/6B7280/ffffff?text=🛂',
    linkedMemberId: 'member-2', // Mom
    linkedMemberRole: 'holder',
  },
];

// --- CATEGORY FILTERS (The 7 Pillars + All) ---
const CATEGORY_FILTERS = [
  { id: 'all', label: 'All', icon: 'view-grid' },
  { id: 'protection', label: 'Insurance', icon: 'shield-check' },
  { id: 'wellness', label: 'Health', icon: 'heart-pulse' },
  { id: 'mobility', label: 'Vehicles', icon: 'car' },
  { id: 'electronics', label: 'Devices', icon: 'laptop' },
  { id: 'properties', label: 'Property', icon: 'home-city' },
  { id: 'valuables', label: 'Valuables', icon: 'diamond-stone' },
  { id: 'identity', label: 'Documents', icon: 'file-document' },
];

// --- STATUS FILTERS ---
const STATUS_FILTERS = [
  { id: 'all', label: 'All Items', color: undefined },
  { id: 'critical', label: 'Needs Attention', color: '#EF4444' },
  { id: 'warning', label: 'Upcoming', color: '#F59E0B' },
];

export const AssetsHubScreen: React.FC = () => {
  const { theme } = useTheme();
  const { members, getMemberById, getMemberDisplayName } = useFamily();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeMember, setActiveMember] = useState('all'); // NEW: Person filter

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  // Build person filter options from family members
  const personFilters = useMemo(() => {
    return [
      { id: 'all', name: 'Everyone', avatar: null, color: '#6B7280' },
      ...members.map(m => ({
        id: m.id,
        name: m.displayRelationship,
        avatar: m.avatar,
        color: m.color,
      })),
    ];
  }, [members]);

  // Filter logic - now includes person filter
  const filteredData = useMemo(() => {
    return UNIFIED_ASSETS.filter(item => {
      const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
      const statusMatch = activeStatus === 'all' || item.status === activeStatus;

      // Person filter logic
      let personMatch = activeMember === 'all';
      if (!personMatch) {
        if (item.isShared) {
          personMatch = true; // Shared items show for everyone
        } else {
          personMatch = item.linkedMemberId === activeMember;
        }
      }

      return categoryMatch && statusMatch && personMatch;
    });
  }, [activeCategory, activeStatus, activeMember]);

  // Summary stats
  const criticalCount = UNIFIED_ASSETS.filter(a => a.status === 'critical').length;
  const warningCount = UNIFIED_ASSETS.filter(a => a.status === 'warning').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return theme.colors.semantic.success;
      case 'warning': return theme.colors.semantic.warning;
      case 'critical': return theme.colors.semantic.error;
      default: return theme.colors.utility.secondaryText;
    }
  };

  // Generate display title with member relationship
  const getDisplayTitle = (item: UnifiedAsset): string => {
    if (item.isShared) {
      return item.title; // No prefix for shared items
    }
    if (item.linkedMemberId) {
      const memberName = getMemberDisplayName(item.linkedMemberId, 'relationship');
      return `${memberName}'s ${item.title}`;
    }
    return item.title;
  };

  // Generate display meta with member info
  const getDisplayMeta = (item: UnifiedAsset): string => {
    if (item.isShared) {
      return `${item.meta} • Family`;
    }
    if (item.linkedMemberId) {
      const member = getMemberById(item.linkedMemberId);
      if (member) {
        return `${item.meta} • ${member.name}`;
      }
    }
    return item.meta;
  };

  const renderPersonFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.personFilterContainer}
      contentContainerStyle={styles.personFilterContent}
    >
      {personFilters.map((person) => {
        const isSelected = activeMember === person.id;
        return (
          <TouchableOpacity
            key={person.id}
            style={[
              styles.personChip,
              isSelected && { backgroundColor: '#FFF' },
              !isSelected && { backgroundColor: 'rgba(255,255,255,0.15)' }
            ]}
            onPress={() => setActiveMember(person.id)}
            activeOpacity={0.8}
          >
            {person.avatar ? (
              <Image source={{ uri: person.avatar }} style={styles.personAvatar} />
            ) : (
              <View style={[styles.personAvatar, { backgroundColor: isSelected ? person.color : 'rgba(255,255,255,0.3)' }]}>
                <MaterialCommunityIcons
                  name={person.id === 'all' ? 'account-group' : 'account'}
                  size={14}
                  color="#FFF"
                />
              </View>
            )}
            <Text style={[
              styles.personName,
              { color: isSelected ? theme.colors.brand.primary : 'rgba(255,255,255,0.9)' }
            ]}>
              {person.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderAssetCard = ({ item, index }: { item: UnifiedAsset; index: number }) => {
    const displayTitle = getDisplayTitle(item);
    const displayMeta = getDisplayMeta(item);
    const linkedMember = item.linkedMemberId ? getMemberById(item.linkedMemberId) : null;

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: Animated.multiply(slideAnim, new Animated.Value(1 + index * 0.1)) }],
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.card, { backgroundColor: theme.colors.utility.secondaryBackground }]}
          onPress={() => navigation.navigate('AssetDashboard', { assetId: item.id, category: item.category })}
        >
          {/* Image with Category Badge */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={[styles.categoryBadge, { backgroundColor: item.color }]}>
              <MaterialCommunityIcons name={item.icon as any} size={14} color="#FFF" />
            </View>
            {/* Status Indicator Dot */}
            {item.status !== 'good' && (
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            )}
            {/* Member Avatar (if linked) */}
            {linkedMember && !item.isShared && (
              <View style={styles.memberAvatarContainer}>
                {linkedMember.avatar ? (
                  <Image source={{ uri: linkedMember.avatar }} style={styles.memberAvatarSmall} />
                ) : (
                  <View style={[styles.memberAvatarSmall, { backgroundColor: linkedMember.color }]}>
                    <Text style={styles.memberInitial}>{linkedMember.name.charAt(0)}</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Content */}
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.colors.utility.primaryText }]} numberOfLines={1}>
                {displayTitle}
              </Text>
            </View>

            <Text style={[styles.metaText, { color: theme.colors.utility.secondaryText }]} numberOfLines={1}>
              {displayMeta}
            </Text>

            {/* Cycle Info */}
            <View style={styles.cycleRow}>
              <View style={[styles.cycleTag, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                <MaterialCommunityIcons
                  name={item.status === 'critical' ? 'alert-circle' : item.status === 'warning' ? 'clock-alert' : 'update'}
                  size={12}
                  color={getStatusColor(item.status)}
                />
                <Text style={[styles.cycleText, { color: getStatusColor(item.status) }]}>
                  {item.nextCycle}
                </Text>
              </View>
              <Text style={[styles.dueText, { color: getStatusColor(item.status) }]}>
                {item.dueDate}
              </Text>
            </View>
          </View>

          {/* Arrow */}
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={theme.colors.utility.secondaryText}
            style={styles.cardArrow}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: theme.colors.brand.primary }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Family Vault</Text>
            <Text style={styles.headerSubtitle}>Everything in one place</Text>
          </View>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('AddAsset')}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Alert Summary */}
        {(criticalCount > 0 || warningCount > 0) && (
          <View style={styles.alertSummary}>
            {criticalCount > 0 && (
              <TouchableOpacity
                style={[styles.alertChip, { backgroundColor: 'rgba(239,68,68,0.2)' }]}
                onPress={() => setActiveStatus('critical')}
              >
                <MaterialCommunityIcons name="alert-circle" size={14} color="#FFF" />
                <Text style={styles.alertText}>{criticalCount} Overdue</Text>
              </TouchableOpacity>
            )}
            {warningCount > 0 && (
              <TouchableOpacity
                style={[styles.alertChip, { backgroundColor: 'rgba(245,158,11,0.2)' }]}
                onPress={() => setActiveStatus('warning')}
              >
                <MaterialCommunityIcons name="clock-alert" size={14} color="#FFF" />
                <Text style={styles.alertText}>{warningCount} Due Soon</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Person Filter (NEW) */}
        {renderPersonFilter()}

        {/* Category Pills (Horizontal Scroll) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          style={styles.filterContainer}
        >
          {CATEGORY_FILTERS.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.filterChip,
                activeCategory === cat.id
                  ? { backgroundColor: '#FFF' }
                  : { backgroundColor: 'rgba(255,255,255,0.15)' }
              ]}
              onPress={() => setActiveCategory(cat.id)}
            >
              <MaterialCommunityIcons
                name={cat.icon as any}
                size={16}
                color={activeCategory === cat.id ? theme.colors.brand.primary : '#FFF'}
              />
              <Text style={[
                styles.filterText,
                { color: activeCategory === cat.id ? theme.colors.brand.primary : '#FFF' }
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* STATUS TOGGLE (below header) */}
      <View style={[styles.statusBar, { backgroundColor: theme.colors.utility.primaryBackground }]}>
        {STATUS_FILTERS.map((status) => (
          <TouchableOpacity
            key={status.id}
            style={[
              styles.statusChip,
              activeStatus === status.id && {
                backgroundColor: status.color ? status.color + '15' : theme.colors.brand.primary + '15',
                borderColor: status.color || theme.colors.brand.primary,
              }
            ]}
            onPress={() => setActiveStatus(status.id)}
          >
            <Text style={[
              styles.statusText,
              { color: activeStatus === status.id ? (status.color || theme.colors.brand.primary) : theme.colors.utility.secondaryText }
            ]}>
              {status.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ASSET LIST */}
      <FlatList
        data={filteredData}
        renderItem={renderAssetCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.listHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>
              {activeCategory === 'all'
                ? activeMember === 'all'
                  ? 'All Assets & Protection'
                  : `${personFilters.find(p => p.id === activeMember)?.name}'s Items`
                : CATEGORY_FILTERS.find(c => c.id === activeCategory)?.label}
            </Text>
            <View style={[styles.countBadge, { backgroundColor: theme.colors.brand.primary + '15' }]}>
              <Text style={[styles.countText, { color: theme.colors.brand.primary }]}>{filteredData.length}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="package-variant" size={48} color={theme.colors.utility.secondaryText} />
            <Text style={[styles.emptyText, { color: theme.colors.utility.secondaryText }]}>
              No items found
            </Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.colors.brand.primary }]}
              onPress={() => navigation.navigate('AddAsset')}
            >
              <MaterialCommunityIcons name="plus" size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Add First Asset</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.brand.primary }]}
        onPress={() => navigation.navigate('AddAsset')}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    paddingBottom: 16,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#FFF' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Alert Summary
  alertSummary: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  alertChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  alertText: { color: '#FFF', fontSize: 12, fontWeight: '600' },

  // Person Filter (NEW)
  personFilterContainer: {
    marginBottom: 12,
  },
  personFilterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  personChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 8,
  },
  personAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personName: { fontWeight: '600', fontSize: 13 },

  // Filters
  filterContainer: { marginTop: 4 },
  filterScroll: { paddingHorizontal: 20, gap: 8 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  filterText: { fontWeight: '600', fontSize: 13 },

  // Status Bar
  statusBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  statusChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statusText: { fontSize: 13, fontWeight: '500' },

  // List
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: { fontSize: 13, fontWeight: '700' },

  // Card
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: { position: 'relative' },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  statusDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  memberAvatarContainer: {
    position: 'absolute',
    top: -4,
    left: -4,
  },
  memberAvatarSmall: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInitial: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  cardContent: { flex: 1, marginLeft: 14 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', flex: 1 },
  metaText: { fontSize: 13, marginBottom: 8 },
  cycleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cycleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  cycleText: { fontSize: 11, fontWeight: '600' },
  dueText: { fontSize: 12, fontWeight: '700' },
  cardArrow: { marginLeft: 8 },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: { fontSize: 16, fontWeight: '500' },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    marginTop: 8,
  },
  addButtonText: { color: '#FFF', fontWeight: '600', fontSize: 15 },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});
