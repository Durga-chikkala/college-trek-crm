
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar,
  Users,
  Settings,
  Plus,
  Edit,
  Trash2,
  Copy,
  Download,
  Upload,
  Filter,
  Search,
  BarChart3,
  PieChart,
  LineChart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Percent,
  Calculator
} from 'lucide-react';
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/useCourses';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie, AreaChart, Area } from 'recharts';

interface AdvancedPricingManagementProps {
  collegeId: string;
  collegeName: string;
}

interface PricingRule {
  id: string;
  name: string;
  type: 'discount' | 'markup' | 'dynamic';
  value: number;
  conditions: string;
  isActive: boolean;
  validFrom: string;
  validTo: string;
}

export const AdvancedPricingManagement = ({ collegeId, collegeName }: AdvancedPricingManagementProps) => {
  const { data: courses = [], isLoading } = useCourses(collegeId);
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();

  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [bulkOperation, setBulkOperation] = useState<'discount' | 'markup' | 'price-set'>('discount');
  const [bulkValue, setBulkValue] = useState(10);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'capacity'>('name');
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return Number(b.base_price) - Number(a.base_price);
      case 'capacity':
        return b.capacity - a.capacity;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const categories = [...new Set(courses.map(c => c.category))];

  const handleBulkOperation = async () => {
    if (selectedCourses.length === 0) return;

    const operations = selectedCourses.map(courseId => {
      const course = courses.find(c => c.id === courseId);
      if (!course) return null;

      let newPrice = Number(course.base_price);
      
      switch (bulkOperation) {
        case 'discount':
          newPrice = newPrice * (1 - bulkValue / 100);
          break;
        case 'markup':
          newPrice = newPrice * (1 + bulkValue / 100);
          break;
        case 'price-set':
          newPrice = bulkValue;
          break;
      }

      return updateCourseMutation.mutateAsync({
        id: courseId,
        base_price: Math.round(newPrice),
        min_price: Math.round(newPrice * 0.8),
        max_price: Math.round(newPrice * 1.2)
      });
    }).filter(Boolean);

    await Promise.all(operations);
    setSelectedCourses([]);
  };

  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const selectAllCourses = () => {
    setSelectedCourses(filteredCourses.map(c => c.id));
  };

  const clearSelection = () => {
    setSelectedCourses([]);
  };

  // Analytics calculations
  const avgPrice = courses.reduce((sum, course) => sum + Number(course.base_price), 0) / courses.length || 0;
  const totalCapacity = courses.reduce((sum, course) => sum + course.capacity, 0);
  const totalRevenue = courses.reduce((sum, course) => sum + (Number(course.base_price) * course.capacity), 0);
  const priceRange = {
    min: Math.min(...courses.map(c => Number(c.base_price))),
    max: Math.max(...courses.map(c => Number(c.base_price)))
  };

  // Chart data
  const priceDistributionData = courses.map(course => ({
    name: course.name.substring(0, 15),
    price: Number(course.base_price),
    capacity: course.capacity,
    revenue: Number(course.base_price) * course.capacity
  }));

  const categoryAnalysis = categories.map(category => {
    const categoryCourses = courses.filter(c => c.category === category);
    return {
      name: category,
      count: categoryCourses.length,
      avgPrice: categoryCourses.reduce((sum, c) => sum + Number(c.base_price), 0) / categoryCourses.length,
      totalRevenue: categoryCourses.reduce((sum, c) => sum + (Number(c.base_price) * c.capacity), 0)
    };
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Advanced Pricing Management
            </h1>
            <p className="text-muted-foreground mt-1">{collegeName} - Comprehensive pricing control</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Import Prices
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Average Price</p>
                  <p className="text-2xl font-bold text-blue-900">{formatPrice(avgPrice)}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Range: {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                  </p>
                </div>
                <div className="p-3 bg-blue-500 rounded-full">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total Revenue Potential</p>
                  <p className="text-2xl font-bold text-green-900">{formatPrice(totalRevenue)}</p>
                  <p className="text-xs text-green-600 mt-1">From {courses.length} courses</p>
                </div>
                <div className="p-3 bg-green-500 rounded-full">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Total Capacity</p>
                  <p className="text-2xl font-bold text-purple-900">{totalCapacity.toLocaleString()}</p>
                  <p className="text-xs text-purple-600 mt-1">Students</p>
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
                  <p className="text-sm font-medium text-orange-700">Course Categories</p>
                  <p className="text-2xl font-bold text-orange-900">{categories.length}</p>
                  <p className="text-xs text-orange-600 mt-1">Active categories</p>
                </div>
                <div className="p-3 bg-orange-500 rounded-full">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">Course Management</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="rules">Pricing Rules</TabsTrigger>
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
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-full lg:w-[200px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="capacity">Capacity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Course List */}
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedCourses.includes(course.id)}
                          onChange={() => toggleCourseSelection(course.id)}
                          className="h-4 w-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-semibold">{course.name}</h4>
                            <Badge variant="outline">{course.category}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Base Price: </span>
                              <span className="font-medium">{formatPrice(Number(course.base_price))}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Min Price: </span>
                              <span className="font-medium text-red-600">{formatPrice(Number(course.min_price || 0))}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Max Price: </span>
                              <span className="font-medium text-green-600">{formatPrice(Number(course.max_price || 0))}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Capacity: </span>
                              <span className="font-medium">{course.capacity} students</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Bulk Operations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{selectedCourses.length} courses selected</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedCourses.length > 0 ? 'Ready for bulk operations' : 'Select courses to perform bulk operations'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={selectAllCourses}>
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearSelection}>
                      Clear
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <Label>Operation Type</Label>
                    <Select value={bulkOperation} onValueChange={(value: any) => setBulkOperation(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="discount">Apply Discount</SelectItem>
                        <SelectItem value="markup">Apply Markup</SelectItem>
                        <SelectItem value="price-set">Set Fixed Price</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>
                      {bulkOperation === 'price-set' ? 'New Price (₹)' : 'Percentage (%)'}
                    </Label>
                    <div className="space-y-2">
                      <Input
                        type="number"
                        value={bulkValue}
                        onChange={(e) => setBulkValue(Number(e.target.value))}
                        min={0}
                        max={bulkOperation === 'price-set' ? undefined : 100}
                      />
                      {bulkOperation !== 'price-set' && (
                        <Slider
                          value={[bulkValue]}
                          onValueChange={(value) => setBulkValue(value[0])}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Preview</Label>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {selectedCourses.length > 0 ? (
                          <>
                            Operation: <span className="font-medium">{bulkOperation}</span><br />
                            Value: <span className="font-medium">
                              {bulkOperation === 'price-set' ? formatPrice(bulkValue) : `${bulkValue}%`}
                            </span><br />
                            Courses: <span className="font-medium">{selectedCourses.length}</span>
                          </>
                        ) : (
                          'Select courses to see preview'
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleBulkOperation}
                  disabled={selectedCourses.length === 0}
                  className="w-full"
                  size="lg"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Apply Bulk Operation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Price Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={priceDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatPrice(Number(value))} />
                      <Bar dataKey="price" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Revenue by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryAnalysis}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${formatPrice(value)}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="totalRevenue"
                      >
                        {categoryAnalysis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatPrice(Number(value))} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Price vs Capacity Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={priceDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="price" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area yAxisId="right" type="monotone" dataKey="capacity" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Pricing Rules
                  </CardTitle>
                  <Button onClick={() => setIsRuleDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pricingRules.length === 0 ? (
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">No pricing rules configured</p>
                      <p className="text-sm text-muted-foreground">Create rules to automate pricing decisions</p>
                    </div>
                  ) : (
                    pricingRules.map((rule) => (
                      <Card key={rule.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{rule.name}</h4>
                              <p className="text-sm text-muted-foreground">{rule.conditions}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={rule.isActive ? "default" : "secondary"}>
                                {rule.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
