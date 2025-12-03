// src/navigation/types.ts

// Auth Stack - includes both auth and onboarding screens
export type AuthStackParamList = {
  // Auth screens
  Splash: undefined;
  Intro: undefined;
  StoryOnboarding: undefined;
  Login: { userName?: string; familyName?: string };

  // Onboarding screens (in order)
  PhoneAuth: { isFromSettings?: boolean; userName?: string; familyName?: string };
  UserProfile: { isFromSettings: boolean };
  ThemeSelection: { isFromSettings: boolean };
  LanguageSelection: { isFromSettings: boolean };
  GoogleDriveConnect: { isFromSettings: boolean };
  FamilySetup: { isFromSettings: boolean };
  Pricing: undefined;
  
  // Main app
  Main: undefined;
};

// Onboarding Stack - for type safety in onboarding screens
export type OnboardingStackParamList = {
  PhoneAuth: { isFromSettings?: boolean };
  UserProfile: { isFromSettings: boolean };
  ThemeSelection: { isFromSettings: boolean };
  LanguageSelection: { isFromSettings: boolean };
  GoogleDriveConnect: { isFromSettings: boolean };
  FamilySetup: { isFromSettings: boolean };
};

export type MainTabParamList = {
  Home: undefined;
  Assets: undefined;
  Documents: undefined;
  Services: undefined;
  Family: undefined;
};

export type AssetStackParamList = {
  AssetList: undefined;
  AssetDetail: { assetId: string };
  AddAsset: undefined;
  EditAsset: { assetId: string };
};

export type FamilyStackParamList = {
  FamilyMembers: undefined;
  InviteMember: undefined;
  MemberProfile: { memberId: string };
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Settings: undefined;
  ThemeSelector: undefined;
};