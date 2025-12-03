// src/features/assets/screens/AssetsHubScreen.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  StatusBar,
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
  { id: 'joint', name: 'Joint', avatar: null, icon: 'account-group', color: '#8B5CF6' },
];

// --- MOCK ASSETS WITH OWNERSHIP ---
const MY_ASSETS = [
  {
    id: '1',
    title: 'Dream Home',
    type: 'Real Estate',
    value: '₹1.2 Cr',
    growth: '+12%',
    icon: 'home-city',
    color: '#4F46E5',
    location: 'Bangalore, KA',
    ownerId: 'joint', // JOINT ASSET
    ownerLabel: 'Joint',
  },
  {
    id: '2',
    title: 'Tata Safari',
    type: 'Vehicle',
    value: '₹18.5 L',
    growth: '-8%',
    icon: 'car-suv',
    color: '#059669',
    location: 'KA-01-MJ-1234',
    nextAction: 'Insurance Due',
    ownerId: 'dad', // DAD's ASSET
    ownerLabel: 'Kamal',
  },
  {
    id: '3',
    title: 'SGB Bonds',
    type: 'Gold',
    value: '₹5.4 L',
    growth: '+22%',
    icon: 'gold',
    color: '#D97706',
    location: 'Digital Vault',
    ownerId: 'mom', // MOM's ASSET
    ownerLabel: 'Priya',
  },
  {
    id: '4',
    title: 'Fixed Deposit',
    type: 'Savings',
    value: '₹25 L',
    growth: '+7%',
    icon: 'bank',
    color: '#0891B2',
    location: 'HDFC Bank',
    ownerId: 'joint',
    ownerLabel: 'Joint',
  },
  {
    id: '5',
    title: 'Honda Activa',
    type: 'Vehicle',
    value: '₹85,000',
    growth: '-15%',
    icon: 'motorbike',
    color: '#059669',
    location: 'KA-01-AB-5678',
    ownerId: 'mom',
    ownerLabel: 'Priya',
  },
];

export const AssetsHubScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  // State for filtering
  const [selectedMember, setSelectedMember] = useState('all');

  const filteredAssets = selectedMember === 'all'
    ? MY_ASSETS
    : MY_ASSETS.filter(a => a.ownerId === selectedMember);

  // Helper to get member details
  const getMemberDetails = (id: string) => FAMILY_MEMBERS.find(m => m.id === id);

  // Calculate net worth for selected member
  const calculateNetWorth = () => {
    const assets = selectedMember === 'all' ? MY_ASSETS : filteredAssets;
    // Simple calculation for demo - in reality would parse values
    if (selectedMember === 'all') return '₹1,43,90,000';
    if (selectedMember === 'dad') return '₹18,50,000';
    if (selectedMember === 'mom') return '₹6,25,000';
    if (selectedMember === 'joint') return '₹1,45,00,000';
    return '₹0';
  };

  // Animations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [320, 180],
    extrapolate: 'clamp',
  });

  const netWorthOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const renderMemberFilter = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.memberFilterScroll}>
      {FAMILY_MEMBERS.map((member) => {
        const isSelected = selectedMember === member.id;
        return (
          <TouchableOpacity
            key={member.id}
            style={[
              styles.memberChip,
              isSelected && { backgroundColor: theme.colors.brand.primary },
              !isSelected && { backgroundColor: 'rgba(255,255,255,0.15)' }
            ]}
            onPress={() => setSelectedMember(member.id)}
            activeOpacity={0.8}
          >
            {member.avatar ? (
              <Image source={{ uri: member.avatar }} style={styles.memberAvatarSmall} />
            ) : (
              <View style={[styles.memberAvatarSmall, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                 <MaterialCommunityIcons name={(member.icon || 'all-inclusive') as any} size={14} color="#FFF" />
              </View>
            )}
            <Text style={[styles.memberName, { color: isSelected ? '#FFF' : 'rgba(255,255,255,0.8)' }]}>
              {member.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderAssetCard = (item: typeof MY_ASSETS[0], index: number) => {
    const owner = getMemberDetails(item.ownerId);

    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.9}
        style={[
          styles.assetCard,
          { backgroundColor: theme.colors.utility.secondaryBackground }
        ]}
        onPress={() => navigation.navigate('AssetDetail' as any, { assetId: item.id })}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
            <MaterialCommunityIcons name={item.icon as any} size={28} color={item.color} />
          </View>

          {/* OWNERSHIP BADGE */}
          <View style={[styles.ownerBadge, { backgroundColor: theme.colors.utility.primaryBackground }]}>
             {owner?.avatar ? (
               <Image source={{ uri: owner.avatar }} style={styles.ownerAvatarTiny} />
             ) : (
               <MaterialCommunityIcons name="account-group" size={14} color={theme.colors.utility.secondaryText} />
             )}
             <Text style={[styles.ownerName, { color: theme.colors.utility.secondaryText }]}>
               {owner?.name}
             </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
            <Text style={[styles.assetTitle, { color: theme.colors.utility.primaryText }]}>
                {item.title}
            </Text>
            <Text style={[styles.assetLocation, { color: theme.colors.utility.secondaryText }]}>
                {item.location}
            </Text>
            <View style={styles.cardFooter}>
                <Text style={[styles.assetValue, { color: theme.colors.utility.primaryText }]}>
                    {item.value}
                </Text>
                <Text style={[
                   styles.growthText,
                   { color: item.growth.startsWith('+') ? theme.colors.semantic.success : theme.colors.semantic.error }
                 ]}>
                   {item.growth}
                 </Text>
            </View>
            {item.nextAction && (
              <View style={[styles.actionTag, { backgroundColor: theme.colors.semantic.warning + '15' }]}>
                <MaterialCommunityIcons name="alert-circle-outline" size={14} color={theme.colors.semantic.warning} />
                <Text style={[styles.actionText, { color: theme.colors.semantic.warning }]}>
                  {item.nextAction}
                </Text>
              </View>
            )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}>
      <StatusBar barStyle="light-content" />

      {/* ANIMATED HEADER WITH MEMBER FILTER */}
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeight,
            backgroundColor: theme.colors.brand.primary,
            paddingTop: insets.top
          }
        ]}
      >
        {/* Pattern Background Overlay */}
        <View style={styles.patternOverlay}>
          <MaterialCommunityIcons name="finance" size={300} color="#FFFFFF08" style={{ position: 'absolute', right: -50, top: -30 }} />
        </View>

        <View style={styles.headerContent}>
          {/* Nav Bar */}
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Family Assets</Text>
            <TouchableOpacity style={styles.addButton}>
              <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Member Filter Section */}
          <View style={styles.filterSection}>
            {renderMemberFilter()}
          </View>

          {/* Total Value for Selected Member (Fades on scroll) */}
          <Animated.View style={[styles.totalValueContainer, { opacity: netWorthOpacity }]}>
            <Text style={styles.totalLabel}>
              {selectedMember === 'all' ? 'Family Net Worth' : `${getMemberDetails(selectedMember)?.name}'s Net Worth`}
            </Text>
            <Text style={styles.totalValue}>{calculateNetWorth()}</Text>
            <View style={styles.trendIndicator}>
              <MaterialCommunityIcons name="trending-up" size={16} color="#4ADE80" />
              <Text style={styles.trendText}>+14% this year</Text>
            </View>
          </Animated.View>
        </View>
      </Animated.View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset, index) => renderAssetCard(asset, index))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="package-variant" size={60} color={theme.colors.utility.secondaryText + '50'} />
            <Text style={[styles.emptyText, { color: theme.colors.utility.secondaryText }]}>
              No assets found for this member
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: theme.colors.brand.primary, bottom: insets.bottom + 20 }
        ]}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="microphone" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    overflow: 'hidden',
    borderBottomRightRadius: 32,
    borderBottomLeftRadius: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 10,
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  addButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  filterSection: {
    marginBottom: 16,
  },
  memberFilterScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
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
  memberName: {
    fontWeight: '600',
    fontSize: 13,
  },
  totalValueContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  totalLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalValue: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '700',
    marginTop: 4,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    marginTop: 8,
  },
  trendText: {
    color: '#4ADE80',
    fontSize: 13,
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
    gap: 16,
  },
  assetCard: {
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    paddingRight: 10,
    borderRadius: 14,
    gap: 6,
  },
  ownerAvatarTiny: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  ownerName: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    gap: 4,
  },
  assetTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  assetLocation: {
    fontSize: 13,
    opacity: 0.6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  assetValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  growthText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
