/* INITIALIZATION */
// In this experiment people see the puzzle in parts and get the same time before the hint is shown to them, the manipulation being in control we tell them they will get 80 seconds, and in second one we tell them they will get 20 seconds -- they actually get hint reversed in the two cases i.e. faster than what they expected in condition 1 and slower than what they expected in condition 2. Furthermore, before hint is produced in front of people, we give them 10 seconds of thinking time to think about the problem first. 

var main = {
  converter: new showdown.Converter(),
  writeExperimentData: function (input) {
    $.ajax({
      type: "POST",
      url: "/experiment-data",
      data: input,
      contentType: "application/json"
    }).fail(function () {
      alert("Error! Please contact the researcher.");
      window.location.href = "/";
    })
  }
};


/* VARIABLES & PARAMETERS */
main.identifier = {
  participantID: jsPsych.randomization.randomID(),
  conditionNumber: Math.round(Math.random())
};

main.paramters = {
  postInstructionsPause: 0,
  ViewTime: 5000,
  ThinkTime: 10000, 
  controlThinkTime: 20000, //fool people, give them hint after 15 seconds reverse to them thinking it would take 90 seconds
  expThinkTime: 80000  //fool people, give them hint after 90 seconds reverse to them thinking it would take 15 seconds 
};

// people may or maynot be thinking or estimating time to solve the problem/ maybe crowded by the fact we are going to give them a hint. maybe next pilot we give people common 15 seconds to think (so that they have an estimate of time to solve and then tell them, here is another 10 or 60 seconds to think before we give you a hint)


/* TIMELINE ELEMENTS */
// Introduction
main.blocks = {};

main.blocks.consentPage = { //Link the consent page here
  type: 'survey-multi-choice',
  preamble: main.converter.makeHtml(literals.consentPage),
  questions: [
    {
      prompt: 'Do you understand and consent to these terms?',
      options: [
        ' I consent to participate',
        ' I do not consent to participate'
      ],
      required: true
    }
  ],
  on_finish: function (data) {
    var responses = JSON.parse(data.responses);
    if (responses.Q0.includes('not')) {
      jsPsych.endExperiment(main.converter.makeHtml(literals.noConsentPage));
    }
  }
};

main.blocks.initialDataBuffer = {
  type: 'call-function',
  func: function () {
    main.writeExperimentData(JSON.stringify({
      responseType: 'start',
      participantID: main.identifier.participantID,
      conditionNumber: main.identifier.conditionNumber
    }));
  }
};

main.blocks.generalInstructions = {
  type: 'instructions',
  pages: [main.converter.makeHtml(literals.generalInstructionsPage)],
  show_clickable_nav: true,
  post_trial_gap: main.paramters.postInstructionsPause
};

// Experiment
main.blocks.controlTrials = {
  type: 'html-keyboard-response',
  choices: jsPsych.NO_KEYS,
  timeline: [
    {
      stimulus: main.converter.makeHtml(literals.PuzzlePage1),
      choices: ['n']
    },
    {
      stimulus: main.converter.makeHtml(literals.PuzzlePage2),
      choices: ['n']
    },
    {
      stimulus: main.converter.makeHtml(literals.PuzzlePage3),
      trial_duration: main.paramters.ViewTime
    },
    {
      stimulus: main.converter.makeHtml(literals.thinkPage),
      trial_duration: main.paramters.ThinkTime
    },
    {
      stimulus: main.converter.makeHtml(literals.controlPuzzlePage4),
      trial_duration: main.paramters.controlThinkTime
    },
    {
      stimulus: main.converter.makeHtml(literals.hintPage),
      choices: ['n']
    }
  ]
};

main.blocks.experimentalTrials = {
  type: 'html-keyboard-response',
  choices: jsPsych.NO_KEYS,
  timeline: [
    {
      stimulus: main.converter.makeHtml(literals.PuzzlePage1),
      choices: ['n']
    },
    {
      stimulus: main.converter.makeHtml(literals.PuzzlePage2),
      choices: ['n']
    },
    {
      stimulus: main.converter.makeHtml(literals.PuzzlePage3),
      trial_duration: main.paramters.ViewTime
    },
    {
      stimulus: main.converter.makeHtml(literals.thinkPage),
      trial_duration: main.paramters.ThinkTime
    },
    {
      stimulus: main.converter.makeHtml(literals.expPuzzlePage4),
      trial_duration: main.paramters.expThinkTime
    },
    {
      stimulus: main.converter.makeHtml(literals.hintPage),
      choices: ['n']
    }
  ]
};


// Data Collection
/*main.blocks.surveyData = {
  timeline: [
    {
      type: 'html-slider-response',
      stimulus: jsPsych.timelineVariable('question'),
      labels: jsPsych.timelineVariable('extremes')
    }
  ],
  timeline_variables: [
    {
      question: 'Please rate how you felt once you understood the solution ' +
        'to the riddle.',
      extremes: ['', 'Unpleasant', '', '', '', '', 'Pleasant', '']
    },
    {
      question: '<p>An Aha! moment is when the solution suddenly dawns on you ' +
      'and everything is clear immediately.'+' In a flash.'+' As an example, ' +
      'imagine a light bulb that is switched on all at once in contrast to ' +
      'slowly turning up the lights.</p>' + '<p>Please rate your experience of an Aha! moment upon ' +
      'getting the solution to this puzzle. </p>',
      extremes: ['', 'Very Low', '', '', '', '', '', 'Very High', '']
    }
  ],
  randomize_order: true
};*/

main.blocks.surveyData = {
  timeline: [
    {
      type: 'survey-likert',
      questions: [{prompt: jsPsych.timelineVariable('question'), labels: jsPsych.timelineVariable('extremes'), required: true}]
    }
  ],
  timeline_variables: [
    {
      question: 'Did you get the answer?',
      extremes: ['No', 'Yes']
    },
    {
      question: 'Please rate on a scale of 1-7, how you felt once you understood the solution ' +
        'to the riddle.',
      extremes: ['Very unpleasant', '', '', '', '', '', 'Very pleasant']
    },
    {
      question: '<p>An Aha! moment is when the solution suddenly dawns on you ' +
      'and everything is clear immediately.'+' In a flash.'+' As an example, ' +
      'imagine a light bulb that is switched on all at once in contrast to ' +
      'slowly turning up the lights.</p>' + '<p>Please rate on a scale of 1-7, your experience of an Aha! moment upon ' +
      'getting the solution to this puzzle. </p>',
      extremes: ['Very Low', '', '', '', '', '', 'Very High']
    }
  ]//,
  //randomize_order: true
};

main.blocks.finalDataBuffer = {
  type: 'call-function',
  func: function () {
    main.writeExperimentData(jsPsych.data.get().json());
  },
  on_finish: function (data) {
    jsPsych.endExperiment(main.converter.makeHtml(literals.thankYouPage));
  }
};


/* RUN EXPERIMENT */
jsPsych.data.addProperties({
  responseType: 'finish',
  participantID: main.identifier.participantID,
  conditionNumber: main.identifier.conditionNumber
});

jsPsych.init({
  timeline: [
    main.blocks.consentPage,
    main.blocks.initialDataBuffer,
    main.blocks.generalInstructions,

    main.identifier.conditionNumber === 0 ?
      main.blocks.controlTrials :
      main.blocks.experimentalTrials,

    main.blocks.surveyData,
    main.blocks.finalDataBuffer
  ]
});
