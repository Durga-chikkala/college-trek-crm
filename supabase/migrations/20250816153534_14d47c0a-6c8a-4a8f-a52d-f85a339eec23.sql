
-- Add foreign key constraint between audit_logs and profiles
ALTER TABLE audit_logs 
ADD CONSTRAINT audit_logs_changed_by_fkey 
FOREIGN KEY (changed_by) REFERENCES profiles(user_id);
