/**
 * Store module.
 * @module Store
 **/
/**
 * Provides functions for audio info JQuery Plugin panel.
 * @class promotedController
 * @static
 **/
/**
 * Hols promoted apps model.
 * @property promotedApplicationsModel
 * @type object
 * @default null
 * @static
 **/
var promotedApplicationsModel = null;
/**
 * Hols promoted apps model length.
 * @property promotedApplicationsModelLenght
 * @type int
 * @default null
 * @static
 **/
var promotedApplicationsModelLenght;
var promotedController = {
		/**
		 * Creates store view based on model parameter.
		 * @method fillView
		 * @param model {array} Contains array of objects which holds promoted apps informations.
		 **/
		fillView: function (model) {
			console.log("filling Promoted view");
			var i;
			for (i = 0; i < model.length; i++) {
				model[i].index = i;
			}
			promotedApplicationsModelLenght = model.length;
			template.compile(model, "templates/promotedApplicationContainer.html", "#promoted_applications_table");
		},
		/**
		 * If app dosen't contains icon, function set default one to model.
		 * @method enhanceModelsUrls
		 * @param model {array} Contains array of objects which holds promoted apps informations.
		 * @return model {array} Returns enhanced model of promoted apps.
		 **/
		enhanceModelsUrls: function (model) {
			$.each(model, function (itemIndex, item) {
				if (!!item.images) {
					$.each(item.images, function (imageIndex, urlobject) {
						item.images[imageIndex] = {
							url: Config.httpPrefix + urlobject
						};
					});
				}
			});
			return model;
		}
	};