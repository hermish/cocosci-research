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

//Get random insight and non insight problems by shuffling the problems and create a new array of only five problems
var chosenValue = Math.random() < 0.5 ? 2 : 3;

shuffle(insight_problems, non_insight_problems)
var random_insight = insight_problems.slice(0, chosenValue) //get first 2/3 problems from the shuffled array
var random_non_insight = non_insight_problems.slice(0, 5-chosenValue) 
var problems = random_insight.concat(random_non_insight)

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
        '5 problems',
        '1 problem', 
        '7 problems', 
        '5 problems', 
        '10 problems'        
      ],
      required: true
    }
  ], 
}
 
 //the loop function to continue showing quiz to participants until they get the correct response
 main.blocks.quizLoop = {
    timeline: [main.blocks.generalInstructions, main.blocks.quiz],  
    loop_function: function(data){      
      var res = data.values()[1].responses; 
      if(res.includes('5')){ //check if ideal response is substring of correct response
        return false; //stop if response is correct
      } else {
        alert("You answered the question incorrectly. Please read the instructions again and answer the quiz again");
            return true; //else continue looping
        }
    }
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
  button_label: 'Continue'
  };

main.blocks.loop_node = { //loop node breaks if answer is correct or person decides to skip the answer
    timeline: [main.blocks.give_answer],
    loop_function: function(data){
        user_answer = data.values()[0].responses
        user_answer = user_answer.toLowerCase()
        if(user_answer.includes('next') ){
            return false; //break the loop if correct answer or if user says next
        }
    }
}

main.blocks.surveyData = {
  timeline: [
    {
      type: 'survey-likert',
      questions: [{prompt: jsPsych.timelineVariable('question'), labels: jsPsych.timelineVariable('extremes'), required: jsPsych.timelineVariable('requireds')}]
    }
  ],
  timeline_variables: [
    {
      question: '<p>An Aha! moment is when the solution suddenly dawns on you ' +
      'and everything is clear immediately.'+' In a flash.'+' As an example, ' +
      'imagine a light bulb that is switched on all at once in contrast to ' +
      'slowly turning up the lights.</p>' + '<p>Did you experience an Aha! moment (on a scale of 1-7) ' +
      'after the <b>last</b> problem was shown to you? </p>',
      extremes: ['No, not at all', '', '', '', '', '', 'Yes, very high aha!'],
      requireds: true
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
        if(i < 5){ 
            return true; // continue loop if less than 5 because you want to go through all the arrays
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
    main.blocks.quizLoop,
    main.blocks.experimentBlock,
    main.blocks.finalDataBuffer
  ]
});

/*utility functions */

function shuffle(obj1, obj2) {
  var index = obj1.length;
  var rnd, tmp1, tmp2;

  while (index) {
    rnd = Math.floor(Math.random() * index);
    index -= 1;
    tmp1 = obj1[index];
    tmp2 = obj2[index];
    obj1[index] = obj1[rnd];
    obj2[index] = obj2[rnd];
    obj1[rnd] = tmp1;
    obj2[rnd] = tmp2;
  }
}
