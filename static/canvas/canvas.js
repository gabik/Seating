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
  $("#people_list > li").draggable({
    //snap: true,
    //snapMode: 'inner',
    start: function (e, ui){
      $(this).css("list-style-image", 'url("http://www.veryicon.com/icon/preview/Movie%20&%20TV/Super%20Heroes/Spider%20man%20Icon.jpg")');
      $(this).fadeTo(200, 0.3);
      $("#SaveStatImg").attr("src", "http://careers.physicstoday.org/pics/icons/gma_red_50/js_saved_jobs.gif");
    },
    stop: function (e, ui) {
      $(this).fadeTo(200, 1.0);
      for(i=0;i<imgs.length;i++)
      {
        if (imgs[i].id.split("-", 1) == "long_square" || imgs[i].id.split("-", 1) == "round_pink") {
          alert("imgs[i].id, imgs[i].position().left, .position().top");
        }
      }
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
  $(".MenuItem").click( function() {
    $('ul.AddMenu').hide('medium');
    $.post('/canvas/add/', {kind: $(this).context.id},
      function(data){
        if (data.status == 'OK')
        { location.reload(); }
      }, 'json');
  });
  $(document).keypress(function(e) {
    $(".DelDiv").click();
  });

  $(document).click( function(e) {
    if (!($(e.target).hasClass('ElemImg'))) {
      if (SelectedElem != "" ) {
        SelectedElem.border('0px white 0');
        SelectedElem = "";
      }
    }
  });
});

