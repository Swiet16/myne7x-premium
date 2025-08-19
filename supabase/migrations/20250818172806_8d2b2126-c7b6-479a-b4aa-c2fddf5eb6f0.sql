-- Fix payment_requests RLS policies
DROP POLICY IF EXISTS "Users can create their own requests" ON payment_requests;
DROP POLICY IF EXISTS "Users can view their own requests" ON payment_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON payment_requests;

-- Create proper RLS policies for payment_requests
CREATE POLICY "Users can create payment requests" 
ON payment_requests 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own payment requests" 
ON payment_requests 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all payment requests" 
ON payment_requests 
FOR ALL 
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));