
-- Create enum types for status and roles
CREATE TYPE college_status AS ENUM ('prospect', 'negotiation', 'closed_won', 'closed_lost');
CREATE TYPE meeting_outcome AS ENUM ('interested', 'follow_up', 'not_interested', 'proposal_sent', 'deal_closed');
CREATE TYPE app_role AS ENUM ('admin', 'sales_executive');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create colleges table
CREATE TABLE public.colleges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  pin_code TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  status college_status NOT NULL DEFAULT 'prospect',
  assigned_rep UUID REFERENCES auth.users,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contacts table
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id UUID REFERENCES colleges(id) NOT NULL,
  name TEXT NOT NULL,
  designation TEXT,
  phone TEXT,
  email TEXT,
  linkedin TEXT,
  notes TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meetings table
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id UUID REFERENCES colleges(id) NOT NULL,
  title TEXT NOT NULL,
  meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
  agenda TEXT,
  discussion_notes TEXT,
  outcome meeting_outcome,
  duration_minutes INTEGER,
  location TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  next_follow_up_date DATE,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tags table
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create college_tags junction table
CREATE TABLE public.college_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id UUID REFERENCES colleges(id) NOT NULL,
  tag_id UUID REFERENCES tags(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(college_id, tag_id)
);

-- Create meeting_tags junction table
CREATE TABLE public.meeting_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID REFERENCES meetings(id) NOT NULL,
  tag_id UUID REFERENCES tags(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(meeting_id, tag_id)
);

-- Create files table for document storage
CREATE TABLE public.files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  college_id UUID REFERENCES colleges(id),
  meeting_id UUID REFERENCES meetings(id),
  uploaded_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON public.colleges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON public.meetings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Helper functions for role-based access
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS app_role AS $$
  SELECT role FROM public.user_roles WHERE user_id = $1 LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, role_name app_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = $1 AND role = role_name);
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for colleges
CREATE POLICY "Admins can view all colleges" ON public.colleges FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Sales executives can view assigned colleges" ON public.colleges FOR SELECT USING (
  get_user_role(auth.uid()) = 'sales_executive' AND (assigned_rep = auth.uid() OR created_by = auth.uid())
);
CREATE POLICY "Admins can manage all colleges" ON public.colleges FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Sales executives can create colleges" ON public.colleges FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Sales executives can update assigned colleges" ON public.colleges FOR UPDATE USING (
  get_user_role(auth.uid()) = 'sales_executive' AND (assigned_rep = auth.uid() OR created_by = auth.uid())
);

-- RLS Policies for contacts
CREATE POLICY "Users can view contacts of accessible colleges" ON public.contacts FOR SELECT USING (
  EXISTS(
    SELECT 1 FROM colleges c 
    WHERE c.id = contacts.college_id 
    AND (has_role(auth.uid(), 'admin') OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  )
);
CREATE POLICY "Users can manage contacts of accessible colleges" ON public.contacts FOR ALL USING (
  EXISTS(
    SELECT 1 FROM colleges c 
    WHERE c.id = contacts.college_id 
    AND (has_role(auth.uid(), 'admin') OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  )
);

-- RLS Policies for meetings
CREATE POLICY "Users can view meetings of accessible colleges" ON public.meetings FOR SELECT USING (
  EXISTS(
    SELECT 1 FROM colleges c 
    WHERE c.id = meetings.college_id 
    AND (has_role(auth.uid(), 'admin') OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  )
);
CREATE POLICY "Users can manage meetings of accessible colleges" ON public.meetings FOR ALL USING (
  EXISTS(
    SELECT 1 FROM colleges c 
    WHERE c.id = meetings.college_id 
    AND (has_role(auth.uid(), 'admin') OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  )
);

-- RLS Policies for tags
CREATE POLICY "Users can view all tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage tags" ON public.tags FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for college_tags
CREATE POLICY "Users can view college tags" ON public.college_tags FOR SELECT USING (
  EXISTS(
    SELECT 1 FROM colleges c 
    WHERE c.id = college_tags.college_id 
    AND (has_role(auth.uid(), 'admin') OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  )
);
CREATE POLICY "Users can manage college tags" ON public.college_tags FOR ALL USING (
  EXISTS(
    SELECT 1 FROM colleges c 
    WHERE c.id = college_tags.college_id 
    AND (has_role(auth.uid(), 'admin') OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  )
);

-- RLS Policies for meeting_tags
CREATE POLICY "Users can view meeting tags" ON public.meeting_tags FOR SELECT USING (
  EXISTS(
    SELECT 1 FROM meetings m 
    JOIN colleges c ON c.id = m.college_id
    WHERE m.id = meeting_tags.meeting_id 
    AND (has_role(auth.uid(), 'admin') OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  )
);
CREATE POLICY "Users can manage meeting tags" ON public.meeting_tags FOR ALL USING (
  EXISTS(
    SELECT 1 FROM meetings m 
    JOIN colleges c ON c.id = m.college_id
    WHERE m.id = meeting_tags.meeting_id 
    AND (has_role(auth.uid(), 'admin') OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  )
);

-- RLS Policies for files
CREATE POLICY "Users can view files of accessible colleges/meetings" ON public.files FOR SELECT USING (
  (college_id IS NOT NULL AND EXISTS(
    SELECT 1 FROM colleges c 
    WHERE c.id = files.college_id 
    AND (has_role(auth.uid(), 'admin') OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  )) OR
  (meeting_id IS NOT NULL AND EXISTS(
    SELECT 1 FROM meetings m 
    JOIN colleges c ON c.id = m.college_id
    WHERE m.id = files.meeting_id 
    AND (has_role(auth.uid(), 'admin') OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  ))
);
CREATE POLICY "Users can manage files of accessible colleges/meetings" ON public.files FOR ALL USING (
  (college_id IS NOT NULL AND EXISTS(
    SELECT 1 FROM colleges c 
    WHERE c.id = files.college_id 
    AND (has_role(auth.uid(), 'admin') OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  )) OR
  (meeting_id IS NOT NULL AND EXISTS(
    SELECT 1 FROM meetings m 
    JOIN colleges c ON c.id = m.college_id
    WHERE m.id = files.meeting_id 
    AND (has_role(auth.uid(), 'admin') OR c.assigned_rep = auth.uid() OR c.created_by = auth.uid())
  ))
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email
  );
  
  -- Default role for new users is sales_executive
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'sales_executive');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to handle new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some default tags
INSERT INTO public.tags (name, color) VALUES 
  ('High Priority', '#EF4444'),
  ('Hot Lead', '#F97316'),
  ('Follow Up', '#EAB308'),
  ('Cold Lead', '#3B82F6'),
  ('Closed Won', '#22C55E'),
  ('Closed Lost', '#6B7280');
