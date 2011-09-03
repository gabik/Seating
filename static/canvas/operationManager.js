var mainFrameWidthOM = 650;
var mainFrameHeightOM = 375;
	
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
							$("#OperationList").append($('<li><p class="OperationItem">'+OpData.opnum+'. '+OpData.date+' '+OpData.info +'</p></li>'));
						}
					}, 'json');
				}
			}
		}
	}, 'json');
}

$(document).ready(function(){
	var screenWidth = document.documentElement.clientWidth;
	var screenHeight = document.documentElement.clientHeight;
	
	
  $(".OperationsInfoDiv").click(function()
  {
	//creating window
	$("#canvas-div").append($('<div id="OperationsInfoRectangle" class="BlackOverlayRectangle"/>'));
	$("#OperationsInfoRectangle").animate({top:0,left:0,width:screenWidth,height:screenHeight});
	$("#OperationsInfoRectangle").draggable( 'disable' );
	$("#canvas-div").append($('<div id="OperationsInfoMainWindow" class="SimpleFrame"/>'));
	$("#OperationsInfoMainWindow").animate({top:screenHeight / 2 - mainFrameHeightOM / 2,left:screenWidth / 2 - mainFrameWidthOM / 2,width:mainFrameWidthOM,height:mainFrameHeightOM},function(){ buildOccasionInfo() });
	$("#OperationsInfoMainWindow").draggable( 'disable' );
		$("#OperationsInfoMainWindow").append($('<button id="OccasionFinishCloseBtn" style="position:relative; background-color:red;" type="button">X</button>'));
	$("#OccasionFinishCloseBtn").css("top", 15);
	$("#OccasionFinishCloseBtn").css("left", mainFrameWidthOM - 50);
	$("#OccasionFinishCloseBtn").bind('click', function() {
		$("#OperationsInfoRectangle").animate({top:0,left:0,width:0,height:0},function(){$("#OperationsInfoRectangle").remove();});
		$("#OperationsInfoMainWindow").animate({top:0,left:0,width:0,height:0},function(){$("#OperationsInfoMainWindow").remove(); 
		});
	}); 
	$("#OperationsInfoMainWindow").append($('<ul id="OperationList"/>'));
  });
});

