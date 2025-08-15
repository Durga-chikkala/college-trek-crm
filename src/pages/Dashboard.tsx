
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Calendar, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { format } from "date-fns";

const Dashboard = () => {
  const { data: stats, isLoading } = useDashboardStats();

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
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Overview of your sales pipeline and activities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Colleges</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalColleges}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.prospectColleges} prospects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Negotiation</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.negotiationColleges}</div>
              <p className="text-xs text-muted-foreground">
                Active negotiations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Closed Won</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.closedWonColleges}</div>
              <p className="text-xs text-muted-foreground">
                Successful deals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalContacts}</div>
              <p className="text-xs text-muted-foreground">
                College contacts
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Meetings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Meetings</CardTitle>
              <CardDescription>Your latest college meetings</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.recentMeetings.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent meetings</p>
              ) : (
                <div className="space-y-4">
                  {stats?.recentMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-start space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{meeting.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {meeting.colleges?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(meeting.meeting_date), 'PPP')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Meetings */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>Your scheduled meetings</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.upcomingMeetings.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming meetings</p>
              ) : (
                <div className="space-y-4">
                  {stats?.upcomingMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-start space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{meeting.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {meeting.colleges?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(meeting.meeting_date), 'PPP p')}
                        </p>
                        {meeting.location && (
                          <p className="text-xs text-muted-foreground">
                            📍 {meeting.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
