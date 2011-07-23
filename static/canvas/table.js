var tableModeWidth = 0;
var tableModeHeight = 0;
var tableElementSize = 64;
var tableFontCaption = 16;
var originalPropertiesArray = new Array(4) //[top,left,width,height]
var originalFontSize = 11.5;
var tableModeFontSize = 14;
var tableMode = false;

function createTableElement(i,element,side)
{
	switch (side)
	{
		case "left":
		{
			$("#canvas-div").append($('<div class="TableElementDiv" Id="tableElementDiv'+ parseInt(i + 1) +'"><p Id="tableElementCaption'+ parseInt(i + 1) +'" style="float:left;">empty</p><img src="" class="TableElemImg" Id="tableElement'+ parseInt(i + 1) +'"/></div>'));
			break;
		}
		case "right":
		{
			$("#canvas-div").append($('<div class="TableElementDiv" Id="tableElementDiv'+ parseInt(i + 1) +'"><p Id="tableElementCaption'+ parseInt(i + 1) +'" style="float:right;">empty</p><img src="" class="TableElemImg" Id="tableElement'+ parseInt(i + 1) +'"/></div>'));
			break;
		}
		case "top":
		{
			$("#canvas-div").append($('<div class="TableElementDiv" Id="tableElementDiv'+ parseInt(i + 1) +'"><p Id="tableElementCaption'+ parseInt(i + 1) +'" class="TableElemText">empty</p><img src="" class="TableElemImg" Id="tableElement'+ parseInt(i + 1) +'"/></div>'));
			break;
		}
		case "bottom":
		{
			$("#canvas-div").append($('<div class="TableElementDiv" Id="tableElementDiv'+ parseInt(i + 1) +'"><img src="" class="TableElemImg" Id="tableElement'+ parseInt(i + 1) +'"/><p Id="tableElementCaption'+ parseInt(i + 1) +'" class="TableElemText">empty</p></div>'));
			break;
		}
	}
	LoadPerson(element, i);
}

function turnToRegularMode(element,event)
{
	var originalElement = element;
	var elementImgs = element.context.getElementsByTagName("img");
	var elementCaption = element.context.getElementsByTagName("p");
	var elementMaxSize = elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1);
	var i;
	
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
	if (event.user == "SaveProperyTable")
	{
		$("#ElementPropertiesSaveButton").click();
		event = undefined;
	}
	selectElement(element);
	});
	
	elementCaption[0].style.fontSize= originalFontSize;
	elementCaption[1].style.fontSize= originalFontSize;
	
	$("#" + elementImgs[0].id).animate({width: originalPropertiesArray[2] - 10, height: originalPropertiesArray[3] - 3 * originalFontSize},300, 'linear');
		
	for (i=0; i < parseInt(elementMaxSize); i++)
	{
		//$("#tableElement"+ parseInt(i + 1)).border('0px white 0');
		$("#tableElementDiv"+ parseInt(i + 1)).remove();
	}
	element.draggable( 'enable' );
	SelectedPerson = "";
	personData = "";
	SelectedTable = "";
	tableMode = false;
}

function turnToTableMode(element,saveTablePositionProperties,event)
{
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
	
	element.border('0px white 0');
	
	$(".DragDiv").each(function(i) {
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
	
	element.animate({ top: ($("#canvas-div").position().top + $("#canvas-div").height()) / 2 - tableModeHeight / 2 + (tableFontCaption + tableElementSize + 5) / 2, left: ($("#canvas-div").position().left + $("#canvas-div").width()) / 2 - tableModeWidth / 2, width: tableModeWidth, height: tableModeHeight},300, 'linear', function() { selectElement(element);});
		
	elementCaption[0].style.fontSize= tableModeFontSize;
	elementCaption[1].style.fontSize= tableModeFontSize;

	$("#" + elementImgs[0].id).animate({width: tableModeWidth - 10, height: tableModeHeight - 3 * tableModeFontSize},300, 'linear');
		
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
	tableMode = true;
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
  	 var elementImgs = $(this).context.getElementsByTagName("img");
	 if (isThisPeopleTable(elementImgs[0].id))
     {
		if (tableMode)
		{
			$(this).attr("title", "Press Double Click For Edit Table");
			turnToRegularMode($(this),event);
		}
		else
		{
			$(this).attr("title", "Press Double Click To All Tables View");
			turnToTableMode($(this),true,event);
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
