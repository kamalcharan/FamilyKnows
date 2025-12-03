// src/features/assets/screens/AssetsHubScreen.tsx
import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { Text } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- MOCK DATA ---
const ASSET_CATEGORIES = ['All', 'Real Estate', 'Vehicle', 'Gold', 'Crypto'];

const MY_ASSETS = [
  {
    id: '1',
    title: 'Dream Home',
    type: 'Real Estate',
    value: '₹1.2 Cr',
    growth: '+12%',
    icon: 'home-city',
    color: '#4F46E5', // Indigo
    location: 'Bangalore, KA',
    nextAction: 'Tax Due in 20 days',
  },
  {
    id: '2',
    title: 'Tata Safari',
    type: 'Vehicle',
    value: '₹18.5 L',
    growth: '-8%',
    icon: 'car-suv',
    color: '#059669', // Emerald
    location: 'KA-01-MJ-1234',
    nextAction: 'Insurance Expiring',
  },
  {
    id: '3',
    title: 'SGB Bonds',
    type: 'Gold',
    value: '₹5.4 L',
    growth: '+22%',
    icon: 'gold',
    color: '#D97706', // Amber
    location: 'Digital Vault',
    nextAction: 'Maturity: 2028',
  },
];

export const AssetsHubScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  // Animations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [280, 120], // Shrinks from 280 to 120
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const netWorthOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const renderAssetCard = (item: any, index: number) => {
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.9}
        style={[
          styles.assetCard,
          {
            backgroundColor: theme.colors.utility.secondaryBackground,
            marginTop: index === 0 ? 0 : 16
          }
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
            <MaterialCommunityIcons name={item.icon} size={28} color={item.color} />
          </View>
          <View style={styles.badgeContainer}>
             <Text style={[
               styles.growthText,
               { color: item.growth.startsWith('+') ? theme.colors.semantic.success : theme.colors.semantic.error }
             ]}>
               {item.growth}
             </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
            <Text style={[styles.assetTitle, { color: theme.colors.utility.primaryText }]}>
                {item.title}
            </Text>
            <Text style={[styles.assetSubtitle, { color: theme.colors.utility.secondaryText }]}>
                {item.location}
            </Text>
            <View style={[styles.divider, { backgroundColor: theme.colors.utility.secondaryText + '15' }]} />
            <View style={styles.cardFooter}>
                <Text style={[styles.assetValue, { color: theme.colors.utility.primaryText }]}>
                    {item.value}
                </Text>
                {item.nextAction && (
                    <View style={[styles.actionTag, { backgroundColor: theme.colors.brand.primary + '10' }]}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={12} color={theme.colors.brand.primary} />
                        <Text style={[styles.actionText, { color: theme.colors.brand.primary }]}>
                            {item.nextAction}
                        </Text>
                    </View>
                )}
            </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}>
      <StatusBar barStyle="light-content" />

      {/* ANIMATED HEADER */}
      <Animated.View
        style={[
            styles.header,
            {
                height: headerHeight,
                backgroundColor: theme.colors.brand.primary
            }
        ]}
      >
        {/* Pattern Background Overlay */}
        <View style={styles.patternOverlay}>
            <MaterialCommunityIcons name="finance" size={300} color="#FFFFFF10" style={{ position: 'absolute', right: -50, top: -50 }} />
        </View>

        <View style={[styles.headerContent, { paddingTop: insets.top + 10 }]}>
            {/* Nav Bar */}
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
                <Animated.Text style={[styles.headerTitle, { transform: [{ scale: titleScale }] }]}>
                    My Assets
                </Animated.Text>
                <TouchableOpacity style={styles.addButton}>
                    <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* Net Worth Section (Fades out on scroll) */}
            <Animated.View style={[styles.netWorthSection, { opacity: netWorthOpacity }]}>
                <Text style={styles.netWorthLabel}>Net Worth</Text>
                <Text style={styles.netWorthValue}>₹1,43,90,000</Text>
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
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
        )}
      >
        {/* Categories Horizontal Scroll */}
        <View style={styles.categoryContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20 }}>
                {ASSET_CATEGORIES.map((cat, index) => (
                    <TouchableOpacity
                        key={cat}
                        style={[
                            styles.categoryChip,
                            {
                                backgroundColor: index === 0 ? theme.colors.brand.primary : theme.colors.utility.secondaryBackground,
                                marginRight: 10,
                            }
                        ]}
                    >
                        <Text style={{
                            color: index === 0 ? '#FFF' : theme.colors.utility.secondaryText,
                            fontWeight: '600'
                        }}>
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

        {/* Assets List */}
        <View style={styles.listContainer}>
            {MY_ASSETS.map((asset, index) => renderAssetCard(asset, index))}
        </View>
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
    width: '100%',
    overflow: 'hidden',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 10,
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6,
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  netWorthSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  netWorthLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  netWorthValue: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFF',
    marginVertical: 4,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  trendText: {
    color: '#4ADE80',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  categoryChip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  assetCard: {
    borderRadius: 24,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    justifyContent: 'flex-start',
  },
  growthText: {
    fontWeight: '700',
    fontSize: 14,
  },
  cardBody: {
    gap: 4,
  },
  assetTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  assetSubtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  actionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
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
