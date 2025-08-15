
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateMeeting } from "@/hooks/useMeetings";
import { useColleges } from "@/hooks/useColleges";
import { Meeting, MeetingOutcome } from "@/types/database";

interface MeetingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type MeetingFormData = Omit<Meeting, 'id' | 'created_at' | 'updated_at' | 'created_by'>;

export const MeetingForm = ({ open, onOpenChange }: MeetingFormProps) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<MeetingFormData>();
  const createMeeting = useCreateMeeting();
  const { data: colleges = [] } = useColleges();
  const collegeId = watch('college_id');
  const outcome = watch('outcome');

  const onSubmit = async (data: MeetingFormData) => {
    await createMeeting.mutateAsync(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Meeting</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title *</Label>
              <Input
                id="title"
                {...register("title", { required: true })}
                placeholder="Enter meeting title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="college_id">College *</Label>
              <Select value={collegeId} onValueChange={(value) => setValue('college_id', value)}>
                <SelectTrigger>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meeting_date">Meeting Date & Time *</Label>
              <Input
                id="meeting_date"
                type="datetime-local"
                {...register("meeting_date", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duration (minutes)</Label>
              <Input
                id="duration_minutes"
                type="number"
                {...register("duration_minutes", { valueAsNumber: true })}
                placeholder="e.g., 60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="Meeting location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agenda">Agenda</Label>
            <Textarea
              id="agenda"
              {...register("agenda")}
              placeholder="Meeting agenda and objectives"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discussion_notes">Discussion Notes</Label>
            <Textarea
              id="discussion_notes"
              {...register("discussion_notes")}
              placeholder="Key discussion points and notes"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="outcome">Outcome</Label>
              <Select value={outcome} onValueChange={(value: MeetingOutcome) => setValue('outcome', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interested">Interested</SelectItem>
                  <SelectItem value="follow_up">Follow Up</SelectItem>
                  <SelectItem value="not_interested">Not Interested</SelectItem>
                  <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                  <SelectItem value="deal_closed">Deal Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="next_follow_up_date">Next Follow-up Date</Label>
              <Input
                id="next_follow_up_date"
                type="date"
                {...register("next_follow_up_date")}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMeeting.isPending}>
              {createMeeting.isPending ? "Adding..." : "Add Meeting"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
