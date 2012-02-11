var mainFrameWidthOP = 410;
var mainFrameHeightOP = 400;

var frameStringOP = '<div id="OPFrame" style="position:absolute; z-index:99999;"><table width="400" border="0" cellspacing="0" cellpadding="0"><tr><td width="5" height="25"><img src="/static/right_interface/images/tl.png" width="5" height="25" /></td><td height="25" bgcolor="#E0E0AD"><img id="OcassionPropCloseBtn" style="cursor:pointer;" src="/static/canvas/images/close_window_btn_n.png" width="16" height="16"></img></td><td height="25" colspan="2" bgcolor="#E0E0AD" dir="rtl"><span class="text_black">הגדרות אירוע</span></td><td width="5" height="25"><img src="/static/right_interface/images/tr.png" width="5" height="25" /></td></tr><tr><td width="5" valign="bottom" bgcolor="#5A8EA3"></td><td bgcolor="white" width="70" valign="bottom"><img id="sendOPBtn" align="bottom" src="/static/right_interface/images/save_changes_n.png" alt="שמור שינויים" style="cursor:pointer; padding:5px;"></td><td bgcolor="white" width="5"/><td bgcolor="white"><div id="OcassionsPropMainWindow" style=" margin-top:15; margin-right:15;"/></td><td width="5" valign="bottom" bgcolor="#5A8EA3"></td></tr><tr><td width="5" valign="bottom"><img src="/static/right_interface/images/bl.png" width="5" height="5" /></td><td colspan="3" bgcolor="#5A8EA"></td><td width="5" valign="bottom"><img src="/static/right_interface/images/br.png" width="5" height="5" /></td></tr><tr><td width="5" valign="bottom"></td><td colspan="3" valign="top"><img src="/static/page/images/shadow.png" width="400" height="15" /></td><td width="5" valign="bottom"></td></tr></table></div>';

function createWindow()
{
	$("#OcassionsPropMainWindow").append($('<p align="right" dir="rtl" class="text_14_black">תאריך אירוע:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><input MAXLENGTH=30 type="text" id="ocassion_date_op" value="'+ $("#OccasionDate").text() +'"/></span></p>'));
	$('#ocassion_date_op').datepicker({  minDate: 0, dateFormat: 'dd/mm/yy'});
	$.datepicker.regional['he'] = {
                closeText: 'סגור',
                prevText: '&#x3c;הקודם',
                nextText: 'הבא&#x3e;',
                currentText: 'היום',
                monthNames: ['ינואר','פברואר','מרץ','אפריל','מאי','יוני',
                'יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'],
                monthNamesShort: ['1','2','3','4','5','6',
                '7','8','9','10','11','12'],
                dayNames: ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'],
                dayNamesShort: ['א\'','ב\'','ג\'','ד\'','ה\'','ו\'','שבת'],
                dayNamesMin: ['א\'','ב\'','ג\'','ד\'','ה\'','ו\'','שבת'],
                weekHeader: 'Wk',
                dateFormat: 'dd/mm/yy',
                firstDay: 0,
                isRTL: true,
                showMonthAfterYear: false,
                yearSuffix: ''};
        $.datepicker.setDefaults($.datepicker.regional['he']);	$("#OcassionsPropMainWindow").append($('<p align="right" dir="rtl" class="text_14_black">מקום אירוע:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><input MAXLENGTH=30 type="text" id="ocassion_place_op" value="'+ $("#OccasionPlace").text() +'"/></span></p>'));
	$("#OcassionsPropMainWindow").append($('<p align="right" dir="rtl" class="text_14_black">טלפון:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><input MAXLENGTH=30 type="text" id="ocassion_phone_op" value=" '+ partnersPhoneNumbers +'"/></span></p></br></br>'));
}

$(document).ready(function() { 
 $("#setting").click(function()
 {	
 	//$("body").css("overflow", "hidden");
	var screenVP = getScreenWidthHeight();
	var screenWidth = screenVP[0];
	var screenHeight = screenVP[1];
	
	//creating window
	$("#canvas-div").append($('<div id="OccasionpPropRectangle" class="BlackOverlayRectangle"/>'));
	$("#OccasionpPropRectangle").css('top',0);
	$("#OccasionpPropRectangle").css('left',0);
	$("#OccasionpPropRectangle").css('width',screenWidth);
	$("#OccasionpPropRectangle").css('height',screenHeight);
	$("#OccasionpPropRectangle").draggable( 'disable' );
	$("#canvas-div").append($(frameStringOP));
	$("#OPFrame").css('top',screenHeight / 2 - mainFrameHeightOF / 2);
	$("#OPFrame").css('left',screenWidth / 2 - mainFrameWidthOF / 2);
	$("#OPFrame").css('width',mainFrameWidthOP);
	$("#OPFrame").css('height',mainFrameHeightOP);
	createWindow();
	$("#OPFrame").draggable( 'disable' );
	$("#OcassionPropCloseBtn").bind('click', function() {
		$("#OccasionpPropRectangle").remove();
		$("#OPFrame").remove();
		$("body").css("overflow", "auto");
		});
	$("#OcassionPropCloseBtn").bind('mouseout', function(){
		$(this).attr('src',"/static/canvas/images/close_window_btn_n.png");
	});
	$("#OcassionPropCloseBtn").bind('mouseover', function(){
		$(this).attr('src',"/static/canvas/images/close_window_btn_r.png");
	});
	$("#sendOPBtn").bind('click', function(){
		$.post('/canvas/changeUserProfile/', {date: $('#ocassion_date_op').val(),place: $('#ocassion_place_op').val(),phone: $('#ocassion_phone_op').val()},
				  function(data){
						if (data.status == "OK")
						{
							$("#OccasionDate").text($('#ocassion_date_op').val());
							$("#OccasionPlace").text($('#ocassion_place_op').val());
							partnersPhoneNumbers = $('#ocassion_phone_op').val();
							setSaveStatus("OK");
						}
						else
						{
							setSaveStatus("Error");
						}
						$("#OcassionPropCloseBtn").click();
				}, 'json');
	});
	$("#sendOPBtn").bind('mouseout', function(){
		$(this).attr('src',"/static/right_interface/images/save_changes_n.png");
	});
	$("#sendOPBtn").bind('mouseover', function(){
		$(this).attr('src',"/static/right_interface/images/save_changes_r.png");
	});
	}); 
  });

 
 