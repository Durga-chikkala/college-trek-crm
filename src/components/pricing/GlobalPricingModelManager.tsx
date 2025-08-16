
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
import { usePricingModels, useCreatePricingModel, useUpdatePricingModel, useDeletePricingModel } from '@/hooks/usePricingModels';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  History,
  Copy,
  Sparkles
} from 'lucide-react';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export const GlobalPricingModelManager = () => {
  const { data: pricingModels = [], isLoading } = usePricingModels();
  const createPricingModelMutation = useCreatePricingModel();
  const updatePricingModelMutation = useUpdatePricingModel();
  const deletePricingModelMutation = useDeletePricingModel();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: 0,
    tier: 'basic',
    currency: 'USD',
    discount_type: 'none',
    discount_value: 0,
    pricing_type: 'fixed',
    effective_from: new Date().toISOString().split('T')[0],
    effective_until: '',
    conditions: {},
    referral_conditions: {}
  });

  const currentModels = pricingModels.filter(pm => pm.is_current_version);
  
  // Analytics data
  const tierData = currentModels.reduce((acc: any[], model) => {
    const tier = model.tier || 'basic';
    const existing = acc.find(item => item.tier === tier);
    if (existing) {
      existing.count += 1;
      existing.value += model.base_price || 0;
    } else {
      acc.push({ tier, count: 1, value: model.base_price || 0 });
    }
    return acc;
  }, []);

  const priceRangeData = [
    { range: '$0-25K', count: currentModels.filter(m => (m.base_price || 0) <= 25000).length },
    { range: '$25K-50K', count: currentModels.filter(m => (m.base_price || 0) > 25000 && (m.base_price || 0) <= 50000).length },
    { range: '$50K-100K', count: currentModels.filter(m => (m.base_price || 0) > 50000 && (m.base_price || 0) <= 100000).length },
    { range: '$100K+', count: currentModels.filter(m => (m.base_price || 0) > 100000).length },
  ];

  const totalModels = currentModels.length;
  const totalValue = currentModels.reduce((sum, model) => sum + (model.base_price || 0), 0);
  const avgPrice = totalModels > 0 ? totalValue / totalModels : 0;

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
        base_price: 0,
        tier: 'basic',
        currency: 'USD',
        discount_type: 'none',
        discount_value: 0,
        pricing_type: 'fixed',
        effective_from: new Date().toISOString().split('T')[0],
        effective_until: '',
        conditions: {},
        referral_conditions: {}
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
      base_price: model.base_price || 0,
      tier: model.tier || 'basic',
      currency: model.currency || 'USD',
      discount_type: model.discount_type || 'none',
      discount_value: model.discount_value || 0,
      pricing_type: model.pricing_type || 'fixed',
      effective_from: model.effective_from || new Date().toISOString().split('T')[0],
      effective_until: model.effective_until || '',
      conditions: model.conditions || {},
      referral_conditions: model.referral_conditions || {}
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (modelId: string) => {
    if (confirm('Are you sure you want to delete this pricing model?')) {
      await deletePricingModelMutation.mutateAsync(modelId);
    }
  };

  const handleClone = (model: any) => {
    setFormData({
      name: `${model.name} (Copy)`,
      description: model.description || '',
      base_price: model.base_price || 0,
      tier: model.tier || 'basic',
      currency: model.currency || 'USD',
      discount_type: model.discount_type || 'none',
      discount_value: model.discount_value || 0,
      pricing_type: model.pricing_type || 'fixed',
      effective_from: new Date().toISOString().split('T')[0],
      effective_until: '',
      conditions: model.conditions || {},
      referral_conditions: model.referral_conditions || {}
    });
    setIsCreateDialogOpen(true);
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
          <h2 className="text-2xl font-bold text-foreground">Global Pricing Model Management</h2>
          <p className="text-muted-foreground">Create and manage pricing models that can be assigned to colleges</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary/80">
              <Plus className="h-4 w-4 mr-2" />
              Create Pricing Model
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingModel ? 'Edit Pricing Model' : 'Create New Pricing Model'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
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
                      <Label htmlFor="tier">Tier</Label>
                      <Select value={formData.tier} onValueChange={(value) => setFormData({ ...formData, tier: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
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
                </TabsContent>

                <TabsContent value="pricing" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="base_price">Base Price</Label>
                      <Input
                        id="base_price"
                        type="number"
                        value={formData.base_price}
                        onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="INR">INR</SelectItem>
                        </SelectContent>
                      </Select>
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
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="discount_type">Discount Type</Label>
                      <Select value={formData.discount_type} onValueChange={(value) => setFormData({ ...formData, discount_type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="referral">Referral Based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.discount_type !== 'none' && (
                      <div>
                        <Label htmlFor="discount_value">Discount Value</Label>
                        <Input
                          id="discount_value"
                          type="number"
                          value={formData.discount_value}
                          onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="effective_from">Effective From</Label>
                      <Input
                        id="effective_from"
                        type="date"
                        value={formData.effective_from}
                        onChange={(e) => setFormData({ ...formData, effective_from: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="effective_until">Effective Until (Optional)</Label>
                      <Input
                        id="effective_until"
                        type="date"
                        value={formData.effective_until}
                        onChange={(e) => setFormData({ ...formData, effective_until: e.target.value })}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 pt-4">
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
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</p>
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
                <p className="text-sm text-muted-foreground">Tiers</p>
                <p className="text-2xl font-bold text-foreground">{tierData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Pricing Tiers Distribution</CardTitle>
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
                  data={tierData}
                  dataKey="count"
                  nameKey="tier"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.tier}: ${entry.count}`}
                >
                  {tierData.map((entry, index) => (
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
            {currentModels.map((model) => (
              <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-medium text-foreground">{model.name}</h4>
                      <p className="text-sm text-muted-foreground">{model.description}</p>
                    </div>
                    <Badge variant="secondary">{model.tier}</Badge>
                    <Badge variant="outline">{model.currency}</Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Type: {model.pricing_type}</span>
                    <span className="font-medium text-foreground">Price: {model.currency} {model.base_price?.toLocaleString()}</span>
                    {model.discount_type !== 'none' && (
                      <span>Discount: {model.discount_type} ({model.discount_value})</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleClone(model)}
                    title="Clone model"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
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
