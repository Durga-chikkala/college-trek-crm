import React, { useState } from 'react';
import { useMeetings, useCreateMeeting, useUpdateMeeting, useDeleteMeeting } from '@/hooks/useMeetings';
import { useColleges } from '@/hooks/useColleges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MeetingForm } from '@/components/meetings/MeetingForm';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  MoreVertical,
  Edit,
  Trash2,
  Video,
  Phone
} from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';

const Meetings = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<any>(null);
  
  const { data: meetings = [], isLoading } = useMeetings();
  const { data: colleges = [] } = useColleges();
  const deleteMeeting = useDeleteMeeting();

  const filteredMeetings = meetings.filter(meeting => 
    isSameDay(parseISO(meeting.meeting_date), selectedDate)
  );

  const upcomingMeetings = meetings
    .filter(meeting => new Date(meeting.meeting_date) > new Date())
    .sort((a, b) => new Date(a.meeting_date).getTime() - new Date(b.meeting_date).getTime())
    .slice(0, 5);

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'interested': return 'bg-green-100 text-green-800 border-green-200';
      case 'follow_up': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not_interested': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleEdit = (meeting: any) => {
    setEditingMeeting(meeting);
    setIsDialogOpen(true);
  };

  const handleDelete = (meetingId: string) => {
    if (confirm('Are you sure you want to delete this meeting?')) {
      deleteMeeting.mutate(meetingId);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingMeeting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-600 mt-2">Manage your college meetings and schedules</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </DialogTrigger>
          <MeetingForm 
            open={isDialogOpen}
            onOpenChange={handleDialogOpenChange}
            meeting={editingMeeting}
          />
        </Dialog>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  Meetings on {format(selectedDate, 'MMMM d, yyyy')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredMeetings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No meetings scheduled for this date</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMeetings.map((meeting) => (
                      <div key={meeting.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{meeting.title}</h3>
                              {meeting.outcome && (
                                <Badge className={getOutcomeColor(meeting.outcome)}>
                                  {meeting.outcome.replace('_', ' ')}
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {format(parseISO(meeting.meeting_date), 'h:mm a')}
                                {meeting.duration_minutes && ` (${meeting.duration_minutes} min)`}
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {meeting.college_name}
                              </div>
                              {meeting.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {meeting.location}
                                </div>
                              )}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(meeting)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Meeting
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(meeting.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Meeting
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="grid gap-4">
            {meetings.map((meeting) => (
              <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{meeting.title}</h3>
                        {meeting.outcome && (
                          <Badge className={getOutcomeColor(meeting.outcome)}>
                            {meeting.outcome.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          {format(parseISO(meeting.meeting_date), 'MMM d, yyyy h:mm a')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {meeting.college_name}
                        </div>
                        {meeting.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {meeting.location}
                          </div>
                        )}
                      </div>
                      {meeting.agenda && (
                        <p className="mt-2 text-gray-700">{meeting.agenda}</p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(meeting)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Meeting
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(meeting.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Meeting
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingMeetings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming meetings scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{meeting.title}</h3>
                        <p className="text-sm text-gray-600">{meeting.college_name}</p>
                        <p className="text-sm text-gray-500">
                          {format(parseISO(meeting.meeting_date), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Video className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Meetings;
