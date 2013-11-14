var Ufrm3DCarouselList = function(parent, carouselSettings )
{
	/*
	 * init list
	 */
	var listArray = [];
	var isMousePressed = false;
	var isActive = false;
	var currentDeg = 0;
	var lastDeg = 0;
	var isHidden = false;
	var bAnimationIsWorking = false;
	var animateTimer;
	var nRotationNum = 0;
	var listSettings = carouselSettings;
	var nCurrentItem = listSettings.nSize-1;
	var listName  = parent.id + "UfrmList";
	var listNameID  = parent.id + "UfrmListID";
	var nRotStep = 360 / ( listSettings.nMaxSize + listSettings.nEmptyItems);
	
	initListStyle();
	
	var rootListTable = document.createElement("table");
	rootListTable.setAttribute("class", "root3DListTable");
	var rootListTableItem = document.createElement("tr");
	rootListTableItem.setAttribute("class", "root3DListTableItem");
	
	var listElement = document.createElement("div");
	listElement.setAttribute("class", listName);
	listElement.setAttribute("id", listNameID);
	parent.appendChild(rootListTable);
	rootListTable.appendChild(rootListTableItem);
	rootListTableItem.appendChild(listElement);
	
	var onItemClick = function(evt)
	{
		console.log("onItemClick " + evt.item);
		var evnt = jQuery.Event(CAROUSEL_ITEM_CLICK);
		evnt.item = evt.item;
		$(listElement).trigger(evnt);
		moveItemOnTop(evnt.item);
	}
	
	var onDbItemClick = function(evt)
	{
		console.log("onDbItemClick " + evt.item);
		var evnt = jQuery.Event(CAROUSEL_ITEM_DCLICK);
		evnt.item = evt.item;
		$(listElement).trigger(evnt);
	}
	
	for( var nNum = 0; nNum < listSettings.nMaxSize; nNum++ )
	{
		listArray[nNum] = new UfrmListElement("", "", listSettings.nType, "", nNum, listElement );	
		$(listArray[nNum].getRootItem()).bind(listArray[nNum].evtOnClick, onItemClick);	
		$(listArray[nNum].getRootItem()).bind(listArray[nNum].evtOnDbClick, onDbItemClick);	
	}
	listArray[0].createItemsStyle( listSettings.nItemsWidth, listSettings.nItemsHeight, listSettings.sTextColor, listSettings.nType );
	nCurrentItem = 0;
	/*
	 * interface
	 */
	
	/*
	 * function to fill all list items by default content and show set size of it
	 */
	
	this.cleanList = function()
	{
		for( var nNum = 0; nNum < listSettings.nMaxSize; nNum++ )
		{
			listArray[nNum].update('','','');
		}
		moveItemOnTop(0);
	}

	/*
	 * updateListElement - fill list item
	 * nNum - number of element
	 * source - function to execute TBD
	 * image - image to show
	 * text - string to show
	 */
	this.updateListElement = function( nNum, source, image, text )
	{
		if( nNum <  listSettings.nSize )
		{
			listArray[nNum].update( source, image, text);
		}
	}
	
	/*
	 * setVisible - set list visibility true/false
	 */
	this.setVisible = function(visibility)
	{
		if( visibility == false )
		{
			isHidden = true;
			for(var nNum = 0; nNum < listSettings.nMaxSize; nNum++ )
			{			
				listArray[nNum].setVisible( false )		
				rootListTable.style.visibility = 'hidden';			
			}
		}
		else			
		{
			console.log('show');
			rootListTable.style.visibility = 'visible';	
			rotateFacedItems(currentDeg);
			isHidden = false;
		}
	}
	
	/*
	 * getListElement - returns list html element to handle event
	 */
	this.getListElement = function()
	{
		return listElement;
	}
	
	/*
	 * getCurrentItemNumber - returns selected item number
	 */
	this.getCurrentItemNumber = function()
	{
		return nCurrentItem;
	}

	/*
	 * getListSize - returns size of list
	 */	
	this.getListSize = function()
	{
		return listSettings.nSize;
	}
	
	/*
	 * getListSize - returns size of list
	 */	
	this.setListSize = function(size)
	{
		listSettings.nSize = size;
		moveItemOnTop(0);
	}
	
	/*
	 * selectItem - move carusel to face item nNum 
	 */
	this.selectItem = function(nNum)
	{
		moveItemOnTop(nNum);	   
	}	
	/*
	 * private
	 */	
	
	function moveItemOnTop(nNum)
	{
		console.log('show item ' + nNum + " " + nCurrentItem);
		if( nNum == nCurrentItem )
			return;
		nRotationNum++;
		nCurrentItem = nNum;
		var list = document.getElementById(listNameID);
		var nStep = 25;	
		var nTimerStep = 25; 
		if( nRotationNum == 1 )
		{
			nStep = 150;
			nTimerStep = 50; 
		}
		
		
		var stepValue = (Math.abs(currentDeg) - nNum*nRotStep)/nStep;
		console.log('show item ' + nNum);
		
		if( nNum < listSettings.nSize && list && list.style )
		{
			if( animateTimer )
				clearInterval(animateTimer);
			console.log('show item2 ' + nNum);
				
			bAnimationIsWorking = true;
			animateTimer = setInterval(function(){
				nStep--
				if( nStep >= 0 )
				{			
					if( nStep == 0 )
						currentDeg = -nNum*nRotStep;
					currentDeg += 	stepValue;	
					//console.log(currentDeg + ' ' + stepValue + ' ' + (nNum*nRotStep) + ' ' + nNum);
					if( listSettings.nOrientation == HORISONTAL_LIST )
				 	{
				 		list.style.webkitTransform = "rotateX("+listSettings.nSizeRotation+"deg)  rotateY("+ (currentDeg) +"deg)";
				 	}
				 	else
				 	{ 
				 		list.style.webkitTransform = "rotateY("+listSettings.nSizeRotation+"deg)  rotateX("+ (currentDeg) +"deg)";
				 	}		
				 	rotateFacedItems(currentDeg);
				}
				else
				{
					bAnimationIsWorking = false;
					clearInterval(animateTimer);
				}
			});	 
			var evnt = jQuery.Event(CAROUSEL_ITEM_SELECTED);
			evnt.item = nCurrentItem;
			$(listElement).trigger(evnt);
			console.log('emit selected ' + evnt.item);		
		 }	   
	}	
	
	function initListStyle()
	{
		var css= "";
			
		for(var nNum = 1; nNum < listSettings.nMaxSize+1; nNum++ )
		{
			css += "."+ listName + "> div:nth-child(" + nNum + ") {";
			css += " opacity: 1;";
			var sScale = getScaleString((nNum-1)*nRotStep);
			if( listSettings.bShowBackItems == true )		
				css += "-webkit-backface-visibility: visible;backface-visibility:visible;";
			else
				css += "-webkit-backface-visibility: hidden;backface-visibility:hidden;";
			
			if( listSettings.nOrientation == HORISONTAL_LIST )
			{
				if( listSettings.bIsFaced == false )
				{
					css += "-webkit-transform: rotateY(" + ((nNum-1)*nRotStep) + "deg) translateZ("+ listSettings.nRadius +"px) " + sScale + " ; }";
				}
				else
				{				
	
					if( nNum <= listSettings.nSize && listSettings.bShowBackItems == false && Math.cos(((nNum-1)*nRotStep ) * 6.28/360) < 0 )
					{	
						css += "visibility: hidden;"; 
					}	
					else
					{
						css += "visibility: visible;"; 
					}
					css += "-webkit-transform: rotateY(" + ((nNum-1)*nRotStep) + "deg) translateZ("+ listSettings.nRadius +"px) rotateY(" + (-(nNum-1)*nRotStep) + "deg) " + sScale + " ; }";
				}
			}
			else	
			{
				if( listSettings.bIsFaced  == true )
				{
					if(  nNum > listSettings.nSize || ( listSettings.bShowBackItems == false && Math.cos(((nNum-1)*nRotStep ) * 6.28/360) < 0  ) )
					{
						css += "visibility: hidden;"; 
					}	
					else
					{
						css += "visibility: visible;"; 
					}
					css += "-webkit-transform: rotateX(" + ((nNum-1)*nRotStep) + "deg) translateZ(" + listSettings.nRadius + "px) rotateX(" + (-(nNum-1)*nRotStep) + "deg) " + sScale + " ; }";
				}
				else
				{
					css += "-webkit-transform: rotateX(" + ((nNum-1)*nRotStep) + "deg) translateZ(" + listSettings.nRadius + "px) " + sScale + " ; }"
				}
			}
		}	
		
		css += "."+ listName + "{";	
		css += "width:"+ listSettings.nItemsWidth +"px ;";
	    css += "height:"+ listSettings.nItemsHeight +"px ;";
	    css += "-webkit-user-select: none; margin-left: auto; margin-right: auto; -webkit-transform-style:preserve-3d;";
	    if( listSettings.nOrientation == HORISONTAL_LIST )
		{
	    	css += "-webkit-transform:rotateX("+ listSettings.nSizeRotation +"deg) rotateY(0deg); } ";
	    }
	    else
	    {
	    	css += "-webkit-transform:rotateY("+listSettings.nSizeRotation+"deg) rotateX(0deg);} ";
	    }
	    
		var newdiv = document.createElement("style");
		newdiv.innerHTML = css;
		document.head.appendChild(newdiv);		
	}
	
	function rotateFacedItems( degRot )
	{	
		if( listSettings.bIsFaced  == true )
		{	
			for(var nNum = 0; nNum < listSettings.nSize; nNum++ )
			{		
				var rotDegre = -nNum*nRotStep - degRot;
				var zeroDelta = nRotStep*0.5;
				if( listSettings.bShowBackItems == false || isHidden )
				{
					listArray[nNum].setVisible( Math.cos((nNum*nRotStep + degRot) * 6.28/360) >= 0 )
				}					
				if( listSettings.nOrientation == HORISONTAL_LIST )
				{
					listArray[nNum].setTransform( "rotateY(" + (nNum*nRotStep ) + "deg) translateZ("+ listSettings.nRadius +"px) rotateY(" + rotDegre + "deg)" + getScaleString(nNum*nRotStep + degRot) );
				}
				else	
				{
					listArray[nNum].setTransform( "rotateX(" + (nNum*nRotStep ) + "deg) translateZ(" + listSettings.nRadius + "px) rotateX(" + rotDegre + "deg)" +  getScaleString(nNum*nRotStep + degRot) );
				}	
				
		 		if( Math.abs(rotDegre )< zeroDelta && nNum != nCurrentItem && bAnimationIsWorking == false )
				{
					nCurrentItem = nNum;
					var evnt = jQuery.Event(CAROUSEL_ITEM_SELECTED);
					evnt.item = nCurrentItem;
					$(listElement).trigger(evnt);					
				}			
			}
		}
	}
	
	function getScaleString(degRot)
	{		
		var rot_css = "";
		if(listSettings.nScaleTopItem != 0)
		{
			var scaleF = 1 + listSettings.nScaleTopItem * Math.cos((degRot) * 6.28/360);
			rot_css += " scaleX(" + scaleF + ")  scaleY(" + scaleF + ") " ;			
		}
		
		return rot_css;		
	}
		
 	function onMouseMove(e)
 	{
 		if(isMousePressed)
 		{
	 		// move carousel
	 		var x = e.pageX - $(rootListTable).offset().left;
	 		var y = e.pageY - $(rootListTable).offset().top;
	 		rotateCarousel(x,y);
 		}
 	}
 	$(rootListTable).on('mousemove', onMouseMove);

	function onMouseDown(e)
	{
		isMousePressed = true;
	}
	$(rootListTable).on('mousedown', onMouseDown);
	
	function onMouseUp(e)
	{
		isMousePressed = false;
		 		
	}
	$(rootListTable).on('mouseup', onMouseUp);

	function onMouseLeave(e)
	{
		isMousePressed = false;
	}
	$(rootListTable).on('mouseleave', onMouseLeave);

	function rotateCarousel(x,y)
	{
		var dRotationFactor = 2; 	 	
		var list = document.getElementById(listNameID);	 
		
	 	if( listSettings.nOrientation == HORISONTAL_LIST )
	 	{
	 		var dx =  -lastDeg + x;  
	 		lastDeg = x;
			console.log('rotateCarousel ' + currentDeg + ' ' + (-(listSettings.nSize - 1)*nRotStep) + ' ' + dx);
			if ( ( currentDeg <= 0 && currentDeg >  -(listSettings.nSize -1)*nRotStep ) ||
				 ( currentDeg > 0 && dx < 0 ) || 
				 ( currentDeg <= 0 && currentDeg < -(listSettings.nSize - 1)*nRotStep && dx > 0 ))
			{				
		 		if( dx > 0 ) currentDeg += dRotationFactor;
				else currentDeg -= dRotationFactor;
				list.style.webkitTransform = "rotateX("+listSettings.nSizeRotation+"deg)  rotateY("+ (currentDeg) +"deg)";
		 		rotateFacedItems(currentDeg);
	 		}
	 	}
	 	else
	 	{ 
	 		var dy =  lastDeg - y; 
	 		lastDeg = y;
			if ( ( currentDeg < 0 && currentDeg >  -(listSettings.nSize -1)*nRotStep ) ||
				 ( currentDeg >= 0 && dy < 0 ) || 
				 ( currentDeg < 0 && currentDeg <= -(listSettings.nSize - 1)*nRotStep && dy > 0 ))
			{
		 		if( dy > 0 ) currentDeg += dRotationFactor;
				else currentDeg -= dRotationFactor;
				list.style.webkitTransform = "rotateY("+listSettings.nSizeRotation+"deg)  rotateX("+ (currentDeg) +"deg)";
	 			rotateFacedItems(currentDeg);
	 		}
	 	}			
	}
}
