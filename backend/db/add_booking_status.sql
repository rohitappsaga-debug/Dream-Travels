-- Add status column to bookings_data (run once on existing DB)
ALTER TABLE bookings_data
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'confirmed'
AFTER package_price;
