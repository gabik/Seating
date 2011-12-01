var DetailsWidth = 800;
var DetailsHeight = 335;

var frameStringPD = '<div id="PDFrame" style="position:absolute; z-index:99999;	 margin-right:auto; margin-left: auto;"><table border="0" cellspacing="0" cellpadding="0"><tr><td width="5" height="25"><img src="/static/right_interface/images/tl.png" width="5" height="25" /></td><td height="25" colspan="2" bgcolor="#E0E0AD" dir="rtl"><span class="text_black">מאפייני אורח/ת</span></td><td width="5" height="25"><img src="/static/right_interface/images/tr.png" width="5" height="25" /></td></tr><tr height="auto"><td width="5" valign="bottom" bgcolor="#5A8EA3"></td><td bgcolor="white" align="left" valign="center" width="135" title="לחיצה כפולה ליציאה ממאפיינים"><div id="detailsLeftSide"><img Id="personImg" src="/static/canvas/images/person/man_128X128.png" width="128" height="128" align="left"/></div><td bgcolor="white" align="left"><div class="PersonDetailsArea" id="details" /></td><td width="5" valign="bottom" bgcolor="#5A8EA3"></td></tr><tr><td width="5" valign="bottom"><img src="/static/right_interface/images/bl.png" width="5" height="5" /></td><td colspan="2" bgcolor="#5A8EA"></td><td width="5" valign="bottom"><img src="/static/right_interface/images/br.png" width="5" height="5" /></td></tr><tr><td width="5" valign="bottom"></td><td colspan="2" valign="top"><img src="/static/page/images/shadow.png" width="635" height="15" /></td><td width="5" valign="bottom"></td></tr></table></div>';

function createTableElement(i,element,side)
{
	switch (side)
	{
		case "left":
		{
			$("#canvas-div").append($('<div class="TableElementDiv" Id="tableElementDiv'+ parseInt(i + 1) +'"><p Id="tableElementCaption'+ parseInt(i + 1) +'" style="float:left;">empty</p><img src="" class="TableElemImg" Id="tableElement'+ parseInt(i + 1) +'"/></div>'));
			break;
		}
		case "right":
		{
			$("#canvas-div").append($('<div class="TableElementDiv" Id="tableElementDiv'+ parseInt(i + 1) +'"><p Id="tableElementCaption'+ parseInt(i + 1) +'" style="float:right;">empty</p><img src="" class="TableElemImg" Id="tableElement'+ parseInt(i + 1) +'"/></div>'));
			break;
		}
		case "top":
		{
			$("#canvas-div").append($('<div class="TableElementDiv" Id="tableElementDiv'+ parseInt(i + 1) +'"><p Id="tableElementCaption'+ parseInt(i + 1) +'" class="TableElemText">empty</p><img src="" class="TableElemImg" Id="tableElement'+ parseInt(i + 1) +'"/></div>'));
			break;
		}
		case "bottom":
		{
			$("#canvas-div").append($('<div class="TableElementDiv" Id="tableElementDiv'+ parseInt(i + 1) +'"><img src="" class="TableElemImg" Id="tableElement'+ parseInt(i + 1) +'"/><p Id="tableElementCaption'+ parseInt(i + 1) +'" class="TableElemText">empty</p></div>'));
			break;
		}
	}
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