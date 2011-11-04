var listTableElementString = '<li><label class="text_black">גודל: </label>&nbsp;&nbsp;<select size="1" id="ElementSize" class="SizeSelect"><option value="4">4<option value="5">5<option value="6">6<option value="7">7<option value="8">8<option value="9">9<option value="10">10<option value="11">11<option value="12">12<option value="13">13<option value="14">14<option value="15">15<option value="16">16<option value="17">17<option value="18">18<option value="19">19<option value="20">20<option value="21">21<option value="22">22</select>&nbsp;&nbsp;<label class="text_black">כמות: </label>&nbsp;&nbsp;<select size="1" id="ElementAmount" class="AmountSelect"><option value="1" SELECTED>1<option value="2">2<option value="3">3<option value="4">4<option value="5">5<option value="6">6<option value="7">7<option value="8">8<option value="9">9</select>&nbsp;&nbsp;<img class="RemoveBtn" src="/static/canvas/images/-table_only_n.png"/></li>';

var maxItemsPerKind = 100;
var canvasWidth = 1100;//1195;
var dataString = "";

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
	$("#TableTypeAList > li").each(function(i) {
			
		var tableProperties = $(this).find('select');
		var amount;
	
		amount = parseInt(tableProperties.last().val());
		totalAmount = totalAmount + amount;
	});
	$("#TableTypeBList > li").each(function(i) {
			
		var tableProperties = $(this).find('select');
		var amount;
	
		amount = parseInt(tableProperties.last().val());
		totalAmount = totalAmount + amount;
	});
	$("#TableTypeCList > li").each(function(i) {
			
		var tableProperties = $(this).find('select');
		var amount;
	
		amount = parseInt(tableProperties.last().val());
		totalAmount = totalAmount + amount;
	});
	$("#TableTypeDList > li").each(function(i) {
			
		var tableProperties = $(this).find('select');
		var amount;
	
		amount = parseInt(tableProperties.last().val());
		totalAmount = totalAmount + amount;
	});
	return totalAmount;
}

function getTotalSeat()
{
	var totalSize = 0;
	$("#TableTypeAList > li").each(function(i) {
			
		var tableProperties = $(this).find('select');
		var size;
	
		size = parseInt(tableProperties.first().val()) * parseInt(tableProperties.last().val());
		totalSize = totalSize + size;
	});
	$("#TableTypeBList > li").each(function(i) {
			
		var tableProperties = $(this).find('select');
		var size;
	
		size = parseInt(tableProperties.first().val()) * parseInt(tableProperties.last().val());
		totalSize = totalSize + size;
	});
	$("#TableTypeCList > li").each(function(i) {
			
		var tableProperties = $(this).find('select');
		var size;
	
		size = parseInt(tableProperties.first().val()) * parseInt(tableProperties.last().val());
		totalSize = totalSize + size;
	});
	$("#TableTypeDList > li").each(function(i) {
			
		var tableProperties = $(this).find('select');
		var size;
	
		size = parseInt(tableProperties.first().val()) * parseInt(tableProperties.last().val());
		totalSize = totalSize + size;
	});
	return totalSize;
}

function getTotalSquareSeat()
{
	var totalSize = 0;
	
	$("#TableTypeAList > li").each(function(i) {
			
		var tableProperties = $(this).find('select');
		var size;
	
		size = parseInt(tableProperties.first().val()) * parseInt(tableProperties.last().val());
		totalSize = totalSize + size;
	});
	
	return totalSize;
}

function getSquareTotalAmount()
{
	var totalAmount = 0;
	$("#TableTypeAList > li").each(function(i) {
			
		var tableProperties = $(this).find('select');
		var amount;
	
		amount = parseInt(tableProperties.last().val());
		totalAmount = totalAmount + amount;
	});
	
	return totalAmount;
}

function getTotalRoundSeat()
{
	var totalSize = 0;
	
	$("#TableTypeBList > li").each(function(i) {
			
		var tableProperties = $(this).find('select');
		var size;
	
		size = parseInt(tableProperties.first().val()) * parseInt(tableProperties.last().val());
		totalSize = totalSize + size;
	});
	
	return totalSize;
}

function getRoundTotalAmount()
{
	var totalAmount = 0;
	$("#TableTypeBList > li").each(function(i) {
			
		var tableProperties = $(this).find('select');
		var amount;
	
		amount = parseInt(tableProperties.last().val());
		totalAmount = totalAmount + amount;
	});
	
	return totalAmount;
}

function getTotalRectSeat()
{
	var totalSize = 0;
	
	$("#TableTypeCList > li").each(function(i) {
			
		var tableProperties = $(this).find('select');
		var size;
	
		size = parseInt(tableProperties.first().val()) * parseInt(tableProperties.last().val());
		totalSize = totalSize + size;
	});
	
	return totalSize;
}

function getRectTotalAmount()
{
	var totalAmount = 0;
	$("#TableTypeCList > li").each(function(i) {
			
		var tableProperties = $(this).find('select');
		var amount;
	
		amount = parseInt(tableProperties.last().val());
		totalAmount = totalAmount + amount;
	});
	
	return totalAmount;
}

function getTotalLozengeSeat()
{
	var totalSize = 0;
	
	$("#TableTypeDList > li").each(function(i) {
			
		var tableProperties = $(this).find('select');
		var size;
	
		size = parseInt(tableProperties.first().val()) * parseInt(tableProperties.last().val());
		totalSize = totalSize + size;
	});
	
	return totalSize;
}

function getLozengeTotalAmount()
{
	var totalAmount = 0;
	$("#TableTypeDList > li").each(function(i) {
			
		var tableProperties = $(this).find('select');
		var amount;
	
		amount = parseInt(tableProperties.last().val());
		totalAmount = totalAmount + amount;
	});
	
	return totalAmount;
}

function removeLiParent(li)
{
	li.parent().remove();
	if ($("#TableTypeDList > li").size() <= maxItemsPerKind)
	{
		$("#AddLiD").attr("src","/static/canvas/images/+table_n.png");
	}
	if ($("#TableTypeCList > li").size() <= maxItemsPerKind)
	{
		$("#AddLiC").attr("src","/static/canvas/images/+table_n.png");
	}
	if ($("#TableTypeBList > li").size() <= maxItemsPerKind)
	{
		$("#AddLiB").attr("src","/static/canvas/images/+table_n.png");
	}
	if ($("#TableTypeAList > li").size() <= maxItemsPerKind)
	{
		$("#AddLiA").attr("src","/static/canvas/images/+table_n.png");
	}
	updateCounters();
}

function createElementByLi(li, type, cordx, cordy)
{
	var tableProperties = li.find('select');
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
	size  = parseInt(tableProperties.first().val()); 
	amount = parseInt(tableProperties.last().val());
		 
	dataString = dataString + kind + ',' + amount + ',' + size + ',' + cordx + ',' + cordy + '|';
}

function postDataString()
{
	$.post('/canvas/new/', {DataString: dataString},
	function(data){
		if (data.status == 'OK')
		{
			$.post('/canvas/edit/', {});
			//ShowHourGlassWaitingWindow(true);
			location.reload();
		}
      }, 'json');
}

function updateCounters()
{
	document.getElementById("TableCounter").innerHTML = getTotalAmount();
	document.getElementById("PersonCounter").innerHTML = getTotalSeat();
	document.getElementById("roundSum").innerHTML = getRoundTotalAmount();
	document.getElementById("roundSeatAmount").innerHTML = getTotalRoundSeat();
	document.getElementById("squareSum").innerHTML = getSquareTotalAmount();
	document.getElementById("squareSeatAmount").innerHTML = getTotalSquareSeat();
	document.getElementById("rectSum").innerHTML = getRectTotalAmount();
	document.getElementById("rectSeatAmount").innerHTML = getTotalRectSeat();
	document.getElementById("lozengeSum").innerHTML = getLozengeTotalAmount();
	document.getElementById("lozengeSeatAmount").innerHTML = getTotalLozengeSeat();
}

function mouseOverRemoveBtn(element)
{
	element.attr('src',"/static/canvas/images/-table_only_r.png");
}

function mouseOutRemoveBtn(element)
{
	element.attr('src',"/static/canvas/images/-table_only_n.png");
}


$(document).ready(function(){

  $("#MainFrameTableTypeA").addClass('TableTypeA');
  $("#MainFrameTableTypeB").addClass('TableTypeB');
  $("#MainFrameTableTypeB").addClass('TableTypeC');
  
  $(".AddBtn").mouseover(function(){
	$(this).attr('src',"/static/canvas/images/+table_r.png");
  });
  $(".AddBtn").mouseout(function(){
	$(this).attr('src',"/static/canvas/images/+table_n.png");
  });
  
  $("#CanvasEditButton").mouseover(function(){
	$(this).attr('src',"/static/canvas/images/continue_r.png");
  });
  $("#CanvasEditButton").mouseout(function(){
	$(this).attr('src',"/static/canvas/images/continue_n.png");
  });
  
  $("#TableTypeAList").after(function() { $(this).append(listTableElementString);
  		$(this).find('img').bind('mouseover',function(){ mouseOverRemoveBtn($(this)); });
		$(this).find('img').bind('mouseout',function(){ mouseOutRemoveBtn($(this)); });
		document.getElementById("squareSum").innerHTML = getSquareTotalAmount();
		document.getElementById("squareSeatAmount").innerHTML = getTotalSquareSeat();
  });
  $("#TableTypeBList").after(function() { $(this).append(listTableElementString); 
		$(this).find('img').bind('mouseover',function(){ mouseOverRemoveBtn($(this)); });
		$(this).find('img').bind('mouseout',function(){ mouseOutRemoveBtn($(this)); });
		document.getElementById("roundSum").innerHTML = getRoundTotalAmount();
		document.getElementById("roundSeatAmount").innerHTML = getTotalRoundSeat();
  });
  $("#TableTypeCList").after(function() { $(this).append(listTableElementString); 
		$(this).find('img').bind('mouseover',function(){ mouseOverRemoveBtn($(this)); });
		$(this).find('img').bind('mouseout',function(){ mouseOutRemoveBtn($(this)); });
		document.getElementById("rectSum").innerHTML = getRectTotalAmount();
		document.getElementById("rectSeatAmount").innerHTML = getTotalRectSeat();
  });
  $("#TableTypeDList").after(function() { $(this).append(listTableElementString); 
		$(this).find('img').bind('mouseover',function(){ mouseOverRemoveBtn($(this)); });
		$(this).find('img').bind('mouseout',function(){ mouseOutRemoveBtn($(this)); });
		document.getElementById("lozengeSum").innerHTML = getLozengeTotalAmount();
		document.getElementById("lozengeSeatAmount").innerHTML = getTotalLozengeSeat();
  });
  updateCounters();
  
  $(document).after(function(){
	$.post('/canvas/edit/', {});
  });
  
  
  $("#AddLiA").click(function() {
  		if ($("#TableTypeAList > li").size() <= maxItemsPerKind)
		{
			$("#TableTypeAList").append(listTableElementString);
			$("#TableTypeAList > li").last().find('img').bind('click',function(){ removeLiParent($(this)); });
			$("#TableTypeAList > li").last().find('img').bind('mouseover',function(){ mouseOverRemoveBtn($(this)); });
			$("#TableTypeAList > li").last().find('img').bind('mouseout',function(){ mouseOutRemoveBtn($(this)); });
			$("#TableTypeAList > li").last().find('select').first().bind('change',function(){ updateCounters(); });
			$("#TableTypeAList > li").last().find('select').last().bind('change',function(){ updateCounters(); });
			if ($("#TableTypeAList > li").size() > maxItemsPerKind)
			{
				$("#AddLiA").attr("src","/static/canvas/images/addDisable.png");
			}
			updateCounters();
		}
   }); 
   
  $("#AddLiB").click(function() {
		if ($("#TableTypeBList > li").size() <= maxItemsPerKind)
		{
			$("#TableTypeBList").append(listTableElementString);
			$("#TableTypeBList > li").last().find('img').bind('click',function(){ removeLiParent($(this)); });
			$("#TableTypeBList > li").last().find('img').bind('mouseover',function(){ mouseOverRemoveBtn($(this)); });
			$("#TableTypeBList > li").last().find('img').bind('mouseout',function(){ mouseOutRemoveBtn($(this)); });
			$("#TableTypeBList > li").last().find('select').first().bind('change',function(){ updateCounters(); });
			$("#TableTypeBList > li").last().find('select').last().bind('change',function(){ updateCounters(); });
			if ($("#TableTypeBList > li").size() > maxItemsPerKind)
			{
				$("#AddLiB").attr("src","/static/canvas/images/addDisable.png");
			}
			updateCounters();
		}
   });
   
   $("#AddLiC").click(function() {
		if ($("#TableTypeCList > li").size() <= maxItemsPerKind)
		{
			$("#TableTypeCList").append(listTableElementString);
			$("#TableTypeCList > li").last().find('img').bind('click',function(){ removeLiParent($(this)); });
			$("#TableTypeCList > li").last().find('img').bind('mouseover',function(){ mouseOverRemoveBtn($(this)); });
			$("#TableTypeCList > li").last().find('img').bind('mouseout',function(){ mouseOutRemoveBtn($(this)); });
			$("#TableTypeCList > li").last().find('select').first().bind('change',function(){ updateCounters(); });
			$("#TableTypeCList > li").last().find('select').last().bind('change',function(){ updateCounters(); });
			if ($("#TableTypeCList > li").size() > maxItemsPerKind)
			{
				$("#AddLiC").attr("src","/static/canvas/images/addDisable.png");
			}
			updateCounters();
		}
   });
   
   $("#AddLiD").click(function() {
		if ($("#TableTypeDList > li").size() <= maxItemsPerKind)
		{
			$("#TableTypeDList").append(listTableElementString);
			$("#TableTypeDList > li").last().find('img').bind('click',function(){ removeLiParent($(this)); });
			$("#TableTypeDList > li").last().find('img').bind('mouseover',function(){ mouseOverRemoveBtn($(this)); });
			$("#TableTypeDList > li").last().find('img').bind('mouseout',function(){ mouseOutRemoveBtn($(this)); });
			$("#TableTypeDList > li").last().find('select').first().bind('change',function(){ updateCounters(); });
			$("#TableTypeDList > li").last().find('select').last().bind('change',function(){ updateCounters(); });
			if ($("#TableTypeDList > li").size() > maxItemsPerKind)
			{
				$("#AddLiD").attr("src","/static/canvas/images/addDisable.png");
			}
			updateCounters();
		}
   });
   
  $(".RemoveBtn").mouseup(function() {
		removeLiParent($(this));
  });
  
  $(".AmountSelect").change(function() {updateCounters();});
  $(".SizeSelect").change(function() {updateCounters();});

  $("#CanvasEditButton").click(function() {
	   var cordx = 30;
	   var cordy = 43;
	   var startY = 43;
	   var startX = 20;
	   var xOffset = 110;
	   var yOffset = 36;
	   
	   if ($("#TableTypeAList > li").size() > 0 || $("#TableTypeBList > li").size() > 0)
	   {
		   writeOccasionInfo("Init Canvas");
		   
		   $("#TableTypeAList > li").each(function(i) {
						
				if (cordx >= canvasWidth)
				{
					cordx = startX;
				}
				if (i % 2 == 0)
				{
					cordy = startY; 
				}
				else
				{
						var elementIndex = i - 1;
						
						if (elementIndex < 0)
						{
							elementIndex = 0;
						}
												
						var valueAmount = getAmount($("#TableTypeAList > li:eq("+elementIndex+")"));
							
						cordy = cordy + (valueAmount < 5 ? (valueAmount + 2) * yOffset : valueAmount * yOffset);
				}
				
				createElementByLi($(this),"A",cordx,cordy);
				
				if (i % 2 != 0)
				{
					cordx = cordx + xOffset;
				}
			});
			
			var fromEven = false;
			
			if ($("#TableTypeAList > li").size() % 2 == 0)
			{
				fromEven = true;
			}

			$("#TableTypeBList > li").each(function(i) {
				
				if (cordx >= canvasWidth)
				{
					cordx = startX;
				}
				if (fromEven)
				{
					if (i % 2 == 0)
					{
						cordy = startY; 
					}
					else
					{
						if (i == 0)
						{
							var valueAmount = getAmount($("#TableTypeAList > li").last());
							
							cordy = cordy + (valueAmount < 5 ? (valueAmount + 2) * yOffset : valueAmount * yOffset);
						}
						else
						{
							var elementIndex = i - 1;
							
							if (elementIndex < 0)
							{
								elementIndex = 0;
							}
							
							var valueAmount = getAmount($("#TableTypeBList > li:eq("+elementIndex+")"));
							
							cordy = cordy + (valueAmount < 5 ? (valueAmount + 2) * yOffset : valueAmount * yOffset);
						}
					}
				}
				else
				{
					if (i % 2 != 0)
					{
						cordy = startY; 
					}
					else
					{
						if (i == 0)
						{
							var valueAmount = getAmount($("#TableTypeAList > li").last());
							
							cordy = cordy + (valueAmount < 5 ? (valueAmount + 2) * yOffset : valueAmount * yOffset);
						}
						else
						{
							var elementIndex = i - 1;
							
							if (elementIndex < 0)
							{
								elementIndex = 0;
							}
							
							var valueAmount = getAmount($("#TableTypeBList > li:eq("+elementIndex+")"));
							
							cordy = cordy + (valueAmount < 5 ? (valueAmount + 2) * yOffset : valueAmount * yOffset);
						}
					}
				}
				createElementByLi($(this),"B",cordx,cordy);
				
				if (fromEven)
				{
					if (i % 2 != 0)
					{
						cordx = cordx + xOffset;
					}
				}
				else
				{
					if (i % 2 == 0)
					{
						cordx = cordx + xOffset;
					}
				}
			});
			
			fromEven = false;
			
			if ($("#TableTypeBList > li").size() % 2 == 0)
			{
				fromEven = true;
			}
			
			$("#TableTypeCList > li").each(function(i) {
				
				if (cordx >= canvasWidth)
				{
					cordx = startX;
				}
				if (fromEven)
				{
					if (i % 2 == 0)
					{
						cordy = startY; 
					}
					else
					{
						if (i == 0)
						{
							var valueAmount = getAmount($("#TableTypeBList > li").last());
							
							cordy = cordy + (valueAmount < 5 ? (valueAmount + 2) * yOffset : valueAmount * yOffset);
						}
						else
						{
							var elementIndex = i - 1;
							
							if (elementIndex < 0)
							{
								elementIndex = 0;
							}
							
							var valueAmount = getAmount($("#TableTypeCList > li:eq("+elementIndex+")"));
							
							cordy = cordy + (valueAmount < 5 ? (valueAmount + 2) * yOffset : valueAmount * yOffset);
						}
					}
				}
				else
				{
					if (i % 2 != 0)
					{
						cordy = startY; 
					}
					else
					{
						if (i == 0)
						{
							var valueAmount = getAmount($("#TableTypeBList > li").last());
							
							cordy = cordy + (valueAmount < 5 ? (valueAmount + 2) * yOffset : valueAmount * yOffset);
						}
						else
						{
							var elementIndex = i - 1;
							
							if (elementIndex < 0)
							{
								elementIndex = 0;
							}
							
							var valueAmount = getAmount($("#TableTypeCList > li:eq("+elementIndex+")"));
							
							cordy = cordy + (valueAmount < 5 ? (valueAmount + 2) * yOffset : valueAmount * yOffset);
						}
					}
				}
				createElementByLi($(this),"C",cordx,cordy);
				
				if (fromEven)
				{
					if (i % 2 != 0)
					{
						cordx = cordx + xOffset;
					}
				}
				else
				{
					if (i % 2 == 0)
					{
						cordx = cordx + xOffset;
					}
				}
			});
			
			fromEven = false;
			
			if ($("#TableTypeCList > li").size() % 2 == 0)
			{
				fromEven = true;
			}
			
			$("#TableTypeDList > li").each(function(i) {
				
				if (cordx >= canvasWidth)
				{
					cordx = startX;
				}
				if (fromEven)
				{
					if (i % 2 == 0)
					{
						cordy = startY; 
					}
					else
					{
						if (i == 0)
						{
							var valueAmount = getAmount($("#TableTypeCList > li").last());
							
							cordy = cordy + (valueAmount < 5 ? (valueAmount + 2) * yOffset : valueAmount * yOffset);
						}
						else
						{
							var elementIndex = i - 1;
							
							if (elementIndex < 0)
							{
								elementIndex = 0;
							}
							
							var valueAmount = getAmount($("#TableTypeDList > li:eq("+elementIndex+")"));
							
							cordy = cordy + (valueAmount < 5 ? (valueAmount + 2) * yOffset : valueAmount * yOffset);
						}
					}
				}
				else
				{
					if (i % 2 != 0)
					{
						cordy = startY; 
					}
					else
					{
						if (i == 0)
						{
							var valueAmount = getAmount($("#TableTypeCList > li").last());
							
							cordy = cordy + (valueAmount < 5 ? (valueAmount + 2) * yOffset : valueAmount * yOffset);
						}
						else
						{
							var elementIndex = i - 1;
							
							if (elementIndex < 0)
							{
								elementIndex = 0;
							}
							
							var valueAmount = getAmount($("#TableTypeDList > li:eq("+elementIndex+")"));
							
							cordy = cordy + (valueAmount < 5 ? (valueAmount + 2) * yOffset : valueAmount * yOffset);
						}
					}
				}
				createElementByLi($(this),"D",cordx,cordy);
				
				if (fromEven)
				{
					if (i % 2 != 0)
					{
						cordx = cordx + xOffset;
					}
				}
				else
				{
					if (i % 2 == 0)
					{
						cordx = cordx + xOffset;
					}
				}
			});
			postDataString();
			
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

