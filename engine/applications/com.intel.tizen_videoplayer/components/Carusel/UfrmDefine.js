/*
 * list type
 */

var TEXT_LIST = 0;
var IMAGE_LIST = 1;
var IMAGE_TEXT_LIST = 2;

/*
 * list orintation
 */

var VERTICAL_LIST = 0;
var HORISONTAL_LIST = 1;

/*
 * carousel settings
 */

var Ufrm3DCarouselsettings = function( )
{
	//carousel orientation VERTICAL_LIST/HORISONTAL_LIST
	this.nOrientation = HORISONTAL_LIST;
	//type of carousel items  TEXT_LIST/IMAGE_LIST/IMAGE_TEXT_LIST
	this.nType = IMAGE_LIST;
	//carousel radius
	this.nRadius = 270;
	//carousel elements number
	this.nSize = 7;
	//sideways rotation 
	this.nSizeRotation = -15;
	//show all  items face side all time 
	this.bIsFaced = true;
	//items size
	this.nItemsWidth = 150;
	this.nItemsHeight = 150;
	//items text color 
	this.sTextColor = "#222222";
	//show items rotated more then 180 deg
	this.bShowBackItems = false;	
	//scale for top element
	this.nScaleTopItem = 0.5;
	//empty elements for space begin <-> end
	this.nEmptyItems = 7;
	//carousel max elements number - for buffer
	this.nMaxSize = 7;
	/* usage example
	 * 	var tstScreen = document.createElement("div");
		tstScreen.setAttribute("class", "tstScreen");
		rootItem.appendChild(tstScreen);
		var sett = new Ufrm3DCarouselsettings();
		car = new Ufrm3DCarouselList(tstScreen, sett);
		for(var nNum = 0; nNum < car.getListSize(); nNum++)
			car.updateListElement(nNum, 'source', '', 'The Best Of ' + nNum);
	 */
}

/*
 * carousel events
 */

var CAROUSEL_ITEM_CLICK = "UfrmCarouselItemClick"; //extra data - [item]  selected item
var CAROUSEL_ITEM_DCLICK = "UfrmCarouselDbItemClick"; //extra data - [item]  selected item
var CAROUSEL_ITEM_SELECTED = "UfrmCarouselSelected"; //extra data - [item]  selected item


