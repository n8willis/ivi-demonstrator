//audio time progress bar JQuery Plugin
/** 
 * @module MusicPlayer
 */
(function ($) {
	/**
	 * Class which provides methods to fill content of time progress bar for JQuery plugin.
	 * @class TimeProgressBarObj
	 * @static
	 */
	var TimeProgressBarObj = {
			/**
			 * Holds current object of this JQuery plugin.
			 * @property thisObj {Object}
			 */
			thisObj: null,
			/**
			 * Holds current object of position indicator.
			 * @property positionIndicator {Object}
			 */
			positionIndicator: null,
			/**
			 * Holds current text of top right caption.
			 * @property right_text {String}
			 */
			right_text: null,
			/**
			 * Holds current text of top left caption.
			 * @property left_text {String}
			 */
			left_text: null,
			/**
			 * Holds current count of songs in playlist.
			 * @property count {Integer}
			 */
			count: 0,
			/**
			 * Holds current index of song from playlist.
			 * @property index {Integer}
			 */
			index: 0,
			/**
			 * Holds current estimation of song from playlist.
			 * @property estimation {String}
			 */
			estimation: "",
			/**
			 * Holds current position of song from playlist.
			 * @property position {Integer}
			 */
			position: 0,
			/** 
			 * Method is initializing time progress bar.
			 * @method init 
			 */
			init: function () {
				this.empty();
				this.append('<div id="songIndex" class="leftText fontColorNormal fontSizeLarge fontWeightBold">' +
						'0/0' +
						'</div>' +
						'<div id="songTime" class="rightText fontColorTheme fontSizeLarge fontWeightBold">' +
						'-0:00' +
						'</div>' +
						'<div id="songProgress" class="progressBar borderColorTheme">' +
						'<div id="songSeek"	class="progressPot bgColorTheme boxShadow3"></div>' +
					'</div>');

				TimeProgressBarObj.positionIndicator = $('#songProgress #songSeek');
				TimeProgressBarObj.left_text = $('#songIndex');
				TimeProgressBarObj.right_text = $('#songTime');
				TimeProgressBarObj.positionIndicator.css({width: '0 %'});
				TimeProgressBarObj.thisObj = this;

				$("#songProgress").click(function (e) {
					var elWidth = $(this).width(),
						parentOffset = $(this).parent().offset(),
						relativeXPosition = (e.pageX - parentOffset.left), //offset -> method allows you to retrieve the current position of an element 'relative' to the document
						progress = 0.00;
					if (elWidth > 0) {
						progress = relativeXPosition / elWidth;
					}
					TimeProgressBarObj.thisObj.trigger('positionChanged', {position: (progress * 100)});
				});
			},
			/**
			 * Method is rendering position bar and position information from song.
			 * @method show 
			 */
			show: function (objSong) {
				$("#songIndex").empty();
				$("#songIndex").append(objSong.index + '/' + objSong.count);
				$("#songTime").empty();
				$("#songTime").append(objSong.estimation);
				TimeProgressBarObj.count = objSong.count;
				TimeProgressBarObj.index = objSong.index;
				TimeProgressBarObj.estimation = objSong.estimation;
				TimeProgressBarObj.positionIndicator.css({width:  objSong.position + '%'});
				TimeProgressBarObj.position = objSong.position;
			}
		};
	/**
	 * Class which provides acces to TimeProgressBarObj methods.
	 * @class timeProgressBar
	 * @constructor
	 * @param method {Object} Identificator (name) of method.
	 * @return Result of called method.
	 */
	$.fn.timeProgressBar = function (method) {
		// Method calling logic
		if (TimeProgressBarObj[method]) {
			return TimeProgressBarObj[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return TimeProgressBarObj.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.infoPanelAPI');
		}
	};
}(jQuery));
