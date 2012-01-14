var mainFrameWidthOM = 650;
var mainFrameHeightOM = 375;
var frameStringOM = '<div id="OMFrame" style="position:absolute; z-index:99999;"><table width="540" heigth="320" border="0" cellspacing="0" cellpadding="0"><tr><td width="5" height="25"><img src="/static/right_interface/images/tl.png" width="5" height="25" /></td><td height="25" bgcolor="#E0E0AD"><img id="OperationMangerCloseBtn" style="cursor:pointer;" src="/static/canvas/images/close_window_btn_n.png" width="16" height="16"></img></td><td height="25" colspan="2" bgcolor="#E0E0AD" dir="rtl"><span class="text_black">יומן פעולות</span></td><td width="5" height="25"><img src="/static/right_interface/images/tr.png" width="5" height="25" /></td></tr><tr><td width="5" valign="bottom" bgcolor="#5A8EA3"></td><td bgcolor="white"/><td bgcolor="white" width="510" colspan ="2"><div id="OperationsInfoMainWindow" style=" margin-top:15;"/></td><td width="5" valign="bottom" bgcolor="#5A8EA3"></td></tr><tr><td width="5" valign="bottom"><img src="/static/right_interface/images/bl.png" width="5" height="5" /></td><td colspan="2" bgcolor="#5A8EA"></td><td width="5" valign="bottom"><img src="/static/right_interface/images/br.png" width="5" height="5" /></td></tr><tr><td width="5" valign="bottom"></td><td colspan="3" valign="top"><img src="/static/page/images/shadow.png" width="540" height="15" /></td><td width="5" valign="bottom"></td></tr></table></div>';

function writeOccasionInfo(infoData)
{
	$.post('/canvas/writeOperationInfo/', {info: infoData},
	function(data){	
		if (data.status == 'OK')
		{
			
		}
	}, 'json');
}

function buildOccasionInfo()
{
   $.post('/canvas/getOperationsInfoNum/', {},
	function(data){	
		if (data.status == 'OK')
		{
			var operationsInfoNum = data.Total;
			
			if (operationsInfoNum > 0 )
			{
				for (var i = operationsInfoNum; i > 0; i--)
				{
					$.post('/canvas/getOperationsInfo/', {num: parseInt(i)},
					function(OpData){	
						if (OpData.status == 'OK')
						{
							$("#OperationList").append($('<li><p class="text_14_black" dir="rtl">'+OpData.opnum+'. '+OpData.date+' '+OpData.info +'</p></li>'));						}
					}, 'json');
				}
			}
		}
	}, 'json');
}

$(document).ready(function(){

	var screenWidth = document.body.clientWidth;
	var screenHeight = document.body.clientHeight;
	
	
  $(".OperationsInfoDiv").click(function()
  {
	//creating window
	$("#canvas-div").append($('<div id="OperationsInfoRectangle" class="BlackOverlayRectangle"/>'));
	$("#OperationsInfoRectangle").animate({top:0,left:0,width:screenWidth,height:screenHeight});
	$("#OperationsInfoRectangle").draggable( 'disable' );
	$("#canvas-div").append($(frameStringOM));
	$("#OMFrame").animate({top:screenHeight / 2 - mainFrameHeightOM / 2,left:screenWidth / 2 - mainFrameWidthOM / 2,width:mainFrameWidthOM,height:mainFrameHeightOM},function(){ buildOccasionInfo();});
	$("#OMFrame").draggable( 'disable' );
	$("#OperationMangerCloseBtn").bind('click', function() {
		$("#OperationsInfoRectangle").animate({top:0,left:0,width:0,height:0},function(){$("#OperationsInfoRectangle").remove();});
		$("#OMFrame").animate({top:0,left:0,width:0,height:0},function(){$("#OMFrame").remove(); 
		});
	}); 
	
		$("#OperationMangerCloseBtn").bind('mouseout', function(){
			$(this).attr('src',"/static/canvas/images/close_window_btn_n.png");
		});
		$("#OperationMangerCloseBtn").bind('mouseover', function(){
			$(this).attr('src',"/static/canvas/images/close_window_btn_r.png");
		});
	$("#OperationsInfoMainWindow").append($('<ul id="OperationList"/>'));
  });
});

