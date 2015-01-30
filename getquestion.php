<?php
// get request parms
$request = "get-question";
$failed = false;

require_once('config_category.php');

// if database connection failed then return error
if ( $failed ) {
	print json_encode($returnVal);
	return;
}

if ( !($stmt = $link->prepare("SELECT a.categoryId, a.question, b.correct, b.answer, c.movieTitle
											from questions a
											inner join answers b on a.id = b.questionId
											inner join categories c on a.categoryId = c.id
											where a.id = ?
											order by b.correct desc")
										)) {
	$returnVal = array( $request, array( "code" => "error", "message" => 'SQL prepare failed. Error: '. $link->error), array() );
	print json_encode($returnVal);
	return;
}

$stmt->bind_param("i", $requestId );

// set parameters and execute
//$requestId = $_GET['id'];
//var_dump($_POST);
//return;

$requestId = (int) $_POST['id'];

if (!($stmt->execute() )) {
	$returnVal = array( $request, array( "code" => "error", "message" => 'SQL insert failed. Error: '. $link->error), array() );
	print json_encode($returnVal);
	return;
}

if (!($stmt->bind_result( $rowCategoryId, $rowQuestion, $rowCorrect, $rowAnswer, $rowTitle )) ) {
	// echo "bind result failed. error: ".$link->error;
}

// // prepare return object
$returnVal = array( $request, array( "code" => "success", "message" => "success"), array() );

while ( $stmt->fetch() ) {
	$answers[] = $rowAnswer;
}

	$returnVal[2][] = array( "id"        => $rowCategoryId,
														"title"		 => $rowTitle,
	 											    "question" => $rowQuestion,
														"answer1"	 =>	$answers[0],
														"answer2"	 =>	$answers[1],
														"answer3"	 =>	$answers[2],
														"answer4"	 =>	$answers[3]
														);

//var_dump( json_encode($returnVal) );
print json_encode($returnVal);
?>
