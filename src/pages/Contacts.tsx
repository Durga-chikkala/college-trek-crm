
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Users, Plus, Search, Mail, Phone, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/contacts/ContactForm";
import { useContacts } from "@/hooks/useContacts";

const Contacts = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: contacts = [], isLoading } = useContacts();

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.college_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.designation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold text-slate-900">Contacts</h1>
            <p className="text-slate-600">Manage your college contacts and relationships</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Contact
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {contacts.length === 0 ? "No contacts added" : "No contacts match your search"}
            </h3>
            <p className="text-slate-500 mb-4">
              {contacts.length === 0 ? "Start by adding your first college contact" : "Try adjusting your search terms"}
            </p>
            {contacts.length === 0 && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Contact
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">{contact.name}</CardTitle>
                      <p className="text-sm text-blue-600 font-medium">{contact.college_name}</p>
                    </div>
                    {contact.is_primary && (
                      <Badge variant="secondary">Primary</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contact.designation && (
                    <p className="text-sm font-medium text-gray-700">{contact.designation}</p>
                  )}
                  
                  <div className="space-y-2">
                    {contact.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                          {contact.email}
                        </a>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                    {contact.linkedin && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Linkedin className="w-4 h-4" />
                        <a
                          href={contact.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </div>

                  {contact.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600">{contact.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <ContactForm open={showForm} onOpenChange={setShowForm} />
      </div>
    </AppLayout>
  );
};

export default Contacts;
