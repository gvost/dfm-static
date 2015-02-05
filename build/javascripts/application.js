/*
      __         __   ___       
|  | |__)   +   |  \ |__   |\/| 
\__/ |__)       |__/ |     |  | 

copyright: 2015
*/


/*

The script animates elements as the page scrolls. To animate any element, add one of these 
classes to the element in the html.

1. scroll-fast, scroll-medium, scroll-slow
  - these classes will move the element up into the window when the user is scrolling down,
  and down into the window when the user is scrolling up

2. scroll-fast-left, scroll-medium-left, scroll-slow-left
  - these classes will slide the element in from the right side of the page when it enters 
  the window (regardless of which direction the user is scrolling)

3. scroll-fast-right, scroll-medium-right, scroll-slow-right
  - these classes will slide the element in from the left side of the page when it enters 
  the window (regardless of which direction the user is scrolling)

Basically, the script works by adding a class called 'move-up', 'move-down', 'move-left', or
'move-right' when the element is outside the window, and removing that class when the element 
enters the window (thus restoring the element to its original position).  

All of the 'scroll' and 'move' classes are defined in stylesheets/_scroller.scss.

*/



$(document).ready(function() {

  // to hold all of the scrollable elements
  var elements = [];

  // for each of the scrollable elements...
  $('.scroll-fast, .scroll-fast-left, .scroll-fast-right, ' + 
    '.scroll-medium, .scroll-medium-left, .scroll-medium-right, ' + 
    '.scroll-slow, .scroll-slow-left, .scroll-slow-right').each(function() {

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
    else
      elem.scrollStyle = 'normal';

    // and add the element to the array
    elements.push(elem);

  });

  // when the page scrolls, animate the elements depending on the scroll speed and style
  $('body').scroll(function(e) {

    for (var i = 0; i < elements.length; i++) {

      switch(elements[i].scrollStyle) {
        case 'normal':
          switch(elementPosition(elements[i])) {
            case 'above':
              elements[i].addClass('move-up');
              break;
            case 'below':
              elements[i].addClass('move-down');
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
              elements[i].addClass('move-right');
              break;
            case 'within':
              elements[i].removeClass('move-right');
              break;
          } 
          break;

        case 'right':
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
      }

    }
  });

  // determines whether the given element is above, below, or within the window
  function elementPosition(elem) {
    if (elem.offset().top + elem.height() < $(window).scrollTop()) {
      return 'above';
    } else if (elem.offset().top > $(window).scrollTop() + $(window).height()) {
      return 'below';
    } else {
      return 'within';
    }
  }

});
/*
      __         __   ___       
|  | |__)   +   |  \ |__   |\/| 
\__/ |__)       |__/ |     |  | 

copyright: 2015
*/


/*

This file contains all of the site JS except the scroller.  The scroller
is included via the require _scroller directive below.

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
  var new_width, c_width = $cover.width();
  images.each(function(index) {
    $(this).load(function() {
      new_width = ((index + 1) * (c_width / image_count));

      $cover.animate({
        "left": new_width + 'px'
      }, 500);
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

    initAutoClick();
  });

  // right clicks
  $('#right-button').click(function() {
    var i = $slider.find('.active').index();
    var next_slide = (i + 1) % $slides.length;

    $slides.eq(i).removeClass('active').fadeOut(300);
    $slides.eq(next_slide).addClass('active').fadeIn(300);

    initAutoClick();
  });

  function initAutoClick() {
    // auto-switch slides every 6 seconds
    /*clearInterval(blurbTimer);
    blurbTimer = setInterval(function() {
      $('#right-button').trigger('click');
    }, 6000);*/
  }

  // stop the timer whenever a link is clicked
  $("a").click(function() {
    clearInterval(blurbTimer);
  });

  // start the auto-switch
  initAutoClick();

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

    // if the current page has a content section...
    if ($content.length) {

      // move the top-background and insert outline
      // 0.1 and 0.3 control the relative speeds of the background and insert-outline
      // -100 is the initial 'top' of the insert-outline
      var scrolled = $content.offset().top;
      var initHeight = $(".top-background").height();
      $('.top-background').css('top', ((scrolled - initHeight) * 0.1) + 'px');
      $('.top-insert-outline').css('top', (-100 + ((scrolled - initHeight) * 0.3)) + 'px');
      
      // display / hide the top-background image 
      // depending on how far we've scrolled
      if (scrolled < 0) {
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

    // clear any previous error messages
    $(".form-error").removeClass("form-error");
    $("#server-response").text("");

    // check each required field for blankness
    var formGood = true;
    $(".required").each(function() {
      if ($(this).val() == "") {
        $(this).addClass("form-error");
        formGood = false;
      }
    });

    // if any are blank, start over
    if (!formGood) {
      $("#server-response").text("Please fill in all required fields.");
      return false;
    }

    // otherwise, send the form info to the server
    var info = { 
      firstname:   $("#contact-first-name").val(),
      lastname:    $("#contact-last-name").val(),
      email:       $("#contact-email").val(), 
      phone:       $("#contact-phone").val(),
      project:     $("#contact-project").val(),
      //find:        $("#contact-find-us").val(),
      nr:          $("#nr").val(),
    };

    $("#server-response").text("Sending message...");

    $.ajax({
      type:  'get',
      url:   '/php/contact_submit.php',
      data:  info,
      success: function(response) {
        $("#server-response").text(response);         
      }
    }); 

  });

});
