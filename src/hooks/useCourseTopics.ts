
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type CourseTopic = Tables<'course_topics'>;
export type CourseTopicInsert = TablesInsert<'course_topics'>;
export type CourseTopicUpdate = TablesUpdate<'course_topics'>;

export const useCourseTopics = (courseId?: string) => {
  return useQuery({
    queryKey: ['course_topics', courseId],
    queryFn: async () => {
      if (!courseId) return [];

      const { data, error } = await supabase
        .from('course_topics')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching course topics:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!courseId,
  });
};

export const useCreateCourseTopic = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (topic: CourseTopicInsert) => {
      const { data, error } = await supabase
        .from('course_topics')
        .insert([topic])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course_topics'] });
      toast({ title: "Success", description: "Topic created successfully" });
    },
    onError: (error) => {
      console.error('Error creating topic:', error);
      toast({ title: "Error", description: "Failed to create topic", variant: "destructive" });
    },
  });
};

export const useUpdateCourseTopic = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: CourseTopicUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('course_topics')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course_topics'] });
      toast({ title: "Success", description: "Topic updated successfully" });
    },
    onError: (error) => {
      console.error('Error updating topic:', error);
      toast({ title: "Error", description: "Failed to update topic", variant: "destructive" });
    },
  });
};

export const useDeleteCourseTopic = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('course_topics')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course_topics'] });
      toast({ title: "Success", description: "Topic deleted successfully" });
    },
    onError: (error) => {
      console.error('Error deleting topic:', error);
      toast({ title: "Error", description: "Failed to delete topic", variant: "destructive" });
    },
  });
};
