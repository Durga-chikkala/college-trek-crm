
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, UserPlus, CalendarPlus, Building2, Users, Calendar, TrendingUp, ArrowUpRight, TrendingDown } from "lucide-react";
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background min-h-screen">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">Welcome back! Here's your CRM overview.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button 
                onClick={() => setShowCollegeForm(true)} 
                className="w-full sm:w-auto"
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Colleges</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-600">
                    {stats?.totalColleges || 0}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs">
                {(stats?.collegeGrowthPercentage || 0) >= 0 ? (
                  <>
                    <TrendingUp className="w-3 h-3 mr-1 text-emerald-600" />
                    <span className="text-emerald-600">+{stats?.collegeGrowthPercentage || 0}% from last month</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
                    <span className="text-red-600">{stats?.collegeGrowthPercentage || 0}% from last month</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Contacts</p>
                  <p className="text-lg sm:text-2xl font-bold text-emerald-600">
                    {stats?.totalContacts || 0}
                  </p>
                </div>
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs">
                {(stats?.contactGrowthPercentage || 0) >= 0 ? (
                  <>
                    <TrendingUp className="w-3 h-3 mr-1 text-emerald-600" />
                    <span className="text-emerald-600">+{stats?.contactGrowthPercentage || 0}% from last month</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
                    <span className="text-red-600">{stats?.contactGrowthPercentage || 0}% from last month</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Upcoming Meetings</p>
                  <p className="text-lg sm:text-2xl font-bold text-purple-600">
                    {stats?.upcomingMeetingsCount || 0}
                  </p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs text-orange-600">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                <span>This week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Closed Won</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">
                    {stats?.closedWonColleges || 0}
                  </p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs text-emerald-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+{stats?.closedWonGrowthPercentage || 15}% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Status and Upcoming Meetings */}
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
              
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                <div>
                  <p className="font-medium text-emerald-900">Closed Won</p>
                  <p className="text-sm text-emerald-700">Successful partnerships</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800">
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
                    <div key={meeting.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">{meeting.title}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {meeting.colleges?.name || meeting.college_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(meeting.meeting_date), 'MMM d, h:mm a')}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-primary rounded-full ml-3 flex-shrink-0"></div>
                    </div>
                  ))}
                  {stats.upcomingMeetings.length > 4 && (
                    <Button variant="outline" size="sm" className="w-full">
                      View all {stats.upcomingMeetings.length} meetings
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
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
                  <div key={meeting.id} className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        Meeting: {meeting.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        with {meeting.colleges?.name || meeting.college_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(meeting.meeting_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    {meeting.outcome && (
                      <Badge className={`text-xs ${
                        meeting.outcome === 'interested' ? 'bg-emerald-100 text-emerald-800' :
                        meeting.outcome === 'follow_up' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {meeting.outcome.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
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
