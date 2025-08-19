import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Package, DollarSign, Download, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DownloadComponent from '@/components/DownloadComponent';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  feature_images: string[];
  category: string;
  tags: string[];
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

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [userAccess, setUserAccess] = useState<UserAccess[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingProduct, setDownloadingProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (productId) {
      fetchProduct();
      if (user) {
        fetchUserAccess();
        fetchPaymentRequests();
      }
    }
  }, [productId, user]);

  const fetchProduct = async () => {
    if (!productId) return;
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setProduct(data);
      setSelectedImage(data.image_url || '');
    } catch (error) {
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive"
      });
      navigate('/products');
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
    if (isAdmin) {
      // Admin can download immediately without countdown
      try {
        if (product.file_url) {
          const { data } = await supabase.storage
            .from('product-files')
            .createSignedUrl(product.file_url.split('/').pop() || '', 3600);
          
          if (data?.signedUrl) {
            const link = document.createElement('a');
            link.href = data.signedUrl;
            link.download = product.title;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast({
              title: "Download Started",
              description: `${product.title} download has begun`,
            });
          } else {
            throw new Error('Unable to create download link');
          }
        } else {
          throw new Error('No file URL found');
        }
      } catch (error) {
        toast({
          title: "Download Failed",
          description: "Unable to download the file",
          variant: "destructive"
        });
      }
      return;
    }

    // For free products or users with access, show countdown
    if (product.price === 0 || hasAccess(product.id)) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background/50 via-background to-background/50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-32"></div>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="h-96 bg-muted rounded"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-32 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background/50 via-background to-background/50 py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="pt-6">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Product Not Found</h3>
              <Button onClick={() => navigate('/products')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const allImages = [product.image_url, ...(product.feature_images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background/50 via-background to-background/50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/products')}
            className="mb-6 hover-scale"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                {selectedImage ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer group relative">
                        <img
                          src={selectedImage}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{product.title}</DialogTitle>
                      </DialogHeader>
                      <div className="flex justify-center">
                        <img 
                          src={selectedImage} 
                          alt={product.title}
                          className="max-w-full max-h-[70vh] object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allImages.map((image, index) => (
                    <div 
                      key={index}
                      className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedImage === image ? 'border-primary' : 'border-muted hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <Card className="card-neon">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl text-glow">{product.title}</CardTitle>
                    <Badge variant={product.price === 0 ? "default" : "secondary"} className="text-lg px-3 py-1">
                      {product.price === 0 ? (
                        <>FREE</>
                      ) : (
                        <>
                          <DollarSign className="h-4 w-4 mr-1" />
                          {product.price}
                        </>
                      )}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Tags and Category */}
                    <div className="flex flex-wrap gap-2">
                      {product.category && (
                        <Badge variant="outline" className="px-3 py-1">
                          {product.category}
                        </Badge>
                      )}
                      {product.tags?.map((tag, index) => (
                        <Badge key={index} variant="outline" className="px-2 py-1 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Action Button */}
                    {(() => {
                      const buttonState = getButtonState(product);
                      const Icon = buttonState.icon;
                      
                      return (
                        <Button 
                          onClick={buttonState.action}
                          className={`w-full text-base md:text-lg py-4 md:py-6 ${buttonState.className || ''}`}
                          variant={buttonState.variant}
                          disabled={buttonState.disabled}
                          size="lg"
                        >
                          {Icon && <Icon className="h-4 w-4 md:h-5 md:w-5 mr-2" />}
                          {buttonState.text}
                        </Button>
                      );
                    })()}
                  </CardContent>
              </Card>
            </div>
          </div>
        </div>

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

export default ProductDetails;