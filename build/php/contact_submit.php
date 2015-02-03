<?php
  // HANDLES SUBMISSIONS ON THE CONTACT PAGE

  // this won't be necessary on the production server
  // header("Access-Control-Allow-Origin: *");

  // get contents of the GET array
  $name = $_GET['firstname'] . " " . $_GET['lastname'];
  $email = $_GET['email'];
  $phone = $_GET['phone'];
  $project = $_GET['project'];
  $find = $_GET['find']; 

  // construct email
  $recipient = "jen@drawingfrommemory.com, sharon@drawingfrommemory.com";
  $subject = "DFM site contact";
  $body = <<<MESSAGE

Name: $name
Email: $email
Phone: $phone

Project: $project
Find: $find   

MESSAGE;
  
  // send email
  mail(
    $recipient, 
    $subject, 
    wordwrap($body, 70, "\r\n")
  );

  // for testing only
 // file_put_contents("email.txt", $subject . "\n" . $body); 

  echo "Thanks, we'll be in touch.";
?>