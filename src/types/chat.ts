// src/types/chat.ts

export type IntentCategory =
  | 'assets'
  | 'health'
  | 'collaborators'
  | 'tasks'
  | 'finance'
  | 'documents';

export interface ChatIntent {
  id: string;
  category?: IntentCategory;
  label: string;
  icon: string;
  action: string;
  subIntents?: ChatIntent[];
}

export interface ChatMessage {
  id: string;
  type: 'assistant' | 'user';
  text: string;
  timestamp: Date;
  intents?: ChatIntent[];
}
