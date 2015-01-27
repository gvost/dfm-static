/*
      __         __   ___       
|  | |__)   +   |  \ |__   |\/| 
\__/ |__)       |__/ |     |  | 

copyright: 2015
*/


$(window).load(function() {

  console.log('♥︎ upstartBureau');
  
  ////////// ANIMATE PAGE LOADS ///////////

  // remove cover and temp images
  $("#cover").remove();
  $(".temp-image").remove();

  // make the header full opacity and slide away the loading page
  $("#header").css("opacity", "1");
  $("#loading-page").animate({
    'left': '100%',
    'right': '-100%',
    'opacity': '0.5'
  }, 500, function() {
    $(this).remove();
  });

});


$(document).ready(function() {

  //////////// LOAD RANDOM CANDLE IMAGE ///////////

  var img_classes = [
    'candle-smoke',
    'candle-flame'
  ];
  var img_class = img_classes[Math.floor(Math.random() * img_classes.length)];
  $('.feature-image').addClass(img_class);

  ///////////// ANIMATE LOADING BAR ///////////////

  // collect the background images
  var back_images = $('*').filter(function() {
    return $(this).css("background-image") != "none";
  });

  // add all of them to hidden divs
  back_images.each(function() {
    var url = $(this).css("background-image").replace("url(", "").replace(")", "");
    $("body").append('<img class="temp-image" src="' + url + '" style="display:none;">');
  });

  // collect all images (both the new hidden ones and the ones with original 'img' tags)
  var images = $("img");
  var image_count = images.length;

  // cover and lighten the header
  var $cover = $('<div id="cover">').css({
    "background-color": "white",
    "position": "absolute",
    "top": "0",
    "bottom": "0",
    "right": "0",
    "left": "0"
  });
  $("#header").append($cover).css("background-color", "black").css("opacity", "0.5");

  // remove the cover as images are loaded
  var c_width = $cover.width();
  var i = 0, new_width;
  images.each(function() {
    $(this).load(function() {
      new_width = ((i + 1) * (c_width / image_count));

      $cover.animate({
        "left": new_width + 'px'
      }, 500);

      i++;
    });
  });

  /////////// SHOW/HIDE THE NAV PAGE //////////

  $("#nav-toggle").click(function() {
    
    var $nav_page = $("#nav-page");

    if ($nav_page.css("left") != "0px") {

      $nav_page.animate({
        left: 0,
        opacity: 1
      }, {
        duration: 300,
        easing: 'easeInOutCubic'
      });

      setTimeout(function(){
        $("#nav-toggle").text("Close");
      }, 300);
      
      // prevent scrolling in the background when nav is open
      $("body").css("overflow", "hidden");

    } else {

      $nav_page.animate({
        left: "100%",
        opacity: 0
      }, {
        duration: 600,
        easing: 'easeInOutCubic'
      });

      setTimeout(function(){
        $("#nav-toggle").text("Explore");
      }, 600);

      // restore scrolling
      $("body").css("overflow", "auto"); 
    }
  });

  ////////// HOME PAGE HOVER STATES ///////////

  var fading;
  $(".hover").hover(function() {
    if (!fading) {
      $(this).children(".image").fadeOut(300);
      fading = true;
    }
  }, function() {
    $(this).children(".image").fadeIn(300);
    fading = false;
  });

  /////////// HOME PAGE ABOUT-BLURB SLIDER ///////////////

  var $slider = $('.slider');
  var $slides = $('.slide');
  var blurbTimer = null;

  // show the first slide
  $slides.first().addClass('active').fadeIn(300);

  // left clicks
  $('#left-button').click(function() {
    var i = $slider.find('.active').index();

    $slides.eq(i).removeClass('active').fadeOut(300);
    $slides.eq(i - 1).addClass('active').fadeIn(300);
  });

  // right clicks
  $('#right-button').click(function() {
    var i = $slider.find('.active').index();
    var next_slide = (i + 1) % $slides.length;

    $slides.eq(i).removeClass('active').fadeOut(300);
    $slides.eq(next_slide).addClass('active').fadeIn(300);
  });

  // auto-switch slides every 6 seconds
  blurbTimer = setInterval(function() {
    $('#right-button').trigger('click');
  }, 6000);

  // stop the timer whenever a link is clicked
  $("a").click(function() {
    clearInterval(blurbTimer);
  });

  /////////// NAV PAGE LINKS ///////////////

  $('.page-links').click(function(e) { 

    var url = $(this).attr('href');

    if (!$(this).hasClass('no-prevent')) {
      e.preventDefault();
    
      $('body').animate({
        'opacity': '0',
        'left': '-100%'
      }, 300, 'easeOutQuad');

      setTimeout(function() {
        window.location = url;
      }, 300);  
    }
  });

  ////////// HOME ICON CLICK ON ALL PAGES /////////////
  
  $('.to-home').click(function(e) {
    var url = $(this).attr('href');

    e.preventDefault();
    $('body').animate({
      'opacity': '0',
      'left': '100%'
    }, 300, 'easeOutQuad');

    setTimeout(function(){
      window.location = url;
    }, 300);
  });

  //////////////////// PARALLAX  //////////////////

  $('body').scroll(function(e){

    var $content = $(".content");

    if ($content.length) {
      var scrolled = $content.offset().top;
      var topper = scrolled + $(window).height();

      $('.top-background').css('top', ((scrolled * 0.1) - 80) + 'px');
      $('.top-insert-outline').css('top', ((scrolled * 0.3) - 350) + 'px');
      
      if (topper <= $(window).scrollTop()) {
        $('.top-background').css('display', 'none');
        $('.parallax-background').css('display', 'block');
      } else {
        $('.top-background').css('display', 'block');
        $('.parallax-background').css('display', 'none');
      }
    }
    
  });

  ///////////////// CONTACT FORM //////////////////////

  $("#contact-submit").click(function() {

    var info = {
      firstname:   $("#contact-first-name").val(),
      lastname:    $("#contact-last-name").val(),
      email:       $("#contact-email").val(), 
      phone:       $("#contact-phone").val(),
      project:     $("#contact-project").val(),
      find:        $("#contact-find-us").val()
    };

    $("#server-response").text("Sending message...");

    $.ajax({
      type:   'post',
      url:    'http://localhost/DFM/DFM_static/php/contact_submit.php',
      data:   info,
      success: function(response) {
        setTimeout(function() {
          $("#server-response").text(response);         
        }, 500);
      }
    });  
  });
});
/*
 ██████╗██████╗  █████╗ ███████╗████████╗███████╗██████╗     ██████╗ ██╗   ██╗                               
██╔════╝██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗    ██╔══██╗╚██╗ ██╔╝                               
██║     ██████╔╝███████║█████╗     ██║   █████╗  ██║  ██║    ██████╔╝ ╚████╔╝                                
██║     ██╔══██╗██╔══██║██╔══╝     ██║   ██╔══╝  ██║  ██║    ██╔══██╗  ╚██╔╝                                 
╚██████╗██║  ██║██║  ██║██║        ██║   ███████╗██████╔╝    ██████╔╝   ██║                                  
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝        ╚═╝   ╚══════╝╚═════╝     ╚═════╝    ╚═╝                                  
                                                                                                             
██╗   ██╗██████╗ ███████╗████████╗ █████╗ ██████╗ ████████╗██████╗ ██╗   ██╗██████╗ ███████╗ █████╗ ██╗   ██╗
██║   ██║██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗██║   ██║██╔══██╗██╔════╝██╔══██╗██║   ██║
██║   ██║██████╔╝███████╗   ██║   ███████║██████╔╝   ██║   ██████╔╝██║   ██║██████╔╝█████╗  ███████║██║   ██║
██║   ██║██╔═══╝ ╚════██║   ██║   ██╔══██║██╔══██╗   ██║   ██╔══██╗██║   ██║██╔══██╗██╔══╝  ██╔══██║██║   ██║
╚██████╔╝██║     ███████║   ██║   ██║  ██║██║  ██║   ██║   ██████╔╝╚██████╔╝██║  ██║███████╗██║  ██║╚██████╔╝
 ╚═════╝ ╚═╝     ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ 

copyright: 2015
*/

  (function() {

    // when page loads, add all scrollable elements to the array
    var elements = [];
    $('.scroll-fast, .scroll-fast-left, .scroll-fast-right, ' + 
      '.scroll-medium, .scroll-medium-left, .scroll-medium-right, ' + 
      '.scroll-slow, .scroll-slow-left, .scroll-slow-right, ' + 
      '.scroll-fast-down, .scroll-medium-down, .scroll-slow-down').each(function() {

      var elem = $(this);

      // set the scrollStyle property of the element
      if (elem.hasClass('scroll-fast-left') || 
          elem.hasClass('scroll-medium-left') ||
          elem.hasClass('scroll-slow-left'))
        elem.scrollStyle = 'left';
      else if (elem.hasClass('scroll-fast-right') || 
               elem.hasClass('scroll-medium-right') ||
               elem.hasClass('scroll-slow-right'))
        elem.scrollStyle = 'right';
      else if (elem.hasClass('scroll-fast-down') || 
               elem.hasClass('scroll-medium-down') ||
               elem.hasClass('scroll-slow-down'))
        elem.scrollStyle = 'down';
      else
        elem.scrollStyle = 'normal';

      // add it to the array
      elements.push(elem);
    });

    function elementPosition(elem) {
      if (elem.offset().top + elem.height() < $(window).scrollTop() - 100) {
        return 'above';
      } else if (elem.offset().top > $(window).scrollTop() + $(window).height() /*- 100*/) {
        return 'below';
      } else {
        return 'within';
      }
    }

    // when the page scrolls, animate the elements depending on the scroll speed and style
    $('body').scroll(function(e) {
      for (var i = 0; i < elements.length; i++) {

        switch(elements[i].scrollStyle) {

          case 'normal':
            switch(elementPosition(elements[i])) {
              case 'above':
                elements[i].addClass('move-down');
                break;
              case 'below':
                elements[i].addClass('move-up');
                break;
              case 'within':
                elements[i].removeClass('move-down').removeClass('move-up');
                break;
            }   
            break; 

          case 'left':
            switch(elementPosition(elements[i])) {
              case 'above': 
              case 'below':
                elements[i].addClass('move-left');
                break;
              case 'within':
                elements[i].removeClass('move-left');
                break;
            } 
            break;

          case 'right':
            switch(elementPosition(elements[i])) {
              case 'above':
              case 'below':
                elements[i].addClass('move-right');
                break;
              case 'within':
                elements[i].removeClass('move-right');
                break;
            } 
            break; 

          case 'down':
            switch(elementPosition(elements[i])) {
              case 'above':
              case 'below':
                elements[i].addClass('move-down');
                break;
              case 'within':
                elements[i].removeClass('move-down');
                break;
            } 
            break; 

        }

      }
    });

  })();
