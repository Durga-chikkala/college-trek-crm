
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type AuditLog = Tables<'audit_logs'>;

export const useAuditLogs = (tableFilter?: string, recordId?: string) => {
  return useQuery({
    queryKey: ['audit_logs', tableFilter, recordId],
    queryFn: async () => {
      let query = supabase
        .from('audit_logs')
        .select(`
          *,
          profiles!audit_logs_changed_by_fkey(first_name, last_name, email)
        `)
        .order('changed_at', { ascending: false });

      if (tableFilter) {
        query = query.eq('table_name', tableFilter);
      }

      if (recordId) {
        query = query.eq('record_id', recordId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching audit logs:', error);
        throw error;
      }

      return data || [];
    },
  });
};
