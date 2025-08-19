-- Add multiple feature images support to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS feature_images TEXT[];

-- Add index for better performance on feature images
CREATE INDEX IF NOT EXISTS idx_products_feature_images ON products USING GIN(feature_images);