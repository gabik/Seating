var mainFrameWidth = 450;
var mainFrameHeight = 390;
var MsgTitle = "";
var MsgTextContent ="";
var MsgBoxLastAnswer = "";
var numOfMsg = 0;

function showLightMsg(title, text, buttons, icon)
{
	numOfMsg++;
	MsgBoxLastAnswer = "";
	MsgTitle = title;
	MsgTextContent = text;
	$("body").css("overflow", "hidden");
	var screenWidth = document.body.clientWidth;
	var screenHeight = document.body.clientHeight;
	
	var idSuffix = MsgTitle.replace(/\ /g,"_");
	
	idSuffix = idSuffix + numOfMsg.toString();
	var frameStringLM = '<div id="LMFrame'+idSuffix+'" style="position:absolute; z-index:99999;"><table width="380" border="0" cellspacing="0" cellpadding="0"></br><tr><td width="5" height="25"><img src="/static/right_interface/images/tl.png" width="5" height="25" /></td><td height="25" bgcolor="#E0E0AD"><img id="LightMsgCloseBtn'+idSuffix+'" style="cursor:pointer;" src="/static/canvas/images/close_window_btn_n.png" width="16" height="16"></img></td><td height="25" colspan="2" bgcolor="#E0E0AD" dir="rtl"><span class="text_black">'+MsgTitle+'</span></td><td width="5" height="25"><img src="/static/right_interface/images/tr.png" width="5" height="25" /></td></tr><tr><td width="5" valign="bottom" bgcolor="#5A8EA3"></td><td align="right" bgcolor="white"><div style="padding:10px;"><img id="lightMsgImg'+idSuffix+'" align="middle"/></div></td><td bgcolor="white" align="center" valign="center" width="350"><div id="LightMsgMainWindow'+idSuffix+'"><p class="text_14_black" dir="rtl" align="center" valign="center" style="margin-top:15px;">'+ MsgTextContent +'</p></div></br></td><td align="right" bgcolor="white">&nbsp;</td><td width="5" valign="bottom" bgcolor="#5A8EA3"></td></tr><tr><td width="5" valign="bottom"><img src="/static/right_interface/images/bl.png" width="5" height="5" /></td><td colspan="3" bgcolor="#5A8EA"></td><td width="5" valign="bottom"><img src="/static/right_interface/images/br.png" width="5" height="5" /></td></tr><tr><td width="5" valign="bottom"></td><td colspan="3" valign="top"><img src="/static/page/images/shadow.png" width="380" height="15" /></td><td width="5" valign="bottom"></td></tr></table></div>';
		
	//creating window
	$("#canvas-div").append($('<div id="lightMsgRectangle'+idSuffix+'" class="BlackOverlayRectangle"/>'));
	$("#lightMsgRectangle"+idSuffix).css('top',0);
	$("#lightMsgRectangle"+idSuffix).css('left',0);
	$("#lightMsgRectangle"+idSuffix).css('width',screenWidth);
	$("#lightMsgRectangle"+idSuffix).css('height',screenHeight);
	$("#lightMsgRectangle"+idSuffix).draggable( 'disable' );
	$("#canvas-div").append($(frameStringLM));
	$("#LMFrame"+idSuffix).css('top',screenHeight / 2 - mainFrameHeight / 2);
	$("#LMFrame"+idSuffix).css('left',screenWidth / 2 - mainFrameWidth / 2);
	$("#LMFrame"+idSuffix).css('width',mainFrameWidth);
	$("#LMFrame"+idSuffix).css('height',mainFrameHeight);
	$("#LightMsgMainWindow"+idSuffix).draggable( 'disable' );
	
	$("#LightMsgCloseBtn"+idSuffix).bind('click', function() {
		$("#lightMsgRectangle"+idSuffix).remove();
		$("#LMFrame"+idSuffix).remove();
		MsgBoxLastAnswer="Abort";
		$("body").css("overflow", "auto");
	});
	$("#LightMsgCloseBtn"+idSuffix).bind('mouseout', function(){
			$(this).attr('src',"/static/canvas/images/close_window_btn_n.png");
	});
	$("#LightMsgCloseBtn"+idSuffix).bind('mouseover', function(){
			$(this).attr('src',"/static/canvas/images/close_window_btn_r.png");
	});
	
	if (buttons == "OK")
	{
		$("#LightMsgMainWindow"+idSuffix).append($('</br>&nbsp;&nbsp;<img id="OKMsgBtn'+idSuffix+'" align="center" src="/static/canvas/images/okbtn_n.png" style="cursor:pointer;" /></br>')); 
		$("#OKMsgBtn"+idSuffix).bind('click', function() {
			$("#lightMsgRectangle"+idSuffix).remove();
			$("#LMFrame"+idSuffix).remove();
			MsgBoxLastAnswer="OK";
			$("body").css("overflow", "auto");
		});
		$("#OKMsgBtn"+idSuffix).bind('mouseout', function(){
			$(this).attr('src',"/static/canvas/images/okbtn_n.png");
		});
		$("#OKMsgBtn"+idSuffix).bind('mouseover', function(){
				$(this).attr('src',"/static/canvas/images/okbtn_r.png");
		});
	}
	else if (buttons == "YESNO")
	{
		$("#LightMsgMainWindow"+idSuffix).append($('</br>&nbsp;&nbsp;<img id="CANCELMsgBtn'+idSuffix+'" align="center" src="/static/canvas/images/xbtn_n.png" style="cursor:pointer;"><span><img id="OKMsgBtn'+idSuffix+'" align="center" src="/static/canvas/images/okbtn_n.png" style="cursor:pointer;"></span></img></br>')); 
		$("#OKMsgBtn"+idSuffix).bind('click', function() {
			$("#lightMsgRectangle"+idSuffix).remove();
			$("#LMFrame"+idSuffix).remove();
			MsgBoxLastAnswer="OK";
			$("body").css("overflow", "auto");
		});
		$("#CANCELMsgBtn"+idSuffix).bind('click', function() {
			$("#lightMsgRectangle"+idSuffix).remove();
			$("#LMFrame"+idSuffix).remove();
			MsgBoxLastAnswer="Cancel";
			$("body").css("overflow", "auto");
		});
		$("#OKMsgBtn"+idSuffix).bind('mouseout', function(){
			$(this).attr('src',"/static/canvas/images/okbtn_n.png");
		});
		$("#OKMsgBtn"+idSuffix).bind('mouseover', function(){
				$(this).attr('src',"/static/canvas/images/okbtn_r.png");
		});
		$("#CANCELMsgBtn"+idSuffix).bind('mouseout', function(){
			$(this).attr('src',"/static/canvas/images/xbtn_n.png");
		});
		$("#CANCELMsgBtn"+idSuffix).bind('mouseover', function(){
				$(this).attr('src',"/static/canvas/images/xbtn_r.png");
		});
	}
	
	if (icon == "Question")
	{
		$("#lightMsgImg"+idSuffix).attr('src',"/static/canvas/icons/qmsgicon.png");
	}
	else if (icon == "Info")
	{
		$("#lightMsgImg"+idSuffix).attr('src',"/static/canvas/icons/infolightmsg.png");
	}
	else if (icon == "Error")
	{
		$("#lightMsgImg"+idSuffix).attr('src',"/static/canvas/icons/errorlightmsg.png");
	}
	else if (icon == "Notice")
	{
		$("#lightMsgImg"+idSuffix).attr('src',"/static/canvas/icons/noticemsgicon.png");
	}
}
	
$(document).ready(function() {

}); 
 