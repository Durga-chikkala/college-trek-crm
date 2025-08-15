
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Building2, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CollegeForm } from "@/components/colleges/CollegeForm";
import { useColleges } from "@/hooks/useColleges";

const Colleges = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: colleges = [], isLoading } = useColleges();

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.state?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || college.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'negotiation': return 'bg-yellow-100 text-yellow-800';
      case 'closed_won': return 'bg-green-100 text-green-800';
      case 'closed_lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'prospect': return 'Prospect';
      case 'negotiation': return 'Negotiation';
      case 'closed_won': return 'Closed Won';
      case 'closed_lost': return 'Closed Lost';
      default: return status;
    }
  };

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
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Colleges</h1>
            <p className="text-slate-600">Manage your college prospects and deals</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add College
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search colleges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="negotiation">Negotiation</SelectItem>
              <SelectItem value="closed_won">Closed Won</SelectItem>
              <SelectItem value="closed_lost">Closed Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredColleges.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {colleges.length === 0 ? "No colleges yet" : "No colleges match your filters"}
            </h3>
            <p className="text-slate-500 mb-4">
              {colleges.length === 0 ? "Start by adding your first college prospect" : "Try adjusting your search or filters"}
            </p>
            {colleges.length === 0 && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First College
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredColleges.map((college) => (
              <Card key={college.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold">{college.name}</CardTitle>
                    <Badge className={getStatusColor(college.status)}>
                      {getStatusLabel(college.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {college.address && (
                    <p className="text-sm text-gray-600">{college.address}</p>
                  )}
                  {(college.city || college.state) && (
                    <p className="text-sm text-gray-600">
                      {[college.city, college.state].filter(Boolean).join(', ')}
                      {college.pin_code && ` - ${college.pin_code}`}
                    </p>
                  )}
                  {college.email && (
                    <p className="text-sm text-blue-600">{college.email}</p>
                  )}
                  {college.phone && (
                    <p className="text-sm text-gray-600">{college.phone}</p>
                  )}
                  {college.website && (
                    <a
                      href={college.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {college.website}
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <CollegeForm open={showForm} onOpenChange={setShowForm} />
      </div>
    </AppLayout>
  );
};

export default Colleges;
