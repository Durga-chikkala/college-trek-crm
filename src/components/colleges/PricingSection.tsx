
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Trash2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Course {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  minPrice: number;
  maxPrice: number;
  duration: string;
  capacity: number;
  description: string;
}

interface PricingSectionProps {
  collegeId: string;
}

export const PricingSection = ({ collegeId }: PricingSectionProps) => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      name: 'B.Tech Computer Science',
      category: 'Engineering',
      basePrice: 120000,
      minPrice: 100000,
      maxPrice: 150000,
      duration: '4 years',
      capacity: 120,
      description: 'Computer Science and Engineering program'
    },
    {
      id: '2',
      name: 'MBA',
      category: 'Management',
      basePrice: 200000,
      minPrice: 180000,
      maxPrice: 250000,
      duration: '2 years',
      capacity: 60,
      description: 'Master of Business Administration'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    name: '',
    category: '',
    basePrice: 0,
    minPrice: 0,
    maxPrice: 0,
    duration: '',
    capacity: 0,
    description: ''
  });

  const handleAddCourse = () => {
    if (newCourse.name && newCourse.basePrice) {
      const course: Course = {
        id: Date.now().toString(),
        name: newCourse.name,
        category: newCourse.category || 'Other',
        basePrice: newCourse.basePrice,
        minPrice: newCourse.minPrice || newCourse.basePrice * 0.8,
        maxPrice: newCourse.maxPrice || newCourse.basePrice * 1.2,
        duration: newCourse.duration || '1 year',
        capacity: newCourse.capacity || 50,
        description: newCourse.description || ''
      };
      setCourses([...courses, course]);
      setNewCourse({});
      setIsDialogOpen(false);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Course Pricing</h3>
          <p className="text-muted-foreground">Manage course pricing and capacity</p>
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
                  value={newCourse.name || ''}
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
                  value={newCourse.basePrice || ''}
                  onChange={(e) => setNewCourse({...newCourse, basePrice: Number(e.target.value)})}
                  placeholder="100000"
                />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  value={newCourse.duration || ''}
                  onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                  placeholder="4 years"
                />
              </div>
              <div className="space-y-2">
                <Label>Minimum Price (₹)</Label>
                <Input
                  type="number"
                  value={newCourse.minPrice || ''}
                  onChange={(e) => setNewCourse({...newCourse, minPrice: Number(e.target.value)})}
                  placeholder="80000"
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum Price (₹)</Label>
                <Input
                  type="number"
                  value={newCourse.maxPrice || ''}
                  onChange={(e) => setNewCourse({...newCourse, maxPrice: Number(e.target.value)})}
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
                  value={newCourse.description || ''}
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
              <Button onClick={handleAddCourse}>
                Add Course
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pricing Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Average Course Price</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatPrice(courses.reduce((sum, course) => sum + course.basePrice, 0) / courses.length || 0)}
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
      </div>

      {/* Course List */}
      <div className="grid gap-4">
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
                      <span className="font-medium">{formatPrice(course.basePrice)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-muted-foreground">Min: </span>
                      <span className="font-medium">{formatPrice(course.minPrice)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-muted-foreground">Max: </span>
                      <span className="font-medium">{formatPrice(course.maxPrice)}</span>
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
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
