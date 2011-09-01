var listTableElementString = '<li><label>Amount </label>&nbsp;&nbsp;<select size="1" id="ElementSize" class="SizeSelect"><option value="4">4<option value="5">5<option value="6">6<option value="7">7<option value="8">8<option value="9">9<option value="10">10<option value="11">11<option value="12">12<option value="13">13<option value="14">14<option value="15">15<option value="16">16<option value="17">17<option value="18">18<option value="19">19<option value="20">20<option value="21">21<option value="22">22</select>&nbsp;&nbsp;<label>:Size: </label>&nbsp;&nbsp;<select size="1" id="ElementAmount" class="AmountSelect"><option value="1" SELECTED>1<option value="2">2<option value="3">3<option value="4">4<option value="5">5<option value="6">6<option value="7">7<option value="8">8<option value="9">9</select>&nbsp;&nbsp;<img class="RemoveBtn" src="/static/canvas/images/delete.png"/>&nbsp;&nbsp;</li>';

var maxItemsPerKind = 11;

function getAmount(li)
{
	var tableProperties = li.find('select');
	var amount;
	
	amount = parseInt(tableProperties.last().val());
	
	return amount;
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
	return totalSize;
}

function removeLiParent(li)
{
	li.parent().remove();
	if ($("#TableTypeBList > li").size() <= maxItemsPerKind)
	{
		$("#AddLiB").attr("src","/static/canvas/images/add.png");
	}
	if ($("#TableTypeAList > li").size() <= maxItemsPerKind)
	{
		$("#AddLiA").attr("src","/static/canvas/images/add.png");
	}
	updateCounters();
}

function createElementByLi(li, type, cordx, cordy)
{
	var tableProperties = li.find('select');
	var amount,size,kind;
	
	if (type == "A")
	{
		kind = "long_square";
	}
	else
	{
		kind = "round_pink";
	}
	size  = parseInt(tableProperties.first().val()); 
	amount = parseInt(tableProperties.last().val());
		 
	$.post('/canvas/new/', {tables_kind: kind, tables_num: amount, tables_size: size, tables_startx: cordx ,tables_starty: cordy},
	function(data){	
		if (data.status == 'OK')
		{
			
		}
	}, 'json');
}

function updateCounters()
{
	document.getElementById("TableCounter").innerHTML = getTotalAmount();
	document.getElementById("PersonCounter").innerHTML = getTotalSeat();
}

$(document).ready(function(){

  $("#MainFrameTableTypeA").addClass('TableTypeA');
  $("#MainFrameTableTypeB").addClass('TableTypeB');
  
  $("#TableTypeAList").after(function() { $(this).append(listTableElementString); });
  $("#TableTypeBList").after(function() { $(this).append(listTableElementString); });
  updateCounters();
  
  $("#AddLiA").click(function() {
  		if ($("#TableTypeAList > li").size() <= maxItemsPerKind)
		{
			$("#TableTypeAList").append(listTableElementString);
			$("#TableTypeAList > li").last().find('img').bind('click',function(){ removeLiParent($(this)); });
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
			$("#TableTypeBList > li").last().find('select').first().bind('change',function(){ updateCounters(); });
			$("#TableTypeBList > li").last().find('select').last().bind('change',function(){ updateCounters(); });
			if ($("#TableTypeBList > li").size() > maxItemsPerKind)
			{
				$("#AddLiB").attr("src","/static/canvas/images/addDisable.png");
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
	   var cordx = 20;
	   var cordy = 43;
	   var startY = 43
	   var xOffset = 110;
	   var yOffset = 36;
	   
	   $("#TableTypeAList > li").each(function(i) {
			
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
		
		$.post('/canvas/new/', {start_canvas: "true"});
		//ShowHourGlassWaitingWindow(true);
		location.reload();
    });

});

