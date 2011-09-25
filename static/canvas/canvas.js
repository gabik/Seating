var SelectedElem = "" ;
var SelectedPerson = "" ;
var startDradPositionList = "";
var undoElementList = "";
var maxElementCapacity = 22;
var multiSelection = false;
var isMousePressFromCanvas = false;
var maxGuests = 1056;
var addPersonDivOpen = false;

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

	for (var i = 0; i < elementImgs.length ; i++)
	{
		var img = $("#"+ elementImgs[i].id);
		
		if (i > 0)
		{
			img.animate({ width:img.width() + scale / 3, height: img.height() + scale / 3},300, 'linear');
		}
		else
		{
			img.animate({ width:img.width() + scale, height: img.height() + scale},300, 'linear');
		}
	}
	element.animate({ width:element.width() + scale, height: element.height() + scale},300, 'linear', function()
	{
		if (lastScale > 0)
		{
			selectElement(element);
		}
	});
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
       $.post('/canvas/save/', {elem_num: elementId, X: element.position().left , Y: element.position().top ,caption: "" ,size: "", sumGuests: ""},
         function(data){
           if (data.status == 'OK')
           {
             $("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
           }else{
             $("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
           }
         }, 'json');
}

function saveElementByID(elementId)
{
       $.post('/canvas/save/', {elem_num: elementId, X: $("#"+elementId).position().left , Y: $("#"+elementId).position().top ,caption: "" ,size: "", sumGuests:""},
         function(data){
           if (data.status == 'OK')
           {
             $("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
           }else{
             $("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
           }
         }, 'json');
}

function saveElementWithCaption(element,newCaption, newSize, numOfGuests)
{
       var elementCaption = element.context.getElementsByTagName("p");
	   var sizeStr = elementCaption[1].firstChild.nodeValue.split("/", 1) + "/" + newSize;
	   
	   if (parseInt(elementCaption[1].firstChild.nodeValue.split("/", 1)) > parseInt(newSize))
	   {
           $.post('/canvas/personOnHigherPos/', {elem_num: element.context.id, new_size: parseInt(newSize) + 1},
           function(data){
           if (data.status == 'True')
           { 
				var answer = confirm("There Are Persons Sitting At Higher Position, Bring Then To Float List?");
				if (answer)
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
							$.post('/canvas/save/', {elem_num: element.context.id, X: element.position().left , Y: element.position().top ,caption: newCaption, size: newSize, sumGuests: numOfGuests},
						    function(dataSave){
						    if (dataSave.status == 'OK')
						    {
								writeOccasionInfo("Update "+ element.text().split("\n", 2)[1].trim() +" Caption To " +newCaption + " And Size To " +newSize+".");
								reloadElementAfterSave(element,newCaption,newSize,sizeStr);
								$("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
								ShowHourGlassWaitingWindow(true);
							   }else{
								$("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
							   }
							}, 'json');
					   }
					   }, 'json');
				}
				else
				{
					updateElementScreenProperties(element);
				}
           }
           }, 'json');
	   }
	   else
	   {
		  $.post('/canvas/save/', {elem_num: element.context.id, X: element.position().left , Y: element.position().top ,caption: newCaption, size: newSize, sumGuests: numOfGuests},
		  function(dataSave){
		    if (dataSave.status == 'OK')
		    {
				writeOccasionInfo("Update "+ element.text().split("\n", 2)[1].trim() +" Caption To " +newCaption + " And Size To " +newSize+".");
				reloadElementAfterSave(element,newCaption,newSize,sizeStr);
				$("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
		    }else{
				$("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
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
	elementCaption[1].innerHTML = sizeStr;
	reloadElementStatus(element);
}

function selectElement(element)
{
    if (SelectedElem != "" ) {
      SelectedElem.border('0px white 0');
    }
    element.border('2px pink .5');
	multiSelection = false;
    SelectedElem = element;
	updateElementScreenProperties(element);
	showPropertyPanel(element);
}

function updateElementScreenProperties(element)
{
	var elementCaption = element.context.getElementsByTagName("p");
	$("#ElementCaption").attr("value",elementCaption[0].firstChild.nodeValue);
	$("#ElementSize").attr("value",elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1));
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
	
	if (elementSize == 0)
	{
		$("#" + elementImgs[1].id).attr("src", "/static/canvas/images/RedStatus.png");
	}
	else if (elementSize == elementMaxSize)
	{
		$("#" + elementImgs[1].id).attr("src", "/static/canvas/images/GreenStatus.png");
	}
	else
	{
		$("#" + elementImgs[1].id).attr("src", "/static/canvas/images/YellowStatus.png");
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
	selectPersonElement(elementImg);
	element.fadeTo(400, 0,function(){
		element.fadeTo(400, 1,function(){
		selectPersonElement(elementImg);
		});
	});
}
function saveNumOfGuests(numGuests)
{
	$.post('/canvas/updateNumOfGuests/', {sumGuests: numGuests},
	function(dataSave){
	if (dataSave.status == 'OK')
	{
		$("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
		writeOccasionInfo("Update Max Num Of Guest " +numGuests+".");
		}else{
		$("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
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

function isThisPeopleTable(id)
{
	if(id.indexOf("round_pink") == -1 && id.indexOf("long_square") == -1)
	{
		return false;
	}
	return true;
}

function refreshNumOfGuests()
{
	$.post('/canvas/getNumOfGuests/', {},
	function(data){
	if (data.status == 'OK')
	{
		$("#NumOfGuests").val(data.numOfGuests);
		$("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
		}else{
		$("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
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

function showPropertyPanel(element)
{
	if (element != "" && !tableMode && !detailsMode)
	{
		if (element.position().left < 600)
		{
			$("#element-properties-list").css('top',element.position().top - 15);
			$("#element-properties-list").css('left',element.position().left + element.width() - 5);
			$("#element-properties-list").show("slide", { direction: "left" }, 50);
		}
		else
		{
			$("#element-properties-list").css('top',element.position().top - 15);
			$("#element-properties-list").css('left',element.position().left - $("#element-properties-list").width() - 23);
			$("#element-properties-list").show("slide", { direction: "right" }, 50);
		}
	}
	else
	{
		$("#element-properties-list").hide();
	}
}

function posPropertyPanel(element)
{
	if (element != "")
	{
		if (element.position().left < 600)
		{
			$("#element-properties-list").css('top',element.position().top);
			$("#element-properties-list").css('left',element.position().left + element.width() + 2);
		}
		else
		{
			$("#element-properties-list").css('top',element.position().top);
			$("#element-properties-list").css('left',element.position().left - $("#element-properties-list").width() - 25);
		}
	}
	else
	{
		$("#element-properties-list").hide();
	}
}

$(document).ready(function() {
  var imgs,i;
  var numOfElementsComboBox = document.getElementById("numOfElementsComboBox");
  imgs = document.getElementsByTagName('img');

  for(i=0;i<imgs.length;i++)
  {
    if (imgs[i].id.split("-", 1) == "long_square") {
      document.getElementById(imgs[i].id).src = "/static/canvas/images/TableSquare.jpg";
    } else if (imgs[i].id.split("-", 1) == "round_pink") {
      document.getElementById(imgs[i].id).src = "/static/canvas/images/RoundPink.jpg";
    } else if (imgs[i].id.split("-", 1) == "null_square") {
      document.getElementById(imgs[i].id).src = "/static/canvas/images/rect.png";
    } else if (imgs[i].id.split("-", 1) == "null_ellipse") {
      document.getElementById(imgs[i].id).src = "/static/canvas/images/ellipse.png";
    } else if (imgs[i].id.split("-", 1) == "null_line") {
      document.getElementById(imgs[i].id).src = "/static/canvas/images/line.png";
    }else if (imgs[i].id.split("-", 1) == "Statusnull_line" || imgs[i].id.split("-", 1) == "Statusnull_ellipse" || imgs[i].id.split("-", 1) == "Statusnull_square") {
       document.getElementById(imgs[i].id).style.visibility = "hidden";
    }
  }
  $("#ElementPropertiesSaveButton").removeAttr('disabled');
  $("#ElementCaption").removeAttr('disabled');
  $("#ElementSize").removeAttr('disabled');

  showPropertyPanel("");
  updateSeatedLabel();
  $.jqplot.config.enablePlugins = true;
  
  $(".DragDiv").after(function() {
     reloadElementStatus($(this)); 
	 var elementCaption = $(this).context.getElementsByTagName("p");
	 var elementMaxSize = elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1);
	 var elementImgs = $(this).context.getElementsByTagName("img");
	 setWidthAndHeight($(this),elementMaxSize,0);
	 if (!isThisPeopleTable(elementImgs[0].id))
     {
		 elementCaption[1].style.visibility = "hidden";
	 }

  });
  $(".DragDiv").click( function() {
     selectElement($(this));
  });
  $(".DragDiv").draggable({
     containment: 'parent',
	 cursor: "move",
     start: function (e,ui){
       $(this).fadeTo(200, 0.3);
	   startDradPositionList = new Array(1);
	   startDradPositionList[0] =$(this).position();
       $("#SaveStatImg").attr("src", "http://careers.physicstoday.org/pics/icons/gma_red_50/js_saved_jobs.gif");
     },
     stop: function (e,ui){
       $(this).fadeTo(200, 1.0);
	   undoElementList = new Array(1);
	   var undoElement = new Array(2);//[element,operation]
       undoElement[0] = $(this);
       undoElement[1] = "move";
	   undoElementList[0] = undoElement;
       if (collisionWithOtherElement($(this)))
       {
          if (startDradPositionList[0] != "")
          {
              var newTop = startDradPositionList[0].top;
              var newLeft = startDradPositionList[0].left;
              $(this).animate({ top: newTop , left: newLeft},300, 'linear', function() { saveElement($(this)); selectElement($(this));});
          }
       }
       else
       {
           saveElement($(this));
       }
       }
  })
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
					$("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
					if (data.table_status == 'Yellow')
					{
						$("#" + elementImgs[1].id).attr("src", "/static/canvas/images/YellowStatus.png");
					}
					else if (data.table_status == 'Green')
					{
						$("#" + elementImgs[1].id).attr("src", "/static/canvas/images/GreenStatus.png");
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
					writeOccasionInfo("Drop Person " + draged.text() + "To Table " + table.text().split("\n", 2)[1].trim());
					posPropertyPanel(table);
				  }else if (data.status == 'FULL')
				  {
					draged.fadeTo(200, 1.0);
					alert ("Table " + elementCaption[0].innerHTML + "is full for " + draged.text());
					$("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
				  }else{
					draged.fadeTo(200, 1.0);
					$("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
				  }
				}, 'json');
				$("#dropLayer").remove();
		  }
	  });
    }
  });
  $("#people_list").multisortable();
  $("#people_list").disableSelection();
  $("#people_list > li").dblclick( function(event){
		if (!event.ctrlKey)
		{
			var current_person = $(this);
			if (tableMode)
			{
				
				var full_name = "";
				full_name = $(this).context.id.split("_", 2);

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
   });
  $(".DelDiv").click( function() {
	if  (!detailsMode)
	{
		var answer;

		if (tableMode)
		{
			if (SelectedPerson != "")
			{
				answer = confirm("Are You Sure To Delete " + SelectedPerson.text() +" Person?");
			}
			else
			{
				alert ("Please select Person");
			}
		}
		else
		{
			if (SelectedElem != "")
			{
				answer = confirm("Are You Sure To Delete " + SelectedElem.text().split("\n", 2)[1].trim() + " Element?");
			}
			else
			{
				alert ("Please select Element");
			}
		}
		
		if (answer != undefined && answer)
		{
			if (tableMode)
			{
				DeletePerson();
				updateSeatedLabel();
				writeOccasionInfo("Move Person "+SelectedPerson.text()+"From Table "+SelectedElem.text().split("\n", 2)[1].trim()+" To Float List.");
			}
			else
			{
				if (SelectedElem != "") {
				  $("#SaveStatImg").attr("src", "http://careers.physicstoday.org/pics/icons/gma_red_50/js_saved_jobs.gif");
				  $.post('/canvas/delete/', {elem_num: SelectedElem.context.id},
						function(data){
					  if (data.status == 'OK')
					  { 
						  //undoElement[0] = SelectedElem;
						  //undoElement[1] = "add"; 
						  ShowHourGlassWaitingWindow(true);
						  writeOccasionInfo("Delete Table "+SelectedElem.text().split("\n", 2)[1].trim()+".");
					  }
					}, 'json');
				} else {
					if (!tableMode && !detailsMode)
					{
					  alert ("Please select table");
					}
				}
			}
		}
	}
  });
  $(".AddDiv").click( function() {
    $('ul.AddMenu').slideToggle('medium');
  });
  $(".PlaceMentShapesDiv").click( function() {
    $('ul.ShapePlacementMenu').slideToggle('medium');
  });
  $(".AligmentDiv").click( function() {
    $('ul.AligmentMenu').slideToggle('medium');
  });
  $("ul.ShapePlacementMenu").mouseleave( function() {
    $('ul.ShapePlacementMenu').slideUp()('medium');
  });
  $("ul.AligmentMenu").mouseleave( function() {
    $('ul.AligmentMenu').slideUp()('medium');
  });
  $("ul.AddMenu").mouseleave( function(e) {
	if (!$(e.target).hasClass('Property'))
	{
		$('ul.AddMenu').slideUp()('medium');
	}
  });
  $(".UndoDiv").click( function() {
	for (var index = 0; index < undoElementList.length; index++)
	{
		var undoElement = undoElementList[index];
		if (undoElement[0] != "" && undoElement[1] != "" && !tableMode && !detailsMode)
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
			  case "add":
				  {
					  {
						$.post('/canvas/add/', {kind: undoElement[0].context.id ,amount: 1},
						function(data){
						if (data.status == 'OK')
						{
						   undoElement[1] = "delete"; 
						   ShowHourGlassWaitingWindow(true);
						} else if (data.status == 'LIMIT')
										{
											alert("Maximum 48 tables");
											ShowHourGlassWaitingWindow(true);
										}
						}, 'json');
						break;
					  }
				  }
			  case "delete":
			  {
				  $("#SaveStatImg").attr("src", "http://careers.physicstoday.org/pics/icons/gma_red_50/js_saved_jobs.gif");
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
	}
  });
  $(".DelPersonDiv").click( function() {
  
	if (SelectedPerson != "")
	{
		var answer = confirm("Are You Sure To Delete "+ SelectedPerson.text() +"?");
		if (answer)
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
			   	writeOccasionInfo("Delete Person "+SelectedPerson.text()+"From Float List.");
			   $("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
			   updateSeatedLabel();
			 }else{
			   $("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
			 }
			 SelectedPerson = "";
			 }, 'json');
		}
	}
	else
	{
		alert("Please Select Person From List");
	}
  });
  $(".AddPersonDiv").click( function() {
    $('ul.AddPerson').slideToggle('medium');
	if (addPersonDivOpen)
	{
		addPersonDivOpen=false;
		$("#maxGuest_list").animate({top:250});
		$("#search-properties-list").animate({top:330});
	}
	else
	{
		addPersonDivOpen=true;
		$("#maxGuest_list").animate({top: $("#AddPersonList").position().top + 205});
		$("#search-properties-list").animate({top:$("#AddPersonList").position().top + 295});
	}
  }); 
  $("#AddPersonButton").click( function() {
    var first_name = document.getElementById("first_name").value;
    var last_name = document.getElementById("last_name").value;
	var group = document.getElementById("personGroup").value;
	addPersonToFloatList(first_name,last_name, group);
  });
  $(".MenuItem").click( function() {
    $('ul.AddMenu').hide('medium');
	var kind = $(this).context.id;

    $.post('/canvas/add/', {kind: kind ,amount: numOfElementsComboBox.options[numOfElementsComboBox.selectedIndex].text},
      function(data){
        if (data.status == 'OK')
        {
            //undoElement[0] = SelectedElem;
            //undoElement[1] = "delete"; 
			var addChar = "";
			if (parseInt(numOfElementsComboBox.options[numOfElementsComboBox.selectedIndex].text) > 1)
			{
				addChar = 's';
			}
			writeOccasionInfo("Add " +numOfElementsComboBox.options[numOfElementsComboBox.selectedIndex].text+" New "+kind +" Table"+addChar);
			ShowHourGlassWaitingWindow(true);
        }
      }, 'json');
  });
  $(document).keypress(function(e) {
   var code = (e.keyCode ? e.keyCode : e.which);
   if(code == 46) { //Del keycode
		$(".DelDiv").click();
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
		var full_name = $("#SearchCaption").val().split(" ",2);
		$.post('/canvas/getItem/', {position: "", firstName: full_name[0], lastName: full_name[1] },
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
					});
					$("#"+ full_name[0] +"_"+ full_name[1]).addClass('ui-multisort-click');
					
					$("#people-list").scrollTop(parseInt($("#"+ full_name[0] +"_"+ full_name[1]).index() * 20));
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
	
  $("#ElementPropertiesSaveButton").click( function() { 
  if (SelectedElem != "" ) {
		if (tableMode)
		{
			//var event = jQuery.Event("dblclick");
			//event.user = "SaveProperyTable";
			//SelectedElem.trigger(event);
		}
		else
		{
			var caption = $("#ElementCaption").val();
			var size = $("#ElementSize").val();
			var elementCaption = SelectedElem.context.getElementsByTagName("p");
			saveElementWithCaption(SelectedElem,caption,size,"");
			posPropertyPanel(SelectedElem);
		}
    }
  });
  
  $("#NumOfGuests").after(function(){
    refreshNumOfGuests();
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
	if ($(".DragDiv").size() >= maxTablesInCanvas)
	{
		$(".AddDiv").unbind('click');
		$(".AddDiv").attr('title',"Can't Add More Then " + maxTablesInCanvas + " Elements");
		$("#AddDivImg").attr('src',"/static/canvas/images/addDisable.png");
	}
  });
  
  $(document).mouseup(function(e) {
   if (!($(e.target).hasClass('DragDiv'))&&!($(e.target).hasClass('Property'))){
      if (SelectedElem != "" ) {
           SelectedElem.border('2px pink .5');
		   posPropertyPanel(SelectedElem);
      }
    }
	isMousePressFromCanvas = false;
	});
	
	$(document).before(function(){
		ShowHourGlassWaitingWindow(false);
	});

	$(document).ready(function(){
		HideHourGlassWaitingWindow();
	});
});

