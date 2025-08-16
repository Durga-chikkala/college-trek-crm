
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  action: string;
  old_values: any;
  new_values: any;
  changed_at: string;
  ip_address: string | null;
  user_agent: string | null;
  user_profile: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

export const useAuditLogs = () => {
  return useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          profiles!audit_logs_changed_by_fkey (
            first_name,
            last_name
          )
        `)
        .order('changed_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching audit logs:', error);
        throw error;
      }

      // Transform the data to match our interface
      const transformedData: AuditLog[] = (data || []).map(log => ({
        id: log.id,
        table_name: log.table_name,
        record_id: log.record_id,
        action: log.action,
        old_values: log.old_values,
        new_values: log.new_values,
        changed_at: log.changed_at || '',
        ip_address: log.ip_address as string | null,
        user_agent: log.user_agent as string | null,
        user_profile: log.profiles ? {
          first_name: log.profiles.first_name,
          last_name: log.profiles.last_name
        } : null
      }));

      return transformedData;
    },
  });
};
