-- Phase 1 Database Migration
-- Execute this in Supabase SQL Editor
-- https://supabase.com/dashboard/project/br-handy-deer-627f60fc/sql

-- ============================================
-- 1. ORDERS TABLE EXPANSION
-- ============================================

-- Add new columns for B2B support
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'b2c_online';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_company TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pi_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS final_payment_amount DECIMAL(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_specs TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Add constraints (drop existing if any, then add new)
DO $$ BEGIN
  -- Drop existing constraints if they exist
  BEGIN
    ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_order_type_check;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  
  -- Add new constraints
  ALTER TABLE orders ADD CONSTRAINT orders_order_type_check 
    CHECK (order_type IN ('b2c_online', 'b2b_offline'));
  
  ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check 
    CHECK (payment_status IN ('unpaid', 'partial', 'paid'));
  
  ALTER TABLE orders ADD CONSTRAINT orders_status_check 
    CHECK (status IN ('pending_payment', 'preparing', 'shipped', 'completed', 'after_sales'));
END $$;

-- ============================================
-- 2. PRODUCTS TABLE EXPANSION
-- ============================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(8,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS oem_available BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS oem_notes TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- ============================================
-- 3. INQUIRIES TABLE EXPANSION
-- ============================================

ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'website';
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS assigned_to INTEGER REFERENCES users(id);
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS stage TEXT DEFAULT 'new';
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS follow_up_notes JSONB DEFAULT '[]'::jsonb;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS quote_history JSONB DEFAULT '[]'::jsonb;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS converted_to_order_id INTEGER;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Add constraints for inquiries
DO $$ BEGIN
  BEGIN
    ALTER TABLE inquiries DROP CONSTRAINT IF EXISTS inquiries_channel_check;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE inquiries DROP CONSTRAINT IF EXISTS inquiries_stage_check;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  
  ALTER TABLE inquiries ADD CONSTRAINT inquiries_channel_check 
    CHECK (channel IN ('website', 'email', 'whatsapp'));
  
  ALTER TABLE inquiries ADD CONSTRAINT inquiries_stage_check 
    CHECK (stage IN ('new', 'following_up', 'quoted', 'negotiating', 'won', 'lost'));
END $$;

-- ============================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_orders_order_type ON orders(order_type);
CREATE INDEX IF NOT EXISTS idx_orders_country ON orders(country);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_inquiries_stage ON inquiries(stage);
CREATE INDEX IF NOT EXISTS idx_inquiries_channel ON inquiries(channel);
CREATE INDEX IF NOT EXISTS idx_inquiries_assigned_to ON inquiries(assigned_to);

-- ============================================
-- VERIFICATION
-- ============================================

-- Run these queries to verify the migration
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'orders' ORDER BY ordinal_position;
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'products' ORDER BY ordinal_position;
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'inquiries' ORDER BY ordinal_position;
