
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export const useSalesDeals = (collegeId?: string) => {
  return useQuery({
    queryKey: ['sales-deals', collegeId],
    queryFn: async () => {
      let query = supabase
        .from('sales_deals')
        .select(`
          *,
          colleges (
            name,
            city,
            state
          ),
          profiles!sales_deals_assigned_to_fkey (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (collegeId) {
        query = query.eq('college_id', collegeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching sales deals:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useCreateSalesDeal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (deal: Omit<TablesInsert<'sales_deals'>, 'created_by'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('sales_deals')
        .insert([{ ...deal, created_by: user.id }])
        .select(`
          *,
          colleges (
            name,
            city,
            state
          )
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-deals'] });
      toast({ title: "Success", description: "Sales deal created successfully" });
    },
    onError: (error) => {
      console.error('Error creating sales deal:', error);
      toast({ title: "Error", description: "Failed to create sales deal", variant: "destructive" });
    },
  });
};

export const useUpdateSalesDeal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'sales_deals'> & { id: string }) => {
      const { data, error } = await supabase
        .from('sales_deals')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          colleges (
            name,
            city,
            state
          )
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-deals'] });
      toast({ title: "Success", description: "Sales deal updated successfully" });
    },
    onError: (error) => {
      console.error('Error updating sales deal:', error);
      toast({ title: "Error", description: "Failed to update sales deal", variant: "destructive" });
    },
  });
};

export const useDeleteSalesDeal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sales_deals')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-deals'] });
      toast({ title: "Success", description: "Sales deal deleted successfully" });
    },
    onError: (error) => {
      console.error('Error deleting sales deal:', error);
      toast({ title: "Error", description: "Failed to delete sales deal", variant: "destructive" });
    },
  });
};
