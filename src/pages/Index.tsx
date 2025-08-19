import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Star, 
  Shield, 
  Zap, 
  Package, 
  Download,
  Users,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import ceoImage from '@/assets/ceo-myne-winner.jpg';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

const Index = () => {
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalDownloads: 0
  });

  useEffect(() => {
    fetchFeaturedProducts();
    fetchStats();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [productsResult, usersResult, accessResult] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('user_product_access').select('id', { count: 'exact' })
      ]);

      setStats({
        totalProducts: productsResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalDownloads: accessResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-animated opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-6xl mx-auto">
            <div className="slide-in-up">
              <Badge className="mb-6 bg-primary/20 text-primary border-primary/50 pulse-neon">
                <Sparkles className="w-4 h-4 mr-2" />
                Welcome to the Future of Digital Products
              </Badge>
              <h1 className="text-6xl md:text-8xl font-orbitron font-black mb-6 text-glow">
                MYNE7X
                <span className="block text-transparent bg-clip-text bg-gradient-neon">
                  STORE
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Discover premium digital products, tools, and resources designed to accelerate your success in the digital world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products">
                  <Button size="lg" className="btn-neon px-8 py-4 text-lg font-semibold">
                    Explore Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                {!user && (
                  <Link to="/auth">
                    <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-primary/50 hover:bg-primary/10">
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 float">
          <div className="w-20 h-20 rounded-full bg-gradient-neon opacity-20 blur-xl"></div>
        </div>
        <div className="absolute bottom-32 right-16 float" style={{ animationDelay: '2s' }}>
          <div className="w-32 h-32 rounded-full bg-gradient-neon-secondary opacity-20 blur-xl"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center slide-in-left">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-neon flex items-center justify-center">
                <Package className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-4xl font-orbitron font-bold text-glow mb-2">{stats.totalProducts}+</h3>
              <p className="text-muted-foreground">Premium Products</p>
            </div>
            <div className="text-center slide-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-neon-secondary flex items-center justify-center">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-4xl font-orbitron font-bold text-glow-secondary mb-2">{stats.totalUsers}+</h3>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div className="text-center slide-in-right" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-neon-accent flex items-center justify-center">
                <Download className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-4xl font-orbitron font-bold text-glow-accent mb-2">{stats.totalDownloads}+</h3>
              <p className="text-muted-foreground">Downloads</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 text-glow">
              Featured Products
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular digital products crafted for excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredProducts.map((product, index) => (
              <Card key={product.id} className="card-neon group" style={{ animationDelay: `${index * 0.2}s` }}>
                {product.image_url && (
                  <div className="h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-orbitron text-xl group-hover:text-primary transition-colors">
                    {product.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-gradient-neon text-primary-foreground border-0">
                      ${product.price}
                    </Badge>
                    <Link to={`/products`}>
                      <Button variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" className="btn-neon">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 text-glow">
              Why Choose MYNE7X Store?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center slide-in-left">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-neon flex items-center justify-center">
                <Zap className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-orbitron font-bold mb-4">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Instant access to your purchased products with our optimized download system
              </p>
            </div>
            
            <div className="text-center slide-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-neon-secondary flex items-center justify-center">
                <Shield className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-orbitron font-bold mb-4">Secure & Reliable</h3>
              <p className="text-muted-foreground">
                Bank-level security ensures your purchases and data are always protected
              </p>
            </div>
            
            <div className="text-center slide-in-right" style={{ animationDelay: '0.4s' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-neon-accent flex items-center justify-center">
                <Star className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-orbitron font-bold mb-4">Premium Quality</h3>
              <p className="text-muted-foreground">
                Carefully curated products that meet our high standards of excellence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="card-neon overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center justify-center p-8">
                  <div className="relative">
                    <img
                      src={ceoImage}
                      alt="Myne Winner - CEO"
                      className="w-64 h-64 rounded-full object-cover border-4 border-primary/50 shadow-glow"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-neon opacity-20"></div>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <h2 className="text-3xl font-orbitron font-bold mb-4 text-glow">
                    Meet Our CEO
                  </h2>
                  <h3 className="text-2xl font-bold text-primary mb-4">Myne Winner</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "At MYNE7X Store, we believe in empowering creators and businesses with 
                    cutting-edge digital solutions. Our mission is to bridge the gap between 
                    innovation and accessibility, making premium digital products available 
                    to everyone who dares to dream big."
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-gradient-neon text-primary-foreground border-0">
                      Visionary Leader
                    </Badge>
                    <Badge variant="outline" className="border-primary/50">
                      Tech Innovator
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-animated relative overflow-hidden">
        <div className="absolute inset-0 bg-background/80"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of satisfied customers and discover what makes MYNE7X Store special
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="bg-white text-background hover:bg-white/90 px-8 py-4 text-lg font-semibold">
                  Browse Products
                  <Package className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {!user && (
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                    Sign Up Now
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;