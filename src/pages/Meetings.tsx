
import React, { useState } from 'react';
import { useMeetings, useDeleteMeeting } from '@/hooks/useMeetings';
import { useColleges } from '@/hooks/useColleges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
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
  List,
  Zap,
  Star
} from 'lucide-react';
import { format, isSameDay, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, startOfMonth, endOfMonth, eachWeekOfInterval, getWeek } from 'date-fns';
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

  const monthStart = startOfMonth(currentWeek);
  const monthEnd = endOfMonth(currentWeek);
  const monthWeeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 1 });

  const timeSlots = Array.from({ length: 14 }, (_, i) => i + 6); // 6 AM to 8 PM

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
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getMeetingTypeColor = (title: string) => {
    const colors = [
      'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500', 
      'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-red-500'
    ];
    const hash = title.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading meetings...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Meetings
              </h1>
              <p className="text-muted-foreground mt-1">Manage your college meetings and schedules</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex border border-border rounded-lg bg-card shadow-sm">
                <Button
                  variant={view === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('month')}
                  className={`rounded-r-none ${view === 'month' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Grid3X3 className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Month</span>
                </Button>
                <Button
                  variant={view === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('week')}
                  className={`rounded-none border-x ${view === 'week' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Week</span>
                </Button>
                <Button
                  variant={view === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('day')}
                  className={`rounded-l-none ${view === 'day' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <List className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Day</span>
                </Button>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg w-full sm:w-auto">
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
        </div>

        {/* Calendar Navigation */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-card to-card/95">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                  className="h-10 w-10 rounded-full hover:bg-muted/80"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  {view === 'week' 
                    ? `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
                    : view === 'month'
                    ? format(currentWeek, 'MMMM yyyy')
                    : format(selectedDate, 'EEEE, MMMM d, yyyy')
                  }
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                  className="h-10 w-10 rounded-full hover:bg-muted/80"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentWeek(new Date())}
                className="border-primary/20 hover:bg-primary/5"
              >
                Today
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Teams-style Week View */}
        {view === 'week' && (
          <Card className="shadow-xl border-0 overflow-hidden">
            {/* Week Header */}
            <div className="grid grid-cols-8 bg-gradient-to-r from-muted/50 to-muted/30">
              <div className="p-3 sm:p-4 text-xs font-medium text-muted-foreground border-r border-border/50 bg-card/80">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
              {weekDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className={`p-3 sm:p-4 text-center border-r border-border/50 last:border-r-0 transition-colors ${
                    isSameDay(day, new Date()) 
                      ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20' 
                      : 'hover:bg-muted/30'
                  }`}
                >
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-lg sm:text-xl font-bold mt-1 ${
                    isSameDay(day, new Date()) 
                      ? 'text-primary' 
                      : 'text-foreground'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {getMeetingsForDay(day).length} meetings
                  </div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="max-h-[500px] overflow-y-auto bg-gradient-to-br from-background to-muted/5">
              {timeSlots.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-border/30 hover:bg-muted/20 transition-colors group">
                  <div className="p-2 sm:p-3 text-xs text-muted-foreground border-r border-border/50 text-center bg-card/50 group-hover:bg-card/80 transition-colors">
                    <div className="font-medium">
                      {format(new Date().setHours(hour, 0, 0, 0), 'h:mm')}
                    </div>
                    <div className="text-[10px] opacity-70">
                      {format(new Date().setHours(hour, 0, 0, 0), 'a')}
                    </div>
                  </div>
                  {weekDays.map((day) => {
                    const meeting = getMeetingAtTime(day, hour);
                    return (
                      <div
                        key={`${day.toISOString()}-${hour}`}
                        className="p-1 sm:p-2 border-r border-border/50 last:border-r-0 min-h-[60px] sm:min-h-[70px] relative group/cell hover:bg-muted/10 transition-colors"
                      >
                        {meeting && (
                          <div className={`${getMeetingTypeColor(meeting.title)} bg-opacity-90 border border-white/20 rounded-lg p-2 text-xs cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-white group relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                            <div className="relative z-10">
                              <div className="font-semibold truncate mb-1 flex items-center gap-1">
                                <Zap className="h-3 w-3 flex-shrink-0" />
                                {meeting.title}
                              </div>
                              <div className="opacity-90 truncate text-[10px] sm:text-xs">
                                {meeting.college_name}
                              </div>
                              <div className="flex items-center gap-1 mt-1 opacity-80">
                                <Clock className="h-2 w-2" />
                                <span className="text-[10px]">
                                  {meeting.duration_minutes ? `${meeting.duration_minutes}min` : '60min'}
                                </span>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/40 text-white"
                                >
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="shadow-xl border-0">
                                <DropdownMenuItem onClick={() => handleEdit(meeting)} className="gap-2">
                                  <Edit className="h-4 w-4" />
                                  Edit Meeting
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(meeting.id)}
                                  className="text-destructive gap-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete Meeting
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
          </Card>
        )}

        {/* Enhanced Month View */}
        {view === 'month' && (
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-7 bg-gradient-to-r from-muted/50 to-muted/30">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="p-3 text-center text-xs font-semibold text-muted-foreground border-r border-border/50 last:border-r-0 bg-card/80">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {monthWeeks.map((week) => 
                  eachDayOfInterval({ start: week, end: endOfWeek(week, { weekStartsOn: 1 }) }).map((day) => {
                    const dayMeetings = getMeetingsForDay(day);
                    const isCurrentMonth = format(day, 'M') === format(currentWeek, 'M');
                    const isToday = isSameDay(day, new Date());
                    
                    return (
                      <div
                        key={day.toISOString()}
                        className={`min-h-[100px] sm:min-h-[120px] p-2 border-r border-b border-border/30 last:border-r-0 transition-colors hover:bg-muted/20 ${
                          !isCurrentMonth ? 'bg-muted/10 text-muted-foreground' : 'bg-background'
                        } ${isToday ? 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20' : ''}`}
                      >
                        <div className={`text-sm font-semibold mb-2 ${
                          isToday ? 'text-primary' : isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {format(day, 'd')}
                        </div>
                        <div className="space-y-1">
                          {dayMeetings.slice(0, 3).map((meeting) => (
                            <div
                              key={meeting.id}
                              className={`${getMeetingTypeColor(meeting.title)} bg-opacity-80 text-white rounded px-2 py-1 text-xs truncate cursor-pointer hover:shadow-md transition-all`}
                              onClick={() => handleEdit(meeting)}
                            >
                              <div className="flex items-center gap-1">
                                <Star className="h-2 w-2 flex-shrink-0" />
                                {meeting.title}
                              </div>
                            </div>
                          ))}
                          {dayMeetings.length > 3 && (
                            <div className="text-xs text-muted-foreground text-center py-1">
                              +{dayMeetings.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Day View */}
        {view === 'day' && (
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-card to-card/95">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {getMeetingsForDay(selectedDate).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg mb-2">No meetings scheduled</p>
                      <p className="text-sm">Your day is free!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getMeetingsForDay(selectedDate).map((meeting) => (
                        <Card key={meeting.id} className="border-l-4 border-l-primary hover:shadow-lg transition-all duration-200 group">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className={`w-3 h-3 rounded-full ${getMeetingTypeColor(meeting.title)}`}></div>
                                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                                    {meeting.title}
                                  </h3>
                                  {meeting.outcome && (
                                    <Badge className={getOutcomeColor(meeting.outcome)}>
                                      {meeting.outcome.replace('_', ' ')}
                                    </Badge>
                                  )}
                                </div>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    {format(parseISO(meeting.meeting_date), 'h:mm a')}
                                    {meeting.duration_minutes && ` (${meeting.duration_minutes} min)`}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-emerald-500" />
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
                                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="shadow-xl">
                                  <DropdownMenuItem onClick={() => handleEdit(meeting)} className="gap-2">
                                    <Edit className="h-4 w-4" />
                                    Edit Meeting
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDelete(meeting.id)}
                                    className="text-destructive gap-2"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Meeting
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/95">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
                    <Video className="h-4 w-4 mr-2" />
                    Start Video Call
                  </Button>
                  <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5">
                    <Phone className="h-4 w-4 mr-2" />
                    Make Phone Call
                  </Button>
                  <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Follow-up
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/95">
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingMeetings.slice(0, 3).map((meeting) => (
                    <div key={meeting.id} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                      <div className={`w-2 h-2 rounded-full ${getMeetingTypeColor(meeting.title)}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{meeting.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(meeting.meeting_date), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Meetings;
