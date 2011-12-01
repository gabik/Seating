
function posPropertyPanel(element)
{
	if (element != "")
	{
		if (element.position().left < 600)
		{
			$("#element-properties-list").css('top',element.position().top);
			$("#element-properties-list").css('left', -$("#canvas-div").width() + element.position().left + element.width() - 20);
			$("#element-properties-list").show("slide", { direction: "left" }, 50);
		}
		else
		{
			$("#element-properties-list").css('top',element.position().top);
			$("#element-properties-list").css('left', -$("#canvas-div").width() + element.position().left - $("#element-properties-list").width() - 20);
			$("#element-properties-list").show("slide", { direction: "right" }, 50);
		}
	}
	else
	{
		$("#element-properties-list").hide();
		propMenuOpen = false;
	}
}

function addTableButtonPress()
{
	$('ul.AddMenu').slideToggle('medium');
}

function addMenuItemButtonPress(kind)
{
    $('ul.AddMenu').hide('medium');

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

function addMenuMouseLeave(element)
{
	$('ul.AddMenu').slideUp()('medium');
}

function addAligmentDivButtonPress()
{
	$('ul.AligmentMenu').slideToggle('medium');
}

function addAligmentDivButtonPress()
{
	$('ul.AligmentMenu').slideToggle('medium');
}

function shapePlacementDivButtonPress()
{
    $('ul.ShapePlacementMenu').slideToggle('medium');
}

function delTableButtonPress()
{
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
				answer = confirm("Are You Sure To Delete " + SelectedElem.text().split(" ", 2)[0] + " Element?");
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
				writeOccasionInfo("Move Person "+SelectedPerson.text()+"From Table "+SelectedElem.text().split(" ", 2)[0]+" To Float List.");
			}
			else
			{
				if (SelectedElem != "") {
				  setSaveStatus("Waiting");
				  $.post('/canvas/delete/', {elem_num: SelectedElem.context.id},
						function(data){
					  if (data.status == 'OK')
					  { 
						  //undoElement[0] = SelectedElem;
						  //undoElement[1] = "add"; 
						  ShowHourGlassWaitingWindow(true);
						  writeOccasionInfo("Delete Table "+SelectedElem.text().split(" ", 2)[0]+".");
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
}

function elementPropertiesSaveButtonClick() { 
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
}

$(document).ready(function() {

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
  $(".DelPersonDiv").click( function() {
  
	if (SelectedPerson != "" && !(tableMode))
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
			   setSaveStatus("OK");
			   updateSeatedLabel();
			 }else{
			   setSaveStatus("Error");
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
	/*if ($(".DragDiv").size() >= maxTablesInCanvas)
	{
		$(".AddDiv").unbind('click');
		$(".AddDiv").attr('title',"Can't Add More Then " + maxTablesInCanvas + " Elements");
		$("#AddDivImg").attr('src',"/static/canvas/images/addDisable.png");
	}*/
  });
	
	$(document).before(function(){
		ShowHourGlassWaitingWindow(false);
	});

	$(document).ready(function(){
		HideHourGlassWaitingWindow();
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

