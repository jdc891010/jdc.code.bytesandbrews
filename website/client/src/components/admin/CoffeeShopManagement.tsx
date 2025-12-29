import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, MapPin, Wifi, Image as ImageIcon, X, Upload } from 'lucide-react';
import { adminApi, type CoffeeShop, type CoffeeShopData } from '@/services/adminApi';
import { clearCoffeeShopCache } from '@/services/coffeeShopApi';

export default function CoffeeShopManagement() {
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<CoffeeShop | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    website: '',
    phoneNumber: '',
    rating: '',
    openingHours: '',
    opensAt: '',
    closesAt: '',
    isOpen24Hours: false,
    wifiSpeed: '',
    imageUrl: '',
    thumbnailUrl: '',
    priceLevel: '',
    userRatingCount: '',
    businessStatus: '',
    googleMapsUri: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCoffeeShops();
  }, []);

  const loadCoffeeShops = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getCoffeeShops();
      setCoffeeShops(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load coffee shops');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      latitude: '',
      longitude: '',
      website: '',
      phoneNumber: '',
      rating: '',
      openingHours: '',
      opensAt: '',
      closesAt: '',
      isOpen24Hours: false,
      wifiSpeed: '',
      imageUrl: '',
      thumbnailUrl: '',
      priceLevel: '',
      userRatingCount: '',
      businessStatus: '',
      googleMapsUri: ''
    });
    setEditingShop(null);
    setImagePreview(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (shop: CoffeeShop) => {
    setFormData({
      name: shop.name,
      description: shop.description || '',
      address: shop.address,
      city: shop.city,
      country: shop.country,
      postalCode: shop.postalCode || '',
      latitude: shop.latitude || '',
      longitude: shop.longitude || '',
      website: shop.website || '',
      phoneNumber: shop.phoneNumber || '',
      rating: shop.rating || '',
      openingHours: shop.openingHours || '',
      opensAt: shop.opensAt || '',
      closesAt: shop.closesAt || '',
      isOpen24Hours: shop.isOpen24Hours || false,
      wifiSpeed: shop.wifiSpeed?.toString() || '',
      imageUrl: shop.imageUrl || '',
      thumbnailUrl: shop.thumbnailUrl || '',
      priceLevel: shop.priceLevel || '',
      userRatingCount: shop.userRatingCount?.toString() || '',
      businessStatus: shop.businessStatus || '',
      googleMapsUri: shop.googleMapsUri || ''
    });
    setEditingShop(shop);
    setImagePreview(shop.imageUrl || null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const shopData = {
        ...formData,
        wifiSpeed: formData.wifiSpeed ? parseInt(formData.wifiSpeed) : undefined,
        userRatingCount: formData.userRatingCount ? parseInt(formData.userRatingCount) : undefined
      };

      if (editingShop) {
        await adminApi.updateCoffeeShop(editingShop.id, shopData);
      } else {
        await adminApi.createCoffeeShop(shopData);
      }

      await loadCoffeeShops();
      // Clear cache to ensure map shows updated data
      clearCoffeeShopCache();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save coffee shop');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this coffee shop?')) {
      return;
    }

    try {
      await adminApi.deleteCoffeeShop(id);
      await loadCoffeeShops();
      // Clear cache to ensure map shows updated data
      clearCoffeeShopCache();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete coffee shop');
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WebP, or AVIF)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      setError('');

      const formData = new FormData();
      formData.append('image', file);
      formData.append('uploadType', 'coffee-shops');

      const response = await fetch('/api/admin/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload image');
      }

      // Update form data with the uploaded image URLs and show compression info
      setFormData(prev => ({
        ...prev,
        imageUrl: result.imageUrl,
        thumbnailUrl: result.thumbnailUrl || result.imageUrl
      }));
      setImagePreview(result.imageUrl);
      
      // Show compression information if available
      if (result.compressionRatio && result.compressionRatio > 0) {
        console.log(`Image compressed by ${result.compressionRatio}% (${Math.round(result.originalSize / 1024)}KB → ${Math.round(result.processedSize / 1024)}KB)`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      imageUrl: '',
      thumbnailUrl: ''
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading coffee shops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Coffee Shop Management</h2>
          <p className="text-gray-600">Manage coffee shop listings and information</p>
        </div>
        <Button onClick={handleCreate} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Coffee Shop
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Coffee Shops Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {coffeeShops.map((shop) => (
          <Card key={shop.id} className="hover:shadow-lg transition-shadow overflow-hidden">
            {/* Image Section */}
            {shop.imageUrl ? (
              <div className="relative h-48 bg-gray-100">
                <img 
                  src={shop.imageUrl} 
                  alt={shop.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              </div>
            ) : (
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
            
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{shop.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {shop.city}, {shop.country}
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(shop)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(shop.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{shop.description}</p>
              <div className="space-y-2">
                <p className="text-xs text-gray-500">{shop.address}</p>
                {shop.wifiSpeed && (
                  <Badge variant="secondary" className="flex items-center w-fit">
                    <Wifi className="h-3 w-3 mr-1" />
                    {shop.wifiSpeed} Mbps
                  </Badge>
                )}
                <p className="text-xs text-gray-400">
                  Updated: {new Date(shop.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {coffeeShops.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">No coffee shops found</p>
            <Button onClick={handleCreate} variant="outline">
              Add your first coffee shop
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingShop ? 'Edit Coffee Shop' : 'Add New Coffee Shop'}
            </DialogTitle>
            <DialogDescription>
              {editingShop ? 'Update the coffee shop information.' : 'Add a new coffee shop to the platform.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  placeholder="Coffee shop name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  placeholder="Brief description of the coffee shop (optional)"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange('address')}
                  placeholder="Street address"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange('city')}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={handleInputChange('country')}
                    placeholder="Country"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange('postalCode')}
                    placeholder="Postal code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    value={formData.rating}
                    onChange={handleInputChange('rating')}
                    placeholder="e.g., 4.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userRatingCount">Review Count</Label>
                  <Input
                    id="userRatingCount"
                    type="number"
                    value={formData.userRatingCount}
                    onChange={handleInputChange('userRatingCount')}
                    placeholder="e.g., 120"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceLevel">Price Level</Label>
                  <Input
                    id="priceLevel"
                    value={formData.priceLevel}
                    onChange={handleInputChange('priceLevel')}
                    placeholder="e.g., Moderate"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessStatus">Business Status</Label>
                <Input
                  id="businessStatus"
                  value={formData.businessStatus}
                  onChange={handleInputChange('businessStatus')}
                  placeholder="e.g., Operational"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude *</Label>
                  <Input
                    id="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange('latitude')}
                    placeholder="e.g., 40.7128"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude *</Label>
                  <Input
                    id="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange('longitude')}
                    placeholder="e.g., -74.0060"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange('website')}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleMapsUri">Google Maps URL</Label>
                <Input
                  id="googleMapsUri"
                  type="url"
                  value={formData.googleMapsUri}
                  onChange={handleInputChange('googleMapsUri')}
                  placeholder="https://maps.google.com/..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange('phoneNumber')}
                  placeholder="e.g., +1 (555) 123-4567"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wifiSpeed">WiFi Speed (Mbps)</Label>
                <Input
                  id="wifiSpeed"
                  type="number"
                  value={formData.wifiSpeed}
                  onChange={handleInputChange('wifiSpeed')}
                  placeholder="e.g., 50"
                  min="0"
                />
              </div>
              
              {/* Opening Hours Section */}
              <div className="space-y-2">
                <Label htmlFor="openingHours">Opening Hours</Label>
                <Textarea
                  id="openingHours"
                  value={formData.openingHours}
                  onChange={handleInputChange('openingHours')}
                  placeholder="e.g., Monday: 7:00 AM – 9:00 PM\nTuesday: 7:00 AM – 9:00 PM\n..."
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opensAt">Opens At</Label>
                  <Input
                    id="opensAt"
                    type="time"
                    value={formData.opensAt}
                    onChange={handleInputChange('opensAt')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closesAt">Closes At</Label>
                  <Input
                    id="closesAt"
                    type="time"
                    value={formData.closesAt}
                    onChange={handleInputChange('closesAt')}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  id="isOpen24Hours"
                  type="checkbox"
                  checked={formData.isOpen24Hours}
                  onChange={(e) => setFormData(prev => ({ ...prev, isOpen24Hours: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="isOpen24Hours" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Open 24 Hours
                </Label>
              </div>
              
              {/* Image Upload Section */}
              <div className="space-y-2">
                <Label>Coffee Shop Image</Label>
                <div className="space-y-3">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Coffee shop preview"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload a coffee shop image</p>
                      <p className="text-xs text-gray-500 mb-3">JPEG, PNG, GIF, WebP, or AVIF (max 5MB)</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {uploadingImage ? 'Uploading...' : 'Choose Image'}
                    </Button>
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveImage}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
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
                {isSubmitting ? 'Saving...' : (editingShop ? 'Update' : 'Create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}