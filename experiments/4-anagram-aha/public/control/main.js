/* INITIALIZATION */
// In this experiment people see anagrams one after another. In condition 1, they see 5 anagrams, first four are hard and the fifth one is easy. In condition 2, they see 5 anagrams, first four are easy and the fifth one is easy. Aha! ratings should be higher for condition 1 (upon solving fifth anagram) as opposed to second condition 2. 

// confound - simple effect of relief over finally solving something vs solving everything so new reward?

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
  ViewTime: 2000
};

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
  pages: [main.converter.makeHtml(literals.generalInstructionsPage), main.converter.makeHtml(literals.generalInstructionsPage2), main.converter.makeHtml(literals.generalInstructionsPage3)],
  show_clickable_nav: true,
  post_trial_gap: main.paramters.postInstructionsPause
};

// Experiment
main.blocks.controlTrials = {
  type: 'html-keyboard-response',
  choices: jsPsych.NO_KEYS,
  timeline: [
    {
      stimulus: main.converter.makeHtml(literals.HardAnagram1),
      trial_duration: main.paramters.ViewTime
    },
    {
      stimulus: main.converter.makeHtml(literals.HardAnagram2),
      trial_duration: main.paramters.ViewTime
    },
    {
      stimulus: main.converter.makeHtml(literals.HardAnagram3),
      trial_duration: main.paramters.ViewTime
    },
    {
      stimulus: main.converter.makeHtml(literals.HardAnagram4),
      trial_duration: main.paramters.ViewTime
    },
    # hint prime should come here
    {
      stimulus: main.converter.makeHtml(literals.TestAnagram),
      trial_duration: main.paramters.ViewTime
    },

  ]
};

main.blocks.experimentalTrials = {
  type: 'html-keyboard-response',
  choices: jsPsych.NO_KEYS,
  timeline: [
    {
      stimulus: main.converter.makeHtml(literals.EasyAnagram1),
      trial_duration: main.paramters.ViewTime
    },
    {
      stimulus: main.converter.makeHtml(literals.EasyAnagram2),
      trial_duration: main.paramters.ViewTime
    },
   {
      stimulus: main.converter.makeHtml(literals.EasyAnagram3),
      trial_duration: main.paramters.ViewTime
    },
    {
      stimulus: main.converter.makeHtml(literals.EasyAnagram4),
      trial_duration: main.paramters.ViewTime
    },
    # Pause should come here
    {
      stimulus: main.converter.makeHtml(literals.TestAnagram),
      trial_duration: main.paramters.ViewTime
    },
    #best to make them write the answer here and discard if they didn't get it
  ]
};

main.blocks.surveyData = {
  timeline: [
    {
      type: 'survey-likert',
      questions: [{prompt: jsPsych.timelineVariable('question'), labels: jsPsych.timelineVariable('extremes'), required: jsPsych.timelineVariable('requireds')}]
    }
  ],
  timeline_variables: [
    {
      question: 'Please rate your pleasantness rating on a scale of 1-7',
      extremes: ['Very unpleasant', '', '', '', '', '', 'Very pleasant'],
      requireds: true
    },
    {
      question: '<p>An Aha! moment is when the solution suddenly dawns on you ' +
      'and everything is clear immediately.'+' In a flash.'+' As an example, ' +
      'imagine a light bulb that is switched on all at once in contrast to ' +
      'slowly turning up the lights.</p>' + '<p>Did you experience an Aha! moment (on a scale of 1-7) ' +
      'after the <b>last</b> anagram was shown to you? </p>',
      extremes: ['No, not at all', '', '', '', '', '', 'Yes, very high aha!'],
      requireds: true
    }
  ],
  randomize_order: false
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
