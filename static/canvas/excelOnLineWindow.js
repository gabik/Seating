var mainFrameWidthEO = 950;
var mainFrameHeightEO = 600;


var frameStringOP = '<div id="EOFrame" style="position:absolute; z-index:99999;"><table width="950" border="0" cellspacing="0" cellpadding="0"><tr><td width="5" height="25"><img src="/static/right_interface/images/tl.png" width="5" height="25" /></td><td height="25" bgcolor="#E0E0AD"><img id="ExcelOnLineCloseBtn" style="cursor:pointer;" src="/static/canvas/images/close_window_btn_n.png" width="16" height="16"></img></td><td height="25" colspan="2" bgcolor="#E0E0AD" dir="rtl"><span class="text_black">אקסל און ליין</span></td><td width="5" height="25"><img src="/static/right_interface/images/tr.png" width="5" height="25" /></td></tr><tr><td width="5" valign="bottom" bgcolor="#5A8EA3"></td><td bgcolor="white" width="70" valign="bottom"></td><td bgcolor="white" width="5"/><td bgcolor="white"><div id="ExcelOnLineMainWindow" style=" margin-top:15; margin-right:15;"/><iframe id="iFrame" src="/accounts/online/" width=945 height=600 scrolling=no></iframe></div></td><td width="5" valign="bottom" bgcolor="#5A8EA3"></td></tr><tr><td width="5" valign="bottom"><img src="/static/right_interface/images/bl.png" width="5" height="5" /></td><td colspan="3" bgcolor="#5A8EA"></td><td width="5" valign="bottom"><img src="/static/right_interface/images/br.png" width="5" height="5" /></td></tr><tr><td width="5" valign="bottom"></td><td colspan="3" valign="top"><img src="/static/page/images/shadow.png" width="950" height="15" /></td><td width="5" valign="bottom"></td></tr></table></div>';

$(document).ready(function() { 
 $("#excelOnLineBtn").click(function()
 {	
 	$("body").css("overflow", "hidden");
	var screenVP = getScreenWidthHeight();
	var screenWidth = screenVP[0];
	var screenHeight = screenVP[1];
	
	//creating window
	$("#canvas-div").append($('<div id="ExcelOnlineRectangle" class="BlackOverlayRectangle"/>'));
	$("#ExcelOnlineRectangle").css('top',0);
	$("#ExcelOnlineRectangle").css('left',0);
	$("#ExcelOnlineRectangle").css('width',screenWidth);
	$("#ExcelOnlineRectangle").css('height',screenHeight);
	$("#ExcelOnlineRectangle").draggable( 'disable' );
	$("#canvas-div").append($(frameStringOP));
	//$("#EOFrame").css('top',screenHeight / 2 - mainFrameHeightEO / 2);
	$("#EOFrame").css('top',10);
	$("#EOFrame").css('left',screenWidth / 2 - mainFrameWidthEO / 2);
//	$("#EOFrame").css('left',10);
	$("#EOFrame").css('width',mainFrameWidthEO);
	$("#EOFrame").css('height',mainFrameHeightEO);
	$("#EOFrame").draggable( 'disable' );
	$("#ExcelOnLineCloseBtn").bind('click', function() {
		$("#ExcelOnlineRectangle").remove();
		$("#EOFrame").remove();
		$("body").css("overflow", "auto");
		});
	$("#ExcelOnLineCloseBtn").bind('mouseout', function(){
		$(this).attr('src',"/static/canvas/images/close_window_btn_n.png");
	});
	$("#ExcelOnLineCloseBtn").bind('mouseover', function(){
		$(this).attr('src',"/static/canvas/images/close_window_btn_r.png");
	});
	}); 
  });

 
 
