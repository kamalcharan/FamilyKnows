// src/features/onboarding/utils/familyUtils.ts
import { FamilyWorkspace } from '../types/family';

export const WORKSPACES_KEY = '@FamilyKnows:workspaces';
export const ACTIVE_WORKSPACE_KEY = '@FamilyKnows:activeWorkspace';
export const USER_ID = 'current-user-id';

export const generateMockWorkspace = (name: string, isFirst: boolean = false): FamilyWorkspace => {
  const workspace: FamilyWorkspace = {
    id: Math.random().toString(36).substring(2, 9),
    name,
    createdBy: USER_ID,
    createdAt: new Date(),
    inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    isDefault: isFirst,
    members: [
      {
        id: USER_ID,
        name: 'You',
        email: 'you@example.com',
        phone: '+91 9876543210',
        role: 'admin',
        joinedAt: new Date(),
      },
    ],
    pendingInvites: [],
  };

  if (!isFirst) {
    workspace.members.push(
      {
        id: 'member-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'editor',
        joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'member-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'viewer',
        joinedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      }
    );
    
    workspace.pendingInvites.push({
      id: 'invite-1',
      email: 'pending@example.com',
      role: 'viewer',
      invitedBy: USER_ID,
      invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'pending',
      code: workspace.inviteCode,
    });
  }

  return workspace;
};