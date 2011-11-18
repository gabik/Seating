
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

function posPropertyPanel(element)
{
	if (element != "")
	{
		if (element.position().left < 600)
		{
			$("#element-properties-list").css('top',element.position().top);
			$("#element-properties-list").css('left',element.position().left + element.width() + 2);
			$("#element-properties-list").show("slide", { direction: "left" }, 50);
		}
		else
		{
			$("#element-properties-list").css('top',element.position().top);
			$("#element-properties-list").css('left',element.position().left - $("#element-properties-list").width() - 25);
			$("#element-properties-list").show("slide", { direction: "right" }, 50);
		}
	}
	else
	{
		$("#element-properties-list").hide();
		propMenuOpen = false;
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
	undoButtonPress();
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
