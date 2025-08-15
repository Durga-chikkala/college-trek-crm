import React, { useState } from 'react';
import { useContacts, useCreateContact, useUpdateContact, useDeleteContact } from '@/hooks/useContacts';
import { useColleges } from '@/hooks/useColleges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ContactForm } from '@/components/contacts/ContactForm';
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical,
  Edit,
  Trash2,
  Phone,
  Mail,
  Building2,
  Star,
  Copy,
  ExternalLink,
  Filter,
  SortAsc,
  Linkedin,
  MessageCircle,
  Calendar,
  User
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const { data: contacts = [], isLoading } = useContacts();
  const { data: colleges = [] } = useColleges();
  const deleteContact = useDeleteContact();

  const filteredAndSortedContacts = contacts
    .filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.designation?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCollege = collegeFilter === 'all' || contact.college_id === collegeFilter;
      return matchesSearch && matchesCollege;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'college':
          const collegeA = colleges.find(c => c.id === a.college_id)?.name || '';
          const collegeB = colleges.find(c => c.id === b.college_id)?.name || '';
          return collegeA.localeCompare(collegeB);
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  const handleEdit = (contact: any) => {
    setEditingContact(contact);
    setIsDialogOpen(true);
  };

  const handleDelete = (contactId: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      deleteContact.mutate(contactId);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${type} copied to clipboard` });
  };

  const toggleFavorite = (contactId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(contactId)) {
      newFavorites.delete(contactId);
    } else {
      newFavorites.add(contactId);
    }
    setFavorites(newFavorites);
  };

  const getCollegeName = (collegeId: string) => {
    return colleges.find(c => c.id === collegeId)?.name || 'Unknown College';
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingContact(null);
    }
  };

  const primaryContacts = contacts.filter(contact => contact.is_primary);
  const totalCollegesWithContacts = new Set(contacts.map(c => c.college_id)).size;

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
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-2">Manage your college contacts and relationships</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <ContactForm 
            open={isDialogOpen}
            onOpenChange={handleDialogOpenChange}
            contact={editingContact}
          />
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Contacts</p>
                <p className="text-2xl font-bold">{contacts.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Primary Contacts</p>
                <p className="text-2xl font-bold">{primaryContacts.length}</p>
              </div>
              <Star className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Colleges Covered</p>
                <p className="text-2xl font-bold">{totalCollegesWithContacts}</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Avg per College</p>
                <p className="text-2xl font-bold">
                  {totalCollegesWithContacts > 0 
                    ? Math.round(contacts.length / totalCollegesWithContacts)
                    : 0}
                </p>
              </div>
              <User className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search contacts by name, email, or designation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={collegeFilter} onValueChange={setCollegeFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by college" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Colleges</SelectItem>
                  {colleges.map((college) => (
                    <SelectItem key={college.id} value={college.id}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="created_at">Date Added</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Grid */}
      <div className="grid gap-4">
        {filteredAndSortedContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(contact.id)}
                          className={favorites.has(contact.id) ? 'text-yellow-500' : 'text-gray-400'}
                        >
                          <Star className={`h-4 w-4 ${favorites.has(contact.id) ? 'fill-current' : ''}`} />
                        </Button>
                        {contact.is_primary && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            Primary
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600">{contact.designation}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{getCollegeName(contact.college_id)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span 
                          className="cursor-pointer hover:text-green-600"
                          onClick={() => handleCopy(contact.phone!, 'Phone number')}
                        >
                          {contact.phone}
                        </span>
                        <Copy className="h-3 w-3 cursor-pointer hover:text-green-600" />
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span 
                          className="cursor-pointer hover:text-green-600"
                          onClick={() => handleCopy(contact.email!, 'Email')}
                        >
                          {contact.email}
                        </span>
                        <Copy className="h-3 w-3 cursor-pointer hover:text-green-600" />
                      </div>
                    )}
                    {contact.linkedin && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Linkedin className="h-4 w-4" />
                        <a 
                          href={contact.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-green-600 flex items-center gap-1"
                        >
                          LinkedIn Profile
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {contact.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{contact.notes}</p>
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
                    <DropdownMenuItem onClick={() => handleEdit(contact)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Contact
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Phone className="h-4 w-4 mr-2" />
                      Make Call
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Contact
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <div className="text-xs text-gray-500">
                  Added {new Date(contact.created_at).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  {contact.phone && (
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                  )}
                  {contact.email && (
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                  )}
                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    Meet
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedContacts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || collegeFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first contact'}
            </p>
            {!searchTerm && collegeFilter === 'all' && (
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Contact
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Contacts;
