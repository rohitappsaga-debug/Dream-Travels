<?php
require 'config.php';

$updates = [
    'Goa Beach Holiday' => '/assets/packages/goa.png',
    'Kashmir Paradise' => '/assets/packages/kashmir.png',
    'Rajasthan Heritage' => '/assets/packages/rajasthan.png',
    'Kerala Backwaters' => '/assets/packages/kerala.png',
    'Himachal Trek' => '/assets/packages/himachal.png',
    'Andaman Islands' => '/assets/packages/andaman.png'
];

foreach ($updates as $title => $path) {
    $stmt = $conn->prepare("UPDATE packages_data SET image = ? WHERE title = ?");
    $stmt->bind_param("ss", $path, $title);
    $stmt->execute();
    if ($stmt->affected_rows > 0) {
        echo "Updated image for: $title\n";
    } else {
        echo "No changes or package not found for: $title\n";
    }
}

$conn->close();
?>
