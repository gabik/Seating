var lastRectanglePoint = new Array(2);//[top,left]
var lastRectPosition = "";
var selectionElementsList = "";
	
function getFullySelectionRectangleElementList()
{
	var list = "";
	var numOfElements = 0;
	$(".DragDiv").each(function(i) {
	if ($(this).position().top >= $("#multiSelectionRectangle").position().top &&
		$(this).position().left >= $("#multiSelectionRectangle").position().left &&
		$(this).position().left + $(this).width() <= $("#multiSelectionRectangle").position().left + $("#multiSelectionRectangle").width() &&
		$(this).position().top + $(this).height() <= $("#multiSelectionRectangle").position().top + $("#multiSelectionRectangle").height())
	{
		list = list + $(this).context.id +",";
		numOfElements = numOfElements + 1;
	}
	});
	return [numOfElements,list];
}

$(document).ready(function() {
	$("#canvas-div").append($('<div id="multiSelectionRectangle" class="SelectionRectangle"/>'));
	$("#canvas-div").mousedown(function(e) {
	{
	    if ($(e.target).hasClass('CanvasDiv') && !(tableMode) && !(detailsMode)) {
			multiSelection = true;
			$("#multiSelectionRectangle").css("top", e.clientY);
			$("#multiSelectionRectangle").css("left", e.clientX);
			lastRectanglePoint[0] =  e.clientY;
			lastRectanglePoint[1] =  e.clientX;
			$("#multiSelectionRectangle").css("z-index",99999);
		}
		else
		{
			lastRectanglePoint[0] =  0;
			lastRectanglePoint[1] =  0;
			multiSelection = false;
		}
		if	(!$(e.target).hasClass('SelectionRectangle'))
		{
			$("#multiSelectionRectangle").css("height", 0);
			$("#multiSelectionRectangle").css("width", 0);
			$("#multiSelectionRectangle").hide();
		}
		isMousePressFromCanvas = true;
	}
	});
	
	$(document).mousemove(function(e) {
	{
		if (isMousePressFromCanvas && multiSelection)
		{
			$("#multiSelectionRectangle").show();
			if (e.clientY > $("#canvas-div").offset().top && e.clientY < $("#canvas-div").offset().top +  $("#canvas-div").height())
			{
				if (e.clientY < lastRectanglePoint[0])
				{
					$("#multiSelectionRectangle").css("top", e.clientY);
				}
				$("#multiSelectionRectangle").css("height",Math.abs(e.clientY - lastRectanglePoint[0]));
			}
			else
			{
				if (e.clientY <= $("#canvas-div").offset().top)
				{
					$("#multiSelectionRectangle").css("height", $("#multiSelectionRectangle").height() + $("#multiSelectionRectangle").offset().top - $("#canvas-div").offset().top);
					$("#multiSelectionRectangle").css("top",$("#canvas-div").offset().top);
				}
				else if (e.clientY > $("#canvas-div").offset().top +  $("#canvas-div").height())
				{
					$("#multiSelectionRectangle").css("height",Math.abs($("#canvas-div").offset().top + $("#canvas-div").height() - $("#multiSelectionRectangle").offset().top))
				}
			}
			
			if (e.clientX > $("#canvas-div").offset().left && e.clientX < $("#canvas-div").offset().left +  $("#canvas-div").width())
			{
				if (e.clientX < lastRectanglePoint[1])
				{
					$("#multiSelectionRectangle").css("left", e.clientX);
				}
				$("#multiSelectionRectangle").css("width", Math.abs(e.clientX - lastRectanglePoint[1]));
			}
			else
			{
				if (e.clientX <= $("#canvas-div").offset().left)
				{
					$("#multiSelectionRectangle").css("width",$("#multiSelectionRectangle").width() + $("#multiSelectionRectangle").offset().left - $("#canvas-div").offset().left);
					$("#multiSelectionRectangle").css("left",$("#canvas-div").offset().left)
				}
				else if (e.clientX > $("#canvas-div").offset().left +  $("#canvas-div").width())
				{
					$("#multiSelectionRectangle").css("width",Math.abs($("#canvas-div").offset().left + $("#canvas-div").width() - $("#multiSelectionRectangle").offset().left))
				}
			}
			lastRectPosition = $("#multiSelectionRectangle").position();
		}
	}
	});
	
	$("#canvas-div").mouseup(function(e) {
		multiSelection = false;
		isMousePressFromCanvas = false;
	});
	
	$("#multiSelectionRectangle").draggable({
			containment: 'parent',
			cursor: "move",
			start:function (e,ui){
				$Draged = "";
				lastRectanglePoint[0] = $("#multiSelectionRectangle").position().top;
				lastRectanglePoint[1] = $("#multiSelectionRectangle").position().left;
				var selectionResult = getFullySelectionRectangleElementList();
				selectionElementsList = selectionResult[1].split(",",selectionResult[0]);
				startDradPositionList = new Array(selectionElementsList.length);
				for (var i = 0; i < selectionElementsList.length; i++)
				{
					startDradPositionList[i] = $("#"+selectionElementsList[i]).position();
				}
				$("#SaveStatImg").attr("src", "http://careers.physicstoday.org/pics/icons/gma_red_50/js_saved_jobs.gif");
			},
			drag:function (e,ui){
				for (var i = 0; i < selectionElementsList.length; i++)
				{
					$("#"+selectionElementsList[i]).css("background-color", "blue");
					$("#"+selectionElementsList[i]).css("top",$("#"+selectionElementsList[i]).position().top + $("#multiSelectionRectangle").position().top - lastRectPosition.top);
					$("#"+selectionElementsList[i]).css("left",$("#"+selectionElementsList[i]).position().left + $("#multiSelectionRectangle").position().left - lastRectPosition.left);
				}
				lastRectPosition = $("#multiSelectionRectangle").position();
				},	
			stop:function (e,ui){
				undoElementList = new Array(selectionElementsList.length);
				for (var i = 0; i < selectionElementsList.length; i++)
				{
					$("#"+selectionElementsList[i]).css("background-color", "white");
					if (collisionWithOtherElementById(selectionElementsList[i]))
					{
						$("#"+selectionElementsList[i]).animate({top: $("#"+selectionElementsList[i]).position().top + lastRectanglePoint[0] - $("#multiSelectionRectangle").position().top, left:$("#"+selectionElementsList[i]).position().left + lastRectanglePoint[1] - $("#multiSelectionRectangle").position().left},300, 'linear');    
					}
					else
					{
					   saveElementByID(selectionElementsList[i]);
					}
					$("#"+selectionElementsList[i]).border('0px white 0');
					var undoElement = new Array(2);
					undoElement[0] = $("#"+selectionElementsList[i]);
					undoElement[1] = "move";
					undoElementList[i] = undoElement;
				}
				$("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
				SelectedElem ="";
				selectionElementsList = "";
				$("#multiSelectionRectangle").animate({top: $("#multiSelectionRectangle").position().top + $("#multiSelectionRectangle").height()/2, left:$("#multiSelectionRectangle").position().left + $("#multiSelectionRectangle").width()/2 ,height:0,width:0},300, 'linear',function(){$("#multiSelectionRectangle").hide();});
		}				
		});
});