<?php
include_once '../config/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

  if ($_POST['type'] == "insert") {

    $database = new Database();
    $db = $database->connect();
    $username = $_POST['username'];
    $password = $_POST['password'];
    $hashed_pass = password_hash($password, PASSWORD_DEFAULT);

    $con = "INSERT INTO admin ( username,password) VALUES ('$username','$hashed_pass')";
    $result = $db->query($con);
    if (!$result) {
      echo "Could not successfully run query ($con) from DB: $db->error  ";
      exit;
    }
    echo json_encode("inserted");
  };

  if ($_POST['type'] == "verify") {
    if (
      !isset($_POST['username']) &&
      !isset($_POST['password']) &&
      empty($_POST['username']) &&
      empty($_POST['password'])
    ) {
      echo json_decode("notValid");
    } else {
      $database = new Database();
      $db = $database->connect();

      $username = $_POST["username"];
      $password = $_POST["password"];
      $sql = "SELECT username,password FROM admin WHERE  username = ?   ";
      $stmt = mysqli_stmt_init($db);
      if (!mysqli_stmt_prepare($stmt, $sql)) {
        echo json_decode("notValid");
      }
      mysqli_stmt_bind_param($stmt, "s", $username);
      mysqli_stmt_execute($stmt);
      $res = mysqli_stmt_get_result($stmt);
      if ($row = mysqli_fetch_assoc($res)) {
        $pwdhashed = $row['password'];
        $checkpwd = password_verify($password, $pwdhashed);
        if ($checkpwd === false) {
          echo json_encode("notValid");
        } else if ($checkpwd === true) {
          echo json_encode("valid");
        }
      } else {
        echo json_encode("notValid");
      }
      if ($res == null) {
        echo json_encode("notValid");
      }
    }
  }
  // }
}