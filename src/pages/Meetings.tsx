
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Calendar, Plus, Search, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MeetingForm } from "@/components/meetings/MeetingForm";
import { useMeetings } from "@/hooks/useMeetings";
import { MeetingOutcome } from "@/types/database";
import { format } from "date-fns";

const Meetings = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: meetings = [], isLoading } = useMeetings();

  const filteredMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.college_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOutcomeColor = (outcome?: MeetingOutcome) => {
    switch (outcome) {
      case 'interested': return 'bg-green-100 text-green-800';
      case 'follow_up': return 'bg-yellow-100 text-yellow-800';
      case 'not_interested': return 'bg-red-100 text-red-800';
      case 'proposal_sent': return 'bg-blue-100 text-blue-800';
      case 'deal_closed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOutcomeLabel = (outcome?: MeetingOutcome) => {
    switch (outcome) {
      case 'interested': return 'Interested';
      case 'follow_up': return 'Follow Up';
      case 'not_interested': return 'Not Interested';
      case 'proposal_sent': return 'Proposal Sent';
      case 'deal_closed': return 'Deal Closed';
      default: return 'Pending';
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Meetings</h1>
            <p className="text-slate-600">Track your college visits and follow-ups</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Meeting
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredMeetings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {meetings.length === 0 ? "No meetings logged" : "No meetings match your search"}
            </h3>
            <p className="text-slate-500 mb-4">
              {meetings.length === 0 ? "Start by logging your first college meeting" : "Try adjusting your search terms"}
            </p>
            {meetings.length === 0 && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Meeting
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeetings.map((meeting) => (
              <Card key={meeting.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">{meeting.title}</CardTitle>
                      <p className="text-sm text-blue-600 font-medium">{meeting.college_name}</p>
                    </div>
                    {meeting.outcome && (
                      <Badge className={getOutcomeColor(meeting.outcome)}>
                        {getOutcomeLabel(meeting.outcome)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(meeting.meeting_date), 'PPP')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {format(new Date(meeting.meeting_date), 'p')}
                      {meeting.duration_minutes && ` (${meeting.duration_minutes} min)`}
                    </span>
                  </div>

                  {meeting.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{meeting.location}</span>
                    </div>
                  )}

                  {meeting.agenda && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-1">Agenda:</p>
                      <p className="text-sm text-gray-600">{meeting.agenda}</p>
                    </div>
                  )}

                  {meeting.discussion_notes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                      <p className="text-sm text-gray-600">{meeting.discussion_notes}</p>
                    </div>
                  )}

                  {meeting.next_follow_up_date && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-1">Next Follow-up:</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(meeting.next_follow_up_date), 'PPP')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <MeetingForm open={showForm} onOpenChange={setShowForm} />
      </div>
    </AppLayout>
  );
};

export default Meetings;
