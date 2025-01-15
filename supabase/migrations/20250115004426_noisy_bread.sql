/*
  # Sistema de Convites de Administradores

  1. Nova Tabela
    - `admin_invites`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `role` (text)
      - `permissions` (text[])
      - `invited_by` (uuid, referência a auth.users)
      - `token` (text, unique)
      - `expires_at` (timestamptz)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for admin users
    - Add policies for invite token verification
*/

-- Create admin_invites table
CREATE TABLE IF NOT EXISTS admin_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  permissions text[] NOT NULL,
  invited_by uuid REFERENCES auth.users NOT NULL,
  token text UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT admin_invites_email_key UNIQUE (email)
);

-- Enable RLS
ALTER TABLE admin_invites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin users can create invites"
  ON admin_invites
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'Admin'
    )
  );

CREATE POLICY "Admin users can view invites"
  ON admin_invites
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'Admin'
    )
  );

CREATE POLICY "Admin users can update invites"
  ON admin_invites
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'Admin'
    )
  );

CREATE POLICY "Admin users can delete invites"
  ON admin_invites
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'Admin'
    )
  );

-- Create function to handle invite acceptance
CREATE OR REPLACE FUNCTION accept_admin_invite(invite_token text, user_id uuid)
RETURNS boolean AS $$
DECLARE
  invite_record admin_invites%ROWTYPE;
BEGIN
  -- Get and validate invite
  SELECT * INTO invite_record
  FROM admin_invites
  WHERE token = invite_token
  AND status = 'pending'
  AND expires_at > now();

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Create admin user
  INSERT INTO admin_users (
    user_id,
    name,
    role,
    permissions
  ) VALUES (
    user_id,
    invite_record.name,
    invite_record.role,
    invite_record.permissions
  );

  -- Update invite status
  UPDATE admin_invites
  SET status = 'accepted',
      updated_at = now()
  WHERE token = invite_token;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;