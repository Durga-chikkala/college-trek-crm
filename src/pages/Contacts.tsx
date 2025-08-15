
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Phone, Mail, Linkedin, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Contact {
  id: string;
  name: string;
  designation: string;
  phone: string;
  email: string;
  linkedin: string;
  notes: string;
  is_primary: boolean;
  college: {
    name: string;
    city: string;
    state: string;
  };
}

export default function Contacts() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("contacts")
          .select(`
            *,
            college:colleges (
              name,
              city,
              state
            )
          `)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching contacts:", error);
        } else {
          setContacts(data || []);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [user]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-slate-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-slate-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Contacts</h1>
          <p className="text-slate-600">Manage your college contact persons</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {contacts.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No contacts found</h3>
            <p className="text-slate-600 text-center mb-6">
              Start building your network by adding contact persons from colleges.
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Contact
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <Card key={contact.id} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      {contact.name}
                      {contact.is_primary && (
                        <Badge variant="secondary" className="text-xs">
                          Primary
                        </Badge>
                      )}
                    </CardTitle>
                    {contact.designation && (
                      <CardDescription className="mt-1">
                        {contact.designation}
                      </CardDescription>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                  <Building2 className="w-4 h-4" />
                  <span>{contact.college?.name}</span>
                </div>
                <div className="text-xs text-slate-500">
                  {contact.college?.city}, {contact.college?.state}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline truncate">
                        {contact.email}
                      </a>
                    </div>
                  )}
                  {contact.linkedin && (
                    <div className="flex items-center gap-2 text-sm">
                      <Linkedin className="w-4 h-4 text-slate-400" />
                      <a 
                        href={contact.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline truncate"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>

                {contact.notes && (
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                      {contact.notes}
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
