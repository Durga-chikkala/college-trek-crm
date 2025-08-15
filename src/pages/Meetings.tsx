
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Clock, MapPin, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Meeting {
  id: string;
  title: string;
  meeting_date: string;
  agenda: string;
  discussion_notes: string;
  outcome: string;
  duration_minutes: number;
  location: string;
  next_follow_up_date: string;
  college: {
    name: string;
    city: string;
    state: string;
  };
}

export default function Meetings() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("meetings")
          .select(`
            *,
            college:colleges (
              name,
              city,
              state
            )
          `)
          .order("meeting_date", { ascending: false });

        if (error) {
          console.error("Error fetching meetings:", error);
        } else {
          setMeetings(data || []);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [user]);

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "interested":
        return "bg-green-100 text-green-800";
      case "follow_up":
        return "bg-blue-100 text-blue-800";
      case "not_interested":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOutcomeLabel = (outcome: string) => {
    return outcome.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-slate-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-slate-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Meetings</h1>
          <p className="text-slate-600">Track your college visits and follow-ups</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Log Meeting
        </Button>
      </div>

      {meetings.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No meetings logged</h3>
            <p className="text-slate-600 text-center mb-6">
              Start tracking your college visits and meetings to build better relationships.
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Log Your First Meeting
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <Card key={meeting.id} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      {meeting.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {meeting.college?.name} • {meeting.college?.city}, {meeting.college?.state}
                    </CardDescription>
                  </div>
                  {meeting.outcome && (
                    <Badge className={getOutcomeColor(meeting.outcome)}>
                      {getOutcomeLabel(meeting.outcome)}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(meeting.meeting_date).toLocaleDateString()}</span>
                    <span>{new Date(meeting.meeting_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {meeting.duration_minutes && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>{meeting.duration_minutes} minutes</span>
                    </div>
                  )}
                  {meeting.location && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>{meeting.location}</span>
                    </div>
                  )}
                  {meeting.next_follow_up_date && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>Follow-up: {new Date(meeting.next_follow_up_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {meeting.agenda && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <FileText className="w-4 h-4" />
                      Agenda
                    </div>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                      {meeting.agenda}
                    </p>
                  </div>
                )}

                {meeting.discussion_notes && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <FileText className="w-4 h-4" />
                      Discussion Notes
                    </div>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                      {meeting.discussion_notes}
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">
                      Logged {new Date(meeting.meeting_date).toLocaleDateString()}
                    </span>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
