var mainFrameWidthOF = 450;
var mainFrameHeightOF = 190;
	
function showFinishOptions()
{
		$("#OccasionFinishMainWindow").append($('<br /><input id="thanks" type="checkbox" value="False"/><label for="thanksLbl">Send Thanks</label><br /><br />'));
		$("#OccasionFinishMainWindow").append($('<input id="printList" type="checkbox" value="False"/><label for="printListLbl">Print Guest List</label><br /><br />'));
		$("#OccasionFinishMainWindow").append($('<input id="makeStickers" type="checkbox" value="False"/><label for="makeStickersLbl">Make Stickers</label><br /><br />'));
}

$(document).ready(function() {

 $(".OccasionFinishDiv").click(function()
 {
	var screenWidth = document.documentElement.clientWidth;
	var screenHeight = document.documentElement.clientHeight;
	
	//creating window
	$("#canvas-div").append($('<div id="OccasionFinishRectangle" class="BlackOverlayRectangle"/>'));
	$("#OccasionFinishRectangle").animate({top:0,left:0,width:screenWidth,height:screenHeight});
	$("#OccasionFinishRectangle").draggable( 'disable' );
	$("#canvas-div").append($('<div id="OccasionFinishMainWindow" class="SimpleFrame"/>'));
	$("#OccasionFinishMainWindow").animate({top:screenHeight / 2 - mainFrameHeightOF / 2,left:screenWidth / 2 - mainFrameWidthOF / 2,width:mainFrameWidthOF,height:mainFrameHeightOF},function(){ showFinishOptions(); });
	$("#OccasionFinishMainWindow").draggable( 'disable' );
	$("#OccasionFinishMainWindow").append($('<button id="OccasionFinishCloseBtn" style="position:relative; background-color:red;" type="button">X</button>'));
	$("#OccasionFinishCloseBtn").css("top", 15);
	$("#OccasionFinishCloseBtn").css("left", mainFrameWidthOF - 50);
	$("#OccasionFinishCloseBtn").bind('click', function() {
		$("#OccasionFinishRectangle").animate({top:0,left:0,width:0,height:0},function(){$("#OccasionFinishRectangle").remove();});
		$("#OccasionFinishMainWindow").animate({top:0,left:0,width:0,height:0},function(){$("#OccasionFinishMainWindow").remove(); 
		});
	}); 
	$("#OccasionFinishMainWindow").append($('<button id="OccasionFinishDoneBtn" style="position:relative; background-color:green;" type="button">Done</button>'));
	$("#OccasionFinishDoneBtn").css("top", mainFrameHeightOF - 30);
	$("#OccasionFinishDoneBtn").css("left", mainFrameWidthOF - 100);
	$("#OccasionFinishDoneBtn").bind('click', function() {
	});
  });
}); 
 