<?php
// get request parms
$request = "category";
$failed = false;

require_once('config_category.php');

// if database connection failed then return error
if ( $failed ) {
	return $returnVal;
}

$stmt = $link->prepare("SELECT Id, movieTitle, year FROM categories where id > ? order by movieTitle limit ?");
$stmt->bind_param("ii", $requestId, $requestCount);

// set parameters and execute
$requestId = $_GET['id'];
$requestCount = $_GET['count'];
if ($requestCount == "") {
	$requestCount = 1;
}

if (!($stmt->execute() )) {
	// echo "execute failed. error: ".$link->error;
}

if (!($stmt->bind_result( $rowId, $rowMovie, $rowYear)) ) {
	// echo "bind result failed. error: ".$link->error;
}

// // prepare return object
$returnVal = array( $request, array( "code" => "success", "message" => "success"), array() );

while ( $stmt->fetch() ) {
	$returnVal[2][] = array( "id" => $rowId, "title" => $rowMovie, "year" => $rowYear );
}

//var_dump( json_encode($returnVal) );
print json_encode($returnVal);
?>
