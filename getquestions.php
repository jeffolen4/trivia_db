<?php
// get request parms
$request = "get-questions";
$failed = false;

require_once('config_category.php');

// if database connection failed then return error
if ( $failed ) {
	print json_encode($returnVal);
	return;
}

if ( !($stmt = $link->prepare("SELECT a.categoryId, a.question, a.id
											from questions a
											where a.id >= ?
											and   a.categoryId = ?
											order by a.id")
										)) {
	$returnVal = array( $request, array( "code" => "error", "message" => 'SQL prepare failed. Error: '. $link->error), array() );
	print json_encode($returnVal);
	return;
}

$stmt->bind_param("ii", $requestId, $requestCategoryId );

// set parameters and execute
//$requestId = $_GET['id'];
// var_dump($_POST);
// return;

$requestId = (int) $_POST['startid'];
$requestCategoryId = (int) $_POST['catid'];

// $requestId = (int) $_GET['id'];
// $requestCategoryId = (int) $_GET['catid'];


if (!($stmt->execute() )) {
	$returnVal = array( $request, array( "code" => "error", "message" => 'SQL insert failed. Error: '. $link->error), array() );
	print json_encode($returnVal);
	return;
}

if (!($stmt->bind_result( $rowCategoryId, $rowQuestion, $rowId )) ) {
	 echo "bind result failed. error: ".$link->error;
}

// // prepare return object
$returnVal = array( $request, array( "code" => "success", "message" => "success"), array() );

while ( $stmt->fetch() ) {

	$returnVal[2][] = array( "id"          => $rowId,
	 											    "question"   => $rowQuestion,
														"categoryId" => $rowCategoryId
														);

}

// var_dump( json_encode($returnVal) );
print json_encode($returnVal);
?>
