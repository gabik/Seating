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
var dropAllow = true;
var zoomingMode = false;

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
	   showLightMsg("שגיאה","התרחשה שגיאה במערכת, יתכן ולא נשמרו פעולות אחרונות ,יש לבצע פעולה בשנית ולבדוק את חיבור וטיב התקשורת. במידה והבעיה נמשכת יש לפנות לתמיכה.","OK","Error");
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
	
function posTableChairsWithData(data, element, elementMaxSize)
{
	var tableElementSize = 16;
	var elementTable = element.context.getElementsByTagName("table");
	var elemID = element.context.id;
	var mode = "T";
	var posString = "";
		
	
	if (!zoomingMode)
	{
		tableElementSize = Math.max((40 - elementMaxSize), 24);
	}
		
	if (!tableMode)
	{
		mode = "NT";
	}
	
	var cTop = ((element.position().top * 2 + element.height()) / 2)  - 8
	var cLeft =  ((element.position().left * 2 + element.width()) / 2) - 8;
	var increase = Math.PI * 2 / elementMaxSize;
	var center = [cLeft , cTop];
	if (elementTable[0].id.split("-", 1) == "Round" || elementTable[0].id.split("-", 1) == "Lozenge") 
	{
		var def = 1.5;
		center[1] = center[1] - ((maxElementCapacity - elementMaxSize) * 0.5) ;
		center[0] = center[0] - ((maxElementCapacity - elementMaxSize) * 0.5) ;
		
		if (parseInt(maxElementCapacity) - 6 < parseInt(elementMaxSize))
		{
			def = 1.61;
			if (!(navigator.userAgent.toLowerCase().indexOf('ie') > 0))
			{
				center[1] = center[1] - Math.max((4.2 - (maxElementCapacity - elementMaxSize)), 2.2);
				center[0] = center[0] - Math.max((4.2 - (maxElementCapacity - elementMaxSize)), 2.2);
			}
		}
		else if (parseInt(maxElementCapacity) / 2 < parseInt(elementMaxSize))
		{
			def = 1.6;
		}
		
		if (elementTable[0].id.split("-", 1) == "Lozenge")
		{
			def += 0.3;
		}
		
		var angle = (increase * elementMaxSize) / 2;

	
		for (i=0; i < parseInt(elementMaxSize); i++)
		{
			if (i >  parseInt(elementMaxSize) / 2)
			{
				createTableElementWithData(data[i + 1], i,element,true, false);
			}
			else
			{
				createTableElementWithData(data[i + 1], i,element,false, false);
			}
			$("#tableParentElementDiv"+ parseInt(i + 1) + elemID + mode).css( "top", center[1] +  (element.width() / def) * Math.cos(angle));
			$("#tableParentElementDiv"+ parseInt(i + 1)+ elemID + mode).css( "left", center[0] + (element.height() / def) * Math.sin(angle));
			angle -= increase;
			
			if (i == elementMaxSize - 1)
			{
				posString = posString + i;
			}
			else
			{
				posString = posString + i + "|";
			}
		}
	}
	else
	{
		var maxElementAngle = elementMaxSize;

		
		if (maxElementAngle < 7)
		{
			maxElementAngle = 8;
			
			if (!zoomingMode)
			{
				tableElementSize = 33;
			}
		}
		if (maxElementAngle < 8)
		{
			maxElementAngle = 8;
			
			if (!zoomingMode)
			{
				tableElementSize = Math.max((40 - maxElementAngle), 24);
			}
		}
		else
		{
			if  (elementMaxSize % 2 == 1)
			{
				maxElementAngle = maxElementAngle - 1;
			}
		}
		var realTableElementSize = (40 - maxElementAngle) + 0.25;
		var countToChangeSide = 0;
		var side = 0;
		var slice = maxElementAngle / 2.66;
		var marginBetweenElem = 0
		var rectSpecialMargin = 0;
		
		if (elementTable[0].id.split("-", 1) == "Rect")
		{
			slice = maxElementAngle / 2;
			rectSpecialMargin = tableElementSize / 3;
		}
		
		var divider = maxElementAngle;
		var positioner = Math.round(maxElementAngle / 4);
			
		if (elementMaxSize < 7)
		{
			divider = 4;
			positioner = 1.4;
			if (elementTable[0].id.split("-", 1) == "Rect")
			{
				positioner = 1.5;
			}
		}
			
		var startTop = element.position().top +  element.height() - (tableElementSize * positioner) - tableElementSize / slice;
		var startLeft = element.position().left +  element.width() - (tableElementSize * positioner) - tableElementSize / slice;
		
		if (maxElementAngle < 9 && elementTable[0].id.split("-", 1) == "Rect")
		{
			if (element.data('orient') == 'v')
			{
				startTop = startTop - rectSpecialMargin;
			}
			else if (element.data('orient') == 'h')
			{
				startLeft = startLeft - rectSpecialMargin;
			}
		}
					
		if (maxElementCapacity / 2 <  parseInt(elementMaxSize))
		{
			startTop = startTop + parseInt(maxElementAngle);
			startLeft = startLeft + parseInt(maxElementAngle);
		}
		
		var tempTop = startTop;
		if (startLeft < element.position().left)
		{
			startLeft = element.position().left;
		}

		
		for (i=0; i < parseInt(elementMaxSize); i++)
		{
			if (i >  parseInt(elementMaxSize) / 2)
			{
				createTableElementWithData(data[i + 1], i,element, side == 0, false);
			}
			else
			{
				createTableElementWithData(data[i + 1], i,element,side >= 3, false);
			}
			
			if (maxElementCapacity / 2 <  parseInt(elementMaxSize))
			{
				marginBetweenElem = countToChangeSide * parseInt(maxElementAngle) / (parseInt(elementMaxSize) / 4);
			}
			
			if (side == 0)
			{
				$("#tableParentElementDiv"+ parseInt(i + 1) + elemID + mode).css( "top", element.position().top - tableElementSize + 4);
				$("#tableParentElementDiv"+ parseInt(i + 1)+ elemID + mode).css( "left", startLeft + (realTableElementSize * (countToChangeSide)) - marginBetweenElem);
			}
			else if (side == 1)
			{
				$("#tableParentElementDiv"+ parseInt(i + 1) + elemID + mode).css( "top", startTop + (realTableElementSize * (countToChangeSide)) - marginBetweenElem);
				$("#tableParentElementDiv"+ parseInt(i + 1)+ elemID + mode).css( "left", element.position().left + element.width() - 4);
			}
			else if (side == 2)
			{
				$("#tableParentElementDiv"+ parseInt(i + 1) + elemID + mode).css( "top", element.position().top + element.height() - 4);
				$("#tableParentElementDiv"+ parseInt(i + 1)+ elemID + mode).css( "left", startLeft + (realTableElementSize * (countToChangeSide)) - marginBetweenElem);
			}
			else if (side >= 3)
			{
				$("#tableParentElementDiv"+ parseInt(i + 1) + elemID + mode).css( "top",  startTop + (realTableElementSize * (countToChangeSide)) - marginBetweenElem);
				$("#tableParentElementDiv"+ parseInt(i + 1)+ elemID + mode).css( "left", element.position().left - tableElementSize + 4);
			}
			countToChangeSide = countToChangeSide + 1;
			
			if (countToChangeSide == Math.round(divider / 4) && side < 3)
			{
				side = side + 1;
				if ((side == 1 && startTop < element.position().top) || (side == 3 && parseInt(elementMaxSize) > 8 && ((parseInt(elementMaxSize) - (i + 2)) + 1) <= Math.round(maxElementAngle / 4)) || (side == 3  && parseInt(elementMaxSize) > 8 && ((parseInt(elementMaxSize) - (i + 2)) + 1) < 4) || (elementTable[0].id.split("-", 1) == "Rect" && parseInt(elementMaxSize) > maxElementCapacity / 2 ))
				{
					startTop = element.position().top;
				}
				else
				{
					if (side > 2 && (parseInt(elementMaxSize) > maxElementCapacity / 2  || (side == 3 && parseInt(elementMaxSize) == 5)))
					{
						startTop = tempTop - (tableElementSize / 2.5);
					}
					else if ((side == 1 || side == 3) && parseInt(elementMaxSize) == 6)
					{
						startTop = tempTop - (tableElementSize / 1.7);
					}
					else
					{
						startTop = tempTop;
					}
				}
				
				if (parseInt(elementMaxSize) < 7)
				{
					if ((side == 1 || side == 3) && parseInt(elementMaxSize) == 6)
					{
						divider = 8;
					}
					else
					{
						divider = 4;
					}
				}
				countToChangeSide = 0;
			}
			
			if (i == elementMaxSize - 1)
			{
				posString = posString + i;
			}
			else
			{
				posString = posString + i + "|";
			}
		}
	}
}

function zoomingCanvas(firstInit)
{
	//zooming
	 if ($(".DragDiv").size() > 50)
	 {
		 //zoomingMode = true;
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
		var size = parseInt($("#" + element.context.id).find('p:eq(1)').text().split("/", 1));
		var sizeStr = size + "/" + newSize;
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

function reArrangeChairs(element,newSize)
{
	$(".chairs" + element.attr('id')).each(function(i) {
		$(this).remove();
	});
	
	$.post('/canvas/getAllItems/'+ element.attr('id').split("-",2)[1] +'/', {},
	 function(data){
	   if (data[0] != "" && data[0] != 'undefined' && data[0].status == 'OK')
	   {
			setSaveStatus("OK");
			posTableChairsWithData(data, element, newSize);
			
	   }else{
			setSaveStatus("Error");
	   }
	 }, 'json');
}

function reloadElementAfterSave(element,newCaption,newSize,sizeStr)
{
	var elementCaption = element.context.getElementsByTagName("p");
	var elementMaxSize = elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1);
	elementCaption[0].innerHTML = newCaption;
	elementCaption[0].title = newCaption;
	elementCaption[1].innerHTML = sizeStr;
	//reloadElementStatus(element, false, -1);
	reArrangeChairs(element,newSize);
}

function selectElement(element)
{

    if (SelectedElem != "") {
		SelectedElem.removeClass('borderSelected');
		SelectedElem.removeClass('broderNonDragSelected');
		unMarkTable(SelectedElem);
    }
    element.removeClass('borderSelected');
	element.removeClass('broderNonDragSelected');
	unMarkTable(element);
	if (!tableMode)
	{	  
	  if (!(element.hasClass('borderSelected')) && !(element.hasClass('broderNonDragSelected')))
	  {
	  	markTable(element);
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
	$.post('/canvas/getElementOrientation/', {elem_num:element.attr('id')},
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
				$.post('/canvas/saveElementWidthHeight/', {elem_num:element.attr('id') , width:element.width(), height:element.height()},
			   function(data){
			   if (data.status == 'OK')
			   {
			   
				if (elementTable[0].id.split("-", 1) == "Rect")
				{
					var elementCaption = element.context.getElementsByTagName("p");
					var elementMaxSize = elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1);
				
					$(".chairs" + element.attr('id')).each(function(i) {
						$(this).remove();
					});

					 $.post('/canvas/getAllItems/'+ element.attr('id').split("-",2)[1] +'/', {},
					 function(data){
					   if (data[0] != "" && data[0] != 'undefined' && data[0].status == 'OK')
					   {
							setSaveStatus("OK");
							posTableChairsWithData(data, element, elementMaxSize);
							
					   }else{
							setSaveStatus("Error");
					   }
					 }, 'json');
				}
				setSaveStatus("OK"); }}, 'json');
			}
	   }
	  }, 'json');
}

function reloadElementStatus(element, init, index)
{

	if (init && (element.hasClass('borderSelected') || element.hasClass('broderNonDragSelected')))
	{
		return;
	}
	
	 var elementTable = element.context.getElementsByTagName("table");
		
	if (!init && (elementTable[0].id.split("-", 1) == "Square" || elementTable[0].id.split("-", 1) == "Round"|| elementTable[0].id.split("-", 1) == "Lozenge"))
	{
		return;
	}
	
	$.post('/canvas/getElementOrientation/', {elem_num:element.context.id},
	  function(data){
	  if (data.status == 'OK')
	   {
		makeOrientation(elementTable, element, data.orientation, init)
		setSaveStatus("OK");
	   }
	   else
	   {
			setSaveStatus("Error");
	   }
	   }, 'json');
}

function makeOrientation(elementTable, element, orientation, init)
{
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
				if (orientation == 'H' || orientation == 'FH')
				{
				  element.data('orient', 'h');
			  
				  var picText = "RectR_H";
				  
				  //if (element.hasClass('borderSelected'))
				  //{
					//picText = "RectS_H";
				  //}
				  element.css("background-image", "url('/static/canvas/images/tables_small/" + picText +".png')");
				  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
				  {
					  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/tables_small/" + picText +".png',sizingMethod='scale');");
					  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/tables_small/" + picText +".png',sizingMethod='scale')';");
				  }
				}
				else
				{
				   var picText = "RectR";
				  
				  //if (element.hasClass('borderSelected'))
				  //{
				//	picText = "RectS";
				  //}
				  
				  element.data('orient', 'v');
				  element.css("background-image", "url('/static/canvas/images/tables_small/" + picText +".png')");
				  
				  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
				  {
					  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/tables_small/" + picText +".png',sizingMethod='scale');");
					  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/tables_small/" + picText +".png',sizingMethod='scale')';");
				  }
				}
			}else if (elementTable[0].id.split("-", 1) == "Lozenge") {
				if (orientation == 'H' || orientation == 'FH')
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
				if (orientation == 'H' || orientation == 'FH')
				{
					document.getElementById(elementTable[0].id).src = "/static/canvas/images/tables_small/RectG_H.png";
				}
				else
				{
					document.getElementById(elementTable[0].id).src = "/static/canvas/images/tables_small/RectG.png";
				}
			}else if (elementTable[0].id.split("-", 1) == "Lozenge") {
				if (orientation == 'H' || orientation == 'FH')
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
				if (orientation == 'H' || orientation == 'FH')
				{
					document.getElementById(elementTable[0].id).src = "/static/canvas/images/tables_small/RectY_H.png";
				}
				else
				{
					document.getElementById(elementTable[0].id).src = "/static/canvas/images/tables_small/RectY.png";
				}
			}else if (elementTable[0].id.split("-", 1) == "Lozenge") {
				if (orientation == 'H' || orientation == 'FH')
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
			if (orientation == 'V')
			{
				  element.css("background-image", "url('/static/canvas/images/misc/dance.png')");
				  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
				  {
					  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dance.png',sizingMethod='scale');");
					  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dance.png',sizingMethod='scale')';");
				  }
			}
			else if (orientation == 'H')
			{
				  element.css("background-image", "url('/static/canvas/images/misc/dance_H.png')");
				  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
				  {
					  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dance_H.png',sizingMethod='scale');");
					  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dance_H.png',sizingMethod='scale')';");
				  }
			}
			else if (orientation == 'FV')
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
			if (orientation == 'V')
			{
				  element.css("background-image", "url('/static/canvas/images/misc/bar.png')");
				  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
				  {
					  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/bar.png',sizingMethod='scale');");
					  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/bar.png',sizingMethod='scale')';");
				  }
			}
			else if (orientation == 'H')
			{
				  element.css("background-image", "url('/static/canvas/images/misc/bar_h.png')");
				  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
				  {
					  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/bar_h.png',sizingMethod='scale');");
					  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/bar_h.png',sizingMethod='scale')';");
				  }
			}
			else if (orientation == 'FV')
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
			if (orientation == 'V')
			{
				  element.css("background-image", "url('/static/canvas/images/misc/dj.png')");
				  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
				  {
					  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dj.png',sizingMethod='scale');");
					  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dj.png',sizingMethod='scale')';");
				  }
			}
			else if (orientation == 'H')
			{
				  element.css("background-image", "url('/static/canvas/images/misc/dj_H.png')");
				  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
				  {
					  element.css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dj_H.png',sizingMethod='scale');");
					  element.css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/misc/dj_H.png',sizingMethod='scale')';");
				  }
			}
			else if (orientation == 'FV')
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
	
	$(".chairs" + element.attr('id')).each(function(i) {
			$(this).fadeTo(0, 0, function() {
				// Animation complete.
					$(this).hide();
			});
	});
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
         element.animate({ top: newTop , left: newLeft},300, 'linear', function() { saveElement($(this)); selectElement($(this));
			$(".chairs" + element.attr('id')).each(function(i) {
					$(this).fadeTo(0, 1, function() {
						// Animation complete.
							$(this).show();
					});
			 });
		 });
       }
     }
    else
    {
		var chairWidth = $(".chairs" + element.attr('id')).first().width();
		var chairHeight = $(".chairs" + element.attr('id')).first().height();
		
		if (element.offset().top - chairHeight < $("#canvas-div").offset().top)
		{
		    var topAdjust = element.offset().top + ($("#canvas-div").offset().top - (element.offset().top - chairHeight));
		    element.css('top',topAdjust);
		}
		
		if (element.offset().top + element.height() + chairHeight > $("#canvas-div").offset().top + $("#canvas-div").height())
		{
		    var topAdjust = element.offset().top + ($("#canvas-div").offset().top + $("#canvas-div").height() - (element.offset().top + element.height() + chairHeight));
		    element.css('top',topAdjust + 10);
		}
		
		if (element.offset().left - chairWidth < $("#canvas-div").offset().left)
		{
		    var leftAdjust = element.offset().left + ($("#canvas-div").offset().left - (element.offset().left - chairWidth));
		    element.css('left',leftAdjust);
		}
		
		if (element.offset().left + element.width() + chairWidth > $("#canvas-div").offset().left + $("#canvas-div").width())
		{
		    var leftAdjust = element.offset().left + ($("#canvas-div").offset().left + $("#canvas-div").width() - (element.offset().left + element.width() + chairWidth));
		    element.css('left',leftAdjust + 10);
		}
		
		$(".chairs" + element.attr('id')).each(function(i) {
				$(this).fadeTo(0, 1, function() {
					// Animation complete.
						$(this).css('top', $(this).position().top +  (element.position().top - startDradPositionList[0].top))
						$(this).css('left', $(this).position().left + (element.position().left - startDradPositionList[0].left))
						$(this).show();
				});
		});
       saveElement(element);
    }
}

function propMenuBtnClick(elementID)
{
	if (!drag)
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
}

function tableBackBtnClick()
{
	if (!drag)
	{
		undoButtonPress();
	}
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
						
						$(".chairs" + undoElement[0].attr('id')).each(function(j) {
							$(this).animate({ top: $(this).position().top +  (newTop - startDradPositionList[index].top) , left: $(this).position().left +  (newLeft - startDradPositionList[index].left)},300, 'linear');
						});
				
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
			//selectElement(element);
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
		//selectElement(element);
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
			//selectElement(element);
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
		//saveElement(element);
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
		dropAllow = false;
		var elementCaption = table.context.getElementsByTagName("p");
		var elementTable = table.context.getElementsByTagName("table");
		table.fadeTo(300, 0,function(){
		table.fadeTo(300, 1)});
		$.post('/canvas/sit/', {table_id: table.attr('id'), person_id: draged.context.id, place: place},
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
			reloadElementStatus(table, false, -1);
			  var elementMaxSize = parseInt(table.find('p:eq(1)').text().substr(table.find('p:eq(1)').text().indexOf("/")+1));
			  var newSize = parseInt(table.find('p:eq(1)').text().split("/", 1)) + 1;
			  var sizeStr = newSize + "/" + elementMaxSize;
			  table.find('p:eq(1)').text(sizeStr);
			
			elementCaption[1].innerHTML = sizeStr;
			LoadPerson(table, data.free_position - 1, tableMode);
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
		  dropAllow = true;
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
		$("#chargeScr").css('height', $("#chargeScr").height() + delta);
		$("#search-properties-list").css('top', $("#search-properties-list").position().top + delta);
		$("#occasionDetailsR").css('top', $("#occasionDetailsR").position().top + delta);
		$("#canvasShadow").css('top', $("#canvasShadow").position().top + delta);
		//$(".SaveState").css('top', $(".SaveState").position().top + delta);
	}
	
	$.post('/canvas/getMaxY/', {},
		function(data){
		  if (data.status == 'OK')
		  {
			if (data.MaxY > $("#canvas-div").height() + 35)
			{
				var delta =  data.MaxY  - $("#canvas-div").height() + 70;
		
				$("#people-list").css('height', $("#people-list").height() + delta);
				$(".CanvasDiv").css('height', $(".CanvasDiv").height() + delta);
				$("#chargeScr").css('height', $("#chargeScr").height() + delta);
				$("#search-properties-list").css('top', $("#search-properties-list").position().top + delta);
				$("#occasionDetailsR").css('top', $("#occasionDetailsR").position().top + delta);
				$("#canvasShadow").css('top', $("#canvasShadow").position().top + delta);
				floatListOriginalPosition = $("#float-list").position();
				//$(".SaveState").css('top', $(".SaveState").position().top + delta);
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
		$("#chargeScr").css('width', $("#chargeScr").width() + delta);
		$("#float-list").css('left', $("#float-list").position().left + delta);
		$("#search-properties-list").css('left', $("#search-properties-list").position().left + delta);
		$("#occasionDetailsR").css('left', $("#occasionDetailsR").position().left + delta);
		$("#occasionDetailsAdvanceR").css('left', ("#occasionDetailsR").position().left - $("#occasionDetailsAdvanceR").width());
		$("#AddPersonList").css('left', $("#float-list").position().left - $("#AddPersonList").width());
		$("#canvasShadow").css('width', $("#canvasShadow").width() + delta);
		$(".SaveState").css('left', $(".SaveState").position().left + delta);
	}
	
	$.post('/canvas/getMaxX/', {},
		function(data){
		  if (data.status == 'OK')
		  {
			if (data.MaxX > $("#canvas-div").width() + 35)
			{
				var delta =  data.MaxX  - $("#canvas-div").width() + 110;
		
				$("#tableMovingPanel").css('width', $("#tableMovingPanel").width() + delta);
				$("#movingPanelLeft").css('width', $("#movingPanelLeft").width() + delta);
				$("#movingPanel").css('width', $("#movingPanel").width() + delta);
				$("#movingPanelMarquee").css('width', $("#movingPanelMarquee").width() + delta);
				$("#people-list").css('left', $("#people-list").position().left + delta);
				$(".CanvasDiv").css('width', $(".CanvasDiv").width() + delta);
				$("#chargeScr").css('width', $("#chargeScr").width() + delta);
				$("#float-list").css('left', $("#float-list").position().left + delta);
				$("#search-properties-list").css('left', $("#search-properties-list").position().left + delta);
				$("#occasionDetailsR").css('left', $("#occasionDetailsR").position().left + delta);
				$("#occasionDetailsAdvanceR").css('left', ("#occasionDetailsR").position().left - $("#occasionDetailsAdvanceR").width());
				$("#canvasShadow").css('left', $("#canvasShadow").position().left + delta / 2);
				$("#AddPersonList").css('left', $("#float-list").position().left - $("#AddPersonList").width());
				$(".SaveState").css('left', $(".SaveState").position().left + delta);
				floatListOriginalPosition = $("#float-list").position();
			}
	    	setSaveStatus("OK");
		  }
		  else
		  {
     		setSaveStatus("Error");
		  }
	}, 'json');	
	floatListOriginalPosition = $("#float-list").position();
	$("#occasionDetailsAdvanceR").css('top', $("#occasionDetailsR").position().top);
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

function droppableTable(ui ,tableOrig)
{
	  var elementTable = tableOrig.context.getElementsByTagName("table");
	  if (!isThisPeopleTable(elementTable[0].id))
	  {
		return;
	  }
	  var table = tableOrig;
	  var multiPos = false; 
	  var dataMultiStrings = "";
	
	  ui.helper.each(function(i){
			if (ui.helper.size() == 1)
			{
				if (dropAllow)
				{
					dropPerson($(this), table, ""); 
				}
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
  $(".DragDiv").after(function(index) {
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
	 else
	 {
		if (elementTable[0].id.split("-", 1) ==  "Rect" || elementTable[0].id.split("-", 1) ==  "Square")
		{
	 		$(this).droppable({
					accept: "#people_list li",
					hoverClass: "RectShapeDropLayer",
					drop: function(e, ui ) {
							droppableTable(ui ,$(this));
						}
			  });
		}
		else if (elementTable[0].id.split("-", 1) ==  "Round")
		{
	 		$(this).droppable({
					accept: "#people_list li",
					hoverClass: "RoundShapeDropLayer",
					drop: function(e, ui ) {
							droppableTable(ui ,$(this));
						}
			  });
		}
		else
		{
			$(this).droppable({
					accept: "#people_list li",
					hoverClass: "LozShapeDropLayer",
					drop: function(e, ui ) {
							droppableTable(ui ,$(this));
						}
			  });
		}
	 }
	
	//reloadElementStatus($(this), true, index); 
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
  
  $(".LozShape").droppable({
  	accept: "#people_list li",
	hoverClass: "personOverTableDropLayer",
    drop: function(e, ui ) {
			droppableTable(ui ,$(this));
		}
	  });
  
  $(".RoundShape").droppable({
  	accept: "#people_list li",
	hoverClass: "personOverTableDropLayer",
    drop: function(e, ui ) {
			droppableTable(ui ,$(this));
		}
	  });
  
  $(".SQShape").droppable({
  	accept: "#people_list li",
	hoverClass: "personOverTableDropLayer",
    drop: function(e, ui ) {
			droppableTable(ui ,$(this));
		}
	  });
	  
	$(".DragNonDropDiv").resizable({
		handles: 'n, e, s, w, ne, se, sw, nw',
		maxHeight:150,
		maxWidth:150,
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
				if (startDradPositionList[0] != 'undefined' && startDradPositionList[1] != 'undefined')
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
						reloadElementStatus(SelectedElem, false, -1);
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
	else
	{
		showLightMsg("סיבוב אלמנט","יש לבחור אלמנט.","OK","Notice");
	}
  });
 
  $(document).mouseup(function(e) {
	isMousePressFromCanvas = false;
	}); 
	
  $("#canvas-div").mouseup(function(e) {
	if (!($(e.target).hasClass('DragDiv')) && !($(e.target).hasClass('DragNonDropDiv'))&& !($(e.target).hasClass('Property')) && !($(e.target).parent().hasClass('actionBtn')) && !($(e.target).hasClass('actionBtn'))){
	  if (SelectedElem != "" && !tableMode && !detailsMode) {
			SelectedElem.removeClass('borderSelected');
			SelectedElem.removeClass('broderNonDragSelected');
			unMarkTable(SelectedElem);
			SelectedElem = "";
		}
		
		if (SelectedPerson != "") {
			SelectedPerson.removeClass('borderPersonSelected');
			SelectedPerson = "";
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
				$(this).text("[נעילה]");
				$(this).attr('alt',"NP"); 
				$("#float-list").draggable( 'enable' );
				$("#float-list").addClass('pointer');
			}
			else
			{
				$(this).text("[שיחרור]");
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
			  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
			 {
			 	$("#occasionDetailsAdvanceR").css('top',483);
			 }
			 else
			 {
			  	$("#occasionDetailsAdvanceR").css('top',490);
			 }
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


