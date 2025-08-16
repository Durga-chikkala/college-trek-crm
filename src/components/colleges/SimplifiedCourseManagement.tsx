import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/useCourses';
import { CourseStructureSection } from './CourseStructureSection';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Clock,
  Tag,
  FileText,
  BarChart3,
  PieChartIcon,
  TrendingUp,
  DollarSign,
  Target
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

interface SimplifiedCourseManagementProps {
  collegeId: string;
  collegeName: string;
}

export const SimplifiedCourseManagement = ({ collegeId, collegeName }: SimplifiedCourseManagementProps) => {
  const { data: courses = [], isLoading } = useCourses(collegeId);
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState({
    name: '',
    category: '',
    description: '',
    base_price: 0,
    min_price: 0,
    max_price: 0,
    duration: '',
    capacity: 0
  });

  // Analytics data
  const categoryData = courses.reduce((acc: any[], course) => {
    const category = course.category || 'General';
    const existing = acc.find(item => item.category === category);
    if (existing) {
      existing.count += 1;
      existing.revenue += course.base_price || 0;
    } else {
      acc.push({ 
        category, 
        count: 1, 
        revenue: course.base_price || 0,
        fill: COLORS[acc.length % COLORS.length]
      });
    }
    return acc;
  }, []);

  const priceRangeData = [
    { range: '0-500', count: courses.filter(c => (c.base_price || 0) <= 500).length },
    { range: '501-1000', count: courses.filter(c => (c.base_price || 0) > 500 && (c.base_price || 0) <= 1000).length },
    { range: '1001-2000', count: courses.filter(c => (c.base_price || 0) > 1000 && (c.base_price || 0) <= 2000).length },
    { range: '2000+', count: courses.filter(c => (c.base_price || 0) > 2000).length },
  ].filter(item => item.count > 0);

  const totalRevenue = courses.reduce((sum, course) => sum + (course.base_price || 0), 0);
  const avgPrice = courses.length > 0 ? Math.round(totalRevenue / courses.length) : 0;

  const handleCreateCourse = async () => {
    if (!newCourse.name.trim()) return;

    await createCourseMutation.mutateAsync({
      ...newCourse,
      college_id: collegeId
    });

    setNewCourse({
      name: '',
      category: '',
      description: '',
      base_price: 0,
      min_price: 0,
      max_price: 0,
      duration: '',
      capacity: 0
    });
    setIsDialogOpen(false);
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) return;

    await updateCourseMutation.mutateAsync({
      id: editingCourse.id,
      name: editingCourse.name,
      category: editingCourse.category,
      description: editingCourse.description,
      base_price: editingCourse.base_price,
      min_price: editingCourse.min_price,
      max_price: editingCourse.max_price,
      duration: editingCourse.duration,
      capacity: editingCourse.capacity
    });

    setEditingCourse(null);
    setIsDialogOpen(false);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course? This will also delete all associated topics.')) {
      await deleteCourseMutation.mutateAsync(courseId);
    }
  };

  const openEditDialog = (course: any) => {
    setEditingCourse({ ...course });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCourse(null);
    setNewCourse({
      name: '',
      category: '',
      description: '',
      base_price: 0,
      min_price: 0,
      max_price: 0,
      duration: '',
      capacity: 0
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If a course is selected for structure management
  if (selectedCourse) {
    const course = courses.find(c => c.id === selectedCourse);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setSelectedCourse(null)}
            className="border-primary/20 hover:bg-primary/5"
          >
            ← Back to Courses
          </Button>
        </div>
        
        <CourseStructureSection 
          courseId={selectedCourse} 
          courseName={course?.name || 'Course'} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Course Management
          </h2>
          <p className="text-muted-foreground">
            <span className="font-medium text-primary">{collegeName}</span> - Create, manage, and structure your courses
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Target className="h-5 w-5 text-primary" />
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Course Name *</Label>
                  <Input
                    value={editingCourse ? editingCourse.name : newCourse.name}
                    onChange={(e) => editingCourse 
                      ? setEditingCourse({ ...editingCourse, name: e.target.value })
                      : setNewCourse({ ...newCourse, name: e.target.value })
                    }
                    placeholder="e.g., Full Stack Web Development"
                    className="text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Category</Label>
                  <Select
                    value={editingCourse ? editingCourse.category : newCourse.category}
                    onValueChange={(value) => editingCourse
                      ? setEditingCourse({ ...editingCourse, category: value })
                      : setNewCourse({ ...newCourse, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Duration</Label>
                  <Input
                    value={editingCourse ? editingCourse.duration : newCourse.duration}
                    onChange={(e) => editingCourse
                      ? setEditingCourse({ ...editingCourse, duration: e.target.value })
                      : setNewCourse({ ...newCourse, duration: e.target.value })
                    }
                    placeholder="e.g., 12 weeks, 6 months"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Student Capacity</Label>
                  <Input
                    type="number"
                    value={editingCourse ? editingCourse.capacity : newCourse.capacity}
                    onChange={(e) => editingCourse
                      ? setEditingCourse({ ...editingCourse, capacity: parseInt(e.target.value) || 0 })
                      : setNewCourse({ ...newCourse, capacity: parseInt(e.target.value) || 0 })
                    }
                    placeholder="Maximum students"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Base Price ($)</Label>
                  <Input
                    type="number"
                    value={editingCourse ? editingCourse.base_price : newCourse.base_price}
                    onChange={(e) => editingCourse
                      ? setEditingCourse({ ...editingCourse, base_price: parseFloat(e.target.value) || 0 })
                      : setNewCourse({ ...newCourse, base_price: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Min Price ($)</Label>
                    <Input
                      type="number"
                      value={editingCourse ? editingCourse.min_price : newCourse.min_price}
                      onChange={(e) => editingCourse
                        ? setEditingCourse({ ...editingCourse, min_price: parseFloat(e.target.value) || 0 })
                        : setNewCourse({ ...newCourse, min_price: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Max Price ($)</Label>
                    <Input
                      type="number"
                      value={editingCourse ? editingCourse.max_price : newCourse.max_price}
                      onChange={(e) => editingCourse
                        ? setEditingCourse({ ...editingCourse, max_price: parseFloat(e.target.value) || 0 })
                        : setNewCourse({ ...newCourse, max_price: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Description</Label>
                  <Textarea
                    value={editingCourse ? editingCourse.description : newCourse.description}
                    onChange={(e) => editingCourse
                      ? setEditingCourse({ ...editingCourse, description: e.target.value })
                      : setNewCourse({ ...newCourse, description: e.target.value })
                    }
                    placeholder="Describe what students will learn in this course..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button 
                onClick={editingCourse ? handleUpdateCourse : handleCreateCourse}
                disabled={editingCourse ? updateCourseMutation.isPending : createCourseMutation.isPending}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {editingCourse 
                  ? (updateCourseMutation.isPending ? 'Updating...' : 'Update Course')
                  : (createCourseMutation.isPending ? 'Creating...' : 'Create Course')
                }
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Enhanced Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold text-foreground">{courses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Price</p>
                <p className="text-2xl font-bold text-foreground">${avgPrice}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Capacity</p>
                <p className="text-2xl font-bold text-foreground">
                  {courses.reduce((sum, course) => sum + (course.capacity || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Charts */}
      {courses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                Course Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  count: { label: "Courses", color: "hsl(var(--primary))" }
                }}
                className="h-64"
              >
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ category, count }) => `${category}: ${count}`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Price Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  count: { label: "Courses", color: "hsl(var(--primary))" }
                }}
                className="h-64"
              >
                <BarChart data={priceRangeData}>
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3 border-dashed border-2 border-muted-foreground/20">
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-semibold text-muted-foreground mb-3">No courses yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start building your course catalog by creating your first course. You can add content and structure later.
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Course
              </Button>
            </CardContent>
          </Card>
        ) : (
          courses.map((course) => (
            <Card key={course.id} className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {course.name}
                    </CardTitle>
                    {course.category && (
                      <Badge variant="outline" className="mt-2">
                        <Tag className="h-3 w-3 mr-1" />
                        {course.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {course.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                )}
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>{course.duration || 'TBD'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-green-500" />
                    <span>{course.capacity || 0} seats</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="space-y-1">
                    <Badge variant="secondary" className="text-base px-3 py-1 font-semibold">
                      ${course.base_price || 0}
                    </Badge>
                    {course.min_price !== course.max_price && (
                      <p className="text-xs text-muted-foreground">
                        Range: ${course.min_price || 0} - ${course.max_price || 0}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedCourse(course.id)}
                      className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                    >
                      <FileText className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(course)}
                      className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive hover:bg-red-50 hover:border-red-200"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
