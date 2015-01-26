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
