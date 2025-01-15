/*
  # Add Initial Admin User
  
  1. Changes
    - Create function to insert initial admin user
    - Add trigger to automatically create admin user on first auth
*/

-- Create function to insert initial admin
CREATE OR REPLACE FUNCTION create_initial_admin() 
RETURNS trigger AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE role = 'Admin'
  ) THEN
    INSERT INTO admin_users (
      user_id,
      name,
      role,
      permissions
    ) VALUES (
      NEW.id, -- Use the new user's ID
      'Admin',
      'Admin',
      ARRAY[
        'members.view',
        'members.create',
        'members.edit',
        'members.delete',
        'visitors.view',
        'visitors.create',
        'visitors.edit',
        'visitors.delete',
        'messages.send',
        'settings.view',
        'settings.edit'
      ]
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS create_initial_admin_trigger ON auth.users;
CREATE TRIGGER create_initial_admin_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_initial_admin();