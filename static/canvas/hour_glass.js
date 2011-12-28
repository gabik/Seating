var mainFrameWidthOG = 450;
var mainFrameHeightOG = 290;
var frameStringHG = '<div id="HGFrame" style="position:absolute; z-index:99999;"><table width="430" heigth="320" border="0" cellspacing="0" cellpadding="0"><tr><td width="5" height="25"><img src="/static/right_interface/images/tl.png" width="5" height="25" /></td><td height="25" colspan="2" bgcolor="#E0E0AD" dir="rtl"><span class="text_black">מבצע פעולה</span></td><td width="5" height="25"><img src="/static/right_interface/images/tr.png" width="5" height="25" /></td></tr><tr><td width="5" valign="bottom" bgcolor="#5A8EA3"></td><td bgcolor="white"/></td><td bgcolor="white" align="center"><div width="300" style="margin-top:15;"/><h3 class="text_18_black" dir="rtl">נא להמתין מספר רגעים...</h3></BR><img id="hourGlassImg" width="64" height="64" src="/static/canvas/images/circleHourGlass.gif"/></BR></BR></td><td width="5" valign="bottom" bgcolor="#5A8EA3"></td></tr><tr><td width="5" valign="bottom"><img src="/static/right_interface/images/bl.png" width="5" height="5" /></td><td colspan="2" bgcolor="#5A8EA"></td><td width="5" valign="bottom"><img src="/static/right_interface/images/br.png" width="5" height="5" /></td></tr><tr><td width="5" valign="bottom"></td><td colspan="2" valign="top"><img src="/static/page/images/shadow.png" width="430" height="15" /></td><td width="5" valign="bottom"></td></tr></table></div>';

function ShowHourGlassWaitingWindow(reload)
{
	$("body").css("overflow", "hidden");
	var screenVP = getScreenWidthHeight();
	var screenWidth = screenVP[0];
	var screenHeight = screenVP[1];
	
	//creating window
	$("#canvas-div").append($('<div id="HourGlassRectangle" class="BlackOverlayRectangle"/>'));
	$("#HourGlassRectangle").css('top',0);
	$("#HourGlassRectangle").css('left',0);
	$("#HourGlassRectangle").css('width',screenWidth);
	$("#HourGlassRectangle").css('height',screenHeight);
	$("#HourGlassRectangle").draggable( 'disable' );
	$("#canvas-div").append($(frameStringHG));
	$("#HGFrame").css('top',screenHeight / 2 - mainFrameHeightOG / 2);
	$("#HGFrame").css('left',screenWidth / 2 - mainFrameWidthOG / 2);
	$("#HGFrame").css('width',mainFrameWidthMI);
	$("#HGFrame").css('height',mainFrameHeightMI);
	if (reload){setTimeout(function(){location.reload();},1500);};
}

function HideHourGlassWaitingWindow()
{
	$("#HourGlassRectangle").remove();
	$("#HGFrame").remove();
}

$(document).ready(function() {

}); 
 