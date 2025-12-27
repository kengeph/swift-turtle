<!DOCTYPE html>
<html>
<head>
    <title>Men's Ministry Availablilty Form Results</title>
</head>
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
//<table>
//    <tr>
        if ($result->num_rows > 0) {
            // output data of each row
            while($row = $result->fetch_assoc()) {
                echo $row["name"];
            }
        } else {
            echo "0 results";
        }
//    </tr>
//    <tr>
//        <td>test</td>
//    </tr>
//</table>
$conn->close();
?> 

</body>
</html>