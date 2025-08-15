
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Get colleges count by status
      const { data: colleges, error: collegesError } = await supabase
        .from('colleges')
        .select('status');

      if (collegesError) throw collegesError;

      // Get total contacts
      const { count: contactsCount, error: contactsError } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });

      if (contactsError) throw contactsError;

      // Get recent meetings
      const { data: recentMeetings, error: meetingsError } = await supabase
        .from('meetings')
        .select('*, colleges(name)')
        .order('meeting_date', { ascending: false })
        .limit(5);

      if (meetingsError) throw meetingsError;

      // Get upcoming meetings
      const { data: upcomingMeetings, error: upcomingError } = await supabase
        .from('meetings')
        .select('*, colleges(name)')
        .gte('meeting_date', new Date().toISOString())
        .order('meeting_date', { ascending: true })
        .limit(5);

      if (upcomingError) throw upcomingError;

      // Calculate stats
      const totalColleges = colleges?.length || 0;
      const prospectColleges = colleges?.filter(c => c.status === 'prospect').length || 0;
      const negotiationColleges = colleges?.filter(c => c.status === 'negotiation').length || 0;
      const closedWonColleges = colleges?.filter(c => c.status === 'closed_won').length || 0;

      return {
        totalColleges,
        prospectColleges,
        negotiationColleges,
        closedWonColleges,
        totalContacts: contactsCount || 0,
        recentMeetings: recentMeetings || [],
        upcomingMeetings: upcomingMeetings || [],
      };
    },
  });
};
