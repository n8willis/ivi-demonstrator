/** 
 * @module Phone
 */

/**
 * Holds object of input for dialing phone number.
 * @property tel_input {Object}
 */
var tel_input;
/**
 * Holds array of contacts.
 * @property contacts {Object[]}
 */
var contacts = [];
/**
 * Holds array of history contacts.
 * @property history {Object[]}
 */
var history = [];
/**
 * Holds selected contact object.
 * @property selected_contact {Object}
 */
var selected_contact = null;
var address_books = null;

/** 
 * JQuery method which invokes function callback after html document DOM is ready. 
 * @event $(document).ready
 * @param function() {Callback} Reference to callback function. 
 */
$(document).ready(function () {
	if (typeof tizen == 'undefined') {
		console.warn("Tizen API not found, linking stub APIs");
		$("<script type='text/javascript' src='../../tizenApplication.js'> </script>").appendTo("body");
	}

	if (typeof ThemeEngine != 'undefined') {
		var te = new ThemeEngine();
		te.addStatusListener(function (aData) {
			window.location.reload();
		});
	} else {
		console.error("ThemeEngine API is not available, please start IVI server.");
	}

	tel_input = $("#inputPhoneNumber");
	$(".callBox").hide();
	$("#clockElement").ClockPlugin('init', 5);
	$("#clockElement").ClockPlugin('startTimer');
	$("#topBarIcons").topBarIconsPlugin('init', 'phone');
	$('#bottomPanel').bottomPanel('init');

	loadContacts();
	loadHistory();

	$("body").delegate("#contactsLibraryButton", "click", function () {
		if (!ContactsLibrary.initialized) {
			ContactsLibrary.init();
		} else {
			ContactsLibrary.show();
		}
		return false;
	});

	$(".numbersBox").delegate("#numberButton", "click", function () {
		var number = tel_input.attr("value") + $(this).data("id");
		tel_input.attr("value", number);
		return false;
	});

	$(".inputPhoneNumberBox").delegate("#deleteButton", "click", function () {
		var number = tel_input.attr("value");
		number = number.slice(0, number.length - 1);
		tel_input.attr("value", number);
		return false;
	});

	$('#callButton').bind('click', function () {
		$("#contactsCarousel").trigger("currentPosition", function (pos) {
			if ((pos + 1) == contacts.length) {
				pos = 0;
			} else {
				pos = pos + 1;
			}
			callContactCarousel($("#carouselBox_" + pos).data("id"));
			return false;
		});
	});
});

/**
 * Class which provides load contacts.
 * @class loadContacts
 * @constructor
 */
function loadContacts() {
	contacts = [];
	if (tizen.contact) {
		getTizenAddressBooks();
	} else {
		$.getJSON("data/contacts.json", function (data) {
			contacts = (typeof data).toLowerCase() == "string" ? JSON.parse(data).contacts : data.contacts;
			var i = 0;
			for (i = 0; i < contacts.length; i++) {
				if (contacts[i].photoURI.toString().trim() == "") {
					contacts[i].photoURI = "./css/images/null.png";
				}
			}
			sortAndfillContactsCarousel();
		});
	}
}

/**
 * Class which provides load history.
 * @class loadHistory
 * @constructor
 */
function loadHistory() {
	history = [];
	if (tizen.call.history) {
		getTizenCallHistory();
	} else {
		$.getJSON("data/history.json", function (data) {
			history = (typeof data).toString().toLowerCase() == "string" ? JSON.parse(data).history : data.history;
		});
	}
}

/**
 * Class which provides sort and fill contacts carousel.
 * @class sortAndfillContactsCarousel
 * @constructor
 */
function sortAndfillContactsCarousel() {
	sortContacts();
	template.compile(contacts, "templates/contactCarouselDelegate.html", "#contactsCarousel", function () {
		$(".carouselCallContact").boxCaptionPlugin('initSmall', "CALL CONTACT");
		$('#contactsCarousel').carouFredSel({
			auto : false,
			width : 720,
			items : {
				visible : 3
			},
			swipe : {
				onMouse : true,
				onTouch : true
			},
			scroll : {
				items : 3
			}
		});
	});
}

/**
 * Class which provides slide carousel. 
 * @class slideCarousel
 * @param index {Integer} Index of frame in carousel.
 * @constructor
 */
function slideCarousel(index) {
	$("#contactsCarousel").trigger("slideTo", index - 1);
}

/**
 * Class which provides call contact carousel. 
 * @class callContactCarousel
 * @param id {Integer} Identificator of contact.
 * @constructor
 */
function callContactCarousel(id) {
	selected_contact = getContactById(id);
	callContact(selected_contact);
}

/**
 * Class which provides comparation of two numbers. 
 * @class cmp
 * @param x {Integer} First number for comparison.
 * @param y {Integer} Second number for comparison.
 * @constructor
 */
function cmp(x, y) {
	return x > y ? 1 : x < y ? -1 : 0;
}

//Sort Mode not working in web simulator (sort first by favorite and then by lastname)
/** 
 * Class which provides sorting contacts.
 * @class sortContacts
 * @constructor
 * @return Sorted contacts.
 */
function sortContacts() {
	contacts = contacts.sort(function (a, b) {
		return [-cmp(a.isFavorite, b.isFavorite), cmp(a.name.lastName.toLowerCase(), b.name.lastName.toLowerCase())]
		< [-cmp(b.isFavorite, a.isFavorite), cmp(b.name.lastName.toLowerCase(), a.name.lastName.toLowerCase())] ? -1 : 1;
	});
}

/**
 * Holds status of calling panel initialization.
 * @property callingPanelInitialized {Boolean}
 */
var callingPanelInitialized = false;
/** 
 * Class which provides methods to call contact.
 * @class callContact
 * @param contact {Object} Contact object.
 * @constructor
 */
function callContact(contact) {
	if (contact) {
		if (contact.name) {
			var name_str = contact.name.firstName || "";
			name_str += contact.name.lastName ? " " + contact.name.lastName : "";
			$("#callName").html(name_str);
		}

		if (contact.phoneNumbers) {
			$("#callNumber").html(contact.phoneNumbers[0] && contact.phoneNumbers[0].number ? contact.phoneNumbers[0].number : "");
		}

		if (contact.photoURI) {
			$("#callPhoto").attr("src", contact.photoURI);
		}
	}

	if (!callingPanelInitialized) {
		$("#inCallWith").boxCaptionPlugin('init', 'IN CALL WITH');
		$('#callVolumeControl').progressBarPlugin('init', 'volumeControl');
		callingPanelInitialized = true;
	}

	$("#callButton").toggleClass("callingTrue");
	$("#callButton").toggleClass("callingFalse");
	$("#contactsCarouselBox").slideToggle("normal");
	$("#callBox").slideToggle("normal", function () {
		if ($("#callBox").is(":visible")) {
			CallDuration.stopwatch();
		} else {
			CallDuration.resetIt();
		}
	});
}

/** 
 * Class which provides methods to get contact by id.
 * @class getContactById
 * @param id {Integer} Contact ID.
 * @constructor
 */
function getContactById(id) {
	var j = 0, contact = null;
	for (j = 0; j < contacts.length; j++) {
		if (contacts[j].id == id) {
			contact = contacts[j];
			break;
		}
	}
	return contact;
}

/** 
 * Class which provides methods to fill history list by contact id
 * @class fillHistoryListByContactId
 * @param id {Integer} Contact ID.
 * @param callback {callback} Callback called after succesfull contact get Tizen call.
 * @constructor
 */
function fillHistoryListByContactId(id, callback) {
	if (tizen.call.history) {
		getTizenCallHistoryById(id, callback);
	} else {
		var j = 0, contactHistory = [];
		for (j = 0; j < history.length; j++) {
			if (history[j].callParticipants[0].id == id) {
				contactHistory.push(history[j]);
			}
		}
		callback(contactHistory);
	}
}
/**
 * Class which provides methods to operate with call duration
 * @class CallDuration
 * @static
 */
var CallDuration = {
	/**
	 * Holds value of seconds.
	 * @property sec {Integer}
	 */
	sec: 0,
	/**
	 * Holds value of minutes.
	 * @property min {Integer}
	 */
	min: 0,
	/**
	 * Holds value of hours.
	 * @property hour {Integer}
	 */
	hour: 0,
	/**
	 * Holds object of timer.
	 * @property timeout {Object}
	 */
	timeout: null,
	/** 
	 * Method provides reset call timers.
	 * @method resetIt
	 */
	resetIt: function () {
		CallDuration.sec = 0;
		CallDuration.min = 0;
		CallDuration.hour = 0;
		window.clearTimeout(CallDuration.timeout);
		$("#callDuration").html(((CallDuration.min <= 9) ? "0" + CallDuration.min : CallDuration.min) + ":" + ((CallDuration.sec <= 9) ? "0" + CallDuration.sec : CallDuration.sec));
	},
	/** 
	 * Method provides call stop watch.
	 * @method stopwatch
	 */
	stopwatch: function () {
		CallDuration.sec++;
		if (CallDuration.sec == 60) {
			CallDuration.sec = 0;
			CallDuration.min++;
		}

		if (CallDuration.min == 60) {
			CallDuration.min = 0;
			CallDuration.hour++;
		}

		$("#callDuration").html(((CallDuration.min <= 9) ? "0" + CallDuration.min : CallDuration.min) + ":" + ((CallDuration.sec <= 9) ? "0" + CallDuration.sec : CallDuration.sec));
		CallDuration.timeout = setTimeout("CallDuration.stopwatch();", 1000);
	}
};
