-- Drop existing function and trigger
DROP TRIGGER IF EXISTS create_initial_admin_trigger ON auth.users;
DROP FUNCTION IF EXISTS create_initial_admin();

-- Create a more robust function to handle initial admin creation
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Create initial admin if no admins exist
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
      NEW.id,
      COALESCE(NEW.email, 'Admin'),
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

-- Create new trigger
CREATE TRIGGER handle_new_user_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Update admin_users policies
DROP POLICY IF EXISTS "Users can view own admin profile" ON admin_users;
DROP POLICY IF EXISTS "Users can update own admin profile" ON admin_users;
DROP POLICY IF EXISTS "Users can insert admin profiles" ON admin_users;

-- Create more specific policies
CREATE POLICY "Users can view admin profiles"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role = 'Admin'
    )
  );

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);