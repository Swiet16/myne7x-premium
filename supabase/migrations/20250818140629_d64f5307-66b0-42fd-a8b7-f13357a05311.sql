-- Create storage buckets for payment screenshots and product files
INSERT INTO storage.buckets (id, name, public) VALUES 
('payment-screenshots', 'payment-screenshots', false),
('product-images', 'product-images', true),
('product-files', 'product-files', false);

-- Create storage policies for payment screenshots
CREATE POLICY "Users can upload their payment screenshots" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'payment-screenshots' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own payment screenshots" ON storage.objects
FOR SELECT USING (
  bucket_id = 'payment-screenshots' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all payment screenshots" ON storage.objects
FOR SELECT USING (
  bucket_id = 'payment-screenshots' AND 
  is_admin(auth.uid())
);

-- Create storage policies for product images (public)
CREATE POLICY "Anyone can view product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND 
  is_admin(auth.uid())
);

CREATE POLICY "Admins can update product images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' AND 
  is_admin(auth.uid())
);

CREATE POLICY "Admins can delete product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' AND 
  is_admin(auth.uid())
);

-- Create storage policies for product files (private)
CREATE POLICY "Users can download their purchased products" ON storage.objects
FOR SELECT USING (
  bucket_id = 'product-files' AND (
    is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM user_product_access upa
      JOIN products p ON p.id = upa.product_id
      WHERE upa.user_id = auth.uid() 
      AND p.file_url LIKE '%' || name || '%'
    )
  )
);

CREATE POLICY "Admins can upload product files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-files' AND 
  is_admin(auth.uid())
);

CREATE POLICY "Admins can update product files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-files' AND 
  is_admin(auth.uid())
);

CREATE POLICY "Admins can delete product files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-files' AND 
  is_admin(auth.uid())
);