var tableModeWidth = 0;
var tableModeHeight = 0;
var tableElementSize = 64;
var tableFontCaption = 16;
var originalPropertiesArray = new Array(4) //[top,left,width,height]
var originalFontSize = 11.5;
var tableModeFontSize = 14;
var tableMode = false;
var disableDBClick = false;

function turnToRegularMode(element,event)
{
	disableDBClick = true;
	var originalElement = element;
	var elementImgs = element.context.getElementsByTagName("img");
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
	disableDBClick = false;
	tableMode = false;
	selectElement(element);
	adjustCaption(element);
	$("#floatListGate").animate({height:0},300, 'linear',function(){	$("#floatListGate").remove();});
	});
	
	elementCaption[0].style.fontSize= originalFontSize;
	elementCaption[1].style.fontSize= originalFontSize;
	
	$("#" + elementImgs[0].id).animate({width: originalPropertiesArray[2], height: originalPropertiesArray[3] - 2.5 * originalFontSize},300, 'linear');
		
	for (i=0; i < parseInt(elementMaxSize); i++)
	{
		//$("#tableElement"+ parseInt(i + 1)).border('0px white 0');
		$("#tableElementDiv"+ parseInt(i + 1)).remove();
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
	var elementImgs = element.context.getElementsByTagName("img");
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
				$(this).hide();
			});
		}
	});
	
	if (Math.round((elementMaxSize / 2)) % 2 != 0)
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
	
	element.animate({ top: ($("#canvas-div").position().top + $("#canvas-div").height()) / 2 - tableModeHeight / 2 + (tableFontCaption + tableElementSize + 5) / 2, left: ($("#canvas-div").position().left + $("#canvas-div").width()) / 2 - tableModeWidth / 2, width: tableModeWidth, height: tableModeHeight},300, 'linear', function() {
	selectElement(element); $(this).removeClass('borderSelected'); 	$("#borderSelected").removeClass('borderSelected'); $(this).css('opacity',1); 	tableMode = true; disableDBClick = false; 	adjustCaption(element); $("#canvas-div").append($('<div id="floatListGate" class="FloatListGate"></br></br><img align="middle" src="/static/canvas/images/arrow_to_float_n.png"/></div>')); $("#floatListGate").css('top',$("#canvas-div").offset().top + 45); $("#floatListGate").css('left',$("#canvas-div").position().left + $("#canvas-div").width() - $("#floatListGate").width() + 7.5); $("#floatListGate").animate({height:150},300, 'linear');
	});
		
	elementCaption[0].style.fontSize= tableModeFontSize;
	elementCaption[1].style.fontSize= tableModeFontSize;

	$("#" + elementImgs[0].id).animate({width: tableModeWidth, height: tableModeHeight - 3 * tableModeFontSize},300, 'linear');
		
	for (i=0; i < parseInt(elementMaxSize); i++)
	{
		if ((tableWidth + tableElementSize <=  tableModeWidth) || (tableHeight + tableElementSize <=  tableModeHeight))
		{
			if (tableWidth + tableElementSize <=  tableModeWidth)
			{
				if (heightOffset > 0)
				{
					createTableElement(i,element,"bottom");
					$("#tableElementDiv"+ parseInt(i + 1)).attr("title" ,"personBottom"+ parseInt(i + 1));
				}
				else
				{
					createTableElement(i,element,"top");
					$("#tableElementDiv"+ parseInt(i + 1)).attr("title" ,"personTop"+ parseInt(i + 1));
				}
				$("#tableElementDiv"+ parseInt(i + 1)).css( "top",($("#canvas-div").position().top + $("#canvas-div").height()) / 2  - tableModeHeight / 2 + (tableFontCaption + tableElementSize + 5) / 2 - $("#tableElementDiv"+ parseInt(i + 1)).height() + heightOffset - 2.5);
				$("#tableElementDiv"+ parseInt(i + 1)).css( "left",($("#canvas-div").position().left + $("#canvas-div").width()) / 2 - tableModeWidth / 2 + currentHorizontalPosition *($("#tableElementDiv"+ parseInt(i + 1)).width() + 2.5));
				tableWidth += $("#tableElementDiv"+ parseInt(i + 1)).width();
				currentHorizontalPosition++;
				$("#tableElementDiv"+ parseInt(i + 1)).css("top", $("#tableElementDiv"+ parseInt(i + 1)).position().top - $("#tableElementCaption"+ parseInt(i + 1)).height());
				if (heightOffset > 0)
				{
					$("#tableElementDiv"+ parseInt(i + 1)).css("top",$("#tableElementDiv"+ parseInt(i + 1)).position().top + tableElementSize - 6);
				}
			}
			else if (tableHeight + tableElementSize <= tableModeHeight)
			{
				if (widthOffset < 0)
				{
					createTableElement(i,element,"left");
					$("#tableElementDiv"+ parseInt(i + 1)).attr("title" ,"personLeft"+ parseInt(i + 1));
				}
				else
				{
					createTableElement(i,element,"right");
					$("#tableElementDiv"+ parseInt(i + 1)).attr("title" ,"personRight"+ parseInt(i + 1));
				}
				$("#tableElementDiv"+ parseInt(i + 1)).css( "top",($("#canvas-div").position().top + $("#canvas-div").height()) / 2 - tableModeHeight / 2 + (tableFontCaption + tableElementSize + 5) / 2 + currentVerticalPosition *($("#tableElement"+ parseInt(i + 1)).height() + 2.5));

				$("#tableElementDiv"+ parseInt(i + 1)).css( "left",($("#canvas-div").position().left + $("#canvas-div").width()) / 2  + tableModeWidth / 2 + widthOffset + 2.5);
				tableHeight += tableElementSize;
				currentVerticalPosition++;

				if (widthOffset < 0)
				{
					$("#tableElementDiv"+ parseInt(i + 1)).css("left", $("#tableElementDiv"+ parseInt(i + 1)).position().left - tableElementSize);
				}
				$("#tableElementCaption"+ parseInt(i + 1)).addClass('TableElemText');
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
	
	if (currentSelectedTable == "")
	{
		currentSelectedTable = SelectedElem;
	}
	if (currentSelectedTable != "")
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
		 var elementImgs = $(this).context.getElementsByTagName("img");
		 if (isThisPeopleTable(elementImgs[0].id))
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
