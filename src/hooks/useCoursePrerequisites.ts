
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type CoursePrerequisite = Tables<'course_prerequisites'>;
export type CoursePrerequisiteInsert = TablesInsert<'course_prerequisites'>;

export const useCoursePrerequisites = (courseId?: string) => {
  return useQuery({
    queryKey: ['course_prerequisites', courseId],
    queryFn: async () => {
      if (!courseId) return [];

      const { data, error } = await supabase
        .from('course_prerequisites')
        .select(`
          *,
          prerequisite_course:courses!course_prerequisites_prerequisite_course_id_fkey(id, name, description)
        `)
        .eq('course_id', courseId);

      if (error) {
        console.error('Error fetching course prerequisites:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!courseId,
  });
};

export const useAddCoursePrerequisite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (prerequisite: CoursePrerequisiteInsert) => {
      const { data, error } = await supabase
        .from('course_prerequisites')
        .insert([prerequisite])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course_prerequisites'] });
      toast({ title: "Success", description: "Prerequisite added successfully" });
    },
    onError: (error) => {
      console.error('Error adding prerequisite:', error);
      toast({ title: "Error", description: "Failed to add prerequisite", variant: "destructive" });
    },
  });
};

export const useRemoveCoursePrerequisite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('course_prerequisites')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course_prerequisites'] });
      toast({ title: "Success", description: "Prerequisite removed successfully" });
    },
    onError: (error) => {
      console.error('Error removing prerequisite:', error);
      toast({ title: "Error", description: "Failed to remove prerequisite", variant: "destructive" });
    },
  });
};
