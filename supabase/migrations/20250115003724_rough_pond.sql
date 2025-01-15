-- Drop existing policies
DROP POLICY IF EXISTS "Users can view admin profiles" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;

-- Create new non-recursive policies
CREATE POLICY "Anyone can view admin profiles"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "First user becomes admin"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM admin_users)
  );

CREATE POLICY "Admins can create other admins"
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

CREATE POLICY "Admins can update admin users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role = 'Admin'
      AND id != admin_users.id
    )
  );

CREATE POLICY "Admins can delete admin users"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role = 'Admin'
      AND id != admin_users.id
    )
  );