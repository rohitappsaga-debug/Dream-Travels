<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$target_dir = "../frontend/public/assets/packages/";
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

if (!isset($_FILES["image"])) {
    echo json_encode(["success" => false, "message" => "No file uploaded"]);
    exit;
}

$file = $_FILES["image"];
$target_file = $target_dir . basename($file["name"]);
$imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

// Check if image file is a actual image or fake image
$check = getimagesize($file["tmp_name"]);
if ($check === false) {
    echo json_encode(["success" => false, "message" => "File is not an image."]);
    exit;
}

// Allow certain file formats
if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
    echo json_encode(["success" => false, "message" => "Sorry, only JPG, JPEG, PNG & GIF files are allowed."]);
    exit;
}

// Check file size (limit to 5MB)
if ($file["size"] > 5000000) {
    echo json_encode(["success" => false, "message" => "Sorry, your file is too large."]);
    exit;
}

// Sanitize filename to avoid collisions and issues
$filename = time() . "_" . preg_replace("/[^a-zA-Z0-9.]/", "_", basename($file["name"]));
$target_file = $target_dir . $filename;

if (move_uploaded_file($file["tmp_name"], $target_file)) {
    // Return the URL that the frontend can use
    $public_path = "/assets/packages/" . $filename;
    echo json_encode(["success" => true, "message" => "File uploaded successfully", "url" => $public_path]);
} else {
    echo json_encode(["success" => false, "message" => "Sorry, there was an error uploading your file."]);
}
?>
