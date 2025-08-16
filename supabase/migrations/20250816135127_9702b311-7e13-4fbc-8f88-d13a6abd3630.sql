
-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  base_price DECIMAL(10,2) NOT NULL,
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  duration TEXT NOT NULL DEFAULT '1 year',
  capacity INTEGER NOT NULL DEFAULT 50,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course topics table
CREATE TABLE public.course_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_manual BOOLEAN NOT NULL DEFAULT true,
  readme_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view courses of accessible colleges" 
  ON public.courses 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM colleges c 
    WHERE c.id = courses.college_id 
    AND (has_role(auth.uid(), 'admin'::app_role) OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  ));

CREATE POLICY "Users can manage courses of accessible colleges" 
  ON public.courses 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM colleges c 
    WHERE c.id = courses.college_id 
    AND (has_role(auth.uid(), 'admin'::app_role) OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM colleges c 
    WHERE c.id = courses.college_id 
    AND (has_role(auth.uid(), 'admin'::app_role) OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  ));

-- Add RLS policies for course topics
ALTER TABLE public.course_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view topics of accessible courses" 
  ON public.course_topics 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM courses c
    JOIN colleges col ON col.id = c.college_id
    WHERE c.id = course_topics.course_id 
    AND (has_role(auth.uid(), 'admin'::app_role) OR col.assigned_rep = auth.uid() OR col.created_by = auth.uid())
  ));

CREATE POLICY "Users can manage topics of accessible courses" 
  ON public.course_topics 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM courses c
    JOIN colleges col ON col.id = c.college_id
    WHERE c.id = course_topics.course_id 
    AND (has_role(auth.uid(), 'admin'::app_role) OR col.assigned_rep = auth.uid() OR col.created_by = auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM courses c
    JOIN colleges col ON col.id = c.college_id
    WHERE c.id = course_topics.course_id 
    AND (has_role(auth.uid(), 'admin'::app_role) OR col.assigned_rep = auth.uid() OR col.created_by = auth.uid())
  ));

-- Add updated_at triggers
CREATE TRIGGER update_courses_updated_at 
  BEFORE UPDATE ON public.courses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_topics_updated_at 
  BEFORE UPDATE ON public.course_topics 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
