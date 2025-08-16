
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
          id,
          table_name,
          record_id,
          action,
          old_values,
          new_values,
          changed_at,
          ip_address,
          user_agent,
          changed_by
        `)
        .order('changed_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching audit logs:', error);
        throw error;
      }

      // Get unique user IDs from audit logs
      const userIds = [...new Set(data?.map(log => log.changed_by).filter(Boolean) || [])];
      
      // Fetch profiles for these users separately
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', userIds);

      // Create a map of user profiles
      const profileMap = new Map(
        profiles?.map(profile => [profile.user_id, profile]) || []
      );

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
        user_profile: log.changed_by ? profileMap.get(log.changed_by) || null : null
      }));

      return transformedData;
    },
  });
};
