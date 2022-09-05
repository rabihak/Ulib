<?php

include_once '../config/database.php';
$database = new Database();
$db = $database->connect();


if ($_SERVER["REQUEST_METHOD"] == "GET") {


  $ebooks = [];
  $con = "SELECT id,title,author,description,Price,imgurl FROM ebook  ";
  $result = $db->query($con);
  if (!$result) {
    echo "Could not successfully run query ($con) from DB: ";
    exit;
  }
  if ($result->num_rows > 0) {
    $i = 0;
    while ($row = $result->fetch_assoc()) {
      // $ebook->imgurl[$i] = $row["imgurl"];


      $path = $row["imgurl"];
      $ebooks[$i]["id"] = $row["id"];
      $ebooks[$i]["title"] = $row["title"];
      $ebooks[$i]["author"] = $row["author"];
      $ebooks[$i]["description"] = $row["description"];
      $ebooks[$i]["price"] = $row["Price"];
      // $ebooks[$i]["imgurl"] = getcwd();
      $ebooks[$i]["imgurl"] = "/Ulib/BackEnd/models";
      $ebooks[$i]["imgurl"] .= $path;

      $ids = $row["id"];
      $con1 = "SELECT DISTINCT catid,name FROM ebook NATURAL JOIN namecat  NATURAL JOIN category WHERE bookid=$ids ";
      $result1 = $db->query($con1);


      if (!$result1) {
        echo "Could not successfully run query ($con1) from DB: ";
        exit;
      }
      if ($result1->num_rows > 0) {
        $j = 0;
        while ($row1 = $result1->fetch_assoc()) {

          $ebooks[$i]["category"][$j] = $row1["name"];
          $ebooks[$i]["catid"][$j] = $row1["catid"];

          $j++;
        }
      }
      $i++;
    }
    // echo json_encode($ebook);
    echo json_encode($ebooks);
    // echo json_encode($ebook);
  }
}
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if ($_POST['type'] == "insert") {
    if ($_FILES["file"]["name"] != '') {

      $title = $_POST["title"];
      $author = $_POST["author"];
      $description = $_POST["description"];
      $Price = $_POST["Price"];
      // $catids = $_POST["catid"];


      // $test = explode('.', $_FILES["file"]["name"]);
      // $ext = end($test);
      // $test = substr($_FILES["file"]["name"], 0, 3);
      // $name = rand(1000, 9999) . $test .  $ext;
      $name = rand(1000, 9999) . $_FILES["file"]["name"];

      $location = '.\Images\\' . $name;
      $outputLoc = '\\Images\\' . $name;
      $outputLoc = addslashes($outputLoc);
      move_uploaded_file($_FILES["file"]["tmp_name"], $location);


      $con = "INSERT INTO ebook (title,author,description,Price,imgurl) VALUES ('$title','$author','$description','$Price','$outputLoc')";
      $result = $db->query($con);
      if ($result) {
      }
      if (!$result) {
        echo "Could not successfully run query ($con) from DB: $db->error  ";
        exit;
      }
    }
  }

  if ($_POST['type'] == "relation") {

    $bookid = $_POST["bookid"];
    $catids = $_POST["catid"];
    $catids = json_decode($catids);
    $con = "INSERT INTO namecat (bookid,catid) VALUES ('$bookid',$catids)";
    $result = $db->query($con);
    if (!$result) {
      echo "Could not successfully run query ($con) from DB: $db->error  ";
      exit;
    } else {
      echo "done";
    }
  }

  if ($_POST['type'] == "delete") {

    $bookid = $_POST["bookid"];
    $con = "DELETE FROM namecat WHERE bookid=$bookid";

    $con1 = "DELETE FROM ebook WHERE id=$bookid";
    $result = $db->query($con);
    $result1 = $db->query($con1);

    if (!$result) {
      echo "Could not successfully run query ($con) from DB: $db->error  ";
      exit;
      if (!$result1) {
        echo "Could not successfully run query ($con1) from DB: $db->error  ";
        exit;
      } else {
        echo true;
      }
    }
  }

  if ($_POST['type'] == "edit") {

    $title = $_POST["title"];
    $author = $_POST["author"];
    $description = $_POST["description"];
    $Price = $_POST["Price"];
    $id = $_POST["id"];


    $test = explode('.', $_FILES["file"]["name"]);
    echo json_encode($_FILES["file"]["name"]);

    $ext = end($test);
    $name = rand(100, 999) . '.' . $ext;
    $location = '.\Images\\' . $name;
    $outputLoc = '\\Images\\' . $name;
    $outputLoc = addslashes($outputLoc);
    move_uploaded_file($_FILES["file"]["tmp_name"], $location);
    echo json_encode($outputLoc);
    $con = "UPDATE ebook  SET title ='$title', author ='$author', description ='$description' , Price ='$Price', imgurl='$outputLoc'  WHERE id=$id ";
    $result = $db->query($con);
    if (!$result) {
      echo "Could not successfully run query ($con) from DB: $db->error  ";
      exit;
    }
  }
}