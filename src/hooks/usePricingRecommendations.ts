
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PricingRecommendation {
  recommended_base_price: number;
  recommended_tier: string;
  confidence_score: number;
  reasoning: string;
}

export const usePricingRecommendations = (collegeId?: string) => {
  return useQuery({
    queryKey: ['pricing_recommendations', collegeId],
    queryFn: async () => {
      if (!collegeId) return null;

      const { data, error } = await supabase
        .rpc('get_pricing_recommendations', { target_college_id: collegeId });

      if (error) {
        console.error('Error fetching pricing recommendations:', error);
        throw error;
      }

      return data?.[0] as PricingRecommendation || null;
    },
    enabled: !!collegeId,
  });
};
