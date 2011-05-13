var SelectedElem = "" ;
var SelectedPerson = "" ;
var startDradPosition = "";
var undoElement = new Array(2);//[element,operation]

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
       $.post('/canvas/save/', {elem_num: element.context.id, X: element.position().left , Y: element.position().top ,caption: "" ,size: ""},
         function(data){
           if (data.status == 'OK')
           {
             $("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
           }else{
             $("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
           }
         }, 'json');
}


function saveElementWithCaption(element,newCaption, newSize)
{
       var elementCaption = element.context.getElementsByTagName("p");
	   
	   if (parseInt(elementCaption[1].firstChild.nodeValue.split("/", 1)) > parseInt(newSize))
	   {
           alert("Size is less then the minmum");
	   }
	   else
	   {
		   $.post('/canvas/save/', {elem_num: element.context.id, X: element.position().left , Y: element.position().top ,caption: newCaption, size: newSize},
			 function(data){
			   if (data.status == 'OK')
			   {
				 elementCaption[0].innerHTML = newCaption;
				 var sizeStr = elementCaption[1].firstChild.nodeValue.split("/", 1) + "/" + newSize;
				 elementCaption[1].innerHTML = sizeStr;
				 reloadElementStatus(element);
				 $("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
			   }else{
				 $("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
			   }
			 }, 'json');
		 }
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

function reloadElementStatus(element)
{
	var elementCaption = element.context.getElementsByTagName("p");
	var elementImgs = element.context.getElementsByTagName("img");
	var elementSize = elementCaption[1].firstChild.nodeValue.split("/", 1);
	var elementMaxSize = elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1);
	
	if (elementSize == 0)
	{
		$("#" + elementImgs[1].id).attr("src", "/static/canvas/images/RedStatus.png");
	}
	else if (elementSize == elementMaxSize)
	{
		$("#" + elementImgs[1].id).attr("src", "/static/canvas/images/GreenStatus.png");
	}
	else
	{
		$("#" + elementImgs[1].id).attr("src", "/static/canvas/images/YellowStatus.png");
	}
}

$(document).ready(function() {
  var imgs,i;
  var numOfElementsComboBox = document.getElementById("numOfElementsComboBox");
  imgs = document.getElementsByTagName('img');

  for(i=0;i<imgs.length;i++)
  {
    if (imgs[i].id.split("-", 1) == "long_square") {
      document.getElementById(imgs[i].id).src = "/static/canvas/images/TableSquare.jpg";
    } else if (imgs[i].id.split("-", 1) == "round_pink") {
      document.getElementById(imgs[i].id).src = "/static/canvas/images/RoundPink.jpg";
    } else if (imgs[i].id.split("-", 1) == "null_square") {
      document.getElementById(imgs[i].id).src = "/static/canvas/images/rect.png";
    } else if (imgs[i].id.split("-", 1) == "null_ellipse") {
      document.getElementById(imgs[i].id).src = "/static/canvas/images/ellipse.png";
    } else if (imgs[i].id.split("-", 1) == "null_line") {
      document.getElementById(imgs[i].id).src = "/static/canvas/images/line.png";
    }else if (imgs[i].id.split("-", 1) == "Statusnull_line" || imgs[i].id.split("-", 1) == "Statusnull_ellipse" || imgs[i].id.split("-", 1) == "Statusnull_square") {
       document.getElementById(imgs[i].id).style.visibility = "hidden";
    }
  }
  $(".DragDiv").after(function() {
     reloadElementStatus($(this));
  });
  $(".DragDiv").click( function() {
     selectElement($(this));
  });
  $(".DragDiv").draggable({
     containment: 'parent',
     start: function (e,ui){
       $(this).fadeTo(200, 0.3);
       startDradPosition = $(this).position();
       $Draged = "";
       $("#SaveStatImg").attr("src", "http://careers.physicstoday.org/pics/icons/gma_red_50/js_saved_jobs.gif");
     },
     stop: function (e,ui){
       $(this).fadeTo(200, 1.0);
       undoElement[0] = $(this);
       undoElement[1] = "move";
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
  })
  $(".DragDiv").droppable({
    drop: function(e, ui ) {
      if ($Draged != "")
      {
      $last_drag = "OK";
	  var elementCaption = $(this).context.getElementsByTagName("p");
	  var elementImgs = $(this).context.getElementsByTagName("img");
      $.post('/canvas/sit/', {table_id: $(this).context.id, person_id: $Draged.context.id},
        function(data){
          if (data.status == 'OK')
          {
            $Draged.hide();
            $("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
			if (data.table_status == 'Yellow')
			{
				$("#" + elementImgs[1].id).attr("src", "/static/canvas/images/YellowStatus.png");
			}
			else if (data.table_status == 'Green')
			{
				$("#" + elementImgs[1].id).attr("src", "/static/canvas/images/GreenStatus.png");
			}
			var elementSize = elementCaption[1].firstChild.nodeValue.split("/", 1);
			var elementMaxSize = elementCaption[1].firstChild.nodeValue.substr(elementCaption[1].firstChild.nodeValue.indexOf("/")+1);
			
			elementSize = parseInt(elementSize) + 1;
			elementCaption[1].innerHTML = elementSize + "/" + elementMaxSize;
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
          { 
              undoElement[0] = SelectedElem;
              undoElement[1] = "add"; 
              location.reload();
          }
        }, 'json');
    } else {
      alert ("Please select table");
    }
  });
  $(".AddDiv").click( function() {
    $('ul.AddMenu').slideToggle('medium');
  });
  $(".UndoDiv").click( function() {
    if (undoElement[0] != "" && undoElement[1] != "")
    {
       switch(undoElement[1])
       {
          case "move":
              {
                var newTop = startDradPosition.top;
                var newLeft = startDradPosition.left;
                startDradPosition = undoElement[0].position();
                undoElement[0].animate({ top: newTop , left: newLeft},300, 'linear', function() { saveElement(undoElement[0]); selectElement(undoElement[0]);});
                break;
              }
          case "add":
              {
                $.post('/canvas/add/', {kind: undoElement[0].context.id ,amount: 1},
                function(data){
                if (data.status == 'OK')
                {
                   undoElement[1] = "delete"; 
                   location.reload();
                }
                }, 'json');
                break;
              }
          case "delete":
          {
              $("#SaveStatImg").attr("src", "http://careers.physicstoday.org/pics/icons/gma_red_50/js_saved_jobs.gif");
              $.post('/canvas/delete/', {elem_num: undoElement[0].context.id},
              function(data){
              if (data.status == 'OK')
              { 
                 undoElement[1] = "add"; 
                 location.reload();
              }
              }, 'json');
              break;
          }
       }
    }
  });
  $("#people_list > li").click(function() {
    $(this).css("background-color",'blue');
	SelectedPerson = $(this);
	var element = $(this);
		$("#people_list > li").each(function(i) {
			if (element.context.id != $(this).context.id)
			{
				$(this).css("background-color",'white');
			}
		});
  });
  $(".DelPersonDiv").click( function() {
    if (SelectedPerson != "")
	{
	   $.post('/canvas/delfp/', {person_id: SelectedPerson.context.id},
       function(data){
         if (data.status == 'OK')
         {
		   SelectedPerson.remove();
           $("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
         }else{
           $("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
         }
		 SelectedPerson = "";
         }, 'json');
	}
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
        {
              location.reload();
        }
      }, 'json');
  });
  $(".MenuItem").click( function() {
    $('ul.AddMenu').hide('medium');
    $.post('/canvas/add/', {kind: $(this).context.id ,amount: numOfElementsComboBox.options[numOfElementsComboBox.selectedIndex].text},
      function(data){
        if (data.status == 'OK')
        {
            undoElement[0] = SelectedElem;
            undoElement[1] = "delete"; 
            location.reload();
        }
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
	var size = $("#ElementSize").val();
    saveElementWithCaption(SelectedElem,caption,size);
    }
  });
  $(document).click( function(e) {
    if (!($(e.target).hasClass('ElemImg'))&&!($(e.target).hasClass('Property'))) {
      if (SelectedElem != "" ) {
        SelectedElem.border('0px white 0');
        SelectedElem = "";
      }
    }
  });
});

