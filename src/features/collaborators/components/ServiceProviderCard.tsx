// src/features/collaborators/components/ServiceProviderCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Share } from 'react-native';
import { ServiceProvider } from '../../../types/collaborators';
import { useTheme } from '../../../theme/ThemeContext';
import { categoryData } from '../../../dummydata';

interface ServiceProviderCardProps {
  provider: ServiceProvider;
  onPress?: () => void;
}

export const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({ provider, onPress }) => {
  const { theme } = useTheme();

  const category = categoryData.find((c) => c.id === provider.category);
  const categoryIcon = category?.icon || '🎯';

  const handleCall = () => {
    Linking.openURL(`tel:${provider.phone}`);
  };

  const handleEmail = () => {
    if (provider.email) {
      Linking.openURL(`mailto:${provider.email}`);
    }
  };

  const handleShare = async () => {
    try {
      const message = `${provider.name}\n${provider.specialization}\n📞 ${provider.phone}${provider.email ? `\n✉️ ${provider.email}` : ''}${provider.notes ? `\n💭 ${provider.notes}` : ''}`;
      await Share.share({
        message,
        title: `Share ${provider.name}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatLastContacted = (date?: Date) => {
    if (!date) return null;
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.utility.secondaryBackground }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>{categoryIcon}</Text>
          <View style={styles.titleContainer}>
            <Text style={[styles.name, { color: theme.colors.utility.primaryText }]}>
              {provider.name}
            </Text>
            <Text style={[styles.specialization, { color: theme.colors.utility.secondaryText }]}>
              {provider.specialization}
            </Text>
          </View>
        </View>
        {provider.isBookmarked && (
          <Text style={styles.bookmark}>⭐</Text>
        )}
      </View>

      <View style={styles.contactRow}>
        <Text style={[styles.phone, { color: theme.colors.utility.secondaryText }]}>
          📞 {provider.phone}
        </Text>
      </View>

      {provider.lastContacted && (
        <Text style={[styles.lastContacted, { color: theme.colors.utility.secondaryText }]}>
          Last contacted: {formatLastContacted(provider.lastContacted)}
        </Text>
      )}

      {provider.notes && (
        <Text style={[styles.notes, { color: theme.colors.utility.secondaryText }]}>
          💭 {provider.notes}
        </Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.brand.primary }]}
          onPress={handleCall}
        >
          <Text style={styles.actionText}>📞 Call</Text>
        </TouchableOpacity>
        {provider.email && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.accent.accent2 }]}
            onPress={handleEmail}
          >
            <Text style={styles.actionText}>✉️ Email</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.accent.accent3 }]}
          onPress={handleShare}
        >
          <Text style={styles.actionText}>🔗 Share</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 14,
  },
  bookmark: {
    fontSize: 20,
  },
  contactRow: {
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
  },
  lastContacted: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  notes: {
    fontSize: 13,
    marginTop: 8,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
