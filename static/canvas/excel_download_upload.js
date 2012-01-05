var mainFrameWidthEUD = 470;
var mainFrameHeightEUD = 400;

var frameStringEUD = '<div id="EUDFrame" style="position:absolute; z-index:99999;	 margin-right:auto; margin-left: auto;"><table border="0" height="310" cellspacing="0" cellpadding="0"><tr><td width="5" height="25"><img src="/static/right_interface/images/tl.png" width="5" height="25" /></td><td height="25"  bgcolor="#E0E0AD"><img id="EUDCloseBtn" style="cursor:pointer;" src="/static/canvas/images/close_window_btn_n.png" width="16" height="16" ></img></td><td height="25" colspan="1" bgcolor="#E0E0AD" dir="rtl"><span class="text_black">העלאה והורדה קובץ אקסל</span></td><td width="5" height="25"><img src="/static/right_interface/images/tr.png" width="5" height="25" /></td></tr><tr height="auto"><td width="5" valign="bottom" bgcolor="#5A8EA3"></td><td bgcolor="white" align="left" width="460" colspan="2"><div class="ExcelUDArea" id="excelUDArea" width="400" height="245"/></td><td width="5" valign="bottom" bgcolor="#5A8EA3"></td></tr><tr><td width="5" valign="bottom"><img src="/static/right_interface/images/bl.png" width="5" height="5" /></td><td colspan="2" bgcolor="#5A8EA"></td><td width="5" valign="bottom"><img src="/static/right_interface/images/br.png" width="5" height="5" /></td></tr><tr><td width="5" valign="bottom"></td><td colspan="2" valign="top"><img src="/static/page/images/shadow.png" width="460" height="15" /></td><td width="5" valign="bottom"></td></tr></table></div>';

$(document).ready(function() { 
 $(".EUDDiv").click(function()
 {
 	$("body").css("overflow", "hidden");
	var screenVP = getScreenWidthHeight();
	var screenWidth = screenVP[0];
	var screenHeight = screenVP[1];
	
	//creating window
	$("#canvas-div").append($('<div id="EUDRectangle" class="BlackOverlayRectangle"/>'));
	$("#EUDRectangle").css('top',0);
	$("#EUDRectangle").css('left',0);
	$("#EUDRectangle").css('width',screenWidth);
	$("#EUDRectangle").css('height',screenHeight);
	$("#EUDRectangle").draggable( 'disable' );
	$("#canvas-div").append($(frameStringEUD));
	$("#EUDFrame").css('top',screenHeight / 2 - mainFrameHeightEUD / 2);
	$("#EUDFrame").css('left',screenWidth / 2 - mainFrameWidthEUD / 2);
	$("#EUDFrame").css('width',mainFrameWidthEUD);
	$("#EUDFrame").css('height',mainFrameHeightEUD);
	$("#EUDFrame").draggable( 'disable' );
	$("#excelUDArea").append($(excelDivString));
	$("#OFtabs").tabs();
	$("#EUDCloseBtn").bind('click', function() {
		$("#EUDRectangle").remove();
		$("#EUDFrame").remove(); 
		$("body").css("overflow", "auto");
	}); 

	$("#EUDCloseBtn").bind('mouseout', function(){
		$(this).attr('src',"/static/canvas/images/close_window_btn_n.png");
	});
	$("#EUDCloseBtn").bind('mouseover', function(){
		$(this).attr('src',"/static/canvas/images/close_window_btn_r.png");
	});
	$("#excelDownImg").bind('mouseout', function(){
		$(this).attr('src',"/static/canvas/images/features/exceldown_n.png");
	});
	$("#excelDownImg").bind('mouseover', function(){
		$(this).attr('src',"/static/canvas/images/features/exceldown_r.png");
	});
	$("#excelDownImg").bind('click', function(){
		 //window.location='/accounts/download';  
		 $("#EUDCloseBtn").click();
		 window.open('/accounts/download');
		 return false;
	});
	$("#excelUpImg").bind('mouseout', function(){
		$(this).attr('src',"/static/canvas/images/features/excelup_n.png");
	});
	$("#excelUpImg").bind('mouseover', function(){
		$(this).attr('src',"/static/canvas/images/features/excelup_r.png");
	});
	
	$("#id_file").bind('mouseout', function(){
		$("#browseImg").attr('src',"/static/canvas/images/browse_n.png");
	});
	$("#id_file").bind('mouseover', function(){
		$("#browseImg").attr('src',"/static/canvas/images/browse_o.png");
	});
	$("#id_file").bind('change', function(){
		$("#fileText").val($(this).val());
	});
  });
});

 
