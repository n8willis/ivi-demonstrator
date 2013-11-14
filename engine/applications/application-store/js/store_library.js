/**
 * Store module.
 * @module Store
 **/
/**
 * Provides functions for audio info JQuery Plugin panel.
 * @class storeLibrary
 * @static
 **/
/**
 * Hols array of apps categories.
 * @property _categories
 * @type array
 * @default empty
 * @static
 **/
var _categories = [];
/**
 * Hols object of selected apps category.
 * @property _selectedCategory
 * @type object
 * @default empty
 * @static
 **/
var _selectedCategory = {};
/**
 * Hols array of apps in selected category.
 * @property _categoryApplications
 * @type array
 * @default empty
 * @static
 **/
var _categoryApplications = [];
/**
 * Hols object of selected app detailed informations.
 * @property _selectedCategory
 * @type object
 * @default empty
 * @static
 **/
var _applicationDetail = {};
/**
 * Hols object of instalation timer.
 * @property _progress
 * @type timer
 * @default null
 * @static
 **/
var _progress;
/**
 * Hols object of uninstalation timer.
 * @property _unProgress
 * @type timer
 * @default null
 * @static
 **/
var _unProgress;
/**
 * Hols object of package repository.
 * @property packageRepository
 * @type PackageRepository
 * @default null
 * @static
 **/
var packageRepository;
var StoreLibrary = {
		/**
		 * Indicates if store library is initialized.
		 * @property initialized
		 * @type bool
		 * @default false
		 **/
		initialized: false,
		/**
		 * Provides initialization of store library.
		 * @method init
		 * @param showApps {bool} If true shows apps in store library ordered by category ID.
		 **/
		init: function (showApps) {
			$('#storeLibrary').library("setSectionTitle", "APP STORE");
			$('#storeLibrary').library("init");

			if (typeof PackageRepository != 'undefined') {
				packageRepository = new PackageRepository();
				packageRepository.getCategories(function (jsonObject) {
					if ((typeof jsonObject).toLowerCase() === "string") {
						try {
							_categories = JSON.parse(jsonObject);
						} catch (error) {
							console.log("Unable to parse categories: " + error.message);
						}
					} else {
						_categories = jsonObject;
					}

					var i = 0;
					for (i = 0; i < _categories.length; ++i) {
						if (i == 0) {
							_categories[i].selected = true;
							_selectedCategory = _categories[i];
							if (showApps == true || showApps == undefined) {
								StoreLibrary.showAppsByCategoryId(_selectedCategory.id);
							}
						}
						_categories[i].text = _categories[i].name;
						_categories[i].action = "StoreLibrary.showAppsByCategoryId('" + _categories[i].id + "');";
					}

					var tabMenuModel = {
							Tabs: _categories
						};

					$('#storeLibrary').library("tabMenuTemplateCompile", tabMenuModel);

					$('#storeLibrary').bind('eventClick_GridViewBtn', function () {
						$('#storeLibrary').library('closeSubpanel');
						StoreLibrary.showAppsByCategoryId(_categories[$('#storeLibrary').library('getSelectetTopTabIndex')].id);
					});

					$('#storeLibrary').bind('eventClick_ListViewBtn', function () {
						$('#storeLibrary').library('closeSubpanel');
						StoreLibrary.showAppsByCategoryId(_categories[$('#storeLibrary').library('getSelectetTopTabIndex')].id);
					});

					$('#storeLibrary').bind('eventClick_SearchViewBtn', function () {

					});

					$('#storeLibrary').bind('eventClick_menuItemBtn', function (e, data) {
						$('#storeLibrary').library('closeSubpanel');
						StoreLibrary.showAppsByCategoryId(_categories[$('#storeLibrary').library('getSelectetTopTabIndex')].id);
					});

					$('#storeLibrary').bind('eventClick_closeSubpanel', function () {
						StoreLibrary.showAppsByCategoryId(_categories[$('#storeLibrary').library('getSelectetTopTabIndex')].id);
					});
					StoreLibrary.initialized = true;
					StoreLibrary.show();
				});
			} else {
				console.warn("packageRepository is not available.");
			}
		},
		/**
		 * Shows library of apps in Store application.
		 * @method show
		 **/
		show: function () {
			$('#storeLibrary').library("showPage");
		},
		/**
		 * Sets category and detail of application.
		 * @method setAppDetailAndCategory
		 * @param categoryID {int} Contains ID of category to set.
		 * @param applicationID {int} Contains ID of app to show details.
		 **/
		setAppDetailAndCategory: function (categoryID, applicationID) {
			var tabID = 0, i = 0;
			for (i = 0; i < _categories.length; i++) {
				if (_categories[i].id == categoryID) {
					tabID = i;
					break;
				}
			}
			$('#storeLibrary').library('setTopTabIndex', tabID);
			if (!StoreLibrary.initialized) {
				StoreLibrary.init(false);
			}
			StoreLibrary.openAppDetail(applicationID);
			StoreLibrary.show();
		},
		/**
		 * Shows apps sorted by concrete categry.
		 * @method showAppsByCategoryId
		 * @param categoryID {int} Contains ID of category.
		 **/
		showAppsByCategoryId: function (categoryID) {
			packageRepository.getCategoryApplications(categoryID, function (jsonObject) {
				if ((typeof jsonObject).toLowerCase() === "string") {
					try {
						_categoryApplications = JSON.parse(jsonObject);
					} catch (error) {
						console.log("Unable to parse category applications: " + error.message);
					}
				} else {
					_categoryApplications = jsonObject;
				}

				switch ($('#storeLibrary').library('getSelectetLeftTabIndex')) {
				case GRID_TAB:
					StoreLibrary.renderAppsGridView(_categoryApplications);
					break;
				case LIST_TAB:
					StoreLibrary.renderAppsListView(_categoryApplications);
					break;
				default:
					break;
				}
			});
		},
		/**
		 * Shows apps in grid view.
		 * @method renderAppsGridView
		 * @param model {object} Contains model of applications.
		 **/
		renderAppsGridView: function (model) {
			$('#storeLibrary').library("setContentDelegate", "templates/storeLibraryAppsDelegate.html");
			$('#storeLibrary').library("contentTemplateCompile", model, "storeLibraryContentGrid");
		},
		/**
		 * Shows apps in list view.
		 * @method renderAppsGridView
		 * @param model {object} Contains model of applications.
		 **/
		renderAppsListView: function (model) {
			$('#storeLibrary').library("setContentDelegate", "templates/storeLibraryAppsDelegate.html");
			$('#storeLibrary').library("contentTemplateCompile", model, "storeLibraryContentList");
		},
		/**
		 * If model of an app dosen't contain screenshot, function set default one to model.
		 * @method enhanceModelsUrls
		 * @param appDetail {array} Contains array of objects which holds promotedapps informations.
		 * @return appDetail {array} Returns enhanced model of promoted apps.
		 **/
		enhanceModelUrls: function (appDetail) {
			appDetail.imageObjects = [];
			if (!!appDetail.screenshots) {
				$.each(appDetail.screenshots, function (imageIndex, urlobject) {
					appDetail.imageObjects.push({
						url: urlobject
					});
				});
			}
			return appDetail;
		},
		/**
		 * Opens app detail view.
		 * @method openAppDetail
		 * @param appID {string} Contains ID of app to show detail of it.
		 **/
		openAppDetail: function (appID) {
			packageRepository.getApplicationDetail(appID, function (jsonObject) {
				_applicationDetail = jsonObject;
				_applicationDetail = StoreLibrary.enhanceModelUrls(_applicationDetail);
				StoreLibrary.renderAppDetailView(_applicationDetail);
			});
		},
		/**
		 * Creates detail view of app.
		 * @method renderAppDetailView
		 * @param app {object} Contains object with app data.
		 **/
		renderAppDetailView: function (app) {
			var subpanelModel = {
					textTitle: StoreLibrary.getCategoryTitleById(app.category_id),
					textSubtitle: app.name || "-"
				};
			$('#storeLibrary').library("subpanelContentTemplateCompile", subpanelModel, function () {
				$("#libraryTopSubPanelTitle").boxCaptionPlugin('initSmall', subpanelModel.textTitle);
			});
			$('#storeLibrary').library('showSubpanel');
			$('#storeLibrary').library("setContentDelegate", "templates/detailApplicationContainer.html");
			$('#storeLibrary').library("contentTemplateCompile", app, "contact-detail", function () {
			});
		},
		/**
		 * Creates search view in store.
		 * @method renderSearchView
		 **/
		renderSearchView: function () {
			$('#storeLibrary').library("clearContent");
		},
		/**
		 * Returns title of a category based on category ID.
		 * @method getCategoryTitleById
		 * @param categoryID {string} Contains object with app data.
		 * @return {string} Title of category.
		 **/
		getCategoryTitleById: function (categoryID) {
			var i = 0;
			for (i = 0; i < _categories.length; i++) {
				if (_categories[i].id == categoryID) {
					return _categories[i].name;
				}
			}
			return "-";
		},
		/**
		 * Install a new app based on app id.
		 * @method installApp
		 * @param id {string} Contains app id.
		 **/
		installApp: function (id) {
			StoreLibrary.displayInstallProgress(true);
			packageRepository.install(id, function (jsonObject) {
				if (!jsonObject.error || jsonObject.error.indexOf('backslash') >= 0) {
					packageRepository.getApplicationDetail(id, function (appDetail) {
						appDetail.installed = true;
						StoreLibrary.installResult(null, true, appDetail);
					});
				} else {
					var instError = jsonObject.error;
					packageRepository.getApplicationDetail(id, function (appDetail) {
						appDetail.installed = false;
						StoreLibrary.installResult(instError, true, appDetail);
					});
				}
			});
		},
		/**
		 * Uninstall a new app based on app id.
		 * @method uninstallApp
		 * @param id {string} Contains app id.
		 **/
		uninstallApp: function (id) {
			StoreLibrary.displayInstallProgress(false);
			packageRepository.uninstall(id, function (jsonObject) {
				var instError = jsonObject.error;
				if (!!instError) {
					packageRepository.getApplicationDetail(id, function (appDetail) {
						appDetail.installed = true;
						StoreLibrary.installResult(instError, false, appDetail);
					});
				} else {
					packageRepository.getApplicationDetail(id, function (appDetail) {
						appDetail.installed = false;
						StoreLibrary.installResult(instError, false, appDetail);
					});
				}
			});
		},
		/**
		 * Called as callback after installing or uninstalling application.
		 * @method installResult
		 * @param error {bool} Error indicator.
		 * @param install {bool} Indicates if app was installed (true) or uninstalled (false).
		 * @param app {object} Object of app which was installed/uninstalled.
		 **/
		installResult: function (error, install, app) {
			var instLabel1 = 'INSTALLATION';
			var instLabel2 = 'INSTALLED';
			if (install == false) {
				instLabel1 = 'UNINSTALLATION';
				instLabel2 = 'UNINSTALLED';
			}
			if (!!error) {
				$('#installText').html(instLabel1 + ' FAILED');
			} else {
				$('#installText').html(instLabel2 + ' SUCCESSFULLY');
			}
			clearInterval(install == true ? _progress : _unProgress);
			setTimeout(function () {
				StoreLibrary.renderAppDetailView(app);
			}, 3000);
		},
		/**
		 * Displays proggres of instalation or uninstalation.
		 * @method displayInstallProgress
		 * @param install {bool} Indicates if app was installed (true) or uninstalled (false).
		 **/
		displayInstallProgress: function (install) {
			if (install == false) {
				$('#installText').html('UNINSTALLING...');
			}
			$('.textPanel').css('display', 'inline-block');
			$('.installButtons').css('display', 'none');
			var currentWidth = 0;
			var progressing = function () {
				currentWidth += 5;
				if (currentWidth >= 70) {
					currentWidth = 0;
				}
				$('#installBar').css({
					width: currentWidth + '%'
				});
			};

			if (install == true) {
				_progress = setInterval(progressing, 100);
			} else {
				_unProgress = setInterval(progressing, 100);
			}
		}
	};