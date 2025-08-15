
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar, Users, TrendingUp, Clock, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DashboardStats {
  totalColleges: number;
  totalMeetings: number;
  totalContacts: number;
  followUpsToday: number;
  activeDeals: number;
  conversionRate: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalColleges: 0,
    totalMeetings: 0,
    totalContacts: 0,
    followUpsToday: 0,
    activeDeals: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch colleges count
        const { count: collegesCount } = await supabase
          .from("colleges")
          .select("*", { count: "exact", head: true });

        // Fetch meetings count
        const { count: meetingsCount } = await supabase
          .from("meetings")
          .select("*", { count: "exact", head: true });

        // Fetch contacts count
        const { count: contactsCount } = await supabase
          .from("contacts")
          .select("*", { count: "exact", head: true });

        // Fetch active deals (prospect + negotiation status)
        const { count: activeDealsCount } = await supabase
          .from("colleges")
          .select("*", { count: "exact", head: true })
          .in("status", ["prospect", "negotiation"]);

        // Fetch follow-ups for today
        const today = new Date().toISOString().split('T')[0];
        const { count: followUpsCount } = await supabase
          .from("meetings")
          .select("*", { count: "exact", head: true })
          .eq("next_follow_up_date", today);

        // Calculate conversion rate (closed won / total colleges)
        const { count: closedWonCount } = await supabase
          .from("colleges")
          .select("*", { count: "exact", head: true })
          .eq("status", "closed_won");

        const conversionRate = collegesCount ? Math.round((closedWonCount || 0) / collegesCount * 100) : 0;

        setStats({
          totalColleges: collegesCount || 0,
          totalMeetings: meetingsCount || 0,
          totalContacts: contactsCount || 0,
          followUpsToday: followUpsCount || 0,
          activeDeals: activeDealsCount || 0,
          conversionRate,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const statCards = [
    {
      title: "Total Colleges",
      value: stats.totalColleges,
      icon: Building2,
      description: "Registered colleges",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Deals",
      value: stats.activeDeals,
      icon: Target,
      description: "In prospect/negotiation",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Total Meetings",
      value: stats.totalMeetings,
      icon: Calendar,
      description: "Meetings logged",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Follow-ups Today",
      value: stats.followUpsToday,
      icon: Clock,
      description: "Due today",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Total Contacts",
      value: stats.totalContacts,
      icon: Users,
      description: "Contact persons",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
      description: "Closed won rate",
      color: "from-emerald-500 to-emerald-600",
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's your sales overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {stat.value}
              </div>
              <CardDescription className="text-xs">
                {stat.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest meetings and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">System initialized</p>
                  <p className="text-xs text-slate-500">Ready to start managing your college sales</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Jump start your workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full p-3 text-left bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-colors">
                <p className="text-sm font-medium text-slate-900">Add New College</p>
                <p className="text-xs text-slate-500">Register a new prospect college</p>
              </button>
              <button className="w-full p-3 text-left bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-colors">
                <p className="text-sm font-medium text-slate-900">Log Meeting</p>
                <p className="text-xs text-slate-500">Record your latest college visit</p>
              </button>
              <button className="w-full p-3 text-left bg-gradient-to-r from-orange-50 to-red-50 rounded-lg hover:from-orange-100 hover:to-red-100 transition-colors">
                <p className="text-sm font-medium text-slate-900">View Follow-ups</p>
                <p className="text-xs text-slate-500">Check today's scheduled follow-ups</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
