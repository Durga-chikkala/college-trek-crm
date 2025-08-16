
import React, { useState } from 'react';
import { useSalesDeals, useCreateSalesDeal, useUpdateSalesDeal, useDeleteSalesDeal } from '@/hooks/useSalesDeals';
import { useColleges } from '@/hooks/useColleges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Calendar, Building2, Plus, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const SalesDealsManager = () => {
  const { data: deals, isLoading } = useSalesDeals();
  const { data: colleges } = useColleges();
  const createDeal = useCreateSalesDeal();
  const updateDeal = useUpdateSalesDeal();
  const deleteDeal = useDeleteSalesDeal();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<any>(null);
  const [formData, setFormData] = useState({
    college_id: '',
    deal_name: '',
    deal_value: 0,
    currency: 'USD',
    probability: 50,
    stage: 'qualification',
    expected_close_date: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingDeal) {
        await updateDeal.mutateAsync({ id: editingDeal.id, ...formData });
      } else {
        await createDeal.mutateAsync(formData);
      }
      
      setIsDialogOpen(false);
      setEditingDeal(null);
      setFormData({
        college_id: '',
        deal_name: '',
        deal_value: 0,
        currency: 'USD',
        probability: 50,
        stage: 'qualification',
        expected_close_date: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error saving deal:', error);
    }
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
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      await deleteDeal.mutateAsync(id);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'qualification': return 'bg-yellow-100 text-yellow-800';
      case 'proposal': return 'bg-blue-100 text-blue-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed_won': return 'bg-green-100 text-green-800';
      case 'closed_lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading sales deals...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Deals</h1>
            <p className="text-gray-600">Track and manage your sales pipeline</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              New Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingDeal ? 'Edit Deal' : 'Create New Deal'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="college_id">College</Label>
                <Select value={formData.college_id} onValueChange={(value) => setFormData({...formData, college_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select college" />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges?.map((college) => (
                      <SelectItem key={college.id} value={college.id}>
                        {college.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="deal_name">Deal Name</Label>
                <Input
                  id="deal_name"
                  value={formData.deal_name}
                  onChange={(e) => setFormData({...formData, deal_name: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deal_value">Deal Value</Label>
                  <Input
                    id="deal_value"
                    type="number"
                    value={formData.deal_value}
                    onChange={(e) => setFormData({...formData, deal_value: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="probability">Probability (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => setFormData({...formData, probability: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="stage">Stage</Label>
                  <Select value={formData.stage} onValueChange={(value) => setFormData({...formData, stage: value})}>
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
              </div>

              <div>
                <Label htmlFor="expected_close_date">Expected Close Date</Label>
                <Input
                  id="expected_close_date"
                  type="date"
                  value={formData.expected_close_date}
                  onChange={(e) => setFormData({...formData, expected_close_date: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createDeal.isPending || updateDeal.isPending}>
                  {editingDeal ? 'Update Deal' : 'Create Deal'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {deals?.map((deal) => (
          <Card key={deal.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{deal.deal_name}</h3>
                    <Badge className={getStageColor(deal.stage)}>
                      {deal.stage.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {deal.colleges?.name}
                    </div>
                    {deal.deal_value && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {deal.deal_value.toLocaleString()} {deal.currency}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDistanceToNow(new Date(deal.created_at), { addSuffix: true })}
                    </div>
                  </div>

                  {deal.notes && (
                    <p className="text-gray-700 text-sm">{deal.notes}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(deal)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(deal.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!deals || deals.length === 0) && (
          <Card>
            <CardContent className="p-12 text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deals yet</h3>
              <p className="text-gray-600">Create your first sales deal to get started</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
