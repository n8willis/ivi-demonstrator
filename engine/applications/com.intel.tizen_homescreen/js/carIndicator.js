/**
 * Provides the base Homescreen class...
 * @module Homescreen
 **/
/**
 * Provides functions for CarIndicator plugin.
 * @class carIndicator
 * @static
 **/
/**
 * Global variable which holds car status camed from car status event.
 * @property car_status
 * @type Object
 **/
var car_status;

if (typeof CarIndicator != 'undefined') {
	/**
	 * Listener for car status events.
	 * @method CarIndicator.prototype.evaluate
	 * @param jsonString {string} Contains JSON string with new values.
	 * @static
	 **/
	CarIndicator.prototype.evaluate = function (jsonString) {
		var obj = (typeof jsonString).toLowerCase() === "string" ? JSON.parse(jsonString) : jsonString;
		car_status = obj;

		indicators.onBatteryStatusChanged(parseInt(obj.batteryStatus, 10), parseInt(obj.fullBatteryRange, 10));
		indicators.onOutsiteTempChanged(obj.outsideTemp);
		indicators.onInsiteTempChanged(obj.insideTemp);

		if (car_status.speed) {
			$("#homeScrSpeed").html(car_status.speed);
		}
	};
}
/**
 * Provides functions for setting values on homescreen after car status event was recieved.
 * @class indicators
 * @static
 **/
var indicators = {
		/**
		 * Change battery value after gets new value in event.
		 * @method onBatteryStatusChanged
		 * @param newValue {int} New value of battery state.
		 * @param fullBatteryRange {int} Value of vehicle range if battery is full.
		 **/
		onBatteryStatusChanged: function (newValue, fullBatteryRange) {
			var newBatteryStatus = newValue.toString() + "%";
			$('#batteryStatus').html(newBatteryStatus);
			var newBatteryRange = "~" + Math.round(((newValue / 100) * fullBatteryRange)).toString() + " MI";
			$('#batteryRange').html(newBatteryRange);

		},
		/**
		 * Change outside temperature value after gets new value in event.
		 * @method onOutsiteTempChanged
		 * @param newValue {string} New value of outside temperature.
		 **/
		onOutsiteTempChanged: function (newValue) {
			var newOutsiteTemp = newValue + "°F";
			$("#weatherStatus").html(newOutsiteTemp);
		},
		/**
		 * Change inside temperature value after gets new value in event.
		 * @method onOutsiteTempChanged
		 * @param newValue {string} New value of inside temperature.
		 **/
		onInsiteTempChanged: function (newValue) {
			var newInsiteTemp = newValue + "°F";
			$("#fanStatus").html(newInsiteTemp);
		}
	};