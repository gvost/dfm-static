<?php
  // HANDLES SUBMISSIONS ON THE CONTACT PAGE

  // this won't be necessary on the production server
  header("Access-Control-Allow-Origin: *");

  // get contents of the post array
  $name = $_POST['firstname'] . " " . $_POST['lastname'];
  $email = $_POST['email'];
  $phone = $_POST['phone'];
  $project = $_POST['project'];
  $find = $_POST['find']; 

  // construct email
  $recipient = "jake.mensch@gmail.com";
  $subject = "DFM site contact";
  $body = <<<MESSAGE

Name: $name
Email: $email
Phone: $phone

Project: $project
Find:  $find   

MESSAGE;
  
  // send email
  mail(
    $recipient, 
    $subject, 
    wordwrap($body, 70, "\r\n")
  );

  // for testing only
  file_put_contents("email.txt", $subject . "\n" . $body); 

  echo "Thanks, we'll be in touch.";
?>