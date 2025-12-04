// src/features/documents/screens/DocumentsVaultScreen.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { Text } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// --- MOCK DATA ---
const FAMILY_MEMBERS = [
  { id: 'all', name: 'All', avatar: null, icon: 'all-inclusive' },
  { id: 'dad', name: 'Kamal', avatar: 'https://i.pravatar.cc/150?u=dad' },
  { id: 'mom', name: 'Priya', avatar: 'https://i.pravatar.cc/150?u=mom' },
  { id: 'kid1', name: 'Arjun', avatar: 'https://i.pravatar.cc/150?u=arjun' },
  { id: 'joint', name: 'Joint', avatar: null, icon: 'account-group' },
];

const SMART_FOLDERS = [
  { id: '1', name: 'Identity', count: 12, icon: 'card-account-details', color: '#3B82F6', ownerId: 'all' },
  { id: '2', name: 'Property', count: 4, icon: 'home-city', color: '#F59E0B', ownerId: 'joint' },
  { id: '3', name: 'Finance', count: 28, icon: 'bank', color: '#10B981', ownerId: 'all' },
  { id: '4', name: 'Insurance', count: 8, icon: 'shield-check', color: '#8B5CF6', ownerId: 'dad' },
  { id: '5', name: 'Vehicle', count: 5, icon: 'car', color: '#EF4444', ownerId: 'dad' },
  { id: '6', name: 'Education', count: 15, icon: 'school', color: '#EC4899', ownerId: 'kid1' },
  { id: '7', name: 'Medical', count: 22, icon: 'medical-bag', color: '#06B6D4', ownerId: 'all' },
  { id: '8', name: 'Certificates', count: 9, icon: 'certificate', color: '#84CC16', ownerId: 'all' },
];

const RECENT_FILES = [
  { id: '1', name: 'Aadhaar_Kamal.pdf', date: '2 hrs ago', type: 'pdf', ownerId: 'dad', folder: 'Identity' },
  { id: '2', name: 'Car_Insurance_Policy.pdf', date: 'Yesterday', type: 'pdf', ownerId: 'dad', folder: 'Insurance' },
  { id: '3', name: 'Property_Tax_2024.jpg', date: 'Oct 20', type: 'image', ownerId: 'joint', folder: 'Property' },
  { id: '4', name: 'Arjun_School_Fee.pdf', date: 'Oct 15', type: 'pdf', ownerId: 'kid1', folder: 'Education' },
  { id: '5', name: 'Priya_Passport.pdf', date: 'Oct 10', type: 'pdf', ownerId: 'mom', folder: 'Identity' },
  { id: '6', name: 'Home_Loan_Statement.pdf', date: 'Oct 5', type: 'pdf', ownerId: 'joint', folder: 'Finance' },
];

// Folder Card Component with Animation
const FolderCard = ({ item, theme, index }: any) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 80;
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Animated.View style={{ opacity: opacityAnim, transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.folderCard,
          { backgroundColor: theme.colors.utility.secondaryBackground }
        ]}
      >
        {/* Colored Tab at Top */}
        <View style={[styles.folderTab, { backgroundColor: item.color }]} />

        {/* Folder Layer Effect (Behind) */}
        <View style={[styles.folderLayerBack, { backgroundColor: item.color + '20' }]} />

        <View style={styles.folderContent}>
          <View style={[styles.folderIcon, { backgroundColor: item.color + '15' }]}>
            <MaterialCommunityIcons name={item.icon} size={26} color={item.color} />
          </View>
          <Text style={[styles.folderName, { color: theme.colors.utility.primaryText }]}>
            {item.name}
          </Text>
          <Text style={[styles.folderCount, { color: theme.colors.utility.secondaryText }]}>
            {item.count} files
          </Text>
        </View>

        {/* Corner Fold Effect */}
        <View style={[styles.cornerFold, { borderTopColor: item.color + '30' }]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export const DocumentsVaultScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedMember, setSelectedMember] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Entrance animation
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  // Filter Logic
  const filteredFolders = selectedMember === 'all'
    ? SMART_FOLDERS
    : SMART_FOLDERS.filter(f => f.ownerId === selectedMember || f.ownerId === 'all');

  const filteredFiles = selectedMember === 'all'
    ? RECENT_FILES
    : RECENT_FILES.filter(f => f.ownerId === selectedMember || f.ownerId === 'joint');

  const getMemberDetails = (id: string) => FAMILY_MEMBERS.find(m => m.id === id);

  // Calculate storage stats
  const totalFiles = SMART_FOLDERS.reduce((sum, f) => sum + f.count, 0);

  const renderRecentFile = (file: typeof RECENT_FILES[0], index: number) => {
    const owner = getMemberDetails(file.ownerId);
    const isImage = file.type === 'image';

    return (
      <TouchableOpacity
        key={file.id}
        style={[styles.fileRow, { borderBottomColor: theme.colors.utility.secondaryText + '10' }]}
        activeOpacity={0.7}
      >
        <View style={[styles.fileIconBox, { backgroundColor: isImage ? '#3B82F615' : '#FF525215' }]}>
          <MaterialCommunityIcons
            name={isImage ? 'file-image' : 'file-pdf-box'}
            size={24}
            color={isImage ? '#3B82F6' : '#FF5252'}
          />
        </View>
        <View style={styles.fileInfo}>
          <Text style={[styles.fileName, { color: theme.colors.utility.primaryText }]} numberOfLines={1}>
            {file.name}
          </Text>
          <View style={styles.fileMeta}>
            <Text style={[styles.fileDate, { color: theme.colors.utility.secondaryText }]}>{file.date}</Text>
            <View style={[styles.folderBadge, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
              <MaterialCommunityIcons name="folder" size={10} color={theme.colors.utility.secondaryText} />
              <Text style={[styles.folderBadgeText, { color: theme.colors.utility.secondaryText }]}>{file.folder}</Text>
            </View>
            {owner?.avatar && (
              <Image source={{ uri: owner.avatar }} style={styles.tinyAvatar} />
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MaterialCommunityIcons name="dots-vertical" size={20} color={theme.colors.utility.secondaryText} />
        </TouchableOpacity>
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
          {
            backgroundColor: theme.colors.brand.primary,
            paddingTop: insets.top,
            opacity: headerAnim,
            transform: [{
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0]
              })
            }]
          }
        ]}
      >
        {/* Pattern Background */}
        <View style={styles.patternOverlay}>
          <MaterialCommunityIcons name="file-cabinet" size={200} color="#FFFFFF08" style={{ position: 'absolute', right: -30, top: -20 }} />
        </View>

        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Documents</Text>
          <TouchableOpacity style={styles.searchButton} onPress={() => setShowSearch(!showSearch)}>
            <MaterialCommunityIcons name={showSearch ? 'close' : 'magnify'} size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Storage Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalFiles}</Text>
            <Text style={styles.statLabel}>Total Files</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{SMART_FOLDERS.length}</Text>
            <Text style={styles.statLabel}>Folders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2.4</Text>
            <Text style={styles.statLabel}>GB Used</Text>
          </View>
        </View>

        {/* Member Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
          {FAMILY_MEMBERS.map((member) => {
            const isSelected = selectedMember === member.id;
            return (
              <TouchableOpacity
                key={member.id}
                style={[
                  styles.filterChip,
                  isSelected ? { backgroundColor: '#FFF' } : { backgroundColor: 'rgba(255,255,255,0.15)' }
                ]}
                onPress={() => setSelectedMember(member.id)}
                activeOpacity={0.8}
              >
                {member.avatar ? (
                  <Image source={{ uri: member.avatar }} style={styles.filterAvatar} />
                ) : (
                  <View style={[styles.filterIconContainer, { backgroundColor: isSelected ? theme.colors.brand.primary + '20' : 'rgba(255,255,255,0.2)' }]}>
                    <MaterialCommunityIcons
                      name={(member.icon || 'all-inclusive') as any}
                      size={12}
                      color={isSelected ? theme.colors.brand.primary : '#FFF'}
                    />
                  </View>
                )}
                <Text style={[
                  styles.filterName,
                  { color: isSelected ? theme.colors.brand.primary : '#FFF' }
                ]}>
                  {member.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar (Collapsible) */}
        {showSearch && (
          <View style={[styles.searchBar, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
            <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.utility.secondaryText} />
            <TextInput
              placeholder="Search files and folders..."
              placeholderTextColor={theme.colors.utility.secondaryText}
              style={[styles.searchInput, { color: theme.colors.utility.primaryText }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialCommunityIcons name="close-circle" size={18} color={theme.colors.utility.secondaryText} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Smart Folders Grid */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>Smart Folders</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="plus-circle-outline" size={22} color={theme.colors.brand.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {filteredFolders.map((folder, index) => (
            <View key={folder.id} style={styles.gridItem}>
              <FolderCard item={folder} theme={theme} index={index} />
            </View>
          ))}
        </View>

        {/* Recent Files List */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>Recently Added</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: theme.colors.brand.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.recentList, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file, index) => renderRecentFile(file, index))
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="file-search-outline" size={40} color={theme.colors.utility.secondaryText + '50'} />
                <Text style={[styles.emptyText, { color: theme.colors.utility.secondaryText }]}>
                  No recent files for this member
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.brand.primary, bottom: insets.bottom + 20 }]}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="upload" size={26} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingBottom: 20,
    borderBottomRightRadius: 32,
    borderBottomLeftRadius: 32,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  searchButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  filterContainer: {
    paddingHorizontal: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    gap: 6,
  },
  filterAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  filterIconContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterName: {
    fontWeight: '600',
    fontSize: 13,
  },
  content: {
    padding: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 20,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 24,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  folderCard: {
    borderRadius: 18,
    padding: 16,
    height: 130,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  folderTab: {
    position: 'absolute',
    top: 0,
    left: 16,
    width: 36,
    height: 6,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  folderLayerBack: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: 14,
    transform: [{ rotate: '2deg' }],
    zIndex: -1,
  },
  folderContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  folderIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderName: {
    fontSize: 15,
    fontWeight: '700',
  },
  folderCount: {
    fontSize: 12,
  },
  cornerFold: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderRightWidth: 20,
    borderTopWidth: 20,
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
  },
  recentSection: {
    marginTop: 8,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  recentList: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 14,
  },
  fileIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  fileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fileDate: {
    fontSize: 12,
  },
  folderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  folderBadgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  tinyAvatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  moreButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
