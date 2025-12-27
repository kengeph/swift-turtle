<?
    include('dbinfo.inc.php');

    $name=$_POST['name'];
    $phone=$_POST['phone'];
    $email=$_POST['email'];
    $myArray = json_decode($_POST['myArray']);
    $myArrayExpanded  = implode("', '", $myArray);

    mysql_connect($server,$username,$password);
    @mysql_select_db($database) or die( "Unable to select database");

    $query = "INSERT INTO $table VALUES ('', now(), '$name', '$phone', '$email', '$myArrayExpanded')";
    mysql_query($query);

    mysql_close();
    header("Location: http://swiftturtlelabs.com/WeeklyAvailability/SubmitSuccess.html");
?>