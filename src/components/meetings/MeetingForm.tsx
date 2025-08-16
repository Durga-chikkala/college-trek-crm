
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateMeeting, useUpdateMeeting } from "@/hooks/useMeetings";
import { useColleges } from "@/hooks/useColleges";
import { formatToIST, parseFromIST } from "@/utils/timezone";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

interface MeetingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting?: Tables<'meetings'> & { college_name?: string };
}

type MeetingFormData = {
  title: string;
  college_id: string;
  meeting_date: string;
  agenda?: string;
  discussion_notes?: string;
  outcome?: "interested" | "follow_up" | "not_interested";
  duration_minutes?: number;
  location?: string;
  next_follow_up_date?: string;
};

export const MeetingForm = ({ open, onOpenChange, meeting }: MeetingFormProps) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<MeetingFormData>({
    defaultValues: meeting ? {
      title: meeting.title,
      college_id: meeting.college_id,
      meeting_date: formatToIST(meeting.meeting_date),
      agenda: meeting.agenda || '',
      discussion_notes: meeting.discussion_notes || '',
      outcome: meeting.outcome || undefined,
      duration_minutes: meeting.duration_minutes || undefined,
      location: meeting.location || '',
      next_follow_up_date: meeting.next_follow_up_date || undefined
    } : {}
  });

  const createMeeting = useCreateMeeting();
  const updateMeeting = useUpdateMeeting();
  const { data: colleges = [] } = useColleges();
  const collegeId = watch('college_id');
  const outcome = watch('outcome');

  const onSubmit = async (data: MeetingFormData) => {
    const meetingData = {
      ...data,
      meeting_date: parseFromIST(data.meeting_date).toISOString()
    };

    if (meeting) {
      await updateMeeting.mutateAsync({ id: meeting.id, ...meetingData });
    } else {
      await createMeeting.mutateAsync(meetingData as TablesInsert<'meetings'>);
    }
    reset();
    onOpenChange(false);
  };

  const isLoading = createMeeting.isPending || updateMeeting.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            {meeting ? "Edit Meeting" : "Schedule New Meeting"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-foreground">Meeting Title *</Label>
              <Input
                id="title"
                {...register("title", { required: true })}
                placeholder="Enter meeting title"
                className="border-border/50 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="college_id" className="text-sm font-medium text-foreground">College *</Label>
              <Select value={collegeId} onValueChange={(value) => setValue('college_id', value)}>
                <SelectTrigger className="border-border/50 focus:border-primary">
                  <SelectValue placeholder="Select college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((college) => (
                    <SelectItem key={college.id} value={college.id}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="meeting_date" className="text-sm font-medium text-foreground">
                Meeting Date & Time (IST) *
              </Label>
              <Input
                id="meeting_date"
                type="datetime-local"
                {...register("meeting_date", { required: true })}
                className="border-border/50 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration_minutes" className="text-sm font-medium text-foreground">Duration (minutes)</Label>
              <Input
                id="duration_minutes"
                type="number"
                {...register("duration_minutes", { valueAsNumber: true })}
                placeholder="e.g., 60"
                className="border-border/50 focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-foreground">Location</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="Meeting location or video call link"
              className="border-border/50 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agenda" className="text-sm font-medium text-foreground">Agenda</Label>
            <Textarea
              id="agenda"
              {...register("agenda")}
              placeholder="Meeting agenda and objectives"
              rows={3}
              className="border-border/50 focus:border-primary resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discussion_notes" className="text-sm font-medium text-foreground">Discussion Notes</Label>
            <Textarea
              id="discussion_notes"
              {...register("discussion_notes")}
              placeholder="Key discussion points and notes"
              rows={3}
              className="border-border/50 focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="outcome" className="text-sm font-medium text-foreground">Outcome</Label>
              <Select value={outcome} onValueChange={(value) => setValue('outcome', value as any)}>
                <SelectTrigger className="border-border/50 focus:border-primary">
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interested">✅ Interested</SelectItem>
                  <SelectItem value="follow_up">📞 Follow Up</SelectItem>
                  <SelectItem value="not_interested">❌ Not Interested</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="next_follow_up_date" className="text-sm font-medium text-foreground">Next Follow-up Date</Label>
              <Input
                id="next_follow_up_date"
                type="date"
                {...register("next_follow_up_date")}
                className="border-border/50 focus:border-primary"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-border/20">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="order-1 sm:order-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {isLoading ? (meeting ? "Updating..." : "Scheduling...") : (meeting ? "Update Meeting" : "Schedule Meeting")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
