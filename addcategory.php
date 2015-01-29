<?php
// get request parms
$request = "add-category";
$failed = false;

require_once('config_category.php');

// if database connection failed then return error
if ( $failed ) {
	print json_encode($returnVal);
	return;
}

$stmt = $link->prepare("INSERT into categories ( movieTitle, year ) values (?, ?) ");
$stmt->bind_param("si", $requestTitle, $requestYear);

// set parameters and execute
$requestTitle = $_GET['movie'];
$requestYear = $_GET['year'];

if (!($stmt->execute() )) {
	$returnVal = array( $request, array( "code" => "error", "message" => 'SQL insert failed. Error: '. $link->error), array() );
	print json_encode($returnVal);
	return;
}

// // prepare return object
$returnVal = array( $request, array( "code" => "success", "message" => "success"), array() );

$returnVal[2][] = array( "id" => $link->insert_id, "title" => $requestTitle, "year" => $requestYear );

//var_dump( json_encode($returnVal) );
print json_encode($returnVal);
?>
