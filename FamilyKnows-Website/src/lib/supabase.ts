// src/lib/supabase.ts
// Direct REST API calls to Supabase - no SDK needed

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase credentials not found. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

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
// API Helper
// ============================================
async function supabaseRequest(
  table: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  body?: object
): Promise<{ error: string | null }> {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Check for unique constraint violation (duplicate email)
      if (response.status === 409 || errorData.code === '23505') {
        return { error: 'DUPLICATE' };
      }

      return { error: errorData.message || `HTTP ${response.status}` };
    }

    return { error: null };
  } catch (err) {
    console.error('Supabase request error:', err);
    return { error: 'Network error. Please try again.' };
  }
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
  const { error } = await supabaseRequest('familyknows_waitlist', 'POST', {
    email: data.email.toLowerCase().trim(),
    name: data.name?.trim() || null,
    phone: data.phone?.trim() || null,
    plan_type: data.plan_type,
    source: data.source,
  });

  if (error) {
    if (error === 'DUPLICATE') {
      return { success: true, isExisting: true };
    }
    return { success: false, error };
  }

  return { success: true };
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
  const { error } = await supabaseRequest('familyknows_contacts', 'POST', {
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    phone: data.phone?.trim() || null,
    subject: data.subject?.trim() || null,
    message: data.message.trim(),
  });

  if (error) {
    return { success: false, error };
  }

  return { success: true };
}
