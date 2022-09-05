<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
class Database{
  private $host = "localhost";
  private $db_name = "text";
  private $username = "root";
  private $password = "";
  private $link;
  public function connect (){
    $this->link = null;
    $this->link = new mysqli("localhost", "root", "", "ebooks");
    if ($this->link->connect_error) {  die("error could not connect. " . $this->link->connect_error); }
    return $this->link;
  }
}
