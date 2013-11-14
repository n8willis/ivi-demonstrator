/**
 * Provides the base Homescreen class...
 * @module Homescreen
 **/
/**
 * Provides selecting pies and start selected application by keyboard.
 * @class keyControl
 * @static
 **/
var KeyControl = {
		/**
		 * Define selected sector (pie, app).
		 * @property homeScreenselectedIndex
		 * @type int
		 * @default 1
		 **/
		homeScreenselectedIndex: 1,
		/**
		 * Indicate if some sector is selected.
		 * @property sectionHighlited
		 * @type bool
		 * @default false
		 **/
		sectionHighlited: false,
		/**
		 * Timer for reset highlited pie after predefined timer interval in timerInteval property.
		 * @property timer
		 * @type Object
		 * @default null
		 **/
		timer: null,
		/**
		 * Define interval for unhighlight and unselect selected sector if keyboard is inactive more than defined interval.
		 * @property timerIterval
		 * @type int
		 * @default 5000 (ms)
		 **/
		timerIterval: 5000,
		/**
		 * Provides changing of selected sector, highlights it and unhighlight previous higlighted. Also provides setting of timer.
		 * @method changeIndex
		 * @param direction {string} Could be 'prev', 'next' for change highigting for prev or next sector and 'null' only for unhighligting sector
		 **/
		changeIndex: function (direction) {
			var i = 0;
			for (i = 0; i < areasDefinitions.length; i++) {
				if (areasDefinitions[i].sectorId != null) {
					$('.sector' + areasDefinitions[i].sectorId).removeClass('selected');
				}
			}
			if (direction != null) {
				if (KeyControl.sectionHighlited == true) {
					clearTimeout(KeyControl.timer);
					KeyControl.timer = setTimeout('KeyControl.changeIndex()', KeyControl.timerIterval);
					switch (direction) {
					case 'prev':
						KeyControl.prevIndex();
						break;
					case 'next':
						KeyControl.nextIndex();
						break;
					}
					$('.sector' + KeyControl.homeScreenselectedIndex).addClass('selected');
				} else {
					KeyControl.sectionHighlited = true;
					$('.sector' + KeyControl.homeScreenselectedIndex).addClass('selected');
					KeyControl.timer = setTimeout('KeyControl.changeIndex()', KeyControl.timerIterval);
				}
			} else {
				KeyControl.sectionHighlited = false;
			}
		},
		/**
		 * Provides changing index of selected sector to next one in circle.
		 * @method nextIndex
		 * **/
		nextIndex: function () {
			KeyControl.homeScreenselectedIndex++;
			if (KeyControl.homeScreenselectedIndex > 7) {
				KeyControl.homeScreenselectedIndex = 1;
			}
		},
		/**
		 * Provides changing index of selected sector to previous one in circle.
		 * @method prevIndex
		 **/
		prevIndex: function () {
			KeyControl.homeScreenselectedIndex--;
			if (KeyControl.homeScreenselectedIndex < 1) {
				KeyControl.homeScreenselectedIndex = 7;
			}
		},
		/**
		 * Provides start of app by confirmation of selected sector with keyboard.
		 * @method prevIndex
		 **/
		confirmed: function () {
			if (KeyControl.sectionHighlited) {
				switch (KeyControl.homeScreenselectedIndex) {
				case 1:
					onFrameClick(areasDefinitions[1]);
					break;//maps
				case 3:
					onFrameClick(areasDefinitions[3]);
					break;//musicPlayer
				case 5:
					onFrameClick(areasDefinitions[5]);
					break;//phone
				case 7:
					onFrameClick(areasDefinitions[7]);
					break;//dashboard
				}
			}
		}
	};

/**
 * Provides catching and sorting of keyboard events.
 * @method $(document).keypress
 * @param callback {function} For calling functions on specific key press.
 * @static
 **/
$(document).keypress(function (event) {
	switch (event.keyCode) {
	case 97:
		KeyControl.changeIndex('prev'); // a 
		break;
	case 100:
		KeyControl.changeIndex('next');  // d
		break;
	case 13:
		KeyControl.confirmed();
		break;
	}
});
