
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, UserPlus, CalendarPlus, Building2, Users, Calendar, TrendingUp, ArrowUpRight, TrendingDown, Phone, Mail, MessageSquare, Share2, Bell, Filter } from "lucide-react";
import { CollegeForm } from "@/components/colleges/CollegeForm";
import { ContactForm } from "@/components/contacts/ContactForm";
import { MeetingForm } from "@/components/meetings/MeetingForm";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { format, parseISO } from "date-fns";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { loading: authLoading } = useAuth();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const [showCollegeForm, setShowCollegeForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);

  const loading = authLoading || statsLoading;

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'call':
        toast({ title: 'Call feature coming soon!', description: 'We\'re working on VoIP integration.' });
        break;
      case 'email':
        toast({ title: 'Email client opening...', description: 'Redirecting to your default email client.' });
        break;
      case 'sms':
        toast({ title: 'SMS feature coming soon!', description: 'We\'re integrating SMS capabilities.' });
        break;
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: 'College Trek CRM',
            text: 'Check out my CRM dashboard',
            url: window.location.href
          });
        } else {
          navigator.clipboard.writeText(window.location.href);
          toast({ title: 'Link copied!', description: 'Dashboard link copied to clipboard.' });
        }
        break;
      case 'notifications':
        toast({ title: 'Notifications', description: 'You have 3 pending follow-ups.' });
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="mobile-container space-y-4 sm:space-y-6">
          {/* Enhanced Header with Quick Actions */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Good Morning! 👋
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    Here's your CRM overview for today
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction('notifications')}
                    className="mobile-tap"
                  >
                    <Bell className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction('share')}
                    className="mobile-tap"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={() => setShowCollegeForm(true)} 
                  className="gradient-primary text-white mobile-tap flex-1 sm:flex-none"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add College
                </Button>
                <Button 
                  onClick={() => setShowContactForm(true)} 
                  variant="outline"
                  className="mobile-tap flex-1 sm:flex-none"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
                <Button 
                  onClick={() => setShowMeetingForm(true)} 
                  variant="outline"
                  className="mobile-tap flex-1 sm:flex-none"
                >
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              </div>

              {/* Communication Quick Actions */}
              <div className="flex gap-2 sm:gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleQuickAction('call')}
                  className="mobile-tap flex-1 sm:flex-none"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Quick Call</span>
                  <span className="sm:hidden">Call</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleQuickAction('email')}
                  className="mobile-tap flex-1 sm:flex-none"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Send Email</span>
                  <span className="sm:hidden">Email</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleQuickAction('sms')}
                  className="mobile-tap flex-1 sm:flex-none"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Send SMS</span>
                  <span className="sm:hidden">SMS</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards with Better Mobile Design */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="mobile-card hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Colleges</p>
                    <p className="text-lg sm:text-2xl font-bold text-blue-600">
                      {stats?.totalColleges || 0}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-xs">
                  {(stats?.collegeGrowthPercentage || 0) >= 0 ? (
                    <>
                      <TrendingUp className="w-3 h-3 mr-1 text-emerald-600" />
                      <span className="text-emerald-600">+{stats?.collegeGrowthPercentage || 0}% this month</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
                      <span className="text-red-600">{stats?.collegeGrowthPercentage || 0}% this month</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="mobile-card hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Contacts</p>
                    <p className="text-lg sm:text-2xl font-bold text-emerald-600">
                      {stats?.totalContacts || 0}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 gradient-success rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-xs">
                  {(stats?.contactGrowthPercentage || 0) >= 0 ? (
                    <>
                      <TrendingUp className="w-3 h-3 mr-1 text-emerald-600" />
                      <span className="text-emerald-600">+{stats?.contactGrowthPercentage || 0}% this month</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
                      <span className="text-red-600">{stats?.contactGrowthPercentage || 0}% this month</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="mobile-card hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Upcoming Meetings</p>
                    <p className="text-lg sm:text-2xl font-bold text-purple-600">
                      {stats?.upcomingMeetingsCount || 0}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-xs text-purple-600">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  <span>This week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="mobile-card hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Success Rate</p>
                    <p className="text-lg sm:text-2xl font-bold text-orange-600">
                      {stats?.totalColleges ? Math.round(((stats?.closedWonColleges || 0) / stats.totalColleges) * 100) : 0}%
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 gradient-warning rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-xs text-emerald-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>Great performance!</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Pipeline and Meetings Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="mobile-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Sales Pipeline</CardTitle>
                    <CardDescription>Track your college prospects by status</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="mobile-tap">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-medium text-orange-900">Prospects</p>
                    <p className="text-sm text-orange-700">New opportunities</p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                    {stats?.prospectColleges || 0}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
                  <div>
                    <p className="font-medium text-yellow-900">In Negotiation</p>
                    <p className="text-sm text-yellow-700">Active discussions</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    {stats?.negotiationColleges || 0}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                  <div>
                    <p className="font-medium text-emerald-900">Closed Won</p>
                    <p className="text-sm text-emerald-700">Successful partnerships</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    {stats?.closedWonColleges || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="mobile-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
                    <CardDescription>Your next scheduled meetings</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowMeetingForm(true)} className="mobile-tap">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="custom-scrollbar max-h-80 overflow-y-auto">
                {stats?.upcomingMeetings && stats.upcomingMeetings.length > 0 ? (
                  <div className="space-y-3">
                    {stats.upcomingMeetings.slice(0, 4).map((meeting: any) => (
                      <div key={meeting.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors mobile-tap">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">{meeting.title}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {meeting.colleges?.name || meeting.college_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(meeting.meeting_date), 'MMM d, h:mm a')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          <Button variant="ghost" size="sm" className="mobile-tap">
                            <Phone className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {stats.upcomingMeetings.length > 4 && (
                      <Button variant="outline" size="sm" className="w-full mobile-tap">
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
                      className="mt-2 mobile-tap"
                      onClick={() => setShowMeetingForm(true)}
                    >
                      Schedule a meeting
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Recent Activity */}
          <Card className="mobile-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest updates from your CRM</CardDescription>
            </CardHeader>
            <CardContent className="custom-scrollbar max-h-96 overflow-y-auto">
              {stats?.recentMeetings && stats.recentMeetings.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentMeetings.slice(0, 5).map((meeting: any) => (
                    <div key={meeting.id} className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors mobile-tap">
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
                          meeting.outcome === 'interested' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                          meeting.outcome === 'follow_up' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
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

          {/* Forms with enhanced styling */}
          <CollegeForm open={showCollegeForm} onOpenChange={setShowCollegeForm} />
          <ContactForm open={showContactForm} onOpenChange={setShowContactForm} />
          <MeetingForm open={showMeetingForm} onOpenChange={setShowMeetingForm} />
        </div>
      </div>
    </AppLayout>
  );
}
