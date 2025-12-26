import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Coffee, 
  Ticket, 
  FileText, 
  Bell, 
  Mail, 
  UserPlus, 
  LogOut,
  Settings,
  BarChart3,
  Calendar,
  Tag,
  Star
} from 'lucide-react';
import { adminApi, type DashboardAnalytics } from '@/services/adminApi';
import AdminLayout from '@/components/admin/AdminLayout';
import CoffeeShopManagement from '@/components/admin/CoffeeShopManagement';
import CouponManagement from '@/components/admin/CouponManagement';
import BlogManagement from '@/components/admin/BlogManagement';
import NotificationManagement from '@/components/admin/NotificationManagement';
import UserManagement from '@/components/admin/UserManagement';
import SpecialsManagement from '@/components/admin/SpecialsManagement';
import FeaturedSpotManagement from '@/components/admin/FeaturedSpotManagement';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getDashboardAnalytics();
      setAnalytics(data);
    } catch (err) {
      if (err instanceof Error && err.message === 'Authentication required') {
        setLocation('/admin/login');
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminApi.logout();
    setLocation('/admin/login');
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadDashboardData} variant="outline">
            Try Again
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const StatCard = ({ title, value, icon: Icon, description }: {
    title: string;
    value: number;
    icon: any;
    description: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your coffee shop platform.</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="coffee-shops" className="flex items-center gap-2">
              <Coffee className="h-4 w-4" />
              Coffee Shops
            </TabsTrigger>
            <TabsTrigger value="specials" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Specials
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="coupons" className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              Coupons
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Analytics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Contacts"
                value={analytics?.totalContacts || 0}
                icon={Mail}
                description="Contact form submissions"
              />
              <StatCard
                title="Total Signups"
                value={analytics?.totalSignups || 0}
                icon={UserPlus}
                description="User registrations"
              />
              <StatCard
                title="Coffee Shops"
                value={analytics?.totalCoffeeShops || 0}
                icon={Coffee}
                description="Listed coffee shops"
              />
              <StatCard
                title="Active Coupons"
                value={analytics?.totalCoupons || 0}
                icon={Ticket}
                description="Available discount codes"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Subscribers"
                value={analytics?.totalSubscribers || 0}
                icon={Users}
                description="Newsletter subscribers"
              />
              <StatCard
                title="Blog Posts"
                value={analytics?.totalBlogPosts || 0}
                icon={FileText}
                description="Published articles"
              />
              <StatCard
                title="Notifications"
                value={analytics?.totalNotifications || 0}
                icon={Bell}
                description="System announcements"
              />
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Contacts</CardTitle>
                  <CardDescription>Latest contact form submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.recentContacts?.slice(0, 5).map((contact: any) => (
                      <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-gray-600">{contact.email}</p>
                          <p className="text-xs text-gray-500">{contact.subject}</p>
                        </div>
                        <Badge variant="secondary">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No recent contacts</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Signups</CardTitle>
                  <CardDescription>Latest user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.recentSignups?.slice(0, 5).map((signup: any) => (
                      <div key={signup.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{signup.name}</p>
                          <p className="text-sm text-gray-600">{signup.email}</p>
                          <p className="text-xs text-gray-500">{signup.city} • {signup.tribe}</p>
                        </div>
                        <Badge variant="secondary">
                          {new Date(signup.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No recent signups</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="coffee-shops">
            <CoffeeShopManagement />
          </TabsContent>

          <TabsContent value="specials">
            <SpecialsManagement />
          </TabsContent>

          <TabsContent value="featured">
            <FeaturedSpotManagement />
          </TabsContent>

          <TabsContent value="coupons">
            <CouponManagement />
          </TabsContent>

          <TabsContent value="blog">
            <BlogManagement />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}