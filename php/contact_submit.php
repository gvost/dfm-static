<?php
  // HANDLES SUBMISSIONS ON THE CONTACT PAGE

  // this won't be necessary on the production server
  // header("Access-Control-Allow-Origin: *");

  // get contents of the GET array
  $name = $_GET['firstname'] . " " . $_GET['lastname'];
  $email = $_GET['email'];
  $phone = $_GET['phone'];
  $project = $_GET['project'];
  //$find = $_GET['find']; 
  $norobot = $_GET['nr'];
  if(strtolower(trim($norobot)) != 'norobot')
  {
    echo "PLEASE ENTER IN 'NOROBOT'";
    die();
  }

  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Invalid email address. Please try again.";
    die();
  }

  $headers = 'From: info@drawingfrommemory.com' . "\r\n" .
    'Reply-To: ' . $_GET['email'] . "\r\n" .
    'X-Mailer: PHP/' . phpversion();
  //ini_set('display_errors', 1);
  error_reporting(E_ALL);
  // construct email
  //$recipient = "jordan@drawingfrommemory.com, rebecca@drawingfrommemory.com, jake.mensch@gmail.com";
  $recipient = "jordan@drawingfrommemory.com, rebecca@drawingfrommemory.com, jen@drawingfrommemory.com, sharon@drawingfrommemory.com";
  $subject = "DFM site contact";
  //Find: $find   
  $body = <<<MESSAGE

Name: $name
Email: $email
Phone: $phone

Project: $project


MESSAGE;
  
  // send email
  if(mail(
    $recipient, 
    $subject, 
    wordwrap($body, 70, "\r\n"),
    $headers
  )){
  // for testing only
  file_put_contents("email.txt", $subject . "\n" . $body . $headers); 

  echo "Thanks, we'll be in touch.";
  }else
  {
    echo "Sorry, we were unable to send your email.";
  }
?>