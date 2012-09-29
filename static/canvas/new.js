var listTableElementString = '<li><label class="text_14_black">כמות: </label>&nbsp;&nbsp;<input type=text style="text-align:right; width:75px;" size=10 id="ElementSize" class="SizeSelect" maxlength="3" value="1">&nbsp;&nbsp;<label class="text_14_black">גודל: </label>&nbsp;&nbsp;<input type=text style="text-align:right; width:75px;" size=10  id="ElementAmount" class="AmountSelect" maxlength="2" value="4">&nbsp;&nbsp;<select class="tableShapeSelect"><option value="A" SELECTED>ריבוע<option value="B">עגול<option value="C">מלבן<option value="D">מעויין</select>&nbsp;&nbsp;<img align="middle" class="TableImg" src="/static/canvas/images/tables_small/SquareR.png" width="32" height="32"/>&nbsp;&nbsp;<img align="middle" class="RemoveBtn" src="/static/canvas/images/minus_n.png"/></li>';

var listTableDisabledElementString = '<li style="margin-top:5px; margin-left:59px"><label class="text_14_black">כמות: </label>&nbsp;&nbsp;<input type=text style="text-align:right; width:75px;" size=10 id="ElementSize" class="SizeSelect" maxlength="3" value="1" disabled="disabled">&nbsp;&nbsp;<label class="text_14_black">גודל: </label>&nbsp;&nbsp;<input type=text style="text-align:right; width:75px;" size=10  id="ElementAmount" class="AmountSelect" maxlength="2" value="4" disabled="disabled">&nbsp;&nbsp;<select class="tableShapeSelect" disabled="disabled"><option value="A" SELECTED>ריבוע<option value="B">עגול<option value="C">מלבן<option value="D">מעויין</select>&nbsp;&nbsp;<img align="middle" class="TableImg" src="/static/canvas/images/tables_small/SquareR.png" width="32" height="32"/></li>';

var maxSeated = 2001;
var canvasWidth = 1100;//1195;
var dataString = "";
var canPost = true;
var noneString = "none";
var sketchMode = false;
var maxElementCapacity = 24;


function getScreenWidthHeight()
{
	 var viewportwidth;
	 var viewportheight;
	  
	 // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
	  
	 if (typeof window.innerWidth != 'undefined')
	 {
		 if (document.body.scrollWidth > 0 && document.body.scrollHeight > 0)
		 {
		 	  viewportwidth = document.body.scrollWidth,
			  viewportheight = document.body.scrollHeight
		 }
		 else
		 {
			  viewportwidth = window.innerWidth,
			  viewportheight = window.innerHeight
		 }
	 }
	  
	// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
	 
	 else if (typeof document.documentElement != 'undefined'
		 && typeof document.documentElement.clientWidth !=
		 'undefined' && document.documentElement.clientWidth != 0)
	 {
	 	 if (document.body.scrollWidth > 0 && document.body.scrollHeight > 0)
		 {
		 	viewportwidth = document.body.scrollWidth,
			viewportheight = document.body.scrollHeight
		 }
		 else
		 {
		   viewportwidth = document.documentElement.clientWidth,
		   viewportheight = document.documentElement.clientHeight
		 }
	 }
	  
	 // older versions of IE
	  
	 else
	 {
	 	 if (document.body.scrollWidth > 0 && document.body.scrollHeight > 0)
		 {
		 	  viewportwidth = document.body.scrollWidth,
			  viewportheight = document.body.scrollHeight
		 }
		 else
		 {
		   viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
		   viewportheight = document.getElementsByTagName('body')[0].clientHeight
		 }
	 }
	return [viewportwidth,viewportheight];
}

function IsNumeric(sText)
{
   var ValidChars = "0123456789.";
   var IsNumber=true;
   var Char;

 
   for (i = 0; i < sText.length && IsNumber == true; i++) 
      { 
      Char = sText.charAt(i); 
      if (ValidChars.indexOf(Char) == -1) 
         {
         IsNumber = false;
         }
      }
   return IsNumber;
   
}

function noZeroData()
{
	var result = true;
	
	$("#TableTypeList > li").each(function(i) {
			
		var tableProperties = $(this).find('input');

		if (parseInt(tableProperties.last().val()) <= 0 || parseInt(tableProperties.first().val()) <= 0)
		{
			result = false;
			return false;
		}
	});
	
	return result;
}

function getAmount(li)
{
	var tableProperties = li.find('select');
	var amount;
	
	amount = parseInt(tableProperties.last().val());
	
	return amount;
}

function ReloadPage() { location.reload(); }

function DelayReload(time_wait)
{
	setTimeout("ReloadPage()", time_wait);
}

function getTotalAmount()
{
	var totalAmount = 0;
	var list = "TableTypeList > li";
	if (sketchMode)
	{
		list = "AutoTableTypeList > li";
	}
	$("#" + list).each(function(i) {
			
		var tableProperties = $(this).find('input');
		var amount;
	
		amount = parseInt(tableProperties.first().val());
		totalAmount = totalAmount + amount;
	});
	return totalAmount;
}

function getTotalSeat()
{
	var totalSize = 0;
	var list = "TableTypeList > li";
	if (sketchMode)
	{
		list = "AutoTableTypeList > li";
	}
	$("#" + list).each(function(i) {
			
		var tableProperties = $(this).find('input');
		var size;
	
		size = parseInt(tableProperties.first().val()) * parseInt(tableProperties.last().val());
		totalSize = totalSize + size;
	});
	return totalSize;
}

function getTotalSquareSeat()
{
	var totalSize = 0;
	var list = "TableTypeList > li";
	if (sketchMode)
	{
		list = "AutoTableTypeList > li";
	}
	$("#" + list).each(function(i) {
		
		var type =  $(this).find('select').first();
		
		if (type.val() == "A")
		{
			var tableProperties = $(this).find('input');
			var size;
	
			size = parseInt(tableProperties.first().val()) * parseInt(tableProperties.last().val());
			totalSize = totalSize + size;
		}
	});
	
	return totalSize;
}

function getSquareTotalAmount()
{
	var totalAmount = 0;
	var list = "TableTypeList > li";
	if (sketchMode)
	{
		list = "AutoTableTypeList > li";
	}
	$("#" + list).each(function(i) {
		
		var type =  $(this).find('select').first();
		
		if (type.val() == "A")
		{	
			var tableProperties = $(this).find('input');
			var amount;
		
			amount = parseInt(tableProperties.first().val());
			totalAmount = totalAmount + amount;
		}
	});
	
	return totalAmount;
}

function getTotalRoundSeat()
{
	var totalSize = 0;
	
	var list = "TableTypeList > li";
	if (sketchMode)
	{
		list = "AutoTableTypeList > li";
	}
	$("#" + list).each(function(i) {
		
		var type =  $(this).find('select').first();
		
		if (type.val() == "B")
		{
			var tableProperties = $(this).find('input');
			var size;
		
			size = parseInt(tableProperties.first().val()) * parseInt(tableProperties.last().val());
			totalSize = totalSize + size;
		}
	});
	
	return totalSize;
}

function getRoundTotalAmount()
{
	var totalAmount = 0;
	var list = "TableTypeList > li";
	if (sketchMode)
	{
		list = "AutoTableTypeList > li";
	}
	$("#" + list).each(function(i) {
		
	
		var type =  $(this).find('select').first();
		
		if (type.val() == "B")
		{
			var tableProperties = $(this).find('input');
			var amount;
	
			amount = parseInt(tableProperties.first().val());
			totalAmount = totalAmount + amount;
		}
	});
	
	return totalAmount;
}

function getTotalRectSeat()
{
	var totalSize = 0;
	
	var list = "TableTypeList > li";
	if (sketchMode)
	{
		list = "AutoTableTypeList > li";
	}
	$("#" + list).each(function(i) {
		
		var type =  $(this).find('select').first();
		
		if (type.val() == "C")
		{
			var tableProperties = $(this).find('input');
			var size;

			size = parseInt(tableProperties.first().val()) * parseInt(tableProperties.last().val());
			totalSize = totalSize + size;
		}
	});
	
	return totalSize;
}

function getRectTotalAmount()
{
	var totalAmount = 0;
	var list = "TableTypeList > li";
	if (sketchMode)
	{
		list = "AutoTableTypeList > li";
	}
	$("#" + list).each(function(i) {
		
		var type =  $(this).find('select').first();
		
		if (type.val() == "C")
		{
			var tableProperties = $(this).find('input');
			var amount;
		
			amount = parseInt(tableProperties.first().val());
			totalAmount = totalAmount + amount;
		}
	});
	
	return totalAmount;
}

function getTotalLozengeSeat()
{
	var totalSize = 0;
	
	var list = "TableTypeList > li";
	if (sketchMode)
	{
		list = "AutoTableTypeList > li";
	}
	$("#" + list).each(function(i) {
		
		var type =  $(this).find('select').first();
		
		if (type.val() == "D")
		{
			var tableProperties = $(this).find('input');
			var size;
		
			size = parseInt(tableProperties.first().val()) * parseInt(tableProperties.last().val());
			totalSize = totalSize + size;
		}
	});
	
	return totalSize;
}

function getLozengeTotalAmount()
{
	var totalAmount = 0;
	var list = "TableTypeList > li";
	if (sketchMode)
	{
		list = "AutoTableTypeList > li";
	}
	$("#" + list).each(function(i) {
		
		
		var type =  $(this).find('select').first();
		
		if (type.val() == "D")
		{
			var tableProperties = $(this).find('input');
			var amount;
		
			amount = parseInt(tableProperties.first().val());
			totalAmount = totalAmount + amount;
		}
	});
	
	return totalAmount;
}

function removeLiParent(li)
{
	li.parent().remove();
	if ($("#TableTypeList > li").size() <= maxSeated)
	{
		$("#AddLi").attr("src","/static/canvas/images/pluse_n.png");
	}
	updateCounters();
}

function createElementByLi(li, type, cordx, cordy)
{
	var tableProperties = li.find('input');
	var amount,size,kind;
	
	if (type == "A")
	{
		kind = "Square";
	}
	else if (type == "B")
	{
		kind = "Round";
	}
	else if (type == "C")
	{
		kind = "Rect";
	}
	else if (type == "D")
	{
		kind = "Lozenge";
	}
	size  = parseInt(tableProperties.last().val()); 
	amount = parseInt(tableProperties.first().val());
		 
	dataString = dataString + kind + ',' + amount + ',' + size + ',' + cordx + ',' + cordy + ',90' + ',90' + '|';
}

function postDataString()
{
	$.post('/canvas/new/', {DataString: dataString},
	function(data){
		if (data.status == 'OK')
		{
			//$.post('/canvas/edit/', {});
			//ShowHourGlassWaitingWindow(true);
			location.reload();
		}
      }, 'json');
}

function updateCounters()
{
	$("#tableCounter").text(getTotalAmount());
	$("#personCounter").text(getTotalSeat());
	$("#roundSum").text(getRoundTotalAmount());
	$("#roundSeatAmount").text(getTotalRoundSeat());
	$("#squareSum").text(getSquareTotalAmount());
	$("#squareSeatAmount").text(getTotalSquareSeat());
	$("#rectSum").text(getRectTotalAmount());
	$("#rectSeatAmount").text(getTotalRectSeat());
	$("#lozengeSum").text(getLozengeTotalAmount());
	$("#lozengeSeatAmount").text(getTotalLozengeSeat());
	$("#errorMsg").text("");
}

function mouseOverRemoveBtn(element)
{
	element.attr('src',"/static/canvas/images/minus_r.png");
}

function mouseOutRemoveBtn(element)
{
	element.attr('src',"/static/canvas/images/minus_n.png");
}

function tableShapeChange(element)
{
	if (element.val() == "A")
	{
		element.parent().find('img').first().attr('src',"/static/canvas/images/tables_small/SquareR.png");
	}
	else if (element.val() == "B")
	{
		element.parent().find('img').first().attr('src',"/static/canvas/images/tables_small/RoundR.png");
	}
	else if (element.val() == "C")
	{
		element.parent().find('img').first().attr('src',"/static/canvas/images/tables_small/RectR.png");
	}
	else if (element.val() == "D")
	{
		element.parent().find('img').first().attr('src',"/static/canvas/images/tables_small/LozengeR.png");
	}
 }
 
function insureNumInput(event)
{
	// Allow only backspace and delete and Enter
	if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 13) {
		// let it happen, don't do anything
	}
	else {
		// Ensure that it is a number and stop the keypress
		if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
			event.preventDefault(); 
		}   
	}
}

function insertUserElements()
{
	if (canvasDataString != "")
	{
		var canvasCurrentData = canvasDataString.split("|", numOfRows)
		
		for (var i = 0; i < numOfRows; i++)
		{
			if (canvasCurrentData[i] != "")
			{
				var row = canvasCurrentData[i].split(",", 3);
					
				var kindColumn = row[0];
				var amountColumn = row[1];
				var sizeColumn = row[2];
				
				if (kindColumn != "" && amountColumn != "" && sizeColumn != "")
				{
					$("#TableTypeList").append(listTableDisabledElementString);
					if (kindColumn == "Square")
					{
						$("#TableTypeList > li").last().find('select').first().val("A");
						$("#TableTypeList > li").last().find('img').first().attr('src',"/static/canvas/images/tables_small/SquareR.png");				}
					else if (kindColumn == "Round")
					{
						$("#TableTypeList > li").last().find('select').first().val("B");
						$("#TableTypeList > li").last().find('img').first().attr('src',"/static/canvas/images/tables_small/RoundR.png");				}
					else if (kindColumn == "Rect")
					{					
						$("#TableTypeList > li").last().find('select').first().val("C");
						$("#TableTypeList > li").last().find('img').first().attr('src',"/static/canvas/images/tables_small/RectR.png");
					}
					else if (kindColumn == "Lozenge")
					{
						$("#TableTypeList > li").last().find('select').first().val("D");
						$("#TableTypeList > li").last().find('img').first().attr('src',"/static/canvas/images/tables_small/LozengeR.png");
					}
					$("#TableTypeList > li").last().find('input').first().val(sizeColumn);
					$("#TableTypeList > li").last().find('input').last().val(amountColumn);
				}
			}
		}
		$("#automaticAddDiv").css("display","none");
		updateCounters();
	}
	
	if (alreadyHasBar)
	{
		$("#barAppoval").attr("checked","checked");
		$("#barAppoval").attr("disabled","disabled");
	}
	if (alreadyHasDance)
	{
		$("#danceStandAppoval").attr("checked","checked");
		$("#danceStandAppoval").attr("disabled","disabled");
	}
	if (alreadyHasDj)
	{
		$("#djStandAppoval").attr("checked","checked");
		$("#djStandAppoval").attr("disabled","disabled");
	}
}

function loadFileToElement(filename)
{
    var xmlHTTP = new XMLHttpRequest();
    try
    {
    xmlHTTP.open("GET", filename, false);
    xmlHTTP.send(null);
    }
    catch (e) {
		showLightMsg("בעיה בשימוש סקיצה","בעיה בטעינת הסקיצה יש ליצור קשר לפתרון הבעיה.","OK","Notice");
        return;
    }

    return xmlHTTP.responseText;
}

$(document).ready(function(){

  $("#Sketches").change(function(){
	 if ($("#Sketches").val() != noneString)
	 {
		 var xmlText = loadFileToElement("/static/canvas/Sketches/" + $("#Sketches").val() + ".xml");
		 
		 if (xmlText != "" && xmlText != null)
		 {
		 	dataString = "";
			$("#AutoTableTypeList").empty();
			$("#automaticList").css("display","block");
			$("#barAppovalAuto").attr("checked","");
			$("#danceStandAppovalAuto").attr("checked","");
			$("#djStandAppovalAuto").attr("checked","");
		 	$("#manualAddDiv").css("display","none");
			var numOfTables = parseInt($(xmlText).find('Total').text());
			var dataOfTables = parseInt($(xmlText).find('DataNum').text());
			
			if (numOfTables > 0 && dataOfTables > 0)
			{
				dataString = "";
				for (var i = 1; i < numOfTables + 1; i++) {
				
					var type,amount,size,kind,cordx,cordy;
					
					cordx = $(xmlText).find('X' + i).text(); 
					cordy = $(xmlText).find('Y' + i).text(); 
					type = $(xmlText).find('Kind' + i).text();
					
					if (type == "A")
					{
						kind = "Square";
					}
					else if (type == "B")
					{
						kind = "Round";
					}
					else if (type == "C")
					{
						kind = "Rect";
					}
					else if (type == "D")
					{
						kind = "Lozenge";
					}
					else
					{
						kind = type;
					}
					
					var width = 90 + (8 - maxElementCapacity) * 2;
					var height = 90 + (8 - maxElementCapacity) * 2;
							
					if (kind.indexOf("Rect") > -1)
					{
						height = height + 16;
					}
					else if (kind == "dance_stand")
					{
						width = 64;
						height = 64;
						$("#djStandAppovalAuto").attr("checked","checked");
					}
					else if (kind ==  "bar_stand") 
					{
						width = 64;
						height = 64;
						$("#barAppovalAuto").attr("checked","checked");
					}
					else if (kind ==  "dj_stand") 
					{
						width = 64;
						height = 64;
						$("#danceStandAppovalAuto").attr("checked","checked");
					}
					
					size  = $(xmlText).find('Size' + i).text(); 
					amount = 1;
					dataString = dataString + kind + ',' + amount + ',' + size + ',' + cordx + ',' + cordy + ',' + width + ',' + height + '|';
				}
				
				for (var i = 1; i < dataOfTables + 1; i++)
				{
					var rowData = $(xmlText).find('Row' + i).text(); 
					
					var rowArray = rowData.split(",", 3);

					$("#AutoTableTypeList").append(listTableDisabledElementString);
					$("#AutoTableTypeList > li").last().find('select').first().val(rowArray[2]);
					$("#AutoTableTypeList > li").last().find('input').first().val(rowArray[0]);
					$("#AutoTableTypeList > li").last().find('input').last().val(rowArray[1]);
					if (rowArray[2] == "A")
					{
						$("#AutoTableTypeList > li").last().find('img').first().attr('src',"/static/canvas/images/tables_small/SquareR.png");
					}
					else if (rowArray[2] == "B")
					{
						$("#AutoTableTypeList > li").last().find('img').first().attr('src',"/static/canvas/images/tables_small/RoundR.png");
					}
					else if (rowArray[2] == "C")
					{
						$("#AutoTableTypeList > li").last().find('img').first().attr('src',"/static/canvas/images/tables_small/RectR.png");
					}
					else if (rowArray[2] == "D")
					{
						$("#AutoTableTypeList > li").last().find('img').first().attr('src',"/static/canvas/images/tables_small/LozengeR.png");
					}
				}
				sketchMode = true;
				updateCounters();
			}					
			else
			{
				showLightMsg("בעיה בשימוש סקיצה","בעיה בטעינת הסקיצה יש ליצור קשר לפתרון הבעיה.","OK","Notice");
			}
		 }
		 else
		 {
			showLightMsg("בעיה בשימוש סקיצה","בעיה בטעינת הסקיצה יש ליצור קשר לפתרון הבעיה.","OK","Notice");
		 }
	}
	else
	{
		sketchMode = false;
		dataString = "";
		$("#AutoTableTypeList").empty();
		$("#automaticList").css("display","none");
		$("#manualAddDiv").css("display","block");
		updateCounters();
	}
  });

  $(".AddBtn").mouseover(function(){
	$(this).attr('src',"/static/canvas/images/pluse_r.png");
  });
  $(".AddBtn").mouseout(function(){
	$(this).attr('src',"/static/canvas/images/pluse_n.png");
  });
  
  $("#CanvasEditButton").mouseover(function(){
	$(this).attr('src',"/static/canvas/images/continue_r.png");
  });
  $("#CanvasEditButton").mouseout(function(){
	$(this).attr('src',"/static/canvas/images/continue_n.png");
  });
  
  $("#TableTypeList").after(function() { /*$(this).append(listTableElementString);
		$("#TableTypeList > li").last().find('img').last().bind('click',function(){ removeLiParent($(this)); });
		$("#TableTypeList > li").last().find('img').last().bind('mouseover',function(){ mouseOverRemoveBtn($(this)); });
		$("#TableTypeList > li").last().find('img').last().bind('mouseout',function(){ mouseOutRemoveBtn($(this)); });
		$("#TableTypeList > li").last().find('select').first().bind('change',function(){ tableShapeChange($(this)); });*/
  });
  
  $(document).after(function(){
	$.post('/canvas/edit/', {});
	$("#Sketches").val(noneString);
	if ($("#TableTypeList > li").size() > 0 || getTotalAmount() > 0 || getTotalSeat() > 0)
	{
		$("#automaticAddDiv").css("display","none");
	}
	otherScreen = "newbody";
  });
  
  $("#AddLi").click(function() {
  		if ($("#TableTypeList > li").size() <= maxSeated)
		{
			$("#TableTypeList").append(listTableElementString);
			$("#TableTypeList > li").last().find('img').last().bind('click',function(){ removeLiParent($(this)); });
			$("#TableTypeList > li").last().find('img').last().bind('mouseover',function(){ mouseOverRemoveBtn($(this)); });
			$("#TableTypeList > li").last().find('img').last().bind('mouseout',function(){ mouseOutRemoveBtn($(this)); });
			$("#TableTypeList > li").last().find('select').first().bind('change',function(){ tableShapeChange($(this)); updateCounters(); });
			$("#TableTypeList > li").last().find('input').first().bind('change',function(){  if (!IsNumeric($(this).val())){$(this).val(1)} updateCounters(); });
			$("#TableTypeList > li").last().find('input').last().bind('change',function(){ if (IsNumeric($(this).val())) {if ($(this).val() > 24){ $(this).val(24) } else if ($(this).val() < 4) { $(this).val(4)}} else { $(this).val(4) } updateCounters(); });
			$("#TableTypeList > li").last().find('input').first().bind('keydown',function(event){ insureNumInput(event); });
			$("#TableTypeList > li").last().find('input').last().bind('keydown',function(event){  insureNumInput(event); });
			if ($("#TableTypeAList > li").size() > maxSeated)
			{
				$("#AddLiA").attr("src","/static/canvas/images/addDisable.png");
			}
			updateCounters();
		}
   }); 
   
  $(".RemoveBtn").mouseup(function() {
		removeLiParent($(this));
  });
  
  //$(".AmountSelect").change(function() {updateCounters();});
  //$(".SizeSelect").change(function() {updateCounters();});

  $("#CanvasEditButton").click(function() {  
	   var noZeroDataFlag = noZeroData();
	   
	   if (sketchMode)
	   {
			if ($("#AutoTableTypeList > li").size()  > 0)
			{
			   if (canPost)
			   {
			   		canPost = false;
					postDataString();
			   }
			}
			else
			{
			   	$("#errorMsg").text("ישנה בעיה בטעינת הסקיצה יש לצור עימנו קשר או להמשיך ללא סקיצה בעזרת הוספה ידינת.");
			}
	   }
	   else
	   {
		   if ($("#TableTypeList > li").size() > 0 && getTotalAmount() > 0 && getTotalSeat() < maxSeated  && getTotalSeat() > 0 && noZeroDataFlag)
		   {
			   if (canPost)
			   {
				   canPost = false;
				   $("#CanvasEditButton").unbind('click');
				   writeOccasionInfo("Init Canvas");
				   $("#errorMsg").text("");
				   $("#TableTypeList > li").slice(parseInt(numOfRows)).each(function(i) {
						var type =  $(this).find('select').first().val();
						
						createElementByLi($(this),type,0,0);
					});
					
					if ($("#barAppoval").attr('checked') && !alreadyHasBar)
					{
						dataString = dataString + 'bar_stand,1,8,0,0,64,64|';
					}
					if ($("#danceStandAppoval").attr('checked') && !alreadyHasDance)
					{
						dataString = dataString + 'dance_stand,1,8,0,0,64,64|';
					}
					if ($("#djStandAppoval").attr('checked') && !alreadyHasDj)
					{
						dataString = dataString + 'dj_stand,1,8,0,0,64,64|';
					}
					
					postDataString();
				}
			}
			else
			{
				if (getTotalAmount() <= 0 && getTotalSeat() <= 0)
				{
					$("#errorMsg").text("יש להוסיף שולחנות לפני המשך לעריכת האירוע");
				}
				else if (getTotalSeat() > maxSeated - 1)
				{
					$("#errorMsg").text("יש למתן את כמות השולחנות או המוזמנים.");
				}
				else if (noZeroDataFlag)
				{
					$("#errorMsg").text("אחד מהנתונים הינו מאופס.");
				}
			}
		}
    });
});

$(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});

