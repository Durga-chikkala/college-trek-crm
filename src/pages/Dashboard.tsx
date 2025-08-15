
import React, { useState } from 'react';
import { useColleges } from '@/hooks/useColleges';
import { useMeetings } from '@/hooks/useMeetings';
import { useContacts } from '@/hooks/useContacts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
  Building2, 
  Users, 
  Calendar,
  TrendingUp,
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  Eye,
  Phone,
  Mail,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { format, subDays, isAfter, isBefore, parseISO } from 'date-fns';

const Dashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  
  const { data: colleges = [], isLoading: collegesLoading } = useColleges();
  const { data: meetings = [], isLoading: meetingsLoading } = useMeetings();
  const { data: contacts = [], isLoading: contactsLoading } = useContacts();

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Calculate statistics
  const totalColleges = colleges.length;
  const totalContacts = contacts.length;
  const totalMeetings = meetings.length;
  
  const prospectColleges = colleges.filter(c => c.status === 'prospect').length;
  const negotiationColleges = colleges.filter(c => c.status === 'negotiation').length;
  const closedWonColleges = colleges.filter(c => c.status === 'closed_won').length;
  
  const conversionRate = totalColleges > 0 ? Math.round((closedWonColleges / totalColleges) * 100) : 0;
  
  // Recent activities
  const recentColleges = colleges
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);
    
  const upcomingMeetings = meetings
    .filter(m => new Date(m.meeting_date) > new Date())
    .sort((a, b) => new Date(a.meeting_date).getTime() - new Date(b.meeting_date).getTime())
    .slice(0, 5);
    
  const recentMeetings = meetings
    .filter(m => new Date(m.meeting_date) < new Date())
    .sort((a, b) => new Date(b.meeting_date).getTime() - new Date(a.meeting_date).getTime())
    .slice(0, 5);

  // Chart data
  const statusData = [
    { name: 'Prospect', value: prospectColleges, color: '#3B82F6' },
    { name: 'Negotiation', value: negotiationColleges, color: '#F59E0B' },
    { name: 'Closed Won', value: closedWonColleges, color: '#10B981' },
    { name: 'Lost', value: colleges.filter(c => c.status === 'lost').length, color: '#EF4444' }
  ];

  // Monthly data for the last 6 months
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = subDays(new Date(), i * 30);
    const monthColleges = colleges.filter(c => 
      new Date(c.created_at).getMonth() === date.getMonth() &&
      new Date(c.created_at).getFullYear() === date.getFullYear()
    ).length;
    
    return {
      month: format(date, 'MMM'),
      colleges: monthColleges,
      meetings: meetings.filter(m => 
        new Date(m.meeting_date).getMonth() === date.getMonth() &&
        new Date(m.meeting_date).getFullYear() === date.getFullYear()
      ).length
    };
  }).reverse();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospect': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'negotiation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed_won': return 'bg-green-100 text-green-800 border-green-200';
      case 'lost': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMeetingOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'interested': return 'bg-green-100 text-green-800';
      case 'follow_up': return 'bg-yellow-100 text-yellow-800';
      case 'not_interested': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (collegesLoading || meetingsLoading || contactsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sales Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Overview of your sales pipeline and activities</p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Colleges</p>
                <p className="text-3xl font-bold text-gray-900">{totalColleges}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+12% from last month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                <p className="text-3xl font-bold text-gray-900">{totalContacts}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+8% from last month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Meetings</p>
                <p className="text-3xl font-bold text-gray-900">{totalMeetings}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+15% from last month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 opacity-10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900">{conversionRate}%</p>
                <div className="flex items-center mt-2">
                  {conversionRate > 20 ? (
                    <>
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 ml-1">Above target</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600 ml-1">Below target</span>
                    </>
                  )}
                </div>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="colleges" fill="#3B82F6" name="New Colleges" />
                <Bar dataKey="meetings" fill="#10B981" name="Meetings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Pipeline Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Meetings</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline Management</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Recently Added Colleges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentColleges.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No colleges added yet</p>
                ) : (
                  recentColleges.map((college) => (
                    <div key={college.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{college.name}</h4>
                        <p className="text-sm text-gray-600">{college.city}, {college.state}</p>
                      </div>
                      <Badge className={getStatusColor(college.status)}>
                        {college.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Meetings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentMeetings.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent meetings</p>
                ) : (
                  recentMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{meeting.title}</h4>
                        <p className="text-sm text-gray-600">{meeting.college_name}</p>
                        <p className="text-xs text-gray-500">
                          {format(parseISO(meeting.meeting_date), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      {meeting.outcome && (
                        <Badge className={getMeetingOutcomeBadge(meeting.outcome)}>
                          {meeting.outcome.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Meetings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingMeetings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No upcoming meetings scheduled</p>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{meeting.title}</h4>
                        <p className="text-gray-600">{meeting.college_name}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>📅 {format(parseISO(meeting.meeting_date), 'MMM d, yyyy')}</span>
                          <span>🕒 {format(parseISO(meeting.meeting_date), 'h:mm a')}</span>
                          {meeting.location && <span>📍 {meeting.location}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Button size="sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Eye className="h-5 w-5" />
                  Prospects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900 mb-2">{prospectColleges}</div>
                <div className="space-y-2">
                  {colleges.filter(c => c.status === 'prospect').slice(0, 3).map(college => (
                    <div key={college.id} className="text-sm text-blue-700 truncate">
                      {college.name}
                    </div>
                  ))}
                  {prospectColleges > 3 && (
                    <div className="text-xs text-blue-600">+{prospectColleges - 3} more</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-yellow-700">
                  <Clock className="h-5 w-5" />
                  Negotiation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-900 mb-2">{negotiationColleges}</div>
                <div className="space-y-2">
                  {colleges.filter(c => c.status === 'negotiation').slice(0, 3).map(college => (
                    <div key={college.id} className="text-sm text-yellow-700 truncate">
                      {college.name}
                    </div>
                  ))}
                  {negotiationColleges > 3 && (
                    <div className="text-xs text-yellow-600">+{negotiationColleges - 3} more</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Closed Won
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900 mb-2">{closedWonColleges}</div>
                <div className="space-y-2">
                  {colleges.filter(c => c.status === 'closed_won').slice(0, 3).map(college => (
                    <div key={college.id} className="text-sm text-green-700 truncate">
                      {college.name}
                    </div>
                  ))}
                  {closedWonColleges > 3 && (
                    <div className="text-xs text-green-600">+{closedWonColleges - 3} more</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  Lost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-900 mb-2">
                  {colleges.filter(c => c.status === 'lost').length}
                </div>
                <div className="space-y-2">
                  {colleges.filter(c => c.status === 'lost').slice(0, 3).map(college => (
                    <div key={college.id} className="text-sm text-red-700 truncate">
                      {college.name}
                    </div>
                  ))}
                  {colleges.filter(c => c.status === 'lost').length > 3 && (
                    <div className="text-xs text-red-600">
                      +{colleges.filter(c => c.status === 'lost').length - 3} more
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
