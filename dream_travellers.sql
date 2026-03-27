-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 27, 2026 at 09:14 AM
-- Server version: 8.4.7
-- PHP Version: 8.5.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dream_travellers`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings_data`
--

CREATE TABLE `bookings_data` (
  `id` int UNSIGNED NOT NULL,
  `customer_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `travel_date` date NOT NULL,
  `passengers` int NOT NULL DEFAULT '1',
  `payment_method` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_details` text COLLATE utf8mb4_unicode_ci,
  `package_id` int UNSIGNED NOT NULL,
  `package_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_price` decimal(10,2) DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'confirmed',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `razorpay_order_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `razorpay_payment_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `razorpay_signature` text COLLATE utf8mb4_unicode_ci,
  `payment_status` enum('pending','success','failed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookings_data`
--

INSERT INTO `bookings_data` (`id`, `customer_name`, `customer_phone`, `user_id`, `travel_date`, `passengers`, `payment_method`, `payment_details`, `package_id`, `package_title`, `package_price`, `status`, `created_at`, `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`, `payment_status`) VALUES
(1, 'Admin', '+919876543210', 1, '2025-04-15', 2, 'credit-card', NULL, 1, 'Goa Beach Holiday', 8500.00, 'confirmed', '2026-03-14 05:07:11', NULL, NULL, NULL, 'pending'),
(2, 'Test User One', '+919876543211', 2, '2025-05-01', 1, 'debit-card', NULL, 2, 'Kashmir Paradise', 22000.00, 'confirmed', '2026-03-14 05:07:11', NULL, NULL, NULL, 'pending'),
(3, 'Test User Two', '+919876543212', 3, '2025-05-20', 4, 'upi', NULL, 3, 'Rajasthan Heritage', 35000.00, 'confirmed', '2026-03-14 05:07:11', NULL, NULL, NULL, 'pending'),
(4, 'Admin', '+919876543213', 1, '2025-06-10', 2, 'credit-card', NULL, 4, 'Kerala Backwaters', 18000.00, 'confirmed', '2026-03-14 05:07:11', NULL, NULL, NULL, 'pending'),
(5, 'Modi in id ut dolor', '+1 (147) 387-3502', 1, '2025-03-14', 2, 'credit-card', NULL, 1, 'Goa Beach Holiday', 8500.00, 'confirmed', '2026-03-14 05:37:49', NULL, NULL, NULL, 'pending'),
(6, 'Repellendus Invento', '+1 (722) 437-5959', 1, '2025-03-14', 6, 'debit-card', NULL, 2, 'Kashmir Paradise', 22000.00, 'confirmed', '2026-03-14 06:44:21', NULL, NULL, NULL, 'pending'),
(7, 'Repellendus Invento', '+1 (722) 437-5959', 1, '2025-03-14', 6, 'debit-card', NULL, 2, 'Kashmir Paradise', 22000.00, 'confirmed', '2026-03-14 06:44:23', NULL, NULL, NULL, 'pending'),
(8, 'Eligendi vel et quae', '+1 (923) 712-8556', 1, '2025-03-14', 10, 'credit-card', NULL, 6, 'Andaman Islands', 45000.00, 'confirmed', '2026-03-14 06:46:05', NULL, NULL, NULL, 'pending'),
(9, 'Eligendi vel et quae', '+1 (923) 712-8556', 1, '2025-03-14', 10, 'credit-card', NULL, 6, 'Andaman Islands', 45000.00, 'confirmed', '2026-03-14 06:46:07', NULL, NULL, NULL, 'pending'),
(10, 'Consequat Nisi temp', '+1 (337) 145-9983', 1, '2026-04-11', 2, 'paypal', NULL, 5, 'Himachal Trek', 12000.00, 'confirmed', '2026-03-14 10:58:32', NULL, NULL, NULL, 'pending'),
(11, 'Sint dolore in esse', '+1 (296) 821-3992', 1, '2026-03-25', 2, 'paypal', NULL, 3, 'Rajasthan Heritage', 35000.00, 'confirmed', '2026-03-16 10:07:11', NULL, NULL, NULL, 'pending'),
(12, 'Sint dolore in esse', '+1 (296) 821-3992', 1, '2026-03-25', 2, 'paypal', NULL, 3, 'Rajasthan Heritage', 35000.00, 'confirmed', '2026-03-16 10:07:13', NULL, NULL, NULL, 'pending'),
(13, 'Est recusandae Erro', '+1 (179) 527-3703', 1, '2026-04-01', 3, 'paypal', NULL, 6, 'Andaman Islands', 45000.00, 'confirmed', '2026-03-18 09:06:46', NULL, NULL, NULL, 'pending'),
(14, 'Officiis rem eaque e', '+1 (587) 821-4455', 1, '2026-04-04', 2, 'paypal', NULL, 3, 'Rajasthan Heritage', 35000.00, 'confirmed', '2026-03-18 09:07:17', NULL, NULL, NULL, 'pending'),
(15, 'Nam a sunt pariatur', '+1 (941) 135-5959', 1, '2026-03-19', 8, 'paypal', NULL, 5, 'Himachal Trek', 12000.00, 'confirmed', '2026-03-18 09:33:56', NULL, NULL, NULL, 'pending'),
(16, 'Nam a sunt pariatur', '+1 (941) 135-5959', 1, '2026-03-19', 8, 'paypal', NULL, 5, 'Himachal Trek', 12000.00, 'confirmed', '2026-03-18 09:33:58', NULL, NULL, NULL, 'pending'),
(17, 'Nam a sunt pariatur', '+1 (941) 135-5959', 1, '2026-03-19', 8, 'paypal', NULL, 5, 'Himachal Trek', 12000.00, 'confirmed', '2026-03-18 09:34:01', NULL, NULL, NULL, 'pending'),
(18, 'Eius perferendis sun', '9090909090', 1, '2026-04-03', 2, 'Pay at Counter', NULL, 6, 'Andaman Islands', 45000.00, 'confirmed', '2026-03-24 11:52:04', NULL, NULL, NULL, 'pending'),
(19, 'Eius perferendis sun', '9090909090', 1, '2026-04-03', 2, 'Pay at Counter', NULL, 6, 'Andaman Islands', 45000.00, 'confirmed', '2026-03-24 11:52:06', NULL, NULL, NULL, 'pending'),
(20, 'Vel amet et asperio', '9090909909', 1, '2026-04-11', 1, 'Pay at Counter', NULL, 2, 'Kashmir Paradise', 22000.00, 'confirmed', '2026-03-24 12:05:21', NULL, NULL, NULL, 'pending'),
(21, 'Iste fugit et et no', '9090909090', 1, '2026-05-29', 2, 'Pay at Counter', NULL, 2, 'Kashmir Paradise', 22000.00, 'confirmed', '2026-03-24 12:07:13', NULL, NULL, NULL, 'pending'),
(22, 'Iste fugit et et no', '9090909090', 1, '2026-05-29', 2, 'Pay at Counter', NULL, 2, 'Kashmir Paradise', 22000.00, 'confirmed', '2026-03-24 12:07:15', NULL, NULL, NULL, 'pending'),
(23, 'Test User One', '9090909090', 2, '2026-04-04', 1, 'Pay at Counter', NULL, 1, 'Goa Beach Holiday', 8500.00, 'confirmed', '2026-03-24 12:10:42', NULL, NULL, NULL, 'pending'),
(24, 'Dolor quam fuga Dol', '9090909090', 1, '2026-04-04', 1, 'credit', '0', 4, '0', 18000.00, 'confirmed', '2026-03-27 04:55:49', NULL, NULL, NULL, 'pending'),
(25, 'Dolor quam fuga Dol', '9090909090', 1, '2026-04-04', 1, 'credit', '0', 4, '0', 18000.00, 'confirmed', '2026-03-27 04:55:51', NULL, NULL, NULL, 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `buses`
--

CREATE TABLE `buses` (
  `id` int UNSIGNED NOT NULL,
  `bus_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bus_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `route_id` int UNSIGNED NOT NULL,
  `total_seats` int DEFAULT '29',
  `status` enum('Active','Inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `buses`
--

INSERT INTO `buses` (`id`, `bus_name`, `bus_code`, `route_id`, `total_seats`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Khodiyar', 'Travels', 1, 29, 'Active', '2026-03-16 04:57:59', '2026-03-16 04:57:59'),
(2, 'Maruti Nandan', 'Travels', 3, 29, 'Active', '2026-03-16 05:20:05', '2026-03-16 05:20:05'),
(3, 'Khodiyar Travels', '5467', 4, 29, 'Active', '2026-03-16 09:59:04', '2026-03-16 09:59:04');

-- --------------------------------------------------------

--
-- Table structure for table `bus_bookings`
--

CREATE TABLE `bus_bookings` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED DEFAULT NULL,
  `bus_id` int UNSIGNED NOT NULL,
  `route_id` int UNSIGNED NOT NULL,
  `seat_number` int NOT NULL,
  `passenger_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `travel_date` date NOT NULL,
  `payment_method` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_details` text COLLATE utf8mb4_unicode_ci,
  `booking_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'Confirmed',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `razorpay_order_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `razorpay_payment_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `razorpay_signature` text COLLATE utf8mb4_unicode_ci,
  `payment_status` enum('pending','success','failed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bus_bookings`
--

INSERT INTO `bus_bookings` (`id`, `user_id`, `bus_id`, `route_id`, `seat_number`, `passenger_name`, `phone`, `email`, `travel_date`, `payment_method`, `payment_details`, `booking_status`, `created_at`, `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`, `payment_status`) VALUES
(1, NULL, 2, 3, 3, 'Libero hic similique', '+1 (843) 228-8001', 'kuhy@mailinator.com', '2026-03-16', NULL, NULL, 'Confirmed', '2026-03-16 05:21:35', NULL, NULL, NULL, 'pending'),
(2, NULL, 2, 3, 4, 'Libero hic similique', '+1 (843) 228-8001', 'kuhy@mailinator.com', '2026-03-16', NULL, NULL, 'Confirmed', '2026-03-16 05:21:35', NULL, NULL, NULL, 'pending'),
(3, NULL, 2, 3, 11, 'Et dolorem ea est m', '+1 (406) 438-2169', 'xybufywuw@mailinator.com', '2026-03-16', NULL, NULL, 'Confirmed', '2026-03-16 06:27:58', NULL, NULL, NULL, 'pending'),
(4, NULL, 2, 3, 12, 'Et dolorem ea est m', '+1 (406) 438-2169', 'xybufywuw@mailinator.com', '2026-03-16', NULL, NULL, 'Confirmed', '2026-03-16 06:27:58', NULL, NULL, NULL, 'pending'),
(5, NULL, 3, 4, 7, 'Nisi eum nesciunt a', '+1 (169) 718-4725', 'reqekyj@mailinator.com', '2026-03-16', NULL, NULL, 'Confirmed', '2026-03-16 10:01:19', NULL, NULL, NULL, 'pending'),
(6, NULL, 3, 4, 8, 'Nisi eum nesciunt a', '+1 (169) 718-4725', 'reqekyj@mailinator.com', '2026-03-16', NULL, NULL, 'Confirmed', '2026-03-16 10:01:19', NULL, NULL, NULL, 'pending'),
(7, NULL, 3, 4, 11, 'Nisi eum nesciunt a', '+1 (169) 718-4725', 'reqekyj@mailinator.com', '2026-03-16', NULL, NULL, 'Confirmed', '2026-03-16 10:01:19', NULL, NULL, NULL, 'pending'),
(8, NULL, 3, 4, 12, 'Nisi eum nesciunt a', '+1 (169) 718-4725', 'reqekyj@mailinator.com', '2026-03-16', NULL, NULL, 'Confirmed', '2026-03-16 10:01:19', NULL, NULL, NULL, 'pending'),
(9, NULL, 3, 4, 7, 'Qui id amet fugit', '9090909090', 'vizupoh@mailinator.com', '2026-03-25', NULL, NULL, 'Confirmed', '2026-03-24 11:52:46', NULL, NULL, NULL, 'pending'),
(10, NULL, 3, 4, 8, 'Qui id amet fugit', '9090909090', 'vizupoh@mailinator.com', '2026-03-25', NULL, NULL, 'Confirmed', '2026-03-24 11:52:46', NULL, NULL, NULL, 'pending'),
(11, NULL, 3, 4, 11, 'Qui id amet fugit', '9090909090', 'vizupoh@mailinator.com', '2026-03-25', NULL, NULL, 'Confirmed', '2026-03-24 11:52:46', NULL, NULL, NULL, 'pending'),
(12, NULL, 3, 4, 12, 'Qui id amet fugit', '9090909090', 'vizupoh@mailinator.com', '2026-03-25', NULL, NULL, 'Confirmed', '2026-03-24 11:52:46', NULL, NULL, NULL, 'pending'),
(13, NULL, 3, 4, 23, 'yhdfhfh', '9090909090', '', '2026-04-10', NULL, NULL, 'Confirmed', '2026-03-24 12:11:16', NULL, NULL, NULL, 'pending'),
(14, NULL, 3, 4, 24, 'yhdfhfh', '9090909090', '', '2026-04-10', NULL, NULL, 'Confirmed', '2026-03-24 12:11:16', NULL, NULL, NULL, 'pending'),
(15, NULL, 3, 4, 27, 'yhdfhfh', '9090909090', '', '2026-04-10', NULL, NULL, 'Confirmed', '2026-03-24 12:11:16', NULL, NULL, NULL, 'pending'),
(16, NULL, 3, 4, 28, 'yhdfhfh', '9090909090', '', '2026-04-10', NULL, NULL, 'Confirmed', '2026-03-24 12:11:16', NULL, NULL, NULL, 'pending'),
(17, NULL, 1, 1, 24, 'Sed ut reprehenderit', '9090909090', 'qylimocy@mailinator.com', '2026-03-28', NULL, NULL, 'Confirmed', '2026-03-27 04:12:31', NULL, NULL, NULL, 'pending'),
(18, NULL, 1, 1, 27, 'Sed ut reprehenderit', '9090909090', 'qylimocy@mailinator.com', '2026-03-28', NULL, NULL, 'Confirmed', '2026-03-27 04:12:31', NULL, NULL, NULL, 'pending'),
(19, NULL, 1, 1, 28, 'Sed ut reprehenderit', '9090909090', 'qylimocy@mailinator.com', '2026-03-28', NULL, NULL, 'Confirmed', '2026-03-27 04:12:31', NULL, NULL, NULL, 'pending'),
(20, NULL, 1, 1, 16, 'Qui eum incididunt v', '9090909090', 'jibu@mailinator.com', '2026-04-04', NULL, NULL, 'Confirmed', '2026-03-27 04:44:46', NULL, NULL, NULL, 'pending'),
(21, NULL, 1, 1, 20, 'Qui eum incididunt v', '9090909090', 'jibu@mailinator.com', '2026-04-04', NULL, NULL, 'Confirmed', '2026-03-27 04:44:46', NULL, NULL, NULL, 'pending'),
(22, NULL, 1, 1, 19, 'Vala Dharmesh', '9090909090', 'dharmesh@mail.com', '2026-04-10', NULL, NULL, 'Confirmed', '2026-03-27 04:45:41', NULL, NULL, NULL, 'pending'),
(23, NULL, 1, 1, 20, 'Vala Dharmesh', '9090909090', 'dharmesh@mail.com', '2026-04-10', NULL, NULL, 'Confirmed', '2026-03-27 04:45:41', NULL, NULL, NULL, 'pending'),
(24, 0, 1, 1, 8, 'Ea eaque nulla labor', '9090909090', 'tulebor@mailinator.com', '2026-03-27', 'credit', '{\"cardNumber\":\"0605 0509 6505 0590\",\"expiry\":\"09/26\",\"cvv\":\"534\"}', 'Confirmed', '2026-03-27 05:01:20', NULL, NULL, NULL, 'pending'),
(25, 0, 1, 1, 12, 'Ea eaque nulla labor', '9090909090', 'tulebor@mailinator.com', '2026-03-27', 'credit', '{\"cardNumber\":\"0605 0509 6505 0590\",\"expiry\":\"09/26\",\"cvv\":\"534\"}', 'Confirmed', '2026-03-27 05:01:20', NULL, NULL, NULL, 'pending'),
(26, 1, 1, 1, 14, 'Quisquam culpa quasi', '9090909090', 'zarog@mailinator.com', '2026-03-27', 'razorpay', NULL, 'Confirmed', '2026-03-27 06:15:11', 'order_SW9D8Yxk8rYACJ', 'pay_SW9DcH0jEw34yi', 'c3b2ebb53f8f6bca105f5289da17f84464de01e87fd246e8906f77335a6d2798', 'success'),
(27, 1, 1, 1, 17, 'Laboris ea vel enim ', '9090909099', 'lewu@mailinator.com', '2026-03-27', 'razorpay', NULL, 'Confirmed', '2026-03-27 06:30:29', 'order_SW9TJ3vTWdEgJL', 'pay_SW9TOs0HC1mifi', '0e925d790b2925ccc1303d1de531d4478b7f52393e59959f0f8675b8a1b9067a', 'success'),
(28, 2, 1, 1, 22, 'Non ex iste quos acc', '5050505050', 'xacolibyca@mailinator.com', '2026-03-27', 'razorpay', NULL, 'Confirmed', '2026-03-27 06:34:36', 'order_SW9XdxUn9o2DM9', 'pay_SW9XnMSYN1vkNo', '4a30c0575de3090d43b0e57a4f62ead2970b32f08150ea779867ab0a6459d5a2', 'success');

-- --------------------------------------------------------

--
-- Table structure for table `bus_seats`
--

CREATE TABLE `bus_seats` (
  `id` int UNSIGNED NOT NULL,
  `bus_id` int UNSIGNED NOT NULL,
  `seat_number` int NOT NULL,
  `seat_status` enum('Available','Booked','Reserved') COLLATE utf8mb4_unicode_ci DEFAULT 'Available',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bus_seats`
--

INSERT INTO `bus_seats` (`id`, `bus_id`, `seat_number`, `seat_status`, `created_at`) VALUES
(1, 1, 1, 'Available', '2026-03-16 04:57:59'),
(2, 1, 2, 'Available', '2026-03-16 04:57:59'),
(3, 1, 3, 'Available', '2026-03-16 04:57:59'),
(4, 1, 4, 'Available', '2026-03-16 04:57:59'),
(5, 1, 5, 'Available', '2026-03-16 04:57:59'),
(6, 1, 6, 'Available', '2026-03-16 04:57:59'),
(7, 1, 7, 'Available', '2026-03-16 04:57:59'),
(8, 1, 8, 'Available', '2026-03-16 04:57:59'),
(9, 1, 9, 'Available', '2026-03-16 04:57:59'),
(10, 1, 10, 'Available', '2026-03-16 04:57:59'),
(11, 1, 11, 'Available', '2026-03-16 04:57:59'),
(12, 1, 12, 'Available', '2026-03-16 04:57:59'),
(13, 1, 13, 'Available', '2026-03-16 04:57:59'),
(14, 1, 14, 'Available', '2026-03-16 04:57:59'),
(15, 1, 15, 'Available', '2026-03-16 04:57:59'),
(16, 1, 16, 'Available', '2026-03-16 04:57:59'),
(17, 1, 17, 'Available', '2026-03-16 04:57:59'),
(18, 1, 18, 'Available', '2026-03-16 04:57:59'),
(19, 1, 19, 'Available', '2026-03-16 04:57:59'),
(20, 1, 20, 'Available', '2026-03-16 04:57:59'),
(21, 1, 21, 'Available', '2026-03-16 04:57:59'),
(22, 1, 22, 'Available', '2026-03-16 04:57:59'),
(23, 1, 23, 'Available', '2026-03-16 04:57:59'),
(24, 1, 24, 'Available', '2026-03-16 04:57:59'),
(25, 1, 25, 'Available', '2026-03-16 04:57:59'),
(26, 1, 26, 'Available', '2026-03-16 04:57:59'),
(27, 1, 27, 'Available', '2026-03-16 04:57:59'),
(28, 1, 28, 'Available', '2026-03-16 04:57:59'),
(29, 1, 29, 'Available', '2026-03-16 04:57:59'),
(30, 2, 1, 'Available', '2026-03-16 05:20:05'),
(31, 2, 2, 'Available', '2026-03-16 05:20:05'),
(32, 2, 3, 'Available', '2026-03-16 05:20:05'),
(33, 2, 4, 'Available', '2026-03-16 05:20:05'),
(34, 2, 5, 'Available', '2026-03-16 05:20:05'),
(35, 2, 6, 'Available', '2026-03-16 05:20:05'),
(36, 2, 7, 'Available', '2026-03-16 05:20:05'),
(37, 2, 8, 'Available', '2026-03-16 05:20:05'),
(38, 2, 9, 'Available', '2026-03-16 05:20:05'),
(39, 2, 10, 'Available', '2026-03-16 05:20:05'),
(40, 2, 11, 'Available', '2026-03-16 05:20:05'),
(41, 2, 12, 'Available', '2026-03-16 05:20:05'),
(42, 2, 13, 'Available', '2026-03-16 05:20:05'),
(43, 2, 14, 'Available', '2026-03-16 05:20:05'),
(44, 2, 15, 'Available', '2026-03-16 05:20:05'),
(45, 2, 16, 'Available', '2026-03-16 05:20:05'),
(46, 2, 17, 'Available', '2026-03-16 05:20:05'),
(47, 2, 18, 'Available', '2026-03-16 05:20:05'),
(48, 2, 19, 'Available', '2026-03-16 05:20:05'),
(49, 2, 20, 'Available', '2026-03-16 05:20:05'),
(50, 2, 21, 'Available', '2026-03-16 05:20:05'),
(51, 2, 22, 'Available', '2026-03-16 05:20:05'),
(52, 2, 23, 'Available', '2026-03-16 05:20:05'),
(53, 2, 24, 'Available', '2026-03-16 05:20:05'),
(54, 2, 25, 'Available', '2026-03-16 05:20:05'),
(55, 2, 26, 'Available', '2026-03-16 05:20:05'),
(56, 2, 27, 'Available', '2026-03-16 05:20:05'),
(57, 2, 28, 'Available', '2026-03-16 05:20:05'),
(58, 2, 29, 'Available', '2026-03-16 05:20:05'),
(59, 3, 1, 'Available', '2026-03-16 09:59:04'),
(60, 3, 2, 'Available', '2026-03-16 09:59:04'),
(61, 3, 3, 'Available', '2026-03-16 09:59:04'),
(62, 3, 4, 'Available', '2026-03-16 09:59:04'),
(63, 3, 5, 'Available', '2026-03-16 09:59:04'),
(64, 3, 6, 'Available', '2026-03-16 09:59:04'),
(65, 3, 7, 'Available', '2026-03-16 09:59:04'),
(66, 3, 8, 'Available', '2026-03-16 09:59:04'),
(67, 3, 9, 'Available', '2026-03-16 09:59:04'),
(68, 3, 10, 'Available', '2026-03-16 09:59:04'),
(69, 3, 11, 'Available', '2026-03-16 09:59:04'),
(70, 3, 12, 'Available', '2026-03-16 09:59:04'),
(71, 3, 13, 'Available', '2026-03-16 09:59:04'),
(72, 3, 14, 'Available', '2026-03-16 09:59:04'),
(73, 3, 15, 'Available', '2026-03-16 09:59:04'),
(74, 3, 16, 'Available', '2026-03-16 09:59:04'),
(75, 3, 17, 'Available', '2026-03-16 09:59:04'),
(76, 3, 18, 'Available', '2026-03-16 09:59:04'),
(77, 3, 19, 'Available', '2026-03-16 09:59:04'),
(78, 3, 20, 'Available', '2026-03-16 09:59:04'),
(79, 3, 21, 'Available', '2026-03-16 09:59:04'),
(80, 3, 22, 'Available', '2026-03-16 09:59:04'),
(81, 3, 23, 'Available', '2026-03-16 09:59:04'),
(82, 3, 24, 'Available', '2026-03-16 09:59:04'),
(83, 3, 25, 'Available', '2026-03-16 09:59:04'),
(84, 3, 26, 'Available', '2026-03-16 09:59:04'),
(85, 3, 27, 'Available', '2026-03-16 09:59:04'),
(86, 3, 28, 'Available', '2026-03-16 09:59:04'),
(87, 3, 29, 'Available', '2026-03-16 09:59:04');

-- --------------------------------------------------------

--
-- Table structure for table `gallery`
--

CREATE TABLE `gallery` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gallery`
--

INSERT INTO `gallery` (`id`, `title`, `image`, `created_at`) VALUES
(1, 'Santorini', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', '2026-03-18 12:22:04'),
(2, 'London', 'https://businesstraveldestinations.com/wp-content/uploads/2019/04/London-Skyline.jpg', '2026-03-18 12:22:04'),
(3, 'Dubai', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu-lkRSNMApqSaTXWgHKx5okx94MkrR8prew&s', '2026-03-18 12:22:04'),
(4, 'Rome', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJBnVtbpRc7UGZZRDdyUdYg7OUbdreTVuXtA&s', '2026-03-18 12:22:04'),
(5, 'Thailand', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvY8GdmFb3-Ao0NfSnqjAbAbRp10WMx7qRcg&s', '2026-03-18 12:22:04'),
(6, 'India', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSXesvQ9KeWTbYQkKomXK4JEKcVEbJ1NFPvg&s', '2026-03-18 12:22:04'),
(7, 'New York', 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bmV3JTIweW9yayUyMGNpdHklMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D', '2026-03-18 12:22:04'),
(8, 'Chicago', 'https://wallpapers.com/images/hd/chicago-river-and-street-lights-city-background-38mjhv2vf5wujbp0.jpg', '2026-03-18 12:22:04'),
(9, 'UK', 'https://plus.unsplash.com/premium_photo-1661962726504-fa8f464a1bb8?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dW5pdGVkJTIwa2luZ2RvbXxlbnwwfHwwfHx8MA%3D%3D', '2026-03-18 12:22:04');

-- --------------------------------------------------------

--
-- Table structure for table `hotels`
--

CREATE TABLE `hotels` (
  `id` int NOT NULL,
  `hotel_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` float DEFAULT '4',
  `price_per_night` decimal(10,2) DEFAULT NULL,
  `total_rooms` int DEFAULT NULL,
  `available_rooms` int DEFAULT NULL,
  `image` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `amenities` text COLLATE utf8mb4_unicode_ci,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hotels`
--

INSERT INTO `hotels` (`id`, `hotel_name`, `city`, `location`, `rating`, `price_per_night`, `total_rooms`, `available_rooms`, `image`, `description`, `amenities`, `status`, `created_at`) VALUES
(1, 'Delhi Heritage Inn', 'Delhi', 'Near Airport, Delhi', 4.3, 5649.00, 40, 40, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at Delhi Heritage Inn, located in the heart of Delhi. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:49:12'),
(2, 'Delhi City Stay', 'Delhi', 'City Center, Delhi', 3.9, 5202.00, 22, 22, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at Delhi City Stay, located in the heart of Delhi. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:49:12'),
(3, 'Delhi Royal Residency', 'Delhi', 'Lake Front, Delhi', 4, 2631.00, 21, 21, 'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at Delhi Royal Residency, located in the heart of Delhi. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:49:12'),
(4, 'Delhi Vista Residency', 'Delhi', 'MG Road, Delhi', 3.7, 4851.00, 26, 26, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at Delhi Vista Residency, located in the heart of Delhi. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:49:12'),
(5, 'Delhi Palace Hotel', 'Delhi', 'Lake Front, Delhi', 4.4, 2989.00, 20, 20, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at Delhi Palace Hotel, located in the heart of Delhi. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:49:12'),
(6, 'Delhi Elegance Hotel', 'Delhi', 'Heritage Zone, Delhi', 3.7, 5340.00, 21, 21, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at Delhi Elegance Hotel, located in the heart of Delhi. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:49:12'),
(7, 'surat City Stay', 'surat', 'Business District, surat', 3.5, 4137.00, 40, 40, 'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at surat City Stay, located in the heart of surat. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:55:40'),
(8, 'surat Vista Residency', 'surat', 'Station Road, surat', 3.6, 4247.00, 26, 26, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at surat Vista Residency, located in the heart of surat. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:55:40'),
(9, 'surat Heritage Inn', 'surat', 'MG Road, surat', 4, 4247.00, 36, 36, 'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at surat Heritage Inn, located in the heart of surat. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:55:40'),
(10, 'surat Royal Residency', 'surat', 'MG Road, surat', 3.7, 1916.00, 26, 26, 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at surat Royal Residency, located in the heart of surat. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:55:40'),
(11, 'surat Comfort Inn', 'surat', 'Station Road, surat', 4.4, 5929.00, 27, 27, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at surat Comfort Inn, located in the heart of surat. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:55:40'),
(12, 'surat Grand Hotel', 'surat', 'Station Road, surat', 4, 5193.00, 28, 28, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at surat Grand Hotel, located in the heart of surat. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:55:40'),
(13, 'surat Elegance Hotel', 'surat', 'MG Road, surat', 4.1, 2231.00, 23, 23, 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at surat Elegance Hotel, located in the heart of surat. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:55:40'),
(14, 'rajkot Vista Residency', 'rajkot', 'Business District, rajkot', 3.6, 3248.00, 37, 37, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at rajkot Vista Residency, located in the heart of rajkot. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:59:57'),
(15, 'rajkot Elegance Hotel', 'rajkot', 'Business District, rajkot', 3.7, 5866.00, 40, 40, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at rajkot Elegance Hotel, located in the heart of rajkot. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:59:57'),
(16, 'rajkot Comfort Inn', 'rajkot', 'MG Road, rajkot', 3.9, 4001.00, 25, 25, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at rajkot Comfort Inn, located in the heart of rajkot. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:59:57'),
(17, 'rajkot City Stay', 'rajkot', 'Hill View Area, rajkot', 3.5, 4427.00, 33, 33, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at rajkot City Stay, located in the heart of rajkot. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:59:57'),
(18, 'rajkot Heritage Inn', 'rajkot', 'Station Road, rajkot', 4, 2187.00, 34, 34, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at rajkot Heritage Inn, located in the heart of rajkot. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:59:57'),
(19, 'rajkot Royal Residency', 'rajkot', 'Heritage Zone, rajkot', 4.1, 3026.00, 20, 20, 'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at rajkot Royal Residency, located in the heart of rajkot. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:59:57'),
(20, 'rajkot Grand Hotel', 'rajkot', 'Station Road, rajkot', 3.9, 2085.00, 21, 21, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at rajkot Grand Hotel, located in the heart of rajkot. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 06:59:57'),
(21, 'goa Royal Residency', 'goa', 'Near Airport, goa', 3.9, 3884.00, 34, 34, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at goa Royal Residency, located in the heart of goa. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 07:04:21'),
(22, 'goa Vista Residency', 'goa', 'Station Road, goa', 4, 4804.00, 26, 26, 'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at goa Vista Residency, located in the heart of goa. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 07:04:21'),
(23, 'goa Comfort Inn', 'goa', 'Near Airport, goa', 4.5, 2764.00, 34, 34, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at goa Comfort Inn, located in the heart of goa. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 07:04:21'),
(24, 'goa Heritage Inn', 'goa', 'City Center, goa', 3.8, 2996.00, 22, 22, 'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at goa Heritage Inn, located in the heart of goa. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 07:04:21'),
(25, 'goa Grand Hotel', 'goa', 'Business District, goa', 4, 3422.00, 24, 24, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at goa Grand Hotel, located in the heart of goa. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 07:04:21'),
(26, 'dwarka Comfort Inn', 'dwarka', 'City Center, dwarka', 4.1, 3223.00, 20, 20, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at dwarka Comfort Inn, located in the heart of dwarka. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 07:21:30'),
(27, 'dwarka Grand Hotel', 'dwarka', 'Heritage Zone, dwarka', 3.6, 1978.00, 29, 29, 'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at dwarka Grand Hotel, located in the heart of dwarka. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 07:21:30'),
(28, 'dwarka City Stay', 'dwarka', 'Near Airport, dwarka', 4.5, 3281.00, 28, 28, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at dwarka City Stay, located in the heart of dwarka. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 07:21:30'),
(29, 'dwarka Royal Residency', 'dwarka', 'Hill View Area, dwarka', 3.5, 3223.00, 34, 34, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at dwarka Royal Residency, located in the heart of dwarka. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 07:21:30'),
(30, 'dwarka Vista Residency', 'dwarka', 'Business District, dwarka', 3.5, 4049.00, 25, 25, 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at dwarka Vista Residency, located in the heart of dwarka. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-16 07:21:30'),
(31, 'mumbai City Stay', 'mumbai', 'Heritage Zone, mumbai', 3.5, 4371.00, 23, 23, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at mumbai City Stay, located in the heart of mumbai. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-18 09:58:01'),
(32, 'mumbai Comfort Inn', 'mumbai', 'Lake Front, mumbai', 3.8, 2479.00, 20, 20, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at mumbai Comfort Inn, located in the heart of mumbai. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-18 09:58:01'),
(33, 'mumbai Heritage Inn', 'mumbai', 'Business District, mumbai', 4.4, 2857.00, 32, 32, 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at mumbai Heritage Inn, located in the heart of mumbai. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-18 09:58:01'),
(34, 'mumbai Vista Residency', 'mumbai', 'Hill View Area, mumbai', 4.4, 5848.00, 26, 26, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at mumbai Vista Residency, located in the heart of mumbai. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-18 09:58:01'),
(35, 'mumbai Elegance Hotel', 'mumbai', 'City Center, mumbai', 3.7, 2966.00, 25, 25, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at mumbai Elegance Hotel, located in the heart of mumbai. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-18 09:58:01'),
(36, 'mumbai Palace Hotel', 'mumbai', 'Near Airport, mumbai', 3.6, 5167.00, 39, 39, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at mumbai Palace Hotel, located in the heart of mumbai. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-18 09:58:01'),
(37, 'mumbai Grand Hotel', 'mumbai', 'Station Road, mumbai', 4.5, 3218.00, 28, 28, 'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at mumbai Grand Hotel, located in the heart of mumbai. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-18 09:58:01'),
(38, 'Dolore officiis nihi Vista Residency', 'Dolore officiis nihi', 'MG Road, Dolore officiis nihi', 3.8, 3160.00, 28, 28, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at Dolore officiis nihi Vista Residency, located in the heart of Dolore officiis nihi. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-24 11:55:17'),
(39, 'Dolore officiis nihi Comfort Inn', 'Dolore officiis nihi', 'Business District, Dolore officiis nihi', 4.4, 4691.00, 31, 31, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at Dolore officiis nihi Comfort Inn, located in the heart of Dolore officiis nihi. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-24 11:55:17'),
(40, 'Dolore officiis nihi Royal Residency', 'Dolore officiis nihi', 'Lake Front, Dolore officiis nihi', 4.3, 3876.00, 37, 37, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at Dolore officiis nihi Royal Residency, located in the heart of Dolore officiis nihi. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-24 11:55:17'),
(41, 'Dolore officiis nihi City Stay', 'Dolore officiis nihi', 'Near Airport, Dolore officiis nihi', 3.5, 4404.00, 29, 29, 'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at Dolore officiis nihi City Stay, located in the heart of Dolore officiis nihi. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-24 11:55:17'),
(42, 'Dolore officiis nihi Elegance Hotel', 'Dolore officiis nihi', 'Heritage Zone, Dolore officiis nihi', 3.6, 5775.00, 33, 33, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800', 'Experience luxury and comfort at Dolore officiis nihi Elegance Hotel, located in the heart of Dolore officiis nihi. Our hotel offers world-class amenities and exceptional service.', 'WiFi, AC, Parking, Restaurant, Swimming Pool, Gym', 'active', '2026-03-24 11:55:17');

-- --------------------------------------------------------

--
-- Table structure for table `hotel_bookings`
--

CREATE TABLE `hotel_bookings` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `hotel_id` int NOT NULL,
  `room_id` int NOT NULL,
  `guest_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `num_guests` int DEFAULT '1',
  `num_rooms` int DEFAULT '1',
  `total_price` decimal(10,2) NOT NULL,
  `payment_method` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_details` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'Confirmed',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `razorpay_order_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `razorpay_payment_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `razorpay_signature` text COLLATE utf8mb4_unicode_ci,
  `payment_status` enum('pending','success','failed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hotel_bookings`
--

INSERT INTO `hotel_bookings` (`id`, `user_id`, `hotel_id`, `room_id`, `guest_name`, `phone`, `email`, `check_in`, `check_out`, `num_guests`, `num_rooms`, `total_price`, `payment_method`, `payment_details`, `status`, `created_at`, `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`, `payment_status`) VALUES
(1, NULL, 10, 30, 'Soluta rem in tempor', 'Aut doloremque quia ', 'gehaqorena@mailinator.com', '2026-03-16', '2026-03-17', 2, 1, 4790.00, NULL, NULL, 'Confirmed', '2026-03-16 06:59:11', NULL, NULL, NULL, 'pending'),
(2, NULL, 28, 83, 'Adipisci ut nulla re', 'Deserunt sint accusa', 'sevyfoci@mailinator.com', '2026-03-16', '2026-03-17', 2, 1, 4921.50, NULL, NULL, 'Confirmed', '2026-03-16 07:21:47', NULL, NULL, NULL, 'pending'),
(3, NULL, 7, 20, 'Error fugiat quia ev', '9090909090', 'lyjicuco@mailinator.com', '2026-03-24', '2026-03-25', 2, 1, 6205.50, NULL, NULL, 'Confirmed', '2026-03-24 11:59:22', NULL, NULL, NULL, 'pending'),
(4, NULL, 7, 20, 'efwershyA', '6906091601', 'fswtedrfbd@gmail.com', '2026-03-24', '2026-03-25', 2, 1, 6205.50, NULL, NULL, 'Confirmed', '2026-03-24 12:11:54', NULL, NULL, NULL, 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `hotel_rooms`
--

CREATE TABLE `hotel_rooms` (
  `id` int NOT NULL,
  `hotel_id` int NOT NULL,
  `room_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_per_night` decimal(10,2) NOT NULL,
  `total_rooms` int NOT NULL,
  `available_rooms` int NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` text COLLATE utf8mb4_unicode_ci
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hotel_rooms`
--

INSERT INTO `hotel_rooms` (`id`, `hotel_id`, `room_type`, `price_per_night`, `total_rooms`, `available_rooms`, `description`, `image`) VALUES
(1, 1, 'Standard', 5649.00, 16, 16, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(2, 1, 'Deluxe', 8473.50, 16, 16, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(3, 1, 'Suite', 14122.50, 8, 8, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(4, 2, 'Standard', 5202.00, 8, 8, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(5, 2, 'Deluxe', 7803.00, 8, 8, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(6, 2, 'Suite', 13005.00, 4, 4, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(7, 3, 'Standard', 2631.00, 8, 8, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(8, 3, 'Deluxe', 3946.50, 8, 8, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(9, 3, 'Suite', 6577.50, 4, 4, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(10, 4, 'Standard', 4851.00, 10, 10, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(11, 4, 'Deluxe', 7276.50, 10, 10, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(12, 4, 'Suite', 12127.50, 5, 5, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(13, 5, 'Standard', 2989.00, 8, 8, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(14, 5, 'Deluxe', 4483.50, 8, 8, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(15, 5, 'Suite', 7472.50, 4, 4, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(16, 6, 'Standard', 5340.00, 8, 8, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(17, 6, 'Deluxe', 8010.00, 8, 8, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(18, 6, 'Suite', 13350.00, 4, 4, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(19, 7, 'Standard', 4137.00, 16, 16, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(20, 7, 'Deluxe', 6205.50, 16, 16, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(21, 7, 'Suite', 10342.50, 8, 8, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(22, 8, 'Standard', 4247.00, 10, 10, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(23, 8, 'Deluxe', 6370.50, 10, 10, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(24, 8, 'Suite', 10617.50, 5, 5, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(25, 9, 'Standard', 4247.00, 14, 14, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(26, 9, 'Deluxe', 6370.50, 14, 14, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(27, 9, 'Suite', 10617.50, 7, 7, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(28, 10, 'Standard', 1916.00, 10, 10, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(29, 10, 'Deluxe', 2874.00, 10, 10, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(30, 10, 'Suite', 4790.00, 5, 5, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(31, 11, 'Standard', 5929.00, 10, 10, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(32, 11, 'Deluxe', 8893.50, 10, 10, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(33, 11, 'Suite', 14822.50, 5, 5, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(34, 12, 'Standard', 5193.00, 11, 11, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(35, 12, 'Deluxe', 7789.50, 11, 11, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(36, 12, 'Suite', 12982.50, 5, 5, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(37, 13, 'Standard', 2231.00, 9, 9, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(38, 13, 'Deluxe', 3346.50, 9, 9, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(39, 13, 'Suite', 5577.50, 4, 4, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(40, 14, 'Standard', 3248.00, 14, 14, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(41, 14, 'Deluxe', 4872.00, 14, 14, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(42, 14, 'Suite', 8120.00, 7, 7, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(43, 15, 'Standard', 5866.00, 16, 16, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(44, 15, 'Deluxe', 8799.00, 16, 16, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(45, 15, 'Suite', 14665.00, 8, 8, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(46, 16, 'Standard', 4001.00, 10, 10, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(47, 16, 'Deluxe', 6001.50, 10, 10, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(48, 16, 'Suite', 10002.50, 5, 5, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(49, 17, 'Standard', 4427.00, 13, 13, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(50, 17, 'Deluxe', 6640.50, 13, 13, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(51, 17, 'Suite', 11067.50, 6, 6, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(52, 18, 'Standard', 2187.00, 13, 13, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(53, 18, 'Deluxe', 3280.50, 13, 13, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(54, 18, 'Suite', 5467.50, 6, 6, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(55, 19, 'Standard', 3026.00, 8, 8, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(56, 19, 'Deluxe', 4539.00, 8, 8, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(57, 19, 'Suite', 7565.00, 4, 4, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(58, 20, 'Standard', 2085.00, 8, 8, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(59, 20, 'Deluxe', 3127.50, 8, 8, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(60, 20, 'Suite', 5212.50, 4, 4, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(61, 21, 'Standard', 3884.00, 13, 13, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(62, 21, 'Deluxe', 5826.00, 13, 13, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(63, 21, 'Suite', 9710.00, 6, 6, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(64, 22, 'Standard', 4804.00, 10, 10, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(65, 22, 'Deluxe', 7206.00, 10, 10, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(66, 22, 'Suite', 12010.00, 5, 5, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(67, 23, 'Standard', 2764.00, 13, 13, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(68, 23, 'Deluxe', 4146.00, 13, 13, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(69, 23, 'Suite', 6910.00, 6, 6, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(70, 24, 'Standard', 2996.00, 8, 8, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(71, 24, 'Deluxe', 4494.00, 8, 8, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(72, 24, 'Suite', 7490.00, 4, 4, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(73, 25, 'Standard', 3422.00, 9, 9, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(74, 25, 'Deluxe', 5133.00, 9, 9, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(75, 25, 'Suite', 8555.00, 4, 4, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(76, 26, 'Standard', 3223.00, 8, 8, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(77, 26, 'Deluxe', 4834.50, 8, 8, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(78, 26, 'Suite', 8057.50, 4, 4, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(79, 27, 'Standard', 1978.00, 11, 11, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(80, 27, 'Deluxe', 2967.00, 11, 11, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(81, 27, 'Suite', 4945.00, 5, 5, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(82, 28, 'Standard', 3281.00, 11, 11, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(83, 28, 'Deluxe', 4921.50, 11, 11, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(84, 28, 'Suite', 8202.50, 5, 5, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(85, 29, 'Standard', 3223.00, 13, 13, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(86, 29, 'Deluxe', 4834.50, 13, 13, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(87, 29, 'Suite', 8057.50, 6, 6, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(88, 30, 'Standard', 4049.00, 10, 10, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(89, 30, 'Deluxe', 6073.50, 10, 10, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(90, 30, 'Suite', 10122.50, 5, 5, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(91, 31, 'Standard', 4371.00, 9, 9, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(92, 31, 'Deluxe', 6556.50, 9, 9, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(93, 31, 'Suite', 10927.50, 4, 4, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(94, 32, 'Standard', 2479.00, 8, 8, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(95, 32, 'Deluxe', 3718.50, 8, 8, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(96, 32, 'Suite', 6197.50, 4, 4, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(97, 33, 'Standard', 2857.00, 12, 12, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(98, 33, 'Deluxe', 4285.50, 12, 12, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(99, 33, 'Suite', 7142.50, 6, 6, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(100, 34, 'Standard', 5848.00, 10, 10, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(101, 34, 'Deluxe', 8772.00, 10, 10, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(102, 34, 'Suite', 14620.00, 5, 5, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(103, 35, 'Standard', 2966.00, 10, 10, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(104, 35, 'Deluxe', 4449.00, 10, 10, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(105, 35, 'Suite', 7415.00, 5, 5, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(106, 36, 'Standard', 5167.00, 15, 15, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(107, 36, 'Deluxe', 7750.50, 15, 15, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(108, 36, 'Suite', 12917.50, 7, 7, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(109, 37, 'Standard', 3218.00, 11, 11, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(110, 37, 'Deluxe', 4827.00, 11, 11, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(111, 37, 'Suite', 8045.00, 5, 5, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(112, 38, 'Standard', 3160.00, 11, 11, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(113, 38, 'Deluxe', 4740.00, 11, 11, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(114, 38, 'Suite', 7900.00, 5, 5, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(115, 39, 'Standard', 4691.00, 12, 12, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(116, 39, 'Deluxe', 7036.50, 12, 12, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800'),
(117, 39, 'Suite', 11727.50, 6, 6, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(118, 40, 'Standard', 3876.00, 14, 14, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(119, 40, 'Deluxe', 5814.00, 14, 14, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(120, 40, 'Suite', 9690.00, 7, 7, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(121, 41, 'Standard', 4404.00, 11, 11, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(122, 41, 'Deluxe', 6606.00, 11, 11, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
(123, 41, 'Suite', 11010.00, 5, 5, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'),
(124, 42, 'Standard', 5775.00, 13, 13, 'Spacious Standard room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
(125, 42, 'Deluxe', 8662.50, 13, 13, 'Spacious Deluxe room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'),
(126, 42, 'Suite', 14437.50, 6, 6, 'Spacious Suite room with modern decor and premium amenities.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800');

-- --------------------------------------------------------

--
-- Table structure for table `packages_data`
--

CREATE TABLE `packages_data` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `duration_days` tinyint UNSIGNED NOT NULL DEFAULT '1',
  `nights` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `start_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `main_transport` enum('bus','flight','train','cab','cruise','mixed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'mixed',
  `highlights` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `inclusions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `exclusions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `packages_data`
--

INSERT INTO `packages_data` (`id`, `title`, `description`, `price`, `duration_days`, `nights`, `start_location`, `end_location`, `main_transport`, `highlights`, `inclusions`, `exclusions`, `image`, `created_at`) VALUES
(1, 'Goa Beach Holiday', 'Relax on sandy beaches and enjoy water sports. 3 nights, breakfast included.', 8500.00, 4, 3, 'Your City', 'Goa', 'mixed', NULL, NULL, NULL, '/assets/packages/goa.png', '2026-03-14 05:07:11'),
(2, 'Kashmir Paradise', 'Houseboat stay in Dal Lake, Srinagar. 4 days with shikara ride and gardens.', 22000.00, 4, 3, 'Your City', 'Kashmir', 'mixed', NULL, NULL, NULL, '/assets/packages/kashmir.png', '2026-03-14 05:07:11'),
(3, 'Rajasthan Heritage', 'Jaipur, Udaipur, Jodhpur. Forts, palaces and cultural shows. 5 nights.', 35000.00, 6, 5, 'Your City', 'Rajasthan', 'mixed', NULL, NULL, NULL, '/assets/packages/rajasthan.png', '2026-03-14 05:07:11'),
(4, 'Kerala Backwaters', 'Houseboat in Alleppey, tea gardens in Munnar. 4 days.', 18000.00, 4, 3, 'Your City', 'Kerala', 'mixed', NULL, NULL, NULL, '/assets/packages/kerala.png', '2026-03-14 05:07:11'),
(5, 'Himachal Trek', 'Manali to Solang Valley. 3 days trekking and camping.', 12000.00, 3, 2, 'Your City', 'Himachal', 'mixed', NULL, NULL, NULL, '/assets/packages/himachal.png', '2026-03-14 05:07:11'),
(6, 'Andaman Islands', 'Port Blair & Havelock. Snorkelling and beach stay. 5 nights.', 45000.00, 6, 5, 'Your City', 'Andaman', 'mixed', NULL, NULL, NULL, '/assets/packages/andaman.png', '2026-03-14 05:07:11');

-- --------------------------------------------------------

--
-- Table structure for table `package_itineraries`
--

CREATE TABLE `package_itineraries` (
  `id` int UNSIGNED NOT NULL,
  `package_id` int UNSIGNED NOT NULL,
  `day_number` tinyint UNSIGNED NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `transport_mode` enum('none','bus','flight','train','cab','ferry','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  `meals` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stay_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `package_itineraries`
--

INSERT INTO `package_itineraries` (`id`, `package_id`, `day_number`, `title`, `description`, `transport_mode`, `meals`, `stay_location`) VALUES
(1, 1, 1, 'Arrival & Check-in', 'Arrive at destination, transfer to hotel and relax.', 'none', 'Dinner', 'Goa Beach Holiday'),
(2, 1, 2, 'Sightseeing & Activities', 'Enjoy local sightseeing and optional activities.', 'bus', 'Breakfast', 'Goa Beach Holiday'),
(3, 2, 1, 'Arrival & Check-in', 'Arrive at destination, transfer to hotel and relax.', 'none', 'Dinner', 'Kashmir Paradise'),
(4, 2, 2, 'Sightseeing & Activities', 'Enjoy local sightseeing and optional activities.', 'bus', 'Breakfast', 'Kashmir Paradise'),
(5, 3, 1, 'Arrival & Check-in', 'Arrive at destination, transfer to hotel and relax.', 'none', 'Dinner', 'Rajasthan Heritage'),
(6, 3, 2, 'Sightseeing & Activities', 'Enjoy local sightseeing and optional activities.', 'bus', 'Breakfast', 'Rajasthan Heritage'),
(7, 4, 1, 'Arrival & Check-in', 'Arrive at destination, transfer to hotel and relax.', 'none', 'Dinner', 'Kerala Backwaters'),
(8, 4, 2, 'Sightseeing & Activities', 'Enjoy local sightseeing and optional activities.', 'bus', 'Breakfast', 'Kerala Backwaters'),
(9, 5, 1, 'Arrival & Check-in', 'Arrive at destination, transfer to hotel and relax.', 'none', 'Dinner', 'Himachal Trek'),
(10, 5, 2, 'Sightseeing & Activities', 'Enjoy local sightseeing and optional activities.', 'bus', 'Breakfast', 'Himachal Trek'),
(11, 6, 1, 'Arrival & Check-in', 'Arrive at destination, transfer to hotel and relax.', 'none', 'Dinner', 'Andaman Islands'),
(12, 6, 2, 'Sightseeing & Activities', 'Enjoy local sightseeing and optional activities.', 'bus', 'Breakfast', 'Andaman Islands');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` tinyint UNSIGNED NOT NULL DEFAULT '5',
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `name`, `rating`, `comment`, `created_at`) VALUES
(1, 'Dolorem et ea dolor ', 5, 'Laborum Aliqua Pla', '2026-03-24 12:07:37'),
(3, 'user', 5, 'dfghjklhkertfy', '2026-03-24 12:13:04'),
(4, 'Test User One', 5, 'veryy good servicce', '2026-03-27 06:39:36');

-- --------------------------------------------------------

--
-- Table structure for table `routes`
--

CREATE TABLE `routes` (
  `id` int UNSIGNED NOT NULL,
  `source_city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `destination_city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `route_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Active','Inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `routes`
--

INSERT INTO `routes` (`id`, `source_city`, `destination_city`, `route_name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'surat', 'bhavnagar', 'Way Saurashtra', 'Active', '2026-03-16 04:56:50', '2026-03-16 04:56:50'),
(2, 'Surat', 'Rajkot', 'Surat -> Rajkot', 'Active', '2026-03-16 05:07:52', '2026-03-16 05:07:52'),
(3, 'Surat', 'Jambala', 'Surat -> Zambala', 'Active', '2026-03-16 05:19:04', '2026-03-16 05:19:12'),
(4, 'Surat', 'goa', 'Surat -> goa', 'Active', '2026-03-16 09:58:30', '2026-03-16 09:58:30');

-- --------------------------------------------------------

--
-- Table structure for table `services_data`
--

CREATE TABLE `services_data` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services_data`
--

INSERT INTO `services_data` (`id`, `title`, `description`, `price`, `image`, `created_at`) VALUES
(1, 'Flight Booking', 'Domestic and international flight reservations.', 5000.00, NULL, '2026-03-14 05:07:11'),
(2, 'Hotel Stay', 'Curated hotels and resorts.', 8000.00, NULL, '2026-03-14 05:07:11'),
(3, 'Travel Insurance', 'Coverage for trip cancellation and medical.', 1500.00, NULL, '2026-03-14 05:07:11'),
(4, 'Visa Assistance', 'Documentation and visa support.', 3500.00, NULL, '2026-03-14 05:07:11'),
(5, 'Guided Tours', 'Local expert guides for sightseeing.', 2000.00, NULL, '2026-03-14 05:07:11');

-- --------------------------------------------------------

--
-- Table structure for table `users_data`
--

CREATE TABLE `users_data` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users_data`
--

INSERT INTO `users_data` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'Admin', 'admin@example.com', '$2y$10$pWfkWiUnPmlUBBi0cDlB1.ZJa9UQbNOOZtXLChKrXmSJoNQVZcfkS', 'Admin', '2026-03-14 05:07:11'),
(2, 'Test User One', 'user1@test.com', '$2y$10$d6SUnhb57gZN8S0JpC3ByuNPbV7NsOL4K2hrIbPG9RfKtydqS0Joa', 'user', '2026-03-14 05:07:11'),
(3, 'Test User Two', 'user2@test.com', '$2y$10$d6SUnhb57gZN8S0JpC3ByuNPbV7NsOL4K2hrIbPG9RfKtydqS0Joa', 'user', '2026-03-14 05:07:11'),
(4, 'testuser3', 'user3@test.com', '$2y$12$zGcenWFB1Bv62yNYG8YHbekT2UX2kSbr4oNsHEvoJCD9lAofaBX0e', 'user', '2026-03-27 06:58:15');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings_data`
--
ALTER TABLE `bookings_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `package_id` (`package_id`);

--
-- Indexes for table `buses`
--
ALTER TABLE `buses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `route_id` (`route_id`);

--
-- Indexes for table `bus_bookings`
--
ALTER TABLE `bus_bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_booking` (`bus_id`,`travel_date`,`seat_number`),
  ADD KEY `route_id` (`route_id`);

--
-- Indexes for table `bus_seats`
--
ALTER TABLE `bus_seats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_bus_seat` (`bus_id`,`seat_number`);

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hotels`
--
ALTER TABLE `hotels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hotel_bookings`
--
ALTER TABLE `hotel_bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hotel_id` (`hotel_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `hotel_rooms`
--
ALTER TABLE `hotel_rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hotel_id` (`hotel_id`);

--
-- Indexes for table `packages_data`
--
ALTER TABLE `packages_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `package_itineraries`
--
ALTER TABLE `package_itineraries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_package_itineraries_package` (`package_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `routes`
--
ALTER TABLE `routes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services_data`
--
ALTER TABLE `services_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users_data`
--
ALTER TABLE `users_data`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings_data`
--
ALTER TABLE `bookings_data`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `buses`
--
ALTER TABLE `buses`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `bus_bookings`
--
ALTER TABLE `bus_bookings`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `bus_seats`
--
ALTER TABLE `bus_seats`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `hotels`
--
ALTER TABLE `hotels`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `hotel_bookings`
--
ALTER TABLE `hotel_bookings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `hotel_rooms`
--
ALTER TABLE `hotel_rooms`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

--
-- AUTO_INCREMENT for table `packages_data`
--
ALTER TABLE `packages_data`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `package_itineraries`
--
ALTER TABLE `package_itineraries`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `routes`
--
ALTER TABLE `routes`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `services_data`
--
ALTER TABLE `services_data`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users_data`
--
ALTER TABLE `users_data`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `buses`
--
ALTER TABLE `buses`
  ADD CONSTRAINT `buses_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `bus_bookings`
--
ALTER TABLE `bus_bookings`
  ADD CONSTRAINT `bus_bookings_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`),
  ADD CONSTRAINT `bus_bookings_ibfk_2` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`);

--
-- Constraints for table `bus_seats`
--
ALTER TABLE `bus_seats`
  ADD CONSTRAINT `bus_seats_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `package_itineraries`
--
ALTER TABLE `package_itineraries`
  ADD CONSTRAINT `fk_package_itineraries_package` FOREIGN KEY (`package_id`) REFERENCES `packages_data` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
