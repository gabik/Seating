var SelectedElem = "" ;
var SelectedPerson = "" ;
var startDradPositionList = "";
var undoElementList = "";
var maxElementCapacity = 22;
var multiSelection = false;
var isMousePressFromCanvas = false;

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
       $.post('/canvas/save/', {elem_num: elementId, X: element.position().left , Y: element.position().top ,caption: "" ,size: ""},
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
       $.post('/canvas/save/', {elem_num: elementId, X: $("#"+elementId).position().left , Y: $("#"+elementId).position().top ,caption: "" ,size: ""},
         function(data){
           if (data.status == 'OK')
           {
             $("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
           }else{
             $("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
           }
         }, 'json');
}

function saveElementWithCaption(element,newCaption, newSize)
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
							$.post('/canvas/save/', {elem_num: element.context.id, X: element.position().left , Y: element.position().top ,caption: newCaption, size: newSize},
						    function(dataSave){
						    if (dataSave.status == 'OK')
						    {
								reloadElementAfterSave(element,newCaption,newSize,sizeStr);
								$("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
								location.reload();
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
		  $.post('/canvas/save/', {elem_num: element.context.id, X: element.position().left , Y: element.position().top ,caption: newCaption, size: newSize},
		  function(dataSave){
		    if (dataSave.status == 'OK')
		    {
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
}

function updateElementScreenProperties(element)
{
	var elementCaption = element.context.getElementsByTagName("p");
	$("#ElementCaption").attr("value",elementCaption[0].firstChild.nodeValue);
	$("#ElementSize").attr("value",elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1));
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

function isThisPeopleTable(id)
{
	if(id.indexOf("round_pink") == -1 && id.indexOf("long_square") == -1)
	{
		return false;
	}
	return true;
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
       $Draged = "";
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
    drop: function(e, ui ) {
	  var elementImgs = $(this).context.getElementsByTagName("img");
	  if (!isThisPeopleTable(elementImgs[0].id))
	  {
		return;
	  }
      if ($Draged != "")
      {
      $last_drag = "OK";
	  var table = $(this);
	  var elementCaption = $(this).context.getElementsByTagName("p");
	  var elementImgs = $(this).context.getElementsByTagName("img");
      $.post('/canvas/sit/', {table_id: $(this).context.id, person_id: $Draged.context.id},
        function(data){
          if (data.status == 'OK')
          {
            $Draged.hide();
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
          }else if (data.status == 'FULL')
          {
            $Draged.fadeTo(200, 1.0);
            alert ("Table is full");
			$("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
          }else{
            $Draged.fadeTo(200, 1.0);
            $("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
          }
        }, 'json');
      }
    }
  });
  $("#people_list > li").draggable({
    //snap: true,
    //snapMode: 'inner',
    helper: 'clone',
	cursor: "move",
    start: function (e, ui){
      //$(this).css("list-style-image", 'url("http://www.veryicon.com/icon/preview/Movie%20&%20TV/Super%20Heroes/Spider%20man%20Icon.jpg")');
      $last_drag = "ER";
      $Draged = $(this);
      $(this).fadeTo(200, 0.3);
      $("#SaveStatImg").attr("src", "http://careers.physicstoday.org/pics/icons/gma_red_50/js_saved_jobs.gif");
    },
    stop: function (e, ui) {
      if ($last_drag != "OK")
      { $(this).fadeTo(200, 1.0); }
      //alert($(this).position().left);
      //alert($(this).position().top);
      //alert($(this).context.id);
    }
  });
  $("#people_list > li").dblclick( function(){
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
   });
  $(".DelDiv").click( function() {
	if  (!detailsMode)
	{
		var answer;

		if (tableMode)
		{
			if (SelectedPerson != "")
			{
				answer = confirm("Are You Sure To Delete Person?");
			}
			else
			{
				alert ("Please select person");
			}
		}
		else
		{
			answer = confirm("Are You Sure To Delete Element?");
		}
		
		if (answer != undefined && answer)
		{
			if (tableMode)
			{
				DeletePerson();
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
						  location.reload();
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
					$.post('/canvas/add/', {kind: undoElement[0].context.id ,amount: 1},
					function(data){
					if (data.status == 'OK')
					{
					   undoElement[1] = "delete"; 
					   location.reload();
					}
					}, 'json');
					break;
				  }
			  case "delete":
			  {
				  $("#SaveStatImg").attr("src", "http://careers.physicstoday.org/pics/icons/gma_red_50/js_saved_jobs.gif");
				  $.post('/canvas/delete/', {elem_num: undoElement[0].context.id},
				  function(data){
				  if (data.status == 'OK')
				  { 
					 undoElement[1] = "add"; 
					 location.reload();
				  }
				  }, 'json');
				  break;
			  }
		   }
		}
	}
  });
  $("#people_list > li").click(function() {
    $(this).css("background-color",'blue');
	SelectedPerson = $(this);
	var element = $(this);
		$("#people_list > li").each(function(i) {
			if (element.context.id != $(this).context.id)
			{
				$(this).css("background-color",'white');
			}
		});
  });
  $(".DelPersonDiv").click( function() {
  	var answer = confirm("Are You Sure To Delete Person?");
    if (SelectedPerson != "" && answer)
	{
	   $.post('/canvas/delfp/', {person_id: SelectedPerson.context.id},
       function(data){
         if (data.status == 'OK')
         {
		   SelectedPerson.remove();
           $("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
         }else{
           $("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
         }
		 SelectedPerson = "";
         }, 'json');
	}
  });
  $(".AddPersonDiv").click( function() {
    $('ul.AddPerson').slideToggle('medium');
  }); 
  $("#AddPersonButton").click( function() {
    var first_name = document.getElementById("first_name").value;
    var last_name = document.getElementById("last_name").value;
	addPersonToFloatList(first_name,last_name);
  });
  $(".MenuItem").click( function() {
    $('ul.AddMenu').hide('medium');
    $.post('/canvas/add/', {kind: $(this).context.id ,amount: numOfElementsComboBox.options[numOfElementsComboBox.selectedIndex].text},
      function(data){
        if (data.status == 'OK')
        {
            //undoElement[0] = SelectedElem;
            //undoElement[1] = "delete"; 
            location.reload();
        }
      }, 'json');
  });
  $(document).keypress(function(e) {
   var code = (e.keyCode ? e.keyCode : e.which);
   if(code == 46) { //Del keycode
		$(".DelDiv").click();
   }
  });
  $("#SearchCaption").keypress(function() {
  	if ($("#SearchBy").val() == "Table")
	{
		 $.post('/canvas/findTables/', {name: $(this).val()},
		 function(data){
		   if (data.status == 'OK')
		   {
				searchResult =	data.objects.split(",",data.numOfResults + 1);
				$("input#SearchCaption").autocomplete({
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
					$("#"+ full_name[0] +"_"+ full_name[1]).click();
				}
			}
			}, 'json');
	}
	});
  $("#ElementPropertiesSaveButton").click( function() { 
  if (SelectedElem != "" ) {
    if (tableMode)
	{
		var event = jQuery.Event("dblclick");
		event.user = "SaveProperyTable";
		SelectedElem.trigger(event);
	}
	else
	{
		var caption = $("#ElementCaption").val();
		var size = $("#ElementSize").val();
		var elementCaption = SelectedElem.context.getElementsByTagName("p");
		saveElementWithCaption(SelectedElem,caption,size);
	}
    }
  });
  
  $(document).mouseup(function(e) {
   if (!($(e.target).hasClass('DragDiv'))&&!($(e.target).hasClass('Property'))){
      if (SelectedElem != "" ) {
           SelectedElem.border('2px pink .5');
      }
    }
	isMousePressFromCanvas = false;
	});
});

