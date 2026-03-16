<?php
require 'config.php';

// Create hotels table
$sql_hotels = "CREATE TABLE IF NOT EXISTS hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    rating FLOAT DEFAULT 4.0,
    price_per_night DECIMAL(10,2),
    total_rooms INT,
    available_rooms INT,
    image TEXT,
    description TEXT,
    amenities TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

// Create hotel_rooms table (for multiple room types per hotel)
$sql_rooms = "CREATE TABLE IF NOT EXISTS hotel_rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT NOT NULL,
    room_type VARCHAR(100) NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    total_rooms INT NOT NULL,
    available_rooms INT NOT NULL,
    description TEXT,
    image TEXT,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
)";

// Create hotel_bookings table
$sql_bookings = "CREATE TABLE IF NOT EXISTS hotel_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT NOT NULL,
    room_id INT NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    num_guests INT DEFAULT 1,
    num_rooms INT DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('Confirmed', 'Cancelled') DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES hotel_rooms(id) ON DELETE CASCADE
)";

function run($conn, $sql, $name) {
    if ($conn->query($sql) === TRUE) {
        echo "Table $name created successfully\n";
    } else {
        echo "Error creating table $name: " . $conn->error . "\n";
    }
}

run($conn, $sql_hotels, "hotels");
run($conn, $sql_rooms, "hotel_rooms");
run($conn, $sql_bookings, "hotel_bookings");

$conn->close();
?>
