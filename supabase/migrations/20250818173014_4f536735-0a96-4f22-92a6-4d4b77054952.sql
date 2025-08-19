-- Fix storage policies for payment screenshots with correct path structure
DROP POLICY IF EXISTS "Users can upload payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all payment screenshots" ON storage.objects;

-- Create policies with correct path structure 
CREATE POLICY "Users can upload payment screenshots" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'payment-screenshots'
  AND auth.uid()::text = (string_to_array(name, '/'))[2]
);

CREATE POLICY "Users can view their payment screenshots" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (
  bucket_id = 'payment-screenshots' 
  AND auth.uid()::text = (string_to_array(name, '/'))[2]
);

CREATE POLICY "Admins can view all payment screenshots" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (
  bucket_id = 'payment-screenshots' 
  AND is_admin(auth.uid())
);