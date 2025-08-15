
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { 
  Building2, 
  Users, 
  Calendar, 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Award,
  Activity,
  Eye,
  Edit,
  Star,
  Filter,
  Download,
  RefreshCw
} from "lucide-react";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

const Dashboard = () => {
  const { data: stats, isLoading, refetch } = useDashboardStats();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const pieData = [
    { name: 'Prospects', value: stats?.prospectColleges || 0, color: '#3B82F6' },
    { name: 'Negotiation', value: stats?.negotiationColleges || 0, color: '#F59E0B' },
    { name: 'Closed Won', value: stats?.closedWonColleges || 0, color: '#10B981' },
  ];

  const monthlyData = [
    { month: 'Jan', prospects: 12, deals: 3, revenue: 45000 },
    { month: 'Feb', prospects: 18, deals: 5, revenue: 72000 },
    { month: 'Mar', prospects: 15, deals: 4, revenue: 58000 },
    { month: 'Apr', prospects: 22, deals: 7, revenue: 98000 },
    { month: 'May', prospects: 28, deals: 9, revenue: 125000 },
    { month: 'Jun', prospects: 25, deals: 8, revenue: 110000 },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getMeetingStatus = (date: string) => {
    const meetingDate = new Date(date);
    if (isPast(meetingDate) && !isToday(meetingDate)) return { status: 'past', color: 'text-muted-foreground', bg: 'bg-muted' };
    if (isToday(meetingDate)) return { status: 'today', color: 'text-orange-700', bg: 'bg-orange-100' };
    if (isTomorrow(meetingDate)) return { status: 'tomorrow', color: 'text-blue-700', bg: 'bg-blue-100' };
    return { status: 'upcoming', color: 'text-green-700', bg: 'bg-green-100' };
  };

  const conversionRate = stats?.totalColleges ? ((stats.closedWonColleges / stats.totalColleges) * 100).toFixed(1) : 0;
  const pipelineValue = stats?.negotiationColleges * 85000; // Assumed average deal size

  return (
    <AppLayout>
      <div className="p-8 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50/30">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              Sales Dashboard
            </h1>
            <p className="text-slate-600 text-lg">Track your sales performance and manage your pipeline</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => navigate('/colleges')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Add College
            </Button>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Colleges</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{stats?.totalColleges || 0}</p>
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      +12%
                    </Badge>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Building2 className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Closed Won</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{stats?.closedWonColleges || 0}</p>
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      +8%
                    </Badge>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Conversion Rate</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{conversionRate}%</p>
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      +2.3%
                    </Badge>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Target className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Pipeline Value</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">${(pipelineValue / 1000).toFixed(0)}K</p>
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      +15%
                    </Badge>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <DollarSign className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pipeline Distribution */}
              <Card className="lg:col-span-1 shadow-lg border-0 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    Pipeline Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-slate-600">{item.name}</span>
                        </div>
                        <span className="font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Performance */}
              <Card className="lg:col-span-2 shadow-lg border-0 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    Monthly Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#10B981" 
                          fillOpacity={1} 
                          fill="url(#colorRevenue)" 
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Activity className="w-5 h-5 text-purple-600" />
                    </div>
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { type: 'meeting', college: 'Stanford University', action: 'Meeting completed', time: '2 hours ago', status: 'success' },
                    { type: 'call', college: 'MIT', action: 'Follow-up call scheduled', time: '4 hours ago', status: 'pending' },
                    { type: 'email', college: 'Harvard University', action: 'Proposal sent', time: '1 day ago', status: 'info' },
                    { type: 'meeting', college: 'UC Berkeley', action: 'Initial meeting set', time: '2 days ago', status: 'success' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/50">
                      <div className={`p-2 rounded-lg ${
                        activity.status === 'success' ? 'bg-emerald-100 text-emerald-600' :
                        activity.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{activity.college}</p>
                        <p className="text-sm text-slate-600">{activity.action}</p>
                      </div>
                      <span className="text-xs text-slate-500">{activity.time}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">Monthly Goal Progress</span>
                      <span className="text-sm font-bold text-slate-800">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">Average Deal Size</span>
                      <span className="text-sm font-bold text-slate-800">$85,000</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{stats?.totalContacts || 0}</p>
                      <p className="text-xs text-blue-600 font-medium">Total Contacts</p>
                    </div>
                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                      <p className="text-2xl font-bold text-emerald-600">24</p>
                      <p className="text-xs text-emerald-600 font-medium">This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="meetings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Meetings */}
              <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-800 flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      Upcoming Meetings
                    </CardTitle>
                    <Button size="sm" onClick={() => navigate('/meetings')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Meeting
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats?.upcomingMeetings?.slice(0, 5).map((meeting) => {
                    const statusInfo = getMeetingStatus(meeting.meeting_date);
                    return (
                      <div key={meeting.id} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                        <div className={`p-2 rounded-lg ${statusInfo.bg}`}>
                          <Calendar className={`w-4 h-4 ${statusInfo.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">{meeting.title}</p>
                          <p className="text-sm text-blue-600 font-medium">{meeting.colleges?.name}</p>
                          <p className="text-xs text-slate-500">
                            {format(new Date(meeting.meeting_date), 'MMM dd, yyyy - h:mm a')}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Recent Meetings */}
              <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Clock className="w-5 h-5 text-emerald-600" />
                    </div>
                    Recent Meetings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats?.recentMeetings?.slice(0, 5).map((meeting) => (
                    <div key={meeting.id} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                      <div className="p-2 rounded-lg bg-slate-100">
                        <CheckCircle className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">{meeting.title}</p>
                        <p className="text-sm text-blue-600 font-medium">{meeting.colleges?.name}</p>
                        <p className="text-xs text-slate-500">
                          {format(new Date(meeting.meeting_date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      {meeting.outcome && (
                        <Badge variant="secondary" className="text-xs">
                          {meeting.outcome.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  Sales Pipeline Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }} 
                      />
                      <Bar dataKey="prospects" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="deals" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6 text-center">
                  <Star className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                  <h3 className="text-2xl font-bold mb-2">Top Performer</h3>
                  <p className="text-blue-100">This Quarter</p>
                  <div className="mt-4 p-3 bg-white/20 rounded-lg">
                    <p className="text-2xl font-bold">{stats?.closedWonColleges || 0}</p>
                    <p className="text-sm text-blue-100">Deals Closed</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Goal Achievement</h3>
                  <p className="text-emerald-100">Monthly Target</p>
                  <div className="mt-4 p-3 bg-white/20 rounded-lg">
                    <p className="text-2xl font-bold">85%</p>
                    <p className="text-sm text-emerald-100">Completed</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Growth Rate</h3>
                  <p className="text-purple-100">Month over Month</p>
                  <div className="mt-4 p-3 bg-white/20 rounded-lg">
                    <p className="text-2xl font-bold">+18%</p>
                    <p className="text-sm text-purple-100">Increase</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
