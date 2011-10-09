var mainFrameWidthOG = 450;
var mainFrameHeightOG = 190;
var screenWidth = 0;
var screenHeight = 0;

function ShowHourGlassWaitingWindow(reload)
{
	screenWidth = document.body.clientWidth;
	screenHeight = document.body.clientHeight;
	
	//creating window
	$("#canvas-div").append($('<div id="HourGlassRectangle" class="BlackOverlayRectangle"/>'));
	$("#HourGlassRectangle").animate({top:0,left:0,width:screenWidth,height:screenHeight});
	$("#HourGlassRectangle").draggable( 'disable' );
	$("#canvas-div").append($('<div id="HourGlassMainWindow" class="SimpleFrame"/>'));
	$("#HourGlassMainWindow").animate({top:screenHeight / 2 - mainFrameHeightOG / 2,left:screenWidth / 2 - mainFrameWidthOG / 2,width:mainFrameWidthOG,height:mainFrameHeightOG},function(){if (reload){location.reload();}});
	$("#HourGlassMainWindow").draggable( 'disable' );
	$("#HourGlassMainWindow").append($('<h3>Please Wait...<h3>'));
	$("#HourGlassMainWindow").append($('<img id="hourGlassImg" width="64" height="64" style="position:absolute;" src="/static/canvas/images/circleHourGlass.gif">'));
	$("#hourGlassImg").css('top',$("#HourGlassMainWindow").offset().top + mainFrameHeightOG / 3.5);
	$("#hourGlassImg").css('left',$("#HourGlassMainWindow").offset().left + mainFrameWidthOG / 2.5);
}

function HideHourGlassWaitingWindow()
{
	$("#HourGlassRectangle").remove();
	$("#HourGlassMainWindow").remove();
}

$(document).ready(function() {

}); 
 