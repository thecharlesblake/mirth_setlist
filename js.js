var sheetURL = "https://sheets.googleapis.com/v4/spreadsheets/1KTv54urT87_WelAXlEWk8ULr0ADBAa87LNHGZB4skvc/values/Sheet1?key=AIzaSyAcsLdmdmsWW35wIj9byeWD7RcXyOXYe8I"

function onload() {
    init();
    requestSheet();
}

function init() {
}

function requestSheet() {
    $.get(sheetURL)
        .done(loadSuccess)
        .fail(loadFail);
}

function loadSuccess(data) {
    console.log("Connected to Sheets");
    gameData = data.values;
    fillTable(gameData);
}

function loadFail(data) {
    console.log("Error connecting to Sheets");
    console.log(data);
}

function fillTable(data) {
	var properties = [];
	for (var i = 1; i < data[0].length; i++) {
		properties.push(data[0][i]);
	}

    var games = {};
    for(var i = 1; i < data.length; i++) {
		var game = data[i][0];
		$('#game_table > tbody:last-child').append('<tr><td>' + game + '</td></tr>');

		games[game] = {};
		for (var j = 0; j < properties.length; j++) {
			var property = properties[j];
			var currentPropVal = data[i][1+j];
			games[game][property] = currentPropVal === "TRUE" ? true : false;
		}
    }
	console.log(games);
}
