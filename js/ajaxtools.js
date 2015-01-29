var ajaxTools = ajaxTools || {};

// function to create the XMLHttp object
ajaxTools.GetXmlHttpObject = function () {
  if (window.XMLHttpRequest)  {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    return new XMLHttpRequest();
  }
  if (window.ActiveXObject)  {
    // code for IE6, IE5
    return new ActiveXObject("Microsoft.XMLHTTP");
  }
  return null;
}

// create the actual XMLHttp object for use later
ajaxTools.xmlhttp = ajaxTools.xmlhttp || ajaxTools.GetXmlHttpObject();

// create the categories object
ajaxTools.categories = ajaxTools.categories || [];
ajaxTools.currentCategory= ajaxTools.currentCategory || {};

// create the question object
ajaxTools.question = ajaxTools.question || [];


// Category return object format:
//   [ "category", {code:"error", message:"test error message"}, {categories:[ {id:1,description:"blah blah blah"}, {id:2, title:"blah2 blah2 blah2", year:1987 } ]} ]
ajaxTools.loadCategory = function ( results ) {
  // handle an error condition
  var status = results[1];
  if (status.code === "error") {
    $(document).getElementById("error-message").text = status.message;
    return;
  }

  // no error. load category object(s)
  categories = results[2];
  ajaxTools.currentCategory = categories[0];
  categories.forEach( function ( val ) {
    ajaxTools.categories.push( val );
    $("#categories").append('<option value="' + val.id + '">' + val.title + ' - ' + val.year + '</option>');
  });
}


/* Handle ajax responses
*/
ajaxTools.handleResponse = function() {
  if (ajaxTools.xmlhttp.readyState==4)  {
    var results = $.parseJSON(ajaxTools.xmlhttp.responseText);
    var responseId = results[0];
    switch( responseId ) {
      case "category" :
        ajaxTools.loadCategory( results );
        break;
      case "add-category" :
        ajaxTools.addCategoryToList( results );
      case "upd-question" :
        ajaxTools.updateQuestionResponse( results );
    }
  }
}

/* Get a list of categories/titles from the DB
*/
ajaxTools.getCategory = function ( startId, count ) {
  var url="getcategory.php?id="+startId;
  if ( count > 1 ) {
    url += "&count="+count;
  }
  // override caching
  url=url+"&sid="+Math.random();

  ajaxTools.xmlhttp.onreadystatechange=ajaxTools.handleResponse;
  ajaxTools.xmlhttp.open("GET",url,true);
  ajaxTools.xmlhttp.send(null);
}


/* Add a new category to the DB
*/
ajaxTools.addCategory = function ( movie, year ) {
  var url="addcategory.php?movie="+encodeURIComponent(movie)+"&year="+year;
  // override caching
  url=url+"&sid="+Math.random();

  ajaxTools.xmlhttp.onreadystatechange=ajaxTools.handleResponse;
  ajaxTools.xmlhttp.open("GET",url,true);
  ajaxTools.xmlhttp.send(null);

}

/* Add categories returned from the DB to the
    drop down list on the display
*/
ajaxTools.addCategoryToList = function( results ) {
  // handle an error condition
  var status = results[1];
  if (status.code === "error") {
    $(document).getElementById("error-message").text = status.message;
    return;
  }

  // no error. load category object(s)
  categories = results[2];
  ajaxTools.currentCategory = categories[0];
  categories.forEach( function ( val ) {
    ajaxTools.categories.push( val );
    $("#categories").append('<option value="' + val.id + '" selected>' + val.title + ' - ' + val.year + '</option>');
  })
}


/* Add/Update a question
*/
ajaxTools.updateQuestion = function ( mode, question, answer1, answer2, answer3, answer4, id, title ) {
  if ( mode === "upd" && id === null ) {
    //fail
    return false;
  }

  // $.ajax({ // ajax call starts
  //   url: 'updatequestion.php',
  //   data: { "mode":mode, "question":question, "answer1":answer1,
  //       "answer2":answer2,"answer3":answer3,"answer4":answer4, "id":id },
  //   dataType: 'text',
  //   success: function(data) {
  //     $("#result-message").text(data);
  //   }
  // });

  question = encodeURIComponent(question);
  answer1 = encodeURIComponent(answer1);
  answer2 = encodeURIComponent(answer2);
  answer3 = encodeURIComponent(answer3);
  answer4 = encodeURIComponent(answer4);
  title = encodeURIComponent(title);

  var url="updatequestion.php?id="+id+"&question="+question+"&answer1="+answer1;
  url += "&answer2="+answer2+"&answer3="+answer3+"&answer4="+answer4+"&title="+title;
  // override caching
  url=url+"&sid="+Math.random();

  ajaxTools.xmlhttp.onreadystatechange=ajaxTools.handleResponse;
  ajaxTools.xmlhttp.open("GET",url,true);
  ajaxTools.xmlhttp.send(null);

}
