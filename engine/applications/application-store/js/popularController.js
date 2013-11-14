/**
 * Store module.
 * @module Store
 **/
/**
 * Provides functions for audio info JQuery Plugin panel.
 * @class popularController
 * @static
 **/
/**
 * Hols popular apps model.
 * @property popularAppsModel
 * @type object
 * @default null
 * @static
 **/
var popularAppsModel = null;
/**
 * Holds popular apps model length.
 * @property popularAppsModel
 * @type int
 * @default null
 * @static
 **/
var popularAppsModelLenght;
var popularController = {
		/**
		 * Adds header bar to store app.
		 * @method addHeader
		 **/
		addHeader: function () {
			$('#appDetailWraper').append('<div class="popularHeader fontSizeXLarge fontWeightBold fontColorDark">MOST POPULAR</div>');
			$('#appDetailWraper').append('<div id="popularApps" class="popularAppsContainer"></div>');
		},
		/**
		 * Creates store view based on model parameter.
		 * @method fillView
		 * @param model {array} Contains array of objects which holds popular apps informations.
		 **/
		fillView: function (model) {
			console.log("filling popular view");
			var i;
			for (i = 0; i < model.length; i++) {
				model[i].index = i;
			}
			popularAppsModelLenght = model.length;
			template.compile(model, "templates/popularAppsContainer.html", "#popularApps");
		},
		/**
		 * If app dosen't contains icon, function set default one to model.
		 * @method enhanceModelsUrls
		 * @param model {array} Contains array of objects which holds popular apps informations.
		 * @return model {array} Returns enhanced model of popular apps.
		 **/
		enhanceModelsUrls: function (model) {
			$.each(model, function (itemIndex, item) {
				item.imageObjects = [];
				if (!!item.images) {
					$.each(item.images, function (imageIndex, urlobject) {
						item.imageObjects.push({
							url: Config.httpPrefix + urlobject
						});
					});
				}
			});
			return model;
		}
	};