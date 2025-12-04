// src/features/assets/screens/AssetsHubScreen.tsx
// Asset Lifecycle Management - Focus on "Health" not "Wealth"
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { Text } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// --- MOCK FAMILY MEMBERS ---
const FAMILY_MEMBERS = [
  { id: 'all', name: 'All', avatar: null, color: '#6B7280' },
  { id: 'dad', name: 'Kamal', avatar: 'https://i.pravatar.cc/150?u=dad', color: '#3B82F6' },
  { id: 'mom', name: 'Priya', avatar: 'https://i.pravatar.cc/150?u=mom', color: '#EC4899' },
  { id: 'joint', name: 'Shared', avatar: null, icon: 'account-group', color: '#8B5CF6' },
];

// --- MOCK ASSETS: Focused on "Health" not "Wealth" ---
const MY_ASSETS = [
  {
    id: '1',
    title: 'Luminous Inverter',
    category: 'Electronics',
    location: 'Utility Area, 1st Floor',
    status: 'critical',
    nextCycle: 'Distilled Water Refill',
    dueDate: 'Overdue (2 Days)',
    daysUntilDue: -2,
    image: 'https://rukminim2.flixcart.com/image/850/1000/xif0q/inverter/y/i/n/-original-imagqhyq9g5g5z8h.jpeg?q=90',
    icon: 'car-battery',
    ownerId: 'joint',
    hasAmc: true,
  },
  {
    id: '2',
    title: 'Samsung Washing Machine',
    category: 'Appliances',
    location: 'Laundry Room',
    status: 'good',
    nextCycle: 'AMC Expiry',
    dueDate: 'Nov 15, 2025',
    daysUntilDue: 350,
    image: 'https://images.samsung.com/is/image/samsung/p6pim/in/ww80t4020ce1tl/gallery/in-front-loading-washer-ww80t4020ce1tl-ww80t4020ce-tl-532860477?$684_547_PNG$',
    icon: 'washing-machine',
    ownerId: 'mom',
    hasAmc: true,
  },
  {
    id: '3',
    title: 'Tata Safari',
    category: 'Vehicle',
    location: 'Garage - Dream Home',
    status: 'warning',
    nextCycle: 'General Service',
    dueDate: 'Due in 15 Days',
    daysUntilDue: 15,
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/142739/safari-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80',
    icon: 'car-suv',
    ownerId: 'dad',
    hasAmc: false,
  },
  {
    id: '4',
    title: 'Daikin AC (3 units)',
    category: 'HVAC',
    location: 'Multiple Rooms',
    status: 'good',
    nextCycle: 'Filter Cleaning',
    dueDate: 'Jan 2025',
    daysUntilDue: 60,
    image: 'https://www.daikin.co.in/sites/default/files/styles/catalog_large/public/2023-01/FTKF_0.png?itok=VLGhLxR4',
    icon: 'air-conditioner',
    ownerId: 'joint',
    hasAmc: true,
  },
  {
    id: '5',
    title: 'Honda Activa',
    category: 'Vehicle',
    location: 'Parking - Ground Floor',
    status: 'warning',
    nextCycle: 'Insurance Renewal',
    dueDate: 'Due in 10 Days',
    daysUntilDue: 10,
    image: 'https://bd.gaadicdn.com/processedimages/honda/activa-6g/640X309/activa-6g6543d1fd2c9a.jpg',
    icon: 'motorbike',
    ownerId: 'mom',
    hasAmc: false,
  },
];

export const AssetsHubScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  // State
  const [selectedMember, setSelectedMember] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'critical' | 'warning' | 'good'>('all');

  // Animations
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const cardsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardsOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Filtered assets
  const filteredAssets = MY_ASSETS.filter((asset) => {
    const memberMatch = selectedMember === 'all' || asset.ownerId === selectedMember;
    const statusMatch = selectedFilter === 'all' || asset.status === selectedFilter;
    return memberMatch && statusMatch;
  });

  // Calculate maintenance summary
  const maintenanceSummary = {
    critical: MY_ASSETS.filter((a) => a.status === 'critical').length,
    warning: MY_ASSETS.filter((a) => a.status === 'warning').length,
    good: MY_ASSETS.filter((a) => a.status === 'good').length,
  };

  // Helper to get member details
  const getMemberDetails = (id: string) => FAMILY_MEMBERS.find((m) => m.id === id);

  // Status helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return theme.colors.semantic.success;
      case 'warning':
        return theme.colors.semantic.warning;
      case 'critical':
        return theme.colors.semantic.error;
      default:
        return theme.colors.utility.secondaryText;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return 'check-circle';
      case 'warning':
        return 'alert-circle';
      case 'critical':
        return 'alert-octagon';
      default:
        return 'help-circle';
    }
  };

  const renderMemberFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.memberFilterScroll}
      contentContainerStyle={styles.memberFilterContent}
    >
      {FAMILY_MEMBERS.map((member) => {
        const isSelected = selectedMember === member.id;
        return (
          <TouchableOpacity
            key={member.id}
            style={[
              styles.memberChip,
              isSelected && { backgroundColor: '#FFF' },
              !isSelected && { backgroundColor: 'rgba(255,255,255,0.15)' },
            ]}
            onPress={() => setSelectedMember(member.id)}
            activeOpacity={0.8}
          >
            {member.avatar ? (
              <Image source={{ uri: member.avatar }} style={styles.memberAvatarSmall} />
            ) : (
              <View style={[styles.memberAvatarSmall, { backgroundColor: isSelected ? member.color : 'rgba(255,255,255,0.3)' }]}>
                <MaterialCommunityIcons
                  name={(member.icon || 'all-inclusive') as any}
                  size={14}
                  color={isSelected ? '#FFF' : '#FFF'}
                />
              </View>
            )}
            <Text
              style={[
                styles.memberName,
                { color: isSelected ? theme.colors.brand.primary : 'rgba(255,255,255,0.9)' },
              ]}
            >
              {member.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderStatusFilter = () => (
    <View style={styles.statusFilterRow}>
      {[
        { key: 'all', label: 'All', count: MY_ASSETS.length },
        { key: 'critical', label: 'Critical', count: maintenanceSummary.critical },
        { key: 'warning', label: 'Upcoming', count: maintenanceSummary.warning },
        { key: 'good', label: 'Healthy', count: maintenanceSummary.good },
      ].map((filter) => (
        <TouchableOpacity
          key={filter.key}
          style={[
            styles.statusFilterChip,
            {
              backgroundColor:
                selectedFilter === filter.key
                  ? theme.colors.utility.primaryBackground
                  : 'transparent',
              borderColor:
                selectedFilter === filter.key
                  ? theme.colors.utility.primaryBackground
                  : 'rgba(255,255,255,0.3)',
            },
          ]}
          onPress={() => setSelectedFilter(filter.key as any)}
        >
          <Text
            style={[
              styles.statusFilterText,
              {
                color:
                  selectedFilter === filter.key
                    ? theme.colors.brand.primary
                    : 'rgba(255,255,255,0.8)',
              },
            ]}
          >
            {filter.label}
          </Text>
          <View
            style={[
              styles.statusFilterBadge,
              {
                backgroundColor:
                  selectedFilter === filter.key
                    ? theme.colors.brand.primary
                    : 'rgba(255,255,255,0.2)',
              },
            ]}
          >
            <Text style={styles.statusFilterCount}>{filter.count}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAssetCard = (item: typeof MY_ASSETS[0], index: number) => {
    const owner = getMemberDetails(item.ownerId);
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.9}
        style={[styles.assetCard, { backgroundColor: theme.colors.utility.secondaryBackground }]}
        onPress={() => navigation.navigate('AssetDashboard', { assetId: item.id })}
      >
        {/* Status Indicator Line */}
        <View style={[styles.statusLine, { backgroundColor: statusColor }]} />

        <View style={styles.cardContent}>
          {/* Top Row: Image + Info */}
          <View style={styles.cardTopRow}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />

            <View style={styles.cardInfo}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.utility.primaryText }]} numberOfLines={1}>
                  {item.title}
                </Text>
                {item.hasAmc && (
                  <View style={[styles.amcBadge, { backgroundColor: '#3B82F620' }]}>
                    <Text style={styles.amcBadgeText}>AMC</Text>
                  </View>
                )}
              </View>

              <View style={styles.locationRow}>
                <MaterialCommunityIcons name="map-marker-outline" size={14} color={theme.colors.utility.secondaryText} />
                <Text style={[styles.locationText, { color: theme.colors.utility.secondaryText }]} numberOfLines={1}>
                  {item.location}
                </Text>
              </View>

              {/* Ownership Badge */}
              <View style={styles.ownerRow}>
                {owner?.avatar ? (
                  <Image source={{ uri: owner.avatar }} style={styles.ownerAvatarTiny} />
                ) : (
                  <View style={[styles.ownerAvatarTiny, { backgroundColor: owner?.color || '#666' }]}>
                    <MaterialCommunityIcons name="account-group" size={10} color="#FFF" />
                  </View>
                )}
                <Text style={[styles.ownerName, { color: theme.colors.utility.secondaryText }]}>
                  {owner?.name}
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom Row: Next Cycle */}
          <View style={[styles.cycleContainer, { backgroundColor: statusColor + '10' }]}>
            <View style={styles.cycleLeft}>
              <MaterialCommunityIcons name={getStatusIcon(item.status) as any} size={18} color={statusColor} />
              <View>
                <Text style={[styles.cycleLabel, { color: theme.colors.utility.secondaryText }]}>
                  Next: {item.nextCycle}
                </Text>
                <Text style={[styles.cycleDate, { color: statusColor }]}>{item.dueDate}</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.utility.secondaryText} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <Animated.View
        style={[
          styles.header,
          { paddingTop: insets.top, backgroundColor: theme.colors.brand.primary, opacity: headerOpacity },
        ]}
      >
        {/* Pattern Background */}
        <View style={styles.patternOverlay}>
          <MaterialCommunityIcons name="tools" size={250} color="#FFFFFF08" style={{ position: 'absolute', right: -40, top: -20 }} />
        </View>

        <View style={styles.headerContent}>
          {/* Nav Bar */}
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Assets & Maintenance</Text>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Member Filter */}
          {renderMemberFilter()}

          {/* Maintenance Summary / Status Filters */}
          {renderStatusFilter()}
        </View>
      </Animated.View>

      {/* ASSET LIST */}
      <Animated.ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        style={{ opacity: cardsOpacity }}
      >
        {filteredAssets.length > 0 ? (
          <>
            <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>
              {selectedFilter === 'all' ? 'All Assets' : `${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} Assets`}
            </Text>
            {filteredAssets.map((asset, index) => renderAssetCard(asset, index))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="package-variant" size={60} color={theme.colors.utility.secondaryText + '50'} />
            <Text style={[styles.emptyText, { color: theme.colors.utility.secondaryText }]}>
              No assets found
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* FAB: Add Asset */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.brand.primary, bottom: insets.bottom + 20 }]}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="camera-plus" size={26} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    paddingBottom: 20,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 10,
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },

  // Member Filter
  memberFilterScroll: { marginBottom: 16 },
  memberFilterContent: { paddingRight: 20 },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    gap: 8,
  },
  memberAvatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberName: { fontWeight: '600', fontSize: 13 },

  // Status Filter
  statusFilterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  statusFilterText: { fontSize: 12, fontWeight: '600' },
  statusFilterBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  statusFilterCount: { color: '#FFF', fontSize: 11, fontWeight: '700' },

  // List
  listContent: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },

  // Asset Card
  assetCard: {
    borderRadius: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  statusLine: {
    height: 4,
    width: '100%',
  },
  cardContent: { padding: 14 },
  cardTopRow: { flexDirection: 'row', marginBottom: 12 },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  cardInfo: { flex: 1, marginLeft: 14, justifyContent: 'center' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', flex: 1 },
  amcBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  amcBadgeText: { color: '#3B82F6', fontSize: 10, fontWeight: '700' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  locationText: { fontSize: 12, flex: 1 },
  ownerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ownerAvatarTiny: { width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  ownerName: { fontSize: 12, fontWeight: '500' },

  // Cycle Container
  cycleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
  },
  cycleLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cycleLabel: { fontSize: 12 },
  cycleDate: { fontSize: 14, fontWeight: '700', marginTop: 2 },

  // Empty State
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 16 },
  emptyText: { fontSize: 16, fontWeight: '500' },

  // FAB
  fab: {
    position: 'absolute',
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
