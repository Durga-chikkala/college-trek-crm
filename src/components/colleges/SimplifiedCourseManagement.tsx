
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
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
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
  BarChart3
} from 'lucide-react';

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

  // Chart data for course analytics
  const categoryData = courses.reduce((acc: any[], course) => {
    const category = course.category || 'General';
    const existing = acc.find(item => item.category === category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ category, count: 1 });
    }
    return acc;
  }, []);

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Course Management</h2>
          <p className="text-muted-foreground">{collegeName} - Manage courses and curriculum</p>
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
              <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Course Name *</Label>
                <Input
                  value={editingCourse ? editingCourse.name : newCourse.name}
                  onChange={(e) => editingCourse 
                    ? setEditingCourse({ ...editingCourse, name: e.target.value })
                    : setNewCourse({ ...newCourse, name: e.target.value })
                  }
                  placeholder="Enter course name"
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={editingCourse ? editingCourse.category : newCourse.category}
                  onValueChange={(value) => editingCourse
                    ? setEditingCourse({ ...editingCourse, category: value })
                    : setNewCourse({ ...newCourse, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={editingCourse ? editingCourse.description : newCourse.description}
                  onChange={(e) => editingCourse
                    ? setEditingCourse({ ...editingCourse, description: e.target.value })
                    : setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  placeholder="Course description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Base Price ($)</Label>
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

              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  value={editingCourse ? editingCourse.duration : newCourse.duration}
                  onChange={(e) => editingCourse
                    ? setEditingCourse({ ...editingCourse, duration: e.target.value })
                    : setNewCourse({ ...newCourse, duration: e.target.value })
                  }
                  placeholder="e.g., 8 weeks, 3 months"
                />
              </div>

              <div className="space-y-2">
                <Label>Capacity</Label>
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

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button 
                onClick={editingCourse ? handleUpdateCourse : handleCreateCourse}
                disabled={editingCourse ? updateCourseMutation.isPending : createCourseMutation.isPending}
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

      {/* Course Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Tag className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold text-foreground">{categoryData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
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

      {/* Category Distribution Chart */}
      {categoryData.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Courses by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Courses", color: "hsl(var(--primary))" }
              }}
              className="h-64"
            >
              <BarChart data={categoryData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Courses Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3 border-dashed">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No courses yet</h3>
              <p className="text-muted-foreground">Start by creating your first course</p>
            </CardContent>
          </Card>
        ) : (
          courses.map((course) => (
            <Card key={course.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-foreground truncate">
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
              <CardContent className="pt-0 space-y-3">
                {course.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                )}
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{course.duration || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{course.capacity || 0} seats</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    ${course.base_price || 0}
                  </Badge>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedCourse(course.id)}
                    >
                      <FileText className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(course)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive"
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
