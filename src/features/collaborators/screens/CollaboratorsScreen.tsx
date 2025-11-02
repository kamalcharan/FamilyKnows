// src/features/collaborators/screens/CollaboratorsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useWorkspace } from '../../../contexts/WorkspaceContext';
import { ServiceProvider, ServiceProviderCategory } from '../../../types/collaborators';
import { dummyServiceProviders, categoryData } from '../../../dummydata';
import { ServiceProviderCard } from '../components/ServiceProviderCard';

type TabType = 'family' | 'providers';

export const CollaboratorsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { activeWorkspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState<TabType>('providers');
  const [selectedCategory, setSelectedCategory] = useState<ServiceProviderCategory | 'all'>('all');

  const filteredProviders =
    selectedCategory === 'all'
      ? dummyServiceProviders
      : dummyServiceProviders.filter((p) => p.category === selectedCategory);

  const renderFamilyTab = () => {
    const members = activeWorkspace?.members || [];

    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.utility.primaryText }]}>
            👨‍👩‍👧‍👦 FAMILY MEMBERS ({members.length})
          </Text>

          {members.map((member) => (
            <View
              key={member.id}
              style={[styles.memberCard, { backgroundColor: theme.colors.utility.secondaryBackground }]}
            >
              <View style={styles.memberInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {member.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.memberDetails}>
                  <Text style={[styles.memberName, { color: theme.colors.utility.primaryText }]}>
                    {member.name}
                  </Text>
                  <Text style={[styles.memberEmail, { color: theme.colors.utility.secondaryText }]}>
                    {member.email}
                  </Text>
                  {member.phone && (
                    <Text style={[styles.memberPhone, { color: theme.colors.utility.secondaryText }]}>
                      📞 {member.phone}
                    </Text>
                  )}
                </View>
              </View>
              <View style={[styles.roleBadge, { backgroundColor: theme.colors.accent.accent1 }]}>
                <Text style={styles.roleText}>{member.role}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.addButton, { borderColor: theme.colors.brand.primary }]}
          >
            <Text style={[styles.addButtonText, { color: theme.colors.brand.primary }]}>
              + Invite Family Member
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderProvidersTab = () => {
    return (
      <View style={styles.tabContent}>
        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          <TouchableOpacity
            style={[
              styles.categoryChip,
              selectedCategory === 'all' && { backgroundColor: theme.colors.brand.primary },
              { borderColor: theme.colors.brand.primary },
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === 'all'
                  ? { color: '#FFFFFF' }
                  : { color: theme.colors.brand.primary },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {categoryData.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && { backgroundColor: theme.colors.brand.primary },
                { borderColor: theme.colors.brand.primary },
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat.id
                    ? { color: '#FFFFFF' }
                    : { color: theme.colors.brand.primary },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Service Providers List */}
        <FlatList
          data={filteredProviders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ServiceProviderCard provider={item} />}
          contentContainerStyle={styles.providersList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: theme.colors.utility.secondaryText }]}>
                No service providers found
              </Text>
            </View>
          }
          ListFooterComponent={
            <TouchableOpacity
              style={[styles.addButton, { borderColor: theme.colors.brand.primary }]}
            >
              <Text style={[styles.addButtonText, { color: theme.colors.brand.primary }]}>
                + Add Service Provider
              </Text>
            </TouchableOpacity>
          }
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.utility.primaryBackground }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.utility.primaryText }]}>
          Collaborators
        </Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: theme.colors.utility.secondaryBackground }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'providers' && styles.activeTab]}
          onPress={() => setActiveTab('providers')}
        >
          <Text
            style={[
              styles.tabText,
              { color: theme.colors.utility.secondaryText },
              activeTab === 'providers' && {
                color: theme.colors.brand.primary,
                fontWeight: '600',
              },
            ]}
          >
            Service Providers
          </Text>
          {activeTab === 'providers' && (
            <View style={[styles.tabIndicator, { backgroundColor: theme.colors.brand.primary }]} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'family' && styles.activeTab]}
          onPress={() => setActiveTab('family')}
        >
          <Text
            style={[
              styles.tabText,
              { color: theme.colors.utility.secondaryText },
              activeTab === 'family' && {
                color: theme.colors.brand.primary,
                fontWeight: '600',
              },
            ]}
          >
            Family
          </Text>
          {activeTab === 'family' && (
            <View style={[styles.tabIndicator, { backgroundColor: theme.colors.brand.primary }]} />
          )}
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'providers' ? renderProvidersTab() : renderFamilyTab()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {},
  tabText: {
    fontSize: 16,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  tabContent: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6F61EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  memberEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  memberPhone: {
    fontSize: 13,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  categoryScroll: {
    maxHeight: 60,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  providersList: {
    padding: 16,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  addButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginTop: 12,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
