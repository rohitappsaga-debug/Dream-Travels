<?php
require 'config.php';

header('Content-Type: application/json');

$source = $_GET['source'] ?? '';
$destination = $_GET['destination'] ?? '';
$travel_date = $_GET['travel_date'] ?? '';

if (empty($source) || empty($destination) || empty($travel_date)) {
    echo json_encode(['success' => false, 'message' => 'Source, destination, and travel date are required.']);
    exit;
}

// Find route_id for given source and destination
$stmt = $conn->prepare("SELECT id FROM routes WHERE source_city = ? AND destination_city = ? AND status = 'Active'");
$stmt->bind_param("ss", $source, $destination);
$stmt->execute();
$route_result = $stmt->get_result();

if ($route_result->num_rows === 0) {
    echo json_encode(['success' => true, 'data' => [], 'message' => 'No routes found for the selected cities.']);
    exit;
}

$route = $route_result->fetch_assoc();
$route_id = $route['id'];

// Find buses for this route
$stmt = $conn->prepare("
    SELECT b.*, r.source_city, r.destination_city 
    FROM buses b
    JOIN routes r ON b.route_id = r.id
    WHERE b.route_id = ? AND b.status = 'Active'
");
$stmt->bind_param("i", $route_id);
$stmt->execute();
$buses_result = $stmt->get_result();

$buses = [];
while ($bus = $buses_result->fetch_assoc()) {
    // Count booked seats for this bus and date
    $stmt_seats = $conn->prepare("SELECT COUNT(*) as booked_count FROM bus_bookings WHERE bus_id = ? AND travel_date = ? AND booking_status = 'Confirmed'");
    $stmt_seats->bind_param("is", $bus['id'], $travel_date);
    $stmt_seats->execute();
    $booked_res = $stmt_seats->get_result()->fetch_assoc();
    
    $bus['available_seats'] = (int)$bus['total_seats'] - (int)$booked_res['booked_count'];
    $buses[] = $bus;
}

echo json_encode(['success' => true, 'data' => $buses]);
?>
