// src/contexts/WorkspaceContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'admin' | 'editor' | 'viewer';
export type InviteStatus = 'pending' | 'accepted' | 'expired';

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  joinedAt: Date;
  avatarUrl?: string;
}

export interface PendingInvite {
  id: string;
  email?: string;
  phone?: string;
  role: UserRole;
  invitedBy: string;
  invitedAt: Date;
  status: InviteStatus;
  code: string;
}

export interface FamilyWorkspace {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  inviteCode: string;
  members: FamilyMember[];
  pendingInvites: PendingInvite[];
  isDefault: boolean;
}

interface WorkspaceContextType {
  workspaces: FamilyWorkspace[];
  activeWorkspace: FamilyWorkspace | null;
  loading: boolean;
  setActiveWorkspace: (workspace: FamilyWorkspace) => Promise<void>;
  reloadWorkspaces: () => Promise<void>;
  updateWorkspaces: (workspaces: FamilyWorkspace[]) => Promise<void>;
  showWorkspaceSwitcher: boolean;
  setShowWorkspaceSwitcher: (show: boolean) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const WORKSPACES_KEY = '@FamilyKnows:workspaces';
const ACTIVE_WORKSPACE_KEY = '@FamilyKnows:activeWorkspace';

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<FamilyWorkspace[]>([]);
  const [activeWorkspace, setActiveWorkspaceState] = useState<FamilyWorkspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWorkspaceSwitcher, setShowWorkspaceSwitcher] = useState(false);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      setLoading(true);
      const savedWorkspaces = await AsyncStorage.getItem(WORKSPACES_KEY);
      const activeId = await AsyncStorage.getItem(ACTIVE_WORKSPACE_KEY);
      
      if (savedWorkspaces) {
        const parsed = JSON.parse(savedWorkspaces);
        setWorkspaces(parsed);
        
        const active = parsed.find((w: FamilyWorkspace) => w.id === activeId) || 
                      parsed.find((w: FamilyWorkspace) => w.isDefault) || 
                      parsed[0];
        setActiveWorkspaceState(active);
        
        // Show switcher on app start if user has multiple workspaces
        if (parsed.length > 1 && !activeId) {
          setShowWorkspaceSwitcher(true);
        }
      }
    } catch (error) {
      console.error('Error loading workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const setActiveWorkspace = async (workspace: FamilyWorkspace) => {
    try {
      await AsyncStorage.setItem(ACTIVE_WORKSPACE_KEY, workspace.id);
      setActiveWorkspaceState(workspace);
    } catch (error) {
      console.error('Error setting active workspace:', error);
    }
  };

  const updateWorkspaces = async (updatedWorkspaces: FamilyWorkspace[]) => {
    try {
      await AsyncStorage.setItem(WORKSPACES_KEY, JSON.stringify(updatedWorkspaces));
      setWorkspaces(updatedWorkspaces);
      
      // Update active workspace if it was modified
      if (activeWorkspace) {
        const updatedActive = updatedWorkspaces.find(w => w.id === activeWorkspace.id);
        if (updatedActive) {
          setActiveWorkspaceState(updatedActive);
        }
      }
    } catch (error) {
      console.error('Error updating workspaces:', error);
    }
  };

  const reloadWorkspaces = loadWorkspaces;

  const value: WorkspaceContextType = {
    workspaces,
    activeWorkspace,
    loading,
    setActiveWorkspace,
    reloadWorkspaces,
    updateWorkspaces,
    showWorkspaceSwitcher,
    setShowWorkspaceSwitcher,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};