-- MySQL dump 10.13  Distrib 9.5.0, for macos15.4 (arm64)
--
-- Host: localhost    Database: dream_travellers
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'ba79eb0e-b3d6-11f0-83b0-27c772e116c7:1-716';

--
-- Table structure for table `bookings_data`
--

DROP TABLE IF EXISTS `bookings_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings_data` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int unsigned NOT NULL,
  `travel_date` date NOT NULL,
  `passengers` int NOT NULL DEFAULT '1',
  `payment_method` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_id` int unsigned NOT NULL,
  `package_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_price` decimal(10,2) DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'confirmed',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `package_id` (`package_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings_data`
--

LOCK TABLES `bookings_data` WRITE;
/*!40000 ALTER TABLE `bookings_data` DISABLE KEYS */;
INSERT INTO `bookings_data` VALUES (1,'Deepak',NULL,1,'2025-04-15',2,'credit-card',1,'Goa Beach Holiday',8500.00,'confirmed','2026-03-12 13:16:48'),(2,'Admin',NULL,2,'2025-05-01',1,'debit-card',2,'Kashmir Paradise',22000.00,'confirmed','2026-03-12 13:16:48'),(3,'Full Name',NULL,3,'2025-05-20',4,'upi',3,'Rajasthan Heritage',35000.00,'confirmed','2026-03-12 13:16:48'),(4,'Deepak',NULL,1,'2025-06-10',2,'credit-card',4,'Kerala Backwaters',18000.00,'confirmed','2026-03-12 13:16:48');
/*!40000 ALTER TABLE `bookings_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `packages_data`
--

DROP TABLE IF EXISTS `packages_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `packages_data` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `duration_days` tinyint unsigned NOT NULL DEFAULT '1',
  `nights` tinyint unsigned NOT NULL DEFAULT '0',
  `start_location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `main_transport` enum('bus','flight','train','cab','cruise','mixed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'mixed',
  `highlights` text COLLATE utf8mb4_unicode_ci,
  `inclusions` text COLLATE utf8mb4_unicode_ci,
  `exclusions` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `packages_data`
--

LOCK TABLES `packages_data` WRITE;
/*!40000 ALTER TABLE `packages_data` DISABLE KEYS */;
INSERT INTO `packages_data` VALUES
(1,'Goa Beach Holiday','Relax on sandy beaches and enjoy water sports. 3 nights, breakfast included.',8500.00,4,3,'Your City','Goa','mixed',NULL,NULL,NULL,'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400','2026-03-12 13:16:48'),
(4,'Kerala Backwaters','Houseboat in Alleppey, tea gardens in Munnar. 4 days.',18000.00,4,3,'Your City','Kerala','mixed',NULL,NULL,NULL,'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400','2026-03-12 13:16:48'),
(5,'Himachal Trek','Manali to Solang Valley. 3 days trekking and camping.',12000.00,3,2,'Your City','Himachal','mixed',NULL,NULL,NULL,'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400','2026-03-12 13:16:48'),
(6,'Andaman Islands','Port Blair & Havelock. Snorkelling and beach stay. 5 nights.',45000.00,6,5,'Your City','Andaman','mixed',NULL,NULL,NULL,'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400','2026-03-12 13:16:48');
/*!40000 ALTER TABLE `packages_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services_data`
--

DROP TABLE IF EXISTS `services_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services_data` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services_data`
--

LOCK TABLES `services_data` WRITE;
/*!40000 ALTER TABLE `services_data` DISABLE KEYS */;
INSERT INTO `services_data` VALUES (1,'Flight Booking','Domestic and international flight reservations.',5000.00,NULL,'2026-03-12 13:16:48'),(2,'Hotel Stay','Curated hotels and resorts.',8000.00,NULL,'2026-03-12 13:16:48'),(3,'Travel Insurance','Coverage for trip cancellation and medical.',1500.00,NULL,'2026-03-12 13:16:48'),(4,'Visa Assistance','Documentation and visa support.',3500.00,NULL,'2026-03-12 13:16:48'),(5,'Guided Tours','Local expert guides for sightseeing.',2000.00,NULL,'2026-03-12 13:16:48');
/*!40000 ALTER TABLE `services_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_data`
--

DROP TABLE IF EXISTS `users_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_data` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_data`
--

LOCK TABLES `users_data` WRITE;
/*!40000 ALTER TABLE `users_data` DISABLE KEYS */;
INSERT INTO `users_data` VALUES (1,'Deepak','deepak@example.com','$2y$12$MEu5BVHm2nZKX9TfaWAt6.lPIAk7D06qSk4xqIuqeNuDgwFcUwTZW','user','2026-03-12 13:09:38'),(2,'Admin','admin@example.com','$2y$12$3ZVeA2dthgm9fWNZNmXwUuz0F5rA/1pq.QmudV9Du5dxVl3E//OxO','Admin','2026-03-12 13:13:44'),(3,'Full Name','email@example.com','$2y$12$J9HO3E4RdDNkhOvB.ZTkEejhoilwzXxylYXZkva9NP69/uFbb/xm2','Admin','2026-03-12 13:14:03'),(4,'Test User One','user1@test.com','$2y$12$nRoyueF8VfX.cmaLpGRXL.hKJ2DTmWZ9F8ngefc/zH5iAhI/agxCG','user','2026-03-12 13:16:28'),(5,'Test User Two','user2@test.com','$2y$12$PfBjlZbkAG6ZS0hn24uENuknpkrDCXEE6.AHq5kpGN2LUvGU4.ppm','user','2026-03-12 13:16:28');
/*!40000 ALTER TABLE `users_data` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-12 22:43:51
