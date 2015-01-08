$(document).ready(function() {
  sticky_nav();
  $(window).scroll(function() {
    sticky_nav();
  });

  // Smooth scrolling
  $('nav a').click(function() {
    var hash = $(this).attr('href');
    $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 500, function() {
      location.hash = hash;
    });
    return false;
  });
});

function sticky_nav() {
  var scroll_top = $(window).scrollTop();
  var nav_height = $('nav').height();
  var home_link = $('a[href="#home"]');

  // Toggle stickiness
  if (scroll_top > $('body').height() - nav_height) {
    if (!$('nav').hasClass('sticky')) {
      $('nav').addClass('sticky');
    }

    // Show the home link
    if (home_link.is(':hidden')) {
      home_link.show();
    }
  } else {
    if ($('nav').hasClass('sticky')) {
      $('nav').removeClass('sticky');
    }

    // Hide the home link
    if (home_link.is(':visible')) {
      home_link.hide();
    }
  }

  // Toggle color of the nav pointer triangle
  $('nav a.active').removeClass('active');
  $('section').each(function(index) {
    if (scroll_top + nav_height > $(this).offset().top) {
      if (index % 2 === 1) {
        if (!$('nav').hasClass('sticky-blue')) {
          $('nav').addClass('sticky-blue');
        }
      } else {
        if ($('nav').hasClass('sticky-blue')) {
          $('nav').removeClass('sticky-blue');
        }
      }

      // Highlight this section in the nav
      $('nav a.active').removeClass('active');
      $('nav a[href="#' + $(this).attr('id') + '"]').addClass('active');
    }
  });
}
