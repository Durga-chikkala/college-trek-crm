import React, { useState } from 'react';
import { useColleges, useCreateCollege, useUpdateCollege, useDeleteCollege } from '@/hooks/useColleges';
import { useContacts } from '@/hooks/useContacts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CollegeForm } from '@/components/colleges/CollegeForm';
import { 
  Building2, 
  Plus, 
  Search, 
  MoreVertical,
  Edit,
  Trash2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Users,
  TrendingUp,
  Filter,
  SortAsc,
  AlertTriangle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AppLayout } from "@/components/layout/AppLayout";

const Colleges = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<any>(null);
  
  const { data: colleges = [], isLoading } = useColleges();
  const { data: allContacts = [] } = useContacts();
  const deleteCollege = useDeleteCollege();

  const filteredAndSortedColleges = colleges
    .filter(college => {
      const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          college.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          college.state?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || college.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospect': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'negotiation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed_won': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'lost': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getContactsForCollege = (collegeId: string) => {
    return allContacts.filter(contact => contact.college_id === collegeId);
  };

  const handleEdit = (college: any) => {
    setEditingCollege(college);
    setIsDialogOpen(true);
  };

  const handleDelete = (collegeId: string, collegeName: string) => {
    const collegeContacts = getContactsForCollege(collegeId);
    
    if (collegeContacts.length > 0) {
      toast({ 
        title: "Cannot Delete College", 
        description: `This college has ${collegeContacts.length} associated contact(s). Please remove contacts first.`,
        variant: "destructive" 
      });
      return;
    }

    if (confirm(`Are you sure you want to delete "${collegeName}"? This action cannot be undone.`)) {
      deleteCollege.mutate(collegeId);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingCollege(null);
    }
  };

  const totalColleges = colleges.length;
  const prospectColleges = colleges.filter(c => c.status === 'prospect').length;
  const negotiationColleges = colleges.filter(c => c.status === 'negotiation').length;
  const closedWonColleges = colleges.filter(c => c.status === 'closed_won').length;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading colleges...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background min-h-screen">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Colleges</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your college partnerships and prospects</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add College
                </Button>
              </DialogTrigger>
              <CollegeForm 
                open={isDialogOpen}
                onOpenChange={handleDialogOpenChange}
                college={editingCollege}
              />
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm text-blue-100">Total Colleges</p>
                  <p className="text-lg sm:text-2xl font-bold">{totalColleges}</p>
                </div>
                <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200 self-end sm:self-auto" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm text-orange-100">Prospects</p>
                  <p className="text-lg sm:text-2xl font-bold">{prospectColleges}</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-orange-200 self-end sm:self-auto" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm text-yellow-100">In Negotiation</p>
                  <p className="text-lg sm:text-2xl font-bold">{negotiationColleges}</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-200 self-end sm:self-auto" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm text-emerald-100">Closed Won</p>
                  <p className="text-lg sm:text-2xl font-bold">{closedWonColleges}</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-200 self-end sm:self-auto" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search colleges by name, city, or state..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="negotiation">In Negotiation</SelectItem>
                    <SelectItem value="closed_won">Closed Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="created_at">Date Added</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Colleges Grid */}
        <div className="space-y-3 sm:space-y-4">
          {filteredAndSortedColleges.map((college) => {
            const collegeContacts = getContactsForCollege(college.id);
            return (
              <Card key={college.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-lg flex-shrink-0">
                          {college.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                            <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">{college.name}</h3>
                            <Badge className={getStatusColor(college.status)}>
                              {college.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-muted-foreground truncate">
                              {college.city}, {college.state}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              {collegeContacts.length} contact{collegeContacts.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-1 lg:grid-cols-3 sm:gap-4">
                        {college.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="text-xs sm:text-sm truncate">{college.phone}</span>
                          </div>
                        )}
                        {college.email && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="text-xs sm:text-sm truncate">{college.email}</span>
                          </div>
                        )}
                        {college.website && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Globe className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <a 
                              href={college.website.startsWith('http') ? college.website : `https://${college.website}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-primary text-xs sm:text-sm truncate"
                            >
                              Website
                            </a>
                          </div>
                        )}
                      </div>

                      {college.address && (
                        <div className="mt-3 p-2 sm:p-3 bg-muted rounded-lg">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {college.address}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleEdit(college)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit College
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(college.id, college.name)}
                            className="text-destructive focus:text-destructive"
                            disabled={collegeContacts.length > 0}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete College
                          </DropdownMenuItem>
                          {collegeContacts.length > 0 && (
                            <div className="px-2 py-1 text-xs text-muted-foreground flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Has {collegeContacts.length} contact(s)
                            </div>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4 pt-3 border-t">
                    <div className="text-xs text-muted-foreground">
                      Added {new Date(college.created_at).toLocaleDateString()}
                      {college.updated_at !== college.created_at && 
                        ` • Updated ${new Date(college.updated_at).toLocaleDateString()}`
                      }
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">Call</span>
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">Email</span>
                      </Button>
                      <Button size="sm" className="flex-1 sm:flex-none">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">View Contacts</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredAndSortedColleges.length === 0 && (
          <Card>
            <CardContent className="p-8 sm:p-12 text-center">
              <Building2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">No colleges found</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Get started by adding your first college'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First College
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Colleges;
