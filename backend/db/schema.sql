-- Schema for dream_travellers database (structure only, no data)

DROP DATABASE IF EXISTS dream_travellers;
CREATE DATABASE dream_travellers CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dream_travellers;

-- Table: users_data
CREATE TABLE users_data (
  id int unsigned NOT NULL AUTO_INCREMENT,
  name varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  email varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  password_hash varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  role varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: packages_data
CREATE TABLE packages_data (
  id int unsigned NOT NULL AUTO_INCREMENT,
  title varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  description text COLLATE utf8mb4_unicode_ci,
  price decimal(10,2) NOT NULL DEFAULT '0.00',
  duration_days tinyint unsigned NOT NULL DEFAULT '1',
  nights tinyint unsigned NOT NULL DEFAULT '0',
  start_location varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  end_location varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  main_transport enum('bus','flight','train','cab','cruise','mixed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'mixed',
  highlights text COLLATE utf8mb4_unicode_ci,
  inclusions text COLLATE utf8mb4_unicode_ci,
  exclusions text COLLATE utf8mb4_unicode_ci,
  image varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: services_data
CREATE TABLE services_data (
  id int unsigned NOT NULL AUTO_INCREMENT,
  title varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  description text COLLATE utf8mb4_unicode_ci,
  price decimal(10,2) DEFAULT NULL,
  image varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: bookings_data
CREATE TABLE bookings_data (
  id int unsigned NOT NULL AUTO_INCREMENT,
  customer_name varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  customer_phone varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  user_id int unsigned NOT NULL,
  travel_date date NOT NULL,
  passengers int NOT NULL DEFAULT '1',
  payment_method varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  package_id int unsigned NOT NULL,
  package_title varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  package_price decimal(10,2) DEFAULT NULL,
  status varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'confirmed',
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  KEY package_id (package_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: package_itineraries
CREATE TABLE package_itineraries (
  id int unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  package_id int unsigned NOT NULL,
  day_number tinyint unsigned NOT NULL,
  title varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  description text COLLATE utf8mb4_unicode_ci,
  transport_mode enum('none','bus','flight','train','cab','ferry','other') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  meals varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  stay_location varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  CONSTRAINT fk_package_itineraries_package
    FOREIGN KEY (package_id) REFERENCES packages_data(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

