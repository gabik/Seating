﻿var lastRectanglePoint = new Array(2);//[top,left]
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
	$(".DragNonDropDiv").each(function(i) {
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

function aligmentHorizontal(side)
{
	var newLeftValueAvrage = 0; 
	var sumOfLeftValue = 0;
	var selectionResult = getFullySelectionRectangleElementList();
	selectionElementsList = selectionResult[1].split(",",selectionResult[0]);
	startDradPositionList = new Array(selectionElementsList.length);
			
	for (var i = 0; i < selectionElementsList.length; i++)
	{
		if (side == 'left')
		{
			sumOfLeftValue = sumOfLeftValue +  $("#"+selectionElementsList[i]).position().left;
		}
		else if (side == 'right')
		{
			sumOfLeftValue = sumOfLeftValue +  $("#"+selectionElementsList[i]).position().left + $("#"+selectionElementsList[i]).width();
		}
	}
	newLeftValueAvrage = sumOfLeftValue / selectionElementsList.length;
			
	if (newLeftValueAvrage > 0)
	{
		undoElementList = new Array(selectionElementsList.length);
		for (var i = 0; i < selectionElementsList.length; i++)
		{
			startDradPositionList[i] = $("#"+selectionElementsList[i]).position();
			$("#"+selectionElementsList[i]).removeClass('borderSelected');
			$("#"+selectionElementsList[i]).removeClass('broderNonDragSelected');
			$("#"+selectionElementsList[i]).animate({left: newLeftValueAvrage},function(){
			{ 
				for (var j = 0; j < selectionElementsList.length; j++)
				{
					if (selectionElementsList[j] == $(this).context.id)
					{
						if (collisionWithOtherElementById(selectionElementsList[j]))
						{
							$("#"+selectionElementsList[j]).animate({left: startDradPositionList[j].left});
						}
						else
						{
							saveElementByID(selectionElementsList[j]);
						}
						var undoElement = new Array(2);
						undoElement[0] = $("#"+selectionElementsList[j]);
						undoElement[1] = "move";
						undoElementList[j] = undoElement;
						}
					}
				}
			});	
			$(".chairs" + selectionElementsList[i]).each(function(j) {
				$(this).animate({left: $(this).position().left +  (newLeftValueAvrage - startDradPositionList[i].left)},300, 'linear');
			});			
		}	
		SelectedElem ="";
		$("#multiSelectionRectangle").animate({top: $("#multiSelectionRectangle").position().top + $("#multiSelectionRectangle").height()/2, left:$("#multiSelectionRectangle").position().left + $("#multiSelectionRectangle").width()/2 ,height:0,width:0},300, 'linear',function(){$("#multiSelectionRectangle").hide();});
	}
}

function aligmentVertical(side)
{
	var newTopValueAvrage = 0; 
	var sumOfTopValue = 0;
	var selectionResult = getFullySelectionRectangleElementList();
	selectionElementsList = selectionResult[1].split(",",selectionResult[0]);
	startDradPositionList = new Array(selectionElementsList.length);
			
	for (var i = 0; i < selectionElementsList.length; i++)
	{
		if (side == 'top')
		{
			sumOfTopValue = sumOfTopValue +  $("#"+selectionElementsList[i]).position().top;
		}
		else if (side == 'bottom')
		{
			sumOfTopValue = sumOfTopValue +  $("#"+selectionElementsList[i]).position().top + $("#"+selectionElementsList[i]).height();
		}
	}
	newTopValueAvrage = sumOfTopValue / selectionElementsList.length;
			
	if (newTopValueAvrage > 0)
	{
		undoElementList = new Array(selectionElementsList.length);
		for (var i = 0; i < selectionElementsList.length; i++)
		{
			startDradPositionList[i] = $("#"+selectionElementsList[i]).position();
			$("#"+selectionElementsList[i]).removeClass('borderSelected');
			$("#"+selectionElementsList[i]).removeClass('broderNonDragSelected');
			$("#"+selectionElementsList[i]).animate({top: newTopValueAvrage},function(){
			{ 
				for (var j = 0; j < selectionElementsList.length; j++)
				{
					if (selectionElementsList[j] == $(this).context.id)
					{
						if (collisionWithOtherElementById(selectionElementsList[j]))
						{
							$("#"+selectionElementsList[j]).animate({top: startDradPositionList[j].top});
						}
						else
						{
							saveElementByID(selectionElementsList[j]);
						}
						var undoElement = new Array(2);
						undoElement[0] = $("#"+selectionElementsList[j]);
						undoElement[1] = "move";
						undoElementList[j] = undoElement;
						}
					}
				}
			});	
			
			$(".chairs" + selectionElementsList[i]).each(function(j) {
				$(this).animate({top: $(this).position().top +  (newTopValueAvrage - startDradPositionList[i].top)},300, 'linear');
			});	
		}	
		SelectedElem ="";
		$("#multiSelectionRectangle").animate({top: $("#multiSelectionRectangle").position().top + $("#multiSelectionRectangle").height()/2, left:$("#multiSelectionRectangle").position().left + $("#multiSelectionRectangle").width()/2 ,height:0,width:0},300, 'linear',function(){$("#multiSelectionRectangle").hide();});
	}
}

$(document).ready(function() {
	$("#canvas-div").append($('<div id="multiSelectionRectangle" class="SelectionRectangle"/>'));
	$("#canvas-div").mousedown(function(e) {
	{
		if ($(e.target).hasClass('CanvasDiv') && !(tableMode) && !(detailsMode)) {
			if (SelectedElem != "")
			{
				SelectedElem.removeClass('borderSelected');
				SelectedElem.removeClass('broderNonDragSelected');
				posPropertyPanel("");
			}
			SelectedElem ="";
			undoElementList ="";
			startDradPositionList ="";
			multiSelection = true;
			$("#multiSelectionRectangle").css("top", e.clientY);
			$("#multiSelectionRectangle").css("left", e.clientX);
			lastRectanglePoint[0] =  e.clientY;
			lastRectanglePoint[1] =  e.clientX;
			$("#multiSelectionRectangle").css("z-index",99998);
		}
		else
		{
			lastRectanglePoint[0] =  0;
			lastRectanglePoint[1] =  0;
			multiSelection = false;
		}
		if	(!$(e.target).hasClass('SelectionRectangle') && !$(e.target.parentNode).hasClass('AligmentDiv') && !$(e.target.offsetParent).hasClass('AligmentMenu'))
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
				drag = true;
				lastRectanglePoint[0] = $("#multiSelectionRectangle").position().top;
				lastRectanglePoint[1] = $("#multiSelectionRectangle").position().left;
				var selectionResult = getFullySelectionRectangleElementList();
				selectionElementsList = selectionResult[1].split(",",selectionResult[0]);
				startDradPositionList = new Array(selectionElementsList.length);
				for (var i = 0; i < selectionElementsList.length; i++)
				{
					startDradPositionList[i] = $("#"+selectionElementsList[i]).position();
					 $(".chairs" + selectionElementsList[i]).each(function(j) {
							$(this).fadeTo(100, 0, function() {
								// Animation complete.
									$(this).hide();
							});
						});	
				}
				setSaveStatus("Waiting");
			},
			drag:function (e,ui){
				for (var i = 0; i < selectionElementsList.length; i++)
				{
					$("#"+selectionElementsList[i]).css("background-color", "#5A8EA3");
					$("#"+selectionElementsList[i]).css("top",$("#"+selectionElementsList[i]).position().top + $("#multiSelectionRectangle").position().top - lastRectPosition.top);
					$("#"+selectionElementsList[i]).css("left",$("#"+selectionElementsList[i]).position().left + $("#multiSelectionRectangle").position().left - lastRectPosition.left);
				}
				lastRectPosition = $("#multiSelectionRectangle").position();
				},	
			stop:function (e,ui){
				undoElementList = new Array(selectionElementsList.length);
				var colMade = false;
				for (var i = 0; i < selectionElementsList.length; i++)
				{
					$("#"+selectionElementsList[i]).css("background-color", "white");
					if (collisionWithOtherElementById(selectionElementsList[i]))
					{
						$("#"+selectionElementsList[i]).animate({top: $("#"+selectionElementsList[i]).position().top + lastRectanglePoint[0] - $("#multiSelectionRectangle").position().top, left:$("#"+selectionElementsList[i]).position().left + lastRectanglePoint[1] - $("#multiSelectionRectangle").position().left},300, 'linear');
						$(".chairs" + selectionElementsList[i]).each(function(j) {
							$(this).fadeTo(100, 1, function() {
								// Animation complete.
									$(this).show();
							});
						});	
						colMade = true;						
					}
					else
					{
					   saveElementByID(selectionElementsList[i]);
					   $(".chairs" + selectionElementsList[i]).each(function(j) {
							var top = $("#"+selectionElementsList[i]).position().top;
							var left = $("#"+selectionElementsList[i]).position().left;
							var lastpos = startDradPositionList[i];
							
							$(this).fadeTo(100, 1, function() {
								// Animation complete.
									$(this).show();
									$(this).css('top', $(this).position().top +  (top - lastpos.top));
									$(this).css('left',$(this).position().left +  (left - lastpos.left));
							});
						});	
					}
					$("#"+selectionElementsList[i]).removeClass('borderSelected');
					$("#"+selectionElementsList[i]).removeClass('broderNonDragSelected');
					var undoElement = new Array(2);
					undoElement[0] = $("#"+selectionElementsList[i]);
					undoElement[1] = "move";
					undoElementList[i] = undoElement;
				}
				
				if (colMade)
				{
					showLightMsg("הזזת אלמנטים","לא ניתן להציב אלמנטים על אלמנטים אחרים, יש להציב בשטח ריק, האלמנטים שאינם בשטח ריק יחזרו למקומם הקודם.","OK","Notice");   
				}
				setSaveStatus("OK");
				SelectedElem ="";
				selectionElementsList = "";
				drag = false;
				$("#multiSelectionRectangle").animate({top: $("#multiSelectionRectangle").position().top + $("#multiSelectionRectangle").height()/2, left:$("#multiSelectionRectangle").position().left + $("#multiSelectionRectangle").width()/2 ,height:0,width:0},300, 'linear',function(){$("#multiSelectionRectangle").hide();});
		}				
		});
		
		$("#HorizontalAligmentDivLeft").click(function(){
			if (!(tableMode) && !(detailsMode))
			{
				aligmentHorizontal("left");
				$('ul.AligmentMenu').slideUp();
			}
		});
		
		$("#HorizontalAligmentDivRight").click(function(){
			if (!(tableMode) && !(detailsMode))
			{
				aligmentHorizontal("right");
				$('ul.AligmentMenu').slideUp();
			}
		});
		
		$("#VerticalAligmentDivTop").click(function(){
			if (!(tableMode) && !(detailsMode))
			{
				aligmentVertical("top");
				$('ul.AligmentMenu').slideUp();
			}
		});
		
		$("#VerticalAligmentDivBottom").click(function(){
			if (!(tableMode) && !(detailsMode))
			{
				aligmentVertical("bottom");
				$('ul.AligmentMenu').slideUp();
			}
		});
		
});