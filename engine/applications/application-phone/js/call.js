/** 
 * @module Phone
 */

/**
 * Class which provide method to obtain call history of phone.
 * @class getTizenCallHistory
 * @constructor
 */
function getTizenCallHistory() {
	var filter =
		new tizen.AttributeFilter("callType", "EXACTLY", "tizen.tel"),
		sortMode = new tizen.SortMode("startTime", "ASC");

	try {
		tizen.call.history.find(onCallHistoryFindSuccess, onCallHistoryFindError, filter, sortMode);
	} catch (err) {
		alert("Error: Find failed: " + err.code + ": " + err.message);
	}

	/** 
	 * Event which is invoked after succesfull contact call history find. 
	 * @event onCallHistoryFindSuccess
	 * @param results {Object} Object contains find results. 
	 */
	function onCallHistoryFindSuccess(results) {
		history = results;
	}
}

/**
 * Class which provide method to obtain call history by ID.
 * @class getTizenCallHistoryById
 * @constructor
 */
function getTizenCallHistoryById(remoteParty, callback) {
	// remoteParties is undefined in web simulator
	/*var telFilter = new tizen.AttributeFilter("callType", "EXACTLY", "tizen.tel");
    var remotePartyFilter = new tizen.AttributeFilter("remoteParties.remoteParty", "EXACTLY", remoteParty);
    var filter = new tizen.CompositeFilter("INTERSECTION", [telFilter, remotePartyFilter]);
    var sortMode = new tizen.SortMode("startTime", "ASC");*/

	var filter =
		new tizen.AttributeFilter("callType", "EXACTLY", "tizen.tel"),
		sortMode = new tizen.SortMode("startTime", "ASC");

	try {
		tizen.call.history.find(onContactCallHistoryFindSuccess, onCallHistoryFindError, filter, sortMode);
	} catch (err) {
		alert("Error: Find failed: " + err.code + ": " + err.message);
	}

	/** 
	 * Event which is invoked after succesfull contact call history find. 
	 * @event onContactCallHistoryFindSuccess
	 * @param results {Object} Object contains find results. 
	 */
	function onContactCallHistoryFindSuccess(results) {
		callback(results);
	}
}

/**
 * Class which provide method to log error warnings.
 * @class onCallHistoryFindError
 * @constructor
 */
function onCallHistoryFindError(error) {
	console.warn("Error: Call history query failed: " + error.message);
}