import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  BarChart3,
  PieChart,
  Upload,
  Download
} from 'lucide-react';
import { useCollegeCourses, useAssignCourseToCollege, useUnassignCourseFromCollege } from '@/hooks/useCollegeCourses';
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/useCourses';
import { PieChart as RechartsPieChart, Cell, Pie, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface SimplifiedCourseManagementProps {
  collegeId: string;
  collegeName: string;
}

export const SimplifiedCourseManagement = ({ collegeId, collegeName }: SimplifiedCourseManagementProps) => {
  const { data: collegeCourses = [], isLoading } = useCollegeCourses(collegeId);
  const { data: allCourses = [] } = useCourses();
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();
  const assignCourseMutation = useAssignCourseToCollege();
  const unassignCourseMutation = useUnassignCourseFromCollege();

  // Extract courses from college courses with their course details
  const courses = collegeCourses.map(cc => ({
    ...cc.courses,
    collegeCourseId: cc.id,
    pricingModel: cc.pricing_models
  })).filter(course => course.id);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    category: '',
    duration: '',
    base_price: 0,
    min_price: 0,
    max_price: 0,
    capacity: 0
  });

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(courses.map(c => c.category))];
  const availableCoursesToAssign = allCourses.filter(course => 
    !collegeCourses.some(cc => cc.course_id === course.id)
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleCreateCourse = async () => {
    await createCourseMutation.mutateAsync(newCourse);
    setIsCreateDialogOpen(false);
    setNewCourse({
      name: '',
      description: '',
      category: '',
      duration: '',
      base_price: 0,
      min_price: 0,
      max_price: 0,
      capacity: 0
    });
  };

  const handleAssignCourse = async (courseId: string) => {
    await assignCourseMutation.mutateAsync({ collegeId, courseId });
    setIsAssignDialogOpen(false);
  };

  const handleUnassignCourse = async (collegeCourseId: string) => {
    if (confirm('Are you sure you want to unassign this course from the college?')) {
      await unassignCourseMutation.mutateAsync(collegeCourseId);
    }
  };

  const handleUpdateCourse = async () => {
    if (editingCourse) {
      await updateCourseMutation.mutateAsync(editingCourse);
      setEditingCourse(null);
    }
  };

  // Analytics calculations
  const totalCourses = courses.length;
  const totalCapacity = courses.reduce((sum, course) => sum + course.capacity, 0);
  const avgPrice = courses.reduce((sum, course) => sum + Number(course.base_price), 0) / courses.length || 0;
  const totalRevenue = courses.reduce((sum, course) => sum + (Number(course.base_price) * course.capacity), 0);

  // Chart data
  const categoryData = categories.map(category => {
    const categoryCourses = courses.filter(c => c.category === category);
    return {
      name: category,
      count: categoryCourses.length,
      revenue: categoryCourses.reduce((sum, c) => sum + (Number(c.base_price) * c.capacity), 0)
    };
  });

  const priceData = courses.map(course => ({
    name: course.name.substring(0, 15),
    price: Number(course.base_price),
    capacity: course.capacity
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Course Management</h2>
          <p className="text-muted-foreground">{collegeName} - Manage courses and assignments</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Target className="h-4 w-4" />
                Assign Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Course to College</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {availableCoursesToAssign.map(course => (
                    <Card key={course.id} className="p-4 cursor-pointer hover:bg-muted/50" 
                          onClick={() => handleAssignCourse(course.id)}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{course.name}</h4>
                          <p className="text-sm text-muted-foreground">{course.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{course.category}</Badge>
                            <Badge variant="secondary">{formatPrice(Number(course.base_price))}</Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {availableCoursesToAssign.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      All courses are already assigned to this college
                    </p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Course Name</Label>
                  <Input
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input
                    type="number"
                    value={newCourse.capacity}
                    onChange={(e) => setNewCourse({...newCourse, capacity: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Base Price (₹)</Label>
                  <Input
                    type="number"
                    value={newCourse.base_price}
                    onChange={(e) => setNewCourse({...newCourse, base_price: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Min Price (₹)</Label>
                  <Input
                    type="number"
                    value={newCourse.min_price}
                    onChange={(e) => setNewCourse({...newCourse, min_price: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Price (₹)</Label>
                  <Input
                    type="number"
                    value={newCourse.max_price}
                    onChange={(e) => setNewCourse({...newCourse, max_price: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCourse}>
                  Create Course
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Courses</p>
                <p className="text-2xl font-bold text-blue-900">{totalCourses}</p>
                <p className="text-xs text-blue-600 mt-1">Active courses</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Capacity</p>
                <p className="text-2xl font-bold text-green-900">{totalCapacity.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">Students</p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Average Price</p>
                <p className="text-2xl font-bold text-purple-900">{formatPrice(avgPrice)}</p>
                <p className="text-xs text-purple-600 mt-1">Per course</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Revenue Potential</p>
                <p className="text-2xl font-bold text-orange-900">{formatPrice(totalRevenue)}</p>
                <p className="text-xs text-orange-600 mt-1">Maximum</p>
              </div>
              <div className="p-3 bg-orange-500 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">Course List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          {/* Search and Filter */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search courses..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full lg:w-[200px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Course List */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/95">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground mb-2">
                        {course.name}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">{course.category}</Badge>
                        <Badge variant="secondary">{course.duration}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Price: </span>
                      <span className="font-medium">{formatPrice(Number(course.base_price))}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Capacity: </span>
                      <span className="font-medium">{course.capacity}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setEditingCourse(course)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUnassignCourse(course.collegeCourseId)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || categoryFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Get started by assigning or creating your first course'
                  }
                </p>
                <Button onClick={() => setIsAssignDialogOpen(true)}>
                  <Target className="h-4 w-4 mr-2" />
                  Assign Course
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Courses by Category
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
                      label={({ name, count }) => `${name}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
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

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Price Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatPrice(Number(value))} />
                    <Bar dataKey="price" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Course Dialog */}
      {editingCourse && (
        <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Course Name</Label>
                <Input
                  value={editingCourse.name}
                  onChange={(e) => setEditingCourse({...editingCourse, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={editingCourse.category}
                  onChange={(e) => setEditingCourse({...editingCourse, category: e.target.value})}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  value={editingCourse.duration}
                  onChange={(e) => setEditingCourse({...editingCourse, duration: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Capacity</Label>
                <Input
                  type="number"
                  value={editingCourse.capacity}
                  onChange={(e) => setEditingCourse({...editingCourse, capacity: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Base Price (₹)</Label>
                <Input
                  type="number"
                  value={editingCourse.base_price}
                  onChange={(e) => setEditingCourse({...editingCourse, base_price: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Min Price (₹)</Label>
                <Input
                  type="number"
                  value={editingCourse.min_price}
                  onChange={(e) => setEditingCourse({...editingCourse, min_price: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Price (₹)</Label>
                <Input
                  type="number"
                  value={editingCourse.max_price}
                  onChange={(e) => setEditingCourse({...editingCourse, max_price: Number(e.target.value)})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setEditingCourse(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCourse}>
                Update Course
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
