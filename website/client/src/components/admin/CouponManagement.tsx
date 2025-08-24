import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Ticket, Calendar, Users } from 'lucide-react';
import { adminApi, type Coupon } from '@/services/adminApi';

export default function CouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxUses: '',
    isActive: true,
    expiresAt: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getCoupons();
      setCoupons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load coupons');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      maxUses: '',
      isActive: true,
      expiresAt: ''
    });
    setEditingCoupon(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minOrderAmount: coupon.minOrderAmount?.toString() || '',
      maxUses: coupon.maxUses?.toString() || '',
      isActive: coupon.isActive,
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : ''
    });
    setEditingCoupon(coupon);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        description: formData.description,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : undefined,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
        isActive: formData.isActive,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined
      };

      if (editingCoupon) {
        await adminApi.updateCoupon(editingCoupon.id, couponData);
      } else {
        await adminApi.createCoupon(couponData);
      }

      await loadCoupons();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save coupon');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this coupon?')) {
      return;
    }

    try {
      await adminApi.deleteCoupon(id);
      await loadCoupons();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete coupon');
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% off`;
    } else {
      return `$${coupon.discountValue} off`;
    }
  };

  const isExpired = (coupon: Coupon) => {
    return coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
  };

  const isMaxUsesReached = (coupon: Coupon) => {
    return coupon.maxUses && coupon.currentUses >= coupon.maxUses;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Coupon Management</h2>
          <p className="text-gray-600">Create and manage discount coupons</p>
        </div>
        <Button onClick={handleCreate} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Coupons Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {coupons.map((coupon) => (
          <Card key={coupon.id} className={`hover:shadow-lg transition-shadow ${
            !coupon.isActive || isExpired(coupon) || isMaxUsesReached(coupon) ? 'opacity-60' : ''
          }`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-mono">{coupon.code}</CardTitle>
                  <CardDescription className="mt-1">
                    {formatDiscount(coupon)}
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(coupon)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(coupon.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{coupon.description}</p>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {coupon.isActive ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                  
                  {isExpired(coupon) && (
                    <Badge variant="destructive">Expired</Badge>
                  )}
                  
                  {isMaxUsesReached(coupon) && (
                    <Badge variant="destructive">Max Uses Reached</Badge>
                  )}
                </div>
                
                {coupon.minOrderAmount && (
                  <p className="text-xs text-gray-500">
                    Min order: ${coupon.minOrderAmount}
                  </p>
                )}
                
                {coupon.maxUses && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Users className="h-3 w-3 mr-1" />
                    {coupon.currentUses}/{coupon.maxUses} uses
                  </div>
                )}
                
                {coupon.expiresAt && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                  </div>
                )}
                
                <p className="text-xs text-gray-400">
                  Created: {new Date(coupon.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {coupons.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No coupons found</p>
            <Button onClick={handleCreate} variant="outline">
              Create your first coupon
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </DialogTitle>
            <DialogDescription>
              {editingCoupon ? 'Update the coupon details.' : 'Create a new discount coupon.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={handleInputChange('code')}
                  placeholder="e.g., SAVE20"
                  className="font-mono"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  placeholder="Brief description of the coupon"
                  rows={2}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountType">Discount Type *</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, discountType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discountValue">
                    {formData.discountType === 'percentage' ? 'Percentage *' : 'Amount *'}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={handleInputChange('discountValue')}
                    placeholder={formData.discountType === 'percentage' ? '20' : '10.00'}
                    min="0"
                    max={formData.discountType === 'percentage' ? '100' : undefined}
                    step={formData.discountType === 'percentage' ? '1' : '0.01'}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minOrderAmount">Min Order Amount</Label>
                  <Input
                    id="minOrderAmount"
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={handleInputChange('minOrderAmount')}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxUses">Max Uses</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    value={formData.maxUses}
                    onChange={handleInputChange('maxUses')}
                    placeholder="Unlimited"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expiration Date</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={handleInputChange('expiresAt')}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {isSubmitting ? 'Saving...' : (editingCoupon ? 'Update' : 'Create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}