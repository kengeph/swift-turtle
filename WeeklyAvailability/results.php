<!DOCTYPE html>
<html>
<body>

<?php
include('dbinfo.inc.php');

// Create connection
$conn = new mysqli($server, $username, $password, $database);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT name FROM $table";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "<br>". $row["name"]. "<br>";
    }
} else {
    echo "0 results";
}

$conn->close();
?> 

</body>
</html>