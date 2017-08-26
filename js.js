var sheetURL = "https://sheets.googleapis.com/v4/spreadsheets/1KTv54urT87_WelAXlEWk8ULr0ADBAa87LNHGZB4skvc/values/Sheet1?key=AIzaSyAcsLdmdmsWW35wIj9byeWD7RcXyOXYe8I"

var games = {};
var allProperties = [];
var propids = {};
var selectedProperties = [];

function onload() {
    requestSheet();
}

function requestSheet() {
    $.get(sheetURL)
        .done(loadSuccess)
        .fail(loadFail);
}

function loadSuccess(data) {
    console.log("Connected to Sheets");
    gameData = data.values;
    processGameData(gameData);
}

function loadFail(data) {
    console.log("Error connecting to Sheets");
    console.log(data);
}

function processGameData(data) {
    // Gets the list of allProperties
	for (var i = 1; i < data[0].length; i++) {
        var prop = data[0][i];
        allProperties.push(prop);
	}

    for(var i = 1; i < data.length; i++) {
		var game = data[i][0];

		games[game] = {};
		for (var j = 0; j < allProperties.length; j++) {
			var property = allProperties[j];
			var currentPropVal = data[i][1+j];
			games[game][property] = currentPropVal === "TRUE" ? true : false;
		}
    }
	console.log(games);

    addFilters();
    addGames();
}

function addGames() {
    for(game in games) {
        addGameToTable(game);
    }
}


function addFilters() {
    var regProps = [];
    var personProps = [];

    for (var i = 0; i < allProperties.length; i++) {
        prop = allProperties[i];
        if (prop.indexOf("Person") !== -1) {
            personProps.push(prop);
        } else {
            regProps.push(prop);
        }
    }

    for (var i = 0; i < regProps.length; i++) {
        prop = regProps[i];
        var x = "" + i;
        propids[prop] = x;

        $('#reg_filters')
            .append('<label class="btn btn-secondary" propid="' + x + '">\n' +
                '<input type="checkbox" autocomplete="off" value="' + prop
                    + '"> ' + prop + '\n' +
                '</label>')
    }

    for (var i = 0; i < personProps.length; i++) {
        prop = personProps[i];
        var x = "p" + i;
        propids[prop] = x;

        $('#person_filters')
            .append('<label class="btn btn-secondary" propid="' + x + '">\n' +
                '<input type="checkbox"autocomplete="off" value="' + prop
                    + '"> ' + prop + '\n' +
                '</label>')
    }

    // Add filter logic
    $('.filters label').click(function() {
        onChange($(this).children().attr('value'), !$(this).hasClass('active'));
    });

    // Only one person filter at once
	$('#person_filters label').click(function () { 
        var clickedProp = $(this).children().attr('value');

        $(this).parent('div').children('label').each(function () {
            var otherProp = $(this).children().attr('value');
            if (clickedProp != otherProp && $(this).hasClass('active')) {
                $(this).removeClass('active');
                onChange(otherProp, false);
            }
        });
	});
}

function onChange(property, checked) {
    if (checked) {
        if (selectedProperties.indexOf(property) <= -1) {
            selectedProperties.push(property);
        }
    } else {
        if (selectedProperties.indexOf(property) > -1) {
            selectedProperties = selectedProperties.filter(p => p !== property);
        }
    }
    updateTable();
}

function updateTable() {
    $('#game_table tbody tr').remove();

    for (game in games) {
        var props = games[game];
        var match = true;

        for (property in props) {
            var propVal = props[property];
            
            // If the property is selected, and the game doesn't have it,
            // set match to false
            if (selectedProperties.indexOf(property) > -1) {
                if (propVal) {
                    match = true;
                } else {
                    match = false;
                    break;
                }
            }
        }

        if (match) {
            addGameToTable(game);
        }
    }
}

function addGameToTable(game) {
    var propDivs = "";

    for (prop in games[game]) {
        if (games[game][prop]) {
            var i = allProperties.indexOf(prop);
            propDivs += "<button class='prop-tip btn btn-secondary btn-sm' type='button' " +
                " propid='" + propids[prop] + "' disabled>" + prop + "</button>";
        }
    }

    $('#game_table > tbody:last-child').append('<tr><td><span>' + game + '</span>'
        + propDivs + '</td></tr>');
}
