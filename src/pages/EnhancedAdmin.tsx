import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Users, 
  Package, 
  CreditCard, 
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
  BarChart3,
  Zap,
  Activity,
  Globe,
  Shield
} from 'lucide-react';

// Components
import CosmicLoader from '@/components/CosmicLoader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import ExportData from '@/components/admin/ExportData';
import ProductUploadForm from '@/components/admin/ProductUploadForm';
import UserManagement from '@/components/admin/UserManagement';
import PaymentRequestManagement from '@/components/admin/PaymentRequestManagement';
import ProductManagement from '@/components/admin/ProductManagement';

interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalRevenue: number;
  todayRevenue: number;
  recentActivity: any[];
}

const EnhancedAdmin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProducts: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    recentActivity: []
  });

  useEffect(() => {
    fetchStats();
    
    // Real-time updates
    const channel = supabase
      .channel('admin_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'payment_requests' },
        () => fetchStats()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        () => fetchStats()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch all stats in parallel
      const [
        { count: usersCount },
        { count: productsCount },
        { data: pendingRequests },
        { data: approvedRequests },
        { data: rejectedRequests },
        { data: revenueData }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('payment_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('payment_requests').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('payment_requests').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
        supabase.from('payment_requests').select(`
          products(price),
          created_at
        `).eq('status', 'approved')
      ]);

      // Calculate revenue
      const totalRevenue = revenueData?.reduce((sum, request) => {
        return sum + (request.products?.price || 0);
      }, 0) || 0;

      // Calculate today's revenue
      const today = new Date().toISOString().split('T')[0];
      const todayRevenue = revenueData?.filter(request => 
        request.created_at.startsWith(today)
      ).reduce((sum, request) => {
        return sum + (request.products?.price || 0);
      }, 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        totalProducts: productsCount || 0,
        pendingRequests: pendingRequests?.length || 0,
        approvedRequests: approvedRequests?.length || 0,
        rejectedRequests: rejectedRequests?.length || 0,
        totalRevenue,
        todayRevenue,
        recentActivity: []
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive"
      });
    }
  };

  const handleLoaderComplete = () => {
    setIsLoading(false);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (isLoading) {
    return <CosmicLoader onComplete={handleLoaderComplete} />;
  }

  const renderDashboard = () => (
    <div className="space-y-6 animate-scale-in">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            color: "text-neon-blue",
            bg: "bg-neon-blue/10",
            change: "+12%",
            changeType: "positive"
          },
          {
            title: "Active Products",
            value: stats.totalProducts,
            icon: Package,
            color: "text-neon-purple",
            bg: "bg-neon-purple/10",
            change: "+8%",
            changeType: "positive"
          },
          {
            title: "Pending Requests",
            value: stats.pendingRequests,
            icon: Clock,
            color: "text-neon-orange",
            bg: "bg-neon-orange/10",
            change: "-5%",
            changeType: "negative"
          },
          {
            title: "Total Revenue",
            value: `$${stats.totalRevenue}`,
            icon: DollarSign,
            color: "text-neon-green",
            bg: "bg-neon-green/10",
            change: "+23%",
            changeType: "positive"
          }
        ].map((stat, index) => (
          <Card key={index} className="card-neon pulse-neon">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-glow">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`h-3 w-3 mr-1 ${
                      stat.changeType === 'positive' ? 'text-neon-green' : 'text-neon-pink'
                    }`} />
                    <span className={`text-xs ${
                      stat.changeType === 'positive' ? 'text-neon-green' : 'text-neon-pink'
                    }`}>
                      {stat.change} from last month
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="card-neon">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-glow">
              <Zap className="h-5 w-5 text-neon-blue" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Review Payments", action: () => setActiveTab('payments'), count: stats.pendingRequests },
              { label: "Upload Product", action: () => setActiveTab('upload'), count: null },
              { label: "View Analytics", action: () => setActiveTab('analytics'), count: null },
              { label: "Manage Users", action: () => setActiveTab('users'), count: stats.totalUsers }
            ].map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-between h-12 hover:bg-primary/10 hover:shadow-neon-blue/20"
                onClick={item.action}
              >
                <span>{item.label}</span>
                {item.count && (
                  <Badge variant="secondary">{item.count}</Badge>
                )}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="card-neon">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-glow-secondary">
              <Activity className="h-5 w-5 text-neon-purple" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Payment approved", time: "2 min ago", type: "success" },
                { action: "New user registered", time: "5 min ago", type: "info" },
                { action: "Product uploaded", time: "10 min ago", type: "info" },
                { action: "Payment rejected", time: "15 min ago", type: "warning" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/20">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-neon-green' :
                      activity.type === 'warning' ? 'bg-neon-orange' : 'bg-neon-blue'
                    }`}></div>
                    <span className="text-sm">{activity.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-neon">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-glow-accent">
              <Shield className="h-5 w-5 text-neon-cyan" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { service: "Database", status: "Operational", uptime: "99.9%" },
                { service: "Storage", status: "Operational", uptime: "99.8%" },
                { service: "Authentication", status: "Operational", uptime: "100%" },
                { service: "Payments", status: "Operational", uptime: "99.7%" }
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-green"></div>
                    <span className="text-sm">{service.service}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-neon-green">{service.status}</div>
                    <div className="text-xs text-muted-foreground">{service.uptime}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-neon">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-glow">
              <BarChart3 className="h-5 w-5 text-neon-blue" />
              Today's Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Today's Revenue", value: `$${stats.todayRevenue}`, color: "text-neon-green" },
                { label: "New Users", value: "12", color: "text-neon-blue" },
                { label: "Payments Processed", value: "8", color: "text-neon-purple" },
                { label: "Downloads", value: "45", color: "text-neon-cyan" }
              ].map((metric, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-muted/20">
                  <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                  <div className="text-xs text-muted-foreground">{metric.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-neon">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-glow-secondary">
              <Globe className="h-5 w-5 text-neon-purple" />
              Platform Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Approved Requests</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-neon rounded-full"
                      style={{ 
                        width: `${(stats.approvedRequests / (stats.approvedRequests + stats.rejectedRequests + stats.pendingRequests)) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.approvedRequests}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Reviews</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-neon-orange rounded-full"
                      style={{ 
                        width: `${(stats.pendingRequests / (stats.approvedRequests + stats.rejectedRequests + stats.pendingRequests)) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.pendingRequests}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Products</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-full h-full bg-neon-purple rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">{stats.totalProducts}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card className="card-neon">
        <CardHeader>
          <CardTitle className="text-glow">Platform Settings</CardTitle>
          <CardDescription>Configure your admin portal and platform settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
              <div>
                <h4 className="font-medium">Theme Mode</h4>
                <p className="text-sm text-muted-foreground">Toggle between dark and light mode</p>
              </div>
              <Button onClick={handleThemeToggle} variant="outline">
                {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
              </Button>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/20">
              <h4 className="font-medium mb-2">Platform Information</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Platform:</strong> Myne7x Admin Portal</p>
                <p><strong>Version:</strong> 2.0.0 Enhanced</p>
                <p><strong>Admin Email:</strong> myne7x@gmail.com</p>
                <p><strong>WhatsApp:</strong> +923096626615</p>
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <ExportData />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'analytics':
        return <AdminAnalytics />;
      case 'payments':
        return <PaymentRequestManagement />;
      case 'products':
        return <ProductManagement onProductsChange={fetchStats} />;
      case 'upload':
        return <ProductUploadForm onProductUploaded={fetchStats} />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-neon-blue/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-neon-cyan/3 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Sidebar */}
      <AdminSidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
      />

      {/* Main Content */}
      <div className="ml-16 lg:ml-64 transition-all duration-300">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-orbitron font-bold text-glow mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Portal
              </h1>
              <p className="text-muted-foreground">
                {activeTab === 'dashboard' && 'Complete overview of your platform performance'}
                {activeTab === 'analytics' && 'Detailed analytics and performance metrics'}
                {activeTab === 'payments' && 'Manage all payment requests and transactions'}
                {activeTab === 'products' && 'Product catalog management and performance'}
                {activeTab === 'upload' && 'Add new products to your platform'}
                {activeTab === 'users' && 'User management and role administration'}
                {activeTab === 'settings' && 'Platform configuration and system settings'}
              </p>
            </div>
            <Badge variant="outline" className="text-neon-cyan border-neon-cyan">
              <Zap className="h-3 w-3 mr-1" />
              Enhanced Admin v2.0
            </Badge>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAdmin;