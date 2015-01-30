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

$requestId = (int) $_POST['id'];
// $requestId = (int) $_GET['id'];


if ( $requestId == 0 ) {
	$stmt = $link->prepare("INSERT into questions ( categoryId, question ) values (
		( select id from categories where movieTitle = ?) , ?)");
		$stmt->bind_param("ss", $requestTitle, $requestQuestion);
} else {
	$stmt = $link->prepare("UPDATE questions set question = ? where id = ?");
	$stmt->bind_param("si", $requestQuestion, $requestId );
}


// set parameters and execute
$requestQuestion = $_POST['question'];
$requestAnswers[0] = $_POST['answer1'];
$requestAnswers[1] = $_POST['answer2'];
$requestAnswers[2] = $_POST['answer3'];
$requestAnswers[3] = $_POST['answer4'];
$requestTitle = $_POST['title'];

// $requestQuestion = $_GET['question'];
// $requestAnswers[0] = $_GET['answer1'];
// $requestAnswers[1] = $_GET['answer2'];
// $requestAnswers[2] = $_GET['answer3'];
// $requestAnswers[3] = $_GET['answer4'];
// $requestTitle = $_GET['title'];


if (!($stmt->execute() )) {
	$returnVal = array( $request, array( "code" => "error", "message" => 'SQL insert failed. Error: '. $link->error), array() );
	print json_encode($returnVal);
	return;
}

if ( $requestId != 0 ) {
	if (!($stmt3 = $link->prepare("DELETE from answers where questionId = ?"))) {
		$returnVal = array( $request, array( "code" => "error", "message" => 'SQL prepare delete answers failed. Error: '. $link->error), array() );
		print json_encode($returnVal);
		return;
	}

	if (!($stmt3->bind_param("i", $requestId ))) {
		$returnVal = array( $request, array( "code" => "error", "message" => 'SQL delete answers bind_param failed. Error: '. $link->error), array() );
		print json_encode($returnVal);
		return;
	}

	if (!($stmt3->execute() )) {
		$returnVal = array( $request, array( "code" => "error", "message" => 'SQL delete answers failed. Error: '. $link->error), array() );
		print json_encode($returnVal);
		return;
	}

}

if (!($stmt2 = $link->prepare("INSERT into answers ( questionId, correct, answer ) values (?, ?, ?)"))) {
	$returnVal = array( $request, array( "code" => "error", "message" => 'SQL prepare insert answers failed. Error: '. $link->error), array() );
	print json_encode($returnVal);
	return;
}

if ( !($stmt2->bind_param("iis", $questionId, $correctFlag, $answer ) )){
	$returnVal = array( $request, array( "code" => "error", "message" => 'SQL insert answers bind_param failed. Error: '. $link->error), array() );
	print json_encode($returnVal);
	return;
}

if ($requestId == 0) {
	$questionId = $link->insert_id;
} else {
	$questionId = $requestId;
}

$correctFlag = 1;

for ($i=0; $i <= 3; $i++ ) {
	$answer = $requestAnswers[$i];
	if (!($stmt2->execute() )) {
		$returnVal = array( $request, array( "code" => "error", "message" => 'SQL insert answers failed. Error: '. $link->error), array() );
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
