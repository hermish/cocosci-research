// In this experiment people will be flashed a sequence of anagram and will give their warmth ratings after each flash. The hypothesis is that people's warmth rating will increase suddenly in the sudden condition and people's warmth rating will increase gradually in the sequence condition. This in turn, will be reflected in their meta-cognitive reward i.e. aha -- aha should be higher in the instant condition vs. sequence condition. The key will be ensuring gradual increase of warmth in one condition and sudden increase of warmth in the other -- if that happens, we should be able to get the desired effect. This should be a strong experiment then. 

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

var counter = 0 //counter variable to break the for loop

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
      prompt: '<strong>Do you understand and consent to these terms?</strong>',
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

main.blocks.trials = { //flash the anagram sequence -- it will be either a sequential reveal or instant reveal
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

main.block.warm = { //trial to take warmth ratings after each flash
  type: 'survey-likert',
  questions: [
    {
      prompt: '<h1>Warmth rating</h1><p><strong>Please rate how close you feel you are to the solution.</strong></p>',
      labels: ['very cold', '', '', '', '', '', 'very warm'],
      name: 'warm',
      required: true
    }
};

main.blocks.loop_node = { //loop node breaks when counter is 5
    timeline: [main.blocks.trials, main.blocks.warm],
    loop_function: function(){
        if(counter == 4){
            return false; //break the loop once all the anagrams are flashed
        } else {
            counter = counter+1
            return true; //else continue looping
        }
    }
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
      prompt: '<h1>Some Questions</h1><p><strong>Please rate your pleasantness on a scale of 1-7.</strong></p>',
      labels: ['very unpleasant', '', '', '', '', '', 'very pleasant'],
      name: 'pleasantness',
      required: true
    },
    {
      prompt: '<p>Did you experience an <em>Aha! moment</em> (on a scale of 1-7) after the <b>last</b> anagram was shown to you?</p>',
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
    main.blocks.loop_node,
    main.blocks.solution,
    main.blocks.surveyData,
    main.blocks.finalDataBuffer
  ]
});
