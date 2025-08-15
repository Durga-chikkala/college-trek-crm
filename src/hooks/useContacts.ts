
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export const useContacts = (collegeId?: string) => {
  return useQuery({
    queryKey: ['contacts', collegeId],
    queryFn: async () => {
      let query = supabase
        .from('contacts')
        .select(`
          *,
          colleges!inner(name)
        `)
        .order('created_at', { ascending: false });

      if (collegeId) {
        query = query.eq('college_id', collegeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching contacts:', error);
        throw error;
      }

      return data?.map(contact => ({
        ...contact,
        college_name: contact.colleges.name
      })) || [];
    },
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (contact: TablesInsert<'contacts'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('contacts')
        .insert([{ ...contact, created_by: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({ title: "Success", description: "Contact added successfully" });
    },
    onError: (error) => {
      console.error('Error creating contact:', error);
      toast({ title: "Error", description: "Failed to add contact", variant: "destructive" });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'contacts'> & { id: string }) => {
      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({ title: "Success", description: "Contact updated successfully" });
    },
    onError: (error) => {
      console.error('Error updating contact:', error);
      toast({ title: "Error", description: "Failed to update contact", variant: "destructive" });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({ title: "Success", description: "Contact deleted successfully" });
    },
    onError: (error) => {
      console.error('Error deleting contact:', error);
      toast({ title: "Error", description: "Failed to delete contact", variant: "destructive" });
    },
  });
};
