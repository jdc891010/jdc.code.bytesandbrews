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
import { Plus, Edit, Trash2, Star, Calendar, MapPin, Crown } from 'lucide-react';
import { adminApi, type FeaturedSpot, type CoffeeShop } from '@/services/adminApi';

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

export default function FeaturedSpotManagement() {
  const [featuredSpots, setFeaturedSpots] = useState<FeaturedSpot[]>([]);
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
  const [currentFeaturedSpot, setCurrentFeaturedSpot] = useState<FeaturedSpot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFeaturedSpot, setEditingFeaturedSpot] = useState<FeaturedSpot | null>(null);
  const [formData, setFormData] = useState({
    coffeeShopId: '',
    month: '',
    year: new Date().getFullYear().toString(),
    description: '',
    isActive: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [featuredSpotsData, coffeeShopsData, currentSpot] = await Promise.all([
        adminApi.getFeaturedSpots(),
        adminApi.getCoffeeShops(),
        adminApi.getCurrentFeaturedSpot()
      ]);
      setFeaturedSpots(featuredSpotsData);
      setCoffeeShops(coffeeShopsData);
      setCurrentFeaturedSpot(currentSpot);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      coffeeShopId: '',
      month: '',
      year: new Date().getFullYear().toString(),
      description: '',
      isActive: true
    });
    setEditingFeaturedSpot(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (featuredSpot: FeaturedSpot) => {
    setFormData({
      coffeeShopId: featuredSpot.coffeeShopId.toString(),
      month: featuredSpot.month.toString(),
      year: featuredSpot.year.toString(),
      description: featuredSpot.description || '',
      isActive: featuredSpot.isActive
    });
    setEditingFeaturedSpot(featuredSpot);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const featuredSpotData = {
        coffeeShopId: parseInt(formData.coffeeShopId),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        description: formData.description || undefined,
        isActive: formData.isActive
      };

      if (editingFeaturedSpot) {
        await adminApi.updateFeaturedSpot(editingFeaturedSpot.id, featuredSpotData);
      } else {
        await adminApi.createFeaturedSpot(featuredSpotData);
      }

      await loadData();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save featured spot');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this featured spot?')) {
      return;
    }

    try {
      await adminApi.deleteFeaturedSpot(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete featured spot');
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const getCoffeeShopName = (coffeeShopId: number) => {
    const shop = coffeeShops.find(shop => shop.id === coffeeShopId);
    return shop?.name || 'Unknown Coffee Shop';
  };

  const getMonthName = (month: number) => {
    const monthObj = MONTHS.find(m => m.value === month);
    return monthObj?.label || 'Unknown Month';
  };

  const isCurrent = (featuredSpot: FeaturedSpot) => {
    const now = new Date();
    return featuredSpot.month === now.getMonth() + 1 && featuredSpot.year === now.getFullYear();
  };

  const isPast = (featuredSpot: FeaturedSpot) => {
    const now = new Date();
    const spotDate = new Date(featuredSpot.year, featuredSpot.month - 1);
    const currentDate = new Date(now.getFullYear(), now.getMonth());
    return spotDate < currentDate;
  };

  const isFuture = (featuredSpot: FeaturedSpot) => {
    const now = new Date();
    const spotDate = new Date(featuredSpot.year, featuredSpot.month - 1);
    const currentDate = new Date(now.getFullYear(), now.getMonth());
    return spotDate > currentDate;
  };

  // Generate year options (current year - 1 to current year + 2)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 4 }, (_, i) => currentYear - 1 + i);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading featured spots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Featured Spot Management</h2>
          <p className="text-gray-600">Manage monthly featured coffee shops</p>
        </div>
        <Button onClick={handleCreate} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Featured Spot
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Current Featured Spot */}
      {currentFeaturedSpot && (
        <Card className="border-2 border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-amber-800">Current Featured Spot</CardTitle>
              </div>
              <Badge className="bg-amber-600 text-white">
                {getMonthName(currentFeaturedSpot.month)} {currentFeaturedSpot.year}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{getCoffeeShopName(currentFeaturedSpot.coffeeShopId)}</h3>
                {currentFeaturedSpot.description && (
                  <p className="text-gray-600 mt-1">{currentFeaturedSpot.description}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(currentFeaturedSpot)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Featured Spots Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredSpots.map((featuredSpot) => (
          <Card key={featuredSpot.id} className={`hover:shadow-lg transition-shadow ${
            !featuredSpot.isActive ? 'opacity-60' : ''
          } ${
            isCurrent(featuredSpot) ? 'ring-2 ring-amber-200' : ''
          }`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center">
                    {isCurrent(featuredSpot) && <Crown className="h-4 w-4 mr-2 text-amber-600" />}
                    {getCoffeeShopName(featuredSpot.coffeeShopId)}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {getMonthName(featuredSpot.month)} {featuredSpot.year}
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(featuredSpot)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(featuredSpot.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {featuredSpot.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{featuredSpot.description}</p>
              )}
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {featuredSpot.isActive ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                  
                  {isCurrent(featuredSpot) && (
                    <Badge className="bg-amber-100 text-amber-800">
                      <Star className="h-3 w-3 mr-1" />
                      Current
                    </Badge>
                  )}
                  
                  {isFuture(featuredSpot) && (
                    <Badge variant="outline" className="border-blue-200 text-blue-800">
                      Upcoming
                    </Badge>
                  )}
                  
                  {isPast(featuredSpot) && (
                    <Badge variant="outline" className="border-gray-300 text-gray-600">
                      Past
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingFeaturedSpot ? 'Edit Featured Spot' : 'Create New Featured Spot'}
            </DialogTitle>
            <DialogDescription>
              {editingFeaturedSpot ? 'Update the featured spot details below.' : 'Select a coffee shop and month to feature.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="coffeeShopId">Coffee Shop *</Label>
              <Select value={formData.coffeeShopId} onValueChange={(value) => setFormData(prev => ({ ...prev, coffeeShopId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a coffee shop" />
                </SelectTrigger>
                <SelectContent>
                  {coffeeShops.map((shop) => (
                    <SelectItem key={shop.id} value={shop.id.toString()}>
                      {shop.name} - {shop.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="month">Month *</Label>
                <Select value={formData.month} onValueChange={(value) => setFormData(prev => ({ ...prev, month: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="year">Year *</Label>
                <Select value={formData.year} onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange('description')}
                placeholder="Optional description for why this spot is featured..."
                rows={3}
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
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {isSubmitting ? 'Saving...' : (editingFeaturedSpot ? 'Update Featured Spot' : 'Create Featured Spot')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}