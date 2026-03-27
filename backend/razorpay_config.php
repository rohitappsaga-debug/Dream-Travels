<?php
/**
 * Razorpay Configuration
 * 
 * Replace these with your actual keys from the Razorpay Dashboard.
 * It's recommended to use environment variables for production.
 */

// Key ID
define('RAZORPAY_KEY_ID', getenv('RAZORPAY_KEY_ID') ?: 'rzp_test_SW91XGo7QItdEM');

// Key Secret
define('RAZORPAY_KEY_SECRET', getenv('RAZORPAY_KEY_SECRET') ?: 'CHlQTipDktwhuLay7aUBjPgX');

// Currency
define('RAZORPAY_CURRENCY', 'INR');

// For development, you can check if these are default and warn
if (RAZORPAY_KEY_ID === 'rzp_test_XXXXXXXXXXXXXX' || RAZORPAY_KEY_SECRET === 'SECRET_XXXXXXXXXXXXXXXXXXXX') {
    // Note: In production, this should be handled more gracefully
    error_log("Razorpay keys are not set! Using dummy values.");
}
?>
