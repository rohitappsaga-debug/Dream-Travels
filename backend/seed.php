<?php
/**
 * Seeder: insert dummy records for development.
 * Run from command line: php seed.php
 *
 * - Adds dummy users (skips if email exists)
 * - Truncates and refills packages_data, services_data, bookings_data
 * - Does not remove existing users (e.g. admin)
 */

if (php_sapi_name() !== 'cli') {
    die("This script can only be run from the command line.\n");
}

require __DIR__ . '/config.php';

$conn->set_charset("utf8mb4");

echo "Seeding database...\n";

// ---------- 1. Ensure an admin user exists ----------
$adminEmail = 'admin@example.com';
$adminName = 'Admin';
$adminPassword = 'admin';

$stmt = $conn->prepare("SELECT id FROM users_data WHERE email = ?");
$stmt->bind_param("s", $adminEmail);
$stmt->execute();
$res = $stmt->get_result();
if ($res->num_rows === 0) {
    $stmt->close();
    $hash = password_hash($adminPassword, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users_data (name, email, password_hash, role) VALUES (?, ?, ?, 'Admin')");
    $stmt->bind_param("sss", $adminName, $adminEmail, $hash);
    $stmt->execute();
    echo "  Admin user: $adminEmail (password: $adminPassword)\n";
} else {
    $stmt->close();
}

// ---------- 2. Dummy users (insert only if email not exists) ----------
$dummyUsers = [
    ['Test User One', 'user1@test.com', 'password123'],
    ['Test User Two', 'user2@test.com', 'password123'],
];

$userIds = [];
foreach ($dummyUsers as list($name, $email, $pass)) {
    $stmt = $conn->prepare("SELECT id FROM users_data WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res->num_rows > 0) {
        $userIds[$email] = (int) $res->fetch_assoc()['id'];
        $stmt->close();
        continue;
    }
    $stmt->close();
    $hash = password_hash($pass, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users_data (name, email, password_hash, role) VALUES (?, ?, ?, 'user')");
    $stmt->bind_param("sss", $name, $email, $hash);
    $stmt->execute();
    $userIds[$email] = (int) $conn->insert_id;
    $stmt->close();
    echo "  User: $email\n";
}

// Get first available user id for bookings (admin or dummy)
$res = $conn->query("SELECT id FROM users_data ORDER BY id ASC LIMIT 1");
$firstUserId = $res ? (int) $res->fetch_assoc()['id'] : 1;
$res->close();

// ---------- 2. Truncate then insert packages ----------
$conn->query("SET FOREIGN_KEY_CHECKS = 0");
$conn->query("TRUNCATE TABLE bookings_data");
$conn->query("TRUNCATE TABLE packages_data");
$conn->query("TRUNCATE TABLE services_data");
$conn->query("SET FOREIGN_KEY_CHECKS = 1");

$packages = [
    // title, description, price, duration_days, nights, start_location, end_location, main_transport, image
    ['Goa Beach Holiday', 'Relax on sandy beaches and enjoy water sports. 3 nights, breakfast included.', 8500.00, 4, 3, 'Your City', 'Goa', 'mixed', '/assets/packages/goa.png'],
    ['Kashmir Paradise', 'Houseboat stay in Dal Lake, Srinagar. 4 days with shikara ride and gardens.', 22000.00, 4, 3, 'Your City', 'Kashmir', 'mixed', '/assets/packages/kashmir.png'],
    ['Rajasthan Heritage', 'Jaipur, Udaipur, Jodhpur. Forts, palaces and cultural shows. 5 nights.', 35000.00, 6, 5, 'Your City', 'Rajasthan', 'mixed', '/assets/packages/rajasthan.png'],
    ['Kerala Backwaters', 'Houseboat in Alleppey, tea gardens in Munnar. 4 days.', 18000.00, 4, 3, 'Your City', 'Kerala', 'mixed', '/assets/packages/kerala.png'],
    ['Himachal Trek', 'Manali to Solang Valley. 3 days trekking and camping.', 12000.00, 3, 2, 'Your City', 'Himachal', 'mixed', '/assets/packages/himachal.png'],
    ['Andaman Islands', 'Port Blair & Havelock. Snorkelling and beach stay. 5 nights.', 45000.00, 6, 5, 'Your City', 'Andaman', 'mixed', '/assets/packages/andaman.png'],
];

$stmt = $conn->prepare("INSERT INTO packages_data (title, description, price, duration_days, nights, start_location, end_location, main_transport, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
foreach ($packages as $p) {
    $stmt->bind_param("ssddissss", $p[0], $p[1], $p[2], $p[3], $p[4], $p[5], $p[6], $p[7], $p[8]);
    $stmt->execute();
}
$stmt->close();
echo "  Packages: " . count($packages) . "\n";

// ---------- 3. Services ----------
$services = [
    ['Flight Booking', 'Domestic and international flight reservations.', 5000.00, null],
    ['Hotel Stay', 'Curated hotels and resorts.', 8000.00, null],
    ['Travel Insurance', 'Coverage for trip cancellation and medical.', 1500.00, null],
    ['Visa Assistance', 'Documentation and visa support.', 3500.00, null],
    ['Guided Tours', 'Local expert guides for sightseeing.', 2000.00, null],
];

$stmt = $conn->prepare("INSERT INTO services_data (title, description, price, image) VALUES (?, ?, ?, ?)");
foreach ($services as $s) {
    $stmt->bind_param("ssds", $s[0], $s[1], $s[2], $s[3]);
    $stmt->execute();
}
$stmt->close();
echo "  Services: " . count($services) . "\n";

// ---------- 4. Bookings (use first 3 packages and first user) ----------
$res = $conn->query("SELECT id, title, price FROM packages_data ORDER BY id LIMIT 4");
$pkgs = [];
while ($row = $res->fetch_assoc()) {
    $pkgs[] = $row;
}
$res->close();

$res = $conn->query("SELECT id, name FROM users_data ORDER BY id LIMIT 3");
$users = [];
while ($row = $res->fetch_assoc()) {
    $users[] = $row;
}
$res->close();

$bookings = [
    ['2025-04-15', 2, 'credit-card'],
    ['2025-05-01', 1, 'debit-card'],
    ['2025-05-20', 4, 'upi'],
    ['2025-06-10', 2, 'credit-card'],
];

$stmt = $conn->prepare("INSERT INTO bookings_data (customer_name, customer_phone, user_id, travel_date, passengers, payment_method, package_id, package_title, package_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')");
$i = 0;
foreach ($bookings as $b) {
    $user = $users[$i % count($users)];
    $pkg = $pkgs[$i % count($pkgs)];
    $phone = '+91987654321' . $i;
    // s: customer_name, s: phone, i: user_id, s: travel_date (YYYY-MM-DD), i: passengers, s: payment_method, i: package_id, s: package_title, d: package_price
    $stmt->bind_param(
        "ssisisisd",
        $user['name'],
        $phone,
        $user['id'],
        $b[0],
        $b[1],
        $b[2],
        $pkg['id'],
        $pkg['title'],
        $pkg['price']
    );
    $stmt->execute();
    $i++;
}
$stmt->close();
echo "  Bookings: " . count($bookings) . "\n";

// ---------- 5. Simple itineraries for demo ----------
$res = $conn->query("SELECT id, title FROM packages_data ORDER BY id");
$allPkgs = [];
while ($row = $res->fetch_assoc()) {
    $allPkgs[] = $row;
}
$res->close();

if (!empty($allPkgs)) {
    $stmt = $conn->prepare("INSERT INTO package_itineraries (package_id, day_number, title, description, transport_mode, meals, stay_location) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $packageId = 0;
    $dayNumber = 0;
    $title = $desc = $mode = $mealsTxt = $stayLoc = "";
    $stmt->bind_param(
        "iisssss",
        $packageId,
        $dayNumber,
        $title,
        $desc,
        $mode,
        $mealsTxt,
        $stayLoc
    );
    foreach ($allPkgs as $p) {
        $packageId = (int) $p['id'];
        // Day 1
        $dayNumber = 1;
        $title = "Arrival & Check-in";
        $desc = "Arrive at destination, transfer to hotel and relax.";
        $mode = "none";
        $mealsTxt = "Dinner";
        $stayLoc = $p['title'];
        $stmt->execute();

        // Day 2
        $dayNumber = 2;
        $title = "Sightseeing & Activities";
        $desc = "Enjoy local sightseeing and optional activities.";
        $mode = "bus";
        $mealsTxt = "Breakfast";
        $stayLoc = $p['title'];
        $stmt->execute();
    }
    $stmt->close();
    echo "  Itineraries: " . count($allPkgs) * 2 . " day entries\n";
}

$conn->close();
echo "Done.\n";
