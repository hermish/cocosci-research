/* INITIALIZATION */
// In this experiment people see '5' problems one after another -- just one condition. Their goal is to solve the problems and provide difficulty ratings to the same.
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
  participantID: jsPsych.randomization.randomID()
};

main.paramters = {
  postInstructionsPause: 0,
  ViewTime: 500
};

var time_q = '<p>How many more <b>minutes</b> do you think you will need to solve this problem?</p>'
var scale = ['0 minutes', '0.5', '1','1.5','2', '2.5', '3 minutes']


shuffle(insight_problems)
shuffle(non_insight_problems)
shuffle(anagram_problems)
var random_insight = insight_problems.slice(0, 2) //get 2 problems from the shuffled array
var random_non_insight = non_insight_problems.slice(0, 2) 
var random_anagram = anagram_problems.slice(0, 2) 
var problems = random_insight.concat(random_non_insight, random_anagram)
shuffle(problems)

// access the individual problems here
var i = 0;
var RandomProblem = problems[i]

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
      problems_seen: problems
    }));
  }
};

main.blocks.generalInstructions = {
  type: 'instructions',
  pages: [
  		main.converter.makeHtml(literals.generalInstructionsPage),
      main.converter.makeHtml(literals.generalInstructionsPage2)
      	],
  show_clickable_nav: true,
  post_trial_gap: main.paramters.postInstructionsPause
};

 main.blocks.quiz = {
 type: "survey-multi-choice",
 preamble: ["Before proceeding, please answer the below question."],
 questions: [
    {
      prompt: 'How many problems do you have to solve in total in this experiment?',
      options: [ 
        '6 problems',
        '1 problem', 
        '7 problems', 
        '3 problems', 
        '10 problems'        
      ],
      required: true
    }
  ], 
}
 
// ------------------------------ Experiment ----------------------------------------------------

main.blocks.view_instruction = {
  type: 'html-keyboard-response',
  stimulus: main.converter.makeHtml(literals.nextPage),
  choices: ['v']
};


main.blocks.give_answer = {
  type: 'html-keyboard-response',
  choices: jsPsych.NO_KEYS,
  type: 'survey-text', 
  preamble:  function(){return '<b><center><h2>'+main.converter.makeHtml(RandomProblem)+'</h2></center></b>'},
  questions: [{prompt: '<small><p>Take as much time as you would like. When you think you have solved the problem, type your answer below:</p></small>'}],
  moreText: '<p><small>\n\n <i>If you are unable to solve this problem and want to move to the next problem, just type NEXT in the box and then click continue</i></small></p>',
  button_label: 'Continue',
  trial_duration: 15000
  };

main.blocks.time_estimate = {
  type: 'html-slider-response',
  stimulus: time_q,
    //min:0,
    //max: 6,
    //step: 0.1, 
    //start: 3,
    require_movement: true,
    slider_width: 400,
    labels: scale 
} 

main.blocks.loop_node = { //loop node breaks if answer is correct or person decides to skip the answer
    timeline: [main.blocks.give_answer, main.blocks.time_estimate],
    loop_function: function(data){
        user_answer = data.values()[0].responses
        user_answer = user_answer.toLowerCase()
        if(user_answer.includes('next') ){
            return false; //break the loop if user says next
        }
    }
}


main.blocks.surveyData = {
  timeline: [
    {
      type: 'survey-likert',
      questions: [{ prompt: 'How likely do you think it is that you correctly solved the previous problem?', 
      labels: ['1 (Not very likely)', '', '', '', '', '', '10 (Very likely)'], required: true},
      { prompt: 'How difficult would you rate the previous problem to be?', 
      labels: ['1 (Very easy)', '', '', '', '', '', '10 (Very hard)'], required: true},
      {prompt: '<p>An Aha! moment is when the solution suddenly dawns on you ' +
      'and everything is clear immediately.'+' In a flash.'+' As an example, ' +
      'imagine a light bulb that is switched on all at once in contrast to ' +
      'slowly turning up the lights.</p>' + '<p>Did you experience an Aha! moment (on a scale of 1-7) ' +
      'after solving the <b>previous</b> problem? </p>', 
      labels: ['No, not at all', '', '', '', '', '', 'Yes, very high Aha!'], required: true},]
    }
  ],
  randomize_order: false
};


main.blocks.experimentBlock = {	
    timeline: [main.blocks.view_instruction, main.blocks.loop_node, main.blocks.surveyData], //loop through the experiment 
    loop_function: function(data){
        // go through all elements of problems array
        i++; //increment by 1
    	RandomProblem = problems[i];  
        if(i < 6){ 
            return true; // continue loop if less than 6 because you want to go through all the arrays
        } else {            
            return false; // else break loop
        }
    }
}

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
  problems_seen: problems
});

jsPsych.init({
  timeline: [
    main.blocks.consentPage,
    main.blocks.initialDataBuffer,
    main.blocks.generalInstructions,
    main.blocks.quiz,
    main.blocks.experimentBlock,
    main.blocks.finalDataBuffer
  ]
});

/*utility functions */

function shuffle(obj1) {
  var index = obj1.length;
  var rnd, tmp1;

  while (index) {
    rnd = Math.floor(Math.random() * index);
    index -= 1;
    tmp1 = obj1[index];
    obj1[index] = obj1[rnd];
    obj1[rnd] = tmp1;
   }
}
