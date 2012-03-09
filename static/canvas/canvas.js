//canvas.js
function menuItemClick(element)
{
	$('ul.AddMenu').hide('medium');
	var kind = element.context.id;
	
	kind = kind.replace(/\&/g,"_")
	var width = 90 + (8 - maxElementCapacity) * 2;
	var height = 90 + (8 - maxElementCapacity) * 2;
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
            //undoElement[1] = "delete";			writeOccasionInfo(getHebTableName(kind) +" הוספת אלמנט מסוג");
			ShowHourGlassWaitingWindow(true);
        }
      }, 'json');
}

function posPropertyPanel(element)
{
	if (element != "")
	{
		$("#element-properties-list").css('zIndex',9999);
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
			showLightMsg("מחיקת אלמנט", " האם לבצע מחיקה לאלמנט "+ name	+ " ? ", "YESNO", "Question");
			currentMsgTimer = setTimeout("delDivPress()",500);
		}
		else
		{
			showLightMsg("מחיקת אלמנט","יש לבחור אלמנט.","OK","Notice");
		}
		//}
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
							var answer = true;
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
  });
  
   if (navigator.userAgent.toLowerCase().indexOf('chrome') > 0)
   {
		$("#occasionDetailsR").css('top',$("#occasionDetailsR").position().top + 5);
		$("#occasionDetailsAdvanceR").css('top',$("#occasionDetailsAdvanceR").position().top + 5);
   }
   else if (navigator.userAgent.toLowerCase().indexOf('firefox') > 0)
   {
		$("#occasionDetailsR").css('top',$("#occasionDetailsR").position().top + 9);
		$("#occasionDetailsAdvanceR").css('top',$("#occasionDetailsAdvanceR").position().top + 9);
		$("#search-properties-list").css('top',$("#search-properties-list").position().top + 7);
   }
  	
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
