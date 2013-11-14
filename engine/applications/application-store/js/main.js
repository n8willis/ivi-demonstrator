/**
 * Store module.
 * @module Store
 **/
/**
 * Provides functions for audio info JQuery Plugin panel.
 * @class main
 * @static
 **/
/**
 * Initialize plugins, register events for Store app.
 * @method init
 * @static
 **/
var init = function () {
	if (typeof tizen == 'undefined') {
		console.warn("Tizen API not found, linking stub APIs");
		$.get("../../tizenApplication.js", function (aResult) {
			eval(aResult);
		});
	}

	if (typeof ThemeEngine != 'undefined') {
		var te = new ThemeEngine();
		te.addStatusListener(function (aData) {
			window.location.reload();
		});
	} else {
		console.error("ThemeEngine API is not available, please start IVI server.");
	}

	$("#topBarIcons").topBarIconsPlugin('init', 'store');
	$("#clockElement").ClockPlugin('init', 5);
	$("#clockElement").ClockPlugin('startTimer');
	$('#bottomPanel').bottomPanel('init');

	var packageRepository = new PackageRepository();
	packageRepository.getPromotedApplications(function (jsonObject) {
		if (!jsonObject.error) {
			promotedApplicationsModel = jsonObject;
			promotedApplicationsModel = promotedController.enhanceModelsUrls(promotedApplicationsModel);
			$("#carouselObject").carousel('fill', promotedApplicationsModel);
		} else {
			console.error(jsonObject.error);
		}
	});

	popularController.addHeader();
	packageRepository.getPopularApplications(function (jsonObject) {
		if (!jsonObject.error) {
			popularAppsModel = jsonObject;
			popularAppsModel = popularController.enhanceModelsUrls(popularAppsModel);
			popularController.fillView(popularAppsModel);
		} else {
			console.error(jsonObject.error);
		}
	});
};

/**
 * Calls initialization fuction after document is loaded.
 * @method $(document).ready
 * @param init {function} Callback function for initialize Store.
 * @static
 **/
$(document).ready(init);

/**
 * Opens store library after it's initialization or initialize library if it's not.
 * @method openStoreLibrary
 * @static
 **/
function openStoreLibrary() {
	if (!StoreLibrary.initialized) {
		StoreLibrary.init();
	} else {
		StoreLibrary.show();
	}
}