<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require __DIR__ . "/config.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data || !isset($data["package_id"]) || !isset($data["days"]) || !is_array($data["days"])) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid payload. Expected package_id and days[]",
    ]);
    exit();
}

$packageId = (int) $data["package_id"];

if ($packageId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid package_id",
    ]);
    exit();
}

// Delete existing itinerary for this package
$del = $conn->prepare("DELETE FROM package_itineraries WHERE package_id = ?");
$del->bind_param("i", $packageId);
$del->execute();
$del->close();

$insert = $conn->prepare("INSERT INTO package_itineraries (package_id, day_number, title, description, transport_mode, meals, stay_location) VALUES (?, ?, ?, ?, ?, ?, ?)");

if (!$insert) {
    echo json_encode([
        "success" => false,
        "message" => "SQL error: " . $conn->error,
    ]);
    $conn->close();
    exit();
}

foreach ($data["days"] as $day) {
    $dayNumber = (int) ($day["day_number"] ?? 0);
    $title = trim((string) ($day["title"] ?? ""));
    $description = (string) ($day["description"] ?? "");
    $transport = (string) ($day["transport_mode"] ?? "none");
    $meals = (string) ($day["meals"] ?? "");
    $stay = (string) ($day["stay_location"] ?? "");

    if ($dayNumber <= 0 || $title === "") {
        continue;
    }

    $insert->bind_param(
        "iisssss",
        $packageId,
        $dayNumber,
        $title,
        $description,
        $transport,
        $meals,
        $stay
    );
    $insert->execute();
}

$insert->close();
$conn->close();

echo json_encode([
    "success" => true,
    "message" => "Itinerary saved successfully",
]);

