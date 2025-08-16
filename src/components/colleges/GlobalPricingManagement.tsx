
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePricingModels, useCreatePricingModel, useUpdatePricingModel, useDeletePricingModel } from '@/hooks/usePricingModels';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart
} from 'lucide-react';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export const GlobalPricingManagement = () => {
  const { data: pricingModels = [], isLoading } = usePricingModels();
  const createPricingModelMutation = useCreatePricingModel();
  const updatePricingModelMutation = useUpdatePricingModel();
  const deletePricingModelMutation = useDeletePricingModel();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricing_type: 'fixed',
    base_price: 0,
    min_price: 0,
    max_price: 0,
    discount_percentage: 0,
    markup_percentage: 0
  });

  // Analytics data
  const typeData = pricingModels.reduce((acc: any[], model) => {
    const type = model.pricing_type || 'fixed';
    const existing = acc.find(item => item.type === type);
    if (existing) {
      existing.count += 1;
      existing.value += model.base_price || 0;
    } else {
      acc.push({ type, count: 1, value: model.base_price || 0 });
    }
    return acc;
  }, []);

  const priceRangeData = [
    { range: '$0-500', count: pricingModels.filter(m => (m.base_price || 0) <= 500).length },
    { range: '$501-1000', count: pricingModels.filter(m => (m.base_price || 0) > 500 && (m.base_price || 0) <= 1000).length },
    { range: '$1001-2000', count: pricingModels.filter(m => (m.base_price || 0) > 1000 && (m.base_price || 0) <= 2000).length },
    { range: '$2000+', count: pricingModels.filter(m => (m.base_price || 0) > 2000).length },
  ];

  const totalModels = pricingModels.length;
  const totalValue = pricingModels.reduce((sum, model) => sum + (model.base_price || 0), 0);
  const avgPrice = totalModels > 0 ? totalValue / totalModels : 0;
  const activeModels = pricingModels.filter(m => m.is_active).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingModel) {
        await updatePricingModelMutation.mutateAsync({ 
          id: editingModel.id, 
          ...formData 
        });
        setEditingModel(null);
      } else {
        await createPricingModelMutation.mutateAsync(formData);
      }
      setIsCreateDialogOpen(false);
      setFormData({
        name: '',
        description: '',
        pricing_type: 'fixed',
        base_price: 0,
        min_price: 0,
        max_price: 0,
        discount_percentage: 0,
        markup_percentage: 0
      });
    } catch (error) {
      console.error('Error saving pricing model:', error);
    }
  };

  const handleEdit = (model: any) => {
    setEditingModel(model);
    setFormData({
      name: model.name,
      description: model.description || '',
      pricing_type: model.pricing_type,
      base_price: model.base_price || 0,
      min_price: model.min_price || 0,
      max_price: model.max_price || 0,
      discount_percentage: model.discount_percentage || 0,
      markup_percentage: model.markup_percentage || 0
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (modelId: string) => {
    if (confirm('Are you sure you want to delete this pricing model?')) {
      await deletePricingModelMutation.mutateAsync(modelId);
    }
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
          <h2 className="text-2xl font-bold text-foreground">Global Pricing Management</h2>
          <p className="text-muted-foreground">Create and manage pricing models that can be assigned to colleges</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary/80">
              <Plus className="h-4 w-4 mr-2" />
              Create Pricing Model
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingModel ? 'Edit Pricing Model' : 'Create New Pricing Model'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Model Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pricing_type">Pricing Type</Label>
                  <Select value={formData.pricing_type} onValueChange={(value) => setFormData({ ...formData, pricing_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="dynamic">Dynamic</SelectItem>
                      <SelectItem value="tiered">Tiered</SelectItem>
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
              <div className="grid grid-cols-3 gap-4">
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
                  <Label htmlFor="min_price">Min Price ($)</Label>
                  <Input
                    id="min_price"
                    type="number"
                    value={formData.min_price}
                    onChange={(e) => setFormData({ ...formData, min_price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="max_price">Max Price ($)</Label>
                  <Input
                    id="max_price"
                    type="number"
                    value={formData.max_price}
                    onChange={(e) => setFormData({ ...formData, max_price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount_percentage">Discount (%)</Label>
                  <Input
                    id="discount_percentage"
                    type="number"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="markup_percentage">Markup (%)</Label>
                  <Input
                    id="markup_percentage"
                    type="number"
                    value={formData.markup_percentage}
                    onChange={(e) => setFormData({ ...formData, markup_percentage: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createPricingModelMutation.isPending || updatePricingModelMutation.isPending}>
                  {editingModel ? 'Update Model' : 'Create Model'}
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
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Models</p>
                <p className="text-2xl font-bold text-foreground">{totalModels}</p>
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
                <p className="text-sm text-muted-foreground">Active Models</p>
                <p className="text-2xl font-bold text-foreground">{activeModels}</p>
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
                <PieChart className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Types</p>
                <p className="text-2xl font-bold text-foreground">{typeData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Pricing Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Models", color: "hsl(var(--primary))" }
              }}
              className="h-64"
            >
              <RechartsPieChart>
                <Pie
                  data={typeData}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.type}: ${entry.count}`}
                >
                  {typeData.map((entry, index) => (
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
            <CardTitle>Price Range Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Models", color: "hsl(var(--secondary))" }
              }}
              className="h-64"
            >
              <BarChart data={priceRangeData}>
                <XAxis dataKey="range" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--secondary))" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Models List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>All Pricing Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {pricingModels.map((model) => (
              <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-medium text-foreground">{model.name}</h4>
                      <p className="text-sm text-muted-foreground">{model.description}</p>
                    </div>
                    <Badge variant="secondary">{model.pricing_type}</Badge>
                    {model.is_active && <Badge className="bg-green-100 text-green-700">Active</Badge>}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Base: ${model.base_price}</span>
                    {model.min_price && <span>Min: ${model.min_price}</span>}
                    {model.max_price && <span>Max: ${model.max_price}</span>}
                    {model.discount_percentage > 0 && <span>Discount: {model.discount_percentage}%</span>}
                    {model.markup_percentage > 0 && <span>Markup: {model.markup_percentage}%</span>}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(model)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(model.id)}
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
