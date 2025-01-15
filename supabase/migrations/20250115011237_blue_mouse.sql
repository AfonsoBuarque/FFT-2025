/*
  # Fix Admin Permissions Validation

  1. Changes
    - Update permissions validation function to handle string arrays properly
    - Add helper function to format permissions array
    - Update constraints and validation

  2. Security
    - Maintain strict permission validation
    - Ensure proper data format
*/

-- Drop existing constraint
ALTER TABLE admin_invites
DROP CONSTRAINT IF EXISTS valid_permissions_check;

-- Update validation function to be more flexible
CREATE OR REPLACE FUNCTION validate_permissions_array(perms jsonb)
RETURNS boolean AS $$
DECLARE
  valid_permissions text[] := ARRAY[
    'members.view', 'members.create', 'members.edit', 'members.delete',
    'visitors.view', 'visitors.create', 'visitors.edit', 'visitors.delete',
    'messages.send', 'settings.view', 'settings.edit'
  ];
BEGIN
  RETURN (
    jsonb_typeof(perms) = 'array' AND
    (
      SELECT bool_and(
        value::text IN (
          SELECT format('"%s"', p)
          FROM unnest(valid_permissions) p
        )
      )
      FROM jsonb_array_elements(perms)
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Add helper function to format permissions
CREATE OR REPLACE FUNCTION format_permissions(perms text[])
RETURNS jsonb AS $$
BEGIN
  RETURN (
    SELECT jsonb_agg(p)
    FROM (
      SELECT unnest(perms)
    ) AS x(p)
  );
END;
$$ LANGUAGE plpgsql;

-- Add new constraint with updated validation
ALTER TABLE admin_invites
ADD CONSTRAINT valid_permissions_check 
CHECK (validate_permissions_array(permissions));