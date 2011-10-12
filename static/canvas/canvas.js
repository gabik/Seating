
function menuItemClick(element)
{
	$('ul.AddMenu').hide('medium');
	var kind = element.context.id;

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
				  setSaveStatus("OK");
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
	}
  });
  
  $(".RectMenuItem").click( function() {
    menuItemClick($(this));
  });
  $(".MenuItem").click( function() {
    menuItemClick($(this));
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
  
});

