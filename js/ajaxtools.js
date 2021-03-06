var ajaxTools = ajaxTools || {};


// create the categories object
ajaxTools.categories = ajaxTools.categories || [];
ajaxTools.currentCategory= ajaxTools.currentCategory || {};

// create the question object
ajaxTools.question = ajaxTools.question || [];
ajaxTools.currentQuestion = ajaxTools.currentQuestion || {};
ajaxTools.parmTitle = ajaxTools.parmTitle || null;



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


  ajaxTools.loadQuestions = function ( startId, categoryId, count, direction ) {
    $.ajax({
      type: "POST",
      url: "getquestions.php",
      data: { "startid": startId, "count":count, "catid": categoryId, "direction":direction }
    })
      .done(function( msg ) {
        // var outputDump = $('<p>'+ msg + '</p>');
        // $(".container").append( outputDump );
        msg = JSON.parse(msg);
        if ( msg[1].code == "success") {
          msg[2].forEach( function (row) {
            ajaxTools.question.push( row );
          });
          ajaxTools.question.forEach( function (row) {
            tableRow = $('<tr><td class="hidden"><input class="editchkbox" type="checkbox" value="'+ row.id +'"></td><td>' + row.question + '</td></tr>');
            tableRow.click( function (event) {
              var row = event.currentTarget.children;
              var id = $(row).children().val()
              url = "add_question.html?title="+encodeURIComponent(ajaxTools.currentCategory.title) +
              "&id="+id;
              window.location = url;

              return false;
            })
            $("tbody").append(tableRow);
          });
        };
      });
  }

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
    newSelectItem = '<option value="' + val.id + '"';
    if ( ajaxTools.parmTitle != null && ajaxTools.parmTitle == val.title ) {
      newSelectItem += " selected";
      ajaxTools.currentCategory = val;
    }
    newSelectItem += '>' + val.title  + '</option>'
    $("#categories").append(newSelectItem);
  });
  ajaxTools.loadQuestions( 1, ajaxTools.currentCategory.id, 10, "FWD" );
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

  $.ajax({
    type: "POST",
    url: "updatequestion.php",
    data: { "id": id, "question":question, "answer1":answer1, "answer2":answer2, "answer3":answer3, "answer4":answer4, "title":title  }
  })
    .done(function( msg ) {
      //var outputDump = $('<p>'+ msg + '</p>');
      //$(".container").append( outputDump );
      msg = JSON.parse(msg);
      if ( msg[1].code == "success") {
        url = "list_category.html?title="+ msg[2][0].title;
        window.location = url;
      }
    });
}
