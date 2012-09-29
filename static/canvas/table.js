var tableModeWidth = 0;
var tableModeHeight = 0;
var tableElementSize = 64;
var tableFontCaption = 0;
var originalPropertiesArray = new Array(4) //[top,left,width,height]
var originalFontSize = 11;
var tableModeFontSize = 14;
var tableMode = false;
var disableDBClick = false;

function turnToRegularMode(element,event)
{
	disableDBClick = true;
	var originalElement = element;
	var elementTable = element.context.getElementsByTagName("table");
	var elementCaption = element.context.getElementsByTagName("p");
	var elementMaxSize = elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1);
	var i;
	
	$(".DragNonDropDiv").each(function(i) {
		$(this).fadeTo(400, 1, function() {});
	});
	
	//originalElement.border('0px white 0');
	$(".DragDiv").each(function(i) {
		if (originalElement.context.id != $(this).context.id)
		{
			//$(this).border('0px white 0');
			$(this).fadeTo(400, 1, function() {
				// Animation complete.
				if ($(".DragDiv").length - 2 <= i)
				{	
					if (event != undefined)
					{
						if (event.user == "SearchGuest")
						{
							var data = event.pass.split(",",2);
							data = data[0] + "," + data[1] +",New";
							
							proccedSearchOnTableMode(data.split(",",3));
						}
						else if (event.user == "SearchTable")
						{
							pointTableAfterSearch($("#" + event.pass));
							$("#" + event.pass).click();
						}
						event = undefined;
					}
				}
			});
		}
	});
	element.animate({ top: originalPropertiesArray[0], left: originalPropertiesArray[1], width: originalPropertiesArray[2], height: originalPropertiesArray[3]},300, 'linear', function() {
	if (event != undefined)
	{
		if (event.user == "SaveProperyTable")
		{
			$("#ElementPropertiesSaveButton").click();
			event = undefined;
		}
	}
	element.find('p').first().css('width', originalPropertiesArray[2]);

	disableDBClick = false;
	tableMode = false;
	selectElement(element);
	$("#floatListGate").animate({height:0},300, 'linear',function(){	$("#floatListGate").remove();});
	posTableChairs(element, elementMaxSize);
	});
	
	elementCaption[0].style.fontSize= originalFontSize;
	elementCaption[1].style.fontSize= originalFontSize;
	$("#" + elementTable[0].id).css("margin-top","16.5%");
	
	$(".tableProp").each(function(i) {
		if (originalElement.context.id != $(this).context.id)
		{
			//$(this).border('0px white 0');
			$(this).fadeTo(400, 1, function() {
				// Animation complete.
				$(this).parent().css('display','block');
				$(this).show();
			});
		}
	});
	
	if (!detailsMode)
	{
		$(".TableParentElementDivOutside").each(function(i) {
			$(this).fadeTo(400, 1, function() {
				// Animation complete.
				$(this).show();
			});
		});
	}
	
	
	var tableBackElem = element.find('.tableBack').first();
	
    if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
    {
    		tableBackElem.css("display", "none");
    }
    else
    {
	 	tableBackElem.css("visibility", "collapse");
    }

	//$("#" + elementTable[0].id).animate({width: originalPropertiesArray[2], height: originalPropertiesArray[3]},300, 'linear',function(){adjustCaption(element);});
	for (i=0; i < parseInt(elementMaxSize); i++)
	{
		//$("#tableElement"+ parseInt(i + 1)).border('0px white 0');
		$("#tableParentElementDiv" + parseInt(i + 1) + element.context.id + "T").fadeTo(200,0,function()
		{
			$(this).remove();
		});
	}
	element.draggable( 'enable' );
	SelectedPerson = "";
	personData = "";
	SelectedTable = "";
}

function turnToTableMode(element,saveTablePositionProperties,event)
{
	disableDBClick = true;
	var originalElement = element;
	var elementTable = element.context.getElementsByTagName("table");
	var elementCaption = element.context.getElementsByTagName("p");
	var elementMaxSize = elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1);
	var elementSize = elementCaption[1].firstChild.nodeValue.split("/", 1);
	var tableWidth = 0, tableHeight = 0, currentHorizontalPosition = 0, currentVerticalPosition = 0, heightOffset = 0, widthOffset = 0, i;
	
	if (saveTablePositionProperties)
	{
		originalPropertiesArray[0] =  element.position().top;
		originalPropertiesArray[1] =  element.position().left;
		originalPropertiesArray[2] =  element.width();
		originalPropertiesArray[3] =  element.height();
	}
	
	$("#float-list").animate({ top: floatListOriginalPosition.top, left: floatListOriginalPosition.left},300, 'linear');
	element.removeClass('borderSelected');
	$("#borderSelected").removeClass('borderSelected');
	
	$(".DragDiv").each(function(i) {
		if (originalElement.context.id != $(this).context.id)
		{
			//$(this).border('0px white 0');
			$(this).fadeTo(400, 0, function() {
				// Animation complete.
				$(this).removeClass('borderSelected');
				$("#borderSelected").removeClass('borderSelected');
				$(this).hide();
			});
		}
	});
	
	$(".DragNonDropDiv").each(function(i) {
		if (originalElement.context.id != $(this).context.id)
		{
			//$(this).border('0px white 0');
			$(this).fadeTo(400, 0, function() {
				// Animation complete.
				$(this).removeClass('borderSelected');
				$("#borderSelected").removeClass('borderSelected');
				$(this).hide();
			});
		}
	});
	
	$(".tableProp").each(function(i) {
		if (originalElement.context.id != $(this).context.id)
		{
			//$(this).border('0px white 0');
			$(this).fadeTo(400, 0, function() {
				// Animation complete.
		    	$(this).parent().css('display','none');
				$(this).hide();
			});
		}
	});
	
	$(".TableParentElementDivOutside").each(function(i) {
		$(this).fadeTo(400, 0, function() {
			// Animation complete.
			
			if ($(this).data('elem') == element.attr('id'))
			{
				$(this).remove();
			}
			else
			{
				$(this).hide();
			}
		});
	});
	
   var tableBackElem = element.find('.tableBack').first();
	
    if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
    {
    		tableBackElem.css("display", "block");
    }
    else
    {
	 	tableBackElem.css("visibility", "visible");
    }
	tableBackElem.css("cursor", "pointer");
	
	if (Math.round((elementMaxSize / 2)) % 2 != 0 && !(elementTable[0].id.indexOf("Round") > -1))
	{
		tableModeWidth = tableElementSize / 2 * (Math.round(elementMaxSize / 2) + 1);
		tableModeHeight = tableElementSize / 2 * (Math.round(elementMaxSize / 2) - 1);
		//for margin between persons
		tableModeWidth	= tableModeWidth + (Math.round(elementMaxSize / 2) + 1);
		tableModeHeight = tableModeHeight + (Math.round(elementMaxSize / 2) - 1);
	}
	else
	{
		tableModeWidth = tableElementSize * Math.round(elementMaxSize / 4);
		tableModeHeight = tableElementSize * Math.round(elementMaxSize / 4);
		tableModeWidth	= tableModeWidth + (Math.round(elementMaxSize / 4));
		tableModeHeight = tableModeHeight + (Math.round(elementMaxSize / 4));
	}
	
	element.find('p').first().css('width', tableModeWidth);
	
	element.animate({ top: ($("#canvas-div").position().top + $("#canvas-div").height()) / 2 - tableModeHeight / 2 + (tableFontCaption + tableElementSize + 5) / 2, left: ($("#canvas-div").position().left + $("#canvas-div").width()) / 2 - tableModeWidth / 2, width: tableModeWidth, height: tableModeHeight},300, 'linear', function() {
	selectElement(element); $(this).removeClass('borderSelected'); 	$("#borderSelected").removeClass('borderSelected'); $(this).css('opacity',1); 	tableMode = true; disableDBClick = false; 	/*adjustCaption(element); */ $("#canvas-div").append($('<div id="floatListGate" class="FloatListGate"></br></br><img align="middle" src="/static/canvas/images/arrow_to_float_n.png"/></div>')); $("#floatListGate").css('top',$("#canvas-div").offset().top + 45); $("#floatListGate").css('left',$("#canvas-div").position().left + $("#canvas-div").width() - $("#floatListGate").width() + 7.5); $("#floatListGate").animate({height:150},300, 'linear'); $("#elemBack_" + originalElement.context.id).fadeTo(400, 1);
	});
		
	elementCaption[0].style.fontSize= tableModeFontSize;
	elementCaption[1].style.fontSize= tableModeFontSize;

	if (elementMaxSize > 6)
	{
		$("#" + elementTable[0].id).css("margin-top","30%");
	}
	else
	{
		$("#" + elementTable[0].id).css("margin-top","2.5%");
	}
	
	//$("#" + elementTable[0].id).animate({width: tableModeWidth, height: tableModeHeight - 3 * tableModeFontSize},300, 'linear', function() { $(this).css('cursor',"pointer");	$("#elemBack_" + originalElement.context.id).fadeTo(400, 1);});
		
	var mode = "T";	
		
	if (elementTable[0].id.indexOf("Round") > -1)
	{
		var increase = Math.PI * 2 / elementMaxSize;
		var angle = (increase * elementMaxSize) / 2;
		var roundTop = (($("#canvas-div").position().top + $("#canvas-div").height()) / 2 - tableModeHeight / 2) + 10;
		var roundLeft =  (($("#canvas-div").position().left + $("#canvas-div").width()) / 2 - tableModeWidth / 2) - 32.5;
		var center = [roundLeft + (tableModeWidth / 2), roundTop + (tableModeHeight / 2)];
		var delta = 3;

		if (elementMaxSize > 17)
		{
			delta = 6;
		}
		else if (elementMaxSize > 8)
		{
			delta = 5;
		}
		
		for (i=0; i < parseInt(elementMaxSize); i++)
		{
			if (i >  parseInt(elementMaxSize) / 2)
			{
				createTableElement(i,element,true, true);
			}
			else
			{
				createTableElement(i,element,false, true);
			}
			$("#tableParentElementDiv"+ parseInt(i + 1) + element.context.id + mode).css( "top", center[1] +  ((tableElementSize * elementMaxSize / delta) * Math.cos(angle)));
			$("#tableParentElementDiv"+ parseInt(i + 1) + element.context.id + mode).css( "left", center[0] + ((tableElementSize * elementMaxSize / delta) * Math.sin(angle)));
			angle -= increase;
		}
	}
	else
	{
		for (i=0; i < parseInt(elementMaxSize); i++)
		{
			if ((tableWidth + tableElementSize <=  tableModeWidth) || (tableHeight + tableElementSize <=  tableModeHeight))
			{
				if (tableWidth + tableElementSize <=  tableModeWidth)
				{
					var delta = 0;
					if (!(navigator.userAgent.toLowerCase().indexOf('ie') > 0))
					{
						if (heightOffset > 0)
						{
							delta = 5;
						}
					}
					else
					{
						if (heightOffset == 0)
						{
							delta = -5;
						}
					}
					
					createTableElement(i,element, false, true);
					
					$("#tableParentElementDiv"+ parseInt(i + 1) + element.context.id + mode).css( "top",($("#canvas-div").position().top + $("#canvas-div").height()) / 2  - tableModeHeight / 2 + (tableFontCaption + tableElementSize + 7) / 2 - $("#tableParentElementDiv"+ parseInt(i + 1) + element.context.id + mode).height() + heightOffset - 2.5);
					$("#tableParentElementDiv"+ parseInt(i + 1)+ element.context.id + mode).css( "left",($("#canvas-div").position().left + $("#canvas-div").width()) / 2 - tableModeWidth / 2 + currentHorizontalPosition *($("#tableParentElementDiv"+ parseInt(i + 1) + element.context.id + mode).width() + 2.5));
					tableWidth += $("#tableParentElementDiv"+ parseInt(i + 1) + element.context.id + mode).width();
					currentHorizontalPosition++;
					$("#tableParentElementDiv"+ parseInt(i + 1) + element.context.id + mode).css("top", $("#tableParentElementDiv"+ parseInt(i + 1) + element.context.id + mode).position().top - $("#tableElementCaption"+ parseInt(i + 1)).height() + delta);
				}
				else if (tableHeight + tableElementSize <= tableModeHeight)
				{
					
					if (widthOffset > 0)
					{
						createTableElement(i,element, true, true);
					}
					else
					{
						createTableElement(i,element, false, true);
					}
					
					var delta = 0;
					
					if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
					{
						delta = 5;
					}
					
					$("#tableParentElementDiv"+ parseInt(i + 1) + element.context.id + mode).css( "top",($("#canvas-div").position().top + $("#canvas-div").height()) / 2 - tableModeHeight / 2 + (tableFontCaption + tableElementSize + 5) / 2 + currentVerticalPosition *($("#tableParentElementDiv"+ parseInt(i + 1) + element.context.id + mode).height() + delta));

					$("#tableParentElementDiv"+ parseInt(i + 1) + element.context.id + mode).css( "left",($("#canvas-div").position().left + $("#canvas-div").width()) / 2  + tableModeWidth / 2 + widthOffset);
					tableHeight += tableElementSize;
					currentVerticalPosition++;
				}
			}
			else
			{
				tableWidth =0;
				tableHeight =0;
				currentHorizontalPosition = 0;
				currentVerticalPosition = 0;
				widthOffset = - (tableModeWidth + tableElementSize);
				heightOffset = tableModeHeight + tableElementSize;
				i--;
			}
		}
	}
	element.draggable( 'disable' );
	SelectedTable = element;
	if (event != undefined)
	{
		if (event.user == "SearchGuest")
		{
			var data = event.pass.split(",",2);
			
			data = data[0] + "," + data[1] + ",New";
			proccedSearchOnTableMode(data.split(",",3));
		}
	}
}

function proccedSearchOnRegluarMode(data)
{
	var currentSelectedTable = SelectedTable;
	
	if (currentSelectedTable == "" || !currentSelectedTable.html())
	{
		currentSelectedTable = SelectedElem;
	}
	if (currentSelectedTable != "" || currentSelectedTable.html())
	{
		if (currentSelectedTable.context.id.trim().toLowerCase() != data.trim().toLowerCase())
		{
			var event = jQuery.Event("dblclick");
			event.user = "SearchTable";
			event.pass = data;
					
			currentSelectedTable.trigger(event);
		}
		else
		{
			pointTableAfterSearch($("#" + data));
		}
	}
}

$(document).ready(function() {
  $(".DragDiv").dblclick( function(event) {
		posPropertyPanel("");
		 var elementTable = $(this).context.getElementsByTagName("table");
		 if (isThisPeopleTable(elementTable[0].id))
		 {
			if (tableMode && !disableDBClick)
			{
				$(this).attr("title", "לחיצה כפולה למצב עריכה");
				turnToRegularMode($(this),event);
				undoElementList = new Array(1);
				var undoElement = new Array(2);
				undoElement[0] = $(this);
				undoElement[1] = "closetbl";
				undoElementList[0] = undoElement;
			}
			else if (!disableDBClick)
			{
				$(this).attr("title", "לחיצה כפולה חזרה לאולם");
				turnToTableMode($(this),true,event);
				undoElementList = new Array(1);
				var undoElement = new Array(2);
				undoElement[0] = $(this);
				undoElement[1] = "opentbl";
				undoElementList[0] = undoElement;
			}
		}
		else
		{
			if (event != undefined)
			{
				if (event.user == "SearchTable")
				{
					var data = event.pass;
					pointTableAfterSearch($("#" + data));
					
				}
			}
		}
  });
});
