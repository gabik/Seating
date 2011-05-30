var DetailsWidth = 900;
var DetailsHeight = 350;
var PersonLastPosition = new Array(2);//top,left
var personData ="";
var SelectedTable = "";
var detailsMode = false;

function selectPersonElement(element)
{
	$(".TableElemImg").each(function(i) {
		$(this).border('0px white 0');
	});
	element.border('2px pink .5');
}

function FocusDetails(personElement,tableElement,hideAll)
{
	if (tableMode)
	{
		if (hideAll)
		{
			hideAllDragDiv();
		}
		else
		{
			hideElement(tableElement);
		}
		$("#canvas-div").append($('<div class="PersonDetailsDiv" Id="person"><img Id="personImg" src="/static/canvas/images/PersonView.png"/><div class="PersonDetailsArea" Id="details"/></div>'));
		$("#personImg").bind('dblclick', function() {
				FocusDetails("","","",false);
		});
		PersonLastPosition[0] = personElement.position().top;
		PersonLastPosition[1] = personElement.position().left;
		SelectedTable = tableElement;
		$("#person").css("top",personElement.position().top);
		$("#person").css("left",personElement.position().left);
		$("#person").css("height","1");
		$("#details").css("height",DetailsHeight);
		$("#details").css("width","1");
		$("#person").animate({top:($("#canvas-div").position().top + $("#canvas-div").height()) / 2 - DetailsHeight / 2, left:($("#canvas-div").position().left + $("#canvas-div").width()) / 2 - DetailsWidth / 2, height: DetailsHeight},300, 'linear'); 
		$("#personImg").animate({width: DetailsWidth - 600, height: DetailsHeight},300, 'linear', function() {
		$("#details").animate({width: DetailsWidth - 300},300, 'linear');
		$("#personImg").addClass("Pointer");
		if (personData != "")
		{
			$("#details").append($('<p style="position:relative; margin-left:15px;">First Name:</p>'));
			$("#details").append($('<input style="text-align:left; width:250px; position:relative; margin-left:15px;" MAXLENGTH=30 type="text" id="detailsFirstName" value="'+ personData.first_name +'"/></br>'));
			$("#details").append($('<p style="position:relative; margin-left:15px;">Last Name:</p>'));
			$("#details").append($('<input style="text-align:left; width:250px; position:relative; margin-left:15px;" MAXLENGTH=30 type="text" id="detailsLastName" value="'+ personData.last_name +'"/></br>'));
			$("#details").append($('<p style="position:relative; margin-left:15px;">Phone Number:</p>'));
			$("#details").append($('<input style="text-align:left; width:250px; position:relative; margin-left:15px;" MAXLENGTH=30 type="text" id="detailsPhoneNum" value="'+ personData.phone_num +'"/></br>'));
			$("#details").append($('<p style="position:relative; margin-left:15px;">E-mail:</p>'));
			$("#details").append($('<input style="text-align:left; width:250px; position:relative; margin-left:15px;" MAXLENGTH=30 type="text" id="detailsE-mail" value="'+ personData.person_email +'"/></br>'));
			$("#details").append($('<button id="SavePersonDetailsButton" style="position:absolute; opacity:0;" type="button">Save Changes</button>'));
			$("#SavePersonDetailsButton").css("top",$("#details").position().top + $("#details").height() - 30);
			$("#SavePersonDetailsButton").css("left",$("#details").position().left + DetailsWidth - 420);
			$("#SavePersonDetailsButton").bind('click', function() {
				savePersonChanges(tableElement, personData.position);
			});
			$("#SavePersonDetailsButton").fadeTo(2500, 1);
		}
		
		});
		$(".TableElementDiv").each(function(i) {
			$(this).fadeTo(400, 0, function() {
				$(this).hide();
			});
		});
		tableMode = false;
		detailsMode = true;
	}
	else
	{
		$("#SavePersonDetailsButton").remove();
		$("#details").animate({width: 1},300, 'linear', function() {
			$("#person").animate({top: PersonLastPosition[0],left: PersonLastPosition[1],width: 1, height: 1},300, 'linear', function() {
				$("#person").remove();
				SelectedTable.fadeTo(400, 1,function(){
					$(".TableElementDiv").each(function(i) {
						$(this).fadeTo(400, 1);
					});
				});
				PersonLastPosition[0] = "";
				PersonLastPosition[1] = "";
				tableMode = true;
				detailsMode = false;
			});
		});
		
	}
}

function DragPerson(personElement,tableElement)
{
	var lastPositionNum =  personElement.context.id.substring(personElement.context.id.length - 1, personElement.context.id.length);
	
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
}

function StartDragPerson(element)
{
	var positionNum =  element.context.id.substring(element.context.id.length - 1, element.context.id.length);
	
	$("#SaveStatImg").attr("src", "http://careers.physicstoday.org/pics/icons/gma_red_50/js_saved_jobs.gif");
		
	PersonLastPosition[0] = $("#tableElementDiv"+ positionNum).position().top;
	PersonLastPosition[1] = $("#tableElementDiv"+ positionNum).position().left;
}

function StopDragPerson(element,tableElement)
{
	var collision = collisionWithOtherPersonElement(element);
	var lastPositionNum =  element.context.id.substring(element.context.id.length - 1, element.context.id.length);
	var cleanTitleThis = element.context.title.substring(0, element.context.title.length - 1);	
	var realOldPosition;
	var realNewPosition;
	
	if (collision[0])
	{
		var collisionPerson = collision[1];
		var newTop = collision[1].position().top;
		var newLeft = collision[1].position().left;
							
		collision[1].animate({top: PersonLastPosition[0],left: PersonLastPosition[1]});
		realOldPosition = element.context.title.substring(element.context.title.length - 1, element.context.title.length);							
		realNewPosition = collision[1].context.title.substring(collision[1].context.title.length - 1, collision[1].context.title.length);
		element.animate({top: newTop,left: newLeft},function() {
				
			var newPositionNum = collision[1].context.id.substring(collision[1].context.id.length - 1, collision[1].context.id.length);	
							
			var cleanTitleCollision = collision[1].context.title.substring(0, collision[1].context.title.length - 1);
								
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
			});
			
			$.post('/canvas/swapPos/', {elem_num: tableElement.context.id, first_position: realOldPosition, second_position: realNewPosition},
			function(data){
           if (data == '{"status": "OK"}')
           {
				$("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
			}
			else
			{
				$("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
			}
			});

		}
		else
		{
			fixPlaceFloat(cleanTitleThis , lastPositionNum);
			$("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
			element.animate({top: PersonLastPosition[0],left: PersonLastPosition[1]},function() {selectPersonElement($("#tableElement"+lastPositionNum))});
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
}

function hideElement(element)
{
	element.border('0px white 0');
	element.fadeTo(400, 0, function() {
		// Animation complete.
		$(this).hide();
	});
}

function fixPlaceFloat(side, position)
{	
	switch (side)
	{
		case "personTop":
		case "personBottom":
		{
			$("#tableElementCaption"+position).css('float','none');
			$("#tableElementCaption"+position).css('cssFloat','none');
			$("#tableElementCaption"+position).css('styleFloat','none');
			
			var caption = $("#tableElementCaption"+position);
			var img = $("#tableElement"+position);
			
			$("#tableElementCaption"+position).remove();
			$("#tableElement"+position).remove();	
			
			if (side == "personTop")
			{
				$("#tableElementDiv"+position).append(caption);
				$("#tableElementDiv"+position).append(img);
			}
			else
			{
				$("#tableElementDiv"+position).append(img);
				$("#tableElementDiv"+position).append(caption);
			}
			break;
		}
		case "personRight":
		case "personLeft":
		{
			var captionContext = $("#tableElementCaption"+position).html();	
			
			if (side == "personRight")
			{
				$("#tableElementCaption"+position).replaceWith('<p Id="tableElementCaption'+ position +'" style="float:right;">'+ captionContext +'</p>');
			}
			else
		    {	
				$("#tableElementCaption"+position).replaceWith('<p Id="tableElementCaption'+ position +'" style="float:left;">'+ captionContext +'</p>');
			}
			$("#tableElementCaption"+position).addClass('TableElemText');
			break;
		}
	}
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

function savePersonChanges(tableElement, pos)
{
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	
	if(!emailReg.test($("#detailsE-mail").val())) {
      $("#detailsE-mail").after('<span id="EmailValidtion" style="color:red">  Enter a valid email address.</span>');
    }
	else
	{
	$("#EmailValidtion").remove();
    $.post('/canvas/savePerson/', {elem_num: tableElement.context.id, position: pos, first_name: $("#detailsFirstName").val() , last_name:$("#detailsLastName").val() ,phone_num: $("#detailsPhoneNum").val() ,person_email: $("#detailsE-mail").val()},
      function(data){
		$("#SaveStatImg").fadeTo(400, 0);
        if (data.status == 'OK')
		{
		  personData.first_name = $("#detailsFirstName").val();
		  personData.last_name = $("#detailsLastName").val();
		  personData.phone_num = $("#detailsPhoneNum").val();
		  personData.person_email = $("#detailsE-mail").val();
		  document.getElementById("tableElementCaption" + personData.position).innerHTML = personData.first_name + "</br>" + personData.last_name;
          $("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
        }else{
          $("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
        }
		$("#SaveStatImg").fadeTo(400, 1);
    }, 'json');
	}
}

$(document).ready(function() {
});
 