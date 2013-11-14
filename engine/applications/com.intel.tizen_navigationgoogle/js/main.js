/** 
 * @module NavigationGoogle
 */

/**
 * Holds origin address value.
 * @property originAddress {String}
 */
var originAddress = "Fell Street, San Francisco, CA, United States";
/**
 * Holds destination address value.
 * @property destinationAddress {String}
 */
var destinationAddress = "75 Hagiwara Tea Garden Dr San Francisco, CA 94118";
/**
 * Holds origin object value.
 * @property origin {String}
 */
var origin = null;
/**
 * Holds destination object value.
 * @property destination {String}
 */
var destination = null;
/**
 * Holds map object.
 * @property map {Object}
 */
var map;
/**
 * Holds geocoder object.
 * @property geocoder {Object}
 */
var geocoder = null;
/**
 * Holds direction service method.
 * @property directionsService {Object}
 */
var directionsService = null;
/**
 * Holds direction renderer method.
 * @property directionRenderer {Object}
 */
var directionRenderer = null;
/**
 * Holds polyline method.
 * @property polyline {Object}
 */
var polyline = null;
/**
 * Holds route object method.
 * @property route {Object}
 */
var route = null;
/**
 * Holds marker object.
 * @property marker {Object}
 */
var marker = null;
/**
 * Holds direction instructions objects array.
 * @property instructions {Object[]}
 */
var instructions = [];
/**
 * Holds status if metric system is used.
 * @property useMetricSystem {Boolean}
 */
var useMetricSystem = false;
/**
 * Holds step value in meters.
 * @property step {Integer}
 */
var step = 10; // metres
/**
 * Holds tick value in milliseconds.
 * @property tick {Integer}
 */
var tick = 50; // milliseconds
/**
 * Holds distance value.
 * @property distance {Integer}
 */
var polDistance = 0;
/**
 * Holds remaining distance value.
 * @property remainingDistance {Integer}
 */
var remainingDistance = 0;
/**
 * Holds remaining step distance value.
 * @property remainingStepDistance {Integer}
 */
var remainingStepDistance = 0;
/**
 * Holds remaining time value.
 * @property remainingTime {Integer}
 */
var remainingTime = 0;
/**
 * Holds route duration value.
 * @property routeDuration {Integer}
 */
var routeDuration = 0;
/**
 * Holds average speed value.
 * @property averageSpeed {Integer}
 */
var averageSpeed = 0;
/**
 * Holds instruction index value.
 * @property instructionIndex {Integer}
 */
var instructionIndex = 0;
/**
 * Holds status value if instruction changed.
 * @property instructionChanged {Boolean}
 */
var instructionChanged = true;

/** 
 * Class which switching between stelitte or classic map view. 
 * @class switchMapSatelitteView
 * @constructor
 */
function switchMapSatelitteView() {//not yet supported by Intel API
	if (map.getMapTypeId() == google.maps.MapTypeId.ROADMAP) {
		map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
		$(".mapIcon").css('display', 'none');
		$(".satelitteIcon").css('display', 'inherit');
	} else if (map.getMapTypeId() == google.maps.MapTypeId.SATELLITE) {
		map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
		$(".satelitteIcon").css('display', 'none');
		$(".mapIcon").css('display', 'inherit');
	} else {
		console.log("Othere map type is " + map.getMapTypeId());
	}
	console.log(map.getMapTypeId());
}

/** 
 * JQuery method which invokes function callback after html document DOM is ready. 
 * @event $(document).ready
 * @param function() {Callback} Reference to callback function. 
 */
$(document).ready(function () {
	if (typeof ThemeEngine != 'undefined') {
		var te = new ThemeEngine();
		te.addStatusListener(function (aData) {
			window.location.reload();
		});
	} else {
		console.error("ThemeEngine API is not available, please start IVI server.");
	}

	changeCssBgImageColor("#mapButton");//change image colours according to theme selected
	changeCssBgImageColor("#satelliteButton");
	$("#topBarIcons").topBarIconsPlugin('init', 'navigation');
	$("#upNextRectangle").boxCaptionPlugin('init', 'up next');
	$("#destinationProgress").progressBarPlugin('init', 'progressBar');
	$("#destinationRectangle").boxCaptionPlugin('init', 'destination');
	$("#stillToGoRectangle").boxCaptionPlugin('init', 'still to go');
	$('#bottomPanel').bottomPanel('init');

	try {
		var options = {
				backgroundColor: "transparent",
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: true,
				zoom: 18
			};

		map = new google.maps.Map(document.getElementById("map_div"), options);

		geocoder = new google.maps.Geocoder();
		geocoder.geocode({
			address: originAddress
		}, function (results, status) {
			if (status == "OK" && results.length) {
				origin = results[0] || null;
				map.setCenter(origin.geometry.location);

				geocoder.geocode({
					address: destinationAddress
				}, function (results, status) {
					if (status == "OK" && results.length) {
						destination = results[0] || null;

						if (origin && destination) {
							renderRoute(origin.geometry.location, destination.geometry.location);
						}
					} else {
						console.log("Destination not found. Unable to get the route.");
					}
				});
			} else {
				console.log("Origin not found. Unable to get the route.");
			}
		});

	} catch (error) {
		console.log(error.message);
	}
});

/** 
 * Class which provides rendering route.
 * @class renderRoute
 * @constructor
 * @param origin {Object} Origin position object.
 * @param destination {Object} Destination position object.
 */
function renderRoute(origin, destination) {
	if (directionsService == null) {
		directionsService = new google.maps.DirectionsService();
	}

	if (directionRenderer == null) {
		directionRenderer = new google.maps.DirectionsRenderer();
	}

	directionRenderer.setMap(map);

	var request = {
			origin: origin,
			destination: destination,
			travelMode: google.maps.DirectionsTravelMode.DRIVING
		};

	directionsService.route(request, function (response, status) {
		console.log(status);
		console.log(response);
		if (status == google.maps.DirectionsStatus.OK && response.routes.length) {
			if (response.routes && response.routes[0] && response.routes[0].legs && response.routes[0].legs[0]) {
				polyline = new google.maps.Polyline({
					path : []
				});

				route = response.routes[0].legs[0];
				directionRenderer.setDirections(response);

				var steps = route.steps;
				var distanceStep = 0;
				var j;
				for (j = 0; j < steps.length; j++) {
					var latLngs = steps[j].path;
					distanceStep = distanceStep + (steps[j].distance.value || 0);

					var instruction = {
							distance: (steps[j].distance || 0),
							distanceValue: distanceStep,
							instruction: (steps[j].instructions ? steps[j].instructions.trim() : "")
						};

					instructions.push(instruction);
					var k;
					for (k = 0; k < latLngs.length; k++) {
						polyline.getPath().push(latLngs[k]);
					}
				}
				startAnimation();
			}
		} else {
			console.log('Route calculation failed: ' + status);
		}
	});
}

/** 
 * Class which provides animating route.
 * @class animate
 * @constructor
 * @param d {Integer} 
 */
function animate(d) {
	if (d + step > instructions[instructionIndex].distanceValue) {
		if (instructionIndex < instructions.length - 1) {
			instructionChanged = true;
			instructionIndex++;
		}
	}

	if (d > polDistance) {
		instructionIndex = instructions.length - 1;
		instructionChanged = true;

		remainingDistance = 0;
		remainingStepDistance = 0;
		remainingTime = 0;

		updateNavigationPanel();

		map.panTo(polyline.getPath().getAt(polyline.getPath().length - 1));
		marker.setPosition(polyline.getPath().getAt(polyline.getPath().length - 1));

		var option = {draggable: true};
		map.setOptions(option);
		return;
	}

	remainingDistance = polDistance - d;
	remainingStepDistance = instructions[instructionIndex].distanceValue - d;

	updateNavigationPanel();

	var p = polyline.GetPointAtDistance(d);
	map.panTo(p);
	marker.setPosition(p);
	timerHandle = setTimeout("animate(" + (d + step) + ")", tick);
}

/** 
 * Class which provides start animation.
 * @class startAnimation
 * @constructor
 */
function startAnimation() {
	var option = {
			draggable: false
		};
	map.setOptions(option);

	marker = new google.maps.Marker();
	marker.setMap(map);
	marker.setPosition(polyline.getPath().getAt(0));
	map.setCenter(polyline.getPath().getAt(0));
	polDistance = polyline.Distance();

	console.log(polyline.getPath());
	console.log(polDistance);
	console.log(instructions);

	remainingDistance = polDistance;
	remainingStepDistance = instructions[instructionIndex].distanceValue;
	routeDuration = route.duration.value;
	remainingTime = routeDuration;
	averageSpeed = (route.distance.value / routeDuration);

	$("#destinationAddress").html(destination.formatted_address);
	$("#destinationAddressTown").html(destination.address_components[2].short_name + ", " + destination.address_components[3].short_name);

	var averageSpeedText;

	if (useMetricSystem == true) {
		averageSpeedText = Math.round(averageSpeed * 3.6) + "<span class='fontSizeXXSmall'> km/h</span>" + ")";
	} else {
		averageSpeedText = Math.round(averageSpeed * 2.2369362920544) + "<span class='fontSizeXXSmall'> MPH</span>" + ")";
	}

	$("#arrivalText").html("ARRIVAL " + addSecondsToCurrentTime(routeDuration) + " (" + averageSpeedText);

	updateNavigationPanel();
	setTimeout("animate(0)", 2000); // Allow time for the initial map display
}

/** 
 * Class which provides update navigation panel.
 * @class updateNavigationPanel
 * @constructor
 */
function updateNavigationPanel() {
	if (instructionChanged) {
		//console.log("instruction changed");
		$("#navigationPanel").html(instructions[instructionIndex].instruction);
		changeNavigationArrow(instructions[instructionIndex].instruction);
		instructionChanged = false;
	}

	if (useMetricSystem == true) {
		remainingStepDistance = formatMeters(remainingStepDistance, 'fontSizeSmaller');
	} else {
		remainingStepDistance = convertMetersToFeetsMiles(remainingStepDistance, 'fontSizeSmaller');
	}

	$("#distanceTo").html(remainingStepDistance);
	$("#destinationProgress").progressBarPlugin('setPosition', (remainingDistance / polDistance) * 100);

	var remainingTime = Math.round(remainingDistance / averageSpeed); //time in seconds
	remainingTime = formatTimeToHHMM(remainingTime);	//seconds to hh:mm

	if (useMetricSystem == true) {
		remainingDistance = formatMeters(remainingDistance, 'fontSizeSmall');
	} else {
		remainingDistance =  convertMetersToFeetsMiles(remainingDistance, 'fontSizeSmall');
	}

	$("#stillToGoTimeAndDistance").html(remainingTime + " / " + remainingDistance);
}


/** 
 * Class which provides changing navigation arrow.
 * @class changeNavigationArrow
 * @constructor
 * @param instructionText {String} Instruction text.
 */
function changeNavigationArrow(instructionText) {
	var turnRight = instructionText.indexOf("right");
	var turnLeft = instructionText.indexOf("left");

	if (turnRight > 0 && turnRight < 10) {
		//"left" or "right" is on the beginning of instruction step	
		$("#turnArrow").css("background-image", "url('images/icon_arrow_right.png')");
	} else if (turnLeft > 0 && turnLeft < 10) {
		//"left" or "right" is on the beginning of instruction step	
		$("#turnArrow").css("background-image", "url('images/icon_arrow_left.png')");
	} else {
		$("#turnArrow").css("background-image", "url('images/icon_arrow_straight.png')");
	}
}

/** 
 * Class which provides changing format of distance value text.
 * @class formatMeters
 * @constructor
 * @param meters {Integer} Distance value in meters.
 * @param fontSize {Integer} Font size.
 * @return distance {String} Distance in meters width changed font format.
 */
function formatMeters(meters, fontSize) {
	if (meters > 500) {
		return (Math.round(meters / 100)) / 10 + "<span class=" + fontSize + ">KM</span>";
	} else {
		return Math.round(meters) + "<span class=" + fontSize + ">m</span>";
	}
}

/** 
 * Class which provides converting distance from meters to feets and changing formats of distance value text.
 * @class convertMetersToFeetsMiles
 * @constructor
 * @param meters {Integer} Distance value in meters.
 * @param fontSize {Integer} Font size.
 * @return distance {String} Distance in feets width changed font format.
 */
function convertMetersToFeetsMiles(meters, fontSize) {
	var feets = meters * 3.280839895;
	if (feets > 528) {
		return (Math.round(feets / 528)) / 10 + "<span class=" + fontSize + ">MI</span>";
	} else {
		return Math.round(feets) + "<span class=" + fontSize + ">ft</span>";
	}
}

/** 
 * Class which provides converting seconds to time.
 * @class secondsToTime
 * @constructor
 * @param secs {Integer} Time value in seconds.
 * @return time {Object} Time in object with hours, minutes and second separated format.
 */
function secondsToTime(secs) {
	var hours = Math.floor(secs / (60 * 60));

	var divisorForMinutes = secs % (60 * 60);
	var minutes = Math.floor(divisorForMinutes / 60);

	var divisorForSeconds = divisorForMinutes % 60;
	var seconds = Math.ceil(divisorForSeconds);

	var obj = {
			"h" : hours,
			"m" : minutes,
			"s" : seconds
		};
	return obj;
}

/** 
 * Class which provides leading 0 to time value.
 * @class addLeading0ToTime
 * @constructor
 * @param time {Integer} Time value.
 * @return time {String} Time with leading 0.
 */
function addLeading0ToTime(time) {
	if (time < 10) {
		return "0" + time;
	} else {
		return time;
	}
}

/** 
 * Class which provides formatting time to HHMM format.
 * @class addLeading0ToTime
 * @constructor
 * @param seconds {Integer} Time value in seconds.
 * @return formatedTime {String} Time in format HHMM.
 */
function formatTimeToHHMM(seconds) {
	var hours = secondsToTime(seconds).h;
	var minutes = secondsToTime(seconds).m;
	var formatedTime;

	if (hours > 0 || minutes > 0) {
		formatedTime = addLeading0ToTime(hours) + ":" + addLeading0ToTime(minutes);
	} else {
		formatedTime = seconds + "<span class='fontSizeSmall'>s</span>";
	}
	return formatedTime;
}

/** 
 * Class which provides adding seconds to current time.
 * @class addSecondsToCurrentTime
 * @constructor
 * @param secs {Integer} Time value in seconds.
 * @return result {String} Time in format HHMM.
 */
function addSecondsToCurrentTime(secs) {
	var todayDate = new Date();
	var hours = todayDate.getHours();
	var minutes = todayDate.getMinutes();
	var seconds = todayDate.getSeconds();
	var newSec = parseInt(seconds, 10) + parseInt(secs, 10);

	if (newSec > 59) {
		var mins = parseInt(newSec / 60, 10);
		var sec = newSec - mins * 60;
		var newMin = parseInt(minutes, 10) + mins;

		if (newMin > 59) {
			var hrs = parseInt(newMin / 60, 10);
			var min = newMin - (hrs * 60);
			var newHrs = parseInt(hours, 10) + hrs;
		} else {
			newHrs = hours;
			min = newMin;
		}

	} else {
		newHrs = hours;
		min = minutes;
		sec = newSec;
	}

	var format = "AM";

	if (newHrs > 11) {
		format = "PM";
	}
	if (newHrs > 12) {
		newHrs = newHrs - 12;
	}
	if (newHrs == 0) {
		newHrs = 12;
	}
	if (min < 10) {
		min = "0" + min;
	}

	return newHrs + ":" + min + format;

//	return newHrs + ":" + min + " : " + sec + " "
//	+ format
//	document.write("Time : " + newHrs + " : " + min + " : " + sec + " "
//	+ format);
}


