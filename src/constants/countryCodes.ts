// src/constants/countryCodes.ts
export interface CountryCode {
  name: string;
  dialCode: string;
  code: string;
  flag: string;
}

export const countryCodes: CountryCode[] = [
  { name: 'India', dialCode: '+91', code: 'IN', flag: '🇮🇳' },
  { name: 'United States', dialCode: '+1', code: 'US', flag: '🇺🇸' },
  { name: 'United Kingdom', dialCode: '+44', code: 'GB', flag: '🇬🇧' },
  { name: 'Canada', dialCode: '+1', code: 'CA', flag: '🇨🇦' },
  { name: 'Australia', dialCode: '+61', code: 'AU', flag: '🇦🇺' },
  { name: 'Singapore', dialCode: '+65', code: 'SG', flag: '🇸🇬' },
  { name: 'United Arab Emirates', dialCode: '+971', code: 'AE', flag: '🇦🇪' },
  { name: 'Saudi Arabia', dialCode: '+966', code: 'SA', flag: '🇸🇦' },
  { name: 'Germany', dialCode: '+49', code: 'DE', flag: '🇩🇪' },
  { name: 'France', dialCode: '+33', code: 'FR', flag: '🇫🇷' },
  { name: 'Japan', dialCode: '+81', code: 'JP', flag: '🇯🇵' },
  { name: 'China', dialCode: '+86', code: 'CN', flag: '🇨🇳' },
  { name: 'Brazil', dialCode: '+55', code: 'BR', flag: '🇧🇷' },
  { name: 'Mexico', dialCode: '+52', code: 'MX', flag: '🇲🇽' },
  { name: 'South Africa', dialCode: '+27', code: 'ZA', flag: '🇿🇦' },
  { name: 'New Zealand', dialCode: '+64', code: 'NZ', flag: '🇳🇿' },
  { name: 'Italy', dialCode: '+39', code: 'IT', flag: '🇮🇹' },
  { name: 'Spain', dialCode: '+34', code: 'ES', flag: '🇪🇸' },
  { name: 'Netherlands', dialCode: '+31', code: 'NL', flag: '🇳🇱' },
  { name: 'Sweden', dialCode: '+46', code: 'SE', flag: '🇸🇪' },
];