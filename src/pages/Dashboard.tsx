
import React, { Suspense } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  Calendar, 
  TrendingUp,
  DollarSign,
  BookOpen,
  Activity,
  Plus
} from 'lucide-react';
import { useColleges } from '@/hooks/useColleges';
import { useDashboardStats } from '@/hooks/useDashboardStats';

const Dashboard = () => {
  const { data: colleges = [] } = useColleges();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  const quickStats = [
    {
      title: 'Total Colleges',
      value: colleges.length,
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Closed Won',
      value: stats?.closedWonColleges || 0,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      title: 'Upcoming Meetings',
      value: stats?.upcomingMeetingsCount || 0,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      title: 'Total Contacts',
      value: stats?.totalContacts || 0,
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100'
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-4 lg:space-y-6 p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm lg:text-base text-muted-foreground">Welcome back! Here's what's happening with your colleges.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className={`border-0 shadow-lg bg-gradient-to-br ${stat.bgColor}`}>
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className={`p-2 lg:p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-lg lg:text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                <Building2 className="h-4 w-4 lg:h-5 lg:w-5" />
                College Management
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs lg:text-sm text-muted-foreground mb-4">
                Manage your college relationships, track progress, and view details.
              </p>
              <Button className="w-full text-xs lg:text-sm">
                <Building2 className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                View Colleges
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                <DollarSign className="h-4 w-4 lg:h-5 lg:w-5" />
                Pricing Models
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs lg:text-sm text-muted-foreground mb-4">
                Create and manage pricing models for your courses and services.
              </p>
              <Button className="w-full text-xs lg:text-sm" variant="outline">
                <DollarSign className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                Manage Pricing
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                <BookOpen className="h-4 w-4 lg:h-5 lg:w-5" />
                Course Management
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs lg:text-sm text-muted-foreground mb-4">
                Create, organize, and manage courses for your college partners.
              </p>
              <Button className="w-full text-xs lg:text-sm" variant="outline">
                <BookOpen className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                Manage Courses
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
              <Activity className="h-4 w-4 lg:h-5 lg:w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 lg:py-8 text-muted-foreground">
              <Activity className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm lg:text-base">No recent activity to display</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
