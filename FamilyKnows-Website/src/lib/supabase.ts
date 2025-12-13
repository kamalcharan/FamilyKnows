// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase connection
// Add these to your .env file:
// VITE_SUPABASE_URL=your-project-url
// VITE_SUPABASE_ANON_KEY=your-anon-key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not found. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// Types
// ============================================
export type WaitlistPlanType = 'earlybird' | 'waitlist';
export type WaitlistStatus = 'pending' | 'contacted' | 'converted';
export type ContactStatus = 'new' | 'read' | 'replied' | 'archived';

export interface WaitlistEntry {
  id?: string;
  email: string;
  name?: string;
  phone?: string;
  plan_type: WaitlistPlanType;
  source: string;
  created_at?: string;
  status?: WaitlistStatus;
}

export interface ContactEntry {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  created_at?: string;
  status?: ContactStatus;
}

// ============================================
// API Functions
// ============================================

/**
 * Submit a waitlist signup
 */
export async function submitWaitlist(data: {
  email: string;
  name?: string;
  phone?: string;
  plan_type: WaitlistPlanType;
  source: string;
}): Promise<{ success: boolean; error?: string; isExisting?: boolean }> {
  try {
    const { error } = await supabase.from('familyknows_waitlist').insert([
      {
        email: data.email.toLowerCase().trim(),
        name: data.name?.trim() || null,
        phone: data.phone?.trim() || null,
        plan_type: data.plan_type,
        source: data.source,
      },
    ]);

    if (error) {
      // Check if it's a duplicate email error
      if (error.code === '23505' || error.message.includes('unique')) {
        return { success: true, isExisting: true };
      }
      console.error('Waitlist submission error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Waitlist submission error:', err);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

/**
 * Submit a contact form
 */
export async function submitContact(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('familyknows_contacts').insert([
      {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone?.trim() || null,
        subject: data.subject?.trim() || null,
        message: data.message.trim(),
      },
    ]);

    if (error) {
      console.error('Contact submission error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Contact submission error:', err);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

/**
 * Check if email is already on waitlist
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('familyknows_waitlist')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('Email check error:', error);
    }

    return !!data;
  } catch {
    return false;
  }
}
