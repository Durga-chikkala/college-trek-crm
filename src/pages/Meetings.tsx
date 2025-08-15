
import React, { useState } from 'react';
import { useMeetings, useCreateMeeting, useUpdateMeeting, useDeleteMeeting } from '@/hooks/useMeetings';
import { useColleges } from '@/hooks/useColleges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Phone,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List
} from 'lucide-react';
import { format, isSameDay, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, startOfDay, addDays, isSameMonth } from 'date-fns';
import { AppLayout } from "@/components/layout/AppLayout";

const Meetings = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<any>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('week');
  
  const { data: meetings = [], isLoading } = useMeetings();
  const { data: colleges = [] } = useColleges();
  const deleteMeeting = useDeleteMeeting();

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  const getMeetingsForDay = (date: Date) => {
    return meetings.filter(meeting => 
      isSameDay(parseISO(meeting.meeting_date), date)
    );
  };

  const getMeetingAtTime = (date: Date, hour: number) => {
    return meetings.find(meeting => {
      const meetingDate = parseISO(meeting.meeting_date);
      return isSameDay(meetingDate, date) && meetingDate.getHours() === hour;
    });
  };

  const upcomingMeetings = meetings
    .filter(meeting => new Date(meeting.meeting_date) > new Date())
    .sort((a, b) => new Date(a.meeting_date).getTime() - new Date(b.meeting_date).getTime())
    .slice(0, 5);

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'interested': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'follow_up': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'not_interested': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
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
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading meetings...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-slate-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Meetings</h1>
            <p className="text-slate-600 mt-1">Manage your college meetings and schedules</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-slate-300 rounded-lg bg-white">
              <Button
                variant={view === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('month')}
                className={view === 'month' ? 'bg-blue-600 text-white' : 'text-slate-600'}
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Month
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('week')}
                className={view === 'week' ? 'bg-blue-600 text-white' : 'text-slate-600'}
              >
                <CalendarIcon className="h-4 w-4 mr-1" />
                Week
              </Button>
              <Button
                variant={view === 'day' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('day')}
                className={view === 'day' ? 'bg-blue-600 text-white' : 'text-slate-600'}
              >
                <List className="h-4 w-4 mr-1" />
                Day
              </Button>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Meeting
                </Button>
              </DialogTrigger>
              <MeetingForm 
                open={isDialogOpen}
                onOpenChange={handleDialogOpenChange}
                meeting={editingMeeting}
              />
            </Dialog>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
              className="border-slate-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold text-slate-900">
              {view === 'week' 
                ? `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
                : format(currentWeek, 'MMMM yyyy')
              }
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
              className="border-slate-300"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentWeek(new Date())}
            className="border-slate-300"
          >
            Today
          </Button>
        </div>

        {/* Teams-style Calendar View */}
        {view === 'week' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            {/* Week Header */}
            <div className="grid grid-cols-8 border-b border-slate-200">
              <div className="p-3 text-xs font-medium text-slate-500 border-r border-slate-200">
                Time
              </div>
              {weekDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className={`p-3 text-center border-r border-slate-200 last:border-r-0 ${
                    isSameDay(day, new Date()) ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="text-xs font-medium text-slate-500 uppercase">
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-lg font-semibold mt-1 ${
                    isSameDay(day, new Date()) ? 'text-blue-600' : 'text-slate-900'
                  }`}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="max-h-96 overflow-y-auto">
              {timeSlots.slice(6, 20).map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-slate-100 hover:bg-slate-50">
                  <div className="p-2 text-xs text-slate-500 border-r border-slate-200 text-center">
                    {format(new Date().setHours(hour, 0, 0, 0), 'h:mm a')}
                  </div>
                  {weekDays.map((day) => {
                    const meeting = getMeetingAtTime(day, hour);
                    return (
                      <div
                        key={`${day.toISOString()}-${hour}`}
                        className="p-1 border-r border-slate-200 last:border-r-0 min-h-[60px] relative"
                      >
                        {meeting && (
                          <div className="bg-blue-100 border border-blue-200 rounded p-1 text-xs cursor-pointer hover:bg-blue-200 transition-colors">
                            <div className="font-medium text-blue-900 truncate">
                              {meeting.title}
                            </div>
                            <div className="text-blue-700 truncate">
                              {meeting.college_name}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute top-1 right-1 h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                                >
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(meeting)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(meeting.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Day View */}
        {view === 'day' && (
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getMeetingsForDay(selectedDate).length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No meetings scheduled for this date</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getMeetingsForDay(selectedDate).map((meeting) => (
                        <div key={meeting.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg text-slate-900">{meeting.title}</h3>
                                {meeting.outcome && (
                                  <Badge className={getOutcomeColor(meeting.outcome)}>
                                    {meeting.outcome.replace('_', ' ')}
                                  </Badge>
                                )}
                              </div>
                              <div className="space-y-1 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-blue-500" />
                                  {format(parseISO(meeting.meeting_date), 'h:mm a')}
                                  {meeting.duration_minutes && ` (${meeting.duration_minutes} min)`}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-green-500" />
                                  {meeting.college_name}
                                </div>
                                {meeting.location && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-orange-500" />
                                    {meeting.location}
                                  </div>
                                )}
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
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

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                    <Video className="h-4 w-4 mr-2" />
                    Start Video Call
                  </Button>
                  <Button variant="outline" className="w-full border-slate-300" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Make Phone Call
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Upcoming Meetings */}
        {view === 'month' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-slate-900">Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingMeetings.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming meetings scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white hover:shadow-sm transition-shadow">
                      <div>
                        <h3 className="font-semibold text-slate-900">{meeting.title}</h3>
                        <p className="text-sm text-slate-600">{meeting.college_name}</p>
                        <p className="text-sm text-slate-500">
                          {format(parseISO(meeting.meeting_date), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Video className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                        <Button size="sm" variant="outline" className="border-slate-300">
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
        )}
      </div>
    </AppLayout>
  );
};

export default Meetings;
