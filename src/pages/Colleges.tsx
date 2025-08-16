import React, { useState } from 'react';
import { useColleges, useDeleteCollege } from '@/hooks/useColleges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CollegeForm } from '@/components/colleges/CollegeForm';
import { SimplifiedPricingDashboard } from '@/components/colleges/SimplifiedPricingDashboard';
import { SimplifiedCourseManagement } from '@/components/colleges/SimplifiedCourseManagement';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Plus, 
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Users,
  GraduationCap,
  DollarSign,
  BookOpen
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Colleges = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<any>(null);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(null);
  const [managementView, setManagementView] = useState<'pricing' | 'courses'>('pricing');
  
  const { data: colleges = [], isLoading } = useColleges();
  const deleteCollege = useDeleteCollege();

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.state?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || college.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospect': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'negotiation': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'closed_won': return 'bg-green-100 text-green-700 border-green-200';
      case 'closed_lost': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleEdit = (college: any) => {
    setEditingCollege(college);
    setIsDialogOpen(true);
  };

  const handleDelete = (collegeId: string) => {
    if (confirm('Are you sure you want to delete this college? This will also delete all associated contacts and meetings.')) {
      deleteCollege.mutate(collegeId);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingCollege(null);
    }
  };

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
      <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Colleges
            </h1>
            <p className="text-muted-foreground mt-1">Manage your college partnerships and prospects</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg w-full sm:w-auto">
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

        {/* Main Content */}
        {selectedCollegeId ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCollegeId(null)}
                  className="border-primary/20 hover:bg-primary/5"
                >
                  ← Back to Colleges
                </Button>
                <h2 className="text-xl font-semibold text-foreground">
                  {colleges.find(c => c.id === selectedCollegeId)?.name} - Management
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={managementView === 'pricing' ? 'default' : 'outline'}
                  onClick={() => setManagementView('pricing')}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4" />
                  Pricing
                </Button>
                <Button
                  variant={managementView === 'courses' ? 'default' : 'outline'}
                  onClick={() => setManagementView('courses')}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Courses
                </Button>
              </div>
            </div>
            
            {managementView === 'pricing' ? (
              <SimplifiedPricingDashboard 
                collegeId={selectedCollegeId} 
                collegeName={colleges.find(c => c.id === selectedCollegeId)?.name || ''} 
              />
            ) : (
              <SimplifiedCourseManagement 
                collegeId={selectedCollegeId} 
                collegeName={colleges.find(c => c.id === selectedCollegeId)?.name || ''} 
              />
            )}
          </div>
        ) : (
          <>
            {/* Search and Filter */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-card to-card/95">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search colleges by name, city, or state..."
                      className="pl-10 border-border/50 focus:border-primary"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-[180px] border-border/50 focus:border-primary">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by status" />
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
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="grid" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="grid" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Grid View
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  List View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="grid" className="space-y-6">
                {/* College Grid */}
                <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {filteredColleges.map((college) => (
                    <Card key={college.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-card to-card/95 overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
                                {college.name}
                              </div>
                            </CardTitle>
                            <Badge className={`${getStatusColor(college.status)} mt-2`}>
                              {college.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="shadow-xl border-0">
                              <DropdownMenuItem onClick={() => setSelectedCollegeId(college.id)} className="gap-2">
                                <DollarSign className="h-4 w-4" />
                                Manage
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(college)} className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit College
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(college.id)}
                                className="text-destructive gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete College
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        {college.city && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 text-orange-500" />
                            <span className="truncate">{college.city}{college.state && `, ${college.state}`}</span>
                          </div>
                        )}
                        {college.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 text-green-500" />
                            <span className="truncate">{college.phone}</span>
                          </div>
                        )}
                        {college.email && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4 text-blue-500" />
                            <span className="truncate">{college.email}</span>
                          </div>
                        )}
                        {college.website && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe className="h-4 w-4 text-purple-500" />
                            <a 
                              href={college.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="truncate hover:text-primary transition-colors"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                        
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                            onClick={() => setSelectedCollegeId(college.id)}
                          >
                            <GraduationCap className="h-3 w-3 mr-1" />
                            Manage
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-primary/20 hover:bg-primary/5"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="list" className="space-y-4">
                {/* College List */}
                {filteredColleges.map((college) => (
                  <Card key={college.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                              {college.name}
                            </h3>
                            <Badge className={getStatusColor(college.status)}>
                              {college.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                            {college.city && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-orange-500" />
                                {college.city}{college.state && `, ${college.state}`}
                              </div>
                            )}
                            {college.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-green-500" />
                                {college.phone}
                              </div>
                            )}
                            {college.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-blue-500" />
                                {college.email}
                              </div>
                            )}
                            {college.website && (
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-purple-500" />
                                <a 
                                  href={college.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="hover:text-primary transition-colors"
                                >
                                  Website
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                            onClick={() => setSelectedCollegeId(college.id)}
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Manage Pricing</span>
                            <span className="sm:hidden">Pricing</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="shadow-xl border-0">
                              <DropdownMenuItem onClick={() => handleEdit(college)} className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit College
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(college.id)}
                                className="text-destructive gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete College
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>

            {filteredColleges.length === 0 && (
              <Card className="shadow-lg border-0">
                <CardContent className="p-12 text-center">
                  <Building2 className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    {searchTerm || statusFilter !== 'all' ? 'No colleges found' : 'No colleges yet'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Get started by adding your first college'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Colleges;
