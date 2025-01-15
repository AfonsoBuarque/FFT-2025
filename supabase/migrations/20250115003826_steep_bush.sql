-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view admin profiles" ON admin_users;
DROP POLICY IF EXISTS "First user becomes admin" ON admin_users;
DROP POLICY IF EXISTS "Admins can create other admins" ON admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can delete admin users" ON admin_users;

-- Create new policies with proper checks
CREATE POLICY "Public read access for admin profiles"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow first admin creation"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM admin_users
      WHERE role = 'Admin'
    )
  );

CREATE POLICY "Admin users can create other admins"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'Admin'
    )
  );

CREATE POLICY "Admin users can update other admins"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'Admin'
    )
  );

CREATE POLICY "Admin users can delete other admins"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'Admin'
    )
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_role_user_id ON admin_users(role, user_id);