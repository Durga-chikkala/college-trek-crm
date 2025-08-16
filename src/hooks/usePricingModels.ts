
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type PricingModel = Tables<'pricing_models'>;
export type PricingModelInsert = Omit<TablesInsert<'pricing_models'>, 'created_by'>;
export type PricingModelUpdate = TablesUpdate<'pricing_models'>;

export const usePricingModels = () => {
  return useQuery({
    queryKey: ['pricing-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_models')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pricing models:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useCreatePricingModel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (pricingModel: PricingModelInsert) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('pricing_models')
        .insert([{ ...pricingModel, created_by: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-models'] });
      toast({ title: "Success", description: "Pricing model created successfully" });
    },
    onError: (error) => {
      console.error('Error creating pricing model:', error);
      toast({ title: "Error", description: "Failed to create pricing model", variant: "destructive" });
    },
  });
};

export const useUpdatePricingModel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: PricingModelUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('pricing_models')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-models'] });
      toast({ title: "Success", description: "Pricing model updated successfully" });
    },
    onError: (error) => {
      console.error('Error updating pricing model:', error);
      toast({ title: "Error", description: "Failed to update pricing model", variant: "destructive" });
    },
  });
};

export const useDeletePricingModel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pricing_models')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-models'] });
      toast({ title: "Success", description: "Pricing model deleted successfully" });
    },
    onError: (error) => {
      console.error('Error deleting pricing model:', error);
      toast({ title: "Error", description: "Failed to delete pricing model", variant: "destructive" });
    },
  });
};
