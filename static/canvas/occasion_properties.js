var mainFrameWidthOP = 470;
var mainFrameHeightOP = 400;

var frameStringOP = '<div id="OPFrame" style="position:absolute; z-index:99999;"><table width="460" border="0" cellspacing="0" cellpadding="0"><tr><td width="5" height="25"><img src="/static/right_interface/images/tl.png" width="5" height="25" /></td><td height="25" bgcolor="#E0E0AD"><img id="OcassionPropCloseBtn" style="cursor:pointer;" src="/static/canvas/images/close_window_btn_n.png" width="16" height="16"></img></td><td height="25" colspan="2" bgcolor="#E0E0AD" dir="rtl"><span class="text_black">נתוני אירוע</span></td><td width="5" height="25"><img src="/static/right_interface/images/tr.png" width="5" height="25" /></td></tr><tr><td width="5" valign="bottom" bgcolor="#5A8EA3"></td><td bgcolor="white"/><td bgcolor="white" colspan ="2"><div id="OcassionsPropMainWindow" style=" margin-top:15; margin-right:15;"/></td><td width="5" valign="bottom" bgcolor="#5A8EA3"></td></tr><tr><td width="5" valign="bottom"><img src="/static/right_interface/images/bl.png" width="5" height="5" /></td><td colspan="2" bgcolor="#5A8EA"></td><td width="5" valign="bottom"><img src="/static/right_interface/images/br.png" width="5" height="5" /></td></tr><tr><td width="5" valign="bottom"></td><td colspan="3" valign="top"><img src="/static/page/images/shadow.png" width="460" height="15" /></td><td width="5" valign="bottom"></td></tr></table></div>';

function createWindow()
{
	$("#OcassionsPropMainWindow").append($('<p align="right" dir="rtl" class="text_14_black">תאריך אירוע:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><input MAXLENGTH=30 type="text" id="ocassion_date_op" value="'+ $("#OccasionDate").text() +'"/></span></p>'));
	$("#OcassionsPropMainWindow").append($('<p align="right" dir="rtl" class="text_14_black">מקום אירוע:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><input MAXLENGTH=30 type="text" id="ocassion_place_op" value="'+ $("#OccasionPlace").text() +'"/></span></p>'));
	$("#OcassionsPropMainWindow").append($('<p align="right" dir="rtl" class="text_14_black">טלפון:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><input MAXLENGTH=30 type="text" id="ocassion_phone_op" value=" '+ $("#phone_number").text() +'"/></span></p></br></br>'));
}

$(document).ready(function() { 
 $("#occasionMarquee").click(function()
 {	
	var screenWidth = document.body.clientWidth;
	var screenHeight = document.body.clientHeight;
	
	//creating window
	$("#canvas-div").append($('<div id="OccasionpPropRectangle" class="BlackOverlayRectangle"/>'));
	$("#OccasionpPropRectangle").animate({top:0,left:0,width:screenWidth,height:screenHeight});
	$("#OccasionpPropRectangle").draggable( 'disable' );
	$("#canvas-div").append($(frameStringOP));
	$("#OPFrame").animate({top:screenHeight / 2 - mainFrameHeightOP / 2,left:screenWidth / 2 - mainFrameWidthOP / 2,width:mainFrameWidthOP,height:mainFrameHeightOP},function(){ createWindow(); });
	$("#OPFrame").draggable( 'disable' );
	$("#features").append($(ofTabString));
	$("#OFtabs").tabs();
	sendNotifyChange();
	$("#OcassionPropCloseBtn").bind('click', function() {
		$("#OccasionpPropRectangle").animate({top:0,left:0,width:0,height:0},function(){$("#OccasionpPropRectangle").remove();});
		$("#OPFrame").animate({top:0,left:0,width:0,height:0},function(){$("#OPFrame").remove(); 
		});
	}); 

	$("#OcassionPropCloseBtn").bind('mouseout', function(){
		$(this).attr('src',"/static/canvas/images/close_window_btn_n.png");
	});
	$("#OcassionPropCloseBtn").bind('mouseover', function(){
		$(this).attr('src',"/static/canvas/images/close_window_btn_r.png");
	});
  });
});

 
 