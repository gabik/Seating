var tableModeWidth = 0;
var tableModeHeight = 0;
var tableElementSize = 64;
var tableFontCaption = 16;
var originalPropertiesArray = new Array(4) //[top,left,width,height]
var originalFontSize = 11.5;
var tableModeFontSize = 14;
var tableMode = false;

function selectElement(element)
{
    element.border('2px pink .5');
}

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
		case "topbottom":
		{
			$("#canvas-div").append($('<div class="TableElementDiv" Id="tableElementDiv'+ parseInt(i + 1) +'"><p Id="tableElementCaption'+ parseInt(i + 1) +'" class="TableElemText">empty</p><img src="" class="TableElemImg" Id="tableElement'+ parseInt(i + 1) +'"/></div>'));
			break;
		}
	}
		$.post('/canvas/getItem/', {elem_num: element.context.id, position: parseInt(i + 1)},
        function(data){
			if (data.status == 'OK')
			{
				$("#tableElement"+ data.position).attr("src", "/static/canvas/images/WeddingChairOccupied.png");
				document.getElementById("tableElementCaption" + data.position).innerHTML = data.first_name + "</br>" + data.last_name;
			}
			else
			{
				$("#tableElement"+ data.position).attr("src", "/static/canvas/images/WeddingChair.png");
				document.getElementById("tableElementCaption" + data.position).innerHTML = "position " + data.position + "</br>empty";
			}
			}, 'json');
}

function turnToRegularMode(element)
{
	var originalElement = element;
	var elementImgs = element.context.getElementsByTagName("img");
	var elementCaption = element.context.getElementsByTagName("p");
	var elementMaxSize = elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1);
	var i;
	
	originalElement.border('0px white 0');
	$(".DragDiv").each(function(i) {
		if (originalElement.context.id != $(this).context.id)
		{
			$(this).border('0px white 0');
			$(this).fadeTo(400, 1, function() {
				// Animation complete.
			});
		}
	});
	element.animate({ top: originalPropertiesArray[0], left: originalPropertiesArray[1], width: originalPropertiesArray[2], height: originalPropertiesArray[3]},300, 'linear', function() { selectElement(element);});
	
	elementCaption[0].style.fontSize= originalFontSize;
	elementCaption[1].style.fontSize= originalFontSize;
	
	$("#" + elementImgs[0].id).animate({width: originalPropertiesArray[2] - 10, height: originalPropertiesArray[3] - 3 * originalFontSize},300, 'linear');
		
	//$("#" + elementImgs[0].id).width = 16;
	//$("#" + elementImgs[0].id).height = 16;
		
	for (i=0; i < parseInt(elementMaxSize); i++)
	{
		$("#tableElementDiv"+ parseInt(i + 1)).remove();
	}
	element.draggable( 'enable' );
	element.resizable( 'enable' );
	tableMode = false;
}

function turnToTableMode(element)
{
	var originalElement = element;
	var elementImgs = element.context.getElementsByTagName("img");
	var elementCaption = element.context.getElementsByTagName("p");
	var elementMaxSize = elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1);
	var elementSize = elementCaption[1].firstChild.nodeValue.split("/", 1);
	var tableWidth = 0, tableHeight = 0, currentHorizontalPosition = 0, currentVerticalPosition = 0, heightOffset = 0, widthOffset = 0, i;
	
	originalPropertiesArray[0] =  element.position().top;
	originalPropertiesArray[1] =  element.position().left;
	originalPropertiesArray[2] =  element.width();
	originalPropertiesArray[3] =  element.height();
	
	$(".DragDiv").each(function(i) {
		if (originalElement.context.id != $(this).context.id)
		{
			$(this).border('0px white 0');
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
	}
	else
	{
		tableModeWidth = tableElementSize * Math.round(elementMaxSize / 4);
		tableModeHeight = tableElementSize * Math.round(elementMaxSize / 4);
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
				createTableElement(i,element,"topbottom");
				$("#tableElementDiv"+ parseInt(i + 1)).css( "top",($("#canvas-div").position().top + $("#canvas-div").height()) / 2  - tableModeHeight / 2 + (tableFontCaption + tableElementSize + 5) / 2 - $("#tableElementDiv"+ parseInt(i + 1)).height() + heightOffset);
				$("#tableElementDiv"+ parseInt(i + 1)).css( "left",($("#canvas-div").position().left + $("#canvas-div").width()) / 2 - tableModeWidth / 2 + currentHorizontalPosition *$("#tableElementDiv"+ parseInt(i + 1)).width());
				tableWidth += $("#tableElementDiv"+ parseInt(i + 1)).width();
				currentHorizontalPosition++;
				$("#tableElementDiv"+ parseInt(i + 1)).css("top", $("#tableElementDiv"+ parseInt(i + 1)).position().top - $("#tableElementCaption"+ parseInt(i + 1)).height());
				if (heightOffset > 0)
				{
					$("#tableElementCaption"+ parseInt(i + 1)).css("top", $("#tableElementDiv"+ parseInt(i + 1)).height());
					$("#tableElementDiv"+ parseInt(i + 1)).css("top", $("#tableElementDiv"+ parseInt(i + 1)).position().top + 2);
				}
				$("#tableElementDiv"+ parseInt(i + 1)).css("z-index", -1);
			}
			else if (tableHeight + tableElementSize <= tableModeHeight)
			{
				if (widthOffset < 0)
				{
					createTableElement(i,element,"left");
				}
				else
				{
					createTableElement(i,element,"right");
				}
				$("#tableElementDiv"+ parseInt(i + 1)).css( "top",($("#canvas-div").position().top + $("#canvas-div").height()) / 2 - tableModeHeight / 2 + (tableFontCaption + tableElementSize + 5) / 2 + currentVerticalPosition *$("#tableElement"+ parseInt(i + 1)).height());
				$("#tableElementDiv"+ parseInt(i + 1)).css( "left",($("#canvas-div").position().left + $("#canvas-div").width()) / 2  + tableModeWidth / 2 + widthOffset);
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
	element.resizable( 'disable' );
	tableMode = true;
}

$(document).ready(function() {
  $(".DragDiv").dblclick( function() {
	if (tableMode)
	{
		turnToRegularMode($(this));
	}
	else
	{
		turnToTableMode($(this));
	}
  });
});