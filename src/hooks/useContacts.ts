
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Contact } from "@/types/database";
import { useToast } from "@/hooks/use-toast";

export const useContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async (): Promise<(Contact & { college_name: string })[]> => {
      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          colleges!inner(name)
        `)
        .order('created_at', { ascending: false });

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
    mutationFn: async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
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
