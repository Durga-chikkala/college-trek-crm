
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Building2, Plus, Search, Filter, Edit2, Trash2, Eye, Mail, Phone, Globe, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CollegeForm } from "@/components/colleges/CollegeForm";
import { useColleges, useDeleteCollege } from "@/hooks/useColleges";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Tables } from "@/integrations/supabase/types";

const Colleges = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCollege, setEditingCollege] = useState<Tables<'colleges'> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const { data: colleges = [], isLoading } = useColleges();
  const deleteCollege = useDeleteCollege();

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.state?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || college.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospect': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'negotiation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed_won': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed_lost': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const handleEdit = (college: Tables<'colleges'>) => {
    setEditingCollege(college);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteCollege.mutateAsync(id);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCollege(null);
  };

  const getStatsByStatus = () => {
    const stats = colleges.reduce((acc, college) => {
      acc[college.status] = (acc[college.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: colleges.length,
      prospect: stats.prospect || 0,
      negotiation: stats.negotiation || 0,
      closed_won: stats.closed_won || 0,
      closed_lost: stats.closed_lost || 0
    };
  };

  const stats = getStatsByStatus();

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
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              Colleges
            </h1>
            <p className="text-slate-600">Manage your college prospects and deals</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}>
              {viewMode === "grid" ? "Table View" : "Grid View"}
            </Button>
            <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add College
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <p className="text-xs text-gray-600">Total Colleges</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-400">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-500">{stats.prospect}</div>
              <p className="text-xs text-gray-600">Prospects</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-400">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.negotiation}</div>
              <p className="text-xs text-gray-600">In Negotiation</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-400">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.closed_won}</div>
              <p className="text-xs text-gray-600">Closed Won</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-400">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.closed_lost}</div>
              <p className="text-xs text-gray-600">Closed Lost</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
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
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "table")}>
            <TabsList className="mb-4">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredColleges.map((college) => (
                  <Card key={college.id} className="hover:shadow-lg transition-all duration-200 group relative overflow-hidden">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(college)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete College</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {college.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(college.id)} className="bg-red-600 hover:bg-red-700">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg font-semibold text-slate-900">{college.name}</CardTitle>
                        <Badge className={`${getStatusColor(college.status)} text-xs font-medium`}>
                          {getStatusLabel(college.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {college.address && (
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <MapPin className="w-4 h-4 mt-0.5 text-slate-400" />
                          <span>{college.address}</span>
                        </div>
                      )}
                      {(college.city || college.state) && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span>
                            {[college.city, college.state].filter(Boolean).join(', ')}
                            {college.pin_code && ` - ${college.pin_code}`}
                          </span>
                        </div>
                      )}
                      {college.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-blue-600 hover:underline cursor-pointer">{college.email}</span>
                        </div>
                      )}
                      {college.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span>{college.phone}</span>
                        </div>
                      )}
                      {college.website && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="w-4 h-4 text-slate-400" />
                          <a
                            href={college.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t">
                        <Calendar className="w-3 h-3" />
                        <span>Added {new Date(college.created_at).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="table">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredColleges.map((college) => (
                      <TableRow key={college.id}>
                        <TableCell className="font-medium">{college.name}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(college.status)} text-xs`}>
                            {getStatusLabel(college.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {[college.city, college.state].filter(Boolean).join(', ') || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {college.email && (
                              <div className="text-sm text-blue-600">{college.email}</div>
                            )}
                            {college.phone && (
                              <div className="text-sm text-slate-600">{college.phone}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {new Date(college.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(college)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete College</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {college.name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(college.id)} className="bg-red-600 hover:bg-red-700">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <CollegeForm 
          open={showForm} 
          onOpenChange={handleCloseForm}
          college={editingCollege}
        />
      </div>
    </AppLayout>
  );
};

export default Colleges;
