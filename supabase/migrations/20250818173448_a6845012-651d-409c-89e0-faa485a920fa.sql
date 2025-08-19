-- Update storage policies to allow admins and authenticated users to view screenshots
DROP POLICY IF EXISTS "Admins can view all payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their payment screenshots" ON storage.objects;

-- Allow admins to view all payment screenshots
CREATE POLICY "Admins can view all payment screenshots" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (
  bucket_id = 'payment-screenshots' 
  AND (
    is_admin(auth.uid()) 
    OR auth.uid()::text = (string_to_array(name, '/'))[2]
  )
);

-- Also allow public access to payment screenshots for admin panel display
CREATE POLICY "Public access to payment screenshots for admins" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'payment-screenshots');