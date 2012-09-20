var DetailsWidth = 800;
var DetailsHeight = 403;

var frameStringPD = '<table id="PDFrame" style="position:absolute;" border="0" cellspacing="0" cellpadding="0"><tr><td width="5" height="25"><img src="/static/right_interface/images/tl.png" width="5" height="25" /></td><td height="25"  bgcolor="#E0E0AD"><img id="PersonMainCloseBtn" style="cursor:pointer;" src="/static/canvas/images/close_window_btn_n.png" width="16" height="16" onclick="onMainClose()" onmouseout="PersonMainCloseBtnMouseOut(this)" onmouseover="PersonMainCloseBtnMouseOver(this)" alt="סגור מאפיינים"></img></td><td height="25" bgcolor="#E0E0AD" dir="rtl"><span class="text_black">מאפייני אורח/ת</span></td><td width="5" height="25"><img src="/static/right_interface/images/tr.png" width="5" height="25" /></td></tr><tr height="auto"><td width="5" valign="bottom" bgcolor="#5A8EA3"></td><td bgcolor="white" align="left" width="145" valign="center" title="לחיצה כפולה ליציאה ממאפיינים"><div id="detailsLeftSide" style="padding:10px;"><img Id="personImg" src="/static/canvas/images/person/man_128X128.png" width="1" height="1" align="center"/></div><td bgcolor="white" align="left"><div class="PersonDetailsArea" id="details" /></td><td width="5" valign="bottom" bgcolor="#5A8EA3"></td></tr><tr><td width="5" valign="bottom"><img src="/static/right_interface/images/bl.png" width="5" height="5" /></td><td colspan="2" bgcolor="#5A8EA"></td><td width="5" valign="bottom"><img src="/static/right_interface/images/br.png" width="5" height="5" /></td></tr><tr><td width="5" valign="bottom"></td><td colspan="2" valign="top"><img src="/static/page/images/shadow.png" width="635" height="15" /></td><td width="5" valign="bottom"></td></tr></table>';

function createTableElement(i,element, zIndUp)
{
	var zIndex = 0;
	
	if (zIndUp)
	{
		zIndex = parseInt(999 + i);
	}
	else
	{
		zIndex = parseInt(999 - i);
	}
	
	$("#canvas-div").append($('<table class="TableParentElementDiv" border="0" cellspacing="0" cellpadding="0" Id="tableParentElementDiv'+ parseInt(i + 1) +'" style="position:absolute; width:64; height:64; z-index:' + zIndex +';"><tr valign="top"><td valign="top"><div class="WaitingPersonChair" Id="tableElementDiv'+ parseInt(i + 1) +'"><p class="TableEmptyDetails">'+ (i + 1) +'</p></div></td></tr><tr valign="top" align="center" style="display:none;"><td><p class="text_11_black_bold" style="background:white; border:3px solid black; padding-left:5; padding-right:5; text-overflow: ellipsis; overflow:hidden; white-space:nowrap; width:48;"/></td></tr></table>'));
	$("#tableElementDiv" + parseInt(i + 1)).data('pos', i + 1);
	LoadPerson(element, i);
}

function fixPlaceFloat(side, position)
{	
	var occupied = false;
	if ($("#tableElement"+position).attr("src") == "/static/canvas/images/chair_empty_top_right_occupied.png" ||
		$("#tableElement"+position).attr("src") == "/static/canvas/images/chair_empty_bottom_left_occupied.png")
		{
			occupied = true;
		}
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
				if (occupied)
				{
					img.attr("src", "/static/canvas/images/chair_empty_top_right_occupied.png");
				}
				else
				{
					img.attr("src", "/static/canvas/images/chair_empty_top_right.png");
				}
				$("#personElemUpContent"+position).append(caption);
				$("#personElemDownContent"+position).append(img);
			}
			else
			{
				if (occupied)
				{
					img.attr("src", "/static/canvas/images/chair_empty_bottom_left_occupied.png");
				}
				else
				{
					img.attr("src", "/static/canvas/images/chair_empty_bottom_left.png");
				}
				$("#personElemUpContent"+position).append(img);
				$("#personElemDownContent"+position).append(caption);
			}
			break;
		}
		case "personRight":
		case "personLeft":
		{
			$("#tableElementCaption"+position).css('float','none');
			$("#tableElementCaption"+position).css('cssFloat','none');
			$("#tableElementCaption"+position).css('styleFloat','none');
			
			var caption = $("#tableElementCaption"+position);
			var img = $("#tableElement"+position);
			
			$("#tableElementCaption"+position).remove();
			$("#tableElement"+position).remove();	
			
			if (side == "personRight")
			{
				if (occupied)
				{
					img.attr("src", "/static/canvas/images/chair_empty_top_right_occupied.png");
				}
				else
				{
					img.attr("src", "/static/canvas/images/chair_empty_top_right.png");
				}
				$("#personElemRightContent"+position).append(caption);
				$("#personElemLeftContent"+position).append(img);
			}
			else
			{
				if (occupied)
				{
					img.attr("src", "/static/canvas/images/chair_empty_bottom_left_occupied.png");
				}
				else
				{
					img.attr("src", "/static/canvas/images/chair_empty_bottom_left.png");
				}

				$("#personElemRightContent"+position).append(img);
				$("#personElemLeftContent"+position).append(caption);
			}
			break;
		}
	}
}