<?php

$hostname = "disneytrv.db.5109033.hostedresource.com";
$username = "disneytrv";
$dbname = "disneytrv";

// connect to db
$link = new mysqli($hostname, $username, 'Brooke!202');
if ( $link->connect_errno ) {
	$failed = true;
	$returnVal = array( $request, array( "code" => "error", "message" => "Database connect failed. error: ".$link->connect_error ), array() );
	return;
	// echo "database connect failed. error: ".$link->connect_error	;
}

if (! $link->select_db($dbname) ) {
	$failed = true;
	$returnVal = array( $request, array( "code" => "error", "message" => 'Attempt to USE database '.$dbname.' failed. Error: '. $link->error ), array() );
	return;
}
