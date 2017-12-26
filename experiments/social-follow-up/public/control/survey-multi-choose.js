/**
 * survey-multi-choose
 * a jspsych plugin for multiple choice that forces a particlar number of
 * positive responses from the user out of the total number of questions
 * 
 * this plug takes slightly different trial parameters than the survey-multi-
 * choose, namely:
 * - options: two element list [positive, negetive], which will be the options
 * for all questions (the idea is that these all represent a binary choice)
 * - limit: the total number of postive responses needed to submit
 * 
 * Shane Martin
 * (Modified by Hermish Mehta)
 */


jsPsych.plugins['survey-multi-choose'] = (function() {

  var plugin = {};

  plugin.trial = function(display_element, trial) {

    var plugin_id_name = "jspsych-survey-multi-choice";
    var plugin_id_selector = '#' + plugin_id_name;
    var _join = function( /*args*/ ) {
      var arr = Array.prototype.slice.call(arguments, _join.length);
      return arr.join(separator = '-');
    }

    // trial defaults
    trial.preamble = typeof trial.preamble == 'undefined' ? "" : trial.preamble;
    trial.required = typeof trial.required == 'undefined' ? null : trial.required;
    trial.horizontal = typeof trial.horizontal == 'undefined' ? false : trial.horizontal;

    // MODIFICATION 1:
    // Take only one parameter, and give all questions the same two choices
    var options_list = [];
    for (var i = 0; i < trial.questions.length; i++) {
      options_list.push(trial.options)
    }


    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // form element
    var trial_form_id = _join(plugin_id_name, "form");
    display_element.append($('<form>', {
      "id": trial_form_id
    }));
    var $trial_form = $("#" + trial_form_id);

    // show preamble text
    var preamble_id_name = _join(plugin_id_name, 'preamble');
    $trial_form.append($('<div>', {
      "id": preamble_id_name,
      "class": preamble_id_name
    }));
    $('#' + preamble_id_name).html(trial.preamble);

    // add multiple-choice questions
    for (var i = 0; i < trial.questions.length; i++) {
      // create question container
      var question_classes = [_join(plugin_id_name, 'question')];
      if (trial.horizontal) {
        question_classes.push(_join(plugin_id_name, 'horizontal'));
      }

      $trial_form.append($('<div>', {
        "id": _join(plugin_id_name, i),
        "class": question_classes.join(' ')
      }));

      var question_selector = _join(plugin_id_selector, i);

      // add question text
      $(question_selector).append(
        '<p class="' + plugin_id_name + '-text survey-multi-choice">' + trial.questions[i] + '</p>'
      );

      // create option radio buttons
      for (var j = 0; j < options_list[i].length; j++) {
        var option_id_name = _join(plugin_id_name, "option", i, j),
          option_id_selector = '#' + option_id_name;

        // add radio button container
        $(question_selector).append($('<div>', {
          "id": option_id_name,
          "class": _join(plugin_id_name, 'option')
        }));

        // add label and question text
        var option_label = '<label class="' + plugin_id_name + '-text">' + options_list[i][j] + '</label>';
        $(option_id_selector).append(option_label);

        // create radio button
        var input_id_name = _join(plugin_id_name, 'response', i);
        $(option_id_selector + " label").prepend('<input type="radio" name="' + input_id_name + '" value="' + options_list[i][j] + '">');
      }

      if (trial.required && trial.required[i]) {
        // add "question required" asterisk
        $(question_selector + " p").append("<span class='required'>*</span>")

        // add required property
        $(question_selector + " input:radio").prop("required", true);
      }
    }

    // add submit button
    $trial_form.append($('<input>', {
      'type': 'submit',
      'id': plugin_id_name + '-next',
      'class': plugin_id_name + ' jspsych-btn',
      'value': 'Submit Answers'
    }));

    $trial_form.submit(function(event) {

      // MODIFICATION 2:
      // Count the number of positive responses before submitting
      event.preventDefault();
      var positive = 0;

      // create object to hold responses
      var question_data = {};
      $("div." + plugin_id_name + "-question").each(function(index) {
        var id = "Q" + index;
        var val = $(this).find("input:radio:checked").val();
        var obje = {};
        if (val == trial.options[0]) {
          positive++;
        }
        obje[id] = val;
        $.extend(question_data, obje);
      });

      // MODIFICATION 3:
      // Check for the correct number of positive reponses
      if (positive == trial.limit) {
        // measure response time
        var endTime = (new Date()).getTime();
        var response_time = endTime - startTime;

        // save data
        var trial_data = {
          "rt": response_time,
          "responses": JSON.stringify(question_data)
        };

        display_element.html('');

        // next trial
        jsPsych.finishTrial(trial_data);
      }
    });

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
