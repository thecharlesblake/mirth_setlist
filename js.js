var sheetURL = "https://sheets.googleapis.com/v4/spreadsheets/1KTv54urT87_WelAXlEWk8ULr0ADBAa87LNHGZB4skvc/values/Sheet1?key=AIzaSyAcsLdmdmsWW35wIj9byeWD7RcXyOXYe8I"

function onload() {
  requestSheet();
}

function requestSheet() {
  var jqxhr = $.get(sheetURL)
    .done(function(data) {
      alert("success");
      console.log(data);
    })
    .fail(function() {
      alert( "error" );
    });
}
