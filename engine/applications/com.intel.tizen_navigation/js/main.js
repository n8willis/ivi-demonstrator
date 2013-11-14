/** 
 * @module Navigation
 */

/**
 * Holds reference to instance of Map object class
 * @property map {Object}
 */
var map;
/** 
 * Class which provides properties of origin coordinates. 
 * @class originCoordinate
 * @static
 */
var originCoordinate = {
		/**
		 * Holds latitude value.
		 * @property lat {Float}
		 */
		lat: 40.73589,
		/**
		 * Holds longitude value.
		 * @property lng {Float}
		 */
		lng: -73.99124
	};
/** 
 * Class which provides properties of destination coordinates. 
 * @class destinationCoordinate
 * @static
 */
var destinationCoordinate = {
		/**
		 * Holds latitude value.
		 * @property lat {Float}
		 */
		lat: 40.75642,
		/**
		 * Holds longitude value.
		 * @property lng {Float}
		 */
		lng: -73.99667
	};

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
 * Holds direction instructions objects array.
 * @property instructions {Object[]}
 */
var instructions = [];
/**
 * Holds marker object.
 * @property marker {Object}
 */
var marker = null;
/**
 * Holds route object method.
 * @property route {Object}
 */
var route = null;
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
 * Holds destination address value.
 * @property destinationAddress {String}
 */
var destinationAddress = "439 W 38th St, Manhattan";
/**
 * Holds destination address of town value.
 * @property destinationAddressTown {String}
 */
var destinationAddressTown = "New York, NY, 10018";
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
 * Class which provide get cookie. 
 * @class getCookie
 * @constructor
 * @param c_name {String} Name of cookie.
 */
function getCookie(c_name) {
	var i, x, y, ARRcookies = document.cookie.split(";");
	for (i = 0; i < ARRcookies.length; i++) {
		x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
		y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
		x = x.replace(/^\s+|\s+$/g, "");
		if (x == c_name) {
			return unescape(y);
		}
	}
}

/** 
 * Class which provide get cookie. 
 * @class setCookie
 * @constructor
 * @param c_name {String} Name of cookie.
 * @param value {String} Value of cookie.
 * @param exdays {String} Expiration of cookie.
 */
function setCookie(c_name, value, exdays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
	document.cookie = c_name + "=" + c_value;
}

/** 
 * Class which switching between stelitte or classic map view. 
 * @class switchMapSatelitteView
 * @constructor
 */
function switchMapSatelitteView() {	//not yet supported by Intel API
	if (map.getMapTypeId() == "roadmap") {
		map.setMapTypeId("satellite");
		$(".mapIcon").css('display', 'none');
		$(".satelitteIcon").css('display', 'inherit');
	} else if (map.getMapTypeId() == "satellite") {
		map.setMapTypeId("roadmap");
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
	setCookie("test", "testing cookies", 1);
	console.log(getCookie("test"));

	if (typeof ThemeEngine != 'undefined') {
		var te = new ThemeEngine();
		te.addStatusListener(function (aData) {
			window.location.reload();
		});
	} else {
		console.error("ThemeEngine API is not available, please start IVI server.");
	}

	changeCssBgImageColor("#mapButton");		//change image colours according to theme selected
	changeCssBgImageColor("#satelliteButton");
	$("#topBarIcons").topBarIconsPlugin('init', 'navigation');
	$("#upNextRectangle").boxCaptionPlugin('init', 'up next');
	$("#destinationProgress").progressBarPlugin('init', 'progressBar');
	$("#destinationRectangle").boxCaptionPlugin('init', 'destination');
	$("#stillToGoRectangle").boxCaptionPlugin('init', 'still to go');
	$('#bottomPanel').bottomPanel('init');

	try {
		var prefs = {
				login: {
					contextUrl: 'https://api.intel.com/location/',
					clientId: 'e83e56aab7c8770afa55a70dc9654e5a',
					clientSecret: 'ad680dc7e3c3c76b',
					callback: on_login
				},
				sessioninvalid: function () { console.log("sessioninvalid"); },
				tileserror: function () { console.log("tileserror"); }
			};

		var option = {
				backgroundColor: "transparent",
				mapTypeId: intel.maps.MapTypeId.ROADMAP,
				mapTypeControl: true,
				zoom: 16
			};

		map = new intel.maps.Map(document.getElementById("map_div"), prefs);
		map.setOptions(option);
		map.setCenter(new intel.maps.LatLng(originCoordinate.lat, originCoordinate.lon));

		window.onresize = function () {
			intel.maps.event.trigger(map, "resize");
		};

		var cookie = getCookie("__tmAccessToken");
		if (cookie != null && cookie != "") {
			renderRoute(originCoordinate, destinationCoordinate);
		}
	} catch (error) {
		console.log(error.message);
	}
});

/** 
 * Class which respond after login from maps service. 
 * @class on_login
 * @constructor
 * @param response {String} Name of cookie.
 * @param status {String} Value of cookie.
 */
function on_login(response, status) {
	console.log("LOGIN RESPONSE");
	console.log(response);
	console.log(status);

	if (status != intel.maps.LoginStatus.OK) {
		console.log("Login failure: " + status);
	} else {
		renderRoute(originCoordinate, destinationCoordinate);
	}
}

/** 
 * Class which provides rendering route.
 * @class renderRoute
 * @constructor
 * @param origin {Object} Origin position object.
 * @param destination {Object} Destination position object.
 */
function renderRoute(origin, destination) {
	if (directionsService == null) {
		directionsService = new intel.maps.DirectionsService();
	}

	if (directionRenderer == null) {
		directionRenderer = new intel.maps.DirectionsRenderer();
	}

	directionRenderer.setMap(map);

	var request = {
			origin: new intel.maps.LatLng(origin.lat, origin.lng),
			destination: new intel.maps.LatLng(destination.lat, destination.lng),
			travelMode: intel.maps.DirectionsTravelMode.DRIVING
		};

	directionsService.route(request, function (response, status) {
		if (status == intel.maps.DirectionsStatus.OK && response.trips.length) {
			if (response.trips && response.trips[0] && response.trips[0].routes && response.trips[0].routes[0]) {
				polyline = new intel.maps.Polyline({
					path : []
				});

				route = response.trips[0].routes[0];
				directionRenderer.setDirections(response);

				var steps = route.steps;
				var distanceStep = 0;
				var j;
				for (j = 0; j < steps.length; j++) {
					var latLngs = steps[j].lat_lngs;
					distanceStep = distanceStep + steps[j].distance.value;

					var instruction = {
							distance: steps[j].distance,
							distanceValue: distanceStep,
							instruction: steps[j].instructions
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

		map.panTo(new intel.maps.LatLng(destinationCoordinate.lat, destinationCoordinate.lng));
		marker.setPosition(new intel.maps.LatLng(destinationCoordinate.lat, destinationCoordinate.lng));

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
	var option = {draggable: false};
	map.setOptions(option);

	marker = new intel.maps.Marker();
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

	//destinationAddress = route.end_geocode.formatted_address; //RETURNS coordinates
	console.log(destinationAddress);

	$("#destinationAddress").html(destinationAddress);
	$("#destinationAddressTown").html(destinationAddressTown);

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
		remainingStepDistance =  convertMetersToFeetsMiles(remainingStepDistance, 'fontSizeSmaller');
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
 * Class which provides setting marker position.
 * @class setMarkerPosition
 * @constructor
 * @param marker {Object} Marker object reference.
 * @param lat {Float} Latitude.
 * @param lon {Float} Longitude.
 */
function setMarkerPosition(marker, lat, lon) {
	marker.setPosition(new intel.maps.LatLng(lat, lon));
	marker.setMap(map);
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


