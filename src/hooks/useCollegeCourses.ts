
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

export type CollegeCourse = Tables<'college_courses'>;

export const useCollegeCourses = (collegeId: string) => {
  return useQuery({
    queryKey: ['college-courses', collegeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('college_courses')
        .select(`
          *,
          courses(*),
          pricing_models(*)
        `)
        .eq('college_id', collegeId)
        .eq('is_active', true)
        .order('assigned_at', { ascending: false });

      if (error) {
        console.error('Error fetching college courses:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!collegeId,
  });
};

export const useAssignCourseToCollege = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ collegeId, courseId, pricingModelId }: { 
      collegeId: string; 
      courseId: string; 
      pricingModelId?: string;
    }) => {
      const { data, error } = await supabase
        .from('college_courses')
        .insert([{ 
          college_id: collegeId, 
          course_id: courseId,
          pricing_model_id: pricingModelId
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['college-courses', variables.collegeId] });
      toast({ title: "Success", description: "Course assigned to college successfully" });
    },
    onError: (error) => {
      console.error('Error assigning course to college:', error);
      toast({ title: "Error", description: "Failed to assign course to college", variant: "destructive" });
    },
  });
};

export const useUnassignCourseFromCollege = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (collegeCourseId: string) => {
      const { error } = await supabase
        .from('college_courses')
        .delete()
        .eq('id', collegeCourseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['college-courses'] });
      toast({ title: "Success", description: "Course unassigned from college successfully" });
    },
    onError: (error) => {
      console.error('Error unassigning course from college:', error);
      toast({ title: "Error", description: "Failed to unassign course from college", variant: "destructive" });
    },
  });
};
