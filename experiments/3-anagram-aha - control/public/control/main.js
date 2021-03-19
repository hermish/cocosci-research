/* INITIALIZATION */
// In this experiment people see anagrams one after another. In condition 1, they see 5 anagrams, first four are hard and the fifth one is easy. In condition 2, they see 5 anagrams, first four are easy and the fifth one is easy. Aha! ratings should be higher for condition 1 (upon solving fifth anagram) as opposed to second condition 2. 

// to do -- add more anagrams for the three sets (possibly 5 in set 3, 10 in Set 1, 10 in Set 2), ask question on self-reported whether they finished the angram in Set 3.

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
  ViewTime: 11000
};

var q1 = 'Did you solve the last anagram shown to you?'
var q2 = '<p>An Aha! moment is when the solution suddenly dawns on you ' +
      'and everything is clear immediately.'+' In a flash.'+' As an example, ' +
      'imagine a light bulb that is switched on all at once in contrast to ' +
      'slowly turning up the lights.</p>' + '<p>Did you experience an Aha! moment (on a scale of 1-7) ' +
      'after the last anagram was shown to you? </p>'

var scale1 = ['No', 'Yes']
var scale2 = ['No, not at all', '', '', '', '', '', 'Yes, very high aha!']


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
      conditionNumber: main.identifier.conditionNumber,
      anagrams_seen: literals.TestAnagram,
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
      stimulus: main.converter.makeHtml(literals.nextPage),
      choices: ['v']
    },
    {
      stimulus: main.converter.makeHtml(literals.HardAnagram1),
      trial_duration: main.paramters.ViewTime
    },
    {
      type: 'survey-likert',
      questions: [{prompt: q1, labels: scale1, required: true}] 
    },
    {
      type: 'survey-likert',
      questions: [{prompt: q2, labels: scale2, required: true}] 
    },
    {
      stimulus: main.converter.makeHtml(literals.nextPage),
      choices: ['v']
    },
	{
      stimulus: main.converter.makeHtml(literals.HardAnagram2),
      trial_duration: main.paramters.ViewTime
    },
    {
      type: 'survey-likert',
      questions: [{prompt: q1, labels: scale1, required: true}] 
    },
    {
      type: 'survey-likert',
      questions: [{prompt: q2, labels: scale2, required: true}] 
    },
    {
      stimulus: main.converter.makeHtml(literals.nextPage),
      choices: ['v']
    },
    {
      stimulus: main.converter.makeHtml(literals.HardAnagram3),
      trial_duration: main.paramters.ViewTime
    },
    {
      type: 'survey-likert',
      questions: [{prompt: q1, labels: scale1, required: true}] 
    },
    {
      type: 'survey-likert',
      questions: [{prompt: q2, labels: scale2, required: true}] 
    },
    {
      stimulus: main.converter.makeHtml(literals.nextPage),
      choices: ['v']
    },
    {
      stimulus: main.converter.makeHtml(literals.HardAnagram4),
      trial_duration: main.paramters.ViewTime
    },
    {
      type: 'survey-likert',
      questions: [{prompt: q1, labels: scale1, required: true}] 
    },
    {
      type: 'survey-likert',
      questions: [{prompt: q2, labels: scale2, required: true}] 
    },
    {
      stimulus: main.converter.makeHtml(literals.nextPage),
      choices: ['v']
    },
    {
      stimulus: main.converter.makeHtml(literals.TestAnagramHard),
      trial_duration: main.paramters.ViewTime
    },
  ]
};

main.blocks.experimentalTrials = {
  type: 'html-keyboard-response',
  choices: jsPsych.NO_KEYS,
  timeline: [
    {
      stimulus: main.converter.makeHtml(literals.nextPage),
      choices: ['v']
    },
    {
      stimulus: main.converter.makeHtml(literals.HardAnagram1),
      trial_duration: main.paramters.ViewTime
    },
    {
      type: 'survey-likert',
      questions: [{prompt: q1, labels: scale1, required: true}] 
    },
    {
      type: 'survey-likert',
      questions: [{prompt: q2, labels: scale2, required: true}] 
    },
    {
      stimulus: main.converter.makeHtml(literals.nextPage),
      choices: ['v']
    },
    {
      stimulus: main.converter.makeHtml(literals.HardAnagram2),
      trial_duration: main.paramters.ViewTime
    },
    {
      type: 'survey-likert',
      questions: [{prompt: q1, labels: scale1, required: true}] 
    },
    {
      type: 'survey-likert',
      questions: [{prompt: q2, labels: scale2, required: true}] 
    },
    {
      stimulus: main.converter.makeHtml(literals.nextPage),
      choices: ['v']
    },
    {
      stimulus: main.converter.makeHtml(literals.HardAnagram3),
      trial_duration: main.paramters.ViewTime
    },
    {
      type: 'survey-likert',
      questions: [{prompt: q1, labels: scale1, required: true}] 
    },
    {
      type: 'survey-likert',
      questions: [{prompt: q2, labels: scale2, required: true}] 
    },
    {
      stimulus: main.converter.makeHtml(literals.nextPage),
      choices: ['v']
    },
    {
      stimulus: main.converter.makeHtml(literals.HardAnagram4),
      trial_duration: main.paramters.ViewTime
    },
    {
      type: 'survey-likert',
      questions: [{prompt: q1, labels: scale1, required: true}] 
    },
    {
      type: 'survey-likert',
      questions: [{prompt: q2, labels: scale2, required: true}] 
    },
    {
      stimulus: main.converter.makeHtml(literals.nextPage),
      choices: ['v']
    },
    {
      stimulus: main.converter.makeHtml(literals.TestAnagramEasy),
      trial_duration: main.paramters.ViewTime
    },
 
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
      question: 'Did you solve the last anagram shown to you?',
      extremes: ['No', 'Yes'],
      requireds: true
    },
    {
      question: '<p>An Aha! moment is when the solution suddenly dawns on you ' +
      'and everything is clear immediately.'+' In a flash.'+' As an example, ' +
      'imagine a light bulb that is switched on all at once in contrast to ' +
      'slowly turning up the lights.</p>' + '<p>Did you experience an Aha! moment (on a scale of 1-7) ' +
      'after the last anagram was shown to you? </p>',
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
