var DetailsWidth = 800;
var DetailsHeight = 358;

var frameStringPD = '<div id="PDFrame" style="position:absolute; z-index:99999;	 margin-right:auto; margin-left: auto;"><table border="0" cellspacing="0" cellpadding="0"><tr><td width="5" height="25"><img src="/static/right_interface/images/tl.png" width="5" height="25" /></td><td height="25"  bgcolor="#E0E0AD"><img id="PersonMainCloseBtn" style="cursor:pointer;" src="/static/canvas/images/close_window_btn_n.png" width="16" height="16" onclick="onMainClose()" onmouseout="PersonMainCloseBtnMouseOut(this)" onmouseover="PersonMainCloseBtnMouseOver(this)"></img></td><td height="25" bgcolor="#E0E0AD" dir="rtl"><span class="text_black">מאפייני אורח/ת</span></td><td width="5" height="25"><img src="/static/right_interface/images/tr.png" width="5" height="25" /></td></tr><tr height="auto"><td width="5" valign="bottom" bgcolor="#5A8EA3"></td><td bgcolor="white" align="left" valign="center" width="145" title="לחיצה כפולה ליציאה ממאפיינים"><div id="detailsLeftSide" style="padding:10px;"><img Id="personImg" src="/static/canvas/images/person/man_128X128.png" width="128" height="128" align="left"/></div><td bgcolor="white" align="left"><div class="PersonDetailsArea" id="details" /></td><td width="5" valign="bottom" bgcolor="#5A8EA3"></td></tr><tr><td width="5" valign="bottom"><img src="/static/right_interface/images/bl.png" width="5" height="5" /></td><td colspan="2" bgcolor="#5A8EA"></td><td width="5" valign="bottom"><img src="/static/right_interface/images/br.png" width="5" height="5" /></td></tr><tr><td width="5" valign="bottom"></td><td colspan="2" valign="top"><img src="/static/page/images/shadow.png" width="635" height="15" /></td><td width="5" valign="bottom"></td></tr></table></div>';

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
	
	$("#canvas-div").append($('<table class="TableParentElementDiv" border="0" cellspacing="0" cellpadding="0" Id="tableParentElementDiv'+ parseInt(i + 1) +'" style="position:absolute; width:64; height:64; z-index:' + zIndex + ';"><tr valign="top"><td valign="top"><div class="WaitingPersonChair" Id="tableElementDiv'+ parseInt(i + 1) +'"><p class="TableEmptyDetails">'+ (i + 1) +'</p></div></td></tr><tr valign="top" align="center" style="display:none;"><td><p class="text_11_black_bold" style="background:white; border:3px solid black; padding-left:5; padding-right:5; text-overflow: ellipsis; overflow:hidden; white-space:nowrap; max-width:48;"/></td></tr></table>'));
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
			
			caption.context.style="text-align:center;"
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
				$("#tableElementDiv"+position).append(caption);
				$("#tableElementDiv"+position).append(img);
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
				if (occupied)
				{
					$("#tableElement"+position).attr("src", "/static/canvas/images/chair_empty_top_right_occupied.png");
				}
				else
				{
					$("#tableElement"+position).attr("src", "/static/canvas/images/chair_empty_top_right.png");
				}
				$("#tableElementCaption"+position).replaceWith('<p Id="tableElementCaption'+ position +'" style="float:right;">'+ captionContext +'</p>');
			}
			else
		    {	
				if (occupied)
				{
					$("#tableElement"+position).attr("src", "/static/canvas/images/chair_empty_bottom_left_occupied.png");
				}
				else
				{
					$("#tableElement"+position).attr("src", "/static/canvas/images/chair_empty_bottom_left.png");
				}
				$("#tableElementCaption"+position).replaceWith('<p Id="tableElementCaption'+ position +'" style="float:left;">'+ captionContext +'</p>');
			}
			$("#tableElementCaption"+position).addClass('TableElemText');
			break;
		}
	}
}