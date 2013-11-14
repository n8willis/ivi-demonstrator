/**
 * Provides the base Homescreen class...
 * @module Homescreen
 **/
/**
 * Provides getting list of installed apps, displaing it in app grid view and launch installed app by clicking on app representation in gred view.
 * @class installedApps
 * @static
 **/
/**
 * Global variable which holds the list component in the UI
 * @property appList
 * @type array
 **/
var appList = [];
/**
 * Global variable which holds the identifier of the application information event listener
 * @property appList
 * @type string
 * @default null
 **/
var listenerID = null;
/**
 * Global variable which holds the current index of last element in appList
 * @property index
 * @type int
 * @default 0
 **/
var index = 0;

/**
 * Provides hiding installed app grid afted click out of app cells.
 * @method $
 * @static
 **/
$(function () {
	$("#homeScrAppGridView").live("click", function () {
		$(this).fadeOut();
	});
});

/**
 * Create app grid view based on appList.
 * @method insertAppFrame
 * @param appFrame {object} Contains Object of specific app from appList property.
 * @static
 **/
function insertAppFrame(appFrame) {
	var rootDiv = $("<div></div>").addClass("homeScrAppGridFrame boxShadow3").data("app-data", appFrame).click(function () {
		onFrameClick($(this).data("app-data"));
	});

	var innerDiv = $("<div></div>").addClass("homeScrAppGridImg").appendTo(rootDiv);
	$("<img />").data("src", appFrame.iconPath).appendTo(innerDiv);
	var textDiv = $("<div />").addClass("homeScrAppGridText").appendTo(rootDiv);
	$("<div />").addClass("homeScrAppGridTitle fontColorNormal fontSizeSmaller fontWeightBold").text(appFrame.name).appendTo(textDiv);
	$("<div />").addClass("homeScrAppGridCategory").text(appFrame.name).appendTo(textDiv);

	$('#homeScrAppGridView').append(rootDiv);

	var img = new Image();
	var ctx = document.createElement('canvas').getContext('2d');

	img.onload = function () {
		var w = ctx.canvas.width = img.width;
		var h = ctx.canvas.height = img.height;
		ctx.fillStyle = ThemeKeyColor;
		ctx.fillRect(0, 0, w, h);
		ctx.globalCompositeOperation = 'destination-in';
		ctx.drawImage(img, 0, 0);

		$("div.homeScrAppGridImg img").each(function () {
			if ($(this).data("src") == appFrame.iconPath) {
				$(this)[0].src = ctx.canvas.toDataURL();
			}
		});
	};
	img.src = appFrame.iconPath;

	index++;
	appList.push(appFrame);
}

/**
 * Callback method for getting and resorting appList array for Homescreen app using.
 * @method onAppInfoSuccess
 * @param list {array} Contains Objects of apps from evalInstalledApps listener.
 * @static
 **/
function onAppInfoSuccess(list) {
	var i = 0;
	try {
		index = 0;
		appList = [];
		$('#homeScrAppGridView .homeScrAppGridFrame').remove();
		var settings = {
				id: "http://com.intel.tizen/settings",
				name: "Settings",
				show: true,
				iconPath: "../../css/car/components/settings/icon.png"
			};
		insertAppFrame(settings);
		for (i = 0; i < list.length; i++) {
			if ((list[i].show === true) && (list[i].id !== "http://com.intel.tizen/homescreen")) {
				insertAppFrame(list[i]);
			}
		}
	} catch (exc) {
		console.error(exc.message);
	}
}

/**
 * Provide logging of app launch success.
 * @method onLaunchSuccess
 * @static
 **/
function onLaunchSuccess() {
	console.log("App launched...");
}

/**
 * Provide logging of app launch error.
 * @method onError
 * @param err {string} Error message.
 * @static
 **/
function onError(err) {
	console.error(err.message);
}

/**
 * Provide launch of application.
 * @method onFrameClick
 * @param appData {object} Contains Object of specific app.
 * @static
 **/
function onFrameClick(appData) {
	//launch application
	var i;
	try {
		for (i = 0; i < appList.length; ++i) {
			if (appList[i].id == appData.id) {
				if (appData.id == "http://com.intel.tizen/settings") {
					if (typeof Settings == 'undefined') {
						loadScript('../../css/car/components/settings/js/settings.js', function (path, status) {
							if (status == "ok") {
								Settings.init();
							}
						});
					} else {
						if (!Settings.initialized) {
							Settings.init();
						} else {
							Settings.show();
						}
					}
				} else {
					tizen.application.launch(appData.id, onLaunchSuccess, onError);
				}
				break;
			}
		}
	} catch (exc) {
		console.error(exc.message);
	}
}
/**
 * Provides listener for app evets.
 * @class onAppEvent
 * @static
 **/
var onAppEvent = {
		/**
		 * If new app is installed method add new app to appList and create frame in app grid view.
		 * @method oninstalled
		 * @param appInfo {object} Contains Object of newly installed app.
		 **/
		oninstalled: function (appInfo) {
			try {
				insertAppFrame(appInfo);
			} catch (exc) {
				console.error(exc.message);
			}
		},
		/**
		 * If app is uninstalled method add rearange appList and recreate app grid view.
		 * @method oninstalled
		 * @param appId {string} Contains ID of uninstalled app.
		 **/
		onuninstalled: function (appId) {
			var temp_appList = [], j, i;
			for (j = 0; j < appList.length; j++) {
				var obj = appList[j];
				temp_appList.push(obj);
			}
			index = 0;
			appList = [];
			$('#homeScrAppGridView').empty();
			for (i = 0; i < temp_appList.length; i++) {
				if ((temp_appList[i].id !== appId) && (temp_appList[i].show === true) && (temp_appList[i].name != "Dashboard")) {
					insertAppFrame(temp_appList[i]);
				}
			}
		},
		/**
		 * If app is updated method change app info by calling onAppInfoSuccess method in installedApps class.
		 * @method onupdated
		 * @param appInfo {object} Contains Object of newly updated app.
		 **/
		onupdated: function (appInfo) {
			try {
				tizen.application.getAppsInfo(onAppInfoSuccess, onError);
			} catch (exc) {
				console.error(exc.message);
			}
		}
	};

/**
 * Listener for installed apps events.
 * @method evalInstalledApps
 * @static
 **/
function evalInstalledApps() {
	if (typeof tizen != 'undefined') {
		try {
			// get the installed applications list
			tizen.application.getAppsInfo(onAppInfoSuccess, onError);
			// set the application information event listener
		} catch (exc) {
			console.error(exc.message);
		}
	}
}
