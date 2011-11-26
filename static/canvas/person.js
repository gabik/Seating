var PersonLastPosition = new Array(2);//top,left
var personData ="";
var SelectedTable = "";
var detailsMode = false;
var SelectedPerson =""
var SelectedTabIndex = "";
var FocusFromFloatList = false;

jQuery(function() {
        jQuery("#tabs").tabs();
    });

function selectPersonElement(element)
{
	$(".TableElemImg").each(function(i) {
		$(this).border('0px white 0');
	});
	element.border('2px pink .5');
}

function enableDetailsMode()
{
	detailsMode = true;
  $("#ElementPropertiesSaveButton").attr('disabled', 'disabled');
  $("#ElementCaption").attr('disabled', 'disabled');
  $("#ElementSize").attr('disabled', 'disabled');
}

function disableDetailsMode()
{
	detailsMode = false;
  $("#ElementPropertiesSaveButton").removeAttr('disabled');
  $("#ElementCaption").removeAttr('disabled');
  $("#ElementSize").removeAttr('disabled');
}

function LoadPerson(element, i)
{
		$.post('/canvas/getItem/', {elem_num: element.context.id, position: parseInt(i + 1)},
        function(data){
			if (data.status == 'OK')
			{
				$("#tableElementDiv"+ data.position).addClass('Pointer');
				var title = document.getElementById("tableElementDiv" + data.position).title;
				
				if (title == "personTop"+ data.position || title == "personRight"+ data.position)
				{
					$("#tableElement"+ data.position).attr("src", "/static/canvas/images/chair_empty_top_right_occupied.png");
				}
				else
				{
					$("#tableElement"+ data.position).attr("src", "/static/canvas/images/chair_empty_bottom_left_occupied.png");
				}
				$("#tableElementDiv"+ data.position).draggable({
					containment: 'parent',
					cursor: "move",
					start:function (e,ui){
						StartDragPerson($(this));
					},
					drag:function (e,ui){
						DragPerson($(this),element);
					},
					stop:function (e,ui){
						personData = data;
						SelectedTable = element;
						StopDragPerson($(this),element);
					}
				});
				$("#tableElementDiv"+ data.position).bind('dblclick',function() {
					$("#tableElement"+ data.position).border('0px white 0');
					personData = data;
					FocusDetails($("#tableElementDiv"+ data.position),element,false);
				});
				$("#tableElementDiv"+ data.position).bind('click',function() {
					personData = data;
					SelectedTable = element;
					selectPersonElement($("#tableElement"+ data.position));
					SelectedPerson = $(this);
				});
				document.getElementById("tableElementCaption" + data.position).innerHTML = data.first_name + "</br>" + data.last_name;
			}
			else
			{
				var title = document.getElementById("tableElementDiv" + data.position).title;
				
				if (title == "personTop"+ data.position || title == "personRight"+ data.position)
				{
					$("#tableElement"+ data.position).attr("src", "/static/canvas/images/chair_empty_top_right.png");
				}
				else
				{
					$("#tableElement"+ data.position).attr("src", "/static/canvas/images/chair_empty_bottom_left.png");
				}
				document.getElementById("tableElementCaption" + data.position).innerHTML = "position " + data.position + "</br>empty";
			}
			}, 'json');
}

function FocusDetailsFromFloatList(personElement,hideAll)
{
	var full_name = "";
	full_name = personElement.context.id.split("_", 2);

	var first_Name = full_name[0];
	var last_Name = full_name[1];
		
	posPropertyPanel("");
	  
	if (detailsMode)
	{
		$.post('/canvas/getItem/', {position: "", firstName: first_Name, lastName: last_Name},
        function(data)
		{
			data = $.parseJSON(data);
			if (data.status == 'OK')
			{
				if(!$("#tab" + data.first_name.replace(" ","_") + '__'+ data.last_name.replace(" ","_")).length)
				{
					personData = data;
					personData.first_name = personData.first_name.replace(" ","_");
					personData.last_name = personData.last_name.replace(" ","_");
					$("#tabs").append($('<div id="tab' +personData.first_name + '__'+ personData.last_name+'"></div>'));
					createTab();
					$("#tabs").tabs("add","#tab" + personData.first_name + '__'+ personData.last_name, personData.first_name.replace("_"," ") + ' '+ personData.last_name.replace("_"," "));
				}
				$("#tabs").tabs("select","#tab" + data.first_name.replace(" ","_") + '__'+ data.last_name.replace(" ","_"));
			}
		});
	}
	else
	{
		if (hideAll)
		{
			hideAllDragDiv();
			hideTableElementDiv();
		}

		$.post('/canvas/getItem/', {position: "", firstName: first_Name, lastName: last_Name},
        function(data)
		{
			data = $.parseJSON(data);
			if (data.status == 'OK')
			{
				if (!FocusFromFloatList)
				{
					$("#canvas-div").append($(frameStringPD));
					if (data.gender == "M")
					{
						$("#personImg").attr('src',"/static/canvas/images/person/man_128X128.png");
					}
					else
					{
						$("#personImg").attr('src',"/static/canvas/images/person/woman_128X128.png");
					}
					FocusFromFloatList = true;
					$("#personImg").bind('dblclick', function(event) {
							CloseFocusDetailsFromFloatList(event);
					});
					personData = data;
					reLoadDetails(personElement);
					enableDetailsMode();
				}
			}
		});
	}
}

function CloseFocusDetailsFromFloatList(event)
{
	$("#SavePersonDetailsButton").remove();
	$("#details").animate({width: 1},300, 'linear', function() {
			$("#PDFrame").animate({top: $("#float-list").offset().top,left: $("#float-list").offset().left,width: 1, height: 1},300, 'linear', function() {
			$("#PDFrame").remove();
			FocusFromFloatList = false;
			$(".DragDiv").each(function(i) {
				$(this).fadeTo(400, 1,function(){
					if ($(".DragDiv").length - 1 == i)
					{	
						if (event != undefined)
						{
							if (event.user == "SearchGuest")
							{
								var data = event.pass.split(",",2);
								var newEvent = jQuery.Event("dblclick");
								newEvent.user = "SearchGuest";
								newEvent.pass = data[0] + "," + data[1] + ",New";
								
								$("#DragDiv-" + data[0]).trigger(newEvent);
							}
							else if (event.user == "SearchTable")
							{
								var data = event.pass;
								pointTableAfterSearch($("#" + data));
							}
						}
					}
				});
			});
			$(".DragNonDropDiv").each(function(i) {
				$(this).fadeTo(400, 1, function() {
					// Animation complete.
				});
			});
			PersonLastPosition[0] = "";
			PersonLastPosition[1] = "";
			disableDetailsMode();
			personData = "";
		});
	});
}

function FocusDetails(personElement,tableElement,hideAll,newEvent)
{
	posPropertyPanel("");
	if (tableMode)
	{
		var newPositionNum = SelectedPerson.context.title.substring(SelectedPerson.context.title.length - 1, SelectedPerson.context.title.length);
		
		if (hideAll)
		{
			hideAllDragDiv();
		}
		else
		{
			hideElement(tableElement);
		}
		
		$("#canvas-div").append($(frameStringPD));
		if (personData.gender == "M")
		{
			$("#personImg").attr('src',"/static/canvas/images/person/man_128X128.png");
		}
		else
		{
			$("#personImg").attr('src',"/static/canvas/images/person/woman_128X128.png");
		}		
		FocusFromFloatList = false;
		$("#personImg").bind('dblclick', function(event) {
				FocusDetails("","",false,event);
		});
		PersonLastPosition[0] = personElement.position().top;
		PersonLastPosition[1] = personElement.position().left;
		SelectedTable = tableElement;
		reLoadDetails(personElement);
		hideTableElementDiv();
		tableMode = false;
		enableDetailsMode();
	}
	else
	{
		$("#SavePersonDetailsButton").remove();
		$("#details").animate({width: 1},300, 'linear', function() {
			$("#PDFrame").animate({top: PersonLastPosition[0],left: PersonLastPosition[1],width: 1, height: 1},300, 'linear', function() {
				$("#PDFrame").remove();
				SelectedTable.fadeTo(400, 1,function(){
					$(".TableElementDiv").each(function(i) {
						$(this).fadeTo(400, 1,function(){
							if ($(".DragDiv").length - 1 == i)
								{	
									if (SelectedTable != "")
									{
										selectElement(SelectedTable);
									}
									if (newEvent != undefined)
									{
										if (newEvent.user == "SearchGuest")
										{
											var data = newEvent.pass.split(",",2);
											data = data[0] + "," + data[1] +",Selected";
											proccedSearchOnTableMode(data.split(",",3));
										}
										else if (newEvent.user == "SearchTable")
										{
											var data = newEvent.pass;
											proccedSearchOnRegluarMode(data);
										}
									}
								}
						});
					});
				});
				PersonLastPosition[0] = "";
				PersonLastPosition[1] = "";
				tableMode = true;
				disableDetailsMode();
			});
		});
		
	}
}

function selectTab(ui)
{
		var hash_name = ui.tab.hash;
		var full_name = "";

		hash_name = hash_name.replace("#tab","");
		full_name = hash_name.split("__", 2);

		$.post('/canvas/getItem/', {position: "", firstName: full_name[0].replace("_"," "), lastName: full_name[1].replace("_"," ")},
		function(data)
		{
			data = $.parseJSON(data);
			if (data.status == 'OK')
			{
				personData = data;
				personData.first_name = personData.first_name.replace(" ","_");
				personData.last_name = personData.last_name.replace(" ","_");
				//SelectedTabIndex = ui.index;
				SelectedTabIndex = $('#tabs').tabs("option", "selected");
				if (data.gender == "M")
				{
					$("#personImg").attr('src',"/static/canvas/images/person/man_128X128.png");
				}
				else
				{
					$("#personImg").attr('src',"/static/canvas/images/person/woman_128X128.png");
				}
			}
		});
}

function reLoadDetails(personElement)
{ 
	$("#PDFrame").css("top",personElement.position().top);
	$("#PDFrame").css("left",personElement.position().left);
	$("#PDFrame").css("height","1");
	$("#PDFrame").css("width","1");
	$("#details").css("height",DetailsHeight);
	$("#details").css("width","1");
	$("#PDFrame").animate({top:($("#canvas-div").position().top + $("#canvas-div").height()) / 2 - DetailsHeight / 2, left:($("#canvas-div").position().left + $("#canvas-div").width()) / 2 - DetailsWidth / 2.5, height: DetailsHeight},300, 'linear'); 
	$("#personImg").animate({width: 128, height: 128},300, 'linear', function() {
	$("#details").animate({width: DetailsWidth - 300},300, 'linear');
	$("#personImg").addClass("Pointer");
	if (personData != "")
	{
		personData.first_name = personData.first_name.replace(" ","_");
		personData.last_name = personData.last_name.replace(" ","_");
		$("#details").append($('<div id="tabs"><ul id="tabList" style="display:block; font-size:12; overflow: auto; height:30;"><li><a href="#tab' + personData.first_name + '__'+ personData.last_name +'">'+ personData.first_name.replace("_"," ") + ' '+ personData.last_name.replace("_"," ") +'</a></li></ul><div id="tab' +personData.first_name + '__'+ personData.last_name+'"></div></div>'));
		SelectedTabIndex = 0;
		$("#tabs").tabs();
		$("#tabs").bind('tabsselect', function(event, ui) {
				selectTab(ui);
		});
		createTab();
	}
	});
}

function createTab()
{
	personData.first_name = personData.first_name.replace(" ","_");
	personData.last_name = personData.last_name.replace(" ","_");
	
	var tab = $("#tab" +personData.first_name + '__'+ personData.last_name);
	
	if (tab.index() < 0)
	{
		$("#tabs").children().each(function(i) {
			if ($(this).context.id == "tab"+personData.first_name + '__'+ personData.last_name)
			{
				tab = $(this);
			}
		});
	}

	tab.append($('<p align="right" dir="rtl" class="text_14_black">שם פרטי:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><input MAXLENGTH=30 type="text" id="detailsFirstName' + personData.first_name + '_'+ personData.last_name+'" value="'+ personData.first_name.replace("_"," ") +'"/></span></p>'));
	tab.append($('<p align="right" dir="rtl" class="text_14_black">שם משפחה:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><input MAXLENGTH=30 type="text" id="detailsLastName' + personData.first_name + '_'+ personData.last_name+'" value="'+ personData.last_name.replace("_"," ") +'"/></span></p>'));
	tab.append($('<p align="right" dir="rtl" class="text_14_black">מספר טלפון:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><input MAXLENGTH=30 type="text" id="detailsPhoneNum' + personData.first_name + '_'+ personData.last_name+'" value="'+ personData.phone_num +'"/></span></p>'));
	tab.append($('<p align="right" dir="rtl" class="text_14_black">מייל:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><input MAXLENGTH=30 type="text" id="detailsE-mail' + personData.first_name + '_'+ personData.last_name+'" value="'+ personData.person_email +'"/></span></p>'));
	tab.append($('<p align="right" dir="rtl" class="text_14_black">סכום מתנה:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><input MAXLENGTH=7 type="text" id="detailsPresentAmount' + personData.first_name + '_'+ personData.last_name+'" value="'+ personData.present_amount +'"/></span></p>'));
	tab.append($('<p align="right" dir="rtl" class="text_14_black">חשבון פייסבוק:&nbsp;<span><input  MAXLENGTH=30 type="text" id="detailsFacebookAccount' + personData.first_name + '_'+ personData.last_name+'" value="'+ personData.facebook_account +'"/></span></p>'));
	tab.append($('<table border="0" cellspacing="0" cellpadding="0" align="right"><td align="right"><p align="right" dir="rtl" class="text_14_black">קבוצה:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><select size="1" value='+"personData.group"+' id="detailsGroup' + personData.first_name + '_'+ personData.last_name+'">&nbsp;&nbsp;&nbsp;&nbsp;</td><td><p align="right" dir="rtl" class="text_14_black">מין:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><select size="1" value='+"personData.gender"+' id="detailsGender' + personData.first_name + '_'+ personData.last_name+'"><option value="M">זכר<option value="F">נקבה</select></span></p></td>'));
	updateDetailPersonGroups($("#detailsGroup" + personData.first_name + '_'+ personData.last_name));
	$("#detailsGroup" + personData.first_name + '_'+ personData.last_name).val( personData.group );	
	$("#detailsGender" + personData.first_name + '_'+ personData.last_name).val( personData.gender );
	tab.append($('</br>'));
	tab.append($('<img id="SavePersonDetailsButton_'+personData.first_name + '_'+ personData.last_name +'" style="position:absolute; cursor:pointer;" alt="שמור שינויים" src="/static/right_interface/images/save_changes_n.png"/>'));
	$("#SavePersonDetailsButton_"+personData.first_name + '_'+ personData.last_name).css("top", DetailsHeight - 50);
	$("#SavePersonDetailsButton_"+personData.first_name + '_'+ personData.last_name).css("left", 15);
	$("#SavePersonDetailsButton_"+personData.first_name + '_'+ personData.last_name).bind('click', function() {
			savePersonChanges(personData.first_name,  personData.last_name);
	});
	$("#SavePersonDetailsButton_"+personData.first_name + '_'+ personData.last_name).fadeTo(2000, 1);
	tab.append($('<img id="ClosePersonDetailsButton_'+personData.first_name + '_'+ personData.last_name +'" style="position:absolute; background: transparent;" class="CloseBtn" alt="סגור חלון" src="/static/canvas/images/close_window_btn_n.png" width="16" height="16"/>'));
	$("#ClosePersonDetailsButton_"+ personData.first_name + '_'+ personData.last_name).css("top", 35);
	$("#ClosePersonDetailsButton_"+ personData.first_name + '_'+ personData.last_name).css("left", 15);
	$("#ClosePersonDetailsButton_"+ personData.first_name + '_'+ personData.last_name).bind('click', function() {
		if (SelectedTabIndex >= 0 && SelectedTabIndex < $("#tabs").tabs("length"))
		{
			 $("#tabs").tabs("remove",SelectedTabIndex);
			 if ($("#tabs").tabs("length") == 0)
			 {
				$("#personImg").dblclick();
				SelectedTabIndex = "";
			 }
		}
	});
	$("#ClosePersonDetailsButton_"+ personData.first_name + '_'+ personData.last_name).bind('mouseout', function(){
			$(this).attr('src',"/static/canvas/images/close_window_btn_n.png");
		});
	$("#ClosePersonDetailsButton_"+ personData.first_name + '_'+ personData.last_name).bind('mouseover', function(){
			$(this).attr('src',"/static/canvas/images/close_window_btn_r.png");
	});
	$("#SavePersonDetailsButton_"+ personData.first_name + '_'+ personData.last_name).bind('mouseout', function(){
			$(this).attr('src',"/static/right_interface/images/save_changes_n.png");
		});
	$("#SavePersonDetailsButton_"+ personData.first_name + '_'+ personData.last_name).bind('mouseover', function(){
			$(this).attr('src',"/static/right_interface/images/save_changes_r_white_back.png");
			});
}

function updateDetailPersonGroups(element)
{
	element.append($('<option value="Family ' + $("#firstPartnerName").text()+'">משפחה '+ $("#firstPartnerName").text() + '</option>'));
	element.append($('<option value="Friends ' + $("#firstPartnerName").text()+'">חברים '+ $("#firstPartnerName").text() + '</option>'));
	element.append($('<option value="Work ' + $("#firstPartnerName").text()+'">עבודה '+ $("#firstPartnerName").text() + '</option>'));
	if ($("#addChar").text() == " " || $("#addChar").text() == '')
	{
		element.append($('<option value="Family">משפחה כללי</option>'));
		element.append($('<option value="Work">חברים כללי</option>'));
		element.append($('<option value="Friends">עבודה כללי</option>'));
	}
	else
	{
		element.append($('<option value="Family ' + $("#secondPartnerName").text()+'">משפחה '+ $("#secondPartnerName").text() + '</option>'));
		element.append($('<option value="Work ' + $("#secondPartnerName").text()+'">חברים '+ $("#secondPartnerName").text() + '</option>'));
		element.append($('<option value="Friends ' + $("#secondPartnerName").text()+'">עבודה '+ $("#secondPartnerName").text() + '</option>'));
	}
	element.append($('<option value="Other" selected>אחר</option>'));
}

function DragPerson(personElement,tableElement)
{
	$("#dropLayer").remove();
	var lastPositionNum;
	
	if (IsNumeric(personElement.context.id.substring(personElement.context.id.length - 2, personElement.context.id.length)))
	{
		lastPositionNum =  personElement.context.id.substring(personElement.context.id.length - 2, personElement.context.id.length);
	}
	else
	{
		lastPositionNum =  personElement.context.id.substring(personElement.context.id.length - 1, personElement.context.id.length);
	}

	if (personElement.position().left > tableElement.position().left + tableElement.width())
	{
		fixPlaceFloat("personRight" , lastPositionNum);
	}
	else if (personElement.position().left + personElement.width() < tableElement.position().left)
	{
		fixPlaceFloat("personLeft" , lastPositionNum);
	}
	else if (personElement.position().top > tableElement.position().top + tableElement.height())
	{
		fixPlaceFloat("personBottom" , lastPositionNum);
	}
	else if (personElement.position().top + personElement.height() < tableElement.position().top)
	{
		fixPlaceFloat("personTop" , lastPositionNum);
	}
	
	var collision = collisionWithOtherPersonElement(personElement);
	
	if (collision[0])
	{
		var collisionPerson = collision[1];
		
		$("#canvas-div").append($('<div Id="dropLayer" style="position:absolute;"/>'));
		$("#dropLayer").css("background-color", "purple");
		$("#dropLayer").css('zIndex', 9999);
		$("#dropLayer").css("top", collisionPerson.position().top);
		$("#dropLayer").css("left", collisionPerson.position().left);
		$("#dropLayer").css("width", collisionPerson.width());
		$("#dropLayer").css("height", collisionPerson.height());
		$("#dropLayer").css("opacity", 0.1);
	}
}

function StartDragPerson(element)
{
	var positionNum;
	
	if (IsNumeric(element.context.id.substring(element.context.id.length - 2, element.context.id.length)))
	{
		positionNum =  element.context.id.substring(element.context.id.length - 2, element.context.id.length);
	}
	else
	{
		positionNum =  element.context.id.substring(element.context.id.length - 1, element.context.id.length);
	}

	setSaveStatus("Waiting");
		
	PersonLastPosition[0] = $("#tableElementDiv"+ positionNum).position().top;
	PersonLastPosition[1] = $("#tableElementDiv"+ positionNum).position().left;
}

function StopDragPerson(element,tableElement)
{
	var collision = collisionWithOtherPersonElement(element);
	var lastPositionNum;
	
	if (IsNumeric(element.context.id.substring(element.context.id.length - 2, element.context.id.length)))
	{
		lastPositionNum = element.context.id.substring(element.context.id.length - 2, element.context.id.length);
	}
	else
	{
		lastPositionNum = element.context.id.substring(element.context.id.length - 1, element.context.id.length);
	}

	var cleanTitleThis;	
	
	if (IsNumeric(element.context.title.substring(element.context.title.length - 2, element.context.id.length)))
	{
		cleanTitleThis = element.context.title.substring(0, element.context.title.length - 2);
	}
	else
	{
		cleanTitleThis= element.context.title.substring(0, element.context.title.length - 1);
	}
	var realOldPosition;
	var realNewPosition;
	
	$("#dropLayer").remove();
	if (collision[0])
	{
		var collisionPerson = collision[1];
		var newTop = collision[1].position().top;
		var newLeft = collision[1].position().left;
							
		collision[1].animate({top: PersonLastPosition[0],left: PersonLastPosition[1]});
		if (IsNumeric(element.context.title.substring(element.context.title.length - 2, element.context.title.length)))
		{
			realOldPosition = element.context.title.substring(element.context.title.length - 2, element.context.title.length);	
		}
		else
		{
			realOldPosition = element.context.title.substring(element.context.title.length - 1, element.context.title.length);	
		}
		if (IsNumeric(collision[1].context.title.substring(collision[1].context.title.length - 2, collision[1].context.title.length)))
		{
			realNewPosition = collision[1].context.title.substring(collision[1].context.title.length - 2, collision[1].context.title.length);
		}
		else
		{
			realNewPosition = collision[1].context.title.substring(collision[1].context.title.length - 1, collision[1].context.title.length);
		}
		element.animate({top: newTop,left: newLeft},function() {
				
			var newPositionNum;
			
			if (IsNumeric(collision[1].context.id.substring(collision[1].context.id.length - 2, collision[1].context.id.length)))
			{
				newPositionNum = collision[1].context.id.substring(collision[1].context.id.length - 2, collision[1].context.id.length);	
			}
			else
			{
				newPositionNum = collision[1].context.id.substring(collision[1].context.id.length - 1, collision[1].context.id.length);	
			}
			
			var cleanTitleCollision;
			
			if (IsNumeric(collision[1].context.title.substring(collision[1].context.title.length - 2, collision[1].context.title.length)))
			{
				cleanTitleCollision = collision[1].context.title.substring(0, collision[1].context.title.length - 2);
			}
			else
			{
				cleanTitleCollision = collision[1].context.title.substring(0, collision[1].context.title.length - 1);
			}

			if (cleanTitleThis != cleanTitleCollision)
			{
				fixPlaceFloat(cleanTitleThis , newPositionNum);
				fixPlaceFloat(cleanTitleCollision , lastPositionNum);
			}
															
			var tempTitle = element.context.title;
								
			element.attr("title" ,collision[1].context.title);
			collision[1].attr("title" ,tempTitle);

			if ($("#tableElementDiv"+ newPositionNum).text().indexOf("empty") >= 0)
			{
				document.getElementById("tableElementCaption" +newPositionNum).innerHTML = "position " + realOldPosition + "</br>empty";
			}
				selectPersonElement($("#tableElement"+ lastPositionNum));
				SelectedPerson = element;			
			});

			$.post('/canvas/swapPos/', {elem_num: tableElement.context.id, first_position: realOldPosition, second_position: realNewPosition},
			function(data){
           if (data.status == 'OK')
           {
				setSaveStatus("OK");
			}
			else
			{
				setSaveStatus("Error");
			}
			}, 'json');

		}
		else
		{
			fixPlaceFloat(cleanTitleThis , lastPositionNum);
			setSaveStatus("OK");
			element.animate({top: PersonLastPosition[0],left: PersonLastPosition[1]},function() {selectPersonElement($("#tableElement"+lastPositionNum)); SelectedPerson = element;});
		}
}

function hideAllDragDiv()
{
	$(".DragDiv").each(function(i) {
		$(this).border('0px white 0');
		$(this).fadeTo(400, 0, function() {
			// Animation complete.
			$(this).hide();
		});
	});
	$(".DragNonDropDiv").each(function(i) {
		$(this).fadeTo(400, 0, function() {
			// Animation complete.
			$(this).hide();
		});
	});
}

function hideTableElementDiv()
{
	$(".TableElementDiv").each(function(i) {
		$(this).fadeTo(400, 0, function() {
		$(this).hide();
			});
	});
}
		
function hideElement(element)
{
	element.border('0px white 0');
	element.fadeTo(400, 0, function() {
		// Animation complete.
		$(this).hide();
	});
}
									
//Check if 2 objects intersect
function collisionWithOtherPersonElement(element)
{
	var returnArray = new Array(2);//[bool,intersect value]
	var match = false;
	var pos = getPositions(document.getElementById(element.context.id));
	
	returnArray[1] = "";
	$(".TableElementDiv").each(function(i) {
		if (element.context.id != $(this).context.id)
		{
			var pos2 = getPositions(this);
			var horizontalMatch = comparePositions(pos[0], pos2[0]);
			var verticalMatch = comparePositions(pos[1], pos2[1]);
			match = horizontalMatch && verticalMatch;
			if (match)
			{
				returnArray[1] = $(this);
				return false;
			}
		}
	});
	
	if (match)
	{
		returnArray[0] = true;
	}
	else
	{
		returnArray[0] = false;
	}
	return returnArray;
}

function savePersonChanges(firstName, lastName)
{
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	
	$("#EmailValidtion").remove();
	firstName = firstName.replace(" ","_");
	lastName = lastName.replace(" ","_");
	if(!emailReg.test($("#detailsE-mail" + firstName + '_'+ lastName).val())) {
      $("#detailsE-mail" + firstName + '_'+ lastName).after('<span id="EmailValidtion" style="color:red">נא הכנס כתובת חוקית.</span>');
    }
	else
	{
    $.post('/canvas/savePerson/', {old_first_name: firstName.replace("_"," "), old_last_name: lastName.replace("_"," "), first_name: $("#detailsFirstName" + firstName + '_'+ lastName).val() , last_name:$("#detailsLastName" + firstName + '_'+ lastName).val() ,phone_num: $("#detailsPhoneNum" + firstName + '_'+ lastName).val() ,person_email: $("#detailsE-mail" + firstName + '_'+ lastName).val(),present_amount: $("#detailsPresentAmount" + firstName + '_'+ lastName).val(),facebook_account: $("#detailsFacebookAccount" + firstName + '_'+ lastName).val(), group:$("#detailsGroup" + firstName + '_'+ lastName).val(), gender:$("#detailsGender" + firstName + '_'+ lastName).val()},
      function(data){
		$("#SaveStatImg").fadeTo(400, 0);
        if (data.status == 'OK')
		{
		  personData.first_name = $("#detailsFirstName" + firstName + '_'+ lastName).val();
		  personData.last_name = $("#detailsLastName" + firstName + '_'+ lastName).val();
		  personData.phone_num = $("#detailsPhoneNum" + firstName + '_'+ lastName).val();
		  personData.person_email = $("#detailsE-mail" + firstName + '_'+ lastName).val();
		  personData.present_amount = $("#detailsPresentAmount" + firstName + '_'+ lastName).val();
		  personData.facebook_account = $("#detailsFacebookAccount" + firstName + '_'+ lastName).val();
		  personData.group = $("#detailsGroup" + firstName + '_'+ lastName).val();
		  personData.gender = $("#detailsGender" + firstName + '_'+ lastName).val();
		  if (personData.position > 0)
		  {
			document.getElementById("tableElementCaption" + personData.position).innerHTML = personData.first_name + "</br>" + personData.last_name;
		  }
		  else
		  {
			document.getElementById(firstName.replace("_"," ") + '_' + lastName.replace("_"," ")).innerHTML = personData.first_name + " " + personData.last_name;
			
			var floatPerson = $("#" + firstName.replace("_"," ") + '_' + lastName.replace("_"," "));
			
			if (floatPerson.index() < 0)
			{
				$("#people_list > li").each(function(j) { if ($(this).context.id == firstName.replace("_"," ") + '_' + lastName.replace("_"," ")){ floatPerson = $(this);}});
			}
			floatPerson.css("text",personData.first_name + " " + personData.last_name);
			floatPerson.attr("id", personData.first_name + "_" + personData.last_name);
			floatPerson.removeClass('femaleli');
			floatPerson.removeClass('maleli');
			if ($("#detailsGender"+ firstName + '_'+ lastName).val() == "M")
		   {
				floatPerson.addClass('maleli');
		   }
			else
		   {
				floatPerson.addClass('femaleli');
		   }
		  }
		  $("#tabs li:eq(" + SelectedTabIndex + ") a").html(personData.first_name + " " + personData.last_name);
		  personData.first_name = personData.first_name.replace(" ","_");
		  personData.last_name = personData.last_name.replace(" ","_");
		  $("#tabs li:eq(" + SelectedTabIndex + ") a").attr("href", "#tab" + personData.first_name + '__' + personData.last_name)
		  $("#tab" + firstName + '__' + lastName).attr("id","tab"+ personData.first_name + '__' + personData.last_name);
		  $("#detailsFirstName"+ firstName + '_'+ lastName).attr("id","detailsFirstName"+ personData.first_name + '_'+ personData.last_name);
		  $("#detailsLastName"+ firstName + '_'+ lastName).attr("id","detailsLastName"+ personData.first_name + '_'+ personData.last_name);
		  $("#detailsPhoneNum"+ firstName + '_'+ lastName).attr("id","detailsPhoneNum"+ personData.first_name + '_'+ personData.last_name);
		  $("#detailsE-mail"+ firstName + '_'+ lastName).attr("id","detailsE-mail"+ personData.first_name + '_'+ personData.last_name);
		  $("#detailsPresentAmount"+ firstName + '_'+ lastName).attr("id","detailsPresentAmount"+ personData.first_name + '_'+ personData.last_name);
		  $("#detailsFacebookAccount"+ firstName + '_'+ lastName).attr("id","detailsFacebookAccount"+ personData.first_name + '_'+ personData.last_name);
		  $("#detailsGroup"+ firstName + '_'+ lastName).attr("id","detailsGroup"+ personData.first_name + '_'+ personData.last_name);
		  $("#detailsGender"+ firstName + '_'+ lastName).attr("id","detailsGender"+ personData.first_name + '_'+ personData.last_name);
		  
		  if ($("#detailsGender"+ personData.first_name + '_'+ personData.last_name).val() == "M")
		  {
				$("#personImg").attr('src',"/static/canvas/images/person/man_128X128.png");
		  }
			else
		  {
				$("#personImg").attr('src',"/static/canvas/images/person/woman_128X128.png");
		  }
		  $("#SavePersonDetailsButton_"+ firstName + '_'+ lastName).attr("id","SavePersonDetailsButton_"+ personData.first_name + '_'+ personData.last_name);
		  $("#ClosePersonDetailsButton_"+ firstName + '_'+ lastName).attr("id","ClosePersonDetailsButton_"+ personData.first_name + '_'+ personData.last_name);
          setSaveStatus("OK");
        }else{
          setSaveStatus("Error");
        }
		$("#SaveStatImg").fadeTo(400, 1);
    }, 'json');
	}
}

function DeletePerson()
{
	if (SelectedPerson != "" && personData != "" && SelectedTable!= "")
	{
	  var newPositionNum = SelectedPerson.context.title.substring(SelectedPerson.context.title.length - 1, SelectedPerson.context.title.length);
	  $.post('/canvas/bringToFloatList/', {elem_num: SelectedTable.context.id, position: parseInt(newPositionNum)},
      function(data){
		$("#SaveStatImg").fadeTo(400, 0);
        if (data.status == 'OK')
		{
		  var elementCaption = SelectedTable.context.getElementsByTagName("p");
		  var elementMaxSize = parseInt(elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1));
		  var newSize = parseInt(elementCaption[1].firstChild.nodeValue.split("/", 1)) - 1;
		  var sizeStr = newSize + "/" + elementMaxSize;
		  elementCaption[1].innerHTML = sizeStr;
		  reloadElementStatus(SelectedTable);
		  document.getElementById("tableElementCaption" + personData.position).innerHTML = "position " + newPositionNum + "</br>empty";
		  //$("#tableElement" + personData.position).attr("src", "/static/canvas/images/WeddingChair.png");
		  SelectedPerson.border('0px white 0');
		  selectPersonElement($("#tableElement" + personData.position));
		  SelectedPerson = "";
          setSaveStatus("OK");
		  ShowHourGlassWaitingWindow(true);
		  //		  addPersonToFloatList(personData.first_name,personData.last_name);
        }else{
          setSaveStatus("Error");
        }
		$("#SaveStatImg").fadeTo(400, 1);
    }, 'json');

	}
	else
	{
		alert ("Please select person");
	}
}

function proccedSearchOnTableMode(data)
{
	var currentSelectedTable = SelectedTable;
	
	if (currentSelectedTable == "")
	{
		currentSelectedTable = SelectedElem;
	}
	if (currentSelectedTable != "")
	{
		var event = jQuery.Event("dblclick");
		event.user = "SearchGuest";
		if (currentSelectedTable.context.id.trim().toLowerCase() != ("DragDiv-" + data[0]).trim().toLowerCase())
		{
			if (data[2] == "Selected")
			{
				event.pass = data[0] + "," + data[1] +",Selected";
				currentSelectedTable.trigger(event);
			}
			else
			{
				event.pass = data[0] + "," + data[1] +",New";
				$("#DragDiv-" + data[0]).trigger(event);
			}
		}
		else
		{
			pointPersonAfterSearch($("#tableElementDiv"+ data[1]),$("#tableElement"+ data[1]));
			$("#tableElementDiv"+ data[1]).click();
		}
	}
}

$(document).ready(function() {
	if (navigator.userAgent.toLowerCase().indexOf('chrome') > 0)
	{
		DetailsHeight = DetailsHeight + 22;
	}
});
 