<?php
require 'config.php';

header('Content-Type: application/json');

$city = isset($_GET['city']) ? $conn->real_escape_string($_GET['city']) : '';

if (empty($city)) {
    echo json_encode(['status' => 'error', 'message' => 'City is required']);
    exit;
}

// 1. Check if hotels exist for the city
$sql = "SELECT * FROM hotels WHERE city = '$city' AND status = 'active'";
$result = $conn->query($sql);

$hotels = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $hotels[] = $row;
    }
} else {
    // 2. Auto-generate 5-8 hotels
    $hotelNames = ["Grand Hotel", "Royal Residency", "Comfort Inn", "Palace Hotel", "City Stay", "Heritage Inn", "Elegance Hotel", "Vista Residency"];
    
    // Variety of hotel images (Verified URLs)
    $hotelImages = [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800"
    ];

    // Variety of locations
    $locations = ["Station Road", "MG Road", "Hill View Area", "City Center", "Lake Front", "Near Airport", "Business District", "Heritage Zone"];

    // Variety of room images
    $roomImages = [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800"
    ];

    shuffle($hotelNames);
    shuffle($hotelImages);
    shuffle($locations);
    shuffle($roomImages);
    $count = rand(5, 8);
    
    $commonAmenities = "WiFi, AC, Parking, Restaurant, Swimming Pool, Gym";
    
    for ($i = 0; $i < $count; $i++) {
        $hName = $city . " " . $hotelNames[$i];
        $rating = number_format(3.5 + (rand(0, 10) / 10), 1);
        $price = rand(1500, 6000);
        $totalRooms = rand(20, 40);
        $location = $locations[$i % count($locations)] . ", " . $city;
        $description = "Experience luxury and comfort at $hName, located in the heart of $city. Our hotel offers world-class amenities and exceptional service.";
        
        $image = $hotelImages[$i % count($hotelImages)];

        $ins_sql = "INSERT INTO hotels (hotel_name, city, location, rating, price_per_night, total_rooms, available_rooms, image, description, amenities) 
                    VALUES ('$hName', '$city', '$location', '$rating', '$price', '$totalRooms', '$totalRooms', '$image', '$description', '$commonAmenities')";
        
        if ($conn->query($ins_sql)) {
            $hotel_id = $conn->insert_id;
            
            // Generate default room types for this hotel
            $roomTypes = [
                ['type' => 'Standard', 'price_mult' => 1.0, 'rooms' => floor($totalRooms * 0.4)],
                ['type' => 'Deluxe', 'price_mult' => 1.5, 'rooms' => floor($totalRooms * 0.4)],
                ['type' => 'Suite', 'price_mult' => 2.5, 'rooms' => floor($totalRooms * 0.2)]
            ];

            foreach ($roomTypes as $rt) {
                $rPrice = $price * $rt['price_mult'];
                $rCount = $rt['rooms'];
                $rImg = $roomImages[array_rand($roomImages)];
                $rDesc = "Spacious " . $rt['type'] . " room with modern decor and premium amenities.";
                
                $conn->query("INSERT INTO hotel_rooms (hotel_id, room_type, price_per_night, total_rooms, available_rooms, description, image) 
                             VALUES ($hotel_id, '{$rt['type']}', $rPrice, $rCount, $rCount, '$rDesc', '$rImg')");
            }
        }
    }
    
    // Re-fetch the newly generated hotels
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $hotels[] = $row;
    }
}

echo json_encode(['status' => 'success', 'data' => $hotels]);
?>
