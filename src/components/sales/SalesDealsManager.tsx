
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSalesDeals, useCreateSalesDeal, useUpdateSalesDeal } from '@/hooks/useSalesDeals';
import { useColleges } from '@/hooks/useColleges';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { 
  Plus, 
  Edit, 
  DollarSign,
  TrendingUp,
  Target,
  Users,
  Calendar,
  Percent
} from 'lucide-react';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

interface SalesDealsManagerProps {
  collegeId?: string;
}

export const SalesDealsManager = ({ collegeId }: SalesDealsManagerProps) => {
  const { data: deals = [], isLoading } = useSalesDeals(collegeId);
  const { data: colleges = [] } = useColleges();
  const createDealMutation = useCreateSalesDeal();
  const updateDealMutation = useUpdateSalesDeal();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<any>(null);
  const [formData, setFormData] = useState({
    college_id: collegeId || '',
    deal_name: '',
    deal_value: 0,
    currency: 'USD',
    probability: 50,
    stage: 'qualification',
    expected_close_date: '',
    notes: ''
  });

  // Analytics data
  const stageData = deals.reduce((acc: any[], deal) => {
    const stage = deal.stage || 'qualification';
    const existing = acc.find(item => item.stage === stage);
    if (existing) {
      existing.count += 1;
      existing.value += deal.deal_value || 0;
    } else {
      acc.push({ stage, count: 1, value: deal.deal_value || 0 });
    }
    return acc;
  }, []);

  const totalDeals = deals.length;
  const totalValue = deals.reduce((sum, deal) => sum + (deal.deal_value || 0), 0);
  const avgValue = totalDeals > 0 ? totalValue / totalDeals : 0;
  const avgProbability = deals.reduce((sum, deal) => sum + (deal.probability || 0), 0) / totalDeals;
  const wonDeals = deals.filter(deal => deal.stage === 'closed_won').length;
  const lostDeals = deals.filter(deal => deal.stage === 'closed_lost').length;
  const winRate = totalDeals > 0 ? (wonDeals / (wonDeals + lostDeals)) * 100 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDeal) {
        await updateDealMutation.mutateAsync({ 
          id: editingDeal.id, 
          ...formData 
        });
        setEditingDeal(null);
      } else {
        await createDealMutation.mutateAsync(formData);
      }
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving deal:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      college_id: collegeId || '',
      deal_name: '',
      deal_value: 0,
      currency: 'USD',
      probability: 50,
      stage: 'qualification',
      expected_close_date: '',
      notes: ''
    });
  };

  const handleEdit = (deal: any) => {
    setEditingDeal(deal);
    setFormData({
      college_id: deal.college_id,
      deal_name: deal.deal_name,
      deal_value: deal.deal_value || 0,
      currency: deal.currency || 'USD',
      probability: deal.probability || 50,
      stage: deal.stage || 'qualification',
      expected_close_date: deal.expected_close_date || '',
      notes: deal.notes || ''
    });
    setIsCreateDialogOpen(true);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'qualification': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'proposal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'negotiation': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'closed_won': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'closed_lost': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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
          <h2 className="text-2xl font-bold text-foreground">Sales Deals Management</h2>
          <p className="text-muted-foreground">Track and manage sales opportunities</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary/80">
              <Plus className="h-4 w-4 mr-2" />
              Create Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingDeal ? 'Edit Deal' : 'Create New Deal'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deal_name">Deal Name</Label>
                  <Input
                    id="deal_name"
                    value={formData.deal_name}
                    onChange={(e) => setFormData({ ...formData, deal_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="college_id">College</Label>
                  <Select 
                    value={formData.college_id} 
                    onValueChange={(value) => setFormData({ ...formData, college_id: value })}
                    disabled={!!collegeId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select college" />
                    </SelectTrigger>
                    <SelectContent>
                      {colleges.map((college) => (
                        <SelectItem key={college.id} value={college.id}>
                          {college.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="deal_value">Deal Value</Label>
                  <Input
                    id="deal_value"
                    type="number"
                    value={formData.deal_value}
                    onChange={(e) => setFormData({ ...formData, deal_value: parseFloat(e.target.value) || 0 })}
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
                  <Label htmlFor="probability">Probability (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stage">Stage</Label>
                  <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qualification">Qualification</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="closed_won">Closed Won</SelectItem>
                      <SelectItem value="closed_lost">Closed Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expected_close_date">Expected Close Date</Label>
                  <Input
                    id="expected_close_date"
                    type="date"
                    value={formData.expected_close_date}
                    onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createDealMutation.isPending || updateDealMutation.isPending}>
                  {editingDeal ? 'Update Deal' : 'Create Deal'}
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
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Deals</p>
                <p className="text-2xl font-bold text-foreground">{totalDeals}</p>
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
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Value</p>
                <p className="text-2xl font-bold text-foreground">${avgValue.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Percent className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold text-foreground">{winRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Deals by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Deals", color: "hsl(var(--primary))" }
              }}
              className="h-64"
            >
              <RechartsPieChart>
                <Pie
                  data={stageData}
                  dataKey="count"
                  nameKey="stage"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.stage}: ${entry.count}`}
                >
                  {stageData.map((entry, index) => (
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
            <CardTitle>Value by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Value", color: "hsl(var(--secondary))" }
              }}
              className="h-64"
            >
              <BarChart data={stageData}>
                <XAxis dataKey="stage" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="hsl(var(--secondary))" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Deals List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>All Deals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {deals.map((deal) => (
              <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{deal.deal_name}</h4>
                      <p className="text-sm text-muted-foreground">{deal.colleges?.name}</p>
                    </div>
                    <Badge className={getStageColor(deal.stage || 'qualification')}>
                      {deal.stage}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {deal.currency} {deal.deal_value?.toLocaleString()}
                    </span>
                    <span>Probability: {deal.probability}%</span>
                    {deal.expected_close_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Expected: {new Date(deal.expected_close_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  {deal.notes && (
                    <p className="text-xs text-muted-foreground mt-1">{deal.notes}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(deal)}
                  >
                    <Edit className="h-3 w-3" />
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
