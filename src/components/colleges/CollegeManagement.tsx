
import React, { useState, useMemo } from 'react';
import { useColleges } from '@/hooks/useColleges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Globe,
  TrendingUp,
  DollarSign,
  BookOpen
} from 'lucide-react';
import { CollegeForm } from './CollegeForm';

type College = {
  id: string;
  name: string;
  location: string;
  contact_person: string;
  email: string;
  phone: string;
  website: string;
  status: 'prospect' | 'negotiation' | 'closed_won' | 'lost';
  created_at: string;
  updated_at: string;
};

const statusConfig = {
  prospect: { label: 'Prospect', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  negotiation: { label: 'Negotiation', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  closed_won: { label: 'Closed Won', color: 'bg-green-100 text-green-800 border-green-200' },
  lost: { label: 'Lost', color: 'bg-red-100 text-red-800 border-red-200' }
};

export function CollegeManagement() {
  const { data: colleges = [], isLoading } = useColleges();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCollegeForm, setShowCollegeForm] = useState(false);

  // Filter colleges based on search and status
  const filteredColleges = useMemo(() => {
    return colleges.filter((college: College) => {
      const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           college.contact_person.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || college.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [colleges, searchTerm, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = colleges.length;
    const prospects = colleges.filter((c: College) => c.status === 'prospect').length;
    const negotiations = colleges.filter((c: College) => c.status === 'negotiation').length;
    const closedWon = colleges.filter((c: College) => c.status === 'closed_won').length;
    
    return { total, prospects, negotiations, closedWon };
  }, [colleges]);

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">College Management</h1>
            <p className="text-sm lg:text-base text-muted-foreground">Manage your college partnerships and relationships</p>
          </div>
          <Button 
            onClick={() => setShowCollegeForm(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add College
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="p-2 lg:p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                  <Building2 className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-lg lg:text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="p-2 lg:p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600">
                  <TrendingUp className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">Prospects</p>
                  <p className="text-lg lg:text-2xl font-bold text-foreground">{stats.prospects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="p-2 lg:p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
                  <DollarSign className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">Negotiating</p>
                  <p className="text-lg lg:text-2xl font-bold text-foreground">{stats.negotiations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="p-2 lg:p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
                  <BookOpen className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">Closed Won</p>
                  <p className="text-lg lg:text-2xl font-bold text-foreground">{stats.closedWon}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search colleges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                  className="text-xs lg:text-sm"
                >
                  All
                </Button>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className="text-xs lg:text-sm"
                  >
                    {config.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* College Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {filteredColleges.map((college: College) => (
            <Card key={college.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base lg:text-lg font-semibold text-foreground truncate">
                      {college.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
                      <span className="text-xs lg:text-sm text-muted-foreground truncate">{college.location}</span>
                    </div>
                  </div>
                  <Badge className={`${statusConfig[college.status].color} text-xs border`}>
                    {statusConfig[college.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
                    <span className="text-xs lg:text-sm text-muted-foreground">{college.contact_person}</span>
                  </div>
                  
                  {college.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
                      <span className="text-xs lg:text-sm text-muted-foreground truncate">{college.email}</span>
                    </div>
                  )}
                  
                  {college.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
                      <span className="text-xs lg:text-sm text-muted-foreground">{college.phone}</span>
                    </div>
                  )}
                  
                  {college.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
                      <span className="text-xs lg:text-sm text-muted-foreground truncate">{college.website}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs lg:text-sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs lg:text-sm">
                    <Calendar className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredColleges.length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 lg:p-12 text-center">
              <Building2 className="h-12 w-12 lg:h-16 lg:w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg lg:text-xl font-medium text-foreground mb-2">No colleges found</h3>
              <p className="text-sm lg:text-base text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Get started by adding your first college partnership.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => setShowCollegeForm(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First College
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <CollegeForm open={showCollegeForm} onOpenChange={setShowCollegeForm} />
    </>
  );
}
