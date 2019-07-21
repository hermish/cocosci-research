literals.riddleFeedbackPage = '';
literals.answerDescriptionPage = '';

main.blocks.riddleFeedback = {
  type: 'survey-multi-choice',
  preamble: main.converter.makeHtml(literals.riddleFeedbackPage),
  questions: [
    {
      prompt: 'Did you figure out the riddle?',
      options: [
        ' Yes',
        ' No'
      ],
      required: true
    }
  ],
  on_finish: function (data) {
    var responses = JSON.parse(data.responses);
    if (responses.Q0 === 'No') {
      main.writeExperimentData(JSON.stringify({
        responseType: 'uncompleted',
        participantID: main.identifier.participantID,
        conditionNumber: main.identifier.conditionNumber
      }));
      jsPsych.endExperiment(main.converter.makeHtml(literals.thankYouPage));
    }
  }
};

main.blocks.answerDescription = {
  type: 'survey-text',
  preamble: main.converter.makeHtml(literals.answerDescriptionPage),
  questions: [
    {
      prompt: 'Please describe the answer in five words or less.',
      columns: 50
    }
  ]
};

main.blocks.surveyData = {
  type: 'survey-likert',
  preamble: main.converter.makeHtml(literals.surveyDataPage),
  questions: [
    {
      prompt: 'Please rate how you felt once you understood the solution to the riddle.',
      labels: ['Unplesant', '', '', '', '', '', 'Pleasant'],
      required: true
    },
    {
      prompt: 'An Aha! moment is when the solution suddenly dawns on you ' +
      'and everything is clear immediately. In a flash. As an example, ' +
      'imagine a light bulb that is switched on all at once in contrast to ' +
      'slowly turning up the lights. Did you experience an Aha! moment upon ' +
      'getting the solution to this puzzle? ',
      labels: ['No', '', '', '', '', '', 'Yes'],
      required: true
    }
  ]
};