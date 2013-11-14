/**
 * Provides the base Homescreen class...
 * @module Homescreen
 **/
/**
 * Provides functions for audio info JQuery Plugin panel.
 * @class audioInfoPanel
 * @static
 **/
(function ($) {
	var InfoPanelObj = {
			title: 'NOW PLAYING',
			artist: 'ARTIST',
			album: 'ALBUM',
			name: 'SONG NAME',
			/**
			 * Shows audio states.
			 * @method show
			 * @param obj {object} Contains updeted values for audio info panell on Homescreen
			 **/
			show: function (obj) {
				$("#audioHeader").html(obj.artist);
				$("#audioTitle").html(obj.name);
				$("#audioAlbum").html(obj.album);
			}
		};
	/**
	 * Plugin method calling logic.
	 * @method $.fn.infoPanel
	 * @param obj {string} Contains name of called function from jQuery plugin.
	 **/
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
