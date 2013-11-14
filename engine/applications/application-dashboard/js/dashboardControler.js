/** 
 * @module Dashboard
 */

/** 
 * Class which provides methods to fill content of dashboard's UI. 
 * @class dashBoardControler
 * @static
 */
dashBoardControler = {
	/**
	 * Holds status of rear left display.
	 * @property RearLDispalyStatus {Boolean}
	 */
	RearLDispalyStatus: false,
	/**
	 * Holds status of rear right display.
	 * @property RearRDispalyStatus {Boolean}
	 */
	RearRDispalyStatus: false,
	/**
	 * Holds status of child lock of the car.
	 * @property childLockStatus {Boolean}
	 */
	childLockStatus: false,
	/**
	 * Holds status of front lights of the car.
	 * @property FrontLightsStatus {Boolean}
	 */
	FrontLightsStatus: false,
	/**
	 * Holds status of rear lights of the car.
	 * @property RearLightsStatus {Boolean}
	 */
	RearLightsStatus: false,
	/**
	 * Holds status of fan in the car.
	 * @property FanStatus {Boolean}
	 */
	FanStatus: false,
	/**
	 * Holds current angle of front wheels of the car. 
	 * @property currentAngle {Integer}
	 */
	currentAngle: 0,
	/**
	 * Holds status of randomizer
	 * @property Randomizer {Boolean}
	 */
	Randomizer: false,
	/** 
	 * Method controls status of rear left display.
	 * @method onRearLDisplayClick 
	 */
	onRearLDisplayClick: function () {
		if (this.RearLDispaly) {
			$('#rearLButtonText').removeClass("fontColorSelected");
			$('#rearLButtonText').addClass("fontColorNormal");
			$('#rearLButtonText').empty();
			$('#rearLButtonText').append("OFF");
			this.RearLDispaly = false;
		} else {
			$('#rearLButtonText').removeClass("fontColorNormal");
			$('#rearLButtonText').addClass("fontColorSelected");
			$('#rearLButtonText').empty();
			$('#rearLButtonText').append("ON");
			this.RearLDispaly = true;
		}
	},
	/** 
	 * Method controls status of rear left display.
	 * @method onRearRDisplayClick
	 */
	onRearRDisplayClick: function () {
		if (this.RearRDispaly) {
			$('#rearRButtonText').removeClass("fontColorSelected");
			$('#rearRButtonText').addClass("fontColorNormal");
			$('#rearRButtonText').empty();
			$('#rearRButtonText').append("OFF");
			this.RearRDispaly = false;
		} else {
			$('#rearRButtonText').removeClass("fontColorNormal");
			$('#rearRButtonText').addClass("fontColorSelected");
			$('#rearRButtonText').empty();
			$('#rearRButtonText').append("ON");
			this.RearRDispaly = true;
		}
	},
	/** 
	 * Method is setting status of child lock.
	 * @method onChildLockClick
	 * @param newStatus {Boolean} New status of child lock of the car.
	 */
	onChildLockClick: function (newStatus) {
		if (newStatus == undefined) {
			newStatus = this.childLockStatus;
		}

		if (newStatus === false || newStatus === "false") {
			$('#leftPadlock').removeClass("padlocActive");
			$('#leftPadlock').addClass("padlocInactive");
			$('#rightPadlock').removeClass("padlocActive");
			$('#rightPadlock').addClass("padlocInactive");
			$('#childLockText').removeClass("fontColorSelected");
			$('#childLockText').addClass("fontColorNormal");
			$('#childLockText').empty();
			$('#childLockText').append("CHILD LOCK DEACTIVATED");

			this.childLockStatus = false;
		} else {
			$('#leftPadlock').removeClass("padlocInactive");
			$('#leftPadlock').addClass("padlocActive");
			$('#rightPadlock').removeClass("padlocInactive");
			$('#rightPadlock').addClass("padlocActive");
			$('#childLockText').removeClass("fontColorNormal");
			$('#childLockText').addClass("fontColorSelected");
			$('#childLockText').empty();
			$('#childLockText').append("CHILD LOCK ACTIVATED");
			this.childLockStatus = true;
		}

	},
	/** 
	 * Method is setting status of front lights of the car.
	 * @method onFrontLightsButtonClick
	 * @param newStatus {Boolean} New status of front lights of car.
	 */
	onFrontLightsButtonClick: function (newStatus) {
		if (newStatus == undefined) {
			newStatus = this.FrontLightsStatus;
		}

		if (newStatus === false || newStatus === "false") {
			$('#frontLightsButton').css("opacity", "0");
			$("#frontLightsImage").css("opacity", "0");
			this.FrontLightsStatus = false;
		} else {
			$('#frontLightsButton').css("opacity", "1");
			$("#frontLightsImage").css("opacity", "1");
			this.FrontLightsStatus = true;
		}
	},
	/** 
	 * Method is setting value of gear, speed and odoMeter of the engine.
	 * @method onEngineStatusChanged
	 * @param gear {String} Input value for the gear.
	 * @param speed {String} Input value for the speed.
	 * @param odoMeter {String} Input value for the odoMeter.
	 */
	onEngineStatusChanged: function (gear, speed, odoMeter) {
		$("#engineStatus #textIndicator").text(speed + " mph");
		$("#engineStatus #statusIndicator").text(odoMeter + " mi");
		$("#engineStatus #gearboxStatus").text(gear);
	},
	/** 
	 * Method  is setting status of rear lights of the car.
	 * @method onRearLightsButtonClick
	 * @param newStatus {Boolean} New status of rear lights of car.
	 */
	onRearLightsButtonClick: function (newStatus) {
		if (newStatus == undefined) {
			newStatus = this.RearLightsStatus;
		}

		if (newStatus === false || newStatus === "false") {
			$('#rearLightsButton').css("opacity", "0");
			$("#rearLightsImage").css("opacity", "0");
			this.RearLightsStatus = false;
		} else {
			$('#rearLightsButton').css("opacity", "1");
			$("#rearLightsImage").css("opacity", "1");
			this.RearLightsStatus = true;
		}
	},
	/** 
	 * Method  is setting status of fan in the car.
	 * @method onFanButtonClick
	 * @param newStatus {Boolean} New status of fan in the car.
	 */
	onFanButtonClick: function (newStatus) {
		if (newStatus == undefined) {
			newStatus = this.FanStatus;
		}
		if (newStatus === false || newStatus === "false") {
			$('#fanCircle').css("opacity", "0");
			$("#fanIcon").css("opacity", "0");
			$("#fanIcon").css("-webkit-transform", "rotate(0deg)");
			$("#fanIcon").css("-moz-transform", "rotate(0deg)");
			$("#fanIcon").css("-ms-transform", "rotate(0deg)");
			$("#fanIcon").css("-o-transform", "rotate(0deg)");
			$('#fanStatus').removeClass("fontColorSelected");
			$('#fanStatus').addClass("fontColorNormal");
			this.FanStatus = false;
		} else {
			$('#fanCircle').css("opacity", "1");
			$("#fanIcon").css("opacity", "1");
			$("#fanIcon").css("-webkit-transform", "rotate(720deg)");
			$("#fanIcon").css("-moz-transform", "rotate(720deg)");
			$("#fanIcon").css("-ms-transform", "rotate(720deg)");
			$("#fanIcon").css("-o-transform", "rotate(720deg)");
			$('#fanStatus').removeClass("fontColorNormal");
			$('#fanStatus').addClass("fontColorSelected");
			this.FanStatus = true;
		}
	},
	/** 
	 * Method is setting new value of battery status and full battery range.
	 * @method onBatteryStatusChanged
	 * @param newValue {Integer} New battery status value.
	 * @param fullBatteryRange {Float} Full range of battery.
	 */
	onBatteryStatusChanged: function (newValue, fullBatteryRange) {
		$("#batteryProgressBar").progressBarPlugin('setPosition', newValue);
		var newBatteryStatus = newValue.toString() + "%";

		$('#batteryStatus').empty();
		$('#batteryStatus').append(newBatteryStatus);
		var newBatteryRange = "~" + Math.round(((newValue / 100) * fullBatteryRange)).toString() + " MI";
		$('#batteryRange').empty();
		$('#batteryRange').append(newBatteryRange);

	},
	/** 
	 * Method is setting new value of outside temperature.
	 * @method onOutsiteTempChanged
	 * @param newValue {String} New outside temperature status value.
	 */
	onOutsiteTempChanged: function (newValue) {
		var newOutsiteTemp = newValue + "°F";
		$("#weatherStatus").empty();
		$("#weatherStatus").append(newOutsiteTemp);
	},
	/** 
	 * Method is setting new value of inside temperature.
	 * @method onInsiteTempChanged
	 * @param newValue {String} New inside temperature status value.
	 */
	onInsiteTempChanged: function (newValue) {
		var newInsiteTemp = newValue + "°F";
		$("#fanStatus").empty();
		$("#fanStatus").append(newInsiteTemp);
	},
	/** 
	 * Method is setting new value of weather.
	 * @method onWeaterChanged
	 * @param newWeater {Integer} New weather status value.
	 */
	onWeaterChanged: function (newWeater) {
		if (newWeater == 1) {
			$("#dashBoardWeatherIcon").removeClass("dashBoardWeatherSun");
			$("#dashBoardWeatherIcon").removeClass("dashBoardWeatherCloudy");
			$("#dashBoardWeatherIcon").removeClass("dashBoardWeatherThunder");
			$("#dashBoardWeatherIcon").addClass("dashBoardWeatherCloudy");

		} else if (newWeater == 2) {
			$("#dashBoardWeatherIcon").removeClass("dashBoardWeatherSun");
			$("#dashBoardWeatherIcon").removeClass("dashBoardWeatherCloudy");
			$("#dashBoardWeatherIcon").removeClass("dashBoardWeatherThunder");
			$("#dashBoardWeatherIcon").addClass("dashBoardWeatherSun");

		} else {
			$("#dashBoardWeatherIcon").removeClass("dashBoardWeatherSun");
			$("#dashBoardWeatherIcon").removeClass("dashBoardWeatherCloudy");
			$("#dashBoardWeatherIcon").removeClass("dashBoardWeatherThunder");
			$("#dashBoardWeatherIcon").addClass("dashBoardWeatherThunder");
		}
	},
	/** 
	 * Method is setting new value of angle of front wheels.
	 * @method onWhellAngleChanged
	 * @param newAngle {Integer} New angle status value for wheels.
	 */
	onWhellAngleChanged: function (newAngle) {
		var maxAngle = 30;
		this.currentAngle =  newAngle;
		if (this.currentAngle > maxAngle) {
			this.currentAngle = maxAngle;
		} else if (this.currentAngle < (-maxAngle)) {
			this.currentAngle = -maxAngle;
		} else if (this.currentAngle == "") {
			this.currentAngle = 0;
		}

		var newDuration = Math.round(Math.abs(newAngle) / 10);
		if (newDuration == 0) {
			newDuration = 0.1;
		}
		$("#leftWhell").css("-webkit-transition", newDuration + "s");
		$("#leftWhell").css("-webkit-transform", "rotate(" + this.currentAngle + "deg)");
		$("#rightWhell").css("-webkit-transition", newDuration + "s");
		$("#rightWhell").css("-webkit-transform", "rotate(" + this.currentAngle + "deg)");

		$("#leftWhell").css("-moz-transition", newDuration + "s");
		$("#leftWhell").css("-moz-transform", "rotate(" + this.currentAngle + "deg)");
		$("#rightWhell").css("-moz-transition", newDuration + "s");
		$("#rightWhell").css("-moz-transform", "rotate(" + this.currentAngle + "deg)");

		$("#leftWhell").css("-ms-transition", newDuration + "s");
		$("#leftWhell").css("-ms-transform", "rotate(" + this.currentAngle + "deg)");
		$("#rightWhell").css("-ms-transition", newDuration + "s");
		$("#rightWhell").css("-ms-transform", "rotate(" + this.currentAngle + "deg)");

		$("#leftWhell").css("-o-transition", newDuration + "s");
		$("#leftWhell").css("-o-transform", "rotate(" + this.currentAngle + "deg)");
		$("#rightWhell").css("-o-transition", newDuration + "s");
		$("#rightWhell").css("-o-transform", "rotate(" + this.currentAngle + "deg)");
	},
	/** 
	 * Method is setting new value of randomizer.
	 * @method onRandomizerClick
	 * @param newStatus {Boolean} New randomizer status.
	 */
	onRandomizerClick: function (newStatus) {
		if (newStatus == undefined) {
			newStatus = this.Randomizer;
		}
		if (newStatus === false || newStatus === "false") {
			$('#randomizer').css("opacity", "0");
			$("#randomizer").css("opacity", "0");
			this.Randomizer = false;
		} else {
			$('#randomizer').css("opacity", "1");
			$("#randomizer").css("opacity", "1");
			this.Randomizer = true;
		}

	}
};