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
