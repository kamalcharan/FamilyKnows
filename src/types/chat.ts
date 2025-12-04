// src/types/chat.ts

export type IntentCategory =
  | 'assets'
  | 'health'
  | 'collaborators'
  | 'tasks'
  | 'finance'
  | 'documents';

// Widget types that can be embedded in chat messages
export type ChatWidgetType =
  | 'orbit'           // Circle of Trust / Collaborators widget
  | 'asset-summary'   // Asset summary card
  | 'health-chart'    // Health vitals chart
  | 'document-list'   // Document list widget
  | 'family-tree';    // Family tree visualization

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
  widget?: ChatWidgetType;  // Optional embedded widget
  widgetData?: any;         // Data to pass to the widget
}
