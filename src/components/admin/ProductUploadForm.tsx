import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Upload, X, Plus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface ProductUploadFormProps {
  onProductUploaded: () => void;
}

const ProductUploadForm = ({ onProductUploaded }: ProductUploadFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    tags: [] as string[],
    isFree: false,
  });
  const [newTag, setNewTag] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [featureImages, setFeatureImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || (!formData.isFree && !formData.price)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      let imageUrl = '';
      let fileUrl = '';

      // Upload image if provided
      if (imageFile) {
        imageUrl = await uploadFile(imageFile, 'product-images');
      }

      // Upload product file if provided
      if (productFile) {
        fileUrl = await uploadFile(productFile, 'product-files');
      }

      // Upload feature images if provided
      let featureImageUrls: string[] = [];
      if (featureImages.length > 0) {
        featureImageUrls = await Promise.all(
          featureImages.map(file => uploadFile(file, 'product-images'))
        );
      }

      // Insert product into database
      const { error } = await supabase
        .from('products')
        .insert({
          title: formData.title,
          description: formData.description,
          price: formData.isFree ? 0 : parseFloat(formData.price),
          category: formData.category || null,
          tags: formData.tags.length > 0 ? formData.tags : null,
          image_url: imageUrl || null,
          file_url: fileUrl || null,
          feature_images: featureImageUrls.length > 0 ? featureImageUrls : null,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product uploaded successfully!",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        tags: [],
        isFree: false,
      });
      setNewTag('');
      setImageFile(null);
      setProductFile(null);
      setFeatureImages([]);
      onProductUploaded();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload product",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload New Product
        </CardTitle>
        <CardDescription>
          Add a new digital product to your store
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter product title"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="price">Price (USD) {!formData.isFree && '*'}</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="free-toggle"
                    checked={formData.isFree}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        isFree: checked,
                        price: checked ? '0' : prev.price
                      }));
                    }}
                  />
                  <Label htmlFor="free-toggle" className="text-sm">Free Product</Label>
                </div>
              </div>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
                disabled={formData.isFree}
                required={!formData.isFree}
              />
              {formData.isFree && (
                <p className="text-xs text-muted-foreground mt-1">
                  This product will be available for free download
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your product..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="e.g., Software, Ebooks, Templates"
            />
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="image">Main Product Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <Label htmlFor="file">Product File</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setProductFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="feature-images">Feature Images (Max 6)</Label>
            <Input
              id="feature-images"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 6) {
                  toast({
                    title: "Error",
                    description: "Maximum 6 feature images allowed",
                    variant: "destructive"
                  });
                  return;
                }
                setFeatureImages(files);
              }}
            />
            {featureImages.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {featureImages.length} image(s) selected
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {featureImages.map((file, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {file.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button type="submit" disabled={uploading} className="w-full">
            {uploading ? 'Uploading...' : 'Upload Product'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductUploadForm;