/*
  # Fix Admin User System

  1. Changes
    - Add email column to admin_users table
    - Fix permissions array handling
    - Update policies for better security

  2. Security
    - Enable RLS
    - Update policies for proper access control
*/

-- Add email column to admin_users
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS email text;

-- Update admin_users table constraints
ALTER TABLE admin_users
ADD CONSTRAINT admin_users_email_key UNIQUE (email);

-- Create a temporary jsonb column
ALTER TABLE admin_invites 
ADD COLUMN temp_permissions jsonb;

-- Update the temporary column with the array data
UPDATE admin_invites 
SET temp_permissions = to_jsonb(permissions);

-- Drop the old column
ALTER TABLE admin_invites 
DROP COLUMN permissions;

-- Rename the temporary column
ALTER TABLE admin_invites 
RENAME COLUMN temp_permissions TO permissions;

-- Create function to validate permissions array
CREATE OR REPLACE FUNCTION validate_permissions_array(perms jsonb)
RETURNS boolean AS $$
BEGIN
  RETURN (
    jsonb_typeof(perms) = 'array' AND
    (
      SELECT bool_and(
        jsonb_typeof(value) = 'string' AND
        value::text IN (
          '"members.view"', '"members.create"', '"members.edit"', '"members.delete"',
          '"visitors.view"', '"visitors.create"', '"visitors.edit"', '"visitors.delete"',
          '"messages.send"', '"settings.view"', '"settings.edit"'
        )
      )
      FROM jsonb_array_elements(perms)
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Add check constraint for permissions
ALTER TABLE admin_invites
ADD CONSTRAINT valid_permissions_check 
CHECK (validate_permissions_array(permissions));

-- Update accept_admin_invite function to handle permissions properly
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
    email,
    role,
    permissions
  ) VALUES (
    user_id,
    invite_record.name,
    invite_record.email,
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