// src/context/FamilyContext.tsx
// Family Members Context - Manages family relationships and member data
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- TYPES ---
export type RelationshipType =
  | 'self'
  | 'spouse'
  | 'father'
  | 'mother'
  | 'son'
  | 'daughter'
  | 'brother'
  | 'sister'
  | 'grandfather'
  | 'grandmother'
  | 'uncle'
  | 'aunt'
  | 'cousin'
  | 'in-law'
  | 'other';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: RelationshipType;
  displayRelationship: string; // User-friendly: "Dad", "Mom", "Son", etc.
  avatar?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  isMe: boolean; // Is this the logged-in user?
  color: string; // For UI representation
  createdAt: string;
}

interface FamilyContextType {
  members: FamilyMember[];
  currentUser: FamilyMember | null;
  isLoading: boolean;

  // CRUD operations
  addMember: (member: Omit<FamilyMember, 'id' | 'createdAt'>) => Promise<void>;
  updateMember: (id: string, updates: Partial<FamilyMember>) => Promise<void>;
  removeMember: (id: string) => Promise<void>;

  // Helpers
  getMemberById: (id: string) => FamilyMember | undefined;
  getMemberDisplayName: (id: string, format?: 'relationship' | 'name' | 'both') => string;
  getMembersExceptMe: () => FamilyMember[];
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

const FAMILY_STORAGE_KEY = '@FamilyKnows:familyMembers';

// Generate unique ID
const generateId = () => `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Default colors for members
const MEMBER_COLORS = [
  '#3B82F6', // Blue
  '#EC4899', // Pink
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
];

// Relationship to display name mapping
const RELATIONSHIP_DISPLAY: Record<RelationshipType, string> = {
  self: 'Me',
  spouse: 'Spouse',
  father: 'Dad',
  mother: 'Mom',
  son: 'Son',
  daughter: 'Daughter',
  brother: 'Brother',
  sister: 'Sister',
  grandfather: 'Grandpa',
  grandmother: 'Grandma',
  uncle: 'Uncle',
  aunt: 'Aunt',
  cousin: 'Cousin',
  'in-law': 'In-Law',
  other: 'Family',
};

// Mock initial data for development
const MOCK_MEMBERS: FamilyMember[] = [
  {
    id: 'member-1',
    name: 'Kamal',
    relationship: 'father',
    displayRelationship: 'Dad',
    avatar: 'https://i.pravatar.cc/150?u=dad',
    phone: '9876543210',
    isMe: false, // Change to true if this is the logged-in user
    color: '#3B82F6',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'member-2',
    name: 'Priya',
    relationship: 'mother',
    displayRelationship: 'Mom',
    avatar: 'https://i.pravatar.cc/150?u=mom',
    phone: '9876543211',
    isMe: false,
    color: '#EC4899',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'member-3',
    name: 'Arjun',
    relationship: 'son',
    displayRelationship: 'Son',
    avatar: 'https://i.pravatar.cc/150?u=son',
    isMe: true, // This is the logged-in user
    color: '#10B981',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'member-4',
    name: 'Lakshmi',
    relationship: 'grandmother',
    displayRelationship: 'Grandma',
    avatar: 'https://i.pravatar.cc/150?u=grandma',
    isMe: false,
    color: '#F59E0B',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'member-5',
    name: 'Ananya',
    relationship: 'sister',
    displayRelationship: 'Sister',
    avatar: 'https://i.pravatar.cc/150?u=sister',
    isMe: false,
    color: '#8B5CF6',
    createdAt: new Date().toISOString(),
  },
];

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFamilyMembers();
  }, []);

  const loadFamilyMembers = async () => {
    try {
      setIsLoading(true);
      const savedMembers = await AsyncStorage.getItem(FAMILY_STORAGE_KEY);

      if (savedMembers) {
        setMembers(JSON.parse(savedMembers));
      } else {
        // Use mock data for development
        setMembers(MOCK_MEMBERS);
        await AsyncStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(MOCK_MEMBERS));
      }
    } catch (error) {
      console.error('Error loading family members:', error);
      setMembers(MOCK_MEMBERS);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMembersToStorage = async (updatedMembers: FamilyMember[]) => {
    try {
      await AsyncStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(updatedMembers));
    } catch (error) {
      console.error('Error saving family members:', error);
    }
  };

  const addMember = async (memberData: Omit<FamilyMember, 'id' | 'createdAt'>) => {
    const newMember: FamilyMember = {
      ...memberData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      color: memberData.color || MEMBER_COLORS[members.length % MEMBER_COLORS.length],
      displayRelationship: memberData.displayRelationship || RELATIONSHIP_DISPLAY[memberData.relationship],
    };

    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    await saveMembersToStorage(updatedMembers);
  };

  const updateMember = async (id: string, updates: Partial<FamilyMember>) => {
    const updatedMembers = members.map(member =>
      member.id === id ? { ...member, ...updates } : member
    );
    setMembers(updatedMembers);
    await saveMembersToStorage(updatedMembers);
  };

  const removeMember = async (id: string) => {
    const updatedMembers = members.filter(member => member.id !== id);
    setMembers(updatedMembers);
    await saveMembersToStorage(updatedMembers);
  };

  const getMemberById = useCallback((id: string): FamilyMember | undefined => {
    return members.find(member => member.id === id);
  }, [members]);

  const getMemberDisplayName = useCallback((
    id: string,
    format: 'relationship' | 'name' | 'both' = 'relationship'
  ): string => {
    const member = members.find(m => m.id === id);
    if (!member) return 'Unknown';

    switch (format) {
      case 'name':
        return member.name;
      case 'both':
        return `${member.name} (${member.displayRelationship})`;
      case 'relationship':
      default:
        return member.displayRelationship;
    }
  }, [members]);

  const getMembersExceptMe = useCallback((): FamilyMember[] => {
    return members.filter(member => !member.isMe);
  }, [members]);

  const currentUser = members.find(m => m.isMe) || null;

  const value: FamilyContextType = {
    members,
    currentUser,
    isLoading,
    addMember,
    updateMember,
    removeMember,
    getMemberById,
    getMemberDisplayName,
    getMembersExceptMe,
  };

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};

// Export types for use elsewhere
export type { FamilyContextType };
