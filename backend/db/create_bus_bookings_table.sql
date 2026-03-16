-- Create table for Bus Bookings
USE dream_travellers;

CREATE TABLE IF NOT EXISTS bus_bookings (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  bus_id INT UNSIGNED NOT NULL,
  route_id INT UNSIGNED NOT NULL,
  seat_number INT NOT NULL,
  passenger_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  travel_date DATE NOT NULL,
  booking_status ENUM('Confirmed', 'Cancelled') DEFAULT 'Confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bus_id) REFERENCES buses(id),
  FOREIGN KEY (route_id) REFERENCES routes(id),
  UNIQUE KEY unique_booking (bus_id, travel_date, seat_number)
) ENGINE=InnoDB;
