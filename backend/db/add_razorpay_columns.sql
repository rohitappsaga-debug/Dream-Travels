-- Migration to add Razorpay columns to booking tables
USE dream_travellers;

-- 1. bookings_data (Packages)
ALTER TABLE bookings_data 
ADD COLUMN razorpay_order_id VARCHAR(100) DEFAULT NULL,
ADD COLUMN razorpay_payment_id VARCHAR(100) DEFAULT NULL,
ADD COLUMN razorpay_signature TEXT DEFAULT NULL,
ADD COLUMN payment_status ENUM('pending', 'success', 'failed') DEFAULT 'pending';

-- 2. bus_bookings
ALTER TABLE bus_bookings 
ADD COLUMN razorpay_order_id VARCHAR(100) DEFAULT NULL,
ADD COLUMN razorpay_payment_id VARCHAR(100) DEFAULT NULL,
ADD COLUMN razorpay_signature TEXT DEFAULT NULL,
ADD COLUMN payment_status ENUM('pending', 'success', 'failed') DEFAULT 'pending';

-- 3. hotel_bookings
ALTER TABLE hotel_bookings 
ADD COLUMN razorpay_order_id VARCHAR(100) DEFAULT NULL,
ADD COLUMN razorpay_payment_id VARCHAR(100) DEFAULT NULL,
ADD COLUMN razorpay_signature TEXT DEFAULT NULL,
ADD COLUMN payment_status ENUM('pending', 'success', 'failed') DEFAULT 'pending';
