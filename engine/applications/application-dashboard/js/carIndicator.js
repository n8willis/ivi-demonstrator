/** 
 * @module Dashboard
 */

/**
 * Reference to object of car status JSON string object
 * @property car_status {Object}
 */
var car_status;

/** 
 * Class which provides methods to initialize car status for dashboard's car indicators. 
 * @class CarIndicator
 * @constructor
 */
CarIndicator.prototype.evaluate = function (jsonString) {
	var obj = (typeof jsonString).toLowerCase() === "string" ? JSON.parse(jsonString) : jsonString;
	car_status = obj;
	dashBoardControler.onBatteryStatusChanged(parseInt(obj.batteryStatus, 10), parseInt(obj.fullBatteryRange, 10));

	dashBoardControler.onBatteryStatusChanged(parseInt(obj.batteryStatus, 10), parseInt(obj.fullBatteryRange, 10));
	dashBoardControler.onWeaterChanged(obj.weather);
	dashBoardControler.onOutsiteTempChanged(obj.outsideTemp);
	dashBoardControler.onInsiteTempChanged(obj.insideTemp);
	dashBoardControler.onWhellAngleChanged(parseInt(obj.wheelAngle, 10));
	dashBoardControler.onFanButtonClick(obj.fan);
	dashBoardControler.onFrontLightsButtonClick(obj.frontLights);
	dashBoardControler.onRearLightsButtonClick(obj.rearLights);
	dashBoardControler.onChildLockClick(obj.childLock);
	dashBoardControler.onRandomizerClick(obj.randomizer);

	if (obj.frontLeftwhell == "") {
		$('#leftFrontPressure #statusIndicator').empty();
		$('#leftFrontPressure #statusIndicator').append("OK");
	} else {
		$('#leftFrontPressure #statusIndicator').empty();
		$('#leftFrontPressure #statusIndicator').append(obj.frontLeftwhell);
	}
	if (obj.frontRightwhell == "") {
		$('#rightFrontPressure #statusIndicator').empty();
		$('#rightFrontPressure #statusIndicator').append("OK");
	} else {
		$('#rightFrontPressure #statusIndicator').empty();
		$('#rightFrontPressure #statusIndicator').append(obj.frontRightwhell);
	}
	if (obj.rearLeftwhell == "") {
		$('#leftRearPressure #statusIndicator').empty();
		$('#leftRearPressure #statusIndicator').append("OK");
	} else {
		$('#leftRearPressure #statusIndicator').empty();
		$('#leftRearPressure #statusIndicator').append(obj.rearLeftwhell);
	}
	if (obj.rearRightwhell == "") {
		$('#rightRearPressure #statusIndicator').empty();
		$('#rightRearPressure #statusIndicator').append("OK");
	} else {
		$('#rightRearPressure #statusIndicator').empty();
		$('#rightRearPressure #statusIndicator').append(obj.rearRightwhell);
	}

	dashBoardControler.onEngineStatusChanged(obj.gear, parseInt(obj.speed, 10), parseInt(obj.odoMeter, 10));
};