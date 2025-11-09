// src/types/collaborators.ts

export type ServiceProviderCategory =
  | 'health'
  | 'home'
  | 'finance'
  | 'legal'
  | 'auto'
  | 'education'
  | 'other';

export interface ServiceProvider {
  id: string;
  name: string;
  category: ServiceProviderCategory;
  specialization: string;
  phone: string;
  email?: string;
  isBookmarked: boolean;
  isExternal: boolean; // From marketplace vs user added
  lastContacted?: Date;
  avatarUrl?: string;
  notes?: string;
}

export interface CategoryInfo {
  id: ServiceProviderCategory;
  name: string;
  icon: string;
  color: string;
}
