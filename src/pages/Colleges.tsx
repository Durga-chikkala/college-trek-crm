
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Star,
  Copy,
  ExternalLink,
  Filter,
  SortAsc,
  Eye,
  Calendar,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Colleges = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<any>(null);
  const [selectedCollege, setSelectedCollege] = useState<any>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const { data: colleges = [], isLoading } = useColleges();
  const { data: contacts = [] } = useContacts();
  const updateCollege = useUpdateCollege();
  const deleteCollege = useDeleteCollege();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'prospect':
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Eye,
          label: 'Prospect'
        };
      case 'negotiation':
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          label: 'Negotiation'
        };
      case 'closed_won':
        return { 
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          label: 'Closed Won'
        };
      case 'lost':
        return { 
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: X,
          label: 'Lost'
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircle,
          label: status
        };
    }
  };

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

  const handleStatusChange = (collegeId: string, newStatus: string) => {
    updateCollege.mutate({ 
      id: collegeId, 
      status: newStatus as any 
    });
  };

  const handleEdit = (college: any) => {
    setEditingCollege(college);
    setIsDialogOpen(true);
  };

  const handleDelete = (collegeId: string) => {
    if (confirm('Are you sure you want to delete this college?')) {
      deleteCollege.mutate(collegeId);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${type} copied to clipboard` });
  };

  const toggleFavorite = (collegeId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(collegeId)) {
      newFavorites.delete(collegeId);
    } else {
      newFavorites.add(collegeId);
    }
    setFavorites(newFavorites);
  };

  const getCollegeContacts = (collegeId: string) => {
    return contacts.filter(contact => contact.college_id === collegeId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Colleges</h1>
          <p className="text-gray-600 mt-2">Manage your college prospects and partnerships</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add College
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCollege ? 'Edit College' : 'Add New College'}
              </DialogTitle>
            </DialogHeader>
            <CollegeForm 
              college={editingCollege}
              onSuccess={() => {
                setIsDialogOpen(false);
                setEditingCollege(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search colleges by name, city, or state..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="closed_won">Closed Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Colleges</p>
                <p className="text-2xl font-bold">{colleges.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">In Negotiation</p>
                <p className="text-2xl font-bold">
                  {colleges.filter(c => c.status === 'negotiation').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Closed Won</p>
                <p className="text-2xl font-bold">
                  {colleges.filter(c => c.status === 'closed_won').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Conversion Rate</p>
                <p className="text-2xl font-bold">
                  {colleges.length > 0 
                    ? Math.round((colleges.filter(c => c.status === 'closed_won').length / colleges.length) * 100)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Colleges Grid */}
      <div className="grid gap-6">
        {filteredAndSortedColleges.map((college) => {
          const statusConfig = getStatusConfig(college.status);
          const StatusIcon = statusConfig.icon;
          const collegeContacts = getCollegeContacts(college.id);
          
          return (
            <Card key={college.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{college.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(college.id)}
                        className={favorites.has(college.id) ? 'text-yellow-500' : 'text-gray-400'}
                      >
                        <Star className={`h-4 w-4 ${favorites.has(college.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <Select
                        value={college.status}
                        onValueChange={(value) => handleStatusChange(college.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prospect">
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              Prospect
                            </div>
                          </SelectItem>
                          <SelectItem value="negotiation">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Negotiation
                            </div>
                          </SelectItem>
                          <SelectItem value="closed_won">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Closed Won
                            </div>
                          </SelectItem>
                          <SelectItem value="lost">
                            <div className="flex items-center gap-2">
                              <X className="h-4 w-4" />
                              Lost
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      {college.address && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{college.city}, {college.state}</span>
                        </div>
                      )}
                      {college.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span 
                            className="cursor-pointer hover:text-blue-600"
                            onClick={() => handleCopy(college.phone!, 'Phone number')}
                          >
                            {college.phone}
                          </span>
                          <Copy className="h-3 w-3 cursor-pointer hover:text-blue-600" />
                        </div>
                      )}
                      {college.email && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span 
                            className="cursor-pointer hover:text-blue-600"
                            onClick={() => handleCopy(college.email!, 'Email')}
                          >
                            {college.email}
                          </span>
                          <Copy className="h-3 w-3 cursor-pointer hover:text-blue-600" />
                        </div>
                      )}
                      {college.website && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Globe className="h-4 w-4" />
                          <a 
                            href={college.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 flex items-center gap-1"
                          >
                            Visit Website
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    {collegeContacts.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Contacts ({collegeContacts.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {collegeContacts.slice(0, 3).map((contact) => (
                            <Badge key={contact.id} variant="outline" className="text-xs">
                              {contact.name}
                              {contact.designation && ` - ${contact.designation}`}
                            </Badge>
                          ))}
                          {collegeContacts.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{collegeContacts.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setSelectedCollege(college)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(college)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit College
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Meeting
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="h-4 w-4 mr-2" />
                        Manage Contacts
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(college.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete College
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-xs text-gray-500">
                    Added {new Date(college.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    {college.phone && (
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    )}
                    {college.email && (
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    )}
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                      <Target className="h-4 w-4 mr-1" />
                      Follow Up
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
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No colleges found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first college'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First College
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* College Detail Modal */}
      {selectedCollege && (
        <Dialog open={!!selectedCollege} onOpenChange={() => setSelectedCollege(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {selectedCollege.name}
              </DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
                <TabsTrigger value="meetings">Meetings</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">
                      <Badge className={getStatusConfig(selectedCollege.status).color}>
                        {getStatusConfig(selectedCollege.status).label}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1">{selectedCollege.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1">{selectedCollege.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Website</label>
                    <p className="mt-1">
                      {selectedCollege.website ? (
                        <a href={selectedCollege.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {selectedCollege.website}
                        </a>
                      ) : 'Not provided'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1">{selectedCollege.address || 'Not provided'}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="contacts">
                <div className="space-y-4">
                  {getCollegeContacts(selectedCollege.id).map((contact) => (
                    <Card key={contact.id}>
                      <CardContent className="p-4">
                        <h4 className="font-semibold">{contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.designation}</p>
                        <div className="flex gap-4 mt-2 text-sm">
                          {contact.phone && <span>📞 {contact.phone}</span>}
                          {contact.email && <span>✉️ {contact.email}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="meetings">
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Meeting history will be displayed here</p>
                </div>
              </TabsContent>
              <TabsContent value="notes">
                <div className="text-center py-8 text-gray-500">
                  <p>Notes and comments will be displayed here</p>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Colleges;
