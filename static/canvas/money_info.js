var mainFrameWidthMI = 750;
var mainFrameHeightMI = 425;
var frameStringMI = '<div id="MIFrame" width="740" style="position:absolute; z-index:99999;"><table  width="740" border="0" cellspacing="0" cellpadding="0"><tr><td width="5" height="25"><img src="/static/right_interface/images/tl.png" width="5" height="25" /></td><td height="25" bgcolor="#E0E0AD"><img id="moneyInfoCloseBtn" style="cursor:pointer;" src="/static/canvas/images/close_window_btn_n.png" width="16" height="16"></img></td><td height="25" colspan="2" bgcolor="#E0E0AD" dir="rtl"><span class="text_black">סטטוס כספי</span></td><td width="5" height="25"><img src="/static/right_interface/images/tr.png" width="5" height="25" /></td></tr><tr><td width="5" valign="bottom" bgcolor="#5A8EA3"></td><td bgcolor="white" align="center" valign="center" width="350" colspan="2"><div id="groupPie" style="margin-top:15;"></div></td><td bgcolor="white" width="390"></br><div id="moneyInfoMainWindow" /></br></td><td width="5" valign="bottom" bgcolor="#5A8EA3"></td></tr><tr><td width="5" valign="bottom"><img src="/static/right_interface/images/bl.png" width="5" height="5" /></td><td colspan="3" bgcolor="#5A8EA"></td><td width="5" valign="bottom"><img src="/static/right_interface/images/br.png" width="5" height="5" /></td></tr><tr><td width="5" valign="bottom"></td><td colspan="3" valign="top"><img src="/static/page/images/shadow.png" width="740" height="15" /></td><td width="5" valign="bottom"></td></tr></table></div>';
	
//return [total sum,other group total sum,family group total sum,friends group total sum,work group total sum]
function getFullMoneyInfo()
{
	var sumArray = "";
	$.post('/canvas/getMoneyInfo/', {},
	  function(data){
	    if (data.status == 'OK')
	    {
			setSaveStatus("OK");
			sumArray = [data.totalSum, data.totalOtherSum, data.totalFirstFamilySum, data.totalFirstFriendsSum, data.totalFirstWorkSum, data.totalSecondFamilySum, data.totalSecondFriendsSum, data.totalSecondWorkSum];
			createInfoFields(sumArray);
	    }else{
			setSaveStatus("Error");
	    }
		}, 'json');
}

function createInfoFields(sumData)
{
	//creating data
	if (sumData != "")
	{
		var pieData = [];
		var secondGroupFooter = $("#secondPartnerName").text();
		
		if ($("#addChar").text() == " " || $("#addChar").text() == '')
		{
			secondGroupFooter = "כללי";
		}
		
		$("#moneyInfoMainWindow").append($('<p id="totalSum" class="text_18_black" dir="rtl">&nbsp;&nbsp;סכום כולל:  '+ sumData[0] +'</p>'));
		$("#moneyInfoMainWindow").append($('<p id="avrageSum" class="text_18_black" dir="rtl">&nbsp;&nbsp;ממוצע לאורח:  '+ (sumData[0] / parseInt($("#people_list > li").size()) + findNumOfAllSeaters()).toFixed(2) +'</p>'));
		$("#moneyInfoMainWindow").append($('<p id="totalOtherSum" class="text_18_black" dir="rtl">&nbsp;&nbsp;סכום כולל קבוצת "אחר":  '+ sumData[1] +'</p>'));
		pieData[0] = ["אחר", sumData[1] * sumData[0] / 100];
		$("#moneyInfoMainWindow").append($('<p id="totalFirstFamilySum" class="text_18_black" dir="rtl">&nbsp;&nbsp;סכום כולל קבוצת "משפחה ' + $("#firstPartnerName").text() + '":  '+ sumData[2] +'</p>'));
		pieData[1] = [" משפחה" + " " + $("#firstPartnerName").text(), sumData[2] * sumData[0] / 100];
		$("#moneyInfoMainWindow").append($('<p id="totalFirstFriendsSum" class="text_18_black" dir="rtl">&nbsp;&nbsp;סכום כולל קבוצת "חברים ' + $("#firstPartnerName").text() + '":  '+ sumData[3] +'</p>'));
		pieData[2] = [" חברים" + " " + $("#firstPartnerName").text(), sumData[3] * sumData[0] / 100];
		$("#moneyInfoMainWindow").append($('<p id="totalFirstWorkSum" class="text_18_black" dir="rtl">&nbsp;&nbsp;סכום כולל קבוצת "עבודה ' + $("#firstPartnerName").text() + '":  '+ sumData[4] +'</p>'));
		pieData[3] = [" עבודה"  + " " +  $("#firstPartnerName").text(), sumData[4] * sumData[0] / 100];
		$("#moneyInfoMainWindow").append($('<p id="totalSecondFamilySum" class="text_18_black" dir="rtl">&nbsp;&nbsp;סכום כולל קבוצת "משפחה ' + secondGroupFooter +'":  '+ sumData[5] +'</p>'));
		pieData[4] = [" משפחה"  + " " +  secondGroupFooter, sumData[5] * sumData[0] / 100];
		$("#moneyInfoMainWindow").append($('<p id="totalSecondFriendsSum" class="text_18_black" dir="rtl">&nbsp;&nbsp;סכום כולל קבוצת "חברים ' + secondGroupFooter +'":  '+ sumData[6] +'</p>'));
		pieData[5] = [" חברים"  + " " +  secondGroupFooter, sumData[6] * sumData[0] / 100];
		$("#moneyInfoMainWindow").append($('<p id="totalSecondWorkSum" class="text_18_black" dir="rtl">&nbsp;&nbsp;סכום כולל קבוצת "עבודה ' + secondGroupFooter +'":  '+ sumData[7] +'</p>'));
		pieData[6] = [" עבודה"  + " " +  secondGroupFooter, sumData[7] * sumData[0] / 100];
		drawSumsPie(pieData);
	}
}

function drawSumsPie(data)
{
  var plot1 = jQuery.jqplot ('groupPie', [data], 
    { 
      seriesDefaults: {
        renderer: jQuery.jqplot.PieRenderer, 
        rendererOptions: {
		  trendline:{show:false},
          showDataLabels: true,
		  seriesColors:["#5A8EA3","#E0E0AD","#CFC2D3","#4ABBEF"]
        }
      }, 
      legend: { show:true, location: 'e' }
    }
  );
}

$(document).ready(function() {

 $(".MoneyInfoDiv").click(function()
 {
	$("body").css("overflow", "hidden");
	var screenVP = getScreenWidthHeight();
	var screenWidth = screenVP[0];
	var screenHeight = screenVP[1];
	
	//creating window
	$("#canvas-div").append($('<div id="moneyInfoRectangle" class="BlackOverlayRectangle"/>'));
	$("#moneyInfoRectangle").css('top',0);
	$("#moneyInfoRectangle").css('left',0);
	$("#moneyInfoRectangle").css('width',screenWidth);
	$("#moneyInfoRectangle").css('height',screenHeight);
	$("#moneyInfoRectangle").draggable( 'disable' );
	$("#canvas-div").append($(frameStringMI));
	$("#MIFrame").css('top',screenHeight / 2 - mainFrameHeightMI / 2);
	$("#MIFrame").css('left',screenWidth / 2 - mainFrameWidthMI / 2);
	$("#MIFrame").css('width',mainFrameWidthMI);
	$("#MIFrame").css('height',mainFrameHeightMI);
	getFullMoneyInfo();
	$("#moneyInfoMainWindow").draggable( 'disable' );
	$("#moneyInfoCloseBtn").bind('click', function() {
		$("#moneyInfoRectangle").remove();
		$("#MIFrame").remove();
		$("body").css("overflow", "auto"); 
	});
	$("#moneyInfoCloseBtn").bind('mouseout', function(){
			$(this).attr('src',"/static/canvas/images/close_window_btn_n.png");
		});
	$("#moneyInfoCloseBtn").bind('mouseover', function(){
			$(this).attr('src',"/static/canvas/images/close_window_btn_r.png");
		});
	}); 
}); 
 