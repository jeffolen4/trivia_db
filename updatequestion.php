<?php
// get request parms
$request = "upd-question";
$failed = false;

require_once('config_category.php');

// if database connection failed then return error
if ( $failed ) {
	print json_encode($returnVal);
	return;
}

$stmt = $link->prepare("INSERT into questions ( categoryId, question ) values (
	( select id from categories where movieTitle = ?) , ?)");
$stmt->bind_param("ss", $requestTitle, $requestQuestion);

// set parameters and execute
$requestId = $_GET['id'];
$requestQuestion = $_GET['question'];
$requestAnswers[0] = $_GET['answer1'];
$requestAnswers[1] = $_GET['answer2'];
$requestAnswers[2] = $_GET['answer3'];
$requestAnswers[3] = $_GET['answer4'];
$requestTitle = $_GET['title'];

if (!($stmt->execute() )) {
	$returnVal = array( $request, array( "code" => "error", "message" => 'SQL insert failed. Error: '. $link->error), array() );
	print json_encode($returnVal);
	return;
}

$stmt2 = $link->prepare("INSERT into answers ( questionId, correct, answer ) values (?, ?, ?)");
$stmt2->bind_param("iis", $questionId, $correctFlag, $answer );

$questionId = $link->insert_id;
$correctFlag = 1;

for ($i=0; $i <= 3; $i++ ) {
	$answer = $requestAnswers[$i];
	if (!($stmt2->execute() )) {
		$returnVal = array( $request, array( "code" => "error", "message" => 'SQL insert failed. Error: '. $link->error), array() );
		print json_encode($returnVal);
		return;
	};
	$correctFlag = 0;
}

// // prepare return object
$returnVal = array( $request, array( "code" => "success", "message" => "success"), array() );

$returnVal[2][] = array( "id" => $questionId );

//var_dump( json_encode($returnVal) );
print json_encode($returnVal);
?>
