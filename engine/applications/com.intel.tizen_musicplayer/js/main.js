/** 
 * @module MusicPlayer
 */

/**
 * Class which provides methods to initialize UI and create listener for changing themes of music player.
 * @class init
 * @constructor
 */
var init = function () {
	if (typeof tizen == 'undefined') {
		console.warn("Tizen API not found, linking stub APIs");
		$("<script type='text/javascript' src='../../tizenApplication.js'> </script>").appendTo("body");
	}

	if (typeof ThemeEngine != 'undefined') {
		var te = new ThemeEngine();
		te.addStatusListener(function (aData) {
			window.location.reload();
		});
	} else {
		console.error("ThemeEngine API is not available, please start IVI server.");
	}

	Carousel.fill(musicLibraryModel);

	$("#topBarIcons").topBarIconsPlugin('init', 'musicplayer');
	$("#clockElement").ClockPlugin('init', 5);
	$("#clockElement").ClockPlugin('startTimer');
	$('#bottomPanel').bottomPanel('init');

	$('#audioPlayer').audioAPI('setControlButtonsSelector', '#audioButtons');
	$('#audioPlayer').audioAPI('setTimeProgressBarSelector', '#timeBar');
	$('#audioPlayer').audioAPI('setSpectrumAnalyzerSelector', '#spectAnalyzer');
	$('#audioPlayer').audioAPI('setInfoPanelSelector', '#infoPanel');
	$('#audioPlayer').audioAPI('setVolumeControlSelector', '#volumeControl');
	$('#audioPlayer').audioAPI('init', musicLibraryModel);
};

/** 
 * JQuery method which invokes function callback after html document DOM is ready. 
 * @event $(document).ready
 * @param function() {Callback} Reference to callback function. 
 */
$(document).ready(init);


/**
 * Class which provides initialization of music library.
 * @class openMusicLibrary
 * @constructor
 */
function openMusicLibrary() {
	if (!MusicLibrary.initialized) {
		MusicLibrary.init();
	} else {
		MusicLibrary.show();
	}
}