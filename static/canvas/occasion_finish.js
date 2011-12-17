var mainFrameWidthOF = 470;
var mainFrameHeightOF = 400;

var frameStringOF = '<div id="OFFrame" style="position:absolute; z-index:99999;	 margin-right:auto; margin-left: auto;"><table border="0" height="300" cellspacing="0" cellpadding="0"><tr><td width="5" height="25"><img src="/static/right_interface/images/tl.png" width="5" height="25" /></td><td height="25"  bgcolor="#E0E0AD"><img id="OccasionFinishCloseBtn" style="cursor:pointer;" src="/static/canvas/images/close_window_btn_n.png" width="16" height="16" ></img></td><td height="25" colspan="1" bgcolor="#E0E0AD" dir="rtl"><span class="text_black">ישומיי אירוע</span></td><td width="5" height="25"><img src="/static/right_interface/images/tr.png" width="5" height="25" /></td></tr><tr height="auto"><td width="5" valign="bottom" bgcolor="#5A8EA3"></td><td bgcolor="white" align="left" width="460" colspan="2"><div class="FeatureArea" id="features" width="400" height="200"/></td><td width="5" valign="bottom" bgcolor="#5A8EA3"></td></tr><tr><td width="5" valign="bottom"><img src="/static/right_interface/images/bl.png" width="5" height="5" /></td><td colspan="2" bgcolor="#5A8EA"></td><td width="5" valign="bottom"><img src="/static/right_interface/images/br.png" width="5" height="5" /></td></tr><tr><td width="5" valign="bottom"></td><td colspan="2" valign="top"><img src="/static/page/images/shadow.png" width="460" height="15" /></td><td width="5" valign="bottom"></td></tr></table></div>';

var excelDivString = '<div id="tabExcel" ><table border="0" cellspacing="0" cellpadding="0" width="300" height="200" align="center"><tr><td align="right" dir="rtl"><p class="text_18_black" dir="rtl">הורדה:</p><p class="text_14_black" dir="rtl">קובץ הורדה למילוי פרטי המוזמנים&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><img id="excelDownImg" src="/static/canvas/images/features/exceldown_n.png" align="middle" style="cursor:pointer;"/><span></p></td></tr><tr height="15" ><td colspan="2"></tr><tr><td align="right" dir="rtl"><p class="text_18_black" dir="rtl">העלאה:</p><form enctype="multipart/form-data" action=/accounts/upload method="POST">&nbsp;<input type="file" name="file" id="id_file"><input type="image" id="excelUpImg" src="/static/canvas/images/features/excelup_n.png" value="Upload File" align="top"/></form></input></td></tr></table></br></div>'/*{% csrf_token %}*/


var outputDivString = '<div id="tabOutput" ><table border="0" cellspacing="0" cellpadding="0" width="300" height="200" align="center"><tr><td align="right" dir="rtl"><img id="bulletImg" src="/static/site/images/bullet.png">&nbsp;&nbsp;&nbsp;<a href="#" class="text_18_black" dir="rtl">הורדת קובץ רשימת מוזמנים.</a></img></br></br><img id="bulletImg" src="/static/site/images/bullet.png">&nbsp;&nbsp;&nbsp;<span><a href="#" class="text_18_black" dir="rtl">הורדת קובץ מיפוי שולחנות.</a></span></img></br></br><img id="bulletImg" src="/static/site/images/bullet.png">&nbsp;&nbsp;&nbsp;<span><a href="#" class="text_18_black" dir="rtl">הורדת קובץ פיתקיות ישיבה.</a></span></img></td></tr></table></br></div>'

var notificationDivString = '<div id="tabNotify"><table border="0" cellspacing="0" cellpadding="0" width="300" height="190" align="center"><tr><td align="right" colspan="3" dir="rtl"><p class="text_14_black" dir="rtl">שליחת&nbsp;&nbsp;&nbsp;&nbsp;<span><select id="sendValue" size="1"><option value="1" SELECTED>אישורי הגעה<option value="2">תודות</select><span></td></tr><td align="center" dir="rtl" colspan="2"><table><td><p class="text_14_black" dir="rtl" id="emailsSelectAll" style="cursor:pointer;">סמן הכל</p></td><td>&nbsp;&nbsp;&nbsp;&nbsp;</td><td><p class="text_14_black" id="emailsClearAll" style="cursor:pointer;">נקה הכל</p></td></table></td></tr><tr><td align="right" dir="rtl"><ul id="emailNotificationList"></ul></td><td>&nbsp;</td><td align="right" dir="rtl"><textarea name="message" id="notify_message" cols="15" rows="7"></textarea></td></tr><tr height="12"/><tr><td align="left" dir="rtl" colspan="3"><img id="sendNotifyImg" src="/static/page/images/send_btn_nr.png" /></td></tr></table></div>'

var ofTabString = '<div id="OFtabs"><ul id="OFTabList" style="display:block; font-size:12; overflow: auto; height:30;"><li><a href="#tabExcel">העלאה/הורדה אקסל</a></li><li><a href="#tabOutput">פלט</a></li><li><a href="#tabNotify">שלח לאורח</a></li></ul>'+ excelDivString + outputDivString + notificationDivString + '</div>'

function fillNotificationList()
{
		$.post('/canvas/getGuestsEmails/', {},
		function(emailData){	
			if (emailData.status == 'OK')
			{
				var count = parseInt(emailData.count);
				if (count > 0 )
				{
					emails = emailData.emailList.split("|",count);
					for (var i = 0; i < count; i++)
					{
						var color ="#E0E0AD";
						
						if (i % 2 != 0)
						{
							color ="#00FFFFFF";
						}
						email = emails[i].split(",",2);
						$("#emailNotificationList").append($('<li style="background:'+ color +';"><input id="email_'+ i +'" type="checkbox" value="False"><span class="text_10_black">'+ email[0] + " " + email[1] +'</span></input></li>'));
					}
				}
				else
				{
					$("#emailNotificationList").append($('<li><label class="text_14_black">לא נמצאו כתובות דואר אלקטרוני אצל אף אורח.</label></li>'));
				}
			}
		}, 'json');
}

function sendNotifyChange()
{
	var full_massage = "";
	if ($("#sendValue").val() == 2)
	{
		full_massage = full_massage + "תודה שהשתתפתם בשמחתנו,";
	}
	else
	{
		if ($("#addChar").text() == " " || $("#addChar").text() == '')
		{			
			full_massage = full_massage + "אבקש לקבל מידע לגבי הגעה לאירוע שלי, ";
		}
		else
		{
			full_massage = full_massage + "נבקש לקבל מידע לגבי הגעה לאירוע שלנו, ";
		}
	}
	full_massage = full_massage + " " + $("#firstPartnerName").text() + $("#addChar").text() + $("#secondPartnerName").text() + " " + $("#partnerLastName").text();
	full_massage = full_massage + $("#OccasionDate").text();
	$("#notify_message").text(full_massage);
}

$(document).ready(function() { 
 $(".OccasionFinishDiv").click(function()
 {
 	$("body").css("overflow", "hidden");
	var screenVP = getScreenWidthHeight();
	var screenWidth = screenVP[0];
	var screenHeight = screenVP[1];
	
	//creating window
	$("#canvas-div").append($('<div id="OccasionFinishRectangle" class="BlackOverlayRectangle"/>'));
	$("#OccasionFinishRectangle").css('top',0);
	$("#OccasionFinishRectangle").css('left',0);
	$("#OccasionFinishRectangle").css('width',screenWidth);
	$("#OccasionFinishRectangle").css('height',screenHeight);
	$("#OccasionFinishRectangle").draggable( 'disable' );
	$("#canvas-div").append($(frameStringOF));
	$("#OFFrame").css('top',screenHeight / 2 - mainFrameHeightOF / 2);
	$("#OFFrame").css('left',screenWidth / 2 - mainFrameWidthOF / 2);
	$("#OFFrame").css('width',mainFrameWidthOF);
	$("#OFFrame").css('height',mainFrameHeightOF);
	$("#OFFrame").draggable( 'disable' );
	$("#features").append($(ofTabString));
	$("#OFtabs").tabs();
	sendNotifyChange();
	$("#OccasionFinishCloseBtn").bind('click', function() {
		$("#OccasionFinishRectangle").remove();
		$("#OFFrame").remove(); 
		$("body").css("overflow", "auto");
	}); 

	$("#OccasionFinishCloseBtn").bind('mouseout', function(){
		$(this).attr('src',"/static/canvas/images/close_window_btn_n.png");
	});
	$("#OccasionFinishCloseBtn").bind('mouseover', function(){
		$(this).attr('src',"/static/canvas/images/close_window_btn_r.png");
	});
	$("#excelDownImg").bind('mouseout', function(){
		$(this).attr('src',"/static/canvas/images/features/exceldown_n.png");
	});
	$("#excelDownImg").bind('mouseover', function(){
		$(this).attr('src',"/static/canvas/images/features/exceldown_r.png");
	});
	$("#excelDownImg").bind('click', function(){
		setTimeout( function() {  document.location.href='/accounts/download'; }, 0 );
	});
	$("#excelUpImg").bind('mouseout', function(){
		$(this).attr('src',"/static/canvas/images/features/excelup_n.png");
	});
	$("#excelUpImg").bind('mouseover', function(){
		$(this).attr('src',"/static/canvas/images/features/excelup_r.png");
	});
	$("#sendNotifyImg").bind('mouseout', function(){
		$(this).attr('src',"/static/page/images/send_btn_nr.png");
	});
	$("#sendNotifyImg").bind('mouseover', function(){
		$(this).attr('src',"/static/page/images/send_btn.png");
	});
	$("#emailsSelectAll").bind('click', function(){
		$("#emailNotificationList > li").each(function(i) {
			$(this).find('input').first().attr('checked', true);
		});
	});
	$("#emailsClearAll").bind('click', function(){
		$("#emailNotificationList > li").each(function(i) {
			$(this).find('input').first().attr('checked', false);
		});
	});
	$("#sendValue").bind('change', function(){
		sendNotifyChange();
	});
  });
});

 
 