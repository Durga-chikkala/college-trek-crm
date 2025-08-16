
-- Add versioning support to pricing models
ALTER TABLE pricing_models ADD COLUMN version INTEGER DEFAULT 1;
ALTER TABLE pricing_models ADD COLUMN is_current_version BOOLEAN DEFAULT true;
ALTER TABLE pricing_models ADD COLUMN parent_version_id UUID REFERENCES pricing_models(id);

-- Add currency and advanced pricing features
ALTER TABLE pricing_models ADD COLUMN currency VARCHAR(3) DEFAULT 'USD';
ALTER TABLE pricing_models ADD COLUMN tier VARCHAR(50) DEFAULT 'basic';
ALTER TABLE pricing_models ADD COLUMN discount_type VARCHAR(20) DEFAULT 'none'; -- 'percentage', 'fixed', 'referral', 'none'
ALTER TABLE pricing_models ADD COLUMN discount_value NUMERIC DEFAULT 0;
ALTER TABLE pricing_models ADD COLUMN referral_conditions JSONB;
ALTER TABLE pricing_models ADD COLUMN effective_from DATE DEFAULT CURRENT_DATE;
ALTER TABLE pricing_models ADD COLUMN effective_until DATE;

-- Enhance courses table with additional metadata
ALTER TABLE courses ADD COLUMN prerequisites TEXT[];
ALTER TABLE courses ADD COLUMN learning_outcomes TEXT[];
ALTER TABLE courses ADD COLUMN difficulty_level VARCHAR(20) DEFAULT 'beginner';
ALTER TABLE courses ADD COLUMN thumbnail_url TEXT;
ALTER TABLE courses ADD COLUMN curriculum_file_path TEXT;
ALTER TABLE courses ADD COLUMN estimated_hours INTEGER;

-- Create audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(50) NOT NULL,
  record_id UUID NOT NULL,
  action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_values JSONB,
  new_values JSONB,
  changed_by UUID REFERENCES auth.users(id) NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for audit logs (admins can view all, users can view their own actions)
CREATE POLICY "Admins can view all audit logs" ON audit_logs
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own audit logs" ON audit_logs
FOR SELECT USING (changed_by = auth.uid());

-- Create function to log changes
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (table_name, record_id, action, new_values, changed_by)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, changed_by)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_values, changed_by)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD), auth.uid());
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to key tables
CREATE TRIGGER pricing_models_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON pricing_models
  FOR EACH ROW EXECUTE FUNCTION log_changes();

CREATE TRIGGER courses_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON courses
  FOR EACH ROW EXECUTE FUNCTION log_changes();

CREATE TRIGGER colleges_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON colleges
  FOR EACH ROW EXECUTE FUNCTION log_changes();

-- Enhance course_topics with rich media support
ALTER TABLE course_topics ADD COLUMN media_type VARCHAR(20) DEFAULT 'text'; -- 'text', 'video', 'pdf', 'image'
ALTER TABLE course_topics ADD COLUMN media_url TEXT;
ALTER TABLE course_topics ADD COLUMN duration_minutes INTEGER;
ALTER TABLE course_topics ADD COLUMN is_required BOOLEAN DEFAULT true;

-- Create course prerequisites junction table
CREATE TABLE course_prerequisites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  prerequisite_course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(course_id, prerequisite_course_id)
);

-- Enable RLS on course prerequisites
ALTER TABLE course_prerequisites ENABLE ROW LEVEL SECURITY;

-- Create policy for course prerequisites
CREATE POLICY "Users can manage course prerequisites" ON course_prerequisites
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM courses c 
    JOIN colleges col ON col.id = c.college_id 
    WHERE c.id = course_prerequisites.course_id 
    AND (has_role(auth.uid(), 'admin'::app_role) OR col.assigned_rep = auth.uid() OR col.created_by = auth.uid())
  )
);

-- Create sales deals table for tracking college deals
CREATE TABLE sales_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES colleges(id) ON DELETE CASCADE NOT NULL,
  deal_name VARCHAR(200) NOT NULL,
  deal_value NUMERIC,
  currency VARCHAR(3) DEFAULT 'USD',
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  stage VARCHAR(50) DEFAULT 'qualification', -- 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'
  expected_close_date DATE,
  actual_close_date DATE,
  notes TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on sales deals
ALTER TABLE sales_deals ENABLE ROW LEVEL SECURITY;

-- Create policies for sales deals
CREATE POLICY "Users can manage deals for accessible colleges" ON sales_deals
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM colleges c 
    WHERE c.id = sales_deals.college_id 
    AND (has_role(auth.uid(), 'admin'::app_role) OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  )
);

-- Add trigger for updating updated_at column
CREATE TRIGGER update_sales_deals_updated_at
  BEFORE UPDATE ON sales_deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create course enrollment projections table
CREATE TABLE enrollment_projections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_course_id UUID REFERENCES college_courses(id) ON DELETE CASCADE NOT NULL,
  projected_enrollments INTEGER NOT NULL,
  academic_year VARCHAR(10) NOT NULL, -- e.g., '2024-25'
  semester VARCHAR(20), -- 'fall', 'spring', 'summer'
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on enrollment projections
ALTER TABLE enrollment_projections ENABLE ROW LEVEL SECURITY;

-- Create policy for enrollment projections
CREATE POLICY "Users can manage enrollment projections" ON enrollment_projections
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM college_courses cc
    JOIN colleges c ON c.id = cc.college_id
    WHERE cc.id = enrollment_projections.college_course_id
    AND (has_role(auth.uid(), 'admin'::app_role) OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  )
);

-- Add trigger for enrollment projections updated_at
CREATE TRIGGER update_enrollment_projections_updated_at
  BEFORE UPDATE ON enrollment_projections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function for AI-powered pricing recommendations
CREATE OR REPLACE FUNCTION get_pricing_recommendations(target_college_id UUID)
RETURNS TABLE (
  recommended_base_price NUMERIC,
  recommended_tier VARCHAR(50),
  confidence_score NUMERIC,
  reasoning TEXT
) AS $$
DECLARE
  avg_price NUMERIC;
  college_location TEXT;
  similar_colleges_count INTEGER;
BEGIN
  -- Get college location
  SELECT city || ', ' || state INTO college_location
  FROM colleges WHERE id = target_college_id;
  
  -- Calculate average pricing for similar colleges (same state)
  SELECT 
    AVG(pm.base_price),
    COUNT(*)
  INTO avg_price, similar_colleges_count
  FROM pricing_models pm
  JOIN college_pricing_models cpm ON pm.id = cpm.pricing_model_id
  JOIN colleges c ON c.id = cpm.college_id
  WHERE c.state = (SELECT state FROM colleges WHERE id = target_college_id)
  AND pm.is_current_version = true
  AND pm.is_active = true;
  
  -- Return recommendation
  RETURN QUERY SELECT 
    COALESCE(avg_price, 50000::NUMERIC) as recommended_base_price,
    CASE 
      WHEN avg_price > 75000 THEN 'premium'::VARCHAR(50)
      WHEN avg_price > 40000 THEN 'standard'::VARCHAR(50)
      ELSE 'basic'::VARCHAR(50)
    END as recommended_tier,
    CASE 
      WHEN similar_colleges_count > 5 THEN 0.8::NUMERIC
      WHEN similar_colleges_count > 2 THEN 0.6::NUMERIC
      ELSE 0.3::NUMERIC
    END as confidence_score,
    CASE 
      WHEN similar_colleges_count > 5 THEN 'Based on ' || similar_colleges_count || ' similar colleges in ' || college_location
      WHEN similar_colleges_count > 2 THEN 'Limited data: ' || similar_colleges_count || ' similar colleges'
      ELSE 'Insufficient data: using default recommendations'
    END as reasoning;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX idx_pricing_models_version ON pricing_models(is_current_version, version);
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_changed_at ON audit_logs(changed_at);
CREATE INDEX idx_course_topics_course_order ON course_topics(course_id, order_index);
CREATE INDEX idx_sales_deals_college ON sales_deals(college_id);
CREATE INDEX idx_enrollment_projections_college_course ON enrollment_projections(college_course_id);

-- Add realtime support for key tables
ALTER TABLE pricing_models REPLICA IDENTITY FULL;
ALTER TABLE courses REPLICA IDENTITY FULL;
ALTER TABLE course_topics REPLICA IDENTITY FULL;
ALTER TABLE sales_deals REPLICA IDENTITY FULL;
ALTER TABLE audit_logs REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE pricing_models;
ALTER PUBLICATION supabase_realtime ADD TABLE courses;
ALTER PUBLICATION supabase_realtime ADD TABLE course_topics;
ALTER PUBLICATION supabase_realtime ADD TABLE sales_deals;
ALTER PUBLICATION supabase_realtime ADD TABLE audit_logs;
