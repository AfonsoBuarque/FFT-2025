/*
  # Fix Admin Users Tables and Policies

  1. Changes
    - Create admin_invite_status enum type
    - Create pending_admin_users table with proper status column
    - Add indexes and constraints
    - Add cleanup function and trigger
    - Update RLS policies
*/

-- First create the enum type
CREATE TYPE admin_invite_status AS ENUM ('pending', 'accepted', 'expired', 'cancelled');

-- Create the table with the correct column type
CREATE TABLE IF NOT EXISTS pending_admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  permissions text[] NOT NULL,
  status admin_invite_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add unique constraint
ALTER TABLE pending_admin_users
ADD CONSTRAINT pending_admin_users_email_key UNIQUE (email);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_pending_admin_users_email ON pending_admin_users(email);
CREATE INDEX IF NOT EXISTS idx_pending_admin_users_status ON pending_admin_users(status);

-- Add automatic cleanup for expired invites
CREATE OR REPLACE FUNCTION cleanup_expired_invites() RETURNS trigger AS $$
BEGIN
  DELETE FROM pending_admin_users 
  WHERE status = 'pending' 
  AND created_at < NOW() - INTERVAL '24 hours';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER cleanup_expired_invites_trigger
  AFTER INSERT ON pending_admin_users
  EXECUTE FUNCTION cleanup_expired_invites();

-- Enable RLS
ALTER TABLE pending_admin_users ENABLE ROW LEVEL SECURITY;

-- Update RLS policies
DROP POLICY IF EXISTS "Authenticated users can create pending admin users" ON pending_admin_users;
DROP POLICY IF EXISTS "Authenticated users can view pending admin users" ON pending_admin_users;

CREATE POLICY "Admin users can manage pending invites"
  ON pending_admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role IN ('Admin', 'Manager')
    )
  );