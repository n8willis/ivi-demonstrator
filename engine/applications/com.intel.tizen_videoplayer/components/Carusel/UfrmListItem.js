var UfrmListElement = function( sImagePath, sTextString, type, source, nNum, parent )
{
	var sImage = sImagePath;
	var sText = sTextString;
	var nType = type;
	var sSubtext = sTextString;
	var sSource = source;
	var rootDivIn = document.getElementById(parent.id);
	var nItem = nNum;
	var evtOnClick = this.evtOnClick =  "UfrmCarouselItemClickInternal";
	var evtOnDbClick = this.evtOnDbClick =  "UfrmCarouselItemDbClickInternal";
	
	var rootItem = document.createElement("div");
	
	rootItem.setAttribute("class", parent.id+"Item");
	rootItem.setAttribute("id", parent.id+"Item_"+nNum);
	
	parent.appendChild(rootItem);
	
	
	var imageDiv = document.createElement("div");
	imageDiv.setAttribute("class", parent.id+ "Image");
	
	var stringDiv = document.createElement("div");
	stringDiv.setAttribute("class", parent.id+"String");
	
	
	var subStringDiv = document.createElement("div");
	subStringDiv.setAttribute("class", parent.id+"subString");
	
	switch(type)
	{
		case TEXT_LIST:
		{
			if( sText != "" )
   				jQuery(stringDiv).text(sText);
   			else
   				jQuery(stringDiv).text("");
			rootItem.appendChild(stringDiv);
			
			if( sSubtext != "" )
			{
				subStringDiv.style.visibility = 'visible';
				jQuery(subStringDiv).text(sSubtext);
			}
			else
			{
				subStringDiv.style.visibility = 'hidden';
				jQuery(subStringDiv).text("");	
			}
			rootItem.appendChild(subStringDiv);
   		}
		break;
		
		case IMAGE_LIST:
		{
			if( sImage != "" )
				imageDiv.style.backgroundImage = "url("+sImage+")"  ;
			else
				imageDiv.style.backgroundImage = "url(../../media/empty_carousel.png)" ;
			rootItem.appendChild(imageDiv);	
		}
		break;
		
		case IMAGE_TEXT_LIST:
		{
			if( sText != "" )
   				jQuery(stringDiv).text(sText);
   			else
   				jQuery(stringDiv).text("");
			if( sImage != "" )
				imageDiv.style.backgroundImage = "url("+sImage+")"  ;
			else
				imageDiv.style.backgroundImage = "url(../../media/empty_carousel.png)" ;
			rootItem.appendChild(imageDiv);	
			rootItem.appendChild(stringDiv);
		}
		break;
		
		default:
		{
			imageDiv.style.backgroundImage = "url(../../media/empty_carousel.png)" ;
	   		jQuery(stringDiv).text("empty");			   		
			rootItem.appendChild(imageDiv);	
			rootItem.appendChild(stringDiv);
			break;
		}		
	}	
	
	this.update = function( source, image, text)
	{
		sImage = image;
		sText = text;
		nType = type;
		sSource = source;
		switch(nType)
		{
			case TEXT_LIST:
			{
				if( sText != "" )
	   				jQuery(stringDiv).text(sText);
	   			else
	   				jQuery(stringDiv).text("");
	   		}
			break;
			
			case IMAGE_LIST:
			{
				if( sImage != "" )
					imageDiv.style.backgroundImage = "url("+sImage+")"  ;
				else
					imageDiv.style.backgroundImage = "url(../../media/empty_carousel.png)" ;
			}
			break;
			
			case IMAGE_TEXT_LIST:
			{
				if( sText != "" )
	   				jQuery(stringDiv).text(sText);
	   			else
   					jQuery(stringDiv).text("");
				if( sImage != "" )
					imageDiv.style.backgroundImage = "url("+sImage+")"  ;
				else
					imageDiv.style.backgroundImage = "url(../../media/empty_carousel.png)" ;
			}
			break;
			
			default:
			{
				imageDiv.style.backgroundImage = "url(../../media/empty_carousel.png)" ;
		   		jQuery(stringDiv).text("");	
				break;
			}		
		}
	}
	
	this.update2D = function( source, subtext, text)
	{
		sSubtext = subtext;
		sText = text;
		nType = TEXT_LIST;
		sSource = source;
				
		if( sText != "" )
   			jQuery(stringDiv).text(sText);
		else
			jQuery(stringDiv).text("");
		if( sSubtext != "" )
		{
			subStringDiv.style.visibility = 'visible';
			jQuery(subStringDiv).text(sSubtext);
		}
		else
		{
			subStringDiv.style.visibility = 'hidden';
			jQuery(subStringDiv).text("");	
		}
	}
	
	this.setTransform = function(trs)
	{
		rootItem.style.webkitTransform = trs;
	}	
	
	this.setOpacity = function(trs)
	{
		rootItem.style.opacity = trs;
	}	
	
	this.setVisible = function(isVisible)
	{
		if( isVisible == true )
			rootItem.style.visibility = "visible";		
		else
			rootItem.style.visibility = "hidden";
	}
		
	this.createItemsStyle = function( width, height, textColor, type )
	{	
		var css = "";
			
		switch(nType)
		{
			case TEXT_LIST:
			{	   			
				css = "."+ parent.id+ "String {";
				
				css += "position: absolute;	width:100%; height: 100%; margin-left: auto; margin-right: auto; ";
				css += "color: " + textColor + "px;";
			    css += " -webkit-user-select: none; user-select: none; text-align: center; font-size: 200%;font-family: serif"; 

				css += "}";
	   		}
			break;
			
			case IMAGE_LIST:
			{
				css = "."+ parent.id+ "Image {";
		   		css += "position: absolute;	top: 0px; ";
				css += "height: 100%;";
				css += "width: 100%;";
			    css += " -webkit-user-select: none; user-select: none; background-position: center center; background-size: cover;"; 
			
				css += "}";
			}
			break;
			
			case IMAGE_TEXT_LIST:
			{
				var css_im = "."+ parent.id+ "Image {";
				var css_st = "."+ parent.id+ "String {";
		   		css_im += "position: absolute;	top: 0px; ";
				css_im += "left: " + (width*0.125 )+ "px;";
				css_im += "height: " + (height*0.75 )+ "px;";
				css_im += "width: " + (height*0.75) + "px;";
			    css_im += " -webkit-user-select: none; user-select: none; background-position: center center; background-size: cover;"; 
			
				css_st += "position: absolute;	width:100%; margin-left: auto; margin-right: auto; ";
				css_st += "top: " + (height*0.75 + 5) + "px;";
				css_st += "color: " + textColor + "px;";
			    css_st += " -webkit-user-select: none; user-select: none; text-align: center; font-size: 200%;font-family: serif"; 

				css_im += "}";
				css_st += "}";
				css = css_im + css_st;
			}
			break;
			
			default:
			break;		
		}		
		
		css += "." + parent.id+"Item {";
    	css += "position:absolute; -webkit-user-select: none; border:1px solid #fff; background:rgba(100,100,100,1.0);";
       	css += "height:"+height+"px;";
    	css += "width:"+width+"px;";
		css += "}";
	
		if( css != "" )
		{
			var newdiv = document.createElement("style");
			newdiv.innerHTML = css;
			document.head.appendChild(newdiv);	
		}
	}
	
	this.createItemsStyle2D = function( width, height, textColor, subColor )
	{	
		var css = "";			
		css = "."+ parent.id+ "String {";
		
		css += "position: absolute;	width:100%; margin-left: auto; margin-right: auto; ";
		css += "top: " + (5) + "px;";
		css += "color: " + textColor + ";";
		css += "font-family: Arial Black;";
	    css += " -webkit-user-select: none; user-select: none; text-align: left; font-size: 200%;font-family: serif"; 
	    
		css += "}\n";
	    
		css += "."+ parent.id+ "subString {";
	    css += "position: absolute;	width:100%; margin-left: auto; margin-right: auto; ";
		css += "top: " + (height*0.5 + 10) + "px;";
		css += "color: " + subColor + ";";
		css += "font-family: Arial Black; ";
		css += " -webkit-user-select: none; user-select: none; text-align: left; font-size: 200%;font-family: serif"; 

		css += "}\n";
	   		
		
		css += "." + parent.id+"Item {";
    	css += "position:absolute; -webkit-user-select: none; border:0px; background:rgba(0,0,0,0.0);";
       	css += "height:"+height+"px;";
    	css += "width:"+width+"px;";
		css += "}";
	
		if( css != "" )
		{
			var newdiv = document.createElement("style");
			newdiv.innerHTML = css;
			document.head.appendChild(newdiv);	
		}
	}
	
	this.getRootItem = function()
	{
		return rootItem;
	}	
	
	var onClick = function()
	{
		var evt = jQuery.Event(evtOnClick);
		evt.item = nItem;
		$(rootItem).trigger(evt);
	}	
	$(rootItem).click(onClick);
	
	var onDbClick = function()
	{
		var evt = jQuery.Event(evtOnDbClick);
		evt.item = nItem;
		$(rootItem).trigger(evt);
	}	
	$(rootItem).dblclick(onDbClick);

}
