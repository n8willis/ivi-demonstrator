/**
 * Provides the base Homescreen class...
 * @module Homescreen
 **/
/**
 * Provides functions for audio info JQuery Plugin panel.
 * @class actionCatcher
 * @static
 **/
var actionCatcher = {
		/**
		 * Holds clicked item Object.
		 * @property clickedItem
		 * @type Object
		 * @default null
		 **/
		clickedItem: null,
		/**
		 * Indicates if mouse button is pressed.
		 * @property mouseDown
		 * @type bool
		 * @default false
		 **/
		mouseDown: false,

		/**
		 * Provides highlighting sectors if mouse cursor is over.
		 * @method over
		 **/
		over: function () {
			var i = 0;
			if (!actionCatcher.mouseDown) {
				var mousePosition = {x: window.event.pageX, y: window.event.pageY};
				var overItem = getClickedItem(mousePosition);
				if (overItem != actionCatcher.clickedItem) {
					for (i = 0; i < areasDefinitions.length; i++) {
						if (areasDefinitions[i].sectorId != null) {
							$('.sector' + areasDefinitions[i].sectorId).removeClass('selected');
						}
					}
					if (overItem != null) {
						$('.sector' + overItem.sectorId).addClass('selected');
					}
					actionCatcher.clickedItem = overItem;
				}
			}
		},
		/**
		 * Sets mouseDown property to true and sets clickedItem property if click to some sector.
		 * @method touchStart
		 **/
		touchStart: function () {
			actionCatcher.mouseDown = true;
			var mousePosition = {x: window.event.pageX, y: window.event.pageY};
			actionCatcher.clickedItem = getClickedItem(mousePosition);
		},
		/**
		 * Sets mouseDown property to false and starts app if click to some sector.
		 * @method touchEnd
		 **/
		touchEnd: function () {
			actionCatcher.mouseDown = false;
			if (actionCatcher.clickedItem != null) {
				switch (actionCatcher.clickedItem.shape) {
				case 'cenerCircle':
					actionCatcher.clickedItem.action();
					break;
				case 'pieWithoutCenter':
					if (actionCatcher.clickedItem.id != null) {
						onFrameClick(actionCatcher.clickedItem);
					}
					break;
				}
			}
		}
	};

/**
 * Gets app sector from click based on predefAppModel, clickDistance from center and click angle.
 * @method getClickedItem
 * @param touchPoint {object} Contains X and Y coordinate of clicked/touched point.
 * @static
 **/
var getClickedItem = function (touchPoint) {
		var dst = pointsDistance(touchPoint, centerPoint),
			angle = pointAngle(touchPoint, centerPoint),
			i = 0;
		for (i = 0; i < areasDefinitions.length; i++) {
			switch (areasDefinitions[i].shape) {
			case 'cenerCircle':
				if (dst < areasDefinitions[i].lc) {
					return areasDefinitions[i];
				}
				break;
			case 'pieWithoutCenter':
				if ((areasDefinitions[i].sc < dst) && (areasDefinitions[i].lc > dst) && (areasDefinitions[i].sa < angle) && (areasDefinitions[i].la > angle)) {
					return areasDefinitions[i];
				}
				break;
			}
		}
		return null;
	};

/**
 * Compute distance between two points in 2D.
 * @method pointsDistance
 * @param pointA {object} Contains X and Y coordinate of first point.
 * @param pointB {object} Contains X and Y coordinate of second point.
 * @return float distance in points
 * @static
 **/
var pointsDistance = function (pointA, pointB) {
	return Math.sqrt(Math.pow(Math.abs(pointA.y - pointB.y), 2) + Math.pow(Math.abs(pointA.x - pointB.x), 2));
};

/**
 * Compute angle of click point from  zero angle (zero angle has a line, which is horizontal and starts in the center point).
 * @method pointAngle
 * @param point {object} Contains X and Y coordinate of clicked/touched point.
 * @param centerPoint {object} Contains X and Y coordinate of center point.
 * @return float angle in degrees
 * @static
 **/
var pointAngle = function (point, centerPoint) {
		var tmpPoint = {};
		tmpPoint.x = centerPoint.x + 200; //to define zero vector
		tmpPoint.y = centerPoint.y;
		var u1 = tmpPoint.x - centerPoint.x,
			u2 = tmpPoint.y - centerPoint.y,
			v1 = point.x - centerPoint.x,
			v2 = point.y - centerPoint.y,
			su = pointsDistance(centerPoint, tmpPoint),
			sv = pointsDistance(centerPoint, point),
			angle = Math.acos((u1 * v1 + u2 * v2) / (su * sv)) * (180 / Math.PI);
		if (point.y > centerPoint.y) {
			angle = 360 - angle;
		}
		return angle;
	};