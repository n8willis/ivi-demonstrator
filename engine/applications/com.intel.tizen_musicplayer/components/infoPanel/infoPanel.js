//audio info panel JQuery Plugin

/** 
 * @module MusicPlayer
 */
(function ($) {
	/**
	 * Class which provides methods to fill content of info panel for JQuery plugin.
	 * @class InfoPanelObj
	 * @static
	 */
	var InfoPanelObj = {
			title: 'NOW PLAYING',
			artist: 'ARTIST',
			album: 'ALBUM',
			name: 'SONG NAME',
			/** 
			 * Method is initializing info panel.
			 * @method show
			 * @param obj {Object} Object which contains properties title, artist, album and name.
			 */
			show: function (obj) {
				InfoPanelObj.title = obj.title;
				InfoPanelObj.artist = obj.artist;
				InfoPanelObj.album = obj.album;
				InfoPanelObj.name = obj.name;
				this.empty();
				this.append('<div class="fontColorNormal fontSizeLarger fontWeightBold artistNameTextMargin">' + obj.artist.toUpperCase() + '</div>' +
						'<div class="fontSizeSmaller fontColorTheme fontWeightBold">' + obj.album.toUpperCase() + '</div>' +
						'<div class="fontSizeXXLarge fontColorNormal fontWeightBold songNameTextPosition">' + obj.name.toUpperCase() + '</div>');
				$("#nowPlaying").boxCaptionPlugin('init', obj.title);
			}
		};
	/** 
	 * Class which provides acces to InfoPanelObj methods.
	 * @class infoPanel
	 * @constructor
	 * @param method {Object} Identificator (name) of method.
	 * @return Result of called method.
	 */
	$.fn.infoPanel = function (method) {
		// Method calling logic
		if (InfoPanelObj[method]) {
			return InfoPanelObj[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return InfoPanelObj.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.infoPanelAPI');
		}
	};
}(jQuery));
