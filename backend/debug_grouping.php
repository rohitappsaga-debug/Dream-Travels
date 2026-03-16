<?php
require 'config.php';
$res = $conn->query("SELECT id, passenger_name, length(passenger_name) as name_len, phone, length(phone) as phone_len, bus_id, travel_date, seat_number FROM bus_bookings");
echo "--- DETAILED DATA ---\n";
while($row = $res->fetch_assoc()) {
    echo "ID: {$row['id']} | Name: ".json_encode($row['passenger_name'])." ({$row['name_len']}) | Phone: ".json_encode($row['phone'])." ({$row['phone_len']}) | Bus: {$row['bus_id']} | Date: {$row['travel_date']} | Seat: {$row['seat_number']}\n";
}

$sql_test = "
    SELECT 
        GROUP_CONCAT(seat_number) as seats,
        passenger_name, 
        phone
    FROM bus_bookings 
    GROUP BY passenger_name, phone, bus_id, travel_date
";
$res_test = $conn->query($sql_test);
echo "\n--- TEST GROUPING ---\n";
while($row = $res_test->fetch_assoc()) {
    print_r($row);
}
?>
