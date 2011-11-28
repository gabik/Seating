var placementMargin = 10;
var maxWidth = 0;
var maxHeight = 0;
var maxTablesInCanvas = 48;
	
function calculateChildrenWidthAndHeightForSquarePlacment()
{
	var width = 0;
	var height = 0;
	
	if ($(".DragDiv").size() >= maxTablesInCanvas / 2 + 4)
	{
		width = $("#canvas-div").width();
		height = $("#canvas-div").height();
	}
	else
	{
		var currentHeigthMargin = 4;
		var calculateWidthIndex = Math.round($(".DragDiv").size() / 4) + 1;
		var calculateHeightIndex = Math.floor($(".DragDiv").size() / 4) + 1;
		
		$(".DragDiv").each(function(i) {
			if (i <= calculateWidthIndex)
			{
				width = width + $(this).width() + placementMargin;
				if (i == calculateWidthIndex)
				{
					height = height + $(this).height() + currentHeigthMargin;
				}
			}
			else if (i <= calculateHeightIndex + calculateWidthIndex)
			{
				height = height + $(this).height() + currentHeigthMargin;
			}
		});
	}
	maxWidth = Math.min($("#canvas-div").width(),width);
	maxHeight = Math.min($("#canvas-div").height(),height);
}

function calculateChildrenWidthAndHeightForHalfSquarePlacment()
{
	var width = 0;
	var height = 0;
	
	if ($(".DragDiv").size() >= maxTablesInCanvas / 2 + 4)
	{
		width = $("#canvas-div").width();
		height = $("#canvas-div").height();
	}
	else
	{
		var currentHeigthMargin = 4;
		var calculateWidthIndex = Math.round($(".DragDiv").size() / 2) + 1;
		var calculateHeightIndex = Math.round($(".DragDiv").size() / 4) + 1;
		
		$(".DragDiv").each(function(i) {
			if (i <= calculateWidthIndex)
			{
				width = width + $(this).width() + placementMargin;
				if (i == calculateWidthIndex)
				{
					height = height + $(this).height() + currentHeigthMargin;
				}
			}
			else if (i < calculateHeightIndex + calculateWidthIndex + 1)
			{
				height = height + $(this).height() + currentHeigthMargin;
			}
		});
	}
	maxWidth = Math.min($("#canvas-div").width(),width);
	maxHeight = Math.min($("#canvas-div").height(),height);
}

$(document).ready(function() {
	
	 $("#SquarePlaceMentShapes").click(function(){
		 if (!tableMode && !detailsMode)
		{
			posPropertyPanel("");
			calculateChildrenWidthAndHeightForSquarePlacment();
			var middleCircle = false;
			var horizontalArrange = true;
			var reflactionTop = 0;
			var circleEndLeft = 0;
			var middleCircleHalfIndex = 0;
			var maxMiddleCircleHeigth = 0;
			var firstRowMaxTop = 0;
			var currentHeigthMargin = 4;
			var currnetMaxWidth =  maxWidth;
			var currnetMaxHeight = maxHeight;
			var newTop = $("#canvas-div").offset().top + 5;
			var newLeft = $("#canvas-div").offset().left + 5;
			var startTop = $("#canvas-div").offset().top + 5;
			var startLeft = $("#canvas-div").offset().left + 5;
			undoElementList = new Array($(".DragDiv").size());
			startDradPositionList = new Array($(".DragDiv").size());
			$('ul.ShapePlacementMenu').slideToggle('medium');
			
			$(".DragDiv").each(function(i) {
				$(this).removeClass('borderSelected');
				SelectedElem = "";
				
				startDradPositionList[i] = $(this).position();
				
				$(this).animate({ top: newTop , left: newLeft},300, 'linear', function() {saveElement($(this));	});
				
				if (middleCircle)
				{
					if ($(this).height() > maxMiddleCircleHeigth)
					{
						maxMiddleCircleHeigth = $(this).height();
					}
					newLeft = newLeft + $(this).width() + placementMargin;
					if (middleCircleHalfIndex == i)
					{
						newTop = newTop + maxMiddleCircleHeigth;
						newLeft = startLeft;
					}
				}
				else
				{
					if (horizontalArrange)
					{
						if (reflactionTop == 0)
						{
							reflactionTop = newTop + $(this).height() + currentHeigthMargin;
						}
						if (startTop + $(this).height() > firstRowMaxTop)
						{
							firstRowMaxTop = startTop + $(this).height();
						}
						if (newLeft + $(this).width() <= currnetMaxWidth && newTop == startTop)
						{
							newLeft = newLeft + $(this).width() + placementMargin;
							if (newLeft + $(this).width() > currnetMaxWidth)
							{
								newTop = newTop + $(this).height() + currentHeigthMargin;
								newLeft = newLeft - $(this).width() - placementMargin;
							}
						}
						else if (newTop <= currnetMaxHeight && newLeft != startLeft)
						{
							newTop = newTop + $(this).height() + currentHeigthMargin;
							if (newTop + $(this).height() > currnetMaxHeight)
							{
								circleEndLeft = newLeft;
								newTop = reflactionTop;
								newLeft = startLeft;
							}
						}
						else
						{
							newTop = newTop + $(this).height() + currentHeigthMargin;
							horizontalArrange = false;
						}
					}
					else
					{
						if (newTop + $(this).height() <= currnetMaxHeight && newLeft == startLeft)
						{
							newTop = newTop + $(this).height() + currentHeigthMargin;
							if (newTop + $(this).height() > currnetMaxHeight)
							{
								newTop = newTop - $(this).height() - currentHeigthMargin;
								newLeft = newLeft + $(this).width() + placementMargin;
							}
						}
						else if (newLeft + $(this).width() <= circleEndLeft)
						{
							newLeft = newLeft + $(this).width() + placementMargin;
							if (newLeft + $(this).width() > circleEndLeft)
							{
								middleCircle = true;
								middleCircleHalfIndex = i + parseInt(($(".DragDiv").size() - i) / 2);
								newLeft = currnetMaxWidth / 2 - (($(".DragDiv").size() - i) / 2.5 * tableElementSize);
								startLeft = newLeft;
								newTop = firstRowMaxTop + (Math.ceil($(".DragDiv").size() / 14) * currentHeigthMargin);
							}
						}
					}
				}
				
				var undoElement = new Array(2);
				undoElement[0] = $(this);
				undoElement[1] = "move";
				undoElementList[i] = undoElement;
			});
			
		}
	 });
	 
	 $("#HSquarePlaceMentShapes").click(function(){
		if (!tableMode && !detailsMode)
		{
			posPropertyPanel("");
			calculateChildrenWidthAndHeightForHalfSquarePlacment();
			var middleCircle = false;
			var horizontalArrange = true;
			var reflactionTop = 0;
			var firstRowMaxLeft = 0;
			var circleEndLeft = 0;
			var middleCircleHalfIndex = 0;
			var maxMiddleCircleHeigth = 0;
			var firstRowMaxTop = 0;
			var currentHeigthMargin = 4;
			var currnetMaxWidth =  maxWidth;
			var currnetMaxHeight = maxHeight;
			var middleNumOfHorizontalElements = 0;
			var newTop = $("#canvas-div").offset().top + 5;
			var newLeft = $("#canvas-div").offset().left + 5;
			var startTop = $("#canvas-div").offset().top + 5;
			var startLeft = $("#canvas-div").offset().left + 5;
			undoElementList = new Array($(".DragDiv").size());
			startDradPositionList = new Array($(".DragDiv").size());
			$('ul.ShapePlacementMenu').slideToggle('medium');
			
			$(".DragDiv").each(function(i) {
				$(this).removeClass('borderSelected');;
				SelectedElem = "";
			
				startDradPositionList[i] = $(this).position();
				
				$(this).animate({ top: newTop , left: newLeft},300, 'linear', function() {saveElement($(this));	});
				
				if (middleCircle)
				{
					if ($(this).height() > maxMiddleCircleHeigth)
					{
						maxMiddleCircleHeigth = $(this).height();
					}
					newLeft = newLeft + $(this).width() + placementMargin;
					if (middleCircleHalfIndex == i)
					{
						newTop = newTop + maxMiddleCircleHeigth;
						newLeft = startLeft;
						middleCircleHalfIndex = i + middleNumOfHorizontalElements;
					}
				}
				else
				{
					if (horizontalArrange)
					{
						if (reflactionTop == 0)
						{
							reflactionTop = newTop + $(this).height() + currentHeigthMargin;
						}
						if (startLeft + $(this).width() > firstRowMaxLeft)
						{
							firstRowMaxLeft = startLeft + $(this).width();
						}
						if (startTop + $(this).height() > firstRowMaxTop)
						{
							firstRowMaxTop = startTop + $(this).height();
						}
						if (newLeft + $(this).width() <= currnetMaxWidth && newTop == startTop)
						{
							newLeft = newLeft + $(this).width() + placementMargin;
							if (newLeft + $(this).width() > currnetMaxWidth)
							{
								newTop = newTop + $(this).height() + currentHeigthMargin;
								newLeft = newLeft - $(this).width() - placementMargin;
							}
						}
						else if (newTop <= currnetMaxHeight && newLeft != startLeft)
						{
							newTop = newTop + $(this).height() + currentHeigthMargin;
							if (newTop + $(this).height() > currnetMaxHeight)
							{
								circleEndLeft = newLeft;
								newTop = reflactionTop;
								newLeft = startLeft;
							}
						}
						else
						{
							newTop = newTop + $(this).height() + currentHeigthMargin;
							horizontalArrange = false;
						}
					}
					else
					{
						if (newTop + $(this).height() <= currnetMaxHeight && newLeft == startLeft)
						{
							newTop = newTop + $(this).height() + currentHeigthMargin;
							if (newTop + $(this).height() > currnetMaxHeight)
							{
								//middleCircle = true;
								//middleCircleHalfIndex = i + parseInt(($(".DragDiv").size() - i) / 3);
								//middleNumOfHorizontalElements = middleCircleHalfIndex - i;
								if ($(".DragDiv").size() >= maxTablesInCanvas / 2 + 4)
								{
									currnetMaxWidth = currnetMaxWidth - 1.5 * tableElementSize;
								}
								else
								{
									currnetMaxWidth = currnetMaxWidth - 3 * tableElementSize;
								}
								newLeft = firstRowMaxLeft;
								startLeft = newLeft;
								newTop = firstRowMaxTop - 5;
								startTop = newTop;
								reflactionTop = 0;
								horizontalArrange = true;
							}
						}
					}
				}
				
				var undoElement = new Array(2);
				undoElement[0] = $(this);
				undoElement[1] = "move";
				undoElementList[i] = undoElement;
			});
		}
	 });
	 
	 $("#SeqPlaceMentShapes").click(function(){
		if (!tableMode && !detailsMode)
		{
			posPropertyPanel("");
			maxWidth = $("#canvas-div").width();
			maxHeight = $("#canvas-div").height();
			var newTop = $("#canvas-div").offset().top + 5;
			var newLeft = $("#canvas-div").offset().left + 5;
			var startTop = $("#canvas-div").offset().top + 5;
			var startLeft = $("#canvas-div").offset().left + 5;
			var maxWidthPerCol = 0;
			undoElementList = new Array($(".DragDiv").size());
			startDradPositionList = new Array($(".DragDiv").size());
			$('ul.ShapePlacementMenu').slideToggle('medium');
			
			$(".DragDiv").each(function(i) {
				$(this).removeClass('borderSelected');
				SelectedElem = "";
				startDradPositionList[i] = $(this).position();
				if (newTop + $(this).height() > maxHeight)
				{
					newTop = startTop;
					newLeft = newLeft + maxWidthPerCol + placementMargin;
					maxWidthPerCol = 0;
				}
				
				if (newLeft + $(this).width() > maxWidth)
				{
					startTop =  startTop;
					startLeft =  startLeft + placementMargin;
					newTop = startTop;
					newLeft = startLeft;
				}
				
				if (startLeft + $(this).width() > maxWidth)
				{
					startLeft = $("#canvas-div").offset().left + 5;				
				}
				
				$(this).animate({ top: newTop , left: newLeft},300, 'linear', function() {saveElement($(this));	});

				newTop = newTop + $(this).height() + placementMargin;
				if (maxWidthPerCol < $(this).width())
				{
					maxWidthPerCol = $(this).width();
				}
				
				var undoElement = new Array(2);
				undoElement[0] = $(this);
				undoElement[1] = "move";
				undoElementList[i] = undoElement;
			});
		}
	});
});

