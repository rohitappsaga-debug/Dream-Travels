<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid input data", "success" => false]);
    exit;
}

$bus_name = $conn->real_escape_string($data['bus_name']);
$bus_code = $conn->real_escape_string($data['bus_code']);
$route_id = (int)$data['route_id'];
$status = isset($data['status']) ? $conn->real_escape_string($data['status']) : 'Active';
$total_seats = 29; // Fixed as per requirements

if (empty($bus_name) || empty($bus_code) || empty($route_id)) {
    echo json_encode(["status" => "error", "message" => "Bus name, code and route are required", "success" => false]);
    exit;
}

$conn->begin_transaction();

try {
    $sql = "INSERT INTO buses (bus_name, bus_code, route_id, total_seats, status) VALUES ('$bus_name', '$bus_code', $route_id, $total_seats, '$status')";
    
    if (!$conn->query($sql)) {
        throw new Exception($conn->error);
    }
    
    $bus_id = $conn->insert_id;
    
    // Auto-generate 29 seats
    for ($i = 1; $i <= $total_seats; $i++) {
        $seat_sql = "INSERT INTO bus_seats (bus_id, seat_number, seat_status) VALUES ($bus_id, $i, 'Available')";
        if (!$conn->query($seat_sql)) {
            throw new Exception($conn->error);
        }
    }
    
    $conn->commit();
    echo json_encode(["status" => "success", "message" => "Bus and 29 seats created successfully", "success" => true, "id" => $bus_id]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["status" => "error", "message" => "Failed to create bus: " . $e->getMessage(), "success" => false]);
}

$conn->close();
?>
