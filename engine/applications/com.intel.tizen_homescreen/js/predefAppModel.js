/**
 * Provides the base Homescreen class...
 * @module Homescreen
 **/
/**
 * Contains area definitions for applications pie menu and apps definitions.
 * @class predefAppModel
 **/
/**
 * Define center point of app pie
 * @property centerPoint 
 * @type Object
 * @default {x: 360, y: 675}
 **/
var centerPoint = {x: 360, y: 675};

/**
 * Definitions of app pie.
 * Possible properties in contained Objects:
 * name, id, action, sectorID, iconPath, shape, sc, lc, sa, la 
 * @property areasDefinitions 
 * @type Array of Objects
 **/
/**
 * Name of an application
 * @property name
 * @type string
 **/
/**
 * Id of an application
 * @property id
 * @type string
 **/
/**
 * Action after click to defined area.
 * @property action
 * @type function
 **/
/**
 * Sector id in context to homescreen pie sectors
 * @property sectorID
 * @type int
 **/
/**
 * Path to app icon
 * @property iconPath
 * @type string
 **/
/**
 * Define shape of clicking area
 * @property shape
 * @type string
 **/
/**
 * Small circle - define distance from center, where pie sector starts (influence only if shape is pieWithoutCenter)
 * @property sc
 * @type int
 **/
/**
 * Large circle - define distance from center, where pie sector ends
 * @property lc
 * @type int
 **/
/**
 * Start angle - define starting ange of pie sector. Angle is based on zero angle(zero angle has a line, which is horizontal and starts in the center point) (influence only if shape is pieWithoutCenter).
 * @property sa
 * @type int
 **/
/**
 * End angle - define ending angle of pie sector (influence only if shape is pieWithoutCenter).
 * @property la
 * @type int
 **/
var areasDefinitions = [ {
	name: 'center',
	id: null,
	action: function () {$("#homeScrAppGridView").fadeIn(); },
	sectorId: 0,
	lc: 70,
	shape: 'cenerCircle'
}, {
	name: 'navigation',
	id: 'http://com.intel.tizen/navigationgoogle',
	iconPath: '../navigation/icon.png',
	sectorId: 1,
	sc: 104,
	lc: 497,
	sa:	61,
	la:	117,
	shape: 'pieWithoutCenter'
}, {
	name: null,
	id: null,
	iconPath: '../dashboard/icon.png',
	sectorId: 2,
	sc: 94,		//small circle border
	lc: 437,	//large circle border
	sa:	11,		//smaller angle based on horizontal line which starts in center and continue right (right border) 
	la:	55,		//larger angle (left border)
	shape: 'pieWithoutCenter'
}, {
	name: 'musicplayer',
	id: 'http://com.intel.tizen/musicplayer',
	iconPath: '../musicplayer/icon.png',
	sectorId: 3,
	sc: 80,
	lc: 392,
	sa:	321,
	la:	359.9,
	shape: 'pieWithoutCenter'
}, {
	name: 'moviePlayer',
	id: 'http://com.intel.tizen/videoplayer',
	iconPath: '../videoplayer/icon.png',
	sectorId: 4,
	sc: 80,
	lc: 384,
	sa:	268,
	la:	306,
	shape: 'pieWithoutCenter'
}, {
	name: 'phone',
	id: 'http://com.intel.tizen/phone',
	iconPath: '../phone/icon.png',
	sectorId: 5,
	sc: 82,
	lc: 364,
	sa:	217,
	la:	264,
	shape: 'pieWithoutCenter'
}, {
	name: 'social',
	id: null,
	iconPath: '../musicplayer/icon.png',
	sectorId: 6,
	sc: 82,
	lc: 364,
	sa:	170,
	la:	212,
	shape: 'pieWithoutCenter'
}, {
	name: 'speed',
	id: 'http://com.intel.tizen/dashboard',
	iconPath: '../dashboard/icon.png',
	sectorId: 7,
	sc: 105,
	lc: 433,
	sa:	126,
	la:	160,
	shape: 'pieWithoutCenter'
} ];