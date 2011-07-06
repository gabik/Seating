var placementMargin = 25;

$(document).ready(function() {
	
	var maxWidth = $("#canvas-div").width();
	var maxHeight = $("#canvas-div").height();
	
	 $(".SeqPlaceMentShapesDiv").click(function(){
		if (!tableMode && !detailsMode)
		{
			var newTop = $("#canvas-div").offset().top + 5;
			var newLeft = $("#canvas-div").offset().left + 5;
			var startTop = $("#canvas-div").offset().top + 5;
			var startLeft = $("#canvas-div").offset().left + 5;
			undoElementList = new Array($(".DragDiv").size());
			startDradPositionList = new Array($(".DragDiv").size());

			$(".DragDiv").each(function(i) {
				$(this).border('0px white 0');
				startDradPositionList[i] = $(this).position();
				if (newTop > maxHeight)
				{
					newTop = startTop;
					newLeft = newLeft + $(this).width() + placementMargin;
				}
				
				if (newLeft > maxWidth)
				{
					startTop =  startTop;
					startLeft =  startLeft + 25;
					newTop = startTop;
					newLeft = startLeft;
				}
				
				if (startLeft > maxWidth)
				{
					startLeft = $("#canvas-div").offset().left + 5;				
				}
				
				$(this).animate({ top: newTop , left: newLeft},300, 'linear', function() { saveElement($(this));	});

				newTop = newTop + $(this).height() + placementMargin;
				
				var undoElement = new Array(2);
				undoElement[0] = $(this);
				undoElement[1] = "move";
				undoElementList[i] = undoElement;
			});
		}
	});
});

