-- Fix payment_method constraint to allow custom payment methods
-- First, let's see what constraint exists
DO $$
BEGIN
  -- Drop existing check constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_type = 'CHECK' 
    AND table_name = 'payment_requests' 
    AND constraint_name LIKE '%payment_method%'
  ) THEN
    EXECUTE 'ALTER TABLE payment_requests DROP CONSTRAINT ' || (
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE constraint_type = 'CHECK' 
      AND table_name = 'payment_requests' 
      AND constraint_name LIKE '%payment_method%'
      LIMIT 1
    );
  END IF;
  
  -- Add updated constraint that allows both 'nayapay' and 'custom'
  ALTER TABLE payment_requests 
  ADD CONSTRAINT payment_requests_payment_method_check 
  CHECK (payment_method IN ('nayapay', 'custom'));
END $$;

-- Function to send notifications to all users when a new product is uploaded
CREATE OR REPLACE FUNCTION notify_users_new_product()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for all users
  INSERT INTO notifications (user_id, title, message, type)
  SELECT 
    u.id,
    'New Product Available!',
    'A new product "' || NEW.title || '" has been added to the store. Check it out now!',
    'info'
  FROM auth.users u
  INNER JOIN user_roles ur ON u.id = ur.user_id
  WHERE ur.role = 'user';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new product notifications
DROP TRIGGER IF EXISTS trigger_notify_new_product ON products;
CREATE TRIGGER trigger_notify_new_product
  AFTER INSERT ON products
  FOR EACH ROW
  EXECUTE FUNCTION notify_users_new_product();

-- Function to send rejection notifications
CREATE OR REPLACE FUNCTION notify_payment_rejection()
RETURNS TRIGGER AS $$
BEGIN
  -- Only send notification if status changed to rejected
  IF OLD.status != 'rejected' AND NEW.status = 'rejected' THEN
    INSERT INTO notifications (user_id, title, message, type, related_request_id)
    VALUES (
      NEW.user_id,
      'Payment Request Rejected',
      CASE 
        WHEN NEW.admin_notes IS NOT NULL AND NEW.admin_notes != '' 
        THEN 'Your payment request has been rejected. Admin notes: ' || NEW.admin_notes
        ELSE 'Your payment request has been rejected. Please try again with correct payment details.'
      END,
      'error',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for rejection notifications
DROP TRIGGER IF EXISTS trigger_notify_rejection ON payment_requests;
CREATE TRIGGER trigger_notify_rejection
  AFTER UPDATE ON payment_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_payment_rejection();