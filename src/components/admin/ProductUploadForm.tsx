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

  // ✅ Updated uploadFile function
  const uploadFile = async (file: File, bucket: string, customName?: string) => {
    const fileExt = file.name.split('.').pop();

    let fileName;
    if (customName) {
      const sanitizedName = customName
        .replace(/[^a-zA-Z0-9\s\-_]/g, '') // remove special chars
        .replace(/\s+/g, '_') // replace spaces with _
        .trim();
      fileName = `${sanitizedName}.${fileExt}`;
    } else {
      fileName = `${Math.random()}.${fileExt}`;
    }

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

      // ✅ Upload product file with product title as filename
      if (productFile) {
        fileUrl = await uploadFile(productFile, 'product-files', formData.title);
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
          {/* ... rest of form remains unchanged */}
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductUploadForm;
