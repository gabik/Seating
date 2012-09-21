var maleAdd = true;
var lastMaleAdd = true;
var addPersonDivOpen = false;
var SelectedElem = "" ;
var SelectedPerson = "" ;
var startDradPositionList = "";
var undoElementList = "";
var maxElementCapacity = 24;
var multiSelection = false;
var isMousePressFromCanvas = false;
var maxGuests = 2001;
var addPersonDivOpen = false;
var propMenuOpen = false;
var fromPropMeneBtn = false;
var currentMsgTimer = "";
var floatListOriginalPosition = "";
var occDetailsOpen = false;
var resizableLastWidth = 0;
var resizableLastHeight = 0;
var screenResHeightFixNum = 768;
var screenResWidthFixNum = 1366;
var XColPoint = "";
var drag = false;

if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

function getElementCenter(element)
{
	var offset = element.offset();
	var width = element.width();
	var height = element.height();

	var centerX = offset.left + width / 2;
	var centerY = offset.top + height / 2;
	
	return [centerX, centerY];
}

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
	   $("#SaveStateImg").attr("src", "/static/canvas/images/save_status/waiting.png");
	}
	else if (status == "Error")
	{
	   $("#SaveStateImg").attr("src", "/static/canvas/images/save_status/error.png");
	   showLightMsg("שגיאה","התרחשה שגיאה במערכת, יתכן ולא נשמרו פעולות אחרונות ,יש לבצע פעולה בשנית ולבדוק את חיבור וטיב התקשורת.","OK","Error");
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
  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
  {
	$("#people_list > li").each(function(i){
		refactorElementPerson($(this));
	});
  }
}

function refactorElementPerson(element)
{
	var full_name = element.attr('id');
	var deltaToRemove = 5;
	
	if (navigator.userAgent.toLowerCase().indexOf('chrome') > 0)
	{
		deltaToRemove = 6;
	}
	
	full_name = full_name.replace(/\_/g," ")
	
	if (full_name.length * 11 > $("#people_list").width() - 15 || full_name.length > 10)
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

function setWidthAndHeight(element, newScale, lastScale, init)
 {
	var elementTable = element.context.getElementsByTagName("table");
	var elementCaption = element.context.getElementsByTagName("p");
	var zoomWidth = 0;
	var zoomHeight = 0;
	var scale = 0;
	
	if (newScale == 0)
	{
		return;
	}
	
	if (lastScale > 0)
	{
		scale =  (newScale - lastScale)  * 2;
		
		if ($(".DragDiv").size() > 45 && !init)
		{
			var zoomSize = $(".DragDiv").size() / 30;
			zoomSize = zoomSize + 30;
			
			var zoomScale = (22 - zoomSize) * 2;
			var def = (newScale - maxElementCapacity - 2) * 2;
			
			zoomWidth = 90 + def + zoomScale;
			zoomHeight = zoomWidth;
		}
	}
	else
	{
		scale =  (newScale - maxElementCapacity - 2) * 2;
	}
	
	for (var i = 0; i < 1 ; i++)
	{
		var addHeight = 0;
		var addWidth = 0;
		var img = $("#"+ elementTable[i].id);
		
		if (elementTable[i].id.indexOf("Rect") > -1 && lastScale == 0)
		{
			addHeight = 16;
		}
		else if (elementTable[i].id.split("-", 1) == "dance_stand")
		{
			addWidth = 150;
		}
		else if (elementTable[i].id.split("-", 1) ==  "bar_stand") 
		{
			addWidth = 65;
		}

		if (i > 0)
		{
			img.animate({ width:img.width() + scale / 3, height: img.height() + scale / 3},300, 'linear');
		}
		else
		{
			if ($(".DragDiv").size() > 45 && !init)
			{
				img.animate({ width:zoomWidth, height: zoomHeight + addHeight},300, 'linear');
			}
			else
			{
				img.animate({ width:img.width() + scale + addWidth, height: img.height() + scale + addHeight},300, 'linear');
			}
		}
	}
	
	var finalWidth = element.width() + scale;
	var finalHeight = element.height() + scale + addHeight;
	
	if ($(".DragDiv").size() > 45 && !init)
	{
		finalWidth = zoomWidth;
		finalHeight = elementCaption[0].clientHeight + elementCaption[1].clientHeight + zoomHeight + addHeight;
	}
	
	element.animate({ width:finalWidth, height: finalHeight},300, 'linear', function()
	{
		if (lastScale > 0 && isThisPeopleTable(elementTable[0].id))
		{
			selectElement($(this));
		}
		if (!isThisPeopleTable(elementTable[0].id))
		{
					 
			 $(this).css('width', elementTable[0].width);
			 $(this).css('height', elementTable[0].height);
		}
		else
		{
			//adjustCaption($(this));
			if ($(".DragDiv").last().attr('id') == $(this).context.id && init) 
			{
				zoomingCanvas(true);
				$.post('/canvas/saveElementWidthHeight/', {elem_num:element.context.id , width:elementTable[0].width, height:elementTable[0].height},
			   function(data){
			   if (data.status == 'OK')
			   {}}, 'json');
			}
			else if ($(".DragDiv").size() > 45 && !init)
			{
				var elementMaxSize = elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1);
				
				var realScale =  (parseInt(elementMaxSize) - maxElementCapacity - 2) * 2;
				var addHeight = 0;
				
				if (elementTable[0].id.indexOf("Rect") > -1)
				{
					addHeight = 16;
				}
							
				$.post('/canvas/saveElementWidthHeight/', {elem_num:element.context.id , width:90 + realScale, height:90 + realScale + addHeight},
			   function(data){
			   if (data.status == 'OK')
			   {}}, 'json');
			}
			else
			{
				$.post('/canvas/saveElementWidthHeight/', {elem_num:element.context.id , width:elementTable[0].width, height:elementTable[0].height},
			   function(data){
			   if (data.status == 'OK')
			   {}}, 'json');
		   }
		}
	});
}

function ZoomElement(element, newScale, lastScale, firstInit)
 {
	var elementTable = element.context.getElementsByTagName("table");
	var elementCaption = element.context.getElementsByTagName("p");
	var scale = 0;
	var realWidth = 0;
	
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
		scale =  (newScale - maxElementCapacity - 2) * 2;
	}

	for (var i = 0; i < 1 ; i++)
	{
		var addHeight = 0;
		var addWidth = 0;
		var img = $("#"+ elementTable[i].id);
		
		if (elementTable[i].id.indexOf("Rect") > -1 && lastScale == 0)
		{
			addHeight = 16;
		}
		else if (elementTable[i].id.split("-", 1) == "dance_stand")
		{
			addWidth = 150;
	    }
		else if (elementTable[i].id.split("-", 1) ==  "bar_stand") 
		{
			addWidth = 65;
		}
		
		if (i > 0)
		{
			img.animate({ width:img.width() + scale / 3, height: img.height() + scale / 3},300, 'linear');
		}
		else
		{
			realWidth = img.width() + scale + addWidth;
			img.animate({ width:img.width() + scale + addWidth, height: img.height() + scale + addHeight},300, 'linear');
		}
	}
	element.animate({ width:realWidth, height: element.height() + scale + addHeight},300, 'linear', function()
	{
		if (isThisPeopleTable(elementTable[0].id))
		{
			//adjustCaption($(this));
		}
		if (firstInit)
		{
			setTimeout("reArrangeElementFirstInit()",6000);
		}
	});
}

function zoomingCanvas(firstInit)
{
	//zooming
		 if ($(".DragDiv").size() > 45)
		 {
			 var zoomSize = $(".DragDiv").size() / 30;
			 zoomSize = zoomSize + 30;
			 $(".DragDiv").each(function(i){
					if ($(".DragDiv").last().attr('id') == $(this).context.id && firstInit)
					{
						ZoomElement($(this),22, zoomSize, true);
					}
					else
					{
						ZoomElement($(this),22, zoomSize, false);
					}
			 });
		 }
}

function reArrangeElementFirstInit()
{
	$("#SquarePlaceMentShapes").click();
	$(".ShapePlacementMenu").hide();
}

function adjustCaption(element)
{
	var elementTable = element.context.getElementsByTagName("table");
	var elementCaption = element.context.getElementsByTagName("p");
	var textID = elementCaption[0].id;
	var text =  $("#" + textID).text();
	var title = $("#" + textID).attr('title');
	var realWidth = element.width();
	if (title.length * 6.2 > element.width() || (!tableMode && title.length > 10))
	{
		var newString = "";
		var stop = false;
		var letterCount = Math.abs(title.length - 10);
		
		if (letterCount == 0)
		{
			letterCount = 1;
		}

		for (var c = 0; c < letterCount; c++)
		{
			newString = newString + title.charAt(c);
			if (newString.length * 8 > $("#" + elementTable[0].id).width())
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

//Check if 2 objects intersect and returns collision point
function returnCollisionWithOtherElementPoint(element)
{
	var match = false;
	var colPoint = "";
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
				colPoint = [Math.max(pos[1][0],pos2[1][0]),Math.max(pos[0][0], pos2[0][0])];
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
					colPoint = [Math.max(pos[1][0],pos2[1][0]),Math.max(pos[0][0], pos2[0][0])];
					return false;
				}
			}
		});
	}
	
	return colPoint;
}

function collisionWithOtherElementWithOutNonDragElements(element)
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
	
	if (match)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function collisionWithOtherElementWithPos(element, posElem)
{
	var match = false;
	var pos = posElem;
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
        $.post('/canvas/personOnHigherPos/', {elem_num: element.context.id, new_size: parseInt(newSize) + 1},
	   function(data){
	   if (data.status == 'True')
	   { 
			showLightMsg("עדכון נתון גודל אלמנט", "ישנם אנשים במיקום גובה יותר, האם להחזיר אותם לרשימה?", "YESNO", "Question");
			currentMsgTimer = setTimeout(function(){saveElementWithCaptionoWhenSizeIsLower(element,newCaption,newSize, numOfGuests, fixNumber)},500);
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
	   }, 'json');
}

function reloadElementAfterSave(element,newCaption,newSize,sizeStr)
{
	var elementCaption = element.context.getElementsByTagName("p");
	var elementMaxSize = elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1);
	//setWidthAndHeight(element,newSize,elementMaxSize,false);
	elementCaption[0].innerHTML = newCaption;
	elementCaption[0].title = newCaption;
	elementCaption[1].innerHTML = sizeStr;
	reloadElementStatus(element, false);
}

function selectElement(element)
{
    if (SelectedElem != "") {
		SelectedElem.removeClass('borderSelected');
    }
    element.removeClass('borderSelected');
	if (!tableMode)
	{	  
	  if (!(element.hasClass('borderSelected')))
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
		var elementId = element.context.id;
		if (elementId == undefined)
		{
			elementId = element.attr('id');
		}
		$("#ElementSize").attr("value",elementCaption[1].firstChild.nodeValue.substr(		elementCaption[1].firstChild.nodeValue.indexOf("/")+1));
		$.post('/canvas/getFixNumber/', {elem_num: elementId},
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

function canFlip(element)
{
	var result = false;
	var elementTable = element.context.getElementsByTagName("table");

	if (elementTable[0].id.split("-", 1) == "Rect" || !(isThisPeopleTable(elementTable[0].id)))
	{
		if (!(collisionWithOtherElementWithPos(element,[ [ element.position().left, element.position().left + element.height() ], [ element.position().top, element.position().top + element.width() ] ])) && element.position().top + element.width() < $("#canvas-div").height() && element.position().left + element.height() < $("#canvas-div").width())
		{
			result = true;
		}
	}
	else
	{
		showLightMsg("סיבוב אלמנט","לא ניתן לסובב אלמנט מסוג זה מכיוון שהצורה הינה סימטרית.","OK","Notice");
	}
	
	return result;
}

function changeOrientation(element, select)
{
	$.post('/canvas/getElementOrientation/', {elem_num:element.context.id},
	  function(data){
	  if (data.status == 'OK')
	   {
	   		var elementTable = element.context.getElementsByTagName("table");
			if (elementTable[0].id.split("-", 1) == "Rect" || !(isThisPeopleTable(elementTable[0].id)))
			{
				var elementTempSize = element.width();
				
				if (isThisPeopleTable(elementTable[0].id))
				{
					//adjustCaption(element);
					element.find('p').first('width',element.width());
				}
				element.css('width', element.height());
				elementTable[0].width = element.height();
				element.css('height',elementTempSize);
				elementTable[0].height = elementTempSize;
				if (select)
				{
					selectElement(element);
				}
				$.post('/canvas/saveElementWidthHeight/', {elem_num:element.context.id , width:element.width(), height:element.height()},
			   function(data){
			   if (data.status == 'OK')
			   {	setSaveStatus("OK"); }}, 'json');
			}
	   }
	  }, 'json');
}

function reloadElementStatus(element, init)
{
	$.post('/canvas/getElementOrientation/', {elem_num:element.context.id},
	  function(data){
	  if (data.status == 'OK')
	   {
	   	var elementTable = element.context.getElementsByTagName("table");
		if (isThisPeopleTable(elementTable[0].id))
		{
			var elementCaption = element.context.getElementsByTagName("p");
			var elementSize = elementCaption[1].firstChild.nodeValue.split("/", 1);
			var elementMaxSize = elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1);
			
			//used for table status
			//if (elementSize == 0)
			//{
				if (elementTable[0].id.split("-", 1) == "Square") {
				  element.css("background-image", "url('/static/canvas/images/tables_small/SquareR.png')");
				  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
				  {
					  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/tables_small/SquareR.png',sizingMethod='scale');");
					  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/tables_small/SquareR.png',sizingMethod='scale')';");
				  }
				} else if (elementTable[0].id.split("-", 1) == "Round") {
					  element.css("background-image", "url('/static/canvas/images/tables_small/RoundR.png')");
					  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
					  {
						  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/tables_small/RoundR.png',sizingMethod='scale');");
						  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/tables_small/RoundR.png',sizingMethod='scale')';");
					  }
				}else if (elementTable[0].id.split("-", 1) == "Rect") {
					if (data.orientation == 'H' || data.orientation == 'FH')
					{
					  if (init)
					  {
					  	changeOrientation(element, false);
					  }
					  element.css("background-image", "url('/static/canvas/images/tables_small/RectR_H.png')");
					  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
					  {
						  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/tables_small/RectR_H.png',sizingMethod='scale');");
						  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/tables_small/RectR_H.png',sizingMethod='scale')';");
					  }
					}
					else
					{
					  element.css("background-image", "url('/static/canvas/images/tables_small/RectR.png')");
					  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
					  {
						  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/tables_small/RectR.png',sizingMethod='scale');");
						  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/tables_small/RectR.png',sizingMethod='scale')';");
					  }
					}
				}else if (elementTable[0].id.split("-", 1) == "Lozenge") {
					if (data.orientation == 'H' || data.orientation == 'FH')
					{
					  element.css("background-image", "url('/static/canvas/images/tables_small/LozengeR_H.png')");
					  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
					  {
						  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/tables_small/LozengeR_H.png',sizingMethod='scale');");
						  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/tables_small/LozengeR_H.png',sizingMethod='scale')';");
					  }
					}
					else
					{
					  element.css("background-image", "url('/static/canvas/images/tables_small/LozengeR.png')");
					  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
					  {
						  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/tables_small/LozengeR.png',sizingMethod='scale');");
						  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/tables_small/LozengeR.png',sizingMethod='scale')';");
					  }
					}
				}
			//}
			/*else if (elementSize == elementMaxSize)
			{
				if (elementTable[0].id.split("-", 1) == "Square") {
				  document.getElementById(elementTable[0].id).src = "/static/canvas/images/tables_small/SquareG.png";
				} else if (elementTable[0].id.split("-", 1) == "Round") {
					  document.getElementById(elementTable[0].id).src = "/static/canvas/images/tables_small/RoundG.png";
				}else if (elementTable[0].id.split("-", 1) == "Rect") {
					if (data.orientation == 'H' || data.orientation == 'FH')
					{
						document.getElementById(elementTable[0].id).src = "/static/canvas/images/tables_small/RectG_H.png";
					}
					else
					{
						document.getElementById(elementTable[0].id).src = "/static/canvas/images/tables_small/RectG.png";
					}
				}else if (elementTable[0].id.split("-", 1) == "Lozenge") {
					if (data.orientation == 'H' || data.orientation == 'FH')
					{
						document.getElementById(elementTable[0].id).src = "/static/canvas/images/tables_small/LozengeG_H.png";
					}
					else
					{
						document.getElementById(elementTable[0].id).src = "/static/canvas/images/tables_small/LozengeG.png";
					}
				}
			}
			else
			{
				if (elementTable[0].id.split("-", 1) == "Square") {
				  document.getElementById(elementTable[0].id).src = "/static/canvas/images/tables_small/SquareY.png";
				} else if (elementTable[0].id.split("-", 1) == "Round") {
					  document.getElementById(elementTable[0].id).src = "/static/canvas/images/tables_small/RoundY.png";
				}else if (elementTable[0].id.split("-", 1) == "Rect") {
					if (data.orientation == 'H' || data.orientation == 'FH')
					{
						document.getElementById(elementTable[0].id).src = "/static/canvas/images/tables_small/RectY_H.png";
					}
					else
					{
						document.getElementById(elementTable[0].id).src = "/static/canvas/images/tables_small/RectY.png";
					}
				}else if (elementTable[0].id.split("-", 1) == "Lozenge") {
					if (data.orientation == 'H' || data.orientation == 'FH')
					{
						document.getElementById(elementTable[0].id).src = "/static/canvas/images/tables_small/LozengeY_H.png";
					}
					else
					{
						document.getElementById(elementTable[0].id).src = "/static/canvas/images/tables_small/LozengeY.png";
					}
				}
			}*/
		}
		else
		{
			if (elementTable[0].id.split("-", 1) == "dance_stand")
			 {
				if (data.orientation == 'V')
				{
					  element.css("background-image", "url('/static/canvas/images/misc/dance.png')");
					  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
					  {
						  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dance.png',sizingMethod='scale');");
						  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dance.png',sizingMethod='scale')';");
					  }
				}
				else if (data.orientation == 'H')
				{
					  element.css("background-image", "url('/static/canvas/images/misc/dance_H.png')");
					  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
					  {
						  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dance_H.png',sizingMethod='scale');");
						  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dance_H.png',sizingMethod='scale')';");
					  }
				}
				else if (data.orientation == 'FV')
				{
					  element.css("background-image", "url('/static/canvas/images/misc/dance_FV.png')");
					  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
					  {
						  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dance_FV.png',sizingMethod='scale');");
						  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dance_FV.png',sizingMethod='scale')';");
					  }
				}
				else
				{
					  element.css("background-image", "url('/static/canvas/images/misc/dance_FH.png')");
					  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
					  {
						  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dance_FH.png',sizingMethod='scale');");
						  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dance_FH.png',sizingMethod='scale')';");
					  }
				}
			 }
			 else if (elementTable[0].id.split("-", 1) ==  "bar_stand") 
			 {
				if (data.orientation == 'V')
				{
					  element.css("background-image", "url('/static/canvas/images/misc/bar.png')");
					  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
					  {
						  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/bar.png',sizingMethod='scale');");
						  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/bar.png',sizingMethod='scale')';");
					  }
				}
				else if (data.orientation == 'H')
				{
					  element.css("background-image", "url('/static/canvas/images/misc/bar_h.png')");
					  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
					  {
						  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/bar_h.png',sizingMethod='scale');");
						  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/bar_h.png',sizingMethod='scale')';");
					  }
				}
				else if (data.orientation == 'FV')
				{
					  element.css("background-image", "url('/static/canvas/images/misc/bar_fV.png')");
					  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
					  {
						  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/bar_fV.png',sizingMethod='scale');");
						  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/bar_fV.png',sizingMethod='scale')';");
					  }
				}
				else
				{
					  element.css("background-image", "url('/static/canvas/images/misc/bar_fH.png')");
					  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
					  {
						  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/bar_fH.png',sizingMethod='scale');");
						  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/bar_fH.png',sizingMethod='scale')';");
					  }
				}
			 }
			 else if (elementTable[0].id.split("-", 1) ==  "dj_stand")
			 {
				if (data.orientation == 'V')
				{
					  element.css("background-image", "url('/static/canvas/images/misc/dj.png')");
					  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
					  {
						  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dj.png',sizingMethod='scale');");
						  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dj.png',sizingMethod='scale')';");
					  }
				}
				else if (data.orientation == 'H')
				{
					  element.css("background-image", "url('/static/canvas/images/misc/dj_H.png')");
					  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
					  {
						  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dj_H.png',sizingMethod='scale');");
						  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dj_H.png',sizingMethod='scale')';");
					  }
				}
				else if (data.orientation == 'FV')
				{
					  element.css("background-image", "url('/static/canvas/images/misc/dj_FV.png')");
					  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
					  {
						  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dj_FV.png',sizingMethod='scale');");
						  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dj_FV.png',sizingMethod='scale')';");
					  }
				}
				else
				{
					  element.css("background-image", "url('/static/canvas/images/misc/dj_FH.png')");
					  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
					  {
						  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dj_FH.png',sizingMethod='scale');");
						  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dj_FH.png',sizingMethod='scale')';");
					  }
				}
			 }
		}
		setSaveStatus("OK");
	   }
	   else
	   {
			setSaveStatus("Error");
	   }
	   }, 'json');
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

function cleanStringFromUnIDChars(str)
{
  str = str.replace(/\'/g,""); str = str.replace(/\"/g,""); str = str.replace(/\</g,""); str = str.replace(/\>/g,""); str = str.replace(/\?/g,""); str = str.replace(/\!/g,""); str = str.replace(/\@/g,""); str = str.replace(/\#/g,""); str = str.replace(/\$/g,""); str = str.replace(/\%/g,""); str = str.replace(/\^/g,""); str = str.replace(/\&/g,""); str = str.replace(/\*/g,""); str = str.replace(/\(/g,""); str = str.replace(/\)/g,""); str = str.replace(/\{/g,""); str = str.replace(/\}/g,""); str = str.replace(/\[/g,""); str = str.replace(/\]/g,""); str = str.replace(/\:/g,""); str = str.replace(/\;/g,""); str = str.replace(/\\/g,""); str = str.replace(/\+/g,""); str = str.replace(/\=/g,""); str = str.replace(/\//g,""); str = str.replace(/\./g,""); str = str.replace(/\,/g,""); str = str.replace(/\|/g,""); str = str.replace(/\`/g,""); str = str.replace(/\|/g,""); str = str.replace(/\~/g,"");
  
  return str;
}

function addPersonToFloatList(first_name,last_name, personGroup, amount)
{
	var numOfGuests = $("#NumOfGuests").val();
	
	if (numOfGuests > maxGuests)
	{
		showLightMsg("הוספת מוזמן","לא ניתן להזין עוד מוזמנים מפני שעברת את הכמות המותרת במערכת.","OK","Notice");
	}
	else if (numOfGuests <= $("#people_list > li").size() + findNumOfAllSeaters())
	{
		showLightMsg("הוספת מוזמן","עברת את כמות המוזמנים המקסימלית, יש לעדכן מספר מוזמנים מרבי לאירוע ולאחר מכן להוסיף.","OK","Notice");
	}
	else
	{
		if (first_name.trim() == "" && last_name.trim() == "")
		{
			showLightMsg("הוספת מוזמן","אין להשאיר שדה ריק, יש לוודא תקינות.","OK","Notice");
		}
		else
		{
			var gender = 'F';
			if (maleAdd)
			{
				gender = 'M';
			}
			$.post('/accounts/add_person/', {first: cleanStringFromUnIDChars(first_name), last: cleanStringFromUnIDChars(last_name), group: personGroup.trim(), gender:gender, amount:amount},
			  function(data){
				if (data.status == 'OK')
				{
					  writeOccasionInfo("Added Person " +first_name+" "+last_name);
					  ShowHourGlassWaitingWindow(true);
				}
			  }, 'json');
		}
	}
}

function closeAddInterface()
{
	if (addPersonDivOpen)
	{
		addPersonDivOpen=false;
	    lastMaleAdd = maleAdd;
		$('#AddPersonList').hide("slide", { direction: "right" }, 150);
	}
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
	drag = true;
	element.css('zIndex', 99);
	element.fadeTo(200, 0.3);
	startDradPositionList = new Array(1);
	startDradPositionList[0] = element.position();
    setSaveStatus("Waiting");
	posPropertyPanel("");
}

function stopDrag(element)
{
	drag = false;
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

function tableBackBtnClick()
{
	undoButtonPress();
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
	$("#personGroup").append($('<option value="Family ' + $("#firstPartnerName").text().trim()+'">משפחה '+ $("#firstPartnerName").text() + '</option>'));
	$("#personGroup").append($('<option value="Friends ' + $("#firstPartnerName").text().trim()+'">חברים '+ $("#firstPartnerName").text() + '</option>'));
	$("#personGroup").append($('<option value="Work ' + $("#firstPartnerName").text().trim()+'">עבודה '+ $("#firstPartnerName").text() + '</option>'));
	if ($("#addChar").text() == " " || $("#addChar").text() == '' || $("#firstPartnerName").text() == $("#secondPartnerName").text())
	{	
		$("#personGroup").append($('<option value="Family">משפחה כללי</option>'));
		$("#personGroup").append($('<option value="Work">חברים כללי</option>'));
		$("#personGroup").append($('<option value="Friends">עבודה כללי</option>'));
	}
	else
	{
		$("#personGroup").append($('<option value="Family ' + $("#secondPartnerName").text().trim()+'">משפחה '+ $("#secondPartnerName").text() + '</option>'));
		$("#personGroup").append($('<option value="Work ' + $("#secondPartnerName").text().trim()+'">חברים '+ $("#secondPartnerName").text() + '</option>'));
		$("#personGroup").append($('<option value="Friends ' + $("#secondPartnerName").text().trim()+'">עבודה '+ $("#secondPartnerName").text() + '</option>'));
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
	
	while (curtop + element.height() < $("#canvas-div").height())
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
		
		curleft = curleft + 45;
		if (curleft + element.width() >= $("#canvas-div").width() - offsetWidth)
		{
			curtop = curtop + 45;
			curleft = startposX;
		}
	}
	
	if (!placed)
	{
		element.css('top', startposY);
		element.css('left',startposX);
		saveElement(element);
		selectElement(element);
	}
}


function reposElementAtAFreeSpaceNonDrag(element, offsetWidth)
{
	var startposX = 20;
	var startposY = 45;
	var curtop = startposY;
	var curleft = startposX;
	var placed = false;
	
	while (curtop + element.height() < $("#canvas-div").height())
	{
		element.css('top',curtop);
		element.css('left',curleft);
		
		if (!collisionWithOtherElementWithOutNonDragElements(element))
		{
			saveElement(element);
			selectElement(element);
			placed = true;
			break;
		}
		
		curleft = curleft + 45;
		if (curleft + element.width() >= $("#canvas-div").width() - offsetWidth)
		{
			curtop = curtop + 45;
			curleft = startposX;
		}
	}
	
	if (!placed)
	{
		element.css('top', startposY);
		element.css('left',startposX);
		saveElement(element);
		selectElement(element);
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

function goBackToNewCanvas()
{
	if (MsgBoxLastAnswer == "OK")
	{
		$.post('/canvas/backToNewCanvas/', {},
		function(data){
				 if (data.status == 'OK')
				 {
					ShowHourGlassWaitingWindow(true);
				 }}, 'json');
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
		currentMsgTimer = setTimeout("goBackToNewCanvas()",500);
	}
}

function helpSys()
{
	if (MsgBoxLastAnswer == "OK")
	{
		window.open("/site/mainHelp.html", "_blank");
		clearTimeout(currentMsgTimer);
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
		currentMsgTimer = setTimeout("helpSys()",500);
	}
}

function delDivPress()
{
	if (MsgBoxLastAnswer == "OK")
	{
		//if (tableMode)
		//{
		//	DeletePerson();
		//	updateSeatedLabel();
		//	writeOccasionInfo("Move Person "+ SelectedPerson.context.id.replace(/\_/g," ") +"From Table " + SelectedElem.attr('title') +" To Float List.");
		//}
		//else
		//{
		if (SelectedElem != "") {
		  setSaveStatus("OK");
		  $.post('/canvas/delete/', {elem_num: SelectedElem.context.id},
				function(data){
			  if (data.status == 'OK')
			  { 
				  //undoElement[0] = SelectedElem;
				  //undoElement[1] = "add"; 
				  ShowHourGlassWaitingWindow(true);
				  writeOccasionInfo("Delete Table "+ SelectedElem.attr('title') +".");
			  }
			}, 'json');
		} else {
			if (!tableMode && !detailsMode)
			{
				showLightMsg("מחיקת אלמנט","יש לבחור אלמנט.","OK","Notice");
			}
		}
		//}
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

function delFromTable(id)
{
	 if (!drag)
	 {
		 selectElement($("#" + id));		
		  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
		  {
			delTableButtonPress();
		  }
		  else
		  {
			$(".DelDiv").click();
		  }
	}
}

function delPerson()
{
	if (MsgBoxLastAnswer == "OK")
	{
		var person = $('.ui-multisort-click').first();
		$.post('/canvas/delfp/', {person_id: person.attr('id')},
	   function(data){
		 if (data.status == 'OK')
		 {
		   person.remove();
		   var personsSum = $("#people_list > li").size() + findNumOfAllSeaters();
		   if (personsSum < $("#NumOfGuests").val() && personsSum < maxGuests)
		   {
				//$("#AddPersonDivID").replaceWith('<div class="AddPersonDiv"  id="AddPersonDivID" title="Add Person To Float List" ><img width=30 height=30 src="http://www.getempower.com/apps/50/icons/icon_50x50.png"></div>');
				//$("#AddPersonDivID").bind('click',function(){$('ul.AddPerson').slideToggle('medium');});
		   }
			writeOccasionInfo("Delete Person "+ person.attr('id').replace(/\_/g," ") +"From Float List.");
		   setSaveStatus("OK");
		   updateSeatedLabel();
		   rePaintPeopleList();
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

function dropPerson(draged,table, place)
{
	if (draged  != "")
	{
		var elementCaption = table.context.getElementsByTagName("p");
		var elementTable = table.context.getElementsByTagName("table");
		table.fadeTo(300, 0,function(){
		table.fadeTo(300, 1)});
		$.post('/canvas/sit/', {table_id: table.context.id, person_id: draged.context.id, place: place},
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
			reloadElementStatus(table, false);
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
}

function adjustResolution()
{
	if (screenResHeightFixNum < screen.height)
	{
		var delta =  screen.height - $("#canvas-div").height() - 138;
		
		$("#people-list").css('height', $("#people-list").height() + delta);
		$(".CanvasDiv").css('height', $(".CanvasDiv").height() + delta);
		$("#search-properties-list").css('top', $("#search-properties-list").position().top + delta);
		$("#occasionDetailsR").css('top', $("#occasionDetailsR").position().top + delta);
		$("#occasionDetailsAdvanceR").css('top', $("#occasionDetailsAdvanceR").position().top + delta);
		$("#canvasShadow").css('top', $("#canvasShadow").position().top + delta);
		$(".SaveState").css('top', $(".SaveState").position().top + delta);
	}
	
	$.post('/canvas/getMaxY/', {},
		function(data){
		  if (data.status == 'OK')
		  {
			if (data.MaxY > $("#canvas-div").height() + 35)
			{
				var delta =  data.MaxY  - $("#canvas-div").height() + 150;
		
				$("#people-list").css('height', $("#people-list").height() + delta);
				$(".CanvasDiv").css('height', $(".CanvasDiv").height() + delta);
				$("#search-properties-list").css('top', $("#search-properties-list").position().top + delta);
				$("#occasionDetailsR").css('top', $("#occasionDetailsR").position().top + delta);
				$("#occasionDetailsAdvanceR").css('top', $("#occasionDetailsAdvanceR").position().top + delta);
				$("#canvasShadow").css('top', $("#canvasShadow").position().top + delta);
				$(".SaveState").css('top', $(".SaveState").position().top + delta);
			}
	    	setSaveStatus("OK");
		  }
		  else
		  {
     		setSaveStatus("Error");
		  }
		}, 'json');
		
	if (screenResWidthFixNum < screen.width)
	{
		var delta =  screen.width - $("#canvas-div").width() - 170;
		
		$("#movingPanel").css('width', $("#movingPanel").width() + delta);
		$("#movingPanelMarquee").css('width', $("#movingPanelMarquee").width() + delta);
		$("#people-list").css('left', $("#people-list").position().left + delta);
		$(".CanvasDiv").css('width', $(".CanvasDiv").width() + delta);
		$("#float-list").css('left', $("#float-list").position().left + delta);
		$("#search-properties-list").css('left', $("#search-properties-list").position().left + delta);
		$("#occasionDetailsR").css('left', $("#occasionDetailsR").position().left + delta);
		$("#occasionDetailsAdvanceR").css('left', $("#occasionDetailsAdvanceR").position().left + delta);
		$("#canvasShadow").css('left', $("#canvasShadow").position().left + delta);
		$(".SaveState").css('left', $(".SaveState").position().left + delta);
	}
	
	$.post('/canvas/getMaxX/', {},
		function(data){
		  if (data.status == 'OK')
		  {
			if (data.MaxX > $("#canvas-div").width() + 35)
			{
				var delta =  data.MaxX  - $("#canvas-div").height() + 172;
		
				$("#movingPanel").css('width', $("#movingPanel").width() + delta);
				$("#movingPanelMarquee").css('width', $("#movingPanelMarquee").width() + delta);
				$("#people-list").css('left', $("#people-list").position().left + delta);
				$(".CanvasDiv").css('width', $(".CanvasDiv").width() + delta);
				$("#float-list").css('left', $("#float-list").position().left + delta);
				$("#search-properties-list").css('left', $("#search-properties-list").position().left + delta);
				$("#occasionDetailsR").css('left', $("#occasionDetailsR").position().left + delta);
				$("#occasionDetailsAdvanceR").css('left', $("#occasionDetailsAdvanceR").position().left + delta);
				$("#canvasShadow").css('left', $("#canvasShadow").position().left + delta);
				$(".SaveState").css('left', $(".SaveState").position().left + delta);
			}
	    	setSaveStatus("OK");
		  }
		  else
		  {
     		setSaveStatus("Error");
		  }
	}, 'json');		
}

function saveTableSitting(table)
{
	var elementSize = table.find('p').last().text().split("/", 1);
	
	clearTimeout(currentMsgTimer);
	currentMsgTimer = "";
	$.post('/canvas/saveElementCurrentSitting/', {elem_num:table.context.id, currentSitting: parseInt(elementSize)},
		function(data){
		  if (data.status == 'OK')
		  {
			  setSaveStatus("OK");
		  }
		  else{
			setSaveStatus("Error");
		  }
		}, 'json');
}

function HelpScreen()
{
	window.open("/site/mainHelp.html", "_blank");
}

$(document).ready(function() {
 var sortFloatListByNameAscending = true
 var sortFloatListByGroupAscending = true
 var i;
  
  var numOfElementsComboBox = 1;//document.getElementById("numOfElementsComboBox");
  $("#ElementPropertiesSaveButton").removeAttr('disabled');
  $("#ElementCaption").removeAttr('disabled');
  $("#ElementSize").removeAttr('disabled');
  refactoringListName();
  posPropertyPanel("");
  updateSeatedLabel();
  $("#personAmountSingle").val("1");
  sortListByName("people_list",sortFloatListByNameAscending);
  $("#people-list").removeClass('class_overflow_hidden');
  $("#people-list").addClass('class_overflow_auto');
  updateGroups();

  $("#float-list").after(function() {
	floatListOriginalPosition = $("#float-list").position();
  });
  $(".DragDiv").after(function() {
	 var elementCaption = $(this).context.getElementsByTagName("p");
	 var elementMaxSize = elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1);
	 var elementTable = $(this).context.getElementsByTagName("table");
	 elementCaption[0].title = elementCaption[0].firstChild.nodeValue;
	 //setWidthAndHeight($(this),elementMaxSize,0);
 
	 if (!isThisPeopleTable(elementTable[0].id))
     {
		 //elementCaption[1].style.visibility = "hidden";
		 $(this).find('p').each(function(i){ $(this).remove(); });
		 $(this).removeClass('DragDiv');
		 //setWidthAndHeight($(this),35,22);
		 if (elementTable[0].id.split("-", 1) == "dance_stand")
		 {
			$(this).attr('title',"רחבת ריקודים");
			$(this).find('.tableProp').remove();
		 }
	     else if (elementTable[0].id.split("-", 1) ==  "bar_stand") 
		 {
			$(this).attr('title',"בר משקאות");	
			$(this).find('.tableProp').remove();
		 }
	     else if (elementTable[0].id.split("-", 1) ==  "dj_stand")
		 {
			$(this).attr('title',"עמדת דיי ג'יי");	
			$(this).find('.tableProp').remove();
		 }
		 $(this).addClass('DragNonDropDiv');		 
	 }
	 reloadElementStatus($(this), true); 
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
	var amount = document.getElementById("personAmountSingle").value;
	
	addPersonToFloatList(first_name,last_name, group, amount);
  });
  
  $(".DragDiv").click( function() {
     selectElement($(this));
  });  
  
  $(".DragDiv").mouseup( function(e) {
	  if (navigator.userAgent.toLowerCase().indexOf('ie 8') > 0 || navigator.userAgent.toLowerCase().indexOf('ie 7') > 0)
		   {
				var element = $("#delProp_" + $(this).context.id);
				
				if (element.offset().top <= e.pageY && element.offset().top + element.height() >= e.pageY &&
				element.offset().left <= e.pageX && element.offset().left + element.width() >= e.pageX)
				{
					delFromTable($(this).context.id);
				}
				else 
				{
					element = $("#elemProp_" + $(this).context.id);
					
					if (element.offset().top <= e.pageY && element.offset().top + element.height() >= e.pageY &&
					element.offset().left <= e.pageX && element.offset().left + element.width() >= e.pageX)
					{
						propMenuBtnClick($(this).context.id);
					}
					else 
					{
						element = $("#elemBack_" + $(this).context.id);
						
						if (element.offset().top <= e.pageY && element.offset().top + element.height() >= e.pageY &&
						element.offset().left <= e.pageX && element.offset().left + element.width() >= e.pageX)
						{
							tableBackBtnClick();
						}
					}
				}
		   }
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
	 drag: function (e,ui){ 

		XColPoint = returnCollisionWithOtherElementPoint($(this));

		if (XColPoint != "")
		{
			if (parseInt($("#DragCollisionImg").css('top')) > 0 && parseInt($("#DragCollisionImg").css('left')) > 0)
			{
				$("#DragCollisionImg").css('top', XColPoint[0]);
				$("#DragCollisionImg").css('left',XColPoint[1]);
			}
			else
			{
				$("#canvas-div").append($('<img id="DragCollisionImg" src="/static/canvas/images/X.png" style="top:' + XColPoint[0] + '; left:' + XColPoint[1] + '; position:absolute; z-index:99999;"/>'));
			}
		}
		else
		{
			$("#DragCollisionImg").remove();
		}
	 },
     stop: function (e,ui){
	 	$("#DragCollisionImg").remove();
		if (XColPoint != "")
		{
			showLightMsg("הזזת שולחנות","לא ניתן להציב אלמנט על אלמנט אחר, יש להציב בשטח ריק, האלמנט יחזור למקומו הקודם.","OK","Notice");  
		}
		XColPoint = "";
		stopDrag($(this));
       }
  }); 
  
  $(".DragDiv").draggable({
     containment: 'parent',
	 cursor: "move",
     start: function (e,ui){
		startDrag($(this));
     },
	 drag: function (e,ui){ 
	 
		XColPoint = returnCollisionWithOtherElementPoint($(this));
		
		if (XColPoint != "")
		{
			if (parseInt($("#DragCollisionImg").css('top')) > 0 && parseInt($("#DragCollisionImg").css('left')) > 0)
			{
				$("#DragCollisionImg").css('top', XColPoint[0]);
				$("#DragCollisionImg").css('left',XColPoint[1]);
			}
			else
			{
				$("#canvas-div").append($('<img id="DragCollisionImg" src="/static/canvas/images/X.png" style="top:' + XColPoint[0] + '; left:' + XColPoint[1] + '; position:absolute; z-index:99999;"/>'));
			}
		}
		else
		{
			$("#DragCollisionImg").remove();
		}
	 },
     stop: function (e,ui){
		$("#DragCollisionImg").remove();
		if (XColPoint != "")
		{
			showLightMsg("הזזת שולחנות","לא ניתן להציב אלמנט על אלמנט אחר, יש להציב בשטח ריק, האלמנט יחזור למקומו הקודם.","OK","Notice");
		}
		XColPoint = "";
		stopDrag($(this));
       }
  });
  
  $(".DragDiv").droppable({
  	accept: "#people_list li",
	hoverClass: "personOverTableDropLayer",
    drop: function(e, ui ) {
	  var elementTable = $(this).context.getElementsByTagName("table");
	  if (!isThisPeopleTable(elementTable[0].id))
	  {
		return;
	  }
	  var table = $(this);
	  var multiPos = false; 
	  var dataMultiStrings = "";
	
	  ui.helper.each(function(i){
			if (ui.helper.size() == 1)
			{
				dropPerson($(this), table, ""); 
			}
			else if (ui.helper.size() > 1)
			{
				multiPos = true;
				
				dataMultiStrings = dataMultiStrings + table.context.id + "," + $(this).context.id + "|";
			}
		  });
		  
		  if (multiPos)
		  {
			  $.post('/canvas/sitMulti/', {DataString: dataMultiStrings},
				function(data){
				  if (data.status == 'OK')
				  {
					  setSaveStatus("OK");
					  var dataMultiStrings = data.dataPositions.split("|",ui.helper.size());
					  ui.helper.each(function(i){
					  	 dropPerson($(this), table, dataMultiStrings[i]); 
					  });
					  currentMsgTimer = setTimeout(function(){saveTableSitting(table)},2000);
				  }
				  else{
					setSaveStatus("Error");
				  }
				}, 'json');
		  }
		}
	  });
	  
	$(".DragNonDropDiv").resizable({
		handles: 'n, e, s, w, ne, se, sw, nw',
		maxHeight:280,
		maxWidth:280,
		minHeight:40,
		minWidth:40,
		containment: 'parent',
		start: function (e,ui){
			resizableLastWidth = $(this).width();
			resizableLastHeight = $(this).height();
			startDradPositionList[0] = $(this).position();
		},
		resize: function (e,ui){
			var imgResize = $(this).find('img').first();
			imgResize.css('width',$(this).width());
			imgResize.css('height',$(this).height());
		},
		stop: function (e,ui){
			if (collisionWithOtherElement($(this)))
			{
			    $(this).animate({top:startDradPositionList[0].top, left:startDradPositionList[0].left, width: resizableLastWidth , height: resizableLastHeight},300, 'linear', function() {
					var imgResize = $(this).find('img').first();
					imgResize.css('width',resizableLastWidth);
					imgResize.css('height',resizableLastHeight);
					$(this).css('width',resizableLastWidth);
					$(this).css('height',resizableLastHeight);
					selectElement($(this));
				});
				
			}
			else
			{
				$.post('/canvas/saveElementWidthHeight/', {elem_num:$(this).context.id , width:$(this).width(), height:$(this).height()},
			   function(data){
				   if (data.status == 'OK')
				   {
						setSaveStatus("OK");
				   } 
				   else
				   {
						setSaveStatus("Error");
				   }
				}
				, 'json');
			}
		}
	});
	
  $("#people_list > li").dblclick( function(event){
		personFloatListDBClick(event, $(this));
   });
   
  $(".DelPersonDiv").click( function() {
	var person = $('.ui-multisort-click').first();
	
	if (person.hasClass('ui-multisort-click'))
	{
		showLightMsg("מחיקת מוזמן", "האם ברצונך למחוק את מוזמן "+ person.attr('id').replace(/\_/g," ") + "?", "YESNO", "Question");
		currentMsgTimer = setTimeout("delPerson()",500);
	}
	else
	{
		showLightMsg("מחיקת מוזמן מהרשימה","יש לבחור מוזמן מהרשימה הצפה.","OK","Notice")
	}
  });

  $(document).keypress(function(e) {
   var code = (e.keyCode ? e.keyCode : e.which);
   if(code == 46) { //Del keycode
   	  	//if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
		//{
		//	delTableButtonPress();
		//}
		//else
		//{
		//	$(".DelDiv").click();
		//}
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

			if (elementCaption[0].firstChild.parentNode.title.trim().toLowerCase() == $("#SearchCaption").val().trim().toLowerCase()) {
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
		numOfGuests = updateNumOfGuest();
		saveNumOfGuests(numOfGuests);
	
	//if ($("#people_list > li").size() + findNumOfAllSeaters() < numOfGuests)
	//{
		//$("#AddPersonDivID").replaceWith('<div class="AddPersonDiv"  id="AddPersonDivID" title="Add Person To Float List" ><img id="AddPersonDivImg" width=30 height=30 src="http://www.getempower.com/apps/50/icons/icon_50x50.png"></div>');
			//$("#AddPersonDivID").bind('click',function(){$('ul.AddPerson').slideToggle('medium');});
	//}
	//else
	//{
		//$(".AddPersonDiv").unbind('click');
		//$(".AddPersonDiv").attr('title',"You Got Max Guest As Possible");
		//$("#AddPersonDivImg").attr('src',"/static/canvas/images/addPersonDisable.png");
	//}
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
  
  $(".SpinDiv").click(function(){ 
	if (SelectedElem != "")
	{
		if (canFlip(SelectedElem))
		{
			 $.post('/canvas/changeElementOrientation/', {elem_num:SelectedElem.context.id},
				   function(data){
				   if (data.status == 'OK')
				   {
						setSaveStatus("OK");
						reloadElementStatus(SelectedElem, false);
						changeOrientation(SelectedElem, true);
				   }
				   else
				   {
						setSaveStatus("Error");
				   }
				   }, 'json');
		}
		else
		{	
			var elementTable = SelectedElem.context.getElementsByTagName("table");

			if (elementTable[0].id.split("-", 1) == "Rect" || !(isThisPeopleTable(elementTable[0].id)))
			{
				showLightMsg("סיבוב אלמנט","לא ניתן לסובב את האובייקט מכיוון שאובייקט אחר נמצא בדרכו, יש לרווח את השטח כדי לבצע סיבוב.","OK","Notice");
			}
		}
	}
  });
 
  $(document).mouseup(function(e) {
	if (!($(e.target).hasClass('DragDiv')) && !($(e.target).hasClass('DragNonDropDiv'))&&!($(e.target).hasClass('Property'))){
	  if (SelectedElem != "" && !tableMode && !detailsMode) {
			SelectedElem.removeClass('borderSelected');
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
	
	$("#float-list").draggable({
     containment: 'body',
	 cursor: "move",
     start: function (e,ui){
		$("body").css("overflow", "hidden");
     },
	 stop: function (e,ui){
		$("body").css("overflow", "auto");
     }
   });

	$("#floatListPin").click(function(){
		if (!tableMode && !detailsMode)
		{
			if 	($(this).attr('alt') == "P")
			{
				$(this).attr('src',"/static/canvas/icons/pin_off_r.png");
				$(this).attr('alt',"NP"); 
				$("#float-list").draggable( 'enable' );
				$("#float-list").addClass('pointer');
			}
			else
			{
				$(this).attr('src',"/static/canvas/icons/pin_on_r.png");
				$(this).attr('alt',"P"); 
				$("#float-list").draggable( 'disable' );
				$("#float-list").fadeTo(0, 1);
				$("#float-list").animate({ top: floatListOriginalPosition.top, left: floatListOriginalPosition.left},300, 'linear');
				$("#float-list").removeClass('pointer');
			}
		}
	});
	
	$("#occassionDetailsAdvanceBtn").mouseout(function(){
		if (!occDetailsOpen)
			$(this).attr('src',"/static/page/images/expander_left_n.png");
		else
			$(this).attr('src',"/static/page/images/expander_right_n.png");
	});
	$("#occassionDetailsAdvanceBtn").mouseover(function(){
		if (!occDetailsOpen)
			$(this).attr('src',"/static/page/images/expander_left_r.png");
		else
			$(this).attr('src',"/static/page/images/expander_right_r.png");
	});
	$("#occassionDetailsAdvanceBtn").click(function(){
		occDetailsOpen = !occDetailsOpen;
		if (!occDetailsOpen)
		{
			$(this).attr('src',"/static/page/images/expander_left_r.png");
			$("#occasionDetailsAdvanceR").hide("slide", { direction: "right" }, 150);
		}
		else
		{
			$.post('/canvas/getOccasionMealAndInvDetails/', {},
				   function(data){
				   if (data.status == 'OK')
				   {
						setSaveStatus("OK");
						$("#inv_accept_amount").text(data.GuestsInvAccept);
						$("#inv_tentative_amount").text(data.GuestsTentativeInv);
						$("#inv_noaccept_amount").text(data.GuestsInvNotAccept);
						$("#meat_amount").text(data.GuestsMeatMeal);
						$("#veg_amount").text(data.GuestsVegMeal);
						$("#glat_amount").text(data.GuestsGlatMeal);
					}
				   else
				   {
						setSaveStatus("Error");
				   }
				   }, 'json');
			$(this).attr('src',"/static/page/images/expander_right_r.png");
			$("#occasionDetailsAdvanceR").show("slide", { direction: "right" }, 150);
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
            !(/^(\/\/|http:|https:)./.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});


