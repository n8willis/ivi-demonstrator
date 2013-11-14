/** 
 * @module Phone
 */

/**
 * Class which provides methods to operate with contacts library
 * @class ContactsLibrary
 * @static
 */
var ContactsLibrary = {
        /**
         * Holds status of initialization contacts library.
         * @property initialized {Boolean}
         */
        initialized: false,
        /** 
         * Method initialize contacts library
         * @method init
         */
        init: function () {
            $('#library').library("setSectionTitle", "PHONE CONTACTS");
            $('#library').library("init");

            var tabMenuModel = {
                    Tabs: [{
                        text: "CONTACTS A-Z",
                        selected: true
                    }]
                };

            $('#library').library("tabMenuTemplateCompile", tabMenuModel);

            $('#library').bind('eventClick_GridViewBtn', function () {
                $('#library').library('closeSubpanel');
                ContactsLibrary.showContacts();
            });

            $('#library').bind('eventClick_ListViewBtn', function () {
                $('#library').library('closeSubpanel');
                ContactsLibrary.showContacts();
            });

            $('#library').bind('eventClick_SearchViewBtn', function () {

            });

            $('#library').bind('eventClick_menuItemBtn', function (e, data) {
                $('#library').library('closeSubpanel');
                ContactsLibrary.showContacts();
            });

            $('#library').bind('eventClick_closeSubpanel', function () {
                ContactsLibrary.showContacts();
            });

            ContactsLibrary.renderContactsListView(function () {
                ContactsLibrary.initialized = true;
                ContactsLibrary.show();
            });
        },
        /** 
         * Method unhides library page.
         * @method show
         */
        show: function () {
            $('#library').library("showPage");
        },
        /** 
         * Method opens contact detail.
         * @method openContactDetail
         * @param id {Integer} Value of ID of contact details set.
         */
        openContactDetail: function (id) {
            var contact = getContactById(id);
            contact = ContactsLibrary.initContactDetail(contact);
            fillHistoryListByContactId(id, function (history) {
                contact.history = history;
                ContactsLibrary.renderContactDetailView(contact);
            });
        },
        /** 
         * Method load contact detail to grid view.
         * @method renderContactsGridView
         * @param successCallback {Object} Callback after success.
         */
        renderContactsGridView: function (successCallback) {
            $('#library').library("setContentDelegate", "templates/libraryContactListDelegate.html");
            $('#library').library("contentTemplateCompile", contacts, "contactsLibraryContentGrid", successCallback);
        },
        /** 
         * Method load contact detail to list view.
         * @method renderContactsListView
         * @param successCallback {Object} Callback after success.
         */
        renderContactsListView: function (successCallback) {
            $('#library').library("setContentDelegate", "templates/libraryContactListDelegate.html");
            $('#library').library("contentTemplateCompile", contacts, "contactsLibraryContentList", successCallback);
        },
        /** 
         * Method renders search view.
         * @method renderSearchView
         */
        renderSearchView: function () {
            $('#library').library("clearContent");
        },
        /** 
         * Method renders search view.
         * @method renderContactDetailView
         * @param contact {Object} Contact object.
         */
        renderContactDetailView: function (contact) {
            var subpanelModel = {
                    textTitle: "CONTACT",
                    textSubtitle: contact.name || "-"
                };
            $('#library').library("subpanelContentTemplateCompile", subpanelModel, function () {
                $("#libraryTopSubPanelTitle").boxCaptionPlugin('initSmall', subpanelModel.textTitle);
            });
            $('#library').library('showSubpanel');

            $('#library').library("setContentDelegate", "templates/libraryContactDetailDelegate.html");
            $('#library').library("contentTemplateCompile", contact, "contactDetail", function () {
                $("#contactDetailMobileTitle").boxCaptionPlugin('initSmall', "MOBILE");
                $("#contactDetailEmailTitle").boxCaptionPlugin('initSmall', "EMAIL");
                $("#contactDetailAddressTitle").boxCaptionPlugin('initSmall', "ADDRESS");
            });
        },
        /** 
         * Method which shows contacts in grid or list view
         * @method showContacts
         */
        showContacts: function () {
            switch ($('#library').library('getSelectetLeftTabIndex')) {
            case GRID_TAB:
                ContactsLibrary.renderContactsGridView();
                break;
            case LIST_TAB:
                ContactsLibrary.renderContactsListView();
                break;
            default:
                break;
            }
        },
        /** 
         * Method which initializies contact detail 
         * @method initContactDetail
         * @param contact {Object} Contact object.
         */
        initContactDetail: function (contact) {
            var tempContact = {
                    id: "",
                    name: "",
                    phoneNumber: "",
                    email: "",
                    photoURI: "",
                    address: "",
                    isFavorite: "",
                    history: []
                };

            if (contact) {
                var str = "";

                if (contact.id) {
                    tempContact.id = contact.id || "";
                }

                if (contact.name) {
                    str = contact.name.firstName || "";
                    str += contact.name.lastName ? " " + contact.name.lastName : "";
                    tempContact.name = str.trim();
                }

                if (contact.phoneNumbers) {
                    tempContact.phoneNumber = contact.phoneNumbers[0] && contact.phoneNumbers[0].number ? contact.phoneNumbers[0].number.trim() : "-";
                }

                if (contact.emails) {
                    tempContact.email = contact.emails[0] && contact.emails[0].email ? contact.emails[0].email.trim() : "-";
                }

                if (contact.photoURI) {
                    tempContact.photoURI = contact.photoURI.trim();
                }

                if (contact.addresses) {
                    str = contact.addresses[0] && contact.addresses[0].streetAddress ? contact.addresses[0].streetAddress.trim() + "<br />" : "";
                    str += contact.addresses[0] && contact.addresses[0].city ? contact.addresses[0].city.trim() + "<br />" : "";
                    str += contact.addresses[0] && contact.addresses[0].country ? contact.addresses[0].country.trim() + "<br />" : "";
                    str += contact.addresses[0] && contact.addresses[0].postalCode ? contact.addresses[0].postalCode.trim() : "";

                    if (str.toString().trim() == "") {
                        str = "-";
                    }

                    tempContact.address = str.trim();
                }

                tempContact.isFavorite = contact.isFavorite;
            }
            return tempContact;
        }
    };