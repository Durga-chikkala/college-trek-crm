
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Users, Plus, Search, Filter, Edit2, Trash2, Mail, Phone, Linkedin, Building2, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContactForm } from "@/components/contacts/ContactForm";
import { useContacts, useDeleteContact } from "@/hooks/useContacts";
import { useColleges } from "@/hooks/useColleges";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Tables } from "@/integrations/supabase/types";

const Contacts = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<(Tables<'contacts'> & { college_name?: string }) | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [collegeFilter, setCollegeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const { data: contacts = [], isLoading } = useContacts();
  const { data: colleges = [] } = useColleges();
  const deleteContact = useDeleteContact();

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.designation?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollege = collegeFilter === "all" || contact.college_id === collegeFilter;
    return matchesSearch && matchesCollege;
  });

  const handleEdit = (contact: Tables<'contacts'> & { college_name?: string }) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteContact.mutateAsync(id);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  const primaryContacts = filteredContacts.filter(c => c.is_primary);
  const totalContacts = contacts.length;

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
              <Users className="w-8 h-8 text-purple-600" />
              Contacts
            </h1>
            <p className="text-slate-600">Manage your college contacts and relationships</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}>
              {viewMode === "grid" ? "Table View" : "Grid View"}
            </Button>
            <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{totalContacts}</div>
              <p className="text-xs text-gray-600">Total Contacts</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{primaryContacts.length}</div>
              <p className="text-xs text-gray-600">Primary Contacts</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{colleges.length}</div>
              <p className="text-xs text-gray-600">Colleges Covered</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{contacts.filter(c => c.email).length}</div>
              <p className="text-xs text-gray-600">With Email</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={collegeFilter} onValueChange={setCollegeFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
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
        </div>

        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {contacts.length === 0 ? "No contacts yet" : "No contacts match your filters"}
            </h3>
            <p className="text-slate-500 mb-4">
              {contacts.length === 0 ? "Start by adding your first contact" : "Try adjusting your search or filters"}
            </p>
            {contacts.length === 0 && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Contact
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
                {filteredContacts.map((contact) => (
                  <Card key={contact.id} className="hover:shadow-lg transition-all duration-200 group relative overflow-hidden">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(contact)}>
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
                              <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {contact.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(contact.id)} className="bg-red-600 hover:bg-red-700">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <User className="w-5 h-5 text-purple-500" />
                            {contact.name}
                          </CardTitle>
                          {contact.designation && (
                            <p className="text-sm text-slate-600 mt-1">{contact.designation}</p>
                          )}
                        </div>
                        {contact.is_primary && (
                          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                            Primary
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span className="text-blue-600 font-medium">{contact.college_name}</span>
                      </div>
                      
                      {contact.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-blue-600 hover:underline cursor-pointer">{contact.email}</span>
                        </div>
                      )}
                      
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                      
                      {contact.linkedin && (
                        <div className="flex items-center gap-2 text-sm">
                          <Linkedin className="w-4 h-4 text-slate-400" />
                          <a
                            href={contact.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                      
                      {contact.notes && (
                        <div className="text-sm text-slate-600 pt-2 border-t">
                          <p className="line-clamp-2">{contact.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t">
                        <Calendar className="w-3 h-3" />
                        <span>Added {new Date(contact.created_at).toLocaleDateString()}</span>
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
                      <TableHead>College</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Primary</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell className="text-blue-600">{contact.college_name}</TableCell>
                        <TableCell>{contact.designation || '-'}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {contact.email && (
                              <div className="text-sm text-blue-600">{contact.email}</div>
                            )}
                            {contact.phone && (
                              <div className="text-sm text-slate-600">{contact.phone}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {contact.is_primary && (
                            <Badge className="bg-green-100 text-green-800 text-xs">Primary</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(contact)}>
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
                                  <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {contact.name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(contact.id)} className="bg-red-600 hover:bg-red-700">
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

        <ContactForm 
          open={showForm} 
          onOpenChange={handleCloseForm}
          contact={editingContact}
        />
      </div>
    </AppLayout>
  );
};

export default Contacts;
