// src/features/assets/screens/AssetDetailScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
  StatusBar,
  Modal,
  TextInput,
  FlatList,
  Animated,
  Easing,
} from 'react-native';
import { Text, Button, Divider } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Svg, { Circle, Line, Defs, RadialGradient, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- MOCK DATA ---
const TRUSTED_PEOPLE = [
  { id: '1', name: 'Priya', role: 'Co-Owner', avatar: 'https://i.pravatar.cc/150?u=priya', type: 'family' },
  { id: '2', name: 'Adv. Mehta', role: 'Legal', icon: 'scale-balance', color: '#F59E0B', type: 'pro' },
  { id: '3', name: 'Rajan', role: 'Tenant', avatar: 'https://i.pravatar.cc/150?u=rajan', type: 'tenant' },
];

const MARKETPLACE_RESULTS = [
  { id: 'm1', name: 'LegalEase Assoc.', rating: 4.8, role: 'Property Lawyer', verified: true, image: 'https://i.pravatar.cc/150?u=legal' },
  { id: 'm2', name: 'SafeGuard Insure', rating: 4.6, role: 'Insurance Agent', verified: true, image: 'https://i.pravatar.cc/150?u=insure' },
  { id: 'm3', name: 'Dr. House Fix', rating: 4.5, role: 'Maintenance', verified: false, image: 'https://i.pravatar.cc/150?u=fix' },
  { id: 'm4', name: 'ValueMax Appraisers', rating: 4.9, role: 'Property Valuation', verified: true, image: 'https://i.pravatar.cc/150?u=value' },
];

const LINKED_DOCUMENTS = [
  { id: 'd1', name: 'Sale_Deed_Final.pdf', type: 'pdf', date: '12 Jan 2023', size: '2.4 MB' },
  { id: 'd2', name: 'Property_Tax_2024.pdf', type: 'pdf', date: '15 Mar 2024', size: '890 KB' },
  { id: 'd3', name: 'Insurance_Policy.pdf', type: 'pdf', date: '08 Apr 2024', size: '1.2 MB' },
];

const MOCK_ASSETS = [
  {
    id: '1',
    title: 'Dream Home',
    value: '₹1.2 Cr',
    location: 'Indiranagar, Bangalore',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    type: 'property',
    roi: '+12.5%',
    nextDue: 'Oct 15',
    dueType: 'Tax Payment',
  },
  {
    id: '2',
    title: 'Tesla Model S',
    value: '₹85 L',
    location: 'Garage - Dream Home',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    type: 'vehicle',
    roi: '-8.2%',
    nextDue: 'Nov 1',
    dueType: 'Insurance Renewal',
  },
];

// --- COMPONENTS ---

interface TrustOrbProps {
  item: any;
  angle: number;
  radius: number;
  theme: any;
  index: number;
}

const TrustOrb: React.FC<TrustOrbProps> = ({ item, angle, radius, theme, index }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 40,
      delay: index * 100,
      useNativeDriver: true,
    }).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 2000 + index * 200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 5,
          duration: 2000 + index * 200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const radian = (angle * Math.PI) / 180;
  const x = (SCREEN_WIDTH - 40) / 2 + radius * Math.cos(radian) - 24;
  const y = 100 + radius * Math.sin(radian) - 24;

  return (
    <Animated.View
      style={[
        styles.orbContainer,
        {
          left: x,
          top: y,
          transform: [
            { scale: scaleAnim },
            { translateY: floatAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.8}>
        <View style={[styles.orb, { borderColor: theme.colors.utility.primaryBackground }]}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.orbImage} />
          ) : (
            <View style={[styles.orbIcon, { backgroundColor: item.color || '#666' }]}>
              <MaterialCommunityIcons name={item.icon} size={20} color="#FFF" />
            </View>
          )}
        </View>
        <View style={[styles.orbBadge, { backgroundColor: theme.colors.utility.primaryBackground }]}>
          <Text style={[styles.orbRole, { color: theme.colors.utility.primaryText }]}>{item.role}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const AssetDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: { assetId?: string } }, 'params'>>();
  const insets = useSafeAreaInsets();

  const [showTrustModal, setShowTrustModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'network' | 'marketplace'>('network');
  const [searchQuery, setSearchQuery] = useState('');
  const [trustedPeople, setTrustedPeople] = useState(TRUSTED_PEOPLE);

  // Animation refs
  const scrollY = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Get asset data
  const assetId = route.params?.assetId || '1';
  const asset = MOCK_ASSETS.find(a => a.id === assetId) || MOCK_ASSETS[0];

  useEffect(() => {
    // Pulse animation for center icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'property': return 'home';
      case 'vehicle': return 'car-sports';
      case 'jewelry': return 'diamond-stone';
      case 'investment': return 'chart-line';
      default: return 'package-variant';
    }
  };

  const handleAddTrust = (professional: any) => {
    const newTrust = {
      id: professional.id,
      name: professional.name,
      role: professional.role,
      avatar: professional.image,
      type: 'pro',
    };
    setTrustedPeople([...trustedPeople, newTrust]);
    setShowTrustModal(false);
  };

  const renderMarketplaceItem = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.marketCard, { backgroundColor: theme.colors.utility.secondaryBackground }]}
      onPress={() => handleAddTrust(item)}
    >
      <Image source={{ uri: item.image }} style={styles.marketImage} />
      <View style={styles.marketInfo}>
        <View style={styles.marketHeader}>
          <Text style={[styles.marketName, { color: theme.colors.utility.primaryText }]}>{item.name}</Text>
          {item.verified && <MaterialCommunityIcons name="check-decagram" size={16} color="#3B82F6" />}
        </View>
        <Text style={[styles.marketRole, { color: theme.colors.utility.secondaryText }]}>{item.role}</Text>
        <View style={styles.ratingRow}>
          <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
          <Text style={[styles.ratingText, { color: theme.colors.utility.primaryText }]}>{item.rating}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.colors.brand.primary + '15' }]}
        onPress={() => handleAddTrust(item)}
      >
        <Text style={[styles.addButtonText, { color: theme.colors.brand.primary }]}>Connect</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderNetworkItem = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.networkCard, { backgroundColor: theme.colors.utility.secondaryBackground }]}
    >
      <Image
        source={{ uri: item.avatar || `https://i.pravatar.cc/150?u=${item.id}` }}
        style={styles.networkImage}
      />
      <View style={styles.networkInfo}>
        <Text style={[styles.networkName, { color: theme.colors.utility.primaryText }]}>{item.name}</Text>
        <Text style={[styles.networkRole, { color: theme.colors.utility.secondaryText }]}>{item.relation || 'Family'}</Text>
      </View>
      <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.brand.primary + '15' }]}>
        <Text style={[styles.addButtonText, { color: theme.colors.brand.primary }]}>Add</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const FAMILY_NETWORK = [
    { id: 'f1', name: 'Mom', relation: 'Parent', avatar: 'https://i.pravatar.cc/150?u=mom' },
    { id: 'f2', name: 'Dad', relation: 'Parent', avatar: 'https://i.pravatar.cc/150?u=dad' },
    { id: 'f3', name: 'Brother', relation: 'Sibling', avatar: 'https://i.pravatar.cc/150?u=brother' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}>
      <StatusBar barStyle="light-content" />

      {/* Sticky Header Bar */}
      <Animated.View
        style={[
          styles.stickyHeader,
          {
            backgroundColor: theme.colors.utility.primaryBackground,
            opacity: headerOpacity,
            paddingTop: insets.top,
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.stickyBackButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.utility.primaryText} />
        </TouchableOpacity>
        <Text style={[styles.stickyTitle, { color: theme.colors.utility.primaryText }]}>{asset.title}</Text>
        <TouchableOpacity style={styles.stickyEditButton}>
          <MaterialCommunityIcons name="pencil" size={20} color={theme.colors.utility.primaryText} />
        </TouchableOpacity>
      </Animated.View>

      {/* 1. ASSET HEADER (Parallax) */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <ImageBackground source={{ uri: asset.image }} style={styles.headerImage}>
          <View style={styles.headerOverlay}>
            <View style={[styles.headerTop, { marginTop: insets.top }]}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton}>
                <MaterialCommunityIcons name="pencil" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.headerContent}>
              <Text style={styles.assetTitle}>{asset.title}</Text>
              <Text style={styles.assetLocation}>
                <MaterialCommunityIcons name="map-marker" size={14} color="#FFF" /> {asset.location}
              </Text>
              <Text style={styles.assetValue}>{asset.value}</Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.contentContainer}>
          {/* 2. CIRCLE OF TRUST (Orbit View) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>Circle of Trust</Text>
              <TouchableOpacity onPress={() => setShowTrustModal(true)}>
                <Text style={[styles.linkText, { color: theme.colors.brand.primary }]}>+ Add Trust</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.orbitWrapper}>
              {/* Background Glow */}
              <View style={[styles.orbitGlow, { backgroundColor: theme.colors.brand.primary + '10' }]} />

              {/* Orbit Rings */}
              <View style={[styles.orbitRing, { borderColor: theme.colors.utility.secondaryText + '20', width: 200, height: 200 }]} />
              <View style={[styles.orbitRing, { borderColor: theme.colors.utility.secondaryText + '10', width: 280, height: 280 }]} />

              {/* SVG Connection Lines */}
              <Svg height={240} width={SCREEN_WIDTH - 40} style={StyleSheet.absoluteFill}>
                {trustedPeople.map((person, index) => {
                  const angle = index * (360 / trustedPeople.length) - 90;
                  const radian = (angle * Math.PI) / 180;
                  const x = (SCREEN_WIDTH - 40) / 2 + 100 * Math.cos(radian);
                  const y = 120 + 100 * Math.sin(radian);
                  return (
                    <Line
                      key={person.id}
                      x1={(SCREEN_WIDTH - 40) / 2}
                      y1={120}
                      x2={x}
                      y2={y}
                      stroke={theme.colors.brand.primary}
                      strokeWidth="1"
                      strokeDasharray="4, 4"
                      opacity={0.4}
                    />
                  );
                })}
              </Svg>

              {/* Center Asset Icon */}
              <Animated.View
                style={[
                  styles.centerIcon,
                  {
                    backgroundColor: theme.colors.utility.secondaryBackground,
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                <MaterialCommunityIcons name={getAssetIcon(asset.type)} size={32} color={theme.colors.brand.primary} />
              </Animated.View>

              {/* Orbiting Nodes */}
              {trustedPeople.map((person, index) => (
                <TrustOrb
                  key={person.id}
                  item={person}
                  radius={100}
                  angle={index * (360 / trustedPeople.length) - 90}
                  theme={theme}
                  index={index}
                />
              ))}
            </View>

            <Text style={[styles.trustCount, { color: theme.colors.utility.secondaryText }]}>
              {trustedPeople.length} trusted people have access
            </Text>
          </View>

          {/* 3. QUICK STATS */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
              <MaterialCommunityIcons
                name="trending-up"
                size={24}
                color={asset.roi.startsWith('+') ? '#10B981' : '#EF4444'}
              />
              <Text style={[styles.statLabel, { color: theme.colors.utility.secondaryText }]}>ROI (YTD)</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: asset.roi.startsWith('+') ? '#10B981' : '#EF4444' },
                ]}
              >
                {asset.roi}
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
              <MaterialCommunityIcons name="calendar-clock" size={24} color={theme.colors.brand.primary} />
              <Text style={[styles.statLabel, { color: theme.colors.utility.secondaryText }]}>{asset.dueType}</Text>
              <Text style={[styles.statValue, { color: theme.colors.brand.primary }]}>{asset.nextDue}</Text>
            </View>
          </View>

          {/* 4. LINKED DOCUMENTS */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>Linked Documents</Text>
              <TouchableOpacity>
                <Text style={[styles.linkText, { color: theme.colors.brand.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>

            {LINKED_DOCUMENTS.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                style={[styles.docCard, { backgroundColor: theme.colors.utility.secondaryBackground }]}
              >
                <MaterialCommunityIcons name="file-pdf-box" size={32} color="#EF4444" />
                <View style={styles.docInfo}>
                  <Text style={[styles.docName, { color: theme.colors.utility.primaryText }]}>{doc.name}</Text>
                  <Text style={[styles.docMeta, { color: theme.colors.utility.secondaryText }]}>
                    {doc.date} • {doc.size}
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.utility.secondaryText} />
              </TouchableOpacity>
            ))}
          </View>

          {/* 5. ACTIVITY TIMELINE */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>Recent Activity</Text>

            <View style={styles.timeline}>
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: '#10B981' }]} />
                <View style={[styles.timelineContent, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
                  <Text style={[styles.timelineTitle, { color: theme.colors.utility.primaryText }]}>
                    Property tax paid
                  </Text>
                  <Text style={[styles.timelineDate, { color: theme.colors.utility.secondaryText }]}>2 days ago</Text>
                </View>
              </View>

              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: '#3B82F6' }]} />
                <View style={[styles.timelineContent, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
                  <Text style={[styles.timelineTitle, { color: theme.colors.utility.primaryText }]}>
                    Adv. Mehta added to trust
                  </Text>
                  <Text style={[styles.timelineDate, { color: theme.colors.utility.secondaryText }]}>1 week ago</Text>
                </View>
              </View>

              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: '#F59E0B' }]} />
                <View style={[styles.timelineContent, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
                  <Text style={[styles.timelineTitle, { color: theme.colors.utility.primaryText }]}>
                    Insurance renewed
                  </Text>
                  <Text style={[styles.timelineDate, { color: theme.colors.utility.secondaryText }]}>2 weeks ago</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </Animated.ScrollView>

      {/* --- ADD TRUST / MARKETPLACE MODAL --- */}
      <Modal
        visible={showTrustModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTrustModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.utility.primaryBackground }]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.utility.secondaryText + '20' }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.utility.primaryText }]}>Add to Circle of Trust</Text>
            <TouchableOpacity onPress={() => setShowTrustModal(false)} style={styles.closeButton}>
              <Text style={{ color: theme.colors.brand.primary, fontWeight: '600' }}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'network' && { borderBottomColor: theme.colors.brand.primary, borderBottomWidth: 2 },
              ]}
              onPress={() => setActiveTab('network')}
            >
              <MaterialCommunityIcons
                name="account-group"
                size={20}
                color={activeTab === 'network' ? theme.colors.brand.primary : theme.colors.utility.secondaryText}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'network' ? theme.colors.brand.primary : theme.colors.utility.secondaryText },
                ]}
              >
                My Network
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'marketplace' && { borderBottomColor: theme.colors.brand.primary, borderBottomWidth: 2 },
              ]}
              onPress={() => setActiveTab('marketplace')}
            >
              <MaterialCommunityIcons
                name="storefront-outline"
                size={20}
                color={activeTab === 'marketplace' ? theme.colors.brand.primary : theme.colors.utility.secondaryText}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'marketplace' ? theme.colors.brand.primary : theme.colors.utility.secondaryText },
                ]}
              >
                Find Pro
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={[styles.searchBar, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
            <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.utility.secondaryText} />
            <TextInput
              placeholder={activeTab === 'network' ? 'Search family & friends...' : 'Search services (e.g. Lawyer)...'}
              placeholderTextColor={theme.colors.utility.secondaryText}
              style={[styles.searchInput, { color: theme.colors.utility.primaryText }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialCommunityIcons name="close-circle" size={18} color={theme.colors.utility.secondaryText} />
              </TouchableOpacity>
            )}
          </View>

          {/* Content */}
          {activeTab === 'network' ? (
            <FlatList
              data={FAMILY_NETWORK}
              keyExtractor={(item) => item.id}
              renderItem={renderNetworkItem}
              contentContainerStyle={{ padding: 20 }}
              ListHeaderComponent={() => (
                <Text style={[styles.listHeader, { color: theme.colors.utility.secondaryText }]}>
                  Family Members
                </Text>
              )}
              ListEmptyComponent={() => (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons
                    name="account-group-outline"
                    size={48}
                    color={theme.colors.utility.secondaryText + '50'}
                  />
                  <Text style={[styles.emptyText, { color: theme.colors.utility.secondaryText }]}>
                    No contacts found
                  </Text>
                </View>
              )}
            />
          ) : (
            <FlatList
              data={MARKETPLACE_RESULTS.filter(
                (item) =>
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.role.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              keyExtractor={(item) => item.id}
              renderItem={renderMarketplaceItem}
              contentContainerStyle={{ padding: 20 }}
              ListHeaderComponent={() => (
                <Text style={[styles.listHeader, { color: theme.colors.utility.secondaryText }]}>
                  Verified Professionals near {asset.location.split(',')[0]}
                </Text>
              )}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Sticky Header
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  stickyBackButton: { padding: 8 },
  stickyTitle: { fontSize: 18, fontWeight: '600' },
  stickyEditButton: { padding: 8 },

  // Header
  headerImage: { width: '100%', height: 300 },
  headerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'space-between', paddingBottom: 30 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: { paddingHorizontal: 20 },
  assetTitle: { fontSize: 32, fontWeight: '800', color: '#FFF', letterSpacing: -0.5 },
  assetLocation: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  assetValue: { fontSize: 28, fontWeight: '700', color: '#4ADE80', marginTop: 12 },

  scrollContent: { paddingBottom: 20 },
  contentContainer: { padding: 20, marginTop: -20, borderTopLeftRadius: 24, borderTopRightRadius: 24 },

  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  linkText: { fontSize: 14, fontWeight: '600' },

  // Orbit Styles
  orbitWrapper: { height: 260, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  orbitGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  orbitRing: { position: 'absolute', borderRadius: 200, borderWidth: 1, borderStyle: 'dashed' },
  centerIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 10,
  },
  orbContainer: { position: 'absolute', alignItems: 'center', width: 48, zIndex: 5 },
  orb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  orbImage: { width: '100%', height: '100%' },
  orbIcon: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  orbBadge: {
    position: 'absolute',
    bottom: -12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orbRole: { fontSize: 10, fontWeight: '700' },
  trustCount: { textAlign: 'center', fontSize: 13, marginTop: 8 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statLabel: { fontSize: 12, marginTop: 8, marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: '700' },

  // Docs
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  docInfo: { flex: 1, marginLeft: 12 },
  docName: { fontSize: 14, fontWeight: '600' },
  docMeta: { fontSize: 12, marginTop: 2 },

  // Timeline
  timeline: { gap: 12 },
  timelineItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timelineDot: { width: 12, height: 12, borderRadius: 6 },
  timelineContent: { flex: 1, padding: 12, borderRadius: 10 },
  timelineTitle: { fontSize: 14, fontWeight: '500' },
  timelineDate: { fontSize: 12, marginTop: 2 },

  // Modal Styles
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  closeButton: { padding: 4 },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  tabText: { fontSize: 14, fontWeight: '600' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: { flex: 1, fontSize: 16 },
  listHeader: { fontSize: 12, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '600' },

  // Market Styles
  marketCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  marketImage: { width: 56, height: 56, borderRadius: 12, marginRight: 14 },
  marketInfo: { flex: 1 },
  marketHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  marketName: { fontSize: 16, fontWeight: '600' },
  marketRole: { fontSize: 13, marginTop: 2, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, fontWeight: '600' },
  addButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addButtonText: { fontSize: 13, fontWeight: '600' },

  // Network Styles
  networkCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: 'center',
  },
  networkImage: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  networkInfo: { flex: 1 },
  networkName: { fontSize: 16, fontWeight: '600' },
  networkRole: { fontSize: 13, marginTop: 2 },

  emptyState: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 14 },
});
