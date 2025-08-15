
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { College, CollegeStatus } from "@/types/database";
import { useToast } from "@/hooks/use-toast";

export const useColleges = () => {
  return useQuery({
    queryKey: ['colleges'],
    queryFn: async (): Promise<College[]> => {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching colleges:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useCreateCollege = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (college: Omit<College, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('colleges')
        .insert([{ ...college, created_by: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      toast({ title: "Success", description: "College added successfully" });
    },
    onError: (error) => {
      console.error('Error creating college:', error);
      toast({ title: "Error", description: "Failed to add college", variant: "destructive" });
    },
  });
};

export const useUpdateCollege = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<College> & { id: string }) => {
      const { data, error } = await supabase
        .from('colleges')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      toast({ title: "Success", description: "College updated successfully" });
    },
    onError: (error) => {
      console.error('Error updating college:', error);
      toast({ title: "Error", description: "Failed to update college", variant: "destructive" });
    },
  });
};
