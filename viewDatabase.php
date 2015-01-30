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

$query = "SELECT * from ".$_GET['db'] ." LIMIT 5";

print "query: ".$query."<br>";


if ($result = $link->query($query)) {

    /* Get field information for all columns */
    $finfo = $result->fetch_fields();

    print "<br>";

    foreach ($finfo as $val) {
        print "<br>";
        printf("Name:     %s\n <br>", $val->name);
        printf("Table:    %s\n <br>", $val->table);
        printf("max. Len: %d\n <br>", $val->max_length);
        printf("Flags:    %d\n <br>", $val->flags);
        printf("Type:     %d\n <br>", $val->type);
    }


    while ( $row = $result->fetch_assoc() ) {
      var_dump($row);
    }
    
    $result->close();
} else {
  print "query failed. error: ".$link->error;
}

/* close connection */
$link->close();

?>
