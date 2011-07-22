var mainFrameWidth = 750;
var mainFrameHeight = 300;
	
//return [total sum,other group total sum,family group total sum,friends group total sum,work group total sum]
function getFullMoneyInfo()
{
	var sumArray = "";
	$.post('/canvas/getMoneyInfo/', {},
	  function(data){
	    if (data.status == 'OK')
	    {
			$("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
			sumArray = [data.totalSum, data.totalOtherSum, data.totalFamilySum, data.totalFreindsSum, data.totalWorkSum];
			createInfoFields(sumArray);
	    }else{
			$("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
	    }
		}, 'json');
}

function createInfoFields(sumData)
{
	//creating data
	if (sumData != "")
	{
		var pieData = [];
			
		$("#moneyInfoMainWindow").append($('<p id="totalSum" style="position:relative;">Total Sum:  '+ sumData[0] +'</p>'));
		$("#totalSum").css("top", 15);
		$("#totalSum").css("left",15);
		$("#moneyInfoMainWindow").append($('<p id="avrageSum" style="position:relative;">Avrage Per Person:  '+ sumData[0] / parseInt($("#people_list > li").size() + findNumOfAllSeaters()) +'</p>'));
		$("#avrageSum").css("top", 15);
		$("#avrageSum").css("left",15);
		$("#moneyInfoMainWindow").append($('<p id="totalOtherSum" style="position:relative;">Total Other GroupSum:  '+ sumData[1] +'</p>'));
		$("#totalOtherSum").css("top", 15);
		$("#totalOtherSum").css("left",15);
		pieData[0] = ["Other", sumData[1] * sumData[0] / 100];
		$("#moneyInfoMainWindow").append($('<p id="totalFamilySum" style="position:relative;">Total Family Group Sum:  '+ sumData[2] +'</p>'));
		$("#totalFamilySum").css("top", 15);
		$("#totalFamilySum").css("left",15);
		pieData[1] = ["Family", sumData[2] * sumData[0] / 100];
		$("#moneyInfoMainWindow").append($('<p id="totalFriendsSum" style="position:relative;">Total Friends Group Sum:  '+ sumData[3] +'</p>'));				$("#totalFriendsSum").css("top", 15);
		$("#totalFriendsSum").css("left",15);
		pieData[2] = ["Friends", sumData[3] * sumData[0] / 100];
		$("#moneyInfoMainWindow").append($('<p id="totalWorkSum" style="position:relative;">Total Work Group Sum:  '+ sumData[4] +'</p>'));
		$("#totalWorkSum").css("top", 15);
		$("#totalWorkSum").css("left",15);
		pieData[3] = ["Work", sumData[4] * sumData[0] / 100];
		$("#moneyInfoMainWindow").append($('<div id="groupPie" style="position:absolute;"/>'));
		$("#groupPie").css("width",mainFrameWidth / 2);
		$("#groupPie").css("height",mainFrameHeight  - 35);
		$("#groupPie").css("top", $("#totalSum").position().top);	
		$("#groupPie").css("left", $("#moneyInfoMainWindow").position().left + mainFrameWidth / 4 + 25 );
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
          showDataLabels: true
        }
      }, 
      legend: { show:true, location: 'e' }
    }
  );
}

$(document).ready(function() {

 $(".MoneyInfoDiv").click(function()
 {
	var screenWidth = document.documentElement.clientWidth;
	var screenHeight = document.documentElement.clientHeight;
	
	//creating window
	$("#canvas-div").append($('<div id="moneyInfoRectangle" class="MoneyInfoRectangle"/>'));
	$("#moneyInfoRectangle").animate({top:0,left:0,width:screenWidth,height:screenHeight});
	$("#moneyInfoRectangle").draggable( 'disable' );
	$("#canvas-div").append($('<div id="moneyInfoMainWindow" class="SimpleFrame"/>'));
	$("#moneyInfoMainWindow").animate({top:screenHeight / 2 - mainFrameHeight / 2,left:screenWidth / 2 - mainFrameWidth / 2,width:mainFrameWidth,height:mainFrameHeight});
	$("#moneyInfoMainWindow").draggable( 'disable' );
	$("#moneyInfoMainWindow").append($('<button id="moneyInfoCloseBtn" style="position:relative; background-color:red;" type="button">X</button>'));
	$("#moneyInfoCloseBtn").css("top", 15);
	$("#moneyInfoCloseBtn").css("left", mainFrameWidth - 50);
	$("#moneyInfoCloseBtn").bind('click', function() {
		$("#moneyInfoRectangle").animate({top:0,left:0,width:0,height:0},function(){$("#moneyInfoRectangle").remove();});
		$("#moneyInfoMainWindow").animate({top:0,left:0,width:0,height:0},function(){$("#moneyInfoMainWindow").remove();});
	}); 
	
	getFullMoneyInfo();
  });
}); 
 