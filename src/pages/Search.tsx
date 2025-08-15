
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search as SearchIcon, 
  Building2, 
  Users, 
  Calendar, 
  Filter,
  MapPin,
  Mail,
  Phone,
  Clock,
  ExternalLink
} from "lucide-react";
import { useColleges } from "@/hooks/useColleges";
import { useContacts } from "@/hooks/useContacts";
import { useMeetings } from "@/hooks/useMeetings";
import { format, parseISO } from "date-fns";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: colleges = [] } = useColleges();
  const { data: contacts = [] } = useContacts();
  const { data: meetings = [] } = useMeetings();

  // Search logic
  const searchColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const searchContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.college_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const searchMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.agenda?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.college_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalResults = searchColleges.length + searchContacts.length + searchMeetings.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed_won': return 'bg-green-100 text-green-800 border-green-200';
      case 'negotiation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'lost': return 'bg-red-100 text-red-800 border-red-200';
      case 'interested': return 'bg-green-100 text-green-800 border-green-200';
      case 'follow_up': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not_interested': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <AppLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-slate-50 min-h-screen">
        {/* Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Search</h1>
          <p className="text-slate-600 mt-1">Find colleges, contacts, and meetings across your CRM</p>
        </div>

        {/* Search Input */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search across colleges, contacts, and meetings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 text-base"
                autoFocus
              />
            </div>
            {searchTerm && (
              <div className="mt-3 text-sm text-slate-600">
                Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{searchTerm}"
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {searchTerm ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="overflow-x-auto">
              <TabsList className="grid w-full grid-cols-4 min-w-max">
                <TabsTrigger value="all" className="text-xs sm:text-sm">
                  All ({totalResults})
                </TabsTrigger>
                <TabsTrigger value="colleges" className="text-xs sm:text-sm">
                  <Building2 className="w-4 h-4 mr-1" />
                  Colleges ({searchColleges.length})
                </TabsTrigger>
                <TabsTrigger value="contacts" className="text-xs sm:text-sm">
                  <Users className="w-4 h-4 mr-1" />
                  Contacts ({searchContacts.length})
                </TabsTrigger>
                <TabsTrigger value="meetings" className="text-xs sm:text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  Meetings ({searchMeetings.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-4">
              {/* Colleges Section */}
              {searchColleges.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900">Colleges ({searchColleges.length})</h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {searchColleges.slice(0, 6).map((college) => (
                      <Card key={college.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium truncate flex-1">{college.name}</h4>
                            <Badge className={`text-xs ml-2 ${getStatusColor(college.status)}`}>
                              {college.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-slate-600">
                            {(college.city || college.state) && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{[college.city, college.state].filter(Boolean).join(', ')}</span>
                              </div>
                            )}
                            {college.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                <span className="truncate">{college.email}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {searchColleges.length > 6 && (
                    <Button variant="outline" onClick={() => setActiveTab("colleges")}>
                      View all {searchColleges.length} colleges
                    </Button>
                  )}
                </div>
              )}

              {/* Contacts Section */}
              {searchContacts.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-slate-900">Contacts ({searchContacts.length})</h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {searchContacts.slice(0, 6).map((contact) => (
                      <Card key={contact.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-1">{contact.name}</h4>
                          <div className="space-y-1 text-sm text-slate-600">
                            {contact.designation && (
                              <div>{contact.designation}</div>
                            )}
                            {contact.college_name && (
                              <div className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                <span className="truncate">{contact.college_name}</span>
                              </div>
                            )}
                            {contact.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                <span className="truncate">{contact.email}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {searchContacts.length > 6 && (
                    <Button variant="outline" onClick={() => setActiveTab("contacts")}>
                      View all {searchContacts.length} contacts
                    </Button>
                  )}
                </div>
              )}

              {/* Meetings Section */}
              {searchMeetings.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-slate-900">Meetings ({searchMeetings.length})</h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {searchMeetings.slice(0, 6).map((meeting) => (
                      <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium truncate flex-1">{meeting.title}</h4>
                            {meeting.outcome && (
                              <Badge className={`text-xs ml-2 ${getStatusColor(meeting.outcome)}`}>
                                {meeting.outcome.replace('_', ' ')}
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-1 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{format(parseISO(meeting.meeting_date), 'MMM d, yyyy h:mm a')}</span>
                            </div>
                            {meeting.college_name && (
                              <div className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                <span className="truncate">{meeting.college_name}</span>
                              </div>
                            )}
                            {meeting.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{meeting.location}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {searchMeetings.length > 6 && (
                    <Button variant="outline" onClick={() => setActiveTab("meetings")}>
                      View all {searchMeetings.length} meetings
                    </Button>
                  )}
                </div>
              )}

              {totalResults === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <SearchIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No results found</h3>
                    <p className="text-slate-600">
                      Try searching with different keywords or check your spelling
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="colleges" className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {searchColleges.map((college) => (
                  <Card key={college.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium truncate flex-1">{college.name}</h4>
                        <Badge className={`text-xs ml-2 ${getStatusColor(college.status)}`}>
                          {college.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-slate-600">
                        {(college.city || college.state) && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{[college.city, college.state].filter(Boolean).join(', ')}</span>
                          </div>
                        )}
                        {college.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{college.email}</span>
                          </div>
                        )}
                        {college.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span className="truncate">{college.phone}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {searchContacts.map((contact) => (
                  <Card key={contact.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-1">{contact.name}</h4>
                      <div className="space-y-1 text-sm text-slate-600">
                        {contact.designation && (
                          <div>{contact.designation}</div>
                        )}
                        {contact.college_name && (
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            <span className="truncate">{contact.college_name}</span>
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span className="truncate">{contact.phone}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="meetings" className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {searchMeetings.map((meeting) => (
                  <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium truncate flex-1">{meeting.title}</h4>
                        {meeting.outcome && (
                          <Badge className={`text-xs ml-2 ${getStatusColor(meeting.outcome)}`}>
                            {meeting.outcome.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{format(parseISO(meeting.meeting_date), 'MMM d, yyyy h:mm a')}</span>
                        </div>
                        {meeting.college_name && (
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            <span className="truncate">{meeting.college_name}</span>
                          </div>
                        )}
                        {meeting.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{meeting.location}</span>
                          </div>
                        )}
                        {meeting.agenda && (
                          <p className="text-xs text-slate-500 truncate">{meeting.agenda}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <SearchIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-900 mb-2">Search Your CRM</h3>
              <p className="text-slate-600 mb-6">
                Find colleges, contacts, and meetings quickly across your entire database
              </p>
              <div className="text-sm text-slate-500 space-y-1">
                <p>• Search by name, location, email, or any other field</p>
                <p>• Use filters to narrow down your results</p>
                <p>• Click on any result to view more details</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
