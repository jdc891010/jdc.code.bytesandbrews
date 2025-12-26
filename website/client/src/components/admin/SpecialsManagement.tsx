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
import { Plus, Edit, Trash2, Star, Calendar, MapPin, Image as ImageIcon } from 'lucide-react';
import { adminApi, type Special, type CoffeeShop } from '@/services/adminApi';

export default function SpecialsManagement() {
  const [specials, setSpecials] = useState<Special[]>([]);
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSpecial, setEditingSpecial] = useState<Special | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coffeeShopId: '',
    discountPercentage: '',
    originalPrice: '',
    specialPrice: '',
    startDate: '',
    endDate: '',
    isActive: true,
    showOnHomepage: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [specialsData, coffeeShopsData] = await Promise.all([
        adminApi.getSpecials(),
        adminApi.getCoffeeShops()
      ]);
      setSpecials(specialsData);
      setCoffeeShops(coffeeShopsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      coffeeShopId: '',
      discountPercentage: '',
      originalPrice: '',
      specialPrice: '',
      startDate: '',
      endDate: '',
      isActive: true,
      showOnHomepage: false
    });
    setEditingSpecial(null);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (special: Special) => {
    setFormData({
      title: special.title,
      description: special.description,
      coffeeShopId: special.coffeeShopId.toString(),
      discountPercentage: special.discountPercentage?.toString() || '',
      originalPrice: special.originalPrice?.toString() || '',
      specialPrice: special.specialPrice?.toString() || '',
      startDate: new Date(special.startDate).toISOString().split('T')[0],
      endDate: new Date(special.endDate).toISOString().split('T')[0],
      isActive: special.isActive,
      showOnHomepage: special.showOnHomepage
    });
    setEditingSpecial(special);
    setImagePreview(special.imageUrl || null);
    setIsDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const specialData = {
        title: formData.title,
        description: formData.description,
        coffeeShopId: parseInt(formData.coffeeShopId),
        discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : undefined,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        specialPrice: formData.specialPrice ? parseFloat(formData.specialPrice) : undefined,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        isActive: formData.isActive,
        showOnHomepage: formData.showOnHomepage
      };

      if (editingSpecial) {
        await adminApi.updateSpecialWithImage(editingSpecial.id, specialData, selectedImage || undefined);
      } else {
        await adminApi.createSpecialWithImage(specialData, selectedImage || undefined);
      }

      await loadData();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save special');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this special?')) {
      return;
    }

    try {
      await adminApi.deleteSpecial(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete special');
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const isActive = (special: Special) => {
    const now = new Date();
    const startDate = new Date(special.startDate);
    const endDate = new Date(special.endDate);
    return special.isActive && now >= startDate && now <= endDate;
  };

  const isExpired = (special: Special) => {
    return new Date(special.endDate) < new Date();
  };

  const getCoffeeShopName = (coffeeShopId: number) => {
    const shop = coffeeShops.find(shop => shop.id === coffeeShopId);
    return shop?.name || 'Unknown Coffee Shop';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading specials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Specials Management</h2>
          <p className="text-gray-600">Create and manage coffee shop specials and promotions</p>
        </div>
        <Button onClick={handleCreate} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Special
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Specials Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {specials.map((special) => (
          <Card key={special.id} className={`hover:shadow-lg transition-shadow ${
            !isActive(special) ? 'opacity-60' : ''
          }`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{special.title}</CardTitle>
                  <CardDescription className="mt-1 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {getCoffeeShopName(special.coffeeShopId)}
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(special)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(special.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {special.imageUrl && (
                <div className="mb-3">
                  <img 
                    src={special.thumbnailUrl || special.imageUrl} 
                    alt={special.title}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{special.description}</p>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {isActive(special) ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                  
                  {isExpired(special) && (
                    <Badge variant="destructive">Expired</Badge>
                  )}
                  
                  {special.showOnHomepage && (
                    <Badge variant="default" className="bg-blue-100 text-blue-800">
                      <Star className="h-3 w-3 mr-1" />
                      Homepage
                    </Badge>
                  )}
                </div>
                
                {(special.originalPrice && special.specialPrice) && (
                  <div className="text-sm">
                    <span className="line-through text-gray-500">${special.originalPrice}</span>
                    <span className="ml-2 font-semibold text-green-600">${special.specialPrice}</span>
                    {special.discountPercentage && (
                      <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        {special.discountPercentage}% OFF
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(special.startDate).toLocaleDateString()} - {new Date(special.endDate).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSpecial ? 'Edit Special' : 'Create New Special'}
            </DialogTitle>
            <DialogDescription>
              {editingSpecial ? 'Update the special details below.' : 'Fill in the details to create a new special.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange('title')}
                  placeholder="e.g., 20% Off All Lattes"
                  required
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  placeholder="Describe the special offer..."
                  rows={3}
                  required
                />
              </div>
              
              <div className="col-span-2">
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
              
              <div>
                <Label htmlFor="discountPercentage">Discount %</Label>
                <Input
                  id="discountPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.discountPercentage}
                  onChange={handleInputChange('discountPercentage')}
                  placeholder="e.g., 20"
                />
              </div>
              
              <div>
                <Label htmlFor="originalPrice">Original Price ($)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={handleInputChange('originalPrice')}
                  placeholder="e.g., 5.99"
                />
              </div>
              
              <div>
                <Label htmlFor="specialPrice">Special Price ($)</Label>
                <Input
                  id="specialPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.specialPrice}
                  onChange={handleInputChange('specialPrice')}
                  placeholder="e.g., 4.79"
                />
              </div>
              
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange('startDate')}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange('endDate')}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="image">Special Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="showOnHomepage"
                  checked={formData.showOnHomepage}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showOnHomepage: checked }))}
                />
                <Label htmlFor="showOnHomepage">Show on Homepage</Label>
              </div>
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
                {isSubmitting ? 'Saving...' : (editingSpecial ? 'Update Special' : 'Create Special')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}