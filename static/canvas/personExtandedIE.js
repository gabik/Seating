var DetailsWidth = 800;
var DetailsHeight = 403;

var frameStringPD = '<table id="PDFrame" style="position:absolute;" border="0" cellspacing="0" cellpadding="0"><tr><td width="5" height="25"><img src="/static/right_interface/images/tl.png" width="5" height="25" /></td><td height="25"  bgcolor="#E0E0AD"><img id="PersonMainCloseBtn" style="cursor:pointer;" src="/static/canvas/images/close_window_btn_n.png" width="16" height="16" onclick="onMainClose()" onmouseout="PersonMainCloseBtnMouseOut(this)" onmouseover="PersonMainCloseBtnMouseOver(this)" alt="סגור מאפיינים"></img></td><td height="25" bgcolor="#E0E0AD" dir="rtl"><span class="text_black">מאפייני אורח/ת</span></td><td width="5" height="25"><img src="/static/right_interface/images/tr.png" width="5" height="25" /></td></tr><tr height="auto"><td width="5" valign="bottom" bgcolor="#5A8EA3"></td><td bgcolor="white" align="left" width="145" valign="center" title="לחיצה כפולה ליציאה ממאפיינים"><div id="detailsLeftSide" style="padding:10px;"><img Id="personImg" src="/static/canvas/images/person/man_128X128.png" width="1" height="1" align="center"/></div><td bgcolor="white" align="left"><div class="PersonDetailsArea" id="details" /></td><td width="5" valign="bottom" bgcolor="#5A8EA3"></td></tr><tr><td width="5" valign="bottom"><img src="/static/right_interface/images/bl.png" width="5" height="5" /></td><td colspan="2" bgcolor="#5A8EA"></td><td width="5" valign="bottom"><img src="/static/right_interface/images/br.png" width="5" height="5" /></td></tr><tr><td width="5" valign="bottom"></td><td colspan="2" valign="top"><img src="/static/page/images/shadow.png" width="635" height="15" /></td><td width="5" valign="bottom"></td></tr></table>';

function createTableElement(i,element, zIndUp, fromTableMode)
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
	
	var size = 64;
	var fontSize = 14;
	var tableClass = "TableParentElementDiv";
	var elemID = element.attr('id');
	var mode = "T";
	var textPersonClass = "text_11_black_bold";
	var borderThickness = 3;
	var maxWidth = 48;
	var paddingTextPerson = 0;
	var textHeight = 20;
	var lineHeight = 1.5;
	var textMargin = -30;
	
	if (!fromTableMode)
	{
		size = 16;
		if (!zoomingMode)
		{
			var elementMaxSize = parseInt(element.find('p:eq(1)').text().substr(element.find('p:eq(1)').text().indexOf("/")+1));
			
			size = (40 - elementMaxSize);
		}
		fontSize = 9;
		tableClass = "TableParentElementDivOutside chairs" + elemID;
		mode = "NT";
		textPersonClass = "text_9_black_bold";
		borderThickness = 1;
		maxWidth = 24;
		paddingTextPerson = 0;
		textHeight = 10;
		lineHeight = 1;
		textMargin = -15;
	}
	
	$("#canvas-div").append($('<table class="'+ tableClass +'" border="0" cellspacing="0" cellpadding="0" Id="tableParentElementDiv'+ parseInt(i + 1) + elemID + mode +'" style="position:absolute; width:'+ size +'; height:'+ size +'; z-index:' + zIndex + ';"><tr valign="top"><td class="actionBtn" valign="top"><div class="WaitingPersonChair" style="width:'+ size +'; height:'+ size +';" Id="tableElementDiv'+ parseInt(i + 1) + elemID + mode +'"><table border="0" cellspacing="0" cellpadding="0" height="'+ size +'"><tr><td class="actionBtn" width="'+ size +'" height="'+ size +'"><p class="TableEmptyDetails" style="font-size:' + fontSize + ';">'+ (i + 1) +'</p></tr></td></table></div></td></tr><tr valign="top" align="center" style="display:none; position: relative; margin:' + textMargin + '"><td class="actionBtn"><p class="'+ textPersonClass +'" style="background:white; height:' + textHeight + '; line-height:'+ lineHeight +'; border:'+ borderThickness +'px solid black; padding:'+paddingTextPerson + '; text-overflow: ellipsis; overflow:hidden; white-space:nowrap; width:'+ maxWidth +';"/></td></tr></table>'));
	$("#tableElementDiv" + parseInt(i + 1) + elemID + mode).data('pos', i + 1);
	$("#tableElementDiv" + parseInt(i + 1) + elemID + mode).data('elem', elemID);
	$("#tableParentElementDiv" + parseInt(i + 1) + elemID + mode).data('elem', elemID);
	LoadPerson(element, i, fromTableMode);
}
