/** 
 * @module Phone
 */

/**
 * Holds status import default contacts.
 * @property importDefaultContacts {Boolean}
 */
var importDefaultContacts = true,
/**
 * Holds value of search term.
 * @property search_term {String}
 */
	search_term = "";

/**
 * Class which provide method to obtain Tizen address books.
 * @class getTizenAddressBooks
 * @constructor
 */
function getTizenAddressBooks() {
	try {
		tizen.contact.getAddressBooks(onGetAddressBooksSuccess, onError);
	} catch (err) {
		alert("Error: GetAddressBooks failed: " + err.code + ": " + err.message);
	}
}

/**
 * Class which provide method to alert error message.
 * @class onError
 * @constructor
 */
function onError(err) {
	alert("Error(" + err.code + "): " + err.message);
}

/**
 * Class which provide callback on get address book success.
 * @class onGetAddressBooksSuccess
 * @constructor
 */
function onGetAddressBooksSuccess(addressbooks) {
	if (addressbooks.length) {
		if (address_books == null) {
			var defaultAddressbook = tizen.contact.getDefaultAddressBook();
			if (defaultAddressbook) {
				address_books = defaultAddressbook;
			} else {
				address_books = addressbooks[0];
			}
		}

		fetchContacts();
	} else {
		console.log("No address books found.");
	}
}

/**
 * Class which provide fetch contacts.
 * @class fetchContacts
 * @constructor
 */
function fetchContacts() {
	if (address_books) {
		//CompositeFilter not working in web simulator
		var lastNameFilter = new tizen.AttributeFilter("name.lastName", "CONTAINS", search_term);
		var sortingMode = new tizen.SortMode("name.lastName", "ASC");

		try {
			address_books.find(onContactFindSuccess, onError, lastNameFilter, sortingMode);
		} catch (e) {
			alert("Error: " + e.message);
		}
	}
}

/**
 * Class which provide callback on contact find success.
 * @class onContactFindSuccess
 * @param found_contacts {Object} Object contains found contacts. 
 * @constructor
 */
function onContactFindSuccess(found_contacts) {
	if (!found_contacts.length && importDefaultContacts == true) {
		$.getJSON("data/contacts.json", function (data) {
			var j, tempContacts = (typeof data).toLowerCase() == "string" ? JSON.parse(data) : data;
			tempContacts = tempContacts.contacts;
			for (j = 0; j < tempContacts.length; j++) {
				var contact = new tizen.Contact({
					name: tempContacts[j].name || null,
					emails: tempContacts[j].emails || null,
					phoneNumbers: tempContacts[j].phoneNumbers || null,
					photoURI: tempContacts[j].photoURI || null,
					addresses: tempContacts[j].addresses || null
				});
				try {
					address_books.add(contact);
				} catch (e) {
					alert("Error: " + e.message);
				}
			}
			importDefaultContacts = false;
			fetchContacts();
		});
	} else {
		contacts = found_contacts;
		sortAndfillContactsCarousel();
	}
}