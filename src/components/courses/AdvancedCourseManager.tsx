
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/useCourses';
import { useCoursePrerequisites, useAddCoursePrerequisite, useRemoveCoursePrerequisite } from '@/hooks/useCoursePrerequisites';
import { useCourseTopics, useCreateCourseTopic, useUpdateCourseTopic, useDeleteCourseTopic } from '@/hooks/useCourseTopics';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen,
  Clock,
  Users,
  BarChart3,
  PlayCircle,
  FileText,
  Image,
  Video,
  Link2,
  X
} from 'lucide-react';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export const AdvancedCourseManager = () => {
  const { data: courses = [], isLoading } = useCourses();
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Other',
    duration: '1 year',
    capacity: 50,
    base_price: 0,
    difficulty_level: 'beginner',
    estimated_hours: 0,
    prerequisites: [] as string[],
    learning_outcomes: [] as string[],
    thumbnail_url: '',
    curriculum_file_path: ''
  });

  // Analytics data
  const categoryData = courses.reduce((acc: any[], course) => {
    const category = course.category || 'Other';
    const existing = acc.find(item => item.category === category);
    if (existing) {
      existing.count += 1;
      existing.value += course.base_price || 0;
    } else {
      acc.push({ category, count: 1, value: course.base_price || 0 });
    }
    return acc;
  }, []);

  const difficultyData = courses.reduce((acc: any[], course) => {
    const difficulty = course.difficulty_level || 'beginner';
    const existing = acc.find(item => item.difficulty === difficulty);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ difficulty, count: 1 });
    }
    return acc;
  }, []);

  const totalCourses = courses.length;
  const totalValue = courses.reduce((sum, course) => sum + (course.base_price || 0), 0);
  const avgPrice = totalCourses > 0 ? totalValue / totalCourses : 0;
  const avgHours = courses.reduce((sum, course) => sum + (course.estimated_hours || 0), 0) / totalCourses;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await updateCourseMutation.mutateAsync({ 
          id: editingCourse.id, 
          ...formData 
        });
        setEditingCourse(null);
      } else {
        await createCourseMutation.mutateAsync(formData);
      }
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Other',
      duration: '1 year',
      capacity: 50,
      base_price: 0,
      difficulty_level: 'beginner',
      estimated_hours: 0,
      prerequisites: [],
      learning_outcomes: [],
      thumbnail_url: '',
      curriculum_file_path: ''
    });
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      description: course.description || '',
      category: course.category,
      duration: course.duration,
      capacity: course.capacity,
      base_price: course.base_price || 0,
      difficulty_level: course.difficulty_level || 'beginner',
      estimated_hours: course.estimated_hours || 0,
      prerequisites: course.prerequisites || [],
      learning_outcomes: course.learning_outcomes || [],
      thumbnail_url: course.thumbnail_url || '',
      curriculum_file_path: course.curriculum_file_path || ''
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      await deleteCourseMutation.mutateAsync(courseId);
    }
  };

  const addPrerequisite = () => {
    setFormData({
      ...formData,
      prerequisites: [...formData.prerequisites, '']
    });
  };

  const updatePrerequisite = (index: number, value: string) => {
    const updated = [...formData.prerequisites];
    updated[index] = value;
    setFormData({ ...formData, prerequisites: updated });
  };

  const removePrerequisite = (index: number) => {
    const updated = formData.prerequisites.filter((_, i) => i !== index);
    setFormData({ ...formData, prerequisites: updated });
  };

  const addLearningOutcome = () => {
    setFormData({
      ...formData,
      learning_outcomes: [...formData.learning_outcomes, '']
    });
  };

  const updateLearningOutcome = (index: number, value: string) => {
    const updated = [...formData.learning_outcomes];
    updated[index] = value;
    setFormData({ ...formData, learning_outcomes: updated });
  };

  const removeLearningOutcome = (index: number) => {
    const updated = formData.learning_outcomes.filter((_, i) => i !== index);
    setFormData({ ...formData, learning_outcomes: updated });
  };

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
          <h2 className="text-2xl font-bold text-foreground">Advanced Course Management</h2>
          <p className="text-muted-foreground">Create and manage detailed course structures with prerequisites and outcomes</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary/80">
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
                  <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Course Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Arts">Arts</SelectItem>
                          <SelectItem value="Science">Science</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                      <Input
                        id="thumbnail_url"
                        value={formData.thumbnail_url}
                        onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="curriculum_file_path">Curriculum File Path</Label>
                      <Input
                        id="curriculum_file_path"
                        value={formData.curriculum_file_path}
                        onChange={(e) => setFormData({ ...formData, curriculum_file_path: e.target.value })}
                        placeholder="/path/to/curriculum.md"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="base_price">Base Price ($)</Label>
                      <Input
                        id="base_price"
                        type="number"
                        value={formData.base_price}
                        onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimated_hours">Estimated Hours</Label>
                      <Input
                        id="estimated_hours"
                        type="number"
                        value={formData.estimated_hours}
                        onChange={(e) => setFormData({ ...formData, estimated_hours: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="difficulty_level">Difficulty Level</Label>
                    <Select value={formData.difficulty_level} onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="prerequisites" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Prerequisites</Label>
                    <Button type="button" onClick={addPrerequisite} size="sm">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Prerequisite
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.prerequisites.map((prerequisite, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={prerequisite}
                          onChange={(e) => updatePrerequisite(index, e.target.value)}
                          placeholder="Enter prerequisite"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removePrerequisite(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="outcomes" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Learning Outcomes</Label>
                    <Button type="button" onClick={addLearningOutcome} size="sm">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Outcome
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.learning_outcomes.map((outcome, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={outcome}
                          onChange={(e) => updateLearningOutcome(index, e.target.value)}
                          placeholder="Enter learning outcome"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeLearningOutcome(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createCourseMutation.isPending || updateCourseMutation.isPending}>
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold text-foreground">{totalCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Hours</p>
                <p className="text-2xl font-bold text-foreground">{avgHours.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Price</p>
                <p className="text-2xl font-bold text-foreground">${avgPrice.toFixed(0)}</p>
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
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold text-foreground">{categoryData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Course Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Courses", color: "hsl(var(--primary))" }
              }}
              className="h-64"
            >
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.category}: ${entry.count}`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </RechartsPieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Difficulty Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Courses", color: "hsl(var(--secondary))" }
              }}
              className="h-64"
            >
              <BarChart data={difficultyData}>
                <XAxis dataKey="difficulty" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--secondary))" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{course.name}</h4>
                      <p className="text-sm text-muted-foreground">{course.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{course.category}</Badge>
                      <Badge variant="outline">{course.difficulty_level}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Duration: {course.duration}</span>
                    <span>Capacity: {course.capacity}</span>
                    <span>Hours: {course.estimated_hours || 0}</span>
                    <span className="font-medium text-foreground">Price: ${course.base_price}</span>
                  </div>
                  {course.prerequisites && course.prerequisites.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">Prerequisites: </span>
                      <span className="text-xs">{course.prerequisites.join(', ')}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(course)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(course.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
