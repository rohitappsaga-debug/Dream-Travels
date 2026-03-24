<?php
function test_phone($phone) {
    $isValid = (strlen($phone) === 10 && ctype_digit($phone));
    echo "Phone: '$phone' -> " . ($isValid ? "VALID" : "INVALID") . "\n";
}

test_phone("1234567890"); // Should be VALID
test_phone("12345");      // Should be INVALID
test_phone("12345678901"); // Should be INVALID
test_phone("ABC4567890"); // Should be INVALID
?>
