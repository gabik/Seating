var PersonLastPosition = new Array(2);//top,left
var personData ="";
var SelectedTable = "";
var detailsMode = false;
var SelectedPerson =""
var SelectedTabIndex = "";
var FocusFromFloatList = false;
var duplicatePerson = false;
var canDragPersonAgain = true;
var droppingPerson = false;
var bringPersonToFL = true;
var lastMode = "";
var dropMoreThenOnChair = false;

jQuery(function() {
        jQuery("#tabs").tabs();
    });
	
function findAllGuestFromFloatList()
{
	var amount = 0;
	
	$("#people_list > li").each( function(i){
		if (!(IsNumeric($(this).data('qty'))))
		{
			updatePerQTY($(this));
		}
		amount = amount + parseInt($(this).data('qty'));
	});
	
	return amount;
}

function updatePerQTY(person)
{
	if (person.hasClass('perli2'))
	{
		person.data('qty', 2);	
	}
	else if (person.hasClass('perli3'))
	{
		person.data('qty', 3);	
	}
	else if (person.hasClass('perli4'))
	{
		person.data('qty', 4);	
	}
	else if (person.hasClass('perli5'))
	{
		person.data('qty', 5);	
	}
	else if (person.hasClass('perli6'))
	{
		person.data('qty', 6);	
	}
	else if (person.hasClass('perli7'))
	{
		person.data('qty', 7);	
	}
	else if (person.hasClass('perli8'))
	{
		person.data('qty', 8);	
	}
	else if (person.hasClass('perli9'))
	{
		person.data('qty', 9);	
	}
	else
	{
		person.data('qty', 1);	
	}
}
	
function selectPersonElement(element)
{
	$(".TableParentElementDiv").each(function(i) {
		$(this).removeClass('borderPersonSelected');
	});
	$(".TableParentElementDivOutside").each(function(i) {
		$(this).removeClass('borderPersonSelected');
	});
	SelectedTable = $("#" + element.data('elem'));
	SelectedPerson = element;
	element.addClass('borderPersonSelected');
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

function LoadPerson(element, i, fromTableMode)
{	

		var elemID = element.attr('id');
		var mode = "T";
			
		if (!fromTableMode)
		{
			mode = "NT";
		}

		$.post('/canvas/getItem/', {elem_num: elemID, position: parseInt(i + 1)},
        function(data){
			if (data.status == 'OK')
			{
				$("#tableParentElementDiv"+ data.position + elemID + mode).data('status','nemp');
				//data.position = $("#tableElementDiv"+ data.position + elemID + mode).data('pos');
				//elemID = $("#tableElementDiv"+ data.position + elemID + mode).data('elem');
				
			
				$("#tableElementDiv"+ data.position + elemID + mode).droppable( 'disable' );
				$("#tableElementDiv"+ data.position + elemID + mode).draggable( 'enable' );
				
				if (drag)
				{
					if (SelectedElem != "" && SelectedElem.attr('id') == elemID)
					{
						$("#tableParentElementDiv"+ data.position + elemID + mode).fadeTo(100,0);
					}
					
					if (selectionElementsList != "")
					{
						for (var y = 0; y < selectionElementsList.length; y++)
						{
							if (selectionElementsList[y] == elemID)
							{
								$("#tableParentElementDiv"+ data.position + elemID + mode).fadeTo(100,0);
							}
						}
					}
				}
				else
				{
					if ((!fromTableMode && tableMode) || detailsMode)
					{
						$("#tableParentElementDiv"+ data.position + elemID + mode).fadeTo(100,0);
					}
					else
					{
						if ($("#tableParentElementDiv"+ data.position + elemID + mode).html())
						{
							$("#tableParentElementDiv" + data.position + elemID + mode).fadeTo(250,1);
						}
					}
				}
				
				$("#tableParentElementDiv"+ data.position + elemID + mode).find('tr').last().css('display', 'block');
				$("#tableParentElementDiv"+ data.position + elemID + mode).find('p').first().css('display', 'none');
				$("#tableParentElementDiv"+ data.position + elemID + mode).find('p').last().css('display','block');
				if (fromTableMode)
				{
					$("#tableParentElementDiv"+ data.position + elemID + mode).find('p').last().text(data.first_name + " " + data.last_name);
				}
				else
				{
					$("#tableParentElementDiv"+ data.position + elemID + mode).find('p').last().text(data.first_name);
				}
				$("#tableParentElementDiv"+ data.position + elemID + mode).attr('title', data.first_name + " " + data.last_name + " לחיצה כפולה לעריכה");
				$("#tableElementDiv"+ data.position + elemID + mode).addClass('Pointer');
				$("#tableElementDiv"+ data.position + elemID + mode).removeClass('WaitingPersonChair');
				$("#tableElementDiv"+ data.position + elemID + mode).removeClass('TableElementDiv');
				$("#tableElementDiv"+ data.position + elemID + mode).removeClass('TableElementDiv64');
				
				if (!fromTableMode)
				{
					$("#tableElementDiv"+ data.position + elemID + mode).addClass('TableOccElementDiv');
				}
				else
				{
					$("#tableElementDiv"+ data.position + elemID + mode).addClass('TableOccElementDiv64');
				}
				$("#tableElementDiv"+ data.position + elemID + mode).css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/ChairOcc.png',sizingMethod='scale');");
				$("#tableElementDiv"+ data.position + elemID + mode).css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/ChairOcc.png',sizingMethod='scale')';");
				
				$("#tableParentElementDiv"+ data.position + elemID + mode).draggable({
					containment: 'parent',
					cursor: "move",
					start:function (e,ui){
						SelectedPerson = $("#tableParentElementDiv"+ data.position + elemID + mode);
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
				$("#tableElementDiv"+ data.position + elemID + mode).bind('dblclick',function() {
					$("#tableElementDiv"+ data.position + elemID + mode).removeClass('borderPersonSelected');
					personData = data;
					FocusDetails($("#tableElementDiv"+ data.position + elemID + mode),element, !fromTableMode);
				});
				$("#tableElementDiv"+ data.position + elemID + mode).bind('mousedown',function() {
					personData = data;
					SelectedTable = element;
					if (bringPersonToFL)
					{
						selectPersonElement($("#tableParentElementDiv"+ data.position + elemID + mode));
					}
					SelectedPerson = $("#tableParentElementDiv"+ data.position + elemID + mode);
				});
			}
			else
			{
					$("#tableElementDiv"+ data.position + elemID + mode).droppable( 'enable' );
					if ($("#tableElementDiv"+ data.position + elemID + mode).html())
					{
						$("#tableParentElementDiv"+ data.position + elemID + mode).data('status', 'emp');
						$("#tableElementDiv"+ data.position + elemID + mode).droppable({
									accept: "#people_list li",
									hoverClass: "dropLayerClass",
									drop: function(e, ui ) {
										$("#tableParentElementDiv"+ data.position + elemID + mode).data('status', 'nemp');
										dropPersonFromChairWithPosition(ui, $("#tableElementDiv"+ data.position + elemID + mode).data('pos'), element, fromTableMode);
									}
						});
						$("#tableParentElementDiv"+ data.position + elemID + mode).find('p').first().css('display', 'block');
						$("#tableElementDiv"+ data.position + elemID + mode).removeClass('WaitingPersonChair');
						if (!fromTableMode)
						{
							$("#tableElementDiv"+ data.position + elemID + mode).addClass('TableElementDiv');
						}
						else
						{
							$("#tableElementDiv"+ data.position + elemID + mode).addClass('TableElementDiv64');
						}
						$("#tableElementDiv"+ data.position + elemID + mode).css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/Chair.png',sizingMethod='scale');");
					    $("#tableElementDiv"+ data.position + elemID + mode).css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/Chair.png',sizingMethod='scale')';");
						
						if (drag)
						{
							if (SelectedElem != "" && SelectedElem.attr('id') == elemID)
							{
								$("#tableParentElementDiv"+ data.position + elemID + mode).fadeTo(100,0);
							}
							
							if (selectionElementsList != "")
							{
								for (var y = 0; y < selectionElementsList.length; y++)
								{
									if (selectionElementsList[y] == elemID)
									{
										$("#tableParentElementDiv"+ data.position + elemID + mode).fadeTo(100,0);
									}
								}
							}
						}
						else
						{
							if ((!fromTableMode && tableMode) || detailsMode)
							{
								$("#tableParentElementDiv"+ data.position + elemID + mode).fadeTo(100,0);
							}
							else
							{
								$("#tableParentElementDiv"+ data.position + elemID + mode).fadeTo(250,1);
								$("#tableElementDiv"+ data.position + elemID + mode).fadeTo(250,1);
							}
						}
					}
			}
			}, 'json');
}

function LoadPersonWithData(data, element, i, fromTableMode)
{	
		var elemID = element.attr('id');
		var mode = "T";
			
		if (!fromTableMode)
		{
			mode = "NT";
		}

		if (data.status == 'OK')
		{
			$("#tableParentElementDiv"+ data.position + elemID + mode).data('status','nemp');
			//data.position = $("#tableElementDiv"+ data.position + elemID + mode).data('pos');
			//elemID = $("#tableElementDiv"+ data.position + elemID + mode).data('elem');
			
		
			$("#tableElementDiv"+ data.position + elemID + mode).droppable( 'disable' );
			$("#tableElementDiv"+ data.position + elemID + mode).draggable( 'enable' );
			
			if (drag)
			{
				if (SelectedElem != "" && SelectedElem.attr('id') == elemID)
				{
					$("#tableParentElementDiv"+ data.position + elemID + mode).fadeTo(100,0);
				}
				
				if (selectionElementsList != "")
				{
					for (var y = 0; y < selectionElementsList.length; y++)
					{
						if (selectionElementsList[y] == elemID)
						{
							$("#tableParentElementDiv"+ data.position + elemID + mode).fadeTo(100,0);
						}
					}
				}
			}
			else
			{
				if ((!fromTableMode && tableMode) || detailsMode)
				{
					$("#tableParentElementDiv"+ data.position + elemID + mode).fadeTo(100,0);
				}
				else
				{
					if ($("#tableParentElementDiv"+ data.position + elemID + mode).html())
					{
						$("#tableParentElementDiv" + data.position + elemID + mode).fadeTo(250,1);
					}
				}
			}
			
			$("#tableParentElementDiv"+ data.position + elemID + mode).find('tr').last().css('display', 'block');
			$("#tableParentElementDiv"+ data.position + elemID + mode).find('p').first().css('display', 'none');
			$("#tableParentElementDiv"+ data.position + elemID + mode).find('p').last().css('display','block');
			if (fromTableMode)
			{
				$("#tableParentElementDiv"+ data.position + elemID + mode).find('p').last().text(data.first_name + " " + data.last_name);
			}
			else
			{
				$("#tableParentElementDiv"+ data.position + elemID + mode).find('p').last().text(data.first_name);
			}
			$("#tableParentElementDiv"+ data.position + elemID + mode).attr('title', data.first_name + " " + data.last_name + " לחיצה כפולה לעריכה");
			$("#tableElementDiv"+ data.position + elemID + mode).addClass('Pointer');
			$("#tableElementDiv"+ data.position + elemID + mode).removeClass('WaitingPersonChair');
			$("#tableElementDiv"+ data.position + elemID + mode).removeClass('TableElementDiv');
			$("#tableElementDiv"+ data.position + elemID + mode).removeClass('TableElementDiv64');
			
			if (!fromTableMode)
			{
				$("#tableElementDiv"+ data.position + elemID + mode).addClass('TableOccElementDiv');
			}
			else
			{
				$("#tableElementDiv"+ data.position + elemID + mode).addClass('TableOccElementDiv64');
			}
			$("#tableElementDiv"+ data.position + elemID + mode).css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/ChairOcc.png',sizingMethod='scale');");
			$("#tableElementDiv"+ data.position + elemID + mode).css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/ChairOcc.png',sizingMethod='scale')';");
			
			$("#tableParentElementDiv"+ data.position + elemID + mode).draggable({
				containment: 'parent',
				cursor: "move",
				start:function (e,ui){
					SelectedPerson = $("#tableParentElementDiv"+ data.position + elemID + mode);
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
			$("#tableElementDiv"+ data.position + elemID + mode).bind('dblclick',function() {
				$("#tableElementDiv"+ data.position + elemID + mode).removeClass('borderPersonSelected');
				personData = data;
				FocusDetails($("#tableElementDiv"+ data.position + elemID + mode),element, !fromTableMode);
			});
			$("#tableElementDiv"+ data.position + elemID + mode).bind('click',function() {
				personData = data;
				SelectedTable = element;
				if (bringPersonToFL)
				{
					selectPersonElement($("#tableParentElementDiv"+ data.position + elemID + mode));
				}
				SelectedPerson = $("#tableParentElementDiv"+ data.position + elemID + mode);
			});
		}
		else
		{
				$("#tableElementDiv"+ data.position + elemID + mode).droppable( 'enable' );
				if ($("#tableElementDiv"+ data.position + elemID + mode).html())
				{
					$("#tableParentElementDiv"+ data.position + elemID + mode).data('status', 'emp');
					$("#tableElementDiv"+ data.position + elemID + mode).droppable({
								accept: "#people_list li",
								hoverClass: "dropLayerClass",
								drop: function(e, ui ) {
									$("#tableParentElementDiv"+ data.position + elemID + mode).data('status', 'nemp');
									dropPersonFromChairWithPosition(ui, $("#tableElementDiv"+ data.position + elemID + mode).data('pos'), element, fromTableMode);
								}
					});
					$("#tableParentElementDiv"+ data.position + elemID + mode).find('p').first().css('display', 'block');
					$("#tableElementDiv"+ data.position + elemID + mode).removeClass('WaitingPersonChair');
					if (!fromTableMode)
					{
						$("#tableElementDiv"+ data.position + elemID + mode).addClass('TableElementDiv');
					}
					else
					{
						$("#tableElementDiv"+ data.position + elemID + mode).addClass('TableElementDiv64');
					}
					$("#tableElementDiv"+ data.position + elemID + mode).css("filter"," progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/Chair.png',sizingMethod='scale');");
					$("#tableElementDiv"+ data.position + elemID + mode).css("-ms-filter", "'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/canvas/images/Chair.png',sizingMethod='scale')';");
					
					if (drag)
					{
						if (SelectedElem != "" && SelectedElem.attr('id') == elemID)
						{
							$("#tableParentElementDiv"+ data.position + elemID + mode).fadeTo(100,0);
						}
						
						if (selectionElementsList != "")
						{
							for (var y = 0; y < selectionElementsList.length; y++)
							{
								if (selectionElementsList[y] == elemID)
								{
									$("#tableParentElementDiv"+ data.position + elemID + mode).fadeTo(100,0);
								}
							}
						}
					}
					else
					{
						if ((!fromTableMode && tableMode) || detailsMode)
						{
							$("#tableParentElementDiv"+ data.position + elemID + mode).fadeTo(100,0);
						}
						else
						{
							$("#tableParentElementDiv"+ data.position + elemID + mode).fadeTo(250,1);
							$("#tableElementDiv"+ data.position + elemID + mode).fadeTo(250,1);
						}
					}
				}
		}
}

function dropPersonFromChairWithPosition(ui, pos, element, tmode)
{
	if (dropMoreThenOnChair)
	{
		showLightMsg("גרירת אורח לאמנט","לא ניתן לגרור ליותר ממקום אחד, יש לוודא כי רק כיסא או שולחן אחד מסומן. </br> לחיצה כפולה על השולחן תאפשר להתמקד בו.","OK","Notice");
		sameMsg = true;
	}
	else
	{
		var elemID = element.context.id;
		var mode = "T";
		
		if (!tmode)
		{
			mode = "NT";
		}
		
		if (ui.helper.size() == 1 && ui.draggable.data('qty') == 1)
		{
		  ui.helper.each(function(j){
		  if (dropAllow)
		  {
			dropPerson($(this), element,  pos); 
		  }
		  elemID = $("#tableElementDiv"+ pos + elemID + mode).data('elem');
		  $("#tableElementDiv"+  pos + elemID + mode).data('dropEvent', 1);
		  });
		}
		else
		{
			showLightMsg("גרירת אורח לאמנט","לא ניתן לגרור לכיסא יותר ממוזמן אחד, </br> יש לגרור לשולחן עצמו.","OK","Notice");
		}
	}
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
				if(!$("#tab" + data.first_name.replace(/\ /g,"_") + '__'+ data.last_name.replace(/\ /g,"_")).length)
				{
					personData = data;
					personData.first_name = personData.first_name.replace(/\ /g,"_");
					personData.last_name = personData.last_name.replace(/\ /g,"_");
					$("#tabs").append($('<div id="tab' +personData.first_name + '__'+ personData.last_name+'"></div>'));
					createTab();
					$("#tabs").tabs("add","#tab" + personData.first_name + '__'+ personData.last_name, personData.first_name.replace(/\_/g," ") + ' '+ personData.last_name.replace(/\_/g," "));
				}
				$("#tabs").tabs("select","#tab" + data.first_name.replace(/\ /g,"_") + '__'+ data.last_name.replace(/\ /g,"_"));
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
		if (occDetailsOpen)
		{
			$("#occassionDetailsAdvanceBtn").click();
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
					else if (data.gender == "F")	
					{
						$("#personImg").attr('src',"/static/canvas/images/person/woman_128X128.png");
					}
					else
					{
						$("#personImg").attr('src',"/static/canvas/images/person/both_128X128.png");
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
				$(this).fadeTo(200, 1,function(){
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
				$(this).fadeTo(200, 1, function() {
					// Animation complete.
				});
				
			$(".TableParentElementDivOutside").each(function(i) {
				$(this).fadeTo(200, 1)});
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
	
	if (!detailsMode)
	{
		if (occDetailsOpen)
		{
			$("#occassionDetailsAdvanceBtn").click();
		}
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
		else if (personData.gender == "F")
		{
			$("#personImg").attr('src',"/static/canvas/images/person/woman_128X128.png");
		}
		else
		{
			$("#personImg").attr('src',"/static/canvas/images/person/both_128X128.png");
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
		lastMode = tableMode
		if (tableMode)
		{
			tableMode = false;
		}
		enableDetailsMode();
		$("#floatListGate").fadeTo(200, 0);
	}
	else
	{
		$("#SavePersonDetailsButton").remove();
		

			$("#details").animate({width: 1},300, 'linear', function() {
				$("#PDFrame").animate({top: PersonLastPosition[0],left: PersonLastPosition[1],width: 1, height: 1},300, 'linear', function() {
					$("#PDFrame").remove();
					if (lastMode)
					{
						SelectedTable.fadeTo(200, 1,function(){
						$("#floatListGate").fadeTo(200, 1);
						$(".TableParentElementDiv").each(function(i) {
							$(this).fadeTo(200, 1,function(){
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
						
						tableMode = true;
										});
					}
					else
					{		
						$(".TableParentElementDivOutside").each(function(i) {
							$(this).fadeTo(200, 1,function(){
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
						$(".DragDiv").each(function(i) {
							$(this).fadeTo(200, 1,function(){ $(this).show();})});
						$(".DragNonDropDiv").each(function(i) {
							$(this).fadeTo(200, 1,function(){ $(this).show();})});
					}

				PersonLastPosition[0] = "";
				PersonLastPosition[1] = "";
	
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

		$.post('/canvas/getItem/', {position: "", firstName: full_name[0].replace(/\_/g," "), lastName: full_name[1].replace(/\_/g," ")},
		function(data)
		{
			data = $.parseJSON(data);
			if (data.status == 'OK')
			{
				personData = data;
				personData.first_name = personData.first_name.replace(/\ /g,"_");
				personData.last_name = personData.last_name.replace(/\ /g,"_");
				if (personData.invation_status == "T")
				{
					$("#InvationStatusPersonButton").attr('src', "/static/canvas/images/person/tentative_status_n.png");
					$("#InvationStatusPersonButton").attr('alt',personData.invation_status);document.getElementById("InvationStatus").innerHTML ="ממתין לאישור";

				}
				else if (personData.invation_status == "A")
				{
					$("#InvationStatusPersonButton").attr('src',"/static/canvas/images/person/accept_status_n.png");
					$("#InvationStatusPersonButton").attr('alt',personData.invation_status);
					document.getElementById("InvationStatus").innerHTML ="בוצע אישור הגעה";

				}
				else
				{
					$("#InvationStatusPersonButton").attr('src',"/static/canvas/images/person/noaccept_status_n.png");
					$("#InvationStatusPersonButton").attr('alt',personData.invation_status);
					document.getElementById("InvationStatus").innerHTML ="אין כוונה להגעה";

					

				}
				//SelectedTabIndex = ui.index;
								
				if (!IsNumeric(personData.qty.toString()))
				{
					personData.qty = "1";
				}
		
				$("#QTY").text("כמות : " + personData.qty.toString());
				SelectedTabIndex = $('#tabs').tabs("option", "selected");
				$("#NameValidtion").remove();
				duplicatePerson = false;
				if (data.gender == "M")
				{
					$("#personImg").attr('src',"/static/canvas/images/person/man_128X128.png");
				}
				else if (data.gender == "F")
				{
					$("#personImg").attr('src',"/static/canvas/images/person/woman_128X128.png");
				}
				else
				{
					$("#personImg").attr('src',"/static/canvas/images/person/both_128X128.png");
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
		personData.first_name = personData.first_name.replace(/\ /g,"_");
		personData.last_name = personData.last_name.replace(/\ /g,"_");
		$("#details").append($('<div id="tabs"><ul id="tabList" style="display:block; font-size:12; overflow: auto; height:30;"><li><a href="#tab' + personData.first_name + '__'+ personData.last_name +'">'+ personData.first_name.replace(/\_/g," ") + ' '+ personData.last_name.replace(/\_/g," ") +'</a></li></ul><div id="tab' +personData.first_name + '__'+ personData.last_name+'"></div></div>'));
		SelectedTabIndex = 0;
		$("#tabs").tabs();
		$("#tabs").bind('tabsselect', function(event, ui) {
				selectTab(ui);
		});
		createTab();
			
		var invation_status_src = "";
		var invation_status_text = ""

		if (personData.invation_status == "T")
		{
			invation_status_src = "/static/canvas/images/person/tentative_status_n.png";
			invation_status_text="ממתין לאישור";
		}
		else if (personData.invation_status == "A")
		{
			invation_status_src = "/static/canvas/images/person/accept_status_n.png";
			invation_status_text="בוצע אישור הגעה";
		}
		else
		{
			invation_status_src = "/static/canvas/images/person/noaccept_status_n.png";
			invation_status_text="אין כוונה להגעה";
		}
		duplicatePerson = false;
		$("#detailsLeftSide").append($('<table id="InvationStatusDiv" width="140" border="0" cellspacing="0" cellpadding="0 title="סטטוס הגעה" style="position:absolute;"><tr><td align="right" dir="rtl" ><p id="InvationStatus" class="text_14_black">'+invation_status_text+'</p></td><td valign="top" align="right"><img id="InvationStatusPersonButton" style="background: transparent;" class="InvationStatusBtn" alt='+ personData.invation_status +' src= ' + invation_status_src +'/></tr></table>'));
		$("#InvationStatusDiv").css("top", 25);
		$("#InvationStatusDiv").css("left", 0);
		$("#InvationStatusPersonButton").bind('mouseout', function(){
			if ($(this).attr('alt') == "T")
			{
				$(this).attr('src',"/static/canvas/images/person/tentative_status_n.png");
			}
			else if ($(this).attr('alt') == "A")
			{
				$(this).attr('src',"/static/canvas/images/person/accept_status_n.png");
			}
			else
			{
				$(this).attr('src',"/static/canvas/images/person/noaccept_status_n.png");
			}
		});
		$("#InvationStatusPersonButton").bind('mouseover', function(){
			if ($(this).attr('alt') == "T")
			{
				$(this).attr('src',"/static/canvas/images/person/tentative_status_r.png");
			}
			else if ($(this).attr('alt') == "A")
			{
				$(this).attr('src',"/static/canvas/images/person/accept_status_r.png");
			}
			else
			{
				$(this).attr('src',"/static/canvas/images/person/noaccept_status_r.png");
			}
		});
		$("#InvationStatusPersonButton").bind('click', function(){
			if ($(this).attr('alt') == "T")
			{
				$(this).attr('src',"/static/canvas/images/person/accept_status_r.png");
				$(this).attr('alt',"A");
				document.getElementById("InvationStatus").innerHTML ="בוצע אישור הגעה";
			}
			else if ($(this).attr('alt') == "A")
			{
				$(this).attr('src',"/static/canvas/images/person/noaccept_status_r.png");
				$(this).attr('alt',"N");
				document.getElementById("InvationStatus").innerHTML ="אין כוונה להגעה";

			}
			else
			{
				$(this).attr('src',"/static/canvas/images/person/tentative_status_r.png");
				$(this).attr('alt',"T");
				document.getElementById("InvationStatus").innerHTML ="ממתין לאישור";
			}
		});
		
		if (!IsNumeric(personData.qty.toString()))
		{
			personData.qty = "1";
		}
		
		$("#detailsLeftSide").append($('<p id="QTY" align="center" dir="rtl" title="כמות" style="position:absolute; width:85; z-index:555;" class="text_14_black">כמות : ' + personData.qty.toString() +'</p>'));
		$("#QTY").css("top", 295);
		$("#QTY").css("left", 35);
		
		if (!(navigator.userAgent.toLowerCase().indexOf('ie') > 0))
		{
			$("#QTY").css("line-height", 0);
		}
	}
	});
}

function createTab()
{
    closeAddInterface();
	personData.first_name = personData.first_name.replace(/\ /g,"_");
	personData.last_name = personData.last_name.replace(/\ /g,"_");
	
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

	tab.append($('<p align="right" dir="rtl" class="text_14_black">שם פרטי:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><input MAXLENGTH=30 type="text" id="detailsFirstName' + personData.first_name + '_'+ personData.last_name+'" value="'+ personData.first_name.replace(/\_/g," ") +'"/></span></p>'));
	tab.append($('<p align="right" dir="rtl" class="text_14_black">שם משפחה:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><input MAXLENGTH=30 type="text" id="detailsLastName' + personData.first_name + '_'+ personData.last_name+'" value="'+ personData.last_name.replace(/\_/g," ") +'"/></span></p>'));
	$("#detailsFirstName" + personData.first_name + '_'+ personData.last_name).bind('keydown', function() {
		$("#NameValidtion").remove();
		duplicatePerson = false;
	});	
	$("#detailsLastName" + personData.first_name + '_'+ personData.last_name).bind('keydown', function() {
		$("#NameValidtion").remove();
		duplicatePerson = false;
	});
	tab.append($('<p align="right" dir="rtl" class="text_14_black">מספר טלפון:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><input MAXLENGTH=30 type="text" id="detailsPhoneNum' + personData.first_name + '_'+ personData.last_name+'" value="'+ personData.phone_num +'"/></span></p>'));
	tab.append($('<p align="right" dir="rtl" class="text_14_black">מייל:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><input MAXLENGTH=30 type="text" id="detailsE-mail' + personData.first_name + '_'+ personData.last_name+'" value="'+ personData.person_email +'"/></span></p>'));
	tab.append($('<table id="amountTable'+ personData.first_name + '_'+ personData.last_name+'" border="0" cellspacing="0" cellpadding="0" align="right"><td align="right"><p align="right" dir="rtl" class="text_14_black">&nbsp;&nbsp;סכום מתנה:&nbsp;&nbsp;<span><input MAXLENGTH=7 size="5" type="text" id="detailsPresentAmount' + personData.first_name + '_'+ personData.last_name+'" value="'+ personData.present_amount +'"/></span></td><td><p align="right" dir="rtl" class="text_14_black">ארוחה:&nbsp;<span><select size="1" value='+"personData.meal"+' id="detailsMeal' + personData.first_name + '_'+ personData.last_name+'"><option value="M">בשרית<option value="G">גלאט<option value="V">צמחונית</select></span></p></td></table></br>'));
	if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
	 {
		tab.append($('</br>'));
	 }
	$("#detailsPresentAmount" + personData.first_name + '_'+ personData.last_name).bind('keydown',function(e){insureNumInput(e);});
	tab.append($('<p align="right" dir="rtl" class="text_14_black">חשבון פייסבוק:&nbsp;<span><input  MAXLENGTH=30 type="text" id="detailsFacebookAccount' + personData.first_name + '_'+ personData.last_name+'" value="'+ personData.facebook_account +'"/></span></p>'));
	if (isGroupValueIsFromList(personData.group.trim()))
	{
		tab.append($('<table id="groupTable'+ personData.first_name + '_'+ personData.last_name+'" border="0" cellspacing="0" cellpadding="0" align="right"><td align="right"><p align="right" dir="rtl" class="text_14_black">&nbsp;&nbsp;קבוצה:&nbsp;&nbsp;<span><select size="1" id="detailsGroup' + personData.first_name + '_'+ personData.last_name+'">&nbsp;&nbsp;&nbsp;&nbsp;</td><td><p align="right" dir="rtl" class="text_14_black">מין:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><select size="1" id="detailsGender' + personData.first_name + '_'+ personData.last_name+'"><option value="M">זכר<option value="F">נקבה<option value="U">אחר</select></span></p></td></table>'));
		updateDetailPersonGroups($("#detailsGroup" + personData.first_name + '_'+ personData.last_name));
		$("#detailsGroup" + personData.first_name + '_'+ personData.last_name).val( personData.group.trim() );	
	}
	else
	{
		tab.append($('<table id="groupTable'+ personData.first_name + '_'+ personData.last_name+'" border="0" cellspacing="0" cellpadding="0" align="right"><td align="right"><p align="right" dir="rtl" class="text_14_black">&nbsp;&nbsp;קבוצה:&nbsp;&nbsp;<span><input maxlength=25 type=text size=9 value="'+ personData.group +'" id="detailsGroup' + personData.first_name + '_'+ personData.last_name +'">&nbsp;&nbsp;&nbsp;&nbsp;</td><td><p align="right" dir="rtl" class="text_14_black">מין:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><select size="1" id="detailsGender' + personData.first_name + '_'+ personData.last_name+'"><option value="M">זכר<option value="F">נקבה<option value="U">אחר</select></span></p></td></table>'));
	}
	$("#detailsGender" + personData.first_name + '_'+ personData.last_name).val( personData.gender );
	$("#detailsMeal" + personData.first_name + '_'+ personData.last_name).val( personData.meal );
	tab.append($('<img id="SavePersonDetailsButton_'+personData.first_name + '_'+ personData.last_name +'" style="position:absolute; cursor:pointer;" alt="שמור שינויים" src="/static/right_interface/images/save_changes_n.png"/>'));
	$("#SavePersonDetailsButton_"+personData.first_name + '_'+ personData.last_name).css("top", DetailsHeight - 50);
	$("#SavePersonDetailsButton_"+personData.first_name + '_'+ personData.last_name).css("left", 15);
	$("#SavePersonDetailsButton_"+personData.first_name + '_'+ personData.last_name).bind('click', function() {
			savePersonChanges(personData.first_name,  personData.last_name);
	});
	$("#SavePersonDetailsButton_"+personData.first_name + '_'+ personData.last_name).fadeTo(1500, 1);
	tab.append($('<img id="ClosePersonDetailsButton_'+personData.first_name + '_'+ personData.last_name +'" style="position:absolute; background: transparent;" class="CloseBtn" alt="סגור חלון" src="/static/canvas/images/close_window_btn_n.png" width="16" height="16"/>'));
	$("#ClosePersonDetailsButton_"+ personData.first_name + '_'+ personData.last_name).css("top", 35);
	$("#ClosePersonDetailsButton_"+ personData.first_name + '_'+ personData.last_name).css("left", 15);
	$("#ClosePersonDetailsButton_"+ personData.first_name + '_'+ personData.last_name).bind('click', function() {
		closeTabs();
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
	tab.append($('</br></br>'));
}

function closeTabs()
{
	if (SelectedTabIndex >= 0 && SelectedTabIndex < $("#tabs").tabs("length"))
	{
		 $("#tabs").tabs("remove",SelectedTabIndex);
		 if ($("#tabs").tabs("length") == 0)
		 {
			$("#personImg").dblclick();
			SelectedTabIndex = "";
		 }
	}
}

function onMainClose()
{
	$("#personImg").dblclick();
}

function isGroupValueIsFromList(val)
{
	var firstName = $("#firstPartnerName").text().trim();
	
	if (val == "Family " + firstName)
	{
		return true;
	}
	if (val == "Friends " + firstName)
	{
		return true;
	}
	if (val == "Work " + firstName)
	{
		return true;
	}
	if ($("#addChar").text() == " " || $("#addChar").text() == '')
	{
		if (val == "Friends")
		{
			return true;
		}
		if (val == "Family")
		{
			return true;
		}
		if (val == "Work")
		{
			return true;
		}
	}
	else
	{
		var secondName = $("#secondPartnerName").text().trim();
		
		if (val == "Friends " + secondName)
		{
			return true;
		}
		if (val == "Family " + secondName)
		{
			return true;
		}
		if (val == "Work " + secondName)
		{
			return true;
		}
	}
	if (val == "Other")
	{
		return true;
	}
	return false;
}

function updateDetailPersonGroups(element)
{
	element.append($('<option value="Family ' + $("#firstPartnerName").text().trim()+'">משפחה '+ $("#firstPartnerName").text() +'</option>'));
	element.append($('<option value="Friends ' + $("#firstPartnerName").text().trim()+'">חברים '+ $("#firstPartnerName").text() +'</option>'));
	element.append($('<option value="Work ' + $("#firstPartnerName").text().trim()+'">עבודה '+ $("#firstPartnerName").text() +'</option>'));
	if ($("#addChar").text() == " " || $("#addChar").text() == '')
	{
		element.append($('<option value="Family">משפחה כללי</option>'));
		element.append($('<option value="Work">חברים כללי</option>'));
		element.append($('<option value="Friends">עבודה כללי</option>'));
	}
	else
	{
		element.append($('<option value="Family ' + $("#secondPartnerName").text().trim()+'">משפחה '+ $("#secondPartnerName").text() +'</option>'));
		element.append($('<option value="Work ' + $("#secondPartnerName").text().trim()+'">חברים '+ $("#secondPartnerName").text() +'</option>'));
		element.append($('<option value="Friends ' + $("#secondPartnerName").text().trim()+'">עבודה '+ $("#secondPartnerName").text() + '</option>'));
	}
	element.append($('<option value="Other" selected>אחר</option>'));
}

function DragPerson(personElement,tableElement)
{
	$("#dropLayer").remove();
	
	if (!$("#floatListGate").html())
	{
		$("#canvas-div").append($('<div id="floatListGate" class="FloatListGate actionBtn"></br></br><img align="middle" src="/static/canvas/images/arrow_to_float_n.png"/></div>')); $("#floatListGate").css('top',$("#canvas-div").offset().top + 45); $("#floatListGate").css('left',$("#canvas-div").position().left + $("#canvas-div").width() - $("#floatListGate").width() + 7.5); $("#floatListGate").animate({height:150},300, 'linear');
	}
	var pos = getPositions(document.getElementById("floatListGate"));
	var pos2 = getPositions(document.getElementById(personElement.context.id));
	var horizontalMatch = comparePositions(pos[0], pos2[0]);
	var verticalMatch = comparePositions(pos[1], pos2[1]);
	var backToFloatListMatch = horizontalMatch && verticalMatch;	
	
	if (backToFloatListMatch)
	{
		$("#floatListGate").css("background-color", "rgba(90, 142, 163, 0.8)");
		$("#floatListGate").find('img').first().attr('src',"/static/canvas/images/arrow_to_float_r.png");
	}
	else
	{
		$("#floatListGate").css("background-color", "white");
		$("#floatListGate").find('img').first().attr('src',"/static/canvas/images/arrow_to_float_n.png");
		var collision = collisionWithOtherPersonElement(personElement);
		
		if (collision[0])
		{
			var collisionPerson = collision[1];
			
			$("#canvas-div").append($('<div Id="dropLayer" style="position:absolute;"/>'));
			$("#dropLayer").css("background-color", "#7E2007");
			$("#dropLayer").css("border-radius", "33");
			$("#dropLayer").css("-moz-border-radius", "33");
			$("#dropLayer").css("-webkit-border-radius", "33");
			$("#dropLayer").css('zIndex', 9999);
			$("#dropLayer").css("top", collisionPerson.position().top);
			$("#dropLayer").css("left", collisionPerson.position().left);
			$("#dropLayer").css("width", collisionPerson.width());
			$("#dropLayer").css("height", collisionPerson.height());
			$("#dropLayer").css("opacity", 0.5);
		}
	}
}

function StartDragPerson(element)
{

	drag = true;
		
	if (canDragPersonAgain && !droppingPerson)
	{
		canDragPersonAgain = false;
		
		if (!tableMode)
		{
			$("#canvas-div").append($('<div id="floatListGate" class="FloatListGate actionBtn"></br></br><img align="middle" src="/static/canvas/images/arrow_to_float_n.png"/></div>')); $("#floatListGate").css('top',$("#canvas-div").offset().top + 45); $("#floatListGate").css('left',$("#canvas-div").position().left + $("#canvas-div").width() - $("#floatListGate").width() + 7.5); $("#floatListGate").animate({height:150},300, 'linear');
		}
		
		selectPersonElement(element);

		setSaveStatus("Waiting");
			
		PersonLastPosition[0] = element.position().top;
		PersonLastPosition[1] = element.position().left;
	}
}

function StopDragPerson(element,tableElement)
{
	var pos = getPositions(document.getElementById("floatListGate"));
	var pos2 = getPositions(document.getElementById(element.context.id));
	var horizontalMatch = comparePositions(pos[0], pos2[0]);
	var verticalMatch = comparePositions(pos[1], pos2[1]);
	var backToFloatListMatch = horizontalMatch && verticalMatch;
	
	if (backToFloatListMatch)
	{
		$("#floatListGate").css("background-color", "white");
		$("#floatListGate").find('img').first().attr('src',"/static/canvas/images/arrow_to_float_n.png");
		DeletePerson();
		element.animate({top: PersonLastPosition[0],left: PersonLastPosition[1]}, function(){canDragPersonAgain = true;});
	}
	else
	{
		var collision = collisionWithOtherPersonElement(element);

		var realOldPosition = element.find('div').first().data('pos');
		var realOldTable = element.find('div').first().data('elem');
		var realNewPosition;
		var lastZIndex = element.css('z-index');
		var lastID = element.attr('id');		
		
		$("#dropLayer").remove();

		if (!droppingPerson && collision[0])
		{
			droppingPerson = true;
			var collisionPerson = collision[1];
			var realNewTable = collisionPerson.find('div').first().data('elem');
			var newTop = collisionPerson.position().top;
			var newLeft = collisionPerson.position().left;
			var action = 0;
			var state1 = element.data('status');
			var state2 = collisionPerson.data('status');
			
			if (state1 != state2)
			{
				if (state1 == "emp")
				{
					action = 1;
				}
				else
				{
					action = 2;
				}
				
			}						
			collisionPerson.animate({top: PersonLastPosition[0],left: PersonLastPosition[1]});
			element.animate({top: newTop,left: newLeft});
			realNewPosition = collisionPerson.find('div').first().data('pos');
			
			$.post('/canvas/swapPos/', {elem_num: realOldTable, elem_num2: realNewTable, first_position: parseInt(realOldPosition), second_position: parseInt(realNewPosition)},
			function(data){
		   if (data.status == 'OK')
		   {
				setSaveStatus("OK");
				var curID = collisionPerson.attr('id');
				var curZIndex = collisionPerson.css('z-index');

				
				element.remove();
				collisionPerson.remove();
				
				createTableElement(parseInt(realOldPosition) - 1,$("#" + realOldTable), true, tableMode);
				createTableElement(parseInt(realNewPosition) - 1,$("#" + realNewTable), true, tableMode);
				
				$("#" + lastID).css('top',PersonLastPosition[0]);
				$("#" + lastID).css('left',PersonLastPosition[1]);
				$("#" + lastID).css('z-index',lastZIndex);
				
				$("#" + curID).css('top',newTop);
				$("#" + curID).css('left',newLeft);
				$("#" + curID).css('z-index',curZIndex);
				
				if (action == 1)
				{
					  var elementMaxSize = parseInt($("#" + realOldTable).find('p:eq(1)').text().substr($("#" + realOldTable).find('p:eq(1)').text().indexOf("/")+1));
					  var newSize = parseInt($("#" + realOldTable).find('p:eq(1)').text().split("/", 1)) + 1;
					  var sizeStr = newSize + "/" + elementMaxSize;
					  $("#" + realOldTable).find('p:eq(1)').text(sizeStr);
					  
					  elementMaxSize = parseInt($("#" + realNewTable).find('p:eq(1)').text().substr($("#" + realNewTable).find('p:eq(1)').text().indexOf("/")+1));
					  newSize = parseInt($("#" + realNewTable).find('p:eq(1)').text().split("/", 1)) - 1;
					  sizeStr = newSize + "/" + elementMaxSize;
					  
					   $("#" + realNewTable).find('p:eq(1)').text(sizeStr);
				}
				else if (action == 2)
				{
					var elementMaxSize = parseInt($("#" + realOldTable).find('p:eq(1)').text().substr($("#" + realOldTable).find('p:eq(1)').text().indexOf("/")+1));
					  var newSize = parseInt($("#" + realOldTable).find('p:eq(1)').text().split("/", 1)) - 1;
					  var sizeStr = newSize + "/" + elementMaxSize;
					  $("#" + realOldTable).find('p:eq(1)').text(sizeStr);
					  
					  elementMaxSize = parseInt($("#" + realNewTable).find('p:eq(1)').text().substr($("#" + realNewTable).find('p:eq(1)').text().indexOf("/")+1));
					  newSize = parseInt($("#" + realNewTable).find('p:eq(1)').text().split("/", 1)) + 1;
					  sizeStr = newSize + "/" + elementMaxSize;
					  
					   $("#" + realNewTable).find('p:eq(1)').text(sizeStr);
				}
				selectPersonElement($("#" + curID));
			}
			else
			{
				setSaveStatus("Error");
			}
			canDragPersonAgain = true;
			droppingPerson = false;
			}, 'json');
		}
		else
		{
			var elemID = element.context.id;
			var mode = "T";

			if (!tableMode)
			{
				mode = "NT";
			}
			
			setSaveStatus("OK");
			element.animate({top: PersonLastPosition[0],left: PersonLastPosition[1]},function() {selectPersonElement($("#tableParentElementDiv"+realOldPosition + elemID + mode)); SelectedPerson = element; canDragPersonAgain = true;});
		}
	}
	
	if (!tableMode)
	{
		$("#floatListGate").animate({height:0},300, 'linear',function(){	$("#floatListGate").remove();});
	}
	drag = false;
}

function hideAllDragDiv()
{
	$(".DragDiv").each(function(i) {
		$(this).removeClass('borderPersonSelected');
		$(this).fadeTo(200, 0, function() {
			// Animation complete.
			$(this).hide();
		});
	});
	$(".DragNonDropDiv").each(function(i) {
		$(this).fadeTo(200, 0, function() {
			// Animation complete.
			$(this).hide();
		});
	});
}

function hideTableElementDiv()
{
	$(".TableParentElementDiv").each(function(i) {
		$(this).fadeTo(200, 0, function() {
		$(this).hide();
			});
	});
	$(".TableParentElementDivOutside").each(function(i) {
		$(this).fadeTo(200, 0, function() {
		$(this).hide();
			});
	});
}
		
function hideElement(element)
{
	element.removeClass('borderPersonSelected');
	element.fadeTo(200, 0, function() {
		// Animation complete.
		$(this).hide();
	});
}

function getNearetTabels(element)
{
	var returnArray  = new Array();
	var top = element.position().top;
	var	left = element.position().left;
	
	
	$(".DragDiv").each(function(i) {
	
		if ($(this).position().left > left - 100 && $(this).position().left < left + 100 && $(this).position().top > top - 100 && $(this).position().top < top + 100)
		{
			returnArray.push($(this).attr('id'));
		}
	});
	
	return returnArray;
	
}
									
//Check if 2 objects intersect
function collisionWithOtherPersonElement(element)
{
	var returnArray = new Array(2);//[bool,intersect value]
	var match = false;
	var pos = getPositions(document.getElementById(element.context.id));
	
	returnArray[1] = "";
	
	if (tableMode)
	{
		$(".TableParentElementDiv").each(function(i) {
			if (element.context.id != $(this).context.id && !match)
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
	}
	else
	{
	
		var tableArray = getNearetTabels(element);
		
		for (var i = 0; i < tableArray.length; i++)
		{
			$(".chairs" + tableArray[i]).each(function(i) {
				if (element.context.id != $(this).context.id && !match)
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
		}
	}
	
	if (match || returnArray[1] != "")
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
	$("#NameValidtion").remove();
	firstName = firstName.replace(/\ /g,"_");
	lastName = lastName.replace(/\ /g,"_");
	if(!emailReg.test($("#detailsE-mail" + firstName + '_'+ lastName).val())) {
      $("#detailsE-mail" + firstName + '_'+ lastName).after('<span id="EmailValidtion" style="color:red" class="text_11_black"> יש להזין כתובת חוקית .</span>');
	  $("#tab" +firstName + '__'+ lastName).effect("highlight", {color: 'red'}, 500);
    }
	else
	{
		if (!duplicatePerson && ($("#detailsFirstName" + firstName + '_'+ lastName).val() != firstName.replace(/\_/g," ") || lastName.replace(/\_/g," ") != $("#detailsLastName" + firstName + '_'+ lastName).val())
		&& isPersonIsOnList($("#detailsFirstName" + firstName + '_'+ lastName).val(), $("#detailsLastName" + firstName + '_'+ lastName).val()))
		{
			$("#detailsFirstName" + firstName + '_'+ lastName).after('<span id="NameValidtion"  style="color:red; margin-top:20px; position:absolute;" class="text_11_black"> שם קיים, לאישור יש לשמור בשנית .</span>');
			duplicatePerson = true;
		}
		else
		{
			var cleanStringGroup = cleanStringFromUnIDChars($("#detailsGroup" + firstName + '_'+ lastName).val()).trim();
			
			if (!duplicatePerson)
			{
				$.post('/canvas/savePerson/', {old_first_name: firstName.replace(/\_/g," "), old_last_name: lastName.replace(/\_/g," "), first_name: $("#detailsFirstName" + firstName + '_'+ lastName).val() , last_name:$("#detailsLastName" + firstName + '_'+ lastName).val() ,phone_num: $("#detailsPhoneNum" + firstName + '_'+ lastName).val() ,person_email: $("#detailsE-mail" + firstName + '_'+ lastName).val(),present_amount: $("#detailsPresentAmount" + firstName + '_'+ lastName).val(),facebook_account: $("#detailsFacebookAccount" + firstName + '_'+ lastName).val(), group:cleanStringGroup, gender:$("#detailsGender" + firstName + '_'+ lastName).val(),invation_status: $("#InvationStatusPersonButton").attr('alt'), meal: $("#detailsMeal" + firstName + '_'+ lastName).val()},
				  function(data){
					savePersonOperation(data, firstName, lastName)
					duplicatePerson = false;
					$("#SaveStatImg").fadeTo(200, 1);
				}, 'json');
			}
			else
			{
				$.post('/canvas/saveDupPerson/', {old_first_name: firstName.replace(/\_/g," "), old_last_name: lastName.replace(/\_/g," "), first_name: $("#detailsFirstName" + firstName + '_'+ lastName).val() , last_name:$("#detailsLastName" + firstName + '_'+ lastName).val() ,phone_num: $("#detailsPhoneNum" + firstName + '_'+ lastName).val() ,person_email: $("#detailsE-mail" + firstName + '_'+ lastName).val(),present_amount: $("#detailsPresentAmount" + firstName + '_'+ lastName).val(),facebook_account: $("#detailsFacebookAccount" + firstName + '_'+ lastName).val(), group:cleanStringGroup, gender:$("#detailsGender" + firstName + '_'+ lastName).val(),invation_status: $("#InvationStatusPersonButton").attr('alt'), meal: $("#detailsMeal" + firstName + '_'+ lastName).val()},
				  function(data){
					savePersonOperation(data, firstName, lastName)
					duplicatePerson = false;
					$("#SaveStatImg").fadeTo(200, 1);
				}, 'json');
			}
		}
	}
}

function savePersonOperation(data, firstName, lastName)
{
	$("#SaveStatImg").fadeTo(400, 0);
	if (data.status == 'OK')
	{
	  personData.first_name = $("#detailsFirstName" + firstName + '_'+ lastName).val();
	  if (duplicatePerson)
	  {
	    personData.last_name = data.new_last_name;
		$("#detailsLastName" + firstName + '_'+ lastName).val(data.new_last_name);
	  }
	  else
	  {
	    personData.last_name = $("#detailsLastName" + firstName + '_'+ lastName).val();
	  }
	  personData.phone_num = $("#detailsPhoneNum" + firstName + '_'+ lastName).val();
	  personData.person_email = $("#detailsE-mail" + firstName + '_'+ lastName).val();
	  personData.present_amount = $("#detailsPresentAmount" + firstName + '_'+ lastName).val();
	  personData.facebook_account = $("#detailsFacebookAccount" + firstName + '_'+ lastName).val();
	  personData.group = $("#detailsGroup" + firstName + '_'+ lastName).val();
	  personData.gender = $("#detailsGender" + firstName + '_'+ lastName).val();
	  personData.meal = $("#detailsMeal" + firstName + '_'+ lastName).val();
	  personData.invation_status =  $("#InvationStatusPersonButton").attr('alt');
	  	
	  if (personData.position > 0)
	  {
	  	var elemID = SelectedTable.attr('id');
		
		$("#tableParentElementDiv" + personData.position + elemID + "T").find('p').last().text(personData.first_name + " " + personData.last_name);
	  }
	  else
	  {
		document.getElementById(firstName.replace(/\_/g," ") + '_' + lastName.replace(/\_/g," ")).innerHTML = personData.first_name + " " + personData.last_name;
		document.getElementById(firstName.replace(/\_/g," ") + '_' + lastName.replace(/\_/g," ")).title = personData.first_name + " " + personData.last_name + " " + "לחיצה כפולה לעריכה, יש להחזיק CNTL לבחירה מרובה.";
		
		var floatPerson = $("#" + firstName.replace(/\_/g," ") + '_' + lastName.replace(/\_/g," "));
		
		if (floatPerson.index() < 0)
		{
			$("#people_list > li").each(function(j) { if ($(this).context.id == firstName.replace(/\_/g," ") + '_' + lastName.replace(/\_/g," ")){ floatPerson = $(this);}});
		}
		floatPerson.css("text",personData.first_name + " " + personData.last_name);
		floatPerson.attr("id", personData.first_name + "_" + personData.last_name);
		floatPerson.removeClass('femaleli');
		floatPerson.removeClass('maleli');
		if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
		{
			refactorElementPerson(floatPerson);
		}
		if ($("#detailsGender"+ firstName + '_'+ lastName).val() == "F")
	   {
			floatPerson.addClass('femaleli');
	   }
		else
	   {
			floatPerson.addClass('maleli');
	   }
	  }
	  $("#tabs li:eq(" + SelectedTabIndex + ") a").html(personData.first_name + " " + personData.last_name);
	  personData.first_name = personData.first_name.replace(/\ /g,"_");
	  personData.last_name = personData.last_name.replace(/\ /g,"_");
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
	  $("#detailsMeal"+ firstName + '_'+ lastName).attr("id","detailsMeal"+ personData.first_name + '_'+ personData.last_name);

	  if ($("#detailsGender"+ personData.first_name + '_'+ personData.last_name).val() == "M")
	  {
			$("#personImg").attr('src',"/static/canvas/images/person/man_128X128.png");
	  }
	  else if ($("#detailsGender"+ personData.first_name + '_'+ personData.last_name).val() == "F")
	  {
			$("#personImg").attr('src',"/static/canvas/images/person/woman_128X128.png");
	  }
	  else
	  {
	 		$("#personImg").attr('src',"/static/canvas/images/person/both_128X128.png");
	  }
	  $("#SavePersonDetailsButton_"+ firstName + '_'+ lastName).attr("id","SavePersonDetailsButton_"+ personData.first_name + '_'+ personData.last_name);
	  $("#ClosePersonDetailsButton_"+ firstName + '_'+ lastName).attr("id","ClosePersonDetailsButton_"+ personData.first_name + '_'+ personData.last_name);
	  setSaveStatus("OK");
	  $("#tab" +firstName + '__'+ lastName).effect("highlight", {color: 'green'}, 500);
	  }else{
		  setSaveStatus("Error");
		  $("#tab" +firstName + '__'+ lastName).effect("highlight", {color: 'red'}, 500);
		}
}

function isPersonIsOnList(firstName, lastName)
{
	var result = false;
	$("#people_list > li").each(function(i) {
		if ($(this).context.id == firstName +"_"+ lastName )
		{
			result = true;
		}
	});
	
	return result;
}

function isPersonFirstNameIsOnList(firstName, lastName)
{
	var result = false;
	$("#people_list > li").each(function(i) {
		if ($(this).context.id == firstName +"_"+ lastName )
		{
			if ($(this).context.id.indexOf(firstName) > -1)
			{
				result = true;
			}
		}
	});
	
	return result;
}

function DeletePerson()
{
	if (SelectedPerson != "" && personData != "" && SelectedTable!= "" && bringPersonToFL)
	{
		bringPersonToFL = false;
		
		var elemID = SelectedTable.attr('id');

		var newPositionNum = SelectedPerson.find('div').first().data('pos');

	  $.post('/canvas/bringToFloatList/', {elem_num: elemID, position: parseInt(newPositionNum)},
      function(data){
		$("#SaveStatImg").fadeTo(400, 0);
        if (data.status == 'OK')
		{
				  	
		  var mode = "T";

		  if (!tableMode)
		  {
				mode = "NT";
		  }
			
		  SelectedPerson = $("#tableParentElementDiv" + newPositionNum + elemID + mode);
		  //var elementCaption = SelectedTable.context.getElementsByTagName("p");
		  var elementMaxSize = parseInt(SelectedTable.find('p:eq(1)').text().substr(SelectedTable.find('p:eq(1)').text().indexOf("/")+1));
		  var newSize = parseInt(SelectedTable.find('p:eq(1)').text().split("/", 1)) - 1;
		  var sizeStr = newSize + "/" + elementMaxSize;
		  SelectedTable.find('p:eq(1)').text(sizeStr);
		  reloadElementStatus(SelectedTable);
		  SelectedPerson.removeClass('borderPersonSelected');
		  SelectedPerson.attr('title', "");
		  SelectedPerson.find('div').first().removeClass('TableOccElementDiv');
		  SelectedPerson.find('div').first().addClass('TableElementDiv');
		  SelectedPerson.find('p').first().css('display','block');
		  SelectedPerson.find('p').first().text(newPositionNum);
		  SelectedPerson.find('p').last().css('display','none');
		  //selectPersonElement($("#tableParentElementDiv" + personData.position));
		  
		  var lastID = SelectedPerson.attr('id');	  

          setSaveStatus("OK");

		  curZIndex = SelectedPerson.css('z-index');
		  SelectedPerson.remove();
		  SelectedPerson = "";
		  createTableElement(newPositionNum - 1,$("#" + elemID), true, tableMode);
			
		  $("#" + lastID).css('top',PersonLastPosition[0]);
		  $("#" + lastID).css('left',PersonLastPosition[1]);
		  $("#" + lastID).css('z-index',curZIndex);
		  var classGender = "maleli";
		  //ShowHourGlassWaitingWindow(true);
		  if (personData.gender == "F")
		  {
			classGender = "femaleli";
		  }
		  if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
		  {
				$("#people_list").append($('<li class="'+ classGender +'" id="'+ personData.first_name +'_'+ personData.last_name +'" title="'+ personData.first_name +' '+ personData.last_name +' לחיצה כפולה לעריכה, יש להחזיק CNTL לבחירה מרובה."> '+ personData.first_name +' '+ personData.last_name +' </li>'));	
		  }
		  else
		  {
				$("#people_list").append($('<li class="'+ classGender +'" style="text-overflow: ellipsis; overflow:hidden; white-space:nowrap;  width:auto;" id="'+ personData.first_name +'_'+ personData.last_name +'" title="'+ personData.first_name +' '+ personData.last_name +' לחיצה כפולה לעריכה, יש להחזיק CNTL לבחירה מרובה."> '+ personData.first_name +' '+ personData.last_name +' </li>'));	
		  }
		  $("#" + personData.first_name +'_'+ personData.last_name).data('qty',1);
		  rePaintPeopleList(); 
		  $("#people_list > li").each(function(i) {
			$(this).removeClass('ui-multisort-click');
			$(this).removeClass('ui-multisort-grouped');
			if ($(this).context.id == personData.first_name +"_"+ personData.last_name )
			{
				$(this).addClass('ui-multisort-click');
				$(this).bind('dblclick',function(e){
						personFloatListDBClick(e,$(this));
					});
				$("#people-list").scrollTop(parseInt($(this).index()) * 50);
				if (navigator.userAgent.toLowerCase().indexOf('ie') > 0)
				{
					refactorElementPerson($(this));
				}
			}
		  });
		  updateSeatedLabel();
        }else{
          setSaveStatus("Error");
        }
	    bringPersonToFL = true;
		$("#SaveStatImg").fadeTo(400, 1);
    }, 'json');

	}
	else
	{
		showLightMsg("מחיקת אורח","יש לבחור אורח.","OK","Notice");
	}
}

function proccedSearchOnTableMode(data)
{
	var currentSelectedTable = SelectedTable;
	
	if (currentSelectedTable == "" || !currentSelectedTable.html())
	{
		currentSelectedTable = SelectedElem;
	}
	if (currentSelectedTable != "" || currentSelectedTable.html())
	{
		var event = jQuery.Event("dblclick");
		event.user = "SearchGuest";
		if (currentSelectedTable.attr('id').trim().toLowerCase() != ("DragDiv-" + data[0]).trim().toLowerCase())
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
			var elemID = currentSelectedTable.attr('id');
			var mode = "T";

			if (!tableMode)
			{
				mode = "NT";
			}
			pointPersonAfterSearch($("#tableParentElementDiv"+ data[1] + elemID + mode),$("#tableParentElementDiv"+ data[1]+ elemID + mode));
			$("#tableParentElementDiv"+ data[1] + elemID + mode).click();
		}
	}
}

function PersonMainCloseBtnMouseOut(element)
{
	element.src = "/static/canvas/images/close_window_btn_n.png";
}

function PersonMainCloseBtnMouseOver(element)
{
	element.src = "/static/canvas/images/close_window_btn_r.png";
}

$(document).ready(function() {
	if (navigator.userAgent.toLowerCase().indexOf('chrome') > 0)
	{
		DetailsHeight = DetailsHeight + 22;
	}
	
	$("#people_list").after( function(e){
		$("#people_list > li").each( function(i){
			updatePerQTY($(this));
		});
		
		updateSeatedLabel();
	});
});
 
