// src/features/onboarding/components/GenderSelector.tsx
import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Text } from '@rneui/themed';
import { useTheme } from '../../../theme/ThemeContext';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

interface GenderSelectorProps {
  selectedGender: string;
  onSelectGender: (gender: string) => void;
}

type GenderOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const GenderSelector: React.FC<GenderSelectorProps> = ({ selectedGender, onSelectGender }) => {
  const { theme } = useTheme();

  const genderOptions: GenderOption[] = [
    {
      id: 'male',
      label: 'Male',
      icon: <MaterialCommunityIcons name="gender-male" size={32} color={selectedGender === 'male' ? '#fff' : theme.colors.brand.primary} />
    },
    {
      id: 'female',
      label: 'Female',
      icon: <MaterialCommunityIcons name="gender-female" size={32} color={selectedGender === 'female' ? '#fff' : theme.colors.brand.primary} />
    },
    {
      id: 'other',
      label: 'Other',
      icon: <MaterialCommunityIcons name="gender-transgender" size={32} color={selectedGender === 'other' ? '#fff' : theme.colors.brand.primary} />
    },
    {
      id: 'prefer-not-to-say',
      label: 'Prefer not to say',
      icon: <MaterialCommunityIcons name="account-question" size={32} color={selectedGender === 'prefer-not-to-say' ? '#fff' : theme.colors.brand.primary} />
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.optionsRow}>
        {genderOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.genderOption,
              {
                backgroundColor: selectedGender === option.id 
                  ? theme.colors.brand.primary 
                  : theme.colors.utility.secondaryBackground,
                borderColor: selectedGender === option.id 
                  ? theme.colors.brand.primary 
                  : theme.colors.utility.secondaryBackground,
              }
            ]}
            onPress={() => onSelectGender(selectedGender === option.id ? '' : option.id)}
          >
            {option.icon}
            <Text 
              style={[
                styles.genderLabel,
                { 
                  color: selectedGender === option.id 
                    ? '#fff' 
                    : theme.colors.utility.primaryText 
                }
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  genderOption: {
    width: '48%',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  genderLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default GenderSelector;