<?php

$name = $_REQUEST['name'] ;
$family_name = $_REQUEST['family_name'] ;
$email = $_REQUEST['email'] ;
$phone = $_REQUEST['phone'] ;
$subject = $_REQUEST['subject'] ;
$message = $_REQUEST['message'] ;

$mailheaders  = "MIME-Version: 1.0\r\n";
$mailheaders .= "Content-type: text/plain; charset=UTF-8\r\n";
$mailheaders .= "From: <$email>\r\n";
$mailheaders .= "Reply-To: $email <$email>\r\n"; 
$body = '
שם: '.$name.'
משפחה: '.$family_name.'
טלפון: '.$phone.'
אימייל: '.$email.'
נושא: '.$subject.'
	
ההודעה:
'.$message.'
	
|---------סוף ההודעה----------|'; 

$sent = mail("contact@2seat.co.il", "$subject", $body, $mailheaders) ;
if($sent)
{print "<script>";
print " self.location='sent.html';";
print "</script>"; }
else
{print "We encountered an error sending your mail"; }
?>
