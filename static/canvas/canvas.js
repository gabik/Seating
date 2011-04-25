var SelectedElem = "" ;
var startDradPosition = "";

function getPositions(element)
 {
	var $element = $(element);
	var pos = $element.position();
	var width = $element.width();
	var height = $element.height();

	return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
}

function comparePositions(p1, p2)
{
	var x1 = p1[0] < p2[0] ? p1 : p2;
	var x2 = p1[0] < p2[0] ? p2 : p1;
	return x1[1] > x2[0] || x1[0] === x2[0] ? true : false;
}

//Check if 2 objects intersect
function collisionWithOtherElement(element)
{
	var match = false;
	var pos = getPositions(document.getElementById(element.context.id));
	$(".DragDiv").each(function(i) {
		if (element.context.id != $(this).context.id)
		{
			var pos2 = getPositions(this);
			var horizontalMatch = comparePositions(pos[0], pos2[0]);
			var verticalMatch = comparePositions(pos[1], pos2[1]);
			match = horizontalMatch && verticalMatch;
			if (match)
			{
				return false;
			}
		}
	});
	if (match)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function saveElement(element)
{
       $.post('/canvas/save/', {elem_num: element.context.id, X: element.position().left , Y: element.position().top ,caption: ""},
         function(data){
           if (data.status == 'OK')
           {
             $("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
           }else{
             $("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
           }
         }, 'json');
}

function saveElementWithCaption(element,newCaption)
{
       $.post('/canvas/save/', {elem_num: element.context.id, X: element.position().left , Y: element.position().top ,caption: newCaption},
         function(data){
           if (data.status == 'OK')
           {
             var elementCaption = element.context.getElementsByTagName("p");
             elementCaption[0].innerHTML = newCaption;
             $("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
           }else{
             $("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
           }
         }, 'json');
}

function selectElement(element)
{
    if (SelectedElem != "" ) {
      SelectedElem.border('0px white 0');
    }
    element.border('2px pink .5');
    SelectedElem = element;
	updateElementScreenProperties(element);
}

function updateElementScreenProperties(element)
{
	var elementCaption = element.context.getElementsByTagName("p");
	$("#ElementCaption").attr("value",elementCaption[0].firstChild.nodeValue);
	$("#ElementSize").attr("value",elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1));
}

$(document).ready(function() {
  var imgs,i;
  
  var numOfElementsComboBox = document.getElementById("numOfElementsComboBox");
  imgs = document.getElementsByTagName('img');

  for(i=0;i<imgs.length;i++)
  {
    if (imgs[i].id.split("-", 1) == "long_square") {
      document.getElementById(imgs[i].id).src = "http://www1.free-clipart.net/gallery2/clipart/Household/Miscellaneous/Table_Setting_1.jpg";
    } else if (imgs[i].id.split("-", 1) == "round_pink") {
      document.getElementById(imgs[i].id).src = "http://photos1.fotosearch.com/bthumb/UNC/UNC002/u13738840.jpg";
    } else if (imgs[i].id.split("-", 1) == "null_square") {
      document.getElementById(imgs[i].id).src = "/static/canvas/images/rect.png";
    } else if (imgs[i].id.split("-", 1) == "null_ellipse") {
      document.getElementById(imgs[i].id).src = "/static/canvas/images/ellipse.png";
    } else if (imgs[i].id.split("-", 1) == "null_line") {
      document.getElementById(imgs[i].id).src = "/static/canvas/images/line.png";
    }
  }
  $(".DragDiv").click( function() {
     selectElement($(this));
  });
  $(".DragDiv").draggable({
     start: function (e,ui){
       $(this).fadeTo(200, 0.3);
       startDradPosition = $(this).position();
       $Draged = "";
       $("#SaveStatImg").attr("src", "http://careers.physicstoday.org/pics/icons/gma_red_50/js_saved_jobs.gif");
     },
     stop: function (e,ui){
       $(this).fadeTo(200, 1.0);
       if (collisionWithOtherElement($(this)))
       {
          if (startDradPosition != "")
          {
              var newTop = startDradPosition.top;
              var newLeft = startDradPosition.left;
              $(this).animate({ top: newTop , left: newLeft},300, 'linear', function() { saveElement($(this)); selectElement($(this));});
          }
       }
       else
       {
           saveElement($(this));
       }
       }
  });
  $(".DragDiv").droppable({
    drop: function(e, ui ) {
      if ($Draged != "")
      {
      $last_drag = "OK";
      $.post('/canvas/sit/', {table_id: $(this).context.id, person_id: $Draged.context.id},
        function(data){
          if (data.status == 'OK')
          {
            $Draged.hide();
            $("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
          }else if (data.status == 'FULL')
          {
            $Draged.fadeTo(200, 1.0);
            alert ("Table is full");
          }else{
            $Draged.fadeTo(200, 1.0);
            $("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
          }
        }, 'json');
       }
    }
  });
  $("#people_list > li").draggable({
    //snap: true,
    //snapMode: 'inner',
    helper: 'clone',
    start: function (e, ui){
      //$(this).css("list-style-image", 'url("http://www.veryicon.com/icon/preview/Movie%20&%20TV/Super%20Heroes/Spider%20man%20Icon.jpg")');
      $last_drag = "ER";
      $Draged = $(this);
      $(this).fadeTo(200, 0.3);
      $("#SaveStatImg").attr("src", "http://careers.physicstoday.org/pics/icons/gma_red_50/js_saved_jobs.gif");
    },
    stop: function (e, ui) {
      if ($last_drag != "OK")
      { $(this).fadeTo(200, 1.0); }
      //alert($(this).position().left);
      //alert($(this).position().top);
      //alert($(this).context.id);
    }
  });
  $(".DelDiv").click( function() {
    if (SelectedElem != "" ) {
      $("#SaveStatImg").attr("src", "http://careers.physicstoday.org/pics/icons/gma_red_50/js_saved_jobs.gif");
      $.post('/canvas/delete/', {elem_num: SelectedElem.context.id},
        function(data){
          if (data.status == 'OK')
          { location.reload(); }
        }, 'json');
    } else {
      alert ("Please select table");
    }
  });
  $(".AddDiv").click( function() {
    $('ul.AddMenu').slideToggle('medium');
  });
  $(".AddPersonDiv").click( function() {
    $('ul.AddPerson').slideToggle('medium');
  });
  $("#AddPersonButton").click( function() {
    var first_name = document.getElementById("first_name").value;
    var last_name = document.getElementById("last_name").value;
    $.post('/accounts/add_person/', {first: first_name, last: last_name},
      function(data){
        if (data.status == 'OK')
        { location.reload(); }
      }, 'json');
  });
  $(".MenuItem").click( function() {
    $('ul.AddMenu').hide('medium');
    $.post('/canvas/add/', {kind: $(this).context.id ,amount: numOfElementsComboBox.options[numOfElementsComboBox.selectedIndex].text},
      function(data){
        if (data.status == 'OK')
        { location.reload(); }
      }, 'json');
  });
  $(document).keypress(function(e) {
   var code = (e.keyCode ? e.keyCode : e.which);
   if(code == 46) { //Del keycode
       $(".DelDiv").click();
   }
  });
  $("#ElementPropertiesSaveButton").click( function() { 
  if (SelectedElem != "" ) {
    var caption = $("#ElementCaption").val();
    saveElementWithCaption(SelectedElem,caption);
    }
  });
  $(document).click( function(e) {
    if (!($(e.target).hasClass('ElemImg'))&&!($(e.target).hasId('ElementCaption'))) {
      if (SelectedElem != "" ) {
        SelectedElem.border('0px white 0');
        SelectedElem = "";
      }
    }
  });
});

