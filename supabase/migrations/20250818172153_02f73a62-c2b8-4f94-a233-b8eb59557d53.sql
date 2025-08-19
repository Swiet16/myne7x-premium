-- Enable realtime for payment_requests table
ALTER PUBLICATION supabase_realtime ADD TABLE payment_requests;

-- Set replica identity to full for better realtime updates
ALTER TABLE payment_requests REPLICA IDENTITY FULL;