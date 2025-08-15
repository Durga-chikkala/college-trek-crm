
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Get colleges count by status with timestamps
      const { data: colleges, error: collegesError } = await supabase
        .from('colleges')
        .select('status, created_at');

      if (collegesError) throw collegesError;

      // Get contacts with timestamps
      const { data: contacts, error: contactsError } = await supabase
        .from('contacts')
        .select('created_at');

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

      // Calculate current month and last month dates
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Calculate stats
      const totalColleges = colleges?.length || 0;
      const prospectColleges = colleges?.filter(c => c.status === 'prospect').length || 0;
      const negotiationColleges = colleges?.filter(c => c.status === 'negotiation').length || 0;
      const closedWonColleges = colleges?.filter(c => c.status === 'closed_won').length || 0;
      const totalContacts = contacts?.length || 0;

      // Calculate growth percentages
      const currentMonthColleges = colleges?.filter(c => 
        new Date(c.created_at) >= currentMonthStart
      ).length || 0;
      
      const lastMonthColleges = colleges?.filter(c => 
        new Date(c.created_at) >= lastMonthStart && new Date(c.created_at) <= lastMonthEnd
      ).length || 0;

      const currentMonthContacts = contacts?.filter(c => 
        new Date(c.created_at) >= currentMonthStart
      ).length || 0;
      
      const lastMonthContacts = contacts?.filter(c => 
        new Date(c.created_at) >= lastMonthStart && new Date(c.created_at) <= lastMonthEnd
      ).length || 0;

      const collegeGrowthPercentage = lastMonthColleges > 0 
        ? Math.round(((currentMonthColleges - lastMonthColleges) / lastMonthColleges) * 100)
        : currentMonthColleges > 0 ? 100 : 0;

      const contactGrowthPercentage = lastMonthContacts > 0 
        ? Math.round(((currentMonthContacts - lastMonthContacts) / lastMonthContacts) * 100)
        : currentMonthContacts > 0 ? 100 : 0;

      const closedWonGrowthPercentage = Math.round(Math.random() * 20 + 5); // Placeholder for closed won growth

      return {
        totalColleges,
        prospectColleges,
        negotiationColleges,
        closedWonColleges,
        totalContacts,
        recentMeetings: recentMeetings || [],
        upcomingMeetings: upcomingMeetings || [],
        collegeGrowthPercentage,
        contactGrowthPercentage,
        closedWonGrowthPercentage,
        upcomingMeetingsCount: upcomingMeetings?.length || 0,
      };
    },
  });
};
