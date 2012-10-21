
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
		var draggable = true;
		var dragClass = "DragDiv";
		var appos = "'";
		
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
			width = 128;
			height = 64;
			draggable = false;
		}
		else if (kind ==  "bar_stand") 
		{
			width = 64;
			height = 64;
			draggable = false;
		}
		else if (kind ==  "dj_stand") 
		{
			width = 64;
			height = 64;
			draggable = false;
		}
		
		$.post('/canvas/add/', {kind: kind ,amount: 1, width:width + addWidth, height:height + addHeight},
		  function(data){
			if (data.status == 'OK')
			{
				//undoElement[0] = SelectedElem;
				//undoElement[1] = "delete"; 
				writeOccasionInfo(getHebTableName(kind) +" הוספת אלמנט מסוג");
				//ShowHourGlassWaitingWindow(true);
					var tableNewText = "";
				
				if (draggable)
				{
					tableNewText = '<div class='+dragClass+' id="DragDiv-'+ data.max_num +'" title="לחיצה כפולה לכניסה לשולחן"><table class="DragTable" border="0" cellspacing="0" cellpadding="0" id="'+ data.kind +'-'+ data.max_num +'"><tr><td style="text-align:center;" colspan="5"><p id="CaptionDragDiv-'+ data.max_num +'" class="text_11_black_bold" style="text-overflow: ellipsis; overflow:hidden; white-space:nowrap;  width:82.5;" dir="rtl">שולחן '+ data.fix_num +'</p></td></tr><tr><td>&nbsp;</td><td class="tableProp" style="text-align:center;" onmouseup="propMenuBtnClick('+ appos +'DragDiv-'+ data.max_num + appos +')"><span id="elemProp_DragDiv-'+ data.max_num +'" class="text_11_blue" dir="rtl" style="z-index:9999;">[עריכה]</span></td><td style="text-align:center;">&nbsp;</td><td class="tableProp tableDelProp" style="text-align:center;" onmouseup="delFromTable('+ appos +'DragDiv-'+ data.max_num + appos +')"><span id="delProp_DragDiv-'+ data.max_num +'" class="text_11_blue" dir="rtl" style="z-index:9999;">[מחיקה]</span></td><td>&nbsp;</td></tr><tr><td colspan="5" style="text-align:center;"><p id="tblSize" class="text_11_black_bold" dir="rtl">0/8</p></td></tr><tr class="tableBack" align="center"><td colspan="5" style="text-align:center;" onmouseup="tableBackBtnClick()" align="center"><p id="elemBack_DragDiv-'+ data.max_num +'" class="text_11_blue" dir="rtl" style="z-index:9999;">[חזור]</p></td></tr></table></div>'
				}
				else
				{
					tableNewText = '<div class='+dragClass+' id="DragDiv-'+ data.max_num +'" title=""><table class="DragTable" border="0" cellspacing="0" cellpadding="0" id="'+ data.kind +'-'+ data.max_num +'"><tr><td style="text-align:center;" colspan="5"></td></tr><tr><td>&nbsp;</td><td class="tableProp" style="text-align:center;"></td><td style="text-align:center;">&nbsp;</td><td class="tableProp tableDelProp" style="text-align:center;"></td><td>&nbsp;</td></tr><tr><td colspan="5" style="text-align:center;"></td></tr><tr class="tableBack" align="center"><td colspan="5" style="text-align:center;" onmouseup="tableBackBtnClick()" align="center"></td></tr></table></div>'
				}
				
				if (tableNewText != "")
				{
					$("#canvas-div").append($(tableNewText));
					
					var div = $("#DragDiv-"+ data.max_num);
									
					if (draggable)
					{		
					   div.css('width','82.5');
					   if (kind == "Rect") {
						   div.css('height','95');
						   div.droppable({
								accept: "#people_list li",
								hoverClass: "RectShapeDropLayer",
								drop: function(e, ui ) {
										droppableTable(ui ,$(this));
									}
						  });
					   }
					   else if (kind == "Lozenge")
					   {
							div.css('height','90');
							div.droppable({
									accept: "#people_list li",
									hoverClass: "LozShapeDropLayer",
									drop: function(e, ui ) {
											droppableTable(ui ,$(this));
										}
							  });
					   }
					   else
					   {
					   		div.css('height','82.5');
					   		if (kind == "Round")
							{
								 div.droppable({
										accept: "#people_list li",
										hoverClass: "RoundShapeDropLayer",
										drop: function(e, ui ) {
												droppableTable(ui ,$(this));
											}
								  });
							}
							else
							{
								div.droppable({
										accept: "#people_list li",
										hoverClass: "RectShapeDropLayer",
										drop: function(e, ui ) {
												droppableTable(ui ,$(this));
											}
								  });
							}
					   }
					}
					else					
					{
						div.css('width', width + addWidth);
						div.css('height', height + addHeight);
						
						if (kind == "dance_stand")
						{
							div.attr('title',"רחבת ריקודים");
						}
						else if (kind ==  "bar_stand") 
						{
							div.attr('title',"בר משקאות");	
						}
						else if (kind ==  "dj_stand") 
						{
							div.attr('title',"עמדת דיי ג'יי");	
						}
					}
					
					var divTable = $("#DragDiv-"+ data.max_num).find('table').first();
					
					
					//divTable.css('width', div.width());
					//divTable.css('height',  div.height());
					
					makeOrientation(divTable, div, 'V', true);
					
					div.css('top', 80);
					div.css('left', 80);
					
					if (draggable)
					{
						div.draggable({
							 containment: 'parent',
							 cursor: "move",
							 start: function (e,ui){
								startDrag($(this));
							 },
							 drag: function (e,ui){ 
								
								XColPoint = returnCollisionWithOtherElementPoint($(this));
								
								if (XColPoint != "")
								{
									if (parseInt($("#DragCollisionImg").css('top')) > 0 && parseInt($("#DragCollisionImg").css('left')) > 0)
									{
										$("#DragCollisionImg").css('top', XColPoint[0]);
										$("#DragCollisionImg").css('left',XColPoint[1]);
									}
									else
									{
										$("#canvas-div").append($('<img id="DragCollisionImg" src="/static/canvas/images/X.png" style="top:' + XColPoint[0] + '; left:' + XColPoint[1] + '; position:absolute; z-index:99999;"/>'));
									}
								}
								else
								{
									$("#DragCollisionImg").remove();
								}
							 },
							 stop: function (e,ui){
								$("#DragCollisionImg").remove();
								if (XColPoint != "")
								{
									showLightMsg("הזזת שולחנות","לא ניתן להציב אלמנט על אלמנט אחר, יש להציב בשטח ריק, האלמנט יחזור למקומו הקודם.","OK","Notice");
								}
								XColPoint = "";
								stopDrag($(this));
							   }
						  });	 
						  
						div.dblclick( function(event) {
								posPropertyPanel("");
								 var elementTable = $(this).context.getElementsByTagName("table");
								 if (isThisPeopleTable(elementTable[0].id))
								 {
									if (tableMode && !disableDBClick)
									{
										$(this).attr("title", "לחיצה כפולה למצב עריכה");
										turnToRegularMode($(this),event);
										undoElementList = new Array(1);
										var undoElement = new Array(2);
										undoElement[0] = $(this);
										undoElement[1] = "closetbl";
										undoElementList[0] = undoElement;
									}
									else if (!disableDBClick)
									{
										$(this).attr("title", "לחיצה כפולה חזרה לאולם");
										turnToTableMode($(this),true,event);
										undoElementList = new Array(1);
										var undoElement = new Array(2);
										undoElement[0] = $(this);
										undoElement[1] = "opentbl";
										undoElementList[0] = undoElement;
									}
								}
								else
								{
									if (event != undefined)
									{
										if (event.user == "SearchTable")
										{
											var data = event.pass;
											pointTableAfterSearch($("#" + data));
											
										}
									}
								}
						  });	
						  
						  div.mouseup( function(e) {
						  if (navigator.userAgent.toLowerCase().indexOf('ie 8') > 0 || navigator.userAgent.toLowerCase().indexOf('ie 7') > 0)
							   {
									var element = $("#delProp_" + $(this).context.id);
									
									if (element.offset().top <= e.pageY && element.offset().top + element.height() >= e.pageY &&
									element.offset().left <= e.pageX && element.offset().left + element.width() >= e.pageX)
									{
										delFromTable($(this).context.id);
									}
									else 
									{
										element = $("#elemProp_" + $(this).context.id);
										
										if (element.offset().top <= e.pageY && element.offset().top + element.height() >= e.pageY &&
										element.offset().left <= e.pageX && element.offset().left + element.width() >= e.pageX)
										{
											propMenuBtnClick($(this).context.id);
										}
										else 
										{
											element = $("#elemBack_" + $(this).context.id);
											
											if (element.offset().top <= e.pageY && element.offset().top + element.height() >= e.pageY &&
											element.offset().left <= e.pageX && element.offset().left + element.width() >= e.pageX)
											{
												tableBackBtnClick();
											}
										}
									}
							   }
						   }); 

						if (collisionWithOtherElementById(div.attr('id')))
						{
							reposElementAtAFreeSpaceNonDragByID(div, 0);
						}						  
						else
						{
							selectElement(div);
						}
									
						$.post('/canvas/getAllItems/'+ div.attr('id').split("-",2)[1] +'/', {},
						 function(dataTable){
						   if (dataTable[0] != "" && dataTable[0] != 'undefined' && dataTable[0].status == 'OK')
						   {
								setSaveStatus("OK");
								
								posTableChairsWithData(dataTable, div, 8);
							}
						}, 'json');
					}
					else
					{
						div.draggable({
							 containment: 'parent',
							 cursor: "move",
							 start: function (e,ui){
								startDrag($(this));
							 },
							 drag: function (e,ui){ 
							 
								XColPoint = returnCollisionWithOtherElementPoint($(this));

								if (XColPoint != "")
								{
									if (parseInt($("#DragCollisionImg").css('top')) > 0 && parseInt($("#DragCollisionImg").css('left')) > 0)
									{
										$("#DragCollisionImg").css('top', XColPoint[0]);
										$("#DragCollisionImg").css('left',XColPoint[1]);
									}
									else
									{
										$("#canvas-div").append($('<img id="DragCollisionImg" src="/static/canvas/images/X.png" style="top:' + XColPoint[0] + '; left:' + XColPoint[1] + '; position:absolute; z-index:99999;"/>'));
									}
								}
								else
								{
									$("#DragCollisionImg").remove();
								}
							 },
							 stop: function (e,ui){
								$("#DragCollisionImg").remove();
								if (XColPoint != "")
								{
									showLightMsg("הזזת שולחנות","לא ניתן להציב אלמנט על אלמנט אחר, יש להציב בשטח ריק, האלמנט יחזור למקומו הקודם.","OK","Notice");  
								}
								XColPoint = "";
								stopDrag($(this));
							   }
						  }); 
						  
						  div.resizable({
								handles: 'n, e, s, w, ne, se, sw, nw',
								maxHeight:225,
								maxWidth:225,
								minHeight:40,
								minWidth:40,
								containment: 'parent',
								start: function (e,ui){
									resizableLastWidth = $(this).width();
									resizableLastHeight = $(this).height();
									startDradPositionList[0] = $(this).position();
								},
								resize: function (e,ui){
									var imgResize = $(this).find('img').first();
									imgResize.css('width',$(this).width());
									imgResize.css('height',$(this).height());
								},
								stop: function (e,ui){
									if (collisionWithOtherElement($(this)))
									{
										if (startDradPositionList[0] != 'undefined' && startDradPositionList[1] != 'undefined')
										{
											$(this).animate({top:startDradPositionList[0].top, left:startDradPositionList[0].left, width: resizableLastWidth , height: resizableLastHeight},300, 'linear', function() {
												var imgResize = $(this).find('img').first();
												imgResize.css('width',resizableLastWidth);
												imgResize.css('height',resizableLastHeight);
												$(this).css('width',resizableLastWidth);
												$(this).css('height',resizableLastHeight);
												selectElement($(this));
											});
										}
									}
									else
									{
										$.post('/canvas/saveElementWidthHeight/', {elem_num:$(this).context.id , width:$(this).width(), height:$(this).height()},
									   function(data){
										   if (data.status == 'OK')
										   {
												setSaveStatus("OK");
										   } 
										   else
										   {
												setSaveStatus("Error");
										   }
										}
										, 'json');
									}
								}
							});
							
							if (collisionWithOtherElementById(div.attr('id')))
							{
								reposElementAtAFreeSpaceByID(div, 200);
							}
							else
							{
								selectElement(div);
							}
					}
					div.click( function() {
							 selectElement($(this));
					});  
				}
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
			var addText = "";
			var name = SelectedElem.find('p').first().attr('title');
			
			if (SelectedElem.hasClass('DragDiv'))
			{
				addText = "במידה ויש מוזמנים הם יחזרו לרשימה הצפה.";
			}
			
			if (name == undefined)
			{
				name = SelectedElem.attr('title');
			}
			showLightMsg("מחיקת אלמנט", " האם לבצע מחיקה לאלמנט "+ name	+ " ? </br>" + addText, "YESNO", "Question");
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

