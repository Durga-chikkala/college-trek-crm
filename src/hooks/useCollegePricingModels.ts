
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

export type CollegePricingModel = Tables<'college_pricing_models'>;

export const useCollegePricingModels = (collegeId: string) => {
  return useQuery({
    queryKey: ['college-pricing-models', collegeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('college_pricing_models')
        .select(`
          *,
          pricing_models(*)
        `)
        .eq('college_id', collegeId)
        .eq('is_active', true)
        .order('assigned_at', { ascending: false });

      if (error) {
        console.error('Error fetching college pricing models:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!collegeId,
  });
};

export const useAssignPricingModelToCollege = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ collegeId, pricingModelId }: { 
      collegeId: string; 
      pricingModelId: string;
    }) => {
      const { data, error } = await supabase
        .from('college_pricing_models')
        .insert([{ 
          college_id: collegeId, 
          pricing_model_id: pricingModelId
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['college-pricing-models', variables.collegeId] });
      toast({ title: "Success", description: "Pricing model assigned to college successfully" });
    },
    onError: (error) => {
      console.error('Error assigning pricing model to college:', error);
      toast({ title: "Error", description: "Failed to assign pricing model to college", variant: "destructive" });
    },
  });
};

export const useUnassignPricingModelFromCollege = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (collegePricingModelId: string) => {
      const { error } = await supabase
        .from('college_pricing_models')
        .delete()
        .eq('id', collegePricingModelId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['college-pricing-models'] });
      toast({ title: "Success", description: "Pricing model unassigned from college successfully" });
    },
    onError: (error) => {
      console.error('Error unassigning pricing model from college:', error);
      toast({ title: "Error", description: "Failed to unassign pricing model from college", variant: "destructive" });
    },
  });
};
