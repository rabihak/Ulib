<?php
include_once '../config/database.php';
$database = new Database();
$db = $database->connect();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
  class category
  {
    public $catid = [];
    public $name = [];

    public $num = [];
  }
  $category = new category();
  $con = "SELECT catid,name FROM category";
  $result = $db->query($con);
  if (!$result) {
    echo "Could not successfully run query ($con) from DB: ";
    exit;
  }
  if ($result->num_rows > 0) {
    $i = 0;
    while ($row = $result->fetch_assoc()) {
      $category->catid[$i] = $row['catid'];
      $category->name[$i] = $row['name'];

      $idss = $row["catid"];
      $con1 = "SELECT DISTINCT COUNT(bookid) FROM namecat WHERE catid=$idss";
      $result1 = $db->query($con1);
      if (!$result1) {
        echo "Could not successfully run query ($con1) from DB: ";
        exit;
      }
      if ($result1->num_rows > 0) {
        $j = 0;
        while ($row1 = $result1->fetch_assoc()) {
          // $category->num[$i]= $row['bookid']
          $category->num[$i][$j] = $row1["COUNT(bookid)"];
          $j++;
        }
      }


      $i++;
    }
  }

  echo json_encode($category);
}