main = {}

/* METHODS */
main.writeExperimentData = function(input) {
  console.log(input);
  // $.ajax({
  //     type: "POST",
  //     url: "/experiment-data",
  //     data: input,
  //     contentType: "application/json"
  //   }).fail(function () {
  //     alert("Error! Please contact the researcher.");
  //     window.location.href = "repeat";
  //   });
}

/* CONSTANTS */
main.VIEW_TIME = 5000
main.CONVERTER = new showdown.Converter()
main.CONVERTER.setOption('tables', true);

/* PARTICIPANT SETUP */
main.identifier = {
  participantID: jsPsych.randomization.randomID(),
  condition: Math.round(Math.random()) ? 'sequential' : 'instant'
};

/* TIMELINE ELEMENTS */
main.blocks = {}
main.blocks.consentPage = { //Link the consent page here
  type: 'survey-multi-choice',
  preamble: main.CONVERTER.makeHtml(pages.consentPage),
  questions: [
    {
      prompt: '<b>Do you understand and consent to these terms?</b>',
      options: [
        ' I consent to participate ',
        ' I do not consent to participate '
      ],
      required: true
    }
  ],
  on_finish: function (data) {
    var responses = JSON.parse(data.responses);
    if (responses.Q0.includes('not')) {
      jsPsych.endExperiment(main.CONVERTER.makeHtml(pages.noConsentPage));
    }
  }
};

main.blocks.initialDataBuffer = {
  type: 'call-function',
  func: function () {
    main.writeExperimentData(JSON.stringify({
      responseType: 'start',
      participantID: main.identifier.participantID,
      conditionNumber: main.identifier.condition
    }));
  }
};

main.blocks.generalInstructions = {
  type: 'instructions',
  pages: [
      main.CONVERTER.makeHtml(pages.generalInstructionsPage1),
      main.CONVERTER.makeHtml(pages.generalInstructionsPage2)
    ],
  show_clickable_nav: true
};

main.blocks.trials = {
  type: 'html-keyboard-response',
  choices: jsPsych.NO_KEYS,
  trial_duration: main.VIEW_TIME,
  timeline: (
    main.identifier.condition === 'sequential' ?
      stimuli.sequential :
      stimuli.instant
    ).map(function(letters){
      return {
        stimulus: '<div class="anagram">' + letters + '</div>'
      };
    })
};

main.blocks.solution = {
  type: 'survey-text',
  questions: [{
    prompt: '<h1>Some Questions</h1><p>If you figured out the anagram, please enter your solution below.</p>',
    columns: 50,
    name: 'solution'
  }],
  randomize_order: false
};

main.blocks.surveyData = {
  type: 'survey-likert',
  questions: [
    {
      prompt: '<h1>Some Questions</h1><p>Please rate your pleasantness on a scale of 1-7</p>',
      labels: ['very unpleasant', '', '', '', '', '', 'very pleasant'],
      name: 'pleasantness',
      required: true
    },
    {
      prompt: '<p>An <em>Aha! moment</em> is when the solution suddenly dawns on you and everything is clear immediately. In a flash. As an example, imagine a light bulb that is switched on all at once in contrast to slowly turning up the lights.</p><p>Did you experience an <em>Aha! moment</em> (on a scale of 1-7) after the last anagram was shown to you?</p>',
      labels: ['no, not at all', '', '', '', '', '', 'yes, very high Aha!'],
      name: 'aha',
      required: true
    },
  ],
  randomize_order: false
};


main.blocks.finalDataBuffer = {
  type: 'call-function',
  func: function () {
    main.writeExperimentData(jsPsych.data.get().json());
  },
  on_finish: function (data) {
    jsPsych.endExperiment(main.CONVERTER.makeHtml(pages.thankYouPage));
  }
};

/* RUN EXPERIMENT */

jsPsych.data.addProperties({
  responseType: 'finish',
  participantID: main.identifier.participantID,
  conditionNumber: main.identifier.condition
});

jsPsych.init({
  timeline: [
    main.blocks.consentPage,
    main.blocks.initialDataBuffer,
    main.blocks.generalInstructions,
    main.blocks.trials,
    main.blocks.surveyData,
    main.blocks.solution,
    main.blocks.finalDataBuffer
  ]
});
