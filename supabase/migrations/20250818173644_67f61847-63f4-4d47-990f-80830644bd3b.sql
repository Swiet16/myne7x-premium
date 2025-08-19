-- Make payment-screenshots bucket public so images can be viewed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'payment-screenshots';

-- Remove existing policies since bucket is now public
DROP POLICY IF EXISTS "Users can upload payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Public access to payment screenshots for admins" ON storage.objects;

-- Create simple policies for public bucket
CREATE POLICY "Anyone can view payment screenshots" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'payment-screenshots');

CREATE POLICY "Authenticated users can upload payment screenshots" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'payment-screenshots'
  AND auth.uid()::text = (string_to_array(name, '/'))[2]
);