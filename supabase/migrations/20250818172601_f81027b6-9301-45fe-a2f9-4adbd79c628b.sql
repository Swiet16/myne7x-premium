-- Fix storage policies for payment screenshots
-- Delete existing policies if they exist
DROP POLICY IF EXISTS "Users can upload payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all payment screenshots" ON storage.objects;

-- Create policies for payment screenshots bucket
CREATE POLICY "Users can upload payment screenshots" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'payment-screenshots' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their payment screenshots" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'payment-screenshots' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all payment screenshots" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'payment-screenshots' 
  AND is_admin(auth.uid())
);