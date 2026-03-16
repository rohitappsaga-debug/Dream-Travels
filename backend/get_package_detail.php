<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require __DIR__ . "/config.php";

$id = null;

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $id = isset($_GET["id"]) ? (int) $_GET["id"] : null;
} else {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);
    if (is_array($data) && isset($data["id"])) {
        $id = (int) $data["id"];
    }
}

if (!$id) {
    echo json_encode([
        "status" => "error",
        "message" => "Package id is required",
    ]);
    exit();
}

$stmt = $conn->prepare("SELECT * FROM packages_data WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Package not found",
    ]);
    $stmt->close();
    $conn->close();
    exit();
}

$package = $result->fetch_assoc();
$stmt->close();

$stmt2 = $conn->prepare("SELECT day_number, title, description, transport_mode, meals, stay_location FROM package_itineraries WHERE package_id = ? ORDER BY day_number");
$stmt2->bind_param("i", $id);
$stmt2->execute();
$res2 = $stmt2->get_result();

$itinerary = [];
while ($row = $res2->fetch_assoc()) {
    $itinerary[] = $row;
}
$stmt2->close();
$conn->close();

echo json_encode([
    "status" => "success",
    "data" => [
        "package" => $package,
        "itinerary" => $itinerary,
    ],
]);

