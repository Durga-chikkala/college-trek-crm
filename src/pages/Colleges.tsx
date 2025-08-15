
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Building2, Search, Filter, Grid, List, MapPin, Mail, Phone, Globe, Edit, Trash2 } from "lucide-react";
import { useColleges } from "@/hooks/useColleges";
import { CollegeForm } from "@/components/colleges/CollegeForm";

export default function Colleges() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [showCollegeForm, setShowCollegeForm] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  
  const { data: colleges = [], isLoading: loading, error } = useColleges();

  // Filter colleges based on search and filters
  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(search.toLowerCase()) ||
                         college.city?.toLowerCase().includes(search.toLowerCase()) ||
                         college.state?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || college.status === statusFilter;
    const matchesState = stateFilter === "all" || college.state === stateFilter;
    return matchesSearch && matchesStatus && matchesState;
  });

  // Get unique states for filter
  const uniqueStates = [...new Set(colleges.map(c => c.state).filter(Boolean))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed_won': return 'bg-green-100 text-green-800 border-green-200';
      case 'negotiation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'lost': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleEdit = (college: any) => {
    setEditingCollege(college);
    setShowCollegeForm(true);
  };

  const handleFormClose = () => {
    setShowCollegeForm(false);
    setEditingCollege(null);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading colleges...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-slate-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Colleges</h1>
            <p className="text-slate-600 mt-1">Manage your college prospects and relationships</p>
          </div>
          <Button 
            onClick={() => setShowCollegeForm(true)} 
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add College
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="text-xs sm:text-sm font-medium text-slate-600">Total Colleges</div>
              <div className="text-lg sm:text-2xl font-bold text-blue-600">{colleges.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="text-xs sm:text-sm font-medium text-slate-600">Prospects</div>
              <div className="text-lg sm:text-2xl font-bold text-orange-600">
                {colleges.filter(c => c.status === 'prospect').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="text-xs sm:text-sm font-medium text-slate-600">In Negotiation</div>
              <div className="text-lg sm:text-2xl font-bold text-yellow-600">
                {colleges.filter(c => c.status === 'negotiation').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="text-xs sm:text-sm font-medium text-slate-600">Closed Won</div>
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {colleges.filter(c => c.status === 'closed_won').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search colleges..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed_won">Closed Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {uniqueStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex bg-slate-100 rounded-md p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="px-2"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="px-2"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredColleges.map((college) => (
              <Card key={college.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="p-3 sm:p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-sm font-semibold truncate">{college.name}</CardTitle>
                      </div>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(college.status)}`}>
                      {college.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0 space-y-2">
                  {(college.city || college.state) && (
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{[college.city, college.state].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                  {college.email && (
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{college.email}</span>
                    </div>
                  )}
                  {college.phone && (
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Phone className="w-3 h-3" />
                      <span className="truncate">{college.phone}</span>
                    </div>
                  )}
                  {college.website && (
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Globe className="w-3 h-3" />
                      <span className="truncate">{college.website}</span>
                    </div>
                  )}
                  <div className="flex gap-1 pt-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(college)} className="flex-1">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              {/* Mobile Table View */}
              <div className="block sm:hidden">
                <div className="space-y-2 p-3">
                  {filteredColleges.map((college) => (
                    <Card key={college.id} className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building2 className="w-3 h-3 text-blue-600" />
                          </div>
                          <div className="font-medium text-sm">{college.name}</div>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(college.status)}`}>
                          {college.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-600 space-y-1">
                        <div>{[college.city, college.state].filter(Boolean).join(', ') || 'N/A'}</div>
                        <div>{college.email || 'N/A'}</div>
                        <div>{college.phone || 'N/A'}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableCaption>A list of your colleges.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Icon</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredColleges.map((college) => (
                      <TableRow key={college.id}>
                        <TableCell>
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-blue-600" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{college.name}</TableCell>
                        <TableCell>{college.city || 'N/A'}</TableCell>
                        <TableCell>{college.state || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(college.status)}>
                            {college.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{college.email || 'N/A'}</TableCell>
                        <TableCell>{college.phone || 'N/A'}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(college)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredColleges.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No colleges found</h3>
              <p className="text-slate-600 mb-4">
                {search || statusFilter !== "all" || stateFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Get started by adding your first college"}
              </p>
              <Button onClick={() => setShowCollegeForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add College
              </Button>
            </CardContent>
          </Card>
        )}

        {/* College Form Modal */}
        <CollegeForm 
          open={showCollegeForm} 
          onOpenChange={handleFormClose}
          college={editingCollege}
        />
      </div>
    </AppLayout>
  );
}
