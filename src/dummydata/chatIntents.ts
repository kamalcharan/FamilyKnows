// src/dummydata/chatIntents.ts
import { ChatIntent } from '../types/chat';

export const mainIntents: ChatIntent[] = [
  {
    id: 'assets',
    category: 'assets',
    label: 'Manage Assets',
    icon: '📦',
    action: 'assets',
    subIntents: [
      {
        id: 'assets-add',
        label: 'Add New Asset',
        icon: '➕',
        action: 'add_asset',
      },
      {
        id: 'assets-view',
        label: 'View All Assets',
        icon: '👁️',
        action: 'view_assets',
      },
      {
        id: 'assets-expiring',
        label: 'Expiring Soon',
        icon: '🔔',
        action: 'expiring_assets',
      },
      {
        id: 'assets-search',
        label: 'Search Assets',
        icon: '🔍',
        action: 'search_assets',
      },
    ],
  },
  {
    id: 'health',
    category: 'health',
    label: 'Health Records',
    icon: '🏥',
    action: 'health',
    subIntents: [
      {
        id: 'health-add',
        label: 'Add Health Record',
        icon: '➕',
        action: 'add_health',
      },
      {
        id: 'health-view',
        label: 'View Records',
        icon: '📋',
        action: 'view_health',
      },
      {
        id: 'health-appointments',
        label: 'Appointments',
        icon: '📅',
        action: 'health_appointments',
      },
    ],
  },
  {
    id: 'collaborators',
    category: 'collaborators',
    label: 'Collaborators',
    icon: '👥',
    action: 'collaborators',
    subIntents: [
      {
        id: 'collab-family',
        label: 'Family Members',
        icon: '👨‍👩‍👧‍👦',
        action: 'view_family',
      },
      {
        id: 'collab-providers',
        label: 'Service Providers',
        icon: '🔧',
        action: 'view_providers',
      },
      {
        id: 'collab-add',
        label: 'Add Provider',
        icon: '➕',
        action: 'add_provider',
      },
    ],
  },
  {
    id: 'tasks',
    category: 'tasks',
    label: 'Tasks & Reminders',
    icon: '📋',
    action: 'tasks',
    subIntents: [
      {
        id: 'tasks-add',
        label: 'Create Task',
        icon: '➕',
        action: 'add_task',
      },
      {
        id: 'tasks-view',
        label: 'View All Tasks',
        icon: '📝',
        action: 'view_tasks',
      },
      {
        id: 'tasks-today',
        label: 'Today\'s Tasks',
        icon: '📅',
        action: 'tasks_today',
      },
    ],
  },
  {
    id: 'finance',
    category: 'finance',
    label: 'Finance',
    icon: '💰',
    action: 'finance',
    subIntents: [
      {
        id: 'finance-transactions',
        label: 'Transactions',
        icon: '💳',
        action: 'view_transactions',
      },
      {
        id: 'finance-budget',
        label: 'Budget',
        icon: '📊',
        action: 'view_budget',
      },
      {
        id: 'finance-reports',
        label: 'Reports',
        icon: '📈',
        action: 'finance_reports',
      },
    ],
  },
  {
    id: 'documents',
    category: 'documents',
    label: 'Documents',
    icon: '📄',
    action: 'documents',
    subIntents: [
      {
        id: 'docs-upload',
        label: 'Upload Document',
        icon: '⬆️',
        action: 'upload_doc',
      },
      {
        id: 'docs-view',
        label: 'View Documents',
        icon: '📂',
        action: 'view_docs',
      },
      {
        id: 'docs-search',
        label: 'Search Documents',
        icon: '🔍',
        action: 'search_docs',
      },
    ],
  },
];

export const assistantResponses: Record<string, string> = {
  greeting: "Hi {name}! What would you like to do today?",
  assets: "Great! I can help you with your assets.",
  health: "I'll help you manage your health records.",
  collaborators: "Let's manage your collaborators.",
  tasks: "I can help you with your tasks and reminders.",
  finance: "Let me help you with your finances.",
  documents: "I can help you with your documents.",
};
