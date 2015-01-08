$(document).ready(function() {
  // Sticky nav
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

  // Hide the find representatives button
  $('#find-representatives-button').hide();

  // Load the fake people
  load_users();
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

function load_users() {
  $.get('data/users.json', function(data) {
    data = $.parseJSON(data);

    // Handle find representatives query
    handle_find_representatives(data);

    // Fill the leaderboard
    fill_leaderboard(data);

    // Add trending questions
    add_trending_questions(data);
  });
}

function handle_find_representatives(user_data) {
  // Show find representatives button if there is a 5 digit zip code in the input
  $('#find-representatives-input').on('keyup', function() {
    var zip_code = $(this).val();
    if (zip_code.length === 5 && !isNaN(zip_code)) {
      $('#find-representatives-button').show();
    } else {
      $('#find-representatives-button').hide();
    }
  });

  // Find some fake representatives!
  $('#find-representatives-form').on('submit', function(e) {
    e.preventDefault();
    $('#find-representatives-results').empty();
    var zip_code = $('#find-representatives-input').val();
    $.ajax({
      url: 'http://zip.getziptastic.com/v2/US/' + zip_code,
      success: function(response) {
        var location = response.city + ', ' + response.state_short;
        var chosen_indices = [];
        for (var i = 0; i < 3; i++) {
          var random_index = Math.floor(Math.random() * user_data.length);
          while ($.inArray(random_index, chosen_indices) > -1) {
            random_index = Math.floor(Math.random() * user_data.length);
          }
          chosen_indices.push(random_index);
          var politician = user_data[random_index];

          var politician_div = $('<div>')
            .addClass('politician')
            .appendTo('#find-representatives-results');
          $('<div>')
            .addClass('politician-image')
            .css('background-image', 'url(\'assets/images/avatars/' + politician.avatar + '\')')
            .appendTo(politician_div);
          $('<p>')
            .addClass('politician-name')
            .text(politician.name)
            .appendTo(politician_div);
          $('<div>')
            .addClass('politician-location')
            .text(location)
            .appendTo(politician_div);
        }
      }
    });
  });
}

function fill_leaderboard(user_data) {
  var chosen_indices = [];
  for (var i = 0; i < 3; i++) {
    var random_index = Math.floor(Math.random() * user_data.length);
    while ($.inArray(random_index, chosen_indices) > -1) {
      random_index = Math.floor(Math.random() * user_data.length);
    }
    chosen_indices.push(random_index);
    var politician = user_data[random_index];
    add_politician_to_leaderboard(politician, '#leaderboard-week');
  }

  chosen_indices = [];
  for (i = 0; i < 3; i++) {
    var random_index = Math.floor(Math.random() * user_data.length);
    while ($.inArray(random_index, chosen_indices) > -1) {
      random_index = Math.floor(Math.random() * user_data.length);
    }
    chosen_indices.push(random_index);
    var politician = user_data[random_index];
    add_politician_to_leaderboard(politician, '#leaderboard-month');
  }

  function add_politician_to_leaderboard(politician, leaderboard) {
    var politician_div = $('<div>')
      .addClass('leaderboard-politician')
      .appendTo(leaderboard);
    $('<div>')
      .addClass('politician-image')
      .css('background-image', 'url(\'assets/images/avatars/' + politician.avatar + '\')')
      .appendTo(politician_div);
    $('<p>')
      .addClass('politician-name')
      .text(politician.name)
      .appendTo(politician_div);
  }
}

function add_trending_questions(user_data) {
  $.get('/data/questions.json', function(question_data) {
    question_data = $.parseJSON(question_data);

    var chosen_indices = [];
    var use_on_question_page_index = Math.floor(Math.random() * question_data.length);
    for (var i = 0; i < question_data.length; i++) {
      var question = question_data[i];
      var random_index = Math.floor(Math.random() * user_data.length);
      while ($.inArray(random_index, chosen_indices) > -1) {
        random_index = Math.floor(Math.random() * user_data.length);
      }
      chosen_indices.push(random_index);
      var politician = user_data[random_index];

      random_index = Math.floor(Math.random() * user_data.length);
      while ($.inArray(random_index, chosen_indices) > -1) {
        random_index = Math.floor(Math.random() * user_data.length);
      }
      chosen_indices.push(random_index);
      var user = user_data[random_index];

      add_trending_question(question, politician, user, i === use_on_question_page_index);
    }
  });

  function add_trending_question(question, politician, user, use_on_question_page) {
    var question_div = $('<div>')
      .addClass('question');

    // Pick a random time before now
    var question_time = moment()
      .subtract(Math.floor(Math.random() * 7), 'days')
      .subtract(Math.floor(Math.random() * 24), 'hours')
      .subtract(Math.floor(Math.random() * 60), 'minutes');
    $('<time>')
      .text(question_time.format("MMM D, YYYY @ h:mma"))
      .appendTo(question_div);

    // Add the politician name and the user name
    $('<h3>')
      .html('<b>' + user.name + '</b> asked <b>' + politician.name + '</b>:')
      .appendTo(question_div);

    // Add the voting
    var voting_score = Math.floor(Math.random() * 500) + 100;
    var voting_div = $('<div>')
      .addClass('question-voting')
      .appendTo(question_div);

    var voting_up = $('<div>')
      .addClass('question-voting-up')
      .appendTo(voting_div);

    var voting_score_p = $('<p>')
      .addClass('question-voting-score')
      .text(voting_score)
      .appendTo(voting_div);

    var voting_down = $('<div>')
      .addClass('question-voting-down')
      .appendTo(voting_div);

    voting_up.on('click', function() {
      var current_score = parseInt(voting_score_p.text());
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        voting_score_p.text(current_score - 1);
      } else {
        $(this).addClass('active');
        if (voting_down.hasClass('active')) {
          voting_down.removeClass('active');
          voting_score_p.text(current_score + 2);
        } else {
          voting_score_p.text(current_score + 1);
        }
      }
    });
    voting_down.on('click', function() {
      var current_score = parseInt(voting_score_p.text());
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        voting_score_p.text(current_score + 1);
      } else {
        $(this).addClass('active');
        if (voting_up.hasClass('active')) {
          voting_up.removeClass('active');
          voting_score_p.text(current_score - 2);
        } else {
          voting_score_p.text(current_score - 1);
        }
      }
    });

    // Add the avatars
    var avatars_div = $('<div>')
      .addClass('question-avatars')
      .appendTo(question_div);
    $('<div>')
      .addClass('question-politician-avatar')
      .css('background-image', 'url(\'assets/images/avatars/' + politician.avatar + '\')')
      .appendTo(avatars_div);
    $('<div>')
      .addClass('question-user-avatar')
      .css('background-image', 'url(\'assets/images/avatars/' + user.avatar + '\')')
      .appendTo(avatars_div);

    // Add the question content
    $('<div>')
      .addClass('question-content')
      .html('<p>' + question.question + '</p>')
      .appendTo(question_div);

    // Add this question to the question page
    if (use_on_question_page) {
      // Add flag question button
      $('<button>')
        .addClass('question-button question-flag')
        .text('Flag / Report')
        .appendTo(question_div)
        .on('click', function() {
          $(this).text('Thank you! A moderator will review this question as soon as possible.');
        });

      // Add question to question page
      question_div.prependTo('#mock-question-page .mock-inner');

      // Create the answer div
      var answer_div = $('<div>')
        .addClass('answer')
        .insertAfter(question_div);

      // Set a time for the answer
      var answer_time = question_time
        .add(Math.floor(Math.random() * 24), 'hours')
        .add(Math.floor(Math.random() * 60), 'minutes');
      $('<time>')
        .text(question_time.format("MMM D, YYYY @ h:mma"))
        .appendTo(answer_div);

      // Add the politician's name and avatar
      $('<h3>')
        .html('<b>' + politician.name + '</b> answered:')
        .appendTo(answer_div);
      $('<div>')
        .addClass('answer-avatar')
        .css('background-image', 'url(\'assets/images/avatars/' + politician.avatar + '\')')
        .appendTo(answer_div);

      // Add the answer content
      $('<div>')
        .addClass('answer-content')
        .html('<p>' + question.answer + '</p>')
        .appendTo(answer_div);

      // Let the comments commence!
      var last_comment_time = answer_time;
      for (var i = 0; i < question.comments.length; i++) {
        var comment_content = question.comments[i];
        var comment_time = last_comment_time
          .add(Math.floor(Math.random() * 120), 'minutes');
        var comment_user = user_data[Math.floor(Math.random() * user_data.length)];
        add_comment(comment_content, comment_user, comment_time);
      }

      function add_comment(comment_content, comment_user, comment_time) {
        var comment_div = $('<div>')
          .addClass('comment')
          .insertBefore('#comment-form');

        $('<time>')
          .text(comment_time.format("MMM D, YYYY @ h:mma"))
          .appendTo(comment_div);

        $('<h3>')
          .html('<b>' + comment_user.name + '</b> commented:')
          .appendTo(comment_div);

        $('<div>')
          .addClass('comment-avatar')
          .css('background-image', 'url(\'assets/images/avatars/' + comment_user.avatar + '\')')
          .appendTo(comment_div);

        $('<div>')
          .addClass('comment-content')
          .html('<p>' + comment_content + '</p>')
          .appendTo(comment_div);
      }

      // Set the asking user as the user of the questions page
      $('.user-avatar').css('background-image', 'url(\'assets/images/avatars/' + user.avatar + '\')')

      // Handle making a comment
      $('#comment-button').hide();
      $('#comment-textarea').on('keyup', function() {
        if ($(this).val().length > 0) {
          if ($('#comment-button').is(':hidden')) {
            $('#comment-button').fadeIn();
          }
        } else {
          $('#comment-button').hide();
        }
      });
      $('#comment-form').on('submit', function(e) {
        e.preventDefault();
        var now = moment();
        add_comment($('#comment-textarea').val(), user, now);
        $('#comment-textarea').val('');
      });
    } else {
      // Add view question button
      $('<button>')
        .addClass('question-button')
        .text('View Question')
        .appendTo(question_div);

      // Add question to trending questions
      question_div.appendTo('#mock-trending-questions');
    }
  }
}