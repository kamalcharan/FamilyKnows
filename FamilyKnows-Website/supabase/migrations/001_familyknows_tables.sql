-- FamilyKnows Website Tables
-- Run this migration in your Supabase SQL Editor

-- ============================================
-- Table: familyknows_waitlist
-- Purpose: Store waitlist and early access signups
-- ============================================
CREATE TABLE IF NOT EXISTS familyknows_waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    plan_type TEXT NOT NULL DEFAULT 'waitlist' CHECK (plan_type IN ('earlybird', 'waitlist')),
    source TEXT NOT NULL DEFAULT 'website',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted')),
    notes TEXT,

    -- Ensure unique email per plan type
    CONSTRAINT unique_email UNIQUE (email)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON familyknows_waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_plan_type ON familyknows_waitlist(plan_type);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON familyknows_waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON familyknows_waitlist(status);

-- ============================================
-- Table: familyknows_contacts
-- Purpose: Store contact form submissions
-- ============================================
CREATE TABLE IF NOT EXISTS familyknows_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    notes TEXT
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_contacts_email ON familyknows_contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON familyknows_contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON familyknows_contacts(status);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS
ALTER TABLE familyknows_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE familyknows_contacts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for website forms)
CREATE POLICY "Allow anonymous waitlist signup" ON familyknows_waitlist
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow anonymous contact submission" ON familyknows_contacts
    FOR INSERT
    WITH CHECK (true);

-- Only authenticated users (admin) can read/update/delete
CREATE POLICY "Allow authenticated read waitlist" ON familyknows_waitlist
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update waitlist" ON familyknows_waitlist
    FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read contacts" ON familyknows_contacts
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update contacts" ON familyknows_contacts
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- ============================================
-- Updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
CREATE TRIGGER update_waitlist_updated_at
    BEFORE UPDATE ON familyknows_waitlist
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON familyknows_contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Sample queries for admin dashboard
-- ============================================
-- Get all waitlist signups:
-- SELECT * FROM familyknows_waitlist ORDER BY created_at DESC;

-- Get early bird signups count:
-- SELECT COUNT(*) FROM familyknows_waitlist WHERE plan_type = 'earlybird';

-- Get new contact messages:
-- SELECT * FROM familyknows_contacts WHERE status = 'new' ORDER BY created_at DESC;
