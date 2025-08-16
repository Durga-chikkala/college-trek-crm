
-- First, let's create a pricing_models table
CREATE TABLE public.pricing_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC NOT NULL,
  min_price NUMERIC,
  max_price NUMERIC,
  discount_percentage NUMERIC DEFAULT 0,
  markup_percentage NUMERIC DEFAULT 0,
  pricing_type TEXT NOT NULL DEFAULT 'fixed', -- 'fixed', 'dynamic', 'tiered'
  conditions JSONB, -- Store pricing conditions as JSON
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for pricing_models
ALTER TABLE public.pricing_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all pricing models" 
  ON public.pricing_models 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create pricing models" 
  ON public.pricing_models 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their pricing models" 
  ON public.pricing_models 
  FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their pricing models" 
  ON public.pricing_models 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- Modify courses table to remove college_id dependency (make it optional for now)
ALTER TABLE public.courses ALTER COLUMN college_id DROP NOT NULL;
ALTER TABLE public.courses ADD COLUMN pricing_model_id UUID REFERENCES public.pricing_models(id);

-- Create a junction table for college-course relationships
CREATE TABLE public.college_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  pricing_model_id UUID REFERENCES public.pricing_models(id),
  is_active BOOLEAN DEFAULT true,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(college_id, course_id)
);

-- Add RLS policies for college_courses
ALTER TABLE public.college_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage college courses" 
  ON public.college_courses 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM colleges c 
    WHERE c.id = college_courses.college_id 
    AND (has_role(auth.uid(), 'admin'::app_role) OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  ));

CREATE POLICY "Users can view college courses" 
  ON public.college_courses 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM colleges c 
    WHERE c.id = college_courses.college_id 
    AND (has_role(auth.uid(), 'admin'::app_role) OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  ));

-- Create a junction table for college-pricing relationships
CREATE TABLE public.college_pricing_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  pricing_model_id UUID NOT NULL REFERENCES public.pricing_models(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(college_id, pricing_model_id)
);

-- Add RLS policies for college_pricing_models
ALTER TABLE public.college_pricing_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage college pricing models" 
  ON public.college_pricing_models 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM colleges c 
    WHERE c.id = college_pricing_models.college_id 
    AND (has_role(auth.uid(), 'admin'::app_role) OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  ));

CREATE POLICY "Users can view college pricing models" 
  ON public.college_pricing_models 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM colleges c 
    WHERE c.id = college_pricing_models.college_id 
    AND (has_role(auth.uid(), 'admin'::app_role) OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  ));

-- Add trigger for updated_at on pricing_models
CREATE TRIGGER update_pricing_models_updated_at
    BEFORE UPDATE ON public.pricing_models
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
