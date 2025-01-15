-- Create pending_admin_users table
CREATE TABLE IF NOT EXISTS pending_admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  permissions text[] NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pending_admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can create pending admin users"
  ON pending_admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view pending admin users"
  ON pending_admin_users
  FOR SELECT
  TO authenticated
  USING (true);