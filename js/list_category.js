$(document).ready( function () {

  var xmlhttp = ajaxTools.xmlhttp;

  // var GetXmlHttpObject = ajaxTools.GetXmlHttpObject;
  var handleResponse = ajaxTools.handleResponse;
  var getCategory = ajaxTools.getCategory;
  var addCategory = ajaxTools.addCategory;

  var PAGE_SIZE  = 10;
  var FORWARD = 'FWD';
  var BACKWARD = 'BKW';
  var currentPage = 1;

  var newMovie = $("#movie");
  var newYear = $("#year");

  function gup( name, url ) {
    if (!url) url = location.href
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
  }

  ajaxTools.parmTitle = decodeURIComponent(gup('title', window.location.href ));

  // load the initial categories
  getCategory( 0, 999 );

  // loadQuestions( 1, ajaxTools.currentCategory.id, PAGE_SIZE, FORWARD );

  $("#categories").change( function (event) {
    var categoryId = $("#categories option:selected").val();
    var categoryTitle = $("#categories option:selected").text();
    ajaxTools.currentCategory.id = categoryId;
    ajaxTools.currentCategory.title = categoryTitle;
    ajaxTools.question = [];
    $("tbody > tr").remove();
    ajaxTools.loadQuestions( 1, categoryId, PAGE_SIZE, FORWARD );
  })

  $("#add-category").click( function (event) {
    if ( newMovie.val() !== "" && newYear.val() !== "" && parseInt(newYear.val()) !== NaN ) {
      addCategory( newMovie.val(), newYear.val() );
    }
    newMovie.val("");
    newYear.val("");
    return false;
  });

  $("#add-question").click( function (event) {
    url = "add_question.html?title="+encodeURIComponent(ajaxTools.currentCategory.title);
    window.location = url;
  })

})
