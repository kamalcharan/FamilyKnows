// src/constants/languages.ts
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const supportedLanguages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
  },
];

// Language translations for common UI elements
export const translations = {
  en: {
    // Common
    continue: 'Continue',
    skip: 'Set up Later',
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    
    // Auth
    welcomeBack: 'Welcome Back',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    
    // Navigation
    home: 'Home',
    assets: 'Assets',
    documents: 'Documents',
    services: 'Services',
    family: 'Family',
    
    // Profile
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
  },
  te: {
    // Common
    continue: 'కొనసాగించండి',
    skip: 'తర్వాత సెట్ చేయండి',
    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    back: 'వెనుకకు',
    next: 'తదుపరి',
    done: 'పూర్తయింది',
    
    // Auth
    welcomeBack: 'తిరిగి స్వాగతం',
    signIn: 'సైన్ ఇన్',
    signUp: 'సైన్ అప్',
    
    // Navigation
    home: 'హోమ్',
    assets: 'ఆస్తులు',
    documents: 'పత్రాలు',
    services: 'సేవలు',
    family: 'కుటుంబం',
    
    // Profile
    profile: 'ప్రొఫైల్',
    settings: 'సెట్టింగ్‌లు',
    logout: 'లాగ్అవుట్',
  },
  hi: {
    // Common
    continue: 'जारी रखें',
    skip: 'बाद में सेट करें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    back: 'वापस',
    next: 'अगला',
    done: 'पूर्ण',
    
    // Auth
    welcomeBack: 'वापसी पर स्वागत है',
    signIn: 'साइन इन करें',
    signUp: 'साइन अप करें',
    
    // Navigation
    home: 'होम',
    assets: 'संपत्ति',
    documents: 'दस्तावेज़',
    services: 'सेवाएं',
    family: 'परिवार',
    
    // Profile
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    logout: 'लॉग आउट',
  },
  ta: {
    // Common
    continue: 'தொடரவும்',
    skip: 'பின்னர் அமைக்கவும்',
    save: 'சேமி',
    cancel: 'ரத்து செய்',
    back: 'பின்',
    next: 'அடுத்து',
    done: 'முடிந்தது',
    
    // Auth
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்',
    signIn: 'உள்நுழையவும்',
    signUp: 'பதிவு செய்யவும்',
    
    // Navigation
    home: 'முகப்பு',
    assets: 'சொத்துக்கள்',
    documents: 'ஆவணங்கள்',
    services: 'சேவைகள்',
    family: 'குடும்பம்',
    
    // Profile
    profile: 'சுயவிவரம்',
    settings: 'அமைப்புகள்',
    logout: 'வெளியேறு',
  },
};

// Helper function to get translation
export const getTranslation = (languageCode: string, key: string): string => {
  const langTranslations = translations[languageCode as keyof typeof translations];
  if (langTranslations && key in langTranslations) {
    return langTranslations[key as keyof typeof langTranslations];
  }
  // Fallback to English
  return translations.en[key as keyof typeof translations.en] || key;
};