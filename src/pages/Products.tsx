import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Search, Package, DollarSign, Download } from 'lucide-react';
import DownloadComponent from '@/components/DownloadComponent';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  tags: string[];
  feature_images: string[];
  is_active: boolean;
  file_url?: string;
}

interface UserAccess {
  product_id: string;
}

interface PaymentRequest {
  id: string;
  product_id: string;
  status: string;
}

const Products = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [userAccess, setUserAccess] = useState<UserAccess[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloadingProduct, setDownloadingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchUserAccess();
      fetchPaymentRequests();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAccess = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_product_access')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserAccess(data || []);
    } catch (error) {
      console.error('Error fetching user access:', error);
    }
  };

  const fetchPaymentRequests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('payment_requests')
        .select('id, product_id, status')
        .eq('user_id', user.id);

      if (error) throw error;
      setPaymentRequests(data || []);
    } catch (error) {
      console.error('Error fetching payment requests:', error);
    }
  };

  const hasAccess = (productId: string) => {
    return userAccess.some(access => access.product_id === productId);
  };

  const getPaymentStatus = (productId: string) => {
    const request = paymentRequests.find(req => req.product_id === productId);
    return request?.status || null;
  };

  const handleDownload = async (product: Product) => {
    // For free products or users with access, show countdown
    if (product.price === 0 || hasAccess(product.id) || isAdmin) {
      setDownloadingProduct(product);
    } else {
      toast({
        title: "Access Denied",
        description: "You need to purchase this product first",
        variant: "destructive"
      });
    }
  };

  const getButtonState = (product: Product) => {
    if (!user) {
      return { text: 'Sign in to Purchase', variant: 'outline' as const, action: () => navigate('/auth') };
    }

    // For free products, show Download button directly
    if (product.price === 0) {
      return { 
        text: 'Download', 
        variant: 'default' as const, 
        action: () => handleDownload(product),
        icon: Download,
        className: 'btn-neon'
      };
    }

    // For paid products, check access
    if (hasAccess(product.id)) {
      return { 
        text: 'Download', 
        variant: 'default' as const, 
        action: () => handleDownload(product),
        icon: Download,
        className: 'btn-neon'
      };
    }

    const paymentStatus = getPaymentStatus(product.id);
    
    if (paymentStatus === 'pending') {
      return { text: 'Request Pending', variant: 'secondary' as const, disabled: true };
    }
    
    if (paymentStatus === 'rejected') {
      return { text: 'Request Rejected - Try Again', variant: 'destructive' as const, action: () => navigate(`/request-payment/${product.id}`) };
    }

    return { 
      text: `Buy - $${product.price}`, 
      variant: 'default' as const,
      action: () => navigate(`/request-payment/${product.id}`),
      className: 'btn-neon'
    };
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background/50 via-background to-background/50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-background py-4 md:py-8">
      <div className="container mx-auto px-3 md:px-4">
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-orbitron font-black mb-4 text-glow bg-gradient-animated bg-clip-text text-transparent">
            Digital Products
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 px-2 md:px-4">
            Discover our collection of premium digital products and free resources
          </p>
          <div className="relative max-w-md mx-auto px-2 md:px-4">
            <Search className="absolute left-5 md:left-7 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 md:pl-10 h-12 card-neon border-border/30 focus:border-primary/50 text-foreground"
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <Card className="text-center py-12 card-neon max-w-md mx-auto">
            <CardContent>
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'No products are currently available'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden card-neon hover-scale transition-all duration-300 hover:shadow-glow">
                {product.image_url && (
                  <div 
                    className="h-40 md:h-48 overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader className="pb-3 p-3 md:p-6">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle 
                      className="text-sm md:text-lg cursor-pointer hover:text-primary transition-colors line-clamp-1 font-orbitron"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.title}
                    </CardTitle>
                    <Badge 
                      variant={product.price === 0 ? "default" : "secondary"} 
                      className={`shrink-0 text-xs ${product.price === 0 ? 'bg-neon-green/20 text-neon-green border-neon-green/30' : 'bg-neon-purple/20 text-neon-purple border-neon-purple/30'}`}
                    >
                      {product.price === 0 ? (
                        <>FREE</>
                      ) : (
                        <>
                          <DollarSign className="h-3 w-3 mr-1" />
                          {product.price}
                        </>
                      )}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2 text-xs md:text-sm text-muted-foreground">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 p-3 md:p-6 md:pt-0">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.category && (
                      <Badge variant="outline" className="text-xs border-border/30 text-muted-foreground">{product.category}</Badge>
                    )}
                    {product.tags?.slice(0, 1).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-border/30 text-muted-foreground">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {(() => {
                    const buttonState = getButtonState(product);
                    const Icon = buttonState.icon;
                    
                    return (
                      <Button 
                        onClick={buttonState.action}
                        className={`w-full text-xs md:text-sm h-9 md:h-10 font-semibold transition-all duration-300 ${buttonState.className || ''}`}
                        variant={buttonState.variant}
                        disabled={buttonState.disabled}
                      >
                        {Icon && <Icon className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />}
                        {buttonState.text}
                      </Button>
                    );
                  })()}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Download Component */}
        {downloadingProduct && (
          <DownloadComponent 
            product={downloadingProduct}
            onClose={() => setDownloadingProduct(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Products;