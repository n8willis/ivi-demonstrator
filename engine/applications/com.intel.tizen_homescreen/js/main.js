/**
 * Provides the base Homescreen class...
 * @module Homescreen
 **/
/**
 * Provides inicialization of application and startup animations.
 * @class main
 * @static
 **/
var isPc = true,
	audioVolumeService,
	audioObj;

if (typeof tizen != 'undefined') {
	isPc = false;
}
//main
if (!window.intel_IVI) {
	window.intel_IVI = {};
}
animationOngoing = false;

/**
 * Initialize plugins, register events for Homescreen app.
 * @method init
 * @static
 **/
var init = function () {
	if (typeof tizen == 'undefined') {
		console.warn("Tizen API not found, linking stub APIs");
		$.get("../../tizenApplication.js", function (aResult) {
			eval(aResult);
			evalInstalledApps();
		});
	}
	if (typeof ThemeEngine != 'undefined') {
		var te = new ThemeEngine();
		te.addStatusListener(function (aData) {
			// keep this for IVI
			window.location.reload();
		});
	} else {
		console.error("ThemeEngine API is not available, please start IVI server.");
	}
	if (typeof CarIndicator != 'undefined') {
		var carInd = new CarIndicator();
		carInd.getStatus(carInd.evaluate);
		carInd.addStatusListener(carInd.evaluate);
	} else {
		console.error("CarIndicator API is not available, please start IVI server.");
	}
	$('#bottomPanel').bottomPanel('init', 'withoutBack');
	$('#dateTime').ClockPlugin('init', 60);
	$('#dateTime').ClockPlugin('startTimer');
	$("#topBarIcons").topBarIconsPlugin('init', 'homescreen');
	evalInstalledApps();
	intel_IVI.main.init();

	$(".bottomPanelLogoImg").live("click", function () {
		// keep this for IVI
		window.location.href = "/";
	});

	$('#audioPlayer').audioAPI('setControlButtonsSelector', '#audioButtons');
	$('#audioPlayer').audioAPI('setVolumeControlSelector', '#volumeControl');
	$('#audioPlayer').audioAPI('setInfoPanelSelector', '#audioHeader');
	$('#audioPlayer').audioAPI('init', musicLibraryModel);
	
	//Init Video Player info
	$('#currentVideoTrackName').text("test");
	var videoData = JSON.parse(localStorage.getItem(VIDEO_PLAYER_LOCAL_DATA_NAME));
    if (videoData == null)
    {
    	$('#currentVideoTrackName').text("Big Buck Bunny");
    }
    else
    {
         $('#currentVideoTrackName').text(videoData.name);
    }
};

/**
 * Calls initialization fuction after document is loaded.
 * @method $(document).ready
 * @param init {function} Callback function for initialize Homescreen.
 * @static
 **/
$(document).ready(init);

/**
 * Store state of audio plugin before application closing.
 * @method window.onbeforeunload
 * @static
 **/
window.onbeforeunload = function () {
	$('#audioPlayer').audioAPI('setStatusAll');
};

/**
 * Provides inicialization of application content and starts animation.
 * @class intel_IVI.main
 * @static
 **/
intel_IVI.main = (intel_IVI.main || {

	/**
	 * Calls initialization of content.
	 * @method init
	 **/
	init: function () {
		var viewPort = intel_IVI.corpus.init();
		document.body.appendChild(viewPort);
		intel_IVI.utility.startAnimation(1);
	},
	/**
	 * Provides reloading of content.
	 * @method counterEnd
	 **/
	counterEnd: function () {
		window.location.reload();
	}
});

function untouchable(param) {
	setTimeout(function () {
		animationOngoing = false;
	}, param);
}

/**
 * Provides initialization of animated application components.
 * @class intel_IVI.utility
 * @static
 **/
intel_IVI.utility = (intel_IVI.utility || {
	/**
	 * Starts initial animations on Homescreen.
	 * @method startAnimation
	 **/
	startAnimation: function (index) {
		$('#wrapper .step' + (index - 2)).css('opacity', '0');
		$('#wrapper .step' + index).css('opacity', '0.4');
		if (index == 10) {
			$('#indicator').addClass('showI');
			intel_IVI.utility.showContent(1);
			return;
		}
		var time = 40;
		setTimeout(function () {
			index++;
			intel_IVI.utility.startAnimation(index);
		}, time);
	},
	/**
	 * Shows animated content pies one by one.
	 * @method showContent
	 **/
	showContent: function (index) {
		$('#content_ul .sector' + index).css('opacity', '1');
		if (index === 4) {
			$('#bottomPanel').addClass('showBP');
			$('#dateTime').addClass('showDT');
			$('#topBarIcons').addClass('showTBI');
		}
		if (index === 8) {
			$('#wrapper .step9').css('opacity', '0.4');
			$('#wrapper .step9').addClass('liveBg');
			return;
		}
		setTimeout(function () {
			index++;
			intel_IVI.utility.showContent(index);
		}, 80);
	}
});

/**
 * Provides initialization of pie.
 * @class intel_IVI.corpus
 * @static
 **/
intel_IVI.corpus = (intel_IVI.corpus || {
	/**
	 * Create HTML elements of pie.
	 * @method init
	 **/
	init: function () {
		var i;
		for (i = 1; i < 10; i++) {
			var viewPortBg =  document.createElement('div');
			viewPortBg.className = "backGround step" + i;
			wrapper.appendChild(viewPortBg);
		}
		wrapper.appendChild(viewPort);
		return wrapper;
	}
});