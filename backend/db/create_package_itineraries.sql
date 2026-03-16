-- Migration: create package_itineraries table for day-by-day plans
CREATE TABLE IF NOT EXISTS package_itineraries (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  package_id INT UNSIGNED NOT NULL,
  day_number TINYINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  transport_mode ENUM('none','bus','flight','train','cab','ferry','other') NOT NULL DEFAULT 'none',
  meals VARCHAR(50) DEFAULT NULL,
  stay_location VARCHAR(255) DEFAULT NULL,
  CONSTRAINT fk_package_itineraries_package
    FOREIGN KEY (package_id) REFERENCES packages_data(id)
    ON DELETE CASCADE
);

