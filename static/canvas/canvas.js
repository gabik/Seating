var SelectedElem = "" ;

$(document).ready(function() {
  var imgs,i;
  imgs=document.getElementsByTagName('img');
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
    if (SelectedElem != "" ) {
      SelectedElem.border('0px white 0');
    }
    $(this).border('2px pink .5');
    SelectedElem = $(this);
  });
  $(".DragDiv").draggable({
     start: function (e,ui){
       $(this).fadeTo(200, 0.3);
       $("#SaveStatImg").attr("src", "http://careers.physicstoday.org/pics/icons/gma_red_50/js_saved_jobs.gif");
     },
     stop: function (e,ui){
       $(this).fadeTo(200, 1.0);
       $.post('/canvas/save/', {elem_num: $(this).context.id, X: $(this).position().left , Y: $(this).position().top },
         function(data){
           if (data.status == 'OK')
           {
             $("#SaveStatImg").attr("src", "http://maemo.nokia.com/userguides/.img/CONNECTIVITY-WLAN-SAVED.jpg");
           }else{
             $("#SaveStatImg").attr("src", "http://www.arco.co.uk/103/images/icons/error.gif");
           }
         }, 'json');
     }
  });
  $(".DragDiv").droppable({
    drop: function(e, ui ) {
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
    $.post('/canvas/add/', {kind: $(this).context.id},
      function(data){
        if (data.status == 'OK')
        { location.reload(); }
      }, 'json');
  });
  //$(document).keypress(function(e) {
    //$(".DelDiv").click();
  //});

  $(document).click( function(e) {
    if (!($(e.target).hasClass('ElemImg'))) {
      if (SelectedElem != "" ) {
        SelectedElem.border('0px white 0');
        SelectedElem = "";
      }
    }
  });
});

