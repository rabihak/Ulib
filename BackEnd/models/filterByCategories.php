<?php

include_once '../config/database.php';
$database = new Database();
$db = $database->connect();


$catid = $_POST["catid"];

$con = "SELECT  DISTINCT id,title,author,description,Price,imgurl FROM ebook NATURAL JOIN namecat NATURAL JOIN category 
        WHERE namecat.catid=$catid AND namecat.bookid= ebook.id;";
$ebooks = [];

$result2 = $db->query($con);
if (!$result2) {
  echo "Could not successfully run query ($con) from DB: ";
  exit;
}
if ($result2->num_rows > 0) {
  $i = 0;
  // echo fetch_assoc();
  while ($row = $result2->fetch_assoc()) {
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
}


echo json_encode($ebooks);