
function posPropertyPanel(element)
{
	if (element != "")
	{
		$("#element-properties-list").css('zIndex',9999);
		if (element.position().left < 600)
		{
			$("#element-properties-list").css('top',element.position().top);
			$("#element-properties-list").css('left', -$("#canvas-div").width() + element.position().left + element.width() - 15);
			$("#element-properties-list").show("slide", { direction: "left" }, 50);
		}
		else
		{
			$("#element-properties-list").css('top',element.position().top);
			$("#element-properties-list").css('left', -$("#canvas-div").width() + element.position().left - $("#element-properties-list").width() - 30);
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
	
	if (kind.indexOf("mutilEditing") > -1)
	{
		if (findNumOfAllSeaters() > maxGuests)
		{
				showLightMsg("כמות שולחנות","ישנם שולחנות רבים, אין צורך בעריכת שולחנות, אם בכל זאת ברצונך לבצע פעולה יש למתן כמות שולחנות.","OK","Notice");
		}
		else
		{
			showLightMsg("מסך עריכת שולחנות", "לידעתך במידה ויתווספו שולחנות/בר/רחבת ריקודים/רחבת דיי ג'יי במסך העריכה, כל השולחנות יסודרו במעגל, האם ברצונך להמשיך?", "YESNO", "Question");
			currentMsgTimer = setTimeout("goBackToNewCanvas()",500);
		}
	}
	else
	{
		kind = kind.replace(/\&/g,"_");
		var width = 90 + (8 - maxElementCapacity - 2) * 2;
		var height = 90 + (8 - maxElementCapacity - 2) * 2;
		var addWidth = 0;
		var addHeight = 0;
				
		if (kind.indexOf("Rect") > -1)
		{
			addHeight = 16;
		}
		else if (kind == "dance_stand")
		{
			addWidth = 200;
			addHeight = 40;
		}
		else if (kind ==  "bar_stand") 
		{
			addWidth = 145;
			addHeight = 40;
		}
		else if (kind ==  "dj_stand") 
		{
			addWidth = 15;
			addHeight = 15;
		}
		
		$.post('/canvas/add/', {kind: kind ,amount: 1, width:width + addWidth, height:height + addHeight},
		  function(data){
			if (data.status == 'OK')
			{
				//undoElement[0] = SelectedElem;
				//undoElement[1] = "delete"; 
				writeOccasionInfo(getHebTableName(kind) +" הוספת אלמנט מסוג");
				ShowHourGlassWaitingWindow(true);
			}
		  }, 'json');
	}
}

function addMenuMouseLeave(element)
{
	//$('ul.AddMenu').slideUp();
}

function addAligmentDivButtonPress()
{
	$('ul.AligmentMenu').slideToggle();
}

function addAligmentDivButtonPress()
{
	$('ul.AligmentMenu').slideToggle();
}

function shapePlacementDivButtonPress()
{
    $('ul.ShapePlacementMenu').slideToggle();
}

function delTableButtonPress()
{
	if  (!detailsMode)
	{
		//if (tableMode)
		//{
		//	if (SelectedPerson != "")
		//	{
		//		showLightMsg("החזרת אורח לרשימה הצפה", "האם להחזיר את " + SelectedPerson.find('p').first().html() +" לרשימה הצפה?", "YESNO", "Question");
		//		currentMsgTimer = setTimeout("delDivPress()",500);
		//	}
		//	else
		//	{
		//		showLightMsg("החזרת אורח לרשימה הצפה","יש לבחור אורח.","OK","Notice");
		//	}
		//}
		//else
		//{
		if (SelectedElem != "")
		{
			var name = SelectedElem.find('p').first().attr('title');
			
			if (name == undefined)
			{
				name = SelectedElem.attr('title');
			}
			showLightMsg("מחיקת אלמנט", " האם לבצע מחיקה לאלמנט "+ name	+ " ? </br>במידה ויש מוזמנים הם יחזרו לרשימה הצפה.", "YESNO", "Question");
			currentMsgTimer = setTimeout("delDivPress()",500);
		}
		else
		{
			showLightMsg("מחיקת אלמנט","יש לבחור אלמנט.","OK","Notice");
		}
		//}
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
				$.post('/canvas/getFixNumber/', {elem_num : SelectedElem.context.id},
				function(data){
				if (data.status == 'OK')
				{
					if (data.fix_num == $("#ElementNumber").val())
					{
						saveElementWithCaption(SelectedElem,caption,size,"",parseInt($("#ElementNumber").val()));
					}
					else
					{
						$.post('/canvas/fixNumberStatus/', {fixNumber:parseInt($("#ElementNumber").val()),'elem_num':SelectedElem.context.id},
						function(dataSave){
						if (dataSave.status == 'OK')
						{
							setSaveStatus("OK");
							if (dataSave.result != " " && dataSave.result != "")
							{
								showLightMsg("מספר אלמנט קיים", " מספר האלמנט משוייך ל "  + dataSave.result + " האם להמשיך בשמירה?", "YESNO", "Question");
								currentMsgTimer = setTimeout(function(){saveElementWithCaptionIfExist(SelectedElem,caption,size,"",parseInt($("#ElementNumber").val()))},500);
							}
							else
							{
								saveElementWithCaption(SelectedElem,caption,size,"",parseInt($("#ElementNumber").val()));
							}
						   }else{
								saveElementWithCaption(SelectedElem,caption,size,"",parseInt($("#ElementNumber").val()));
						   }
						}, 'json');
					}
				}
				}, 'json');
				posPropertyPanel(SelectedElem);
			}
		}
}

$(document).ready(function() {
	$("#canvas-div").append($('<div id="borderSelected" style="position:absolute;"/>'));
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

