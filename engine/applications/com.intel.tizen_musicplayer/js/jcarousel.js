/** 
 * @module MusicPlayer
 */

/**
 * Class which provides methods to operate with music titles carousel
 * @class Carousel
 * @static
 */
var Carousel = {
		/**
		 * Holds value of width of whole carousel panel.
		 * @property width {Integer}
		 */
		width: 12000,
		/**
		 * Holds value of elements count on carousel panel.
		 * @property elementCount {Integer}
		 */
		elementCount: 1,
		/**
		 * Holds value of element width on carousel panel.
		 * @property elementWidth {Integer}
		 */
		elementWidth: 260,
		/**
		 * Holds value of steep of element on carousel panel.
		 * @property steep {Integer}
		 */
		steep: 0,
		/**
		 * Holds value of minimun position of element on carousel panel.
		 * @property minPosition {Integer}
		 */
		minPosition: 0,
		/**
		 * Holds value of maximun position of element on carousel panel.
		 * @property maxPosition {Integer}
		 */
		maxPosition: 0,
		/**
		 * Holds value of center position of element on carousel panel.
		 * @property centerPosition {Integer}
		 */
		centerPosition: 460,
		/**
		 * Holds value of current position of element on carousel panel.
		 * @property currentPosition {Integer}
		 */
		currentPosition: 0,
		/**
		 * Holds value of current index of center element on carousel panel.
		 * @property currentIndex {Integer}
		 */
		currentIndex: 1,
		/**
		 * Holds value of move constant of element on carousel panel.
		 * @property moveConstant {Integer}
		 */
		moveConstant: 30,
		/**
		 * Holds value of previous touch of element on carousel panel.
		 * @property prevTouch {Integer}
		 */
		prevTouch: 0,
		/** 
		 * Method is initializing music carousel.
		 * @method setUp
		 * @param model {Object} Model is static class of music library.
		 */
		setUp: function (model) {
			this.elementCount = model.length;
			this.width = this.elementWidth * this.elementCount;
			this.minPosition = -(this.width - (this.elementWidth * 1.5));
			this.maxPosition = this.centerPosition;
			this.steep = this.elementWidth;
			this.currentPosition = this.elementWidth;
			$("#currentlyPlayingPreview").attr('src', model[0].image);
			this.touchEnd();
		},
		/** 
		 * Method is invoked when carousel is moving left.
		 * @method moveLeft
		 * @param object {Object} Object is current this carousel object.
		 */
		moveLeft: function (object) {
			if ((this.currentPosition - this.steep) > this.minPosition) {
				this.currentPosition = this.currentPosition - this.steep;
				object.style.webkitTransform = "translate(" + this.currentPosition + "px,0px)";
			}
			this.prevTouch = 0;
		},
		/** 
		 * Method is invoked when carousel is moving left.
		 * @method moveRight
		 * @param object {Object} Object is current this carousel object.
		 */
		moveRight: function (object) {
			if ((this.currentPosition + this.steep) < this.maxPosition) {
				this.currentPosition = this.currentPosition + this.steep;
				object.style.webkitTransform = "translate(" + this.currentPosition + "px,0px)";
			}
			this.prevTouch = 0;
		},
		/** 
		 * Method is invoked by touch move event.
		 * @method touchMove
		 * @param object {Object} Object is current this carousel object.
		 */
		touchMove: function (object) {
			var currTouch = window.event.clientX;
			if (this.prevTouch != 0) {
				this.currentPosition = this.currentPosition + (currTouch - this.prevTouch);
				if (this.currentPosition < this.maxPosition && this.currentPosition > this.minPosition) {
					object.style.webkitTransition = "transition(5s)";
					object.style.webkitTransform = "translate(" + this.currentPosition + "px,0px)";
				}
			}
			this.prevTouch = window.event.clientX;
			this.touchEnd(object);
		},
		/** 
		 * Method is invoked by touch end event.
		 * @method touchEnd
		 * @param object {Object} Object is current this carousel object.
		 */
		touchEnd: function (object) {
			var cur_item_name = "#item_" + this.currentIndex;
			$(cur_item_name).find(".carouselShadow").css('display', 'none');
			var current_item = Math.round((-(this.currentPosition) + this.centerPosition) / this.elementWidth);
			if (current_item <= 1) {
				current_item = 1;
			} else if (current_item >= this.elementCount) {
				current_item = this.elementCount;
			}
			this.currentIndex = current_item;
			cur_item_name = "#item_" + this.currentIndex;
			var newSrc = $(cur_item_name).find(".carouselImage").attr('src');
			if (newSrc != "undefined") {
				$(cur_item_name).find(".carouselShadow").css('display', 'block');
				$("#currentlyPlayingPreview").attr('src', newSrc);
			}
			this.prevTouch = window.event.clientX;
		},
		/** 
		 * Method is invoked by touch event.
		 * @method touch
		 * @param object {Object} Object is current this carousel object.
		 */
		touch: function (object) {
			if (window.event.clientX < this.centerPosition) {
				this.moveRight(object);
			} else if (window.event.clientX > this.centerPosition) {
				this.moveLeft(object);
			}
			this.touchEnd(object);
			$('#audioPlayer').audioAPI('setIndex', this.currentIndex);
			$('#audioPlayer').audioAPI('init', musicLibraryModel, "true", "true");
		},
		/** 
		 * Method provides setting new value of index.
		 * @method setIndex
		 * @param new_index {Integer} Value of new index.
		 */
		setIndex: function (new_index) {
			var cur_item_name = "#item_" + this.currentIndex;
			$(cur_item_name).find(".carouselShadow").css('display', 'none');
			this.currentPosition = (-(this.elementWidth * (new_index - 1)) + this.elementWidth) - this.moveConstant;
			var current_item = new_index;
			if (current_item <= 1) {
				current_item = 1;
			} else if (current_item >= this.elementCount) {
				current_item = this.elementCount;
			}
			this.currentIndex = current_item;
			cur_item_name = "#item_" + this.currentIndex;
			$(cur_item_name).find(".carouselShadow").css('display', 'block');
			var newSrc = $(cur_item_name).find(".carouselImage").attr('src');
			if (newSrc != "undefined") {
				$("#currentlyPlayingPreview").attr('src', newSrc);
				$(cur_item_name).find(".carouselShadow").css('display', 'block');
				$("#carouselObject").css('webkitTransform', 'translate(' + this.currentPosition + 'px,0px)');
			}
		},
		/** 
		 * Method returns current value of index.
		 * @method getSelectedElement
		 * @return Current index of selected element.
		 */
		getSelectedElement: function () {
			return (this.currentIndex);
		},
		/** 
		 * Method fill content of carousel from music library model.
		 * @method fill
		 * @param model {Object} Model contains albums, artists and songs array from music library.
		 */
		fill: function (model) {
			var i;
			for (i = 0; i < model.length; i++) {
				model[i].index = 1 + i;
				model[i].artist = model[i].artist.toUpperCase();
				model[i].album = model[i].album.toUpperCase();
			}
			template.compile(model, "templates/carouselDelegate.html", "#carousel_wrap");
			this.setUp(model);
			$("#audioPlayer").unbind('audioIndexUpdate');
			$("#audioPlayer").bind('audioIndexUpdate', function (e, data) {
				Carousel.setIndex(parseInt(data.audioIndex, 10));
			});
		}
	};
