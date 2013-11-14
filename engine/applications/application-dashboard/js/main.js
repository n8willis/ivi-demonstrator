//Initialize function
/** 
 * @module Dashboard
 */

/**
 * Reference to instance of CarIndicator class object
@property carInd {Object}
 */
var carInd;
/**
 * Reference to instance of ThemeEngine class object
 * @property te {Object}
 */
var te;
/**
 * Holds JSON string of theme
 * @property prevTheme {String}
 */
var prevTheme;

var interval_ID;
var prevCarInd;

/** 
 * Class which provides methods to initialize user interface and create events listeners for theme changes and car indicators. 
 * @class init
 * @constructor
 */
var init = function () {
	$("#topBarIcons").topBarIconsPlugin('init', 'dashboard');
	$("#clockElement").ClockPlugin('init', 5);
	$("#clockElement").ClockPlugin('startTimer');

	$("#weatherCaption").boxCaptionPlugin('init', 'weather');
	$("#batteryLevelCaption").boxCaptionPlugin('init', 'Battery level');

	$("#batteryProgressBar").progressBarPlugin('init', 'progressBar');
	$("#batteryProgressBar").progressBarPlugin('setPosition', 82);

	$("#avgEConsumption").boxCaptionPlugin('init', 'avg e-consumtion');
	$("#rearLDisplay").boxCaptionPlugin('init', 'Rear l Display');
	$("#rearRDisplay").boxCaptionPlugin('init', 'Rear r Display');

	$('#bottomPanel').bottomPanel('init');

	try {
		$("#leftFrontPressure").statusBoxPlugin('init', 'PRESSSURE LEVEL', 'L FRONT TIRE', 'OK');
		$("#rightFrontPressure").statusBoxPlugin('init', 'PRESSSURE LEVEL', 'R FRONT TIRE', 'ok');

		$("#leftRearPressure").statusBoxPlugin('init', 'PRESSSURE LEVEL', 'L Rear TIRE', 'OK');
		$("#rightRearPressure").statusBoxPlugin('init', 'PRESSSURE LEVEL', 'R Rear TIRE', 'ok');
	} catch (err) {
		$('#error').html(err.message);
		console.log(err.message);
	}

	if (typeof ThemeEngine != 'undefined') {
		te = new ThemeEngine();
		te.addStatusListener(function (aData) {
			window.location.reload();
		});
	} else {
		console.error("ThemeEngine API is not available, please start IVI server.");
	}

	te.getUserThemes(function (jsonString) {
		prevTheme = jsonString;
		console.log("prevTheme " + prevTheme);
	});

	if (typeof CarIndicator != 'undefined') {
		carInd = new CarIndicator();
		carInd.getStatus(carInd.evaluate);
		carInd.addStatusListener(carInd.evaluate);
	} else {
		console.error("CarIndicator API is not available, please start IVI server.");
	}
	$("#randomizer").bind('click', function () {
		var newStatus = !dashBoardControler.Randomizer;
		console.log('randomizer ' + newStatus);
		carInd.setRandomizeStatus(newStatus.toString(), '3000', function () {});
		dashBoardControler.onRandomizerClick(newStatus);

	});
	$("#fanButton").bind('click', function () {
		var newStatus = !dashBoardControler.FanStatus;
		carInd.setStatus("fan", "", newStatus.toString(), function () {});
		dashBoardControler.onFanButtonClick(newStatus.toString());
	});
	$("#frontLightsButton").bind('click', function () {
		var newStatus = !dashBoardControler.FrontLightsStatus;
		carInd.setStatus("frontLights", "", newStatus.toString(), function () {});
		dashBoardControler.onFrontLightsButtonClick(newStatus.toString());
	});
	$("#rearLightsButton").bind('click', function () {
		var newStatus = !dashBoardControler.RearLightsStatus;
		carInd.setStatus("rearLights", "", newStatus.toString(), function () {});
		dashBoardControler.onRearLightsButtonClick(newStatus.toString());
	});
	$("#childLock").bind('click', function () {
		var newStatus = !dashBoardControler.childLockStatus;
		carInd.setStatus("childLock", "", newStatus.toString(), function () {});
		dashBoardControler.onChildLockClick(newStatus.toString());
	});
};
//function getstatus() {
//};

/** 
 * JQuery method which invokes function callback after html document DOM is ready. 
 * @event $(document).ready
 * @param function() {Callback} Reference to callback function. 
 */
$(document).ready(init);

/** 
 * JQuery event which invokes function callback after key is pressed. 
 * @event $(document).keypress
 * @param function() {Callback} Reference to callback function. 
 */
$(document).keypress(function (event) {
	var whellAngleStep = 3.00000001;
	//console.log("event.keyCode = " + event.keyCode);
	//console.log("event.which = " + event.which);
	switch (event.keyCode) {
	case 110:
	case 78:
	case 60:
	case 44:
		dashBoardControler.onWhellAngleChanged(dashBoardControler.currentAngle - whellAngleStep);
		carInd.setStatus("wheelAngle", "", dashBoardControler.currentAngle, function () {});
		break;
	case 109:
	case 62:
	case 77:
	case 46:
		dashBoardControler.onWhellAngleChanged(dashBoardControler.currentAngle + whellAngleStep);
		carInd.setStatus("wheelAngle", "", dashBoardControler.currentAngle, function () {});
		break;
	case 70:
	case 102:
		$("#frontLightsButton").click();
		break;
	case 82:
	case 114:
		$("#rearLightsButton").click();
		break;
	case 65:
	case 97:
		$("#fanButton").click();
		break;
	case 67:
	case 99:
		$("#childLock").click();
		break;
	case 84:
	case 116:
		$("#randomizer").click();
		break;

	default:
		break;
	}
	event.preventDefault();
});


