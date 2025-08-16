
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Course = Tables<'courses'>;
export type CourseInsert = TablesInsert<'courses'>;
export type CourseUpdate = TablesUpdate<'courses'>;

export const useCourses = (collegeId?: string) => {
  return useQuery({
    queryKey: ['courses', collegeId],
    queryFn: async () => {
      let query = supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (collegeId) {
        query = query.eq('college_id', collegeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!collegeId,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (course: CourseInsert) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('courses')
        .insert([{ ...course, created_by: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({ title: "Success", description: "Course created successfully" });
    },
    onError: (error) => {
      console.error('Error creating course:', error);
      toast({ title: "Error", description: "Failed to create course", variant: "destructive" });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: CourseUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({ title: "Success", description: "Course updated successfully" });
    },
    onError: (error) => {
      console.error('Error updating course:', error);
      toast({ title: "Error", description: "Failed to update course", variant: "destructive" });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({ title: "Success", description: "Course deleted successfully" });
    },
    onError: (error) => {
      console.error('Error deleting course:', error);
      toast({ title: "Error", description: "Failed to delete course", variant: "destructive" });
    },
  });
};
