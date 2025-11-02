// src/features/onboarding/types/family.ts
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