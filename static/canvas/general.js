var maleAdd = true;
var lastMaleAdd = true;
var addPersonDivOpen = false;
var SelectedElem = "" ;
var SelectedPerson = "" ;
var startDradPositionList = "";
var undoElementList = "";
var maxElementCapacity = 22;
var multiSelection = false;
var isMousePressFromCanvas = false;
var maxGuests = 1056;
var addPersonDivOpen = false;
var propMenuOpen = false;
var fromPropMeneBtn = false;
var currentMsgTimer = "";

if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

function getHebTableName(kind)
{
	if (kind == "Square")
	{
		return "מרובע";
	}
	else if (kind == "Round")
	{
		return "עגול";
	}
	else if (kind == "Rect")
	{
		return "מלבן";
	}
	else if (kind == "Lozenge")
	{
		return "מעויין";
	}
}

function setSaveStatus(status)
{
	if (status == "OK")
	{
	   $("#SaveStateImg").attr("src", "/static/canvas/images/save_status/saved.png");
	}
	else if (status == "Waiting")
	{
	   $("#SaveStateImg").attr("src", "/static/canvas/images/save_status/waiting.png")
	}
	else if (status == "Error")
	{
	   $("#SaveStateImg").attr("src", "/static/canvas/images/save_status/error.png")
	}
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

function refactoringListName()
{
  $("#people_list > li").each(function(i){
		refactorElementPerson($(this));
  });
}

function refactorElementPerson(element)
{
	var full_name = element.context.id;
	var deltaToRemove = 5;
	
	if (navigator.userAgent.toLowerCase().indexOf('chrome') > 0)
	{
		deltaToRemove = 6;
	}
	
	full_name = full_name.replace(/\_/g," ")
	
	if (full_name.length * 11 > $("#people_list").width() - 15)
	{
		var newString = "";
		var stop = false;
		for (var c = 0; c < full_name.length - deltaToRemove; c++)
		{
			newString = newString + full_name.charAt(c);
			if (newString.length * 8 > $("#people_list").width())
			{
				stop = true;
			}
			if (stop)
			{
				break;
			}
		}
		newString = newString + "..."
		element.text(newString);
	}
}

function setWidthAndHeight(element, newScale, lastScale)
 {
	var elementImgs = element.context.getElementsByTagName("img");
	var elementCaption = element.context.getElementsByTagName("p");
	
	if (newScale == 0)
	{
		return;
	}
	
	if (lastScale > 0)
	{
		scale =  (newScale - lastScale)  * 2;
	}
	else
	{
		scale =  (newScale - maxElementCapacity) * 2;
	}

	for (var i = 0; i < 1 ; i++)
	{
		var addHeight = 0;
		var addWidth = 0;
		var img = $("#"+ elementImgs[i].id);
		
		if (elementImgs[i].id.indexOf("Rect") > -1 && lastScale == 0)
		{
			addHeight = 16;
		}
		else if (elementImgs[i].id.split("-", 1) == "dance_stand")
		{
			addWidth = 150;
	    }
		else if (elementImgs[i].id.split("-", 1) ==  "bar_stand") 
		{
			addWidth = 65;
		}
		
		if (i > 0)
		{
			img.animate({ width:img.width() + scale / 3, height: img.height() + scale / 3},300, 'linear');
		}
		else
		{
			img.animate({ width:img.width() + scale + addWidth, height: img.height() + scale + addHeight},300, 'linear');
		}
	}
	element.animate({ width:element.width() + scale, height: element.height() + scale + addHeight},300, 'linear', function()
	{
		if (lastScale > 0 && isThisPeopleTable(elementImgs[0].id))
		{
			selectElement($(this));
		}
		if (!isThisPeopleTable(elementImgs[0].id))
		{
					 
			 $(this).css('width', elementImgs[0].width);
			 $(this).css('height', elementImgs[0].height);
			 if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
			{
				$("#borderSelected").css('top',element.position().top - 6);
				$("#borderSelected").css('left',element.position().left - 6);
				$("#borderSelected").css('width',element.width() + 12);
				$("#borderSelected").css('height',element.height() + 12);
				element.css('zIndex',1000);
			}
		}
		else
		{
			adjustCaption($(this));
		}
	});
}

function adjustCaption(element)
{
	var elementImgs = element.context.getElementsByTagName("img");
	var elementCaption = element.context.getElementsByTagName("p");
	var textID = elementCaption[0].id;
	var text =  $("#" + textID).text();
	var title = $("#" + textID).attr('title');
	var realWidth = $("#" + elementImgs[0].id).width();
	if (title.length * 6.2 > element.width() || title.length > 25)
	{
		var newString = "";
		var stop = false;
		for (var c = 0; c < title.length - 9; c++)
		{
			newString = newString + title.charAt(c);
			if (newString.length * 8 > $("#" + elementImgs[0].id).width())
			{
				stop = true;
			}
			if (stop)
			{
				break;
			}
		}
		if (newString == " " || newString == "")
		{
			newString = title;
		}
		else
		{
			newString = newString + "...";
		}
		elementCaption[0].innerHTML = newString;
		elementCaption[0].title = title;
		element.css('width',realWidth);
	}
	else
	{
		elementCaption[0].innerHTML = title;
		elementCaption[0].title = title;
	}
}

function getPositions(element)
 {
	var $element = $(element);
	var pos = $element.position();
	var width = $element.width();
	var height = $element.height();

	return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
}

function comparePositions(p1, p2)
{
	var x1 = p1[0] < p2[0] ? p1 : p2;
	var x2 = p1[0] < p2[0] ? p2 : p1;
	return x1[1] > x2[0] || x1[0] === x2[0] ? true : false;
}

//Check if 2 objects intersect
function collisionWithOtherElement(element)
{
	var match = false;
	var pos = getPositions(document.getElementById(element.context.id));
	$(".DragDiv").each(function(i) {
		if (element.context.id != $(this).context.id)
		{
			var pos2 = getPositions(this);
			var horizontalMatch = comparePositions(pos[0], pos2[0]);
			var verticalMatch = comparePositions(pos[1], pos2[1]);
			match = horizontalMatch && verticalMatch;
			if (match)
			{
				return false;
			}
		}
	});
	
	if (!match)
	{
		$(".DragNonDropDiv").each(function(i) {
			if (element.context.id != $(this).context.id)
			{
				var pos2 = getPositions(this);
				var horizontalMatch = comparePositions(pos[0], pos2[0]);
				var verticalMatch = comparePositions(pos[1], pos2[1]);
				match = horizontalMatch && verticalMatch;
				if (match)
				{
					return false;
				}
			}
		});
	}
	
	if (match)
	{
		return true;
	}
	else
	{
		return false;
	}
}

//Check if 2 objects intersect
function collisionWithOtherElementById(elementId)
{
	var match = false;
	var pos = getPositions(document.getElementById(elementId));
	$(".DragDiv").each(function(i) {
		if (elementId != $(this).context.id)
		{
			var pos2 = getPositions(this);
			var horizontalMatch = comparePositions(pos[0], pos2[0]);
			var verticalMatch = comparePositions(pos[1], pos2[1]);
			match = horizontalMatch && verticalMatch;
			if (match)
			{
				return false;
			}
		}
	});
	
	if (!match)
	{
		$(".DragNonDropDiv").each(function(i) {
			if (elementId != $(this).context.id)
			{
				var pos2 = getPositions(this);
				var horizontalMatch = comparePositions(pos[0], pos2[0]);
				var verticalMatch = comparePositions(pos[1], pos2[1]);
				match = horizontalMatch && verticalMatch;
				if (match)
				{
					return false;
				}
			}
		});
	}
	
	if (match)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function saveElement(element)
{
		var elementId = element.context.id;
		
		if (elementId == undefined)
		{
			elementId = element.attr('id');
		}
       $.post('/canvas/save/', {elem_num: elementId, X: element.position().left , Y: element.position().top ,caption: "" ,size: "", sumGuests: "", fixNumber:""},
         function(data){
           if (data.status == 'OK')
           {
				setSaveStatus("OK");
           }else{
				setSaveStatus("Error");
           }
         }, 'json');
}

function saveElementByID(elementId)
{
       $.post('/canvas/save/', {elem_num: elementId, X: $("#"+elementId).position().left , Y: $("#"+elementId).position().top ,caption: "" ,size: "", sumGuests:"", fixNumber:""},
         function(data){
           if (data.status == 'OK')
           {
             setSaveStatus("OK");
           }else{
             setSaveStatus("Error");
           }
         }, 'json');
}

function saveElementWithCaptionoWhenSizeIsLower(element,newCaption, newSize, numOfGuests, fixNumber)
{
	if (MsgBoxLastAnswer == "OK")
	{
		$.post('/canvas/floatPersonsFromPos/', {elem_num: element.context.id, new_size: parseInt(newSize)},
	   function(dataPersons){
	   if (dataPersons.status == 'OK')
	   { 
			var floating_persons = dataPersons.floating_persons.split(",",parseInt(dataPersons.numOfFloatingPersons) + 1);
			//for (var i=1; i < parseInt(dataPersons.numOfFloatingPersons) + 1; i++)
			//{
			//	var full_name = floating_persons[i].split(" ",2);

			//	addPersonToFloatList(full_name[0],full_name[1]);
			//}
			sizeStr = dataPersons.currentSitting + "/" + newSize;
			$.post('/canvas/save/', {elem_num: element.context.id, X: element.position().left , Y: element.position().top ,caption: newCaption, size: newSize, sumGuests: numOfGuests, fixNumber:fixNumber},
			function(dataSave){
			if (dataSave.status == 'OK')
			{
				writeOccasionInfo("Update "+ element.text().split(" ", 2)[0] +" Caption To " +newCaption + " And Size To " +newSize+".");
				reloadElementAfterSave(element,newCaption,newSize,sizeStr);
				setSaveStatus("OK");
				ShowHourGlassWaitingWindow(true);
			   }else{
				setSaveStatus("Error");
			   }
			}, 'json');
	   }
	   }, 'json');
		clearTimeout(currentMsgTimer);
		MsgBoxLastAnswer = "Lock";
		currentMsgTimer = "";
	}
	else if (MsgBoxLastAnswer == "Cancel" || MsgBoxLastAnswer == "Abort")
	{
		updateElementScreenProperties(element);
		clearTimeout(currentMsgTimer);
		MsgBoxLastAnswer = "Lock";
		currentMsgTimer = "";
	}
	else
	{
		currentMsgTimer = setTimeout(function(){saveElementWithCaptionoWhenSizeIsLower(element,newCaption,newSize, numOfGuests, fixNumber)},500);
	}
}
function saveElementWithCaptionIfExist(element,newCaption, newSize, numOfGuests, fixNumber)
{
	if (MsgBoxLastAnswer == "OK")
	{
		saveElementWithCaption(element,newCaption,newSize,numOfGuests,fixNumber);
		clearTimeout(currentMsgTimer);
		MsgBoxLastAnswer = "Lock";
		currentMsgTimer = "";
	}
	else if (MsgBoxLastAnswer == "Cancel" || MsgBoxLastAnswer == "Abort")
	{
		updateElementScreenProperties(element);
		clearTimeout(currentMsgTimer);
		MsgBoxLastAnswer = "Lock";
		currentMsgTimer = "";
	}
	else
	{
		currentMsgTimer = setTimeout(function(){saveElementWithCaptionIfExist(element,newCaption,newSize,numOfGuests,fixNumber)},500);
	}
}

function saveElementWithCaption(element,newCaption, newSize, numOfGuests, fixNumber)
{
       var elementCaption = element.context.getElementsByTagName("p");
	   var sizeStr = elementCaption[1].firstChild.nodeValue.split("/", 1) + "/" + newSize;
		if (newCaption == " " || newCaption == "")
		{
			newCaption  = "ללא שם";
		}
	   if (parseInt(elementCaption[1].firstChild.nodeValue.split("/", 1)) > parseInt(newSize))
	   {
           $.post('/canvas/personOnHigherPos/', {elem_num: element.context.id, new_size: parseInt(newSize) + 1},
           function(data){
           if (data.status == 'True')
           { 
				showLightMsg("עדכון נתון גודל אלמנט", "ישנם אנשים במיקום גובה יותר, האם להחזיר אותם לרשימה?", "YESNO", "Question");
				currentMsgTimer = setTimeout(function(){saveElementWithCaptionoWhenSizeIsLower(element,newCaption,newSize, numOfGuests, fixNumber)},500);
           }
           }, 'json');
	   }
	   else
	   {
		  $.post('/canvas/save/', {elem_num: element.context.id, X: element.position().left , Y: element.position().top ,caption: newCaption, size: newSize, sumGuests: numOfGuests, fixNumber:fixNumber},
		  function(dataSave){
		    if (dataSave.status == 'OK')
		    {
				writeOccasionInfo("Update "+ element.text().split(" ", 2)[0] +" Caption To " +newCaption + " And Size To " +newSize+".");
				reloadElementAfterSave(element,newCaption,newSize,sizeStr);
				setSaveStatus("OK");
		    }else{
				setSaveStatus("Error");
		    }
			}, 'json');
		}
}

function reloadElementAfterSave(element,newCaption,newSize,sizeStr)
{
	var elementCaption = element.context.getElementsByTagName("p");
	var elementMaxSize = elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1);
	setWidthAndHeight(element,newSize,elementMaxSize);
	elementCaption[0].innerHTML = newCaption;
	elementCaption[0].title = newCaption;
	elementCaption[1].innerHTML = sizeStr;
	reloadElementStatus(element);
}

function selectElement(element)
{
    if (SelectedElem != "" ) {
	  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
	 {
		$("#borderSelected").removeClass('borderSelected');
	 }
	 else
	 {
		SelectedElem.removeClass('borderSelected');
	 }
    }
	if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
	 {
		$("#borderSelected").removeClass('borderSelected');
	 }
	 else
	 {
		element.removeClass('borderSelected');
	 }
	if (!tableMode)
	{	  
		if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
		 {
			$("#borderSelected").css('top',element.position().top - 6);
			$("#borderSelected").css('left',element.position().left - 6);
			$("#borderSelected").css('width',element.width() + 12);
			$("#borderSelected").css('height',element.height() + 12);
			element.css('zIndex',1000);
			$("#borderSelected").addClass('borderSelected');
		 }
		 else
		 {
			element.addClass('borderSelected');
		 }
	}
	if (!fromPropMeneBtn)
	{
		posPropertyPanel("");
	}
	multiSelection = false;
    SelectedElem = element;
	updateElementScreenProperties(element);
	fromPropMeneBtn = false;
}

function updateElementScreenProperties(element)
{
	if (element.hasClass('DragDiv'))
	{
		var elementCaption = element.context.getElementsByTagName("p");
		$("#ElementCaption").attr("value",elementCaption[0].title);
		$("#ElementSize").attr("value",elementCaption[1].firstChild.nodeValue.substr(		elementCaption[1].firstChild.nodeValue.indexOf("/")+1));
		$.post('/canvas/getFixNumber/', {elem_num: element.context.id},
		  function(data){
		  if (data.status == 'OK')
		  { 
				$("#ElementNumber").attr("value",data.fix_num);  
		  }
		  }, 'json');
	}
}

function updateSeatedLabel()
{
	document.getElementById("SeatedLabelValue").innerHTML = findNumOfAllSeaters();
	document.getElementById("TotalGuestsLabelValue").innerHTML = $("#people_list > li").size() + findNumOfAllSeaters()
}

function reloadElementStatus(element)
{
	var elementCaption = element.context.getElementsByTagName("p");
	var elementImgs = element.context.getElementsByTagName("img");
	var elementSize = elementCaption[1].firstChild.nodeValue.split("/", 1);
	var elementMaxSize = elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1);
	
	//used for table status
	if (elementSize == 0)
	{
		if (elementImgs[0].id.split("-", 1) == "Square") {
		  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/SquareR.png";
		} else if (elementImgs[0].id.split("-", 1) == "Round") {
			  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/RoundR.png";
		}else if (elementImgs[0].id.split("-", 1) == "Rect") {
		  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/RectR.png";
		}else if (elementImgs[0].id.split("-", 1) == "Lozenge") {
		  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/LozengeR.png";
		}
	}
	else if (elementSize == elementMaxSize)
	{
		if (elementImgs[0].id.split("-", 1) == "Square") {
		  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/SquareG.png";
		} else if (elementImgs[0].id.split("-", 1) == "Round") {
			  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/RoundG.png";
		}else if (elementImgs[0].id.split("-", 1) == "Rect") {
		  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/RectG.png";
		}else if (elementImgs[0].id.split("-", 1) == "Lozenge") {
		  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/LozengeG.png";
		}
	}
	else
	{
		if (elementImgs[0].id.split("-", 1) == "Square") {
		  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/SquareY.png";
		} else if (elementImgs[0].id.split("-", 1) == "Round") {
			  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/RoundY.png";
		}else if (elementImgs[0].id.split("-", 1) == "Rect") {
		  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/RectY.png";
		}else if (elementImgs[0].id.split("-", 1) == "Lozenge") {
		  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/LozengeY.png";
		}
	}
}

function pointTableAfterSearch(element)
{
	selectElement(element);
	element.fadeTo(400, 0,function(){
		element.fadeTo(400, 1,function(){
		selectElement($(this));
		});
	});
}

function pointPersonAfterSearch(element, elementImg)
{
	selectPersonElement(element);
	element.fadeTo(400, 0,function(){
		element.fadeTo(400, 1,function(){
		selectPersonElement(element);
		});
	});
}
function saveNumOfGuests(numGuests)
{
	$.post('/canvas/updateNumOfGuests/', {sumGuests: numGuests},
	function(dataSave){
	if (dataSave.status == 'OK')
	{
		setSaveStatus("OK");
		writeOccasionInfo("Update Max Num Of Guest " +numGuests+".");
		}else{
		setSaveStatus("Error");
		}
	}, 'json');
}

function updateNumOfGuest()
{
	var numOfGuests = $("#NumOfGuests").val();
	if (numOfGuests < $("#people_list > li").size() + findNumOfAllSeaters())
	{
		numOfGuests = $("#people_list > li").size() + findNumOfAllSeaters();
	}
	else if (numOfGuests > maxGuests)
	{
		numOfGuests = maxGuests;
	}
	if (IsNumeric(numOfGuests))
	{
		document.getElementById("NumOfGuests").style.color = "black";
		$("#NumOfGuests").val(numOfGuests);
	}
	else
	{
		document.getElementById("NumOfGuests").style.color = "red";
		numOfGuests = "";
	}
	
	return numOfGuests;
}

function refreshNumOfGuests()
{
	$.post('/canvas/getNumOfGuests/', {},
	function(data){
	if (data.status == 'OK')
	{
		$("#NumOfGuests").val(data.numOfGuests);
		setSaveStatus("OK");
		}else{
		setSaveStatus("Error");
		}
	}, 'json');
}

function findNumOfAllSeaters()
{
	var sum = 0;
	$(".DragDiv").each(function(i) {
		var elementCaption = $(this).context.getElementsByTagName("p");
		var elementSize = elementCaption[1].firstChild.nodeValue.split("/", 1);
		sum = sum + parseInt(elementSize);
	});
	return sum;
}

function rePaintPeopleList()
{
  $("#people_list > li").each(function(i){
    $(this).removeClass("yellowBackground");
	if (i % 2 == 0)
	{
		$(this).addClass("yellowBackground");
	}
  });
}

function addPersonToFloatList(first_name,last_name, personGroup)
{
	var gender = 'F';
	if (maleAdd)
	{
		gender = 'M';
	}
    $.post('/accounts/add_person/', {first: first_name, last: last_name, group: personGroup, gender:gender},
      function(data){
        if (data.status == 'OK')
        {
			  writeOccasionInfo("Added Person " +first_name+" "+last_name);
			  ShowHourGlassWaitingWindow(true);
        }
      }, 'json');
}

function openAddInterface()
{
    //$('ul.AddPerson').slideToggle('medium');
	if (addPersonDivOpen)
	{
		addPersonDivOpen=false;
		//$("#maxGuest_list").animate({top:250});
		//$("#search-properties-list").animate({top:330});
		$('#AddPersonList').hide("slide", { direction: "right" }, 150);
		if (maleAdd != lastMaleAdd)
		{
			openAddInterface();
		}
	}
	else
	{
		addPersonDivOpen=true;
		//$("#maxGuest_list").animate({top: $("#AddPersonList").position().top + 205});
		//$("#search-properties-list").animate({top:$("#AddPersonList").position().top + 295});
		$('#AddPersonList').show("slide", { direction: "right" }, 150);
	}
}

function sortListByName(listId, ascending)
{
    $("#"+listId).each(function() {
        var $list = $(this);
        var rows = $list.find('li').get();
        rows.sort(function(a, b) {
            var keyA = $(a).text().toUpperCase();
            var keyB = $(b).text().toUpperCase();
			if (ascending)
			{
				if (keyA < keyB) return -1;
				if (keyA > keyB) return 1;
			}
			else
			{
				if (keyA > keyB) return -1;
				if (keyA < keyB) return 1;
			}
            return 0;
        });
        $.each(rows, function(index, row) {
			$(this).removeClass("yellowBackground");
			if (index % 2 == 0)
			{
				$(this).addClass("yellowBackground");
			}
            $list.append(row);
        });
    });     
}

function sortListByGroup(listId, ascending)
{
    $("#"+listId).each(function() {
        var $list = $(this);
        var rows = $list.find('li').get();
        rows.sort(function(a, b) {
            var keyA = $(a).attr('title').toUpperCase();
            var keyB = $(b).attr('title').toUpperCase();
			if (ascending)
			{
				if (keyA < keyB) return -1;
				if (keyA > keyB) return 1;
			}
			else
			{
				if (keyA > keyB) return -1;
				if (keyA < keyB) return 1;
			}
            return 0;
        });
        $.each(rows, function(index, row) {
			$(this).removeClass("yellowBackground");
			if (index % 2 == 0)
			{
				$(this).addClass("yellowBackground");
			}
            $list.append(row);
        });
    });     
}

function isThisPeopleTable(id)
{
	if(id.indexOf("Round") == -1 && id.indexOf("Square") == -1 && id.indexOf("Rect") == -1 && id.indexOf("Lozenge") == -1)
	{
		return false;
	}
	return true;
}

function startDrag(element)
{
	element.css('zIndex', 99);
	if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
	{
		$("#borderSelected").removeClass('borderSelected');
	}
	else
	{
		$("#borderSelected").removeClass('borderSelected');
	}
	element.fadeTo(200, 0.3);
	startDradPositionList = new Array(1);
	startDradPositionList[0] = element.position();
    setSaveStatus("Waiting");
	posPropertyPanel("");
}

function stopDrag(element)
{
	$("#people-list").removeClass('class_overflow_hidden');
	$("#people-list").addClass('class_overflow_auto');
    element.fadeTo(200, 1.0);
	undoElementList = new Array(1);
	var undoElement = new Array(2);//[element,operation]
    undoElement[0] = element;
    undoElement[1] = "move";
	undoElementList[0] = undoElement;
	posPropertyPanel("");
    if (collisionWithOtherElement(element))
    {
      if (startDradPositionList[0] != "")
      {
         var newTop = startDradPositionList[0].top;
         var newLeft = startDradPositionList[0].left;
         element.animate({ top: newTop , left: newLeft},300, 'linear', function() { saveElement($(this)); selectElement($(this));});
       }
     }
    else
    {
       saveElement(element);
    }
}

function propMenuBtnClick(elementID)
{
	if (propMenuOpen)
	{
		posPropertyPanel("");
		if (SelectedElem.context.id == elementID)
		{
			propMenuOpen = false;
		}
		else
		{
			posPropertyPanel($("#" + elementID));
			propMenuOpen = true;
		}
	}
	else
	{
		posPropertyPanel($("#" + elementID));
		propMenuOpen = true;
	}
	fromPropMeneBtn = true;
}

function undoButtonPress()
{
	for (var index = 0; index < undoElementList.length; index++)
	{
		var undoElement = undoElementList[index];
		if (undoElement[0] != "" && undoElement[1] != "" )
		{
		   if (!tableMode && !detailsMode)
		   {
			   switch(undoElement[1])
			   {
				  case "move":
					  {
						var newTop = startDradPositionList[index].top;
						var newLeft = startDradPositionList[index].left;
						startDradPositionList[index] = undoElement[0].position();
						undoElement[0].animate({ top: newTop , left: newLeft},300, 'linear', function() { saveElement($(this)); selectElement(undoElement[0]);});
						break;
					  }
				  case "closetbl":
					  {
						undoElement[0].dblclick();
						undoElement[1] = "opentbl";
						break;
					  }
				  case "add":
					  {
							$.post('/canvas/add/', {kind: undoElement[0].context.id ,amount: 1},
							function(data){
							if (data.status == 'OK')
							{
							   undoElement[1] = "delete"; 
							   ShowHourGlassWaitingWindow(true);
							} else if (data.status == 'LIMIT')
											{
												showLightMsg("הגבלת שולחנות","מקסימום שולחנות הוצבו.","OK","Notice");
												ShowHourGlassWaitingWindow(true);
											}
							}, 'json');
							break;
					  }
				  case "delete":
				  {
					  setSaveStatus("Waiting");
					  $.post('/canvas/delete/', {elem_num: undoElement[0].context.id},
					  function(data){
					  if (data.status == 'OK')
					  { 
						 undoElement[1] = ""; 
						 ShowHourGlassWaitingWindow(true);
					  }
					  }, 'json');
					  break;
				  }
			   }
			}
			else if ( tableMode )
			{
				switch(undoElement[1])
			   {
				  case "opentbl":
				  	  {
						undoElement[0].dblclick();
						undoElement[1] = "closetbl";
						break;
					  }
				}
			}
		}
	}
}

function insureNumInput(event)
{
	// Allow only backspace and delete
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

function updateGroups()
{
	$("#personGroup").append($('<option value="Family ' + $("#firstPartnerName").text()+'">משפחה '+ $("#firstPartnerName").text() + '</option>'));
	$("#personGroup").append($('<option value="Friends ' + $("#firstPartnerName").text()+'">חברים '+ $("#firstPartnerName").text() + '</option>'));
	$("#personGroup").append($('<option value="Work ' + $("#firstPartnerName").text()+'">עבודה '+ $("#firstPartnerName").text() + '</option>'));
	if ($("#addChar").text() == " " || $("#addChar").text() == '')
	{	
		$("#personGroup").append($('<option value="Family">משפחה כללי</option>'));
		$("#personGroup").append($('<option value="Work">חברים כללי</option>'));
		$("#personGroup").append($('<option value="Friends">עבודה כללי</option>'));
	}
	else
	{
		$("#personGroup").append($('<option value="Family ' + $("#secondPartnerName").text()+'">משפחה '+ $("#secondPartnerName").text() + '</option>'));
		$("#personGroup").append($('<option value="Work ' + $("#secondPartnerName").text()+'">חברים '+ $("#secondPartnerName").text() + '</option>'));
		$("#personGroup").append($('<option value="Friends ' + $("#secondPartnerName").text()+'">עבודה '+ $("#secondPartnerName").text() + '</option>'));
	}
	$("#personGroup").append($('<option value="Other" selected>אחר</option>'));
}

function reposElementAtAFreeSpace(element, offsetWidth)
{
	var startposX = 20;
	var startposY = 45;
	var curtop = startposY;
	var curleft = startposX;
	var placed = false;
	
	while (curtop < $("#canvas-div").height() + element.height())
	{
		element.css('top',curtop);
		element.css('left',curleft);
		
		if (!collisionWithOtherElement(element))
		{
			saveElement(element);
			selectElement(element);
			placed = true;
			break;
		}
		
		curleft = curleft + 60;
		if (curleft + element.width() >= $("#canvas-div").width() - offsetWidth)
		{
			curtop = curtop + 60;
			curleft = startposX;
		}
		
		if (!placed)
		{
			element.css('top', startposY);
			element.css('left',startposX);
			saveElement(element);
			selectElement(element);
		}
	}
}

function personFloatListDBClick(event, floatElement)
{
	if (!event.ctrlKey)
	{
		var current_person = floatElement;
		if (tableMode)
		{
			
			var full_name = "";
			full_name = floatElement.context.id.split("_", 2);

			var first_Name = full_name[0];
			var last_Name = full_name[1];
			var selectedTable = (SelectedElem == "" ? SelectedTable : SelectedElem);
			$.post('/canvas/getItem/', {position: "", firstName: first_Name, lastName: last_Name},
			function(data)
			{
				if (data.status == 'OK')
				{
					personData = data;
					FocusDetails(current_person,selectedTable,true);
				}
			},'json');
		}
		else
		{
			FocusDetailsFromFloatList(current_person,true);
		}
	}
}

function exitSys()
{
	if (MsgBoxLastAnswer == "OK")
	{
		document.location.href='/accounts/logout';
		clearTimeout(currentMsgTimer);
		MsgBoxLastAnswer = "Lock";
		currentMsgTimer = "";
	}
	else if (MsgBoxLastAnswer == "Cancel" || MsgBoxLastAnswer == "Abort")
	{
		clearTimeout(currentMsgTimer);
		MsgBoxLastAnswer = "Lock";
		currentMsgTimer = "";
	}
	else
	{
		currentMsgTimer = setTimeout("exitSys()",500);
	}
}


function delDivPress()
{
	if (MsgBoxLastAnswer == "OK")
	{
		if (tableMode)
		{
			DeletePerson();
			updateSeatedLabel();
			writeOccasionInfo("Move Person "+ SelectedPerson.context.id.replace(/\_/g," ") +"From Table "+SelectedElem.text().split(" ", 2)[1].trim()+" To Float List.");
		}
		else
		{
			if (SelectedElem != "") {
			  setSaveStatus("OK");
			  $.post('/canvas/delete/', {elem_num: SelectedElem.context.id},
					function(data){
				  if (data.status == 'OK')
				  { 
					  //undoElement[0] = SelectedElem;
					  //undoElement[1] = "add"; 
					  ShowHourGlassWaitingWindow(true);
					  writeOccasionInfo("Delete Table "+SelectedElem.text().split(" ", 2)[1].trim()+".");
				  }
				}, 'json');
			} else {
				if (!tableMode && !detailsMode)
				{
					showLightMsg("מחיקת אלמנט","יש לבחור אלמנט.","OK","Notice");
				}
			}
		}
		clearTimeout(currentMsgTimer);
		MsgBoxLastAnswer = "Lock";
		currentMsgTimer = "";
	}
	else if (MsgBoxLastAnswer == "Cancel" || MsgBoxLastAnswer == "Abort")
	{
		clearTimeout(currentMsgTimer);
		MsgBoxLastAnswer = "Lock";
		currentMsgTimer = "";
	}
	else
	{
		currentMsgTimer = setTimeout("delDivPress()",500);
	}
}

function delPerson()
{
	if (MsgBoxLastAnswer == "OK")
	{
		$.post('/canvas/delfp/', {person_id: SelectedPerson.context.id},
	   function(data){
		 if (data.status == 'OK')
		 {
		   SelectedPerson.remove();
		   var personsSum = $("#people_list > li").size() + findNumOfAllSeaters();
		   if (personsSum < $("#NumOfGuests").val() && personsSum < maxGuests)
		   {
				$("#AddPersonDivID").replaceWith('<div class="AddPersonDiv"  id="AddPersonDivID" title="Add Person To Float List" ><img width=30 height=30 src="http://www.getempower.com/apps/50/icons/icon_50x50.png"></div>');
				$("#AddPersonDivID").bind('click',function(){$('ul.AddPerson').slideToggle('medium');});
		   }
			writeOccasionInfo("Delete Person "+ SelectedPerson.context.id.replace(/\_/g," ") +"From Float List.");
		   setSaveStatus("OK");
		   updateSeatedLabel();
		 }else{
		   setSaveStatus("Error");
		 }
		 SelectedPerson = "";
		 }, 'json');
		clearTimeout(currentMsgTimer);
		MsgBoxLastAnswer = "Lock";
		currentMsgTimer = "";
	}
	else if (MsgBoxLastAnswer == "Cancel" || MsgBoxLastAnswer == "Abort")
	{
		clearTimeout(currentMsgTimer);
		MsgBoxLastAnswer = "Lock";
		currentMsgTimer = "";
	}
	else
	{
		currentMsgTimer = setTimeout("delPerson()",500);
	}
}

$(document).ready(function() {

 var sortFloatListByNameAscending = true
 var sortFloatListByGroupAscending = true
 var imgs,i;

  imgs = document.getElementsByTagName('img');

  for(i=0;i<imgs.length;i++)
  {
    if (imgs[i].id.split("-", 1) == "Square") {
      document.getElementById(imgs[i].id).src = "/static/canvas/images/tables_small/SquareR.png";
    } else if (imgs[i].id.split("-", 1) == "Round") {
      document.getElementById(imgs[i].id).src = "/static/canvas/images/tables_small/RoundR.png";
    }else if (imgs[i].id.split("-", 1) == "Rect") {
      document.getElementById(imgs[i].id).src = "/static/canvas/images/tables_small/RectR.png";
    }else if (imgs[i].id.split("-", 1) == "Lozenge") {
      document.getElementById(imgs[i].id).src = "/static/canvas/images/tables_small/LozengeR.png";
    }else if (imgs[i].id.split("-", 1) == "dance_stand") {
	  document.getElementById(imgs[i].id).src = "/static/canvas/images/misc/dance.png";
	}else if (imgs[i].id.split("-", 1) == "bar_stand") {
	  document.getElementById(imgs[i].id).src = "/static/canvas/images/misc/bar.png";
	}else if (imgs[i].id.split("-", 1) == "dj_stand") {
	  document.getElementById(imgs[i].id).src = "/static/canvas/images/misc/dj.png";
	}
  }
  
  var numOfElementsComboBox = 1;//document.getElementById("numOfElementsComboBox");

  $("#ElementPropertiesSaveButton").removeAttr('disabled');
  $("#ElementCaption").removeAttr('disabled');
  $("#ElementSize").removeAttr('disabled');
  refactoringListName();
  posPropertyPanel("");
  updateSeatedLabel();
  $.jqplot.config.enablePlugins = true;
  $("#people-list").removeClass('class_overflow_hidden');
  $("#people-list").addClass('class_overflow_auto');
  updateGroups();

  $(".DragDiv").after(function() {
     reloadElementStatus($(this)); 
	 var elementCaption = $(this).context.getElementsByTagName("p");
	 var elementMaxSize = elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1);
	 var elementImgs = $(this).context.getElementsByTagName("img");
	 elementCaption[0].title = elementCaption[0].firstChild.nodeValue;
	 setWidthAndHeight($(this),elementMaxSize,0);
	 $(this).find('img').first()
	 if (!isThisPeopleTable(elementImgs[0].id))
     {
		 //elementCaption[1].style.visibility = "hidden";
		 $(this).find('p').each(function(i){ $(this).remove(); });
		 $(this).removeClass('DragDiv');
		 setWidthAndHeight($(this),35,22);
		 if (elementImgs[0].id.split("-", 1) == "dance_stand")
		 {
			$(this).attr('title',"רחבת ריקודים");
			$(this).find('.tableProp').remove();
		 }
	     else if (elementImgs[0].id.split("-", 1) ==  "bar_stand") 
		 {
			$(this).attr('title',"בר משקאות");	
			$(this).find('.tableProp').remove();
		 }
	     else if (elementImgs[0].id.split("-", 1) ==  "dj_stand")
		 {
			$(this).attr('title',"עמדת די ג'יי");	
			$(this).find('.tableProp').remove();
		 }
		 $(this).addClass('DragNonDropDiv');
		 
	 }
  });
  $(".DragDiv").mouseover(function(){
	if (!tableMode && !detailsMode)
	{
		$(this).find('img').last().fadeTo(0, 1);
	}
  }); 
  $(".DragDiv").mouseout(function(){
  	if (!tableMode && !detailsMode)
	{
		$(this).find('img').last().fadeTo(0, 0);
	}
  });
  $("#people_list").multisortable();
  $("#people_list").disableSelection();
  rePaintPeopleList(); 
 $("#SortFloatList").click(function()
 {
	if ($("#filterListRI").val() == 'Name')
	{
		sortListByName("people_list",sortFloatListByNameAscending);
		sortFloatListByNameAscending = !sortFloatListByNameAscending;
	}
	else
	{
		sortListByGroup("people_list",sortFloatListByGroupAscending);
		sortFloatListByGroupAscending = !sortFloatListByGroupAscending;
	}
 });
  $("#AddMaleGuestDivID").click(function()
 {
	lastMaleAdd = maleAdd;
	maleAdd = true;
	$("#addGenderImg").attr('src',"/static/canvas/images/person/man_128X128.png");
	openAddInterface();
 });
  $("#AddFemaleGuestDivID").click(function()
 {
	lastMaleAdd = maleAdd;
	maleAdd = false;
	$("#addGenderImg").attr('src',"/static/canvas/images/person/woman_128X128.png");
	openAddInterface();
 });
 
  $("#AddPersonButton").click( function() {
    var first_name = document.getElementById("first_name").value;
    var last_name = document.getElementById("last_name").value;
	var group = document.getElementById("personGroup").value;
	addPersonToFloatList(first_name,last_name, group);
  });
  
  $(".DragDiv").click( function() {
     selectElement($(this));
  });
 
  $(".DragNonDropDiv").click( function() {
     selectElement($(this));
  });
  
  $(".DragNonDropDiv").draggable({
     containment: 'parent',
	 cursor: "move",
     start: function (e,ui){
		startDrag($(this));
     },
     stop: function (e,ui){
		stopDrag($(this));
       }
  });
  
  $(".DragDiv").draggable({
     containment: 'parent',
	 cursor: "move",
     start: function (e,ui){
		startDrag($(this));
     },
     stop: function (e,ui){
		stopDrag($(this));
       }
  });
  
  $(".DragDiv").droppable({
  	accept: "#people_list li",
	hoverClass: "personOverTableDropLayer",
    drop: function(e, ui ) {
	  var elementImgs = $(this).context.getElementsByTagName("img");
	  if (!isThisPeopleTable(elementImgs[0].id))
	  {
		return;
	  }
	  var table = $(this);
	
	  ui.helper.each(function(i){
		  var draged = $(this);
		  if (draged  != "")
		  {
			  var elementCaption = table.context.getElementsByTagName("p");
			  var elementImgs = table.context.getElementsByTagName("img");
			   table.fadeTo(300, 0,function(){
			   table.fadeTo(300, 1)});
			   $.post('/canvas/sit/', {table_id: table.context.id, person_id: draged.context.id},
				function(data){
				  if (data.status == 'OK')
				  {
					if ($("#" + draged.context.id).index() < 0)
					{
						$("#people_list > li").each(function(j) { if ($(this).context.id == draged.context.id){$(this).remove();}});
					}
					else
					{
						$("#" + draged.context.id).remove();
					}
					draged.hide();
					draged.remove();
					setSaveStatus("OK");
					if (data.table_status == 'Red')
					{
						if (elementImgs[0].id.split("-", 1) == "Square") {
						  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/SquareR.png";
						} else if (elementImgs[0].id.split("-", 1) == "Round") {
						  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/RoundR.png";
						}else if (elementImgs[0].id.split("-", 1) == "Rect") {
						  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/RectR.png";
						}else if (elementImgs[0].id.split("-", 1) == "Lozenge") {
						  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/LozengeR.png";
						}
						//$("#" + elementImgs[0].id).attr("src", "/static/canvas/images/YellowStatus.png");
					}
					else if (data.table_status == 'Green')
					{
						if (elementImgs[0].id.split("-", 1) == "Square") {
						  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/SquareG.png";
						} else if (elementImgs[0].id.split("-", 1) == "Round") {
						  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/RoundG.png";
						}else if (elementImgs[0].id.split("-", 1) == "Rect") {
						  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/RectG.png";
						}else if (elementImgs[0].id.split("-", 1) == "Lozenge") {
						  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/LozengeG.png";
						}
						//$("#" + elementImgs[1].id).attr("src", "/static/canvas/images/GreenStatus.png");
					}
					else if (data.table_status == 'Yellow')
					{
						if (elementImgs[0].id.split("-", 1) == "Square") {
						  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/SquareY.png";
						} else if (elementImgs[0].id.split("-", 1) == "Round") {
						  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/RoundY.png";
						}else if (elementImgs[0].id.split("-", 1) == "Rect") {
						  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/RectY.png";
						}else if (elementImgs[0].id.split("-", 1) == "Lozenge") {
						  document.getElementById(elementImgs[0].id).src = "/static/canvas/images/tables_small/LozengeY.png";
						}
						//$("#" + elementImgs[1].id).attr("src", "/static/canvas/images/GreenStatus.png");
					}
					var elementSize = elementCaption[1].firstChild.nodeValue.split("/", 1);
					var elementMaxSize = elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1);
					
					elementSize = parseInt(elementSize) + 1;
					elementCaption[1].innerHTML = elementSize + "/" + elementMaxSize;
					if (tableMode)
					{
						LoadPerson(table, data.free_position - 1);
					}
					updateSeatedLabel();
					writeOccasionInfo("Drop Person " + draged.text() + "To Table " +  elementCaption[0].innerHTML);
					rePaintPeopleList();
				  }else if (data.status == 'FULL')
				  {
					draged.fadeTo(200, 1.0);
					showLightMsg("אלמנט מלא"," אלמנט " + elementCaption[0].innerHTML + " מלא עבור " + draged.text(),"OK","Notice")
					setSaveStatus("OK");
				  }else{
					draged.fadeTo(200, 1.0);
					setSaveStatus("Error");
				  }
				}, 'json');
				$("#dropLayer").remove();
		  }
	  });
     }
	});
	
  $("#people_list > li").dblclick( function(event){
		personFloatListDBClick(event, $(this));
   });
   
  $(".DelPersonDiv").click( function() {
  
	if ( SelectedPerson != "" )
	{
		showLightMsg("מחיקת אורח", "האם לבצע פעולת מחיקה ל"+ SelectedPerson.context.id.replace(/\_/g," ") + "?", "YESNO", "Question");
		currentMsgTimer = setTimeout("delPerson()",500);
	}
	else
	{
		showLightMsg("מחיקת אורח מהרשימה","יש לבחור אורח מהרשימה הצפה.","OK","Notice")
	}
  });

  $(document).keypress(function(e) {
   var code = (e.keyCode ? e.keyCode : e.which);
   if(code == 46) { //Del keycode
   	  	if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
		{
			delTableButtonPress();
		}
		else
		{
			$(".DelDiv").click();
		}
   }
  });
  
  $("#SearchBy").change(function(){$("#SearchCaption").keypress();});
  $("#SearchCaption").mousedown(function(){$("#SearchCaption").keypress();});
  $("#SearchCaption").keypress(function() {
  	$("input#SearchCaption").autocomplete({
		source:[""]
	});
  	if ($("#SearchBy").val() == "Table")
	{
		 $.post('/canvas/findTables/', {name: $(this).val()},
		 function(data){
		   if (data.status == 'OK')
		   {
				searchResult =	data.objects.split(",",data.numOfResults + 1);
				$("input#SearchCaption").autocomplete({
					minChars: 0,
					autoFocus: true,
					source: searchResult
				});
		   }
		   }, 'json');
	}
	else
	{
		$.post('/canvas/findPersons/', {name: $(this).val()},
		 function(data){
		   if (data.status == 'OK')
		   {
				searchResult =	data.objects.split(",",data.numOfResults + 1);
				$("input#SearchCaption").autocomplete({
					minChars: 0,
					autoFocus: true,
					source: searchResult
				});
		   }
		   }, 'json');
	}
  });
  $("#SearchButton").click( function() {
	if ($("#SearchBy").val() == "Table")
	{
		var currentSelectedElement = SelectedTable;
		$(".DragDiv").each(function(i) {
			var elementCaption = $(this).context.getElementsByTagName("p");
			
			if (elementCaption[0].firstChild.nodeValue.trim().toLowerCase() == $("#SearchCaption").val().trim().toLowerCase()) {
				var findElement = $(this);
				if (detailsMode)
				{
						var event = jQuery.Event("dblclick");
						event.user = "SearchTable";
						event.pass = $(this).context.id;
						$("#personImg").trigger(event);
				}
				else if (tableMode)
				{
					proccedSearchOnRegluarMode($(this).context.id);
				}
				else
				{
					pointTableAfterSearch(findElement);
				}
				return false;
			}
		});
	}
	else
	{
		var fullName = $("#SearchCaption").val();

		$.post('/canvas/getPersonItemByFullName/', {full_name: fullName},
        function(data){
			if (data.status == 'OK')
			{
				if (data.position > 0)
				{
					if (detailsMode)
					{
						var event = jQuery.Event("dblclick");
						event.user = "SearchGuest";
						event.pass = data.elem_num +"," + data.position;
						$("#personImg").trigger(event);
					}
					else if (tableMode)
					{
						var newData = data.elem_num +"," + data.position + ",Selected"
						proccedSearchOnTableMode(newData.split(",",3));
					}
					else
					{
						var event = jQuery.Event("dblclick");
						event.user = "SearchGuest";
						event.pass = data.elem_num +"," + data.position;
						$("#DragDiv-" + data.elem_num).trigger(event);
					}
				}
				else
				{
					$("#people_list > li").each(function(i) {
						$(this).removeClass('ui-multisort-click');
						if ($(this).context.id == data.first_name +"_"+ data.last_name )
						{
							$(this).addClass('ui-multisort-click');
							$("#people-list").scrollTop(parseInt($(this).index()) * 20);
						}
					});
				}
			}
			}, 'json');
	}
	});
  $("#MaxGuestSaveButton").click( function() { 
  var numOfGuests;
  if (SelectedElem != "" ) {
			numOfGuests = updateNumOfGuest();
			saveNumOfGuests(numOfGuests);
	}
	
	if ($("#people_list > li").size() + findNumOfAllSeaters() < numOfGuests)
	{
		$("#AddPersonDivID").replaceWith('<div class="AddPersonDiv"  id="AddPersonDivID" title="Add Person To Float List" ><img id="AddPersonDivImg" width=30 height=30 src="http://www.getempower.com/apps/50/icons/icon_50x50.png"></div>');
			$("#AddPersonDivID").bind('click',function(){$('ul.AddPerson').slideToggle('medium');});
	}
	else
	{
		$(".AddPersonDiv").unbind('click');
		$(".AddPersonDiv").attr('title',"You Got Max Guest As Possible");
		$("#AddPersonDivImg").attr('src',"/static/canvas/images/addPersonDisable.png");
	}
  });
  
  $("#NumOfGuests").after(function(){
    refreshNumOfGuests();
  }); 
  
  $("#NumOfGuests").keydown(function(e){
    insureNumInput(e);
  });  
  
  $("#ElementNumber").keydown(function(e){
    insureNumInput(e);
  });

  $("#ElementCaption").after(function(){
    $(this).val("");
  }); 

  $("#ElementSize").after(function(){
    $(this).val("");
  });

  $("#first_name").after(function(){
    $(this).val("");
  });
  
  $("#last_name").after(function(){
    $(this).val("");
  });

  $(".AddPersonDiv").after(function(){  
    var personsSum = $("#people_list > li").size() + findNumOfAllSeaters();
	if (personsSum >= $("#NumOfGuests").val() || personsSum >= maxGuests)
	{
		$(".AddPersonDiv").unbind('click');
		$(".AddPersonDiv").attr('title',"You Got Max Guest As Possible");
		$("#AddPersonDivImg").attr('src',"/static/canvas/images/addPersonDisable.png");
	}
  });
  
  $(".AddDiv").after(function(){  
	/*if ($(".DragDiv").size() >= maxTablesInCanvas)
	{
		$(".AddDiv").unbind('click');
		$(".AddDiv").attr('title',"Can't Add More Then " + maxTablesInCanvas + " Elements");
		$("#AddDivImg").attr('src',"/static/canvas/images/addDisable.png");
	}*/
  });
  
  $(document).mouseup(function(e) {
   if (!($(e.target).hasClass('DragDiv')) && !($(e.target).hasClass('DragNonDropDiv'))&&!($(e.target).hasClass('Property'))){
      if (SelectedElem != "" && !tableMode && !detailsMode) {
	  	if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
		{
			$("#borderSelected").css('top',SelectedElem.position().top - 3);
			$("#borderSelected").css('left',SelectedElem.position().left - 3);
			$("#borderSelected").css('width',SelectedElem.width() + 6);
			$("#borderSelected").css('height',SelectedElem.height() + 6);
			$("#borderSelected").addClass('borderSelected');
			SelectedElem.css('zIndex',1000);	
		}
		else
		{
			SelectedElem.addClass('borderSelected');
		}
      }
    }
	isMousePressFromCanvas = false;
	});
	
	/*$(document).before(function(){
		ShowHourGlassWaitingWindow(false);
	});

	$(document).after(function(){
		HideHourGlassWaitingWindow();
	});*/
	
	$(".ExitCanvasDiv").click(function(){
		showLightMsg("יציאה מהמערכת", "האם לצאת מהמערכת?", "YESNO", "Question");
		currentMsgTimer = setTimeout("exitSys()",500);
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
            !(/^(\/\/|http:|https:)./.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});

