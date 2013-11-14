//audio time progress bar JQuery Plugin
/** 
 * @module VideoPlayer
 */
(function ($) {
	/**
	 * Class which provides methods to fill content of time progress bar for JQuery plugin.
	 * @class TimeProgressBarObj
	 * @static
	 */
	var VideoTimeProgressBarObj = {
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
				this.append('</div>' +
                        '<div id="videoName" class="leftvideoText fontColorNormal fontSizeLarge fontWeightBold">' +
						'Big Buck Bunny' +
						'</div>' +
						'<div id="videoTime" class="rightvideoText fontColorTheme fontSizeLarge fontWeightBold">' +
						'0:00' +
						'</div>' +
						'<div id="videoProgress" class="videoprogressBar borderColorTheme">' +
						'<div id="videoSeek"	class="videoprogressPot bgColorTheme boxShadow3"></div>' +
					'</div>');

				VideoTimeProgressBarObj.positionIndicator = $('#videoProgress #videoSeek');
				VideoTimeProgressBarObj.positionIndicator.css({width: '0 %'});
				VideoTimeProgressBarObj.thisObj = this;
				
				VideoTimeProgressBarObj.positionIndicator.css({width:  0 + '%'});
				VideoTimeProgressBarObj.position = 0;

				$("#videoProgress").click(function (e) {
					//alert("click");
					var elWidth = $(this).width(),
						parentOffset = $(this).parent().offset(),
						relativeXPosition = (e.pageX - parentOffset.left), //offset -> method allows you to retrieve the current position of an element 'relative' to the document
						progress = 0.00;
					if (elWidth > 0) {
						progress = relativeXPosition / elWidth;
					}
					VideoTimeProgressBarObj.thisObj.trigger('positionChanged', {position: (progress)});

				});
			},
			/**
			 * @method show 
			 */
			show: function (_position, _currentTime, trackName) {
				var textTime;
				textTime = VideoTimeProgressBarObj.formatTime(_currentTime);
				$("#videoTime").text(textTime);
				VideoTimeProgressBarObj.positionIndicator.css({width:  _position + '%'});
				VideoTimeProgressBarObj.position = _position;
				if (trackName != undefined)
				{
					$("#videoName").text(trackName);
				}
			},
			
			
			formatTime: function (time, hours) {
                var textTime;
                var h = Math.floor(time / 3600);
                time = time - h * 3600;
                var m = Math.floor(time / 60);
                var s = Math.floor(time % 60);
                textTime = " "+ h + ":";
		        if(m<10)
		        {
		          textTime +="0";
		        }
                textTime +=m + ":";
		        if(s<10)
		        {
		           textTime +="0";
		        }
                textTime +=s;
                return textTime;
            }
		};
	/**
	 * Class which provides acces to TimeProgressBarObj methods.
	 * @class timeProgressBar
	 * @constructor
	 * @param method {Object} Identificator (name) of method.
	 * @return Result of called method.
	 */
	$.fn.videotimeProgressBar = function (method) {
		// Method calling logic
		if (VideoTimeProgressBarObj[method]) {
			return VideoTimeProgressBarObj[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return VideoTimeProgressBarObj.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.infoPanelAPI');
		}
	};
}(jQuery));
