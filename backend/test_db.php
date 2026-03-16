<?php
//$host = "localhost";
//$user = "hit";          // your MySQL username
//$pass = "hit@1813d";    // your MySQL password
//$dbname = "dream_travellers"; // your database name

// Try to connect
//$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
//if ($conn->connect_error) {
//  die("❌ Connection failed: " . $conn->connect_error);
//}
//echo "✅ Database connection successful!<br>";

// Run a simple query using a safe alias (no reserved name)
//$result = $conn->query("SELECT NOW() AS `now_time`");

//if ($result) {
//  $row = $result->fetch_assoc();
//echo "⏰ Current Database Time: " . $row["now_time"];
//} else {
//  echo "❌ Query failed: " . $conn->error;
//}

//$conn->close();

$host = "127.0.0.1:3306";
$user = "root";  // ✅ use root first until privileges fixed
$pass = "";      // ✅ root has empty password in XAMPP
$dbname = "dream_travellers";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
  die("❌ Connection failed: " . $conn->connect_error);
}
