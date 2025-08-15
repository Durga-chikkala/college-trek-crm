
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Pencil, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Calendar,
  MoreVertical,
  Download,
  Upload,
  Star,
  StarOff,
  Copy,
  ExternalLink,
  FileText,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Grid3X3,
  List,
  SortAsc,
  SortDesc
} from "lucide-react";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

const Colleges = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCollege, setEditingCollege] = useState<Tables<'colleges'> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortBy, setSortBy] = useState<"name" | "created_at" | "updated_at">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [favoriteColleges, setFavoriteColleges] = useState<Set<string>>(new Set());
  const { data: colleges = [], isLoading } = useColleges();
  const deleteCollege = useDeleteCollege();
  const { toast } = useToast();

  const filteredAndSortedColleges = colleges
    .filter(college => {
      const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           college.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           college.state?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || college.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "created_at":
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case "updated_at":
          aValue = new Date(a.updated_at);
          bValue = new Date(b.updated_at);
          break;
        default:
          return 0;
      }
      
      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'prospect': 
        return { 
          color: 'bg-blue-50 text-blue-700 border-blue-200', 
          icon: Clock, 
          label: 'Prospect' 
        };
      case 'negotiation': 
        return { 
          color: 'bg-amber-50 text-amber-700 border-amber-200', 
          icon: TrendingUp, 
          label: 'Negotiation' 
        };
      case 'closed_won': 
        return { 
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
          icon: CheckCircle, 
          label: 'Closed Won' 
        };
      case 'lost': 
        return { 
          color: 'bg-red-50 text-red-700 border-red-200', 
          icon: XCircle, 
          label: 'Lost' 
        };
      default: 
        return { 
          color: 'bg-slate-50 text-slate-700 border-slate-200', 
          icon: AlertCircle, 
          label: status 
        };
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

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast({ title: "Email copied to clipboard", duration: 2000 });
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    toast({ title: "Phone number copied to clipboard", duration: 2000 });
  };

  const toggleFavorite = (collegeId: string) => {
    const newFavorites = new Set(favoriteColleges);
    if (newFavorites.has(collegeId)) {
      newFavorites.delete(collegeId);
      toast({ title: "Removed from favorites", duration: 2000 });
    } else {
      newFavorites.add(collegeId);
      toast({ title: "Added to favorites", duration: 2000 });
    }
    setFavoriteColleges(newFavorites);
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
      lost: stats.lost || 0
    };
  };

  const stats = getStatsByStatus();

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

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              Colleges
              <Badge variant="secondary" className="ml-2">
                {colleges.length} Total
              </Badge>
            </h1>
            <p className="text-muted-foreground">Manage your college prospects and partnerships</p>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export colleges data</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Import colleges from CSV</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
            >
              {viewMode === "grid" ? (
                <>
                  <List className="w-4 h-4 mr-2" />
                  Table View
                </>
              ) : (
                <>
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Grid View
                </>
              )}
            </Button>
            
            <Button 
              onClick={() => setShowForm(true)} 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add College
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">Total Colleges</p>
                </div>
                <Building2 className="w-8 h-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.prospect}</div>
                  <p className="text-xs text-muted-foreground">Prospects</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-amber-600">{stats.negotiation}</div>
                  <p className="text-xs text-muted-foreground">In Negotiation</p>
                </div>
                <TrendingUp className="w-8 h-8 text-amber-500/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-emerald-600">{stats.closed_won}</div>
                  <p className="text-xs text-muted-foreground">Closed Won</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-500/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{stats.lost}</div>
                  <p className="text-xs text-muted-foreground">Lost</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters and Sorting */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search colleges by name, city, or state..."
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
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Sort by Created</SelectItem>
              <SelectItem value="updated_at">Sort by Updated</SelectItem>
              <SelectItem value="name">Sort by Name</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
          </Button>
        </div>

        {filteredAndSortedColleges.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-muted/50 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Building2 className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {colleges.length === 0 ? "No colleges yet" : "No colleges match your filters"}
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              {colleges.length === 0 
                ? "Start building your college network by adding your first prospect" 
                : "Try adjusting your search criteria or filters to find what you're looking for"}
            </p>
            {colleges.length === 0 && (
              <Button onClick={() => setShowForm(true)} className="shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Add First College
              </Button>
            )}
          </div>
        ) : (
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "table")}>
            <TabsList className="mb-4">
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                Grid View
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <List className="w-4 h-4" />
                Table View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedColleges.map((college) => {
                  const statusConfig = getStatusConfig(college.status);
                  const StatusIcon = statusConfig.icon;
                  const isFavorite = favoriteColleges.has(college.id);
                  
                  return (
                    <Card key={college.id} className="hover:shadow-lg transition-all duration-300 group relative overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary">
                      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => toggleFavorite(college.id)}
                                className={isFavorite ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground hover:text-foreground"}
                              >
                                {isFavorite ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {isFavorite ? "Remove from favorites" : "Add to favorites"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleEdit(college)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit College
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="w-4 h-4 mr-2" />
                              View Notes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="w-4 h-4 mr-2" />
                              View Contacts
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete College
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete College</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {college.name}? This action cannot be undone and will remove all associated data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(college.id)} 
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between pr-16">
                          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                            {college.name}
                            {isFavorite && <Star className="w-4 h-4 text-amber-500 fill-current" />}
                          </CardTitle>
                        </div>
                        <Badge className={`${statusConfig.color} text-xs font-medium w-fit flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </Badge>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        {college.address && (
                          <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground/60" />
                            <span>{college.address}</span>
                          </div>
                        )}
                        
                        {(college.city || college.state) && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 text-muted-foreground/60" />
                            <span>
                              {[college.city, college.state].filter(Boolean).join(', ')}
                              {college.pin_code && ` - ${college.pin_code}`}
                            </span>
                          </div>
                        )}
                        
                        {college.email && (
                          <div className="flex items-center gap-2 text-sm group/email">
                            <Mail className="w-4 h-4 text-muted-foreground/60" />
                            <span className="text-primary hover:underline cursor-pointer flex-1">
                              {college.email}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyEmail(college.email!)}
                              className="opacity-0 group-hover/email:opacity-100 transition-opacity p-1 h-auto"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                        
                        {college.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground group/phone">
                            <Phone className="w-4 h-4 text-muted-foreground/60" />
                            <span className="flex-1">{college.phone}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyPhone(college.phone!)}
                              className="opacity-0 group-hover/phone:opacity-100 transition-opacity p-1 h-auto"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                        
                        {college.website && (
                          <div className="flex items-center gap-2 text-sm">
                            <Globe className="w-4 h-4 text-muted-foreground/60" />
                            <a
                              href={college.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              Visit Website
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Added {new Date(college.created_at).toLocaleDateString()}</span>
                          </div>
                          {college.updated_at !== college.created_at && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Updated {new Date(college.updated_at).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="table">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          Name
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Status
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Location
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Contact
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Created
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedColleges.map((college) => {
                      const statusConfig = getStatusConfig(college.status);
                      const StatusIcon = statusConfig.icon;
                      const isFavorite = favoriteColleges.has(college.id);
                      
                      return (
                        <TableRow key={college.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {college.name}
                              {isFavorite && <Star className="w-4 h-4 text-amber-500 fill-current" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${statusConfig.color} text-xs flex items-center gap-1 w-fit`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {[college.city, college.state].filter(Boolean).join(', ') || '-'}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {college.email && (
                                <div className="text-sm text-primary flex items-center gap-2">
                                  {college.email}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopyEmail(college.email!)}
                                    className="p-1 h-auto"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                              {college.phone && (
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                  {college.phone}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopyPhone(college.phone!)}
                                    className="p-1 h-auto"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(college.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => toggleFavorite(college.id)}
                                      className={isFavorite ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground hover:text-foreground"}
                                    >
                                      {isFavorite ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {isFavorite ? "Remove from favorites" : "Add to favorites"}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleEdit(college)}
                                      className="text-primary hover:text-primary/80"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit college</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Delete college</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete College</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {college.name}? This action cannot be undone and will remove all associated data.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDelete(college.id)} 
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
