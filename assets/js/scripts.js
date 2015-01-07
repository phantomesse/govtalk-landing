$(document).ready(function() {
  sticky_nav();
  $(window).scroll(function() {
    sticky_nav();
  });
});

function sticky_nav() {
  var scroll_top = $(window).scrollTop();
  var nav_height = $('nav').height();

  // Toggle stickiness
  if (scroll_top > $('body').height() - nav_height) {
    if (!$('nav').hasClass('sticky')) {
      $('nav').addClass('sticky');
    }

    // Show the home link
    $('a[href="#home"]').show();
  } else {
    if ($('nav').hasClass('sticky')) {
      $('nav').removeClass('sticky');
    }

    // Hide the home link
    $('a[href="#home"]').hide();
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

// Smooth scrolling
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 500);
        return false;
      }
    }
  });
});