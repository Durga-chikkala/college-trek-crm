
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export const useColleges = () => {
  return useQuery({
    queryKey: ['colleges'],
    queryFn: async () => {
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
    mutationFn: async (college: TablesInsert<'colleges'>) => {
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
    mutationFn: async ({ id, ...updates }: TablesUpdate<'colleges'> & { id: string }) => {
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
