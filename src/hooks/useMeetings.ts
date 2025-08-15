
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { TablesInsert } from "@/integrations/supabase/types";

export const useMeetings = () => {
  return useQuery({
    queryKey: ['meetings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meetings')
        .select(`
          *,
          colleges!inner(name)
        `)
        .order('meeting_date', { ascending: false });

      if (error) {
        console.error('Error fetching meetings:', error);
        throw error;
      }

      return data?.map(meeting => ({
        ...meeting,
        college_name: meeting.colleges.name
      })) || [];
    },
  });
};

export const useCreateMeeting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (meeting: TablesInsert<'meetings'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('meetings')
        .insert([{ ...meeting, created_by: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast({ title: "Success", description: "Meeting added successfully" });
    },
    onError: (error) => {
      console.error('Error creating meeting:', error);
      toast({ title: "Error", description: "Failed to add meeting", variant: "destructive" });
    },
  });
};
