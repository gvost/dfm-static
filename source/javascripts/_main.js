
////////// ANIMATE PAGE LOADS ///////////

$(window).load(function(){

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

  ////////////// HOME PAGE LINKS //////////////

  $('.main-links').hover(function(){
    $(this).animate({
      'border-bottom-color': 'rgba(255,255,255,0)',
      'color': 'rgba(255,255,255,0)'
    }).delay(10).animate({
      'color': 'rgba(255,255,255,1)'
    });
  }, function(){
    $(this).animate({
      'border-bottom-color': 'rgba(255,255,255,1)',
    });
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

    e.preventDefault();
    $('body').animate({
      'opacity': '0',
      'left': '-100%'
    }, 300, 'easeOutQuad');

    setTimeout(function() {
      window.location = url;
    }, 300);  
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
      console.log("scrolled = " + scrolled);
      var topper = scrolled + $(window).height();
      console.log("topper = " + topper);

      $('.top-background').css('top', ((scrolled * 0.1) - 80) + 'px');
      
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
      url:    '/contact_submit',
      data:   info,
      success: function(response) {
        setTimeout(function() {
          $("#server-response").text("Thanks, we\'ll be in touch.");         
        }, 1000);
      }
    });  
  });
});