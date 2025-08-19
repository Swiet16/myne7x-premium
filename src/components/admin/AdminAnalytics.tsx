import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingCart,
  Download,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface AnalyticsData {
  monthlyRevenue: any[];
  paymentMethodStats: any[];
  userGrowth: any[];
  productPerformance: any[];
  recentActivity: any[];
}

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    monthlyRevenue: [],
    paymentMethodStats: [],
    userGrowth: [],
    productPerformance: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch monthly revenue data
      const { data: revenueData } = await supabase
        .from('payment_requests')
        .select(`
          created_at,
          status,
          products(price, title)
        `)
        .eq('status', 'approved');

      // Process monthly revenue
      const monthlyRevenue = processMonthlyRevenue(revenueData || []);

      // Fetch payment method statistics
      const { data: paymentStats } = await supabase
        .from('payment_requests')
        .select('payment_method, status');

      const paymentMethodStats = processPaymentMethodStats(paymentStats || []);

      // Fetch user growth data
      const { data: userGrowthData } = await supabase
        .from('profiles')
        .select('created_at');

      const userGrowth = processUserGrowth(userGrowthData || []);

      // Fetch product performance
      const { data: productData } = await supabase
        .from('payment_requests')
        .select(`
          product_id,
          status,
          products(title, price)
        `)
        .eq('status', 'approved');

      const productPerformance = processProductPerformance(productData || []);

      setAnalytics({
        monthlyRevenue,
        paymentMethodStats,
        userGrowth,
        productPerformance,
        recentActivity: []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyRevenue = (data: any[]) => {
    const monthlyData: { [key: string]: number } = {};
    
    data.forEach(item => {
      const month = new Date(item.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
      const revenue = item.products?.price || 0;
      monthlyData[month] = (monthlyData[month] || 0) + revenue;
    });

    return Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue
    }));
  };

  const processPaymentMethodStats = (data: any[]) => {
    const stats: { [key: string]: { total: number; approved: number; pending: number; rejected: number } } = {};
    
    data.forEach(item => {
      const method = item.payment_method === 'nayapay' ? 'Nayapay' : 'Custom';
      if (!stats[method]) {
        stats[method] = { total: 0, approved: 0, pending: 0, rejected: 0 };
      }
      stats[method].total++;
      stats[method][item.status]++;
    });

    return Object.entries(stats).map(([method, data]) => ({
      method,
      ...data
    }));
  };

  const processUserGrowth = (data: any[]) => {
    const monthlyUsers: { [key: string]: number } = {};
    
    data.forEach(item => {
      const month = new Date(item.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyUsers[month] = (monthlyUsers[month] || 0) + 1;
    });

    return Object.entries(monthlyUsers).map(([month, users]) => ({
      month,
      users
    }));
  };

  const processProductPerformance = (data: any[]) => {
    const productStats: { [key: string]: { sales: number; revenue: number; title: string } } = {};
    
    data.forEach(item => {
      const productId = item.product_id;
      const title = item.products?.title || 'Unknown Product';
      const price = item.products?.price || 0;
      
      if (!productStats[productId]) {
        productStats[productId] = { sales: 0, revenue: 0, title };
      }
      productStats[productId].sales++;
      productStats[productId].revenue += price;
    });

    return Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  const COLORS = ['#00d4ff', '#c800ff', '#00ffc8', '#ff6b00', '#ff0080'];

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="card-neon">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-scale-in">
      {/* Revenue Analytics */}
      <Card className="card-neon">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-glow">
            <DollarSign className="h-5 w-5 text-neon-green" />
            Revenue Analytics
          </CardTitle>
          <CardDescription>Monthly revenue trends and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--neon-blue))"
                  fill="url(#gradientRevenue)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="gradientRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--neon-blue))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--neon-blue))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method Distribution */}
        <Card className="card-neon">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-glow-secondary">
              <ShoppingCart className="h-5 w-5 text-neon-purple" />
              Payment Methods
            </CardTitle>
            <CardDescription>Distribution of payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.paymentMethodStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ method, total }) => `${method}: ${total}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total"
                  >
                    {analytics.paymentMethodStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card className="card-neon">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-glow-accent">
              <Users className="h-5 w-5 text-neon-cyan" />
              User Growth
            </CardTitle>
            <CardDescription>Monthly user registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="hsl(var(--neon-cyan))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--neon-cyan))', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance */}
      <Card className="card-neon">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-glow">
            <TrendingUp className="h-5 w-5 text-neon-green" />
            Top Performing Products
          </CardTitle>
          <CardDescription>Revenue and sales by product</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.productPerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  type="category"
                  dataKey="title" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  width={120}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="url(#gradientBar)"
                  radius={[0, 4, 4, 0]}
                />
                <defs>
                  <linearGradient id="gradientBar" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="hsl(var(--neon-purple))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--neon-blue))" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Download, label: 'Total Downloads', value: '1,234', color: 'text-neon-blue' },
          { icon: Clock, label: 'Pending Requests', value: analytics.paymentMethodStats.reduce((sum, item) => sum + item.pending, 0), color: 'text-neon-orange' },
          { icon: CheckCircle, label: 'Approved Today', value: '45', color: 'text-neon-green' },
          { icon: XCircle, label: 'Rejected Today', value: '3', color: 'text-neon-pink' }
        ].map((stat, index) => (
          <Card key={index} className="card-neon pulse-neon">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-glow">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminAnalytics;