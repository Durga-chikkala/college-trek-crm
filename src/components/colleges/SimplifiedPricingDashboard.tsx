
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { useCourses, useUpdateCourse } from '@/hooks/useCourses';
import { 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Plus,
  Edit,
  Save,
  X
} from 'lucide-react';

interface SimplifiedPricingDashboardProps {
  collegeId: string;
  collegeName: string;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export const SimplifiedPricingDashboard = ({ collegeId, collegeName }: SimplifiedPricingDashboardProps) => {
  const { data: courses = [], isLoading } = useCourses(collegeId);
  const updateCourseMutation = useUpdateCourse();
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const [priceData, setPriceData] = useState<{ [key: string]: number }>({});

  // Prepare chart data
  const chartData = courses.map(course => ({
    name: course.name.substring(0, 15) + '...',
    price: course.base_price || 0,
    category: course.category || 'General'
  }));

  const categoryData = courses.reduce((acc: any[], course) => {
    const category = course.category || 'General';
    const existing = acc.find(item => item.category === category);
    if (existing) {
      existing.count += 1;
      existing.value += course.base_price || 0;
    } else {
      acc.push({ category, count: 1, value: course.base_price || 0 });
    }
    return acc;
  }, []);

  const priceRangeData = [
    { range: '$0-500', count: courses.filter(c => (c.base_price || 0) <= 500).length },
    { range: '$501-1000', count: courses.filter(c => (c.base_price || 0) > 500 && (c.base_price || 0) <= 1000).length },
    { range: '$1001-2000', count: courses.filter(c => (c.base_price || 0) > 1000 && (c.base_price || 0) <= 2000).length },
    { range: '$2000+', count: courses.filter(c => (c.base_price || 0) > 2000).length },
  ];

  const handlePriceUpdate = async (courseId: string, newPrice: number) => {
    await updateCourseMutation.mutateAsync({
      id: courseId,
      base_price: newPrice
    });
    setEditingCourse(null);
    setPriceData({});
  };

  const totalRevenue = courses.reduce((sum, course) => sum + (course.base_price || 0), 0);
  const averagePrice = courses.length > 0 ? totalRevenue / courses.length : 0;

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
          <h2 className="text-2xl font-bold text-foreground">Pricing Dashboard</h2>
          <p className="text-muted-foreground">{collegeName} - Simplified pricing management</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
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
                <TrendingUp className="h-5 w-5 text-white" />
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
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Price</p>
                <p className="text-2xl font-bold text-foreground">${averagePrice.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <PieChart className="h-5 w-5 text-white" />
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
        {/* Price Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Course Prices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                price: { label: "Price", color: "hsl(var(--primary))" }
              }}
              className="h-64"
            >
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="price" fill="hsl(var(--primary))" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Revenue by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Revenue", color: "hsl(var(--primary))" }
              }}
              className="h-64"
            >
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.category}: $${entry.value}`}
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
      </div>

      {/* Price Range Analysis */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Price Range Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: { label: "Courses", color: "hsl(var(--secondary))" }
            }}
            className="h-48"
          >
            <BarChart data={priceRangeData} layout="horizontal">
              <XAxis type="number" />
              <YAxis dataKey="range" type="category" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="hsl(var(--secondary))" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Quick Price Editor */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Quick Price Editor</CardTitle>
          <p className="text-sm text-muted-foreground">Click on a course to edit its price</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{course.name}</h4>
                  <p className="text-sm text-muted-foreground">{course.category || 'General'}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  {editingCourse === course.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Price"
                        className="w-24"
                        value={priceData[course.id] || course.base_price || ''}
                        onChange={(e) => setPriceData({
                          ...priceData,
                          [course.id]: parseFloat(e.target.value) || 0
                        })}
                      />
                      <Button
                        size="sm"
                        onClick={() => handlePriceUpdate(course.id, priceData[course.id] || course.base_price || 0)}
                        disabled={updateCourseMutation.isPending}
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingCourse(null);
                          setPriceData({});
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        ${course.base_price || 0}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingCourse(course.id);
                          setPriceData({ [course.id]: course.base_price || 0 });
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
