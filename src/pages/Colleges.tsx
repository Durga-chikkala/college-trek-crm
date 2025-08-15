
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Search, MapPin, Phone, Mail, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface College {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pin_code: string;
  phone: string;
  email: string;
  website: string;
  status: string;
  created_at: string;
}

export default function Colleges() {
  const { user } = useAuth();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchColleges = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("colleges")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching colleges:", error);
        } else {
          setColleges(data || []);
        }
      } catch (error) {
        console.error("Error fetching colleges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, [user]);

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "prospect":
        return "bg-blue-100 text-blue-800";
      case "negotiation":
        return "bg-yellow-100 text-yellow-800";
      case "closed_won":
        return "bg-green-100 text-green-800";
      case "closed_lost":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-slate-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-slate-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
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
          <h1 className="text-3xl font-bold text-slate-900">Colleges</h1>
          <p className="text-slate-600">Manage your college prospects and relationships</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add College
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search colleges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredColleges.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No colleges found</h3>
            <p className="text-slate-600 text-center mb-6">
              {searchTerm ? "No colleges match your search criteria." : "Start by adding your first college prospect."}
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First College
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((college) => (
            <Card key={college.id} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-slate-900 leading-tight">
                      {college.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {college.city}, {college.state}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(college.status)}>
                    {getStatusLabel(college.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {college.address && (
                  <div className="text-sm text-slate-600">
                    <p>{college.address}</p>
                    {college.pin_code && <p>PIN: {college.pin_code}</p>}
                  </div>
                )}
                
                <div className="space-y-2">
                  {college.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-3 h-3" />
                      <span>{college.phone}</span>
                    </div>
                  )}
                  {college.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{college.email}</span>
                    </div>
                  )}
                  {college.website && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Globe className="w-3 h-3" />
                      <span className="truncate">{college.website}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">
                      Added {new Date(college.created_at).toLocaleDateString()}
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
