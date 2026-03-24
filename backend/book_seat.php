<?php
require 'config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid request data.']);
    exit;
}

$bus_id = $data['bus_id'] ?? '';
$route_id = $data['route_id'] ?? '';
$seat_numbers = $data['seat_numbers'] ?? []; // Array of seats
$passenger_name = $data['passenger_name'] ?? '';
$phone = $data['phone'] ?? '';
$email = $data['email'] ?? '';
$travel_date = $data['travel_date'] ?? '';

if (empty($bus_id) || empty($route_id) || empty($seat_numbers) || empty($passenger_name) || empty($phone) || empty($travel_date)) {
    echo json_encode(['success' => false, 'message' => 'All required fields must be filled.']);
    exit;
}

if (strlen($phone) !== 10 || !ctype_digit($phone)) {
    echo json_encode(['success' => false, 'message' => 'Phone number must be exactly 10 digits.']);
    exit;
}

if (!is_array($seat_numbers) || count($seat_numbers) === 0) {
    echo json_encode(['success' => false, 'message' => 'No seats selected.']);
    exit;
}

// Start Transaction
$conn->begin_transaction();

try {
    // 1. Check if ANY of the seats are already booked
    $seat_placeholders = implode(',', array_fill(0, count($seat_numbers), '?'));
    $types = str_repeat('i', count($seat_numbers));
    
    $stmt = $conn->prepare("SELECT seat_number FROM bus_bookings WHERE bus_id = ? AND travel_date = ? AND seat_number IN ($seat_placeholders) AND booking_status = 'Confirmed'");
    
    $bind_params = array_merge([$bus_id, $travel_date], $seat_numbers);
    $stmt->bind_param("is" . $types, ...$bind_params);
    $stmt->execute();
    $existing = $stmt->get_result();
    
    if ($existing->num_rows > 0) {
        $taken = [];
        while($row = $existing->fetch_assoc()) $taken[] = $row['seat_number'];
        throw new Exception("Seats " . implode(', ', $taken) . " are already booked for this date.");
    }

    // 2. Check total capacity
    $stmt = $conn->prepare("SELECT COUNT(*) as booked_count FROM bus_bookings WHERE bus_id = ? AND travel_date = ? AND booking_status = 'Confirmed'");
    $stmt->bind_param("is", $bus_id, $travel_date);
    $stmt->execute();
    $booked_count = $stmt->get_result()->fetch_assoc()['booked_count'];

    if ($booked_count + count($seat_numbers) > 29) {
        throw new Exception("Not enough seats available. Total bookings cannot exceed 29.");
    }

    // 3. Process Bookings
    $stmt = $conn->prepare("INSERT INTO bus_bookings (bus_id, route_id, seat_number, passenger_name, phone, email, travel_date) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    foreach ($seat_numbers as $seat) {
        $stmt->bind_param("iiissss", $bus_id, $route_id, $seat, $passenger_name, $phone, $email, $travel_date);
        if (!$stmt->execute()) {
            throw new Exception("Error booking seat $seat: " . $stmt->error);
        }
    }

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Booking confirmed successfully for ' . count($seat_numbers) . ' seats!', 'booking_id' => $conn->insert_id]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
