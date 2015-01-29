$(document).ready( function () {

  var xmlhttp = ajaxTools.xmlhttp;

  // var GetXmlHttpObject = ajaxTools.GetXmlHttpObject;
  var handleResponse = ajaxTools.handleResponse;
  var updateQuestion = ajaxTools.updateQuestion;

  var editQuestion = $("#info-question");
  var editAnswer1 = $("#info-answer1");
  var editAnswer2 = $("#info-answer2");
  var editAnswer3 = $("#info-answer3");
  var editAnswer4 = $("#info-answer4");

  function gup( name, url ) {
    if (!url) url = location.href
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
  }

  var mode = "add";
  var parmQuestionId = gup('id', window.location.href );
  var parmTitle = gup('title', window.location.href );

  $("#movie-name").text(parmTitle);

  if ( parmQuestionId !== null ) {
    loadQuestion( parmQuestionId );
    editQuestion = ajaxTools.currentQuestion.question;
    editAnswer1  = ajaxTools.currentQuestion.answer1;
    editAnswer2  = ajaxTools.currentQuestion.answer2;
    editAnswer3  = ajaxTools.currentQuestion.answer3;
    editAnswer4  = ajaxTools.currentQuestion.answer4;
    $("#upd-question").removeClass("hidden");
    mode = "upd";
  } else {
    $("#add-question").removeClass("hidden");
    mode = "add";
  }


  $("#add-question").click( function (event) {
    var errorFound = false;
    $(".error").hide();

    if ( editQuestion.val() === "" ) {
      $("#err-question-blank").show();
      errorFound = true;
    }
    if ( editAnswer1.val() === "" ) {
      $("#err-answer1-blank").show();
      errorFound = true;
    }
    if ( editAnswer2.val() === "" ) {
      $("#err-answer2-blank").show();
      errorFound = true;
    }
    if ( editAnswer3.val() === "" ) {
      $("#err-answer3-blank").show();
      errorFound = true;
    }
    if ( editAnswer4.val() === "" ) {
      $("#err-answer4-blank").show();
      errorFound = true;
    }

    if (!(errorFound)) {
      var rc = updateQuestion( mode,
                      editQuestion.val(),
                      editAnswer1.val(),
                      editAnswer2.val(),
                      editAnswer3.val(),
                      editAnswer4.val(),
                      parmQuestionId,
                      parmTitle  );
      $("#result-message").text(rc);
    }
  });

})
