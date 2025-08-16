
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BookOpen, 
  Users, 
  Calendar,
  Target,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  PieChart,
  Settings
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/useCourses';
import { CourseStructureSection } from './CourseStructureSection';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

interface PricingSectionProps {
  collegeId: string;
}

export const PricingSection = ({ collegeId }: PricingSectionProps) => {
  const { data: courses = [], isLoading } = useCourses(collegeId);
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState({
    name: '',
    category: '',
    base_price: 0,
    min_price: 0,
    max_price: 0,
    duration: '',
    capacity: 0,
    description: ''
  });

  const handleCreateCourse = async () => {
    if (!newCourse.name || !newCourse.base_price) return;

    const courseData = {
      college_id: collegeId,
      name: newCourse.name,
      category: newCourse.category || 'Other',
      base_price: newCourse.base_price,
      min_price: newCourse.min_price || newCourse.base_price * 0.8,
      max_price: newCourse.max_price || newCourse.base_price * 1.2,
      duration: newCourse.duration || '1 year',
      capacity: newCourse.capacity || 50,
      description: newCourse.description || null
    };

    await createCourseMutation.mutateAsync(courseData);
    setNewCourse({
      name: '',
      category: '',
      base_price: 0,
      min_price: 0,
      max_price: 0,
      duration: '',
      capacity: 0,
      description: ''
    });
    setIsDialogOpen(false);
  };

  const handleUpdateCourse = async (courseId: string, updates: any) => {
    await updateCourseMutation.mutateAsync({ id: courseId, ...updates });
    setEditingCourse(null);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course? This will also delete all associated topics.')) {
      await deleteCourseMutation.mutateAsync(courseId);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Engineering': 'bg-blue-100 text-blue-700 border-blue-200',
      'Management': 'bg-purple-100 text-purple-700 border-purple-200',
      'Medical': 'bg-red-100 text-red-700 border-red-200',
      'Arts': 'bg-green-100 text-green-700 border-green-200',
      'Science': 'bg-orange-100 text-orange-700 border-orange-200',
      'Other': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  // Prepare chart data
  const chartData = courses.map(course => ({
    name: course.name.substring(0, 15) + (course.name.length > 15 ? '...' : ''),
    basePrice: Number(course.base_price),
    minPrice: Number(course.min_price || 0),
    maxPrice: Number(course.max_price || 0),
    capacity: course.capacity
  }));

  const categoryData = courses.reduce((acc: any[], course) => {
    const existing = acc.find(item => item.name === course.category);
    if (existing) {
      existing.value += 1;
      existing.totalPrice += Number(course.base_price);
    } else {
      acc.push({
        name: course.category,
        value: 1,
        totalPrice: Number(course.base_price)
      });
    }
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (selectedCourseId) {
    const selectedCourse = courses.find(c => c.id === selectedCourseId);
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setSelectedCourseId(null)}
            className="border-primary/20 hover:bg-primary/5"
          >
            ← Back to Pricing
          </Button>
          <h2 className="text-xl font-semibold text-foreground">
            Course Structure - {selectedCourse?.name}
          </h2>
        </div>
        <CourseStructureSection 
          courseId={selectedCourseId} 
          courseName={selectedCourse?.name || ''} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Course Pricing Management</h3>
          <p className="text-muted-foreground">Manage course pricing, capacity, and structure</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Course Name *</Label>
                <Input
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                  placeholder="Enter course name"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newCourse.category} onValueChange={(value) => setNewCourse({...newCourse, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                    <SelectItem value="Medical">Medical</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Base Price (₹) *</Label>
                <Input
                  type="number"
                  value={newCourse.base_price || ''}
                  onChange={(e) => setNewCourse({...newCourse, base_price: Number(e.target.value)})}
                  placeholder="100000"
                />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                  placeholder="4 years"
                />
              </div>
              <div className="space-y-2">
                <Label>Minimum Price (₹)</Label>
                <Input
                  type="number"
                  value={newCourse.min_price || ''}
                  onChange={(e) => setNewCourse({...newCourse, min_price: Number(e.target.value)})}
                  placeholder="80000"
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum Price (₹)</Label>
                <Input
                  type="number"
                  value={newCourse.max_price || ''}
                  onChange={(e) => setNewCourse({...newCourse, max_price: Number(e.target.value)})}
                  placeholder="120000"
                />
              </div>
              <div className="space-y-2">
                <Label>Capacity</Label>
                <Input
                  type="number"
                  value={newCourse.capacity || ''}
                  onChange={(e) => setNewCourse({...newCourse, capacity: Number(e.target.value)})}
                  placeholder="60"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  placeholder="Course description"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCourse} disabled={createCourseMutation.isPending}>
                {createCourseMutation.isPending ? 'Creating...' : 'Create Course'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {courses.length > 0 && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="charts">Analytics</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Average Price</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatPrice(courses.reduce((sum, course) => sum + Number(course.base_price), 0) / courses.length)}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-500 rounded-full">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">Total Courses</p>
                      <p className="text-2xl font-bold text-green-900">{courses.length}</p>
                    </div>
                    <div className="p-3 bg-green-500 rounded-full">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">Total Capacity</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {courses.reduce((sum, course) => sum + course.capacity, 0)}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-500 rounded-full">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-700">Revenue Potential</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {formatPrice(courses.reduce((sum, course) => sum + (Number(course.base_price) * course.capacity), 0))}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-500 rounded-full">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Price Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatPrice(Number(value))} />
                      <Legend />
                      <Bar dataKey="minPrice" fill="#ef4444" name="Min Price" />
                      <Bar dataKey="basePrice" fill="#3b82f6" name="Base Price" />
                      <Bar dataKey="maxPrice" fill="#10b981" name="Max Price" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Category Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} (${value})`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            {courses.map((course) => (
              <Card key={course.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                        <h4 className="text-lg font-semibold text-foreground">{course.name}</h4>
                        <Badge className={getCategoryColor(course.category)}>
                          {course.category}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">Base: </span>
                          <span className="font-medium">{formatPrice(Number(course.base_price))}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          <span className="text-muted-foreground">Min: </span>
                          <span className="font-medium">{formatPrice(Number(course.min_price || 0))}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-muted-foreground">Max: </span>
                          <span className="font-medium">{formatPrice(Number(course.max_price || 0))}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span className="text-muted-foreground">Capacity: </span>
                          <span className="font-medium">{course.capacity}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {course.duration}
                        </div>
                        {course.description && (
                          <p className="truncate">{course.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedCourseId(course.id)}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Structure
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingCourse(course)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Additional pricing configuration options will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {courses.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No courses yet</h3>
            <p className="text-muted-foreground">Get started by adding your first course</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
