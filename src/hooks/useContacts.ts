
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { TablesInsert } from "@/integrations/supabase/types";

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
