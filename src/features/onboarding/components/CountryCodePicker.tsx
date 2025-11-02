// src/features/onboarding/components/CountryCodePicker.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Text, SearchBar } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { CountryCode, countryCodes } from '../../../constants/countryCodes';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CountryCodePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: CountryCode) => void;
  selectedCountry: CountryCode;
}

export default function CountryCodePicker({
  visible,
  onClose,
  onSelect,
  selectedCountry,
}: CountryCodePickerProps) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery)
  );

  const renderCountryItem = ({ item }: { item: CountryCode }) => {
    const isSelected = item.code === selectedCountry.code;
    
    return (
      <TouchableOpacity
        style={[
          styles.countryItem,
          { 
            backgroundColor: isSelected 
              ? theme.colors.brand.alternate 
              : theme.colors.utility.secondaryBackground 
          }
        ]}
        onPress={() => onSelect(item)}
      >
        <Text style={styles.flag}>{item.flag}</Text>
        <Text 
          style={[
            styles.countryName, 
            { 
              color: theme.colors.utility.primaryText,
              fontWeight: isSelected ? '600' : '400'
            }
          ]}
        >
          {item.name}
        </Text>
        <Text 
          style={[
            styles.dialCode, 
            { 
              color: theme.colors.utility.secondaryText,
              fontWeight: isSelected ? '600' : '400'
            }
          ]}
        >
          {item.dialCode}
        </Text>
        {isSelected && (
          <MaterialCommunityIcons
            name="check"
            size={20}
            color={theme.colors.brand.primary}
            style={styles.checkIcon}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View 
          style={[
            styles.modalContent, 
            { backgroundColor: theme.colors.utility.primaryBackground }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.colors.utility.primaryText }]}>
              Select Country
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.utility.secondaryText}
              />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <SearchBar
            placeholder="Search country..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            platform="default"
            containerStyle={[
              styles.searchContainer,
              { backgroundColor: 'transparent' }
            ]}
            inputContainerStyle={[
              styles.searchInputContainer,
              { backgroundColor: theme.colors.utility.secondaryBackground }
            ]}
            inputStyle={{ color: theme.colors.utility.primaryText }}
            placeholderTextColor={theme.colors.utility.secondaryText}
            searchIcon={{ color: theme.colors.utility.secondaryText }}
            clearIcon={{ color: theme.colors.utility.secondaryText }}
          />

          {/* Country List */}
          <FlatList
            data={filteredCountries}
            renderItem={renderCountryItem}
            keyExtractor={(item) => item.code}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  searchInputContainer: {
    borderRadius: 10,
    height: 40,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 8,
    borderRadius: 10,
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
  },
  dialCode: {
    fontSize: 16,
    marginRight: 10,
  },
  checkIcon: {
    marginLeft: 5,
  },
});