<?php
include_once '../config/database.php';
$database = new Database();
$db = $database->connect();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
  class category
  {
    public $catid = [];
    public $name = [];
  }
  $category = new category();
  $con = "SELECT catid,name FROM category  ";
  $result = $db->query($con);
  if (!$result) {
    echo "Could not successfully run query ($con) from DB: ";
    exit;
  }
  if ($result->num_rows > 0) {
    $i = 0;
    while ($row = $result->fetch_assoc()) {
      $category->name[$i] = $row["name"];
      $category->catid[$i] =  $row["catid"];
      $i++;
    }
  }
  echo json_encode($category);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

  if ($_POST['type'] == "insert") {
    $name = $_POST["name"];
    $con = "INSERT INTO category (name) VALUES ('$name')";
    $result = $db->query($con);
    if (!$result) {
      echo "Could not successfully run query ($con) from DB: $db->error  ";
      exit;
    } else {
      echo json_encode("inserted");
    }
  }
  if ($_POST['type'] == "delete") {
    $catid = $_POST["catid"];
    $con = "DELETE FROM namecat WHERE (catid=$catid)";

    $con1 = "DELETE FROM category  WHERE (catid=$catid)";
    $result = $db->query($con);
    $result1 = $db->query($con1);

    if (!$result) {
      echo "Could not successfully run query ($con) from DB: $db->error  ";
      exit;
      if (!$result1) {
        echo "Could not successfully run query ($con1) from DB: $db->error  ";
        exit;
      } else {
        echo "Valid";
      }
    }
  }
  if ($_POST['type'] == "edit") {

    $catid = $_POST["catid"];
    $name = $_POST["name"];

    $con = "UPDATE category  SET name ='$name' WHERE catid=$catid ";
    $result = $db->query($con);
    if (!$result) {
      echo "Could not successfully run query ($con) from DB: $db->error  ";
      exit;
    }
  }
}