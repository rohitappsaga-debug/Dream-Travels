<?php
require __DIR__ . '/../config.php';

$sql = "
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
";

if ($conn->query($sql)) {
    echo "bus_bookings table created or verified successfully.\n";
} else {
    echo "Error creating table: " . $conn->error . "\n";
}

$res = $conn->query("SHOW TABLES LIKE 'bus_bookings'");
if ($res->num_rows > 0) {
    echo "VERIFIED: bus_bookings table exists.\n";
} else {
    echo "FAILURE: bus_bookings table not found.\n";
}
?>
