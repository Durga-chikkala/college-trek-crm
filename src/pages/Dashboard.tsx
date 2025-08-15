
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, UserPlus, CalendarPlus, Building2, Users, Calendar, TrendingUp, ArrowUpRight } from "lucide-react";
import { CollegeForm } from "@/components/colleges/CollegeForm";
import { ContactForm } from "@/components/contacts/ContactForm";
import { MeetingForm } from "@/components/meetings/MeetingForm";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { format, parseISO } from "date-fns";

export default function Dashboard() {
  const { loading: authLoading } = useAuth();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const [showCollegeForm, setShowCollegeForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);

  const loading = authLoading || statsLoading;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-slate-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Welcome back! Here's your CRM overview.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button 
              onClick={() => setShowCollegeForm(true)} 
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add College
            </Button>
            <Button 
              onClick={() => setShowContactForm(true)} 
              variant="outline"
              className="w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
            <Button 
              onClick={() => setShowMeetingForm(true)} 
              variant="outline"
              className="w-full sm:w-auto"
            >
              <CalendarPlus className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600">Total Colleges</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-600">
                    {stats?.totalColleges || 0}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600">Total Contacts</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">
                    {stats?.totalContacts || 0}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+8% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600">Upcoming Meetings</p>
                  <p className="text-lg sm:text-2xl font-bold text-purple-600">
                    {stats?.upcomingMeetings?.length || 0}
                  </p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs text-orange-600">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                <span>3 this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600">Closed Won</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">
                    {stats?.closedWonColleges || 0}
                  </p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+15% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Sales Pipeline</CardTitle>
              <CardDescription>Track your college prospects by status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-orange-900">Prospects</p>
                  <p className="text-sm text-orange-700">New opportunities</p>
                </div>
                <Badge className="bg-orange-100 text-orange-800">
                  {stats?.prospectColleges || 0}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-900">In Negotiation</p>
                  <p className="text-sm text-yellow-700">Active discussions</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">
                  {stats?.negotiationColleges || 0}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Closed Won</p>
                  <p className="text-sm text-green-700">Successful partnerships</p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {stats?.closedWonColleges || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
              <CardDescription>Your next scheduled meetings</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.upcomingMeetings && stats.upcomingMeetings.length > 0 ? (
                <div className="space-y-3">
                  {stats.upcomingMeetings.slice(0, 4).map((meeting: any) => (
                    <div key={meeting.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 truncate">{meeting.title}</p>
                        <p className="text-sm text-slate-600 truncate">
                          {meeting.colleges?.name || meeting.college_name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {format(parseISO(meeting.meeting_date), 'MMM d, h:mm a')}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full ml-3"></div>
                    </div>
                  ))}
                  {stats.upcomingMeetings.length > 4 && (
                    <Button variant="outline" size="sm" className="w-full">
                      View all {stats.upcomingMeetings.length} meetings
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No upcoming meetings</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setShowMeetingForm(true)}
                  >
                    Schedule a meeting
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest updates from your CRM</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentMeetings && stats.recentMeetings.length > 0 ? (
              <div className="space-y-3">
                {stats.recentMeetings.slice(0, 5).map((meeting: any) => (
                  <div key={meeting.id} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        Meeting: {meeting.title}
                      </p>
                      <p className="text-sm text-slate-600">
                        with {meeting.colleges?.name || meeting.college_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {format(parseISO(meeting.meeting_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    {meeting.outcome && (
                      <Badge className={`text-xs ${
                        meeting.outcome === 'interested' ? 'bg-green-100 text-green-800' :
                        meeting.outcome === 'follow_up' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {meeting.outcome.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500">
                <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
                <p className="text-xs">Start by adding colleges and contacts</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Forms */}
        <CollegeForm open={showCollegeForm} onOpenChange={setShowCollegeForm} />
        <ContactForm open={showContactForm} onOpenChange={setShowContactForm} />
        <MeetingForm open={showMeetingForm} onOpenChange={setShowMeetingForm} />
      </div>
    </AppLayout>
  );
}
