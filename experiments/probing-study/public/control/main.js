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

var time_q = '<center><p>How close are you towards solving this problem?</p></center>'
var scale = ['not close at all', 'halfway there', 'certainly solved']

//var quiz_options = ['My answer to the problem or SKIP if I am unable to solve the problem',
//        'I have to type nothing', 
//        'My answer to the problem or HELLO if I am unable to solve the problem', 
//       'I have to type the correct answer to the problem']
// shuffle2(quiz_options)        

shuffle2(non_insight_problems_easy)
shuffle2(anagram_problems)

var random_non_insight = non_insight_problems_easy.slice(0, 1)

var random_anagram = anagram_problems.slice(0, 1) 

var problems = random_non_insight.concat(random_anagram)
shuffle2(problems)

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
      options: [' I consent to participate', ' I do not consent to participate'],
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
      main.converter.makeHtml(literals.generalInstructionsPage2),
      main.converter.makeHtml(literals.generalInstructionsPage3),
      main.converter.makeHtml(literals.generalInstructionsPage4),
      ],
  show_clickable_nav: true,
  post_trial_gap: main.paramters.postInstructionsPause
};

 /*main.blocks.quiz = {
 type: "survey-multi-choice",
 preamble: ["Before proceeding, please answer the below question."],
 questions: [
    {
      prompt: 'What do you have to type in text box provided below each problem?',
      options: quiz_options,
      required: true
    }
  ], 
}*/
 
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
  questions: [{prompt: '<p style="font-size:15px">When you think you have solved the problem, type your answer in the box and click continue.</p>'}],
  moreText: '<p><small>\n\n <i>If you are unable to solve this problem and want to move to the next problem, just type <b>NEXT</b> and then click continue.</i></small></p>',
  button_label: 'Continue',
  trial_duration: 10000
  };

main.blocks.time_estimate = {
  type: 'html-slider-response',
  stimulus: time_q,
  require_movement: true,
  slider_width: 500,
  labels: scale,
  required: true
}  

/*Use slider-response-2 if you want to add the reading question as well
main.blocks.time_estimate = {
  type: 'html-slider-response2',
  stimulus: time_q,
  require_movement: true,
  slider_width: 500,
  labels: scale,
  prompt: "&nbsp; &nbsp; Are you done reading the problem?",
  prompt_labels: ['Yes, I am now trying to solve it', 'No, I am still reading it'],
  required: true
}*/ 

main.blocks.loop_node = { //loop node breaks if answer is correct or person decides to skip the answer
    timeline: [main.blocks.give_answer, main.blocks.time_estimate],
    loop_function: function(data){
        user_rt = data.values()[0].rt
        user_answer = data.values()[0].responses
        user_answer = user_answer.toLowerCase()
        console.log(user_answer.length)
        
        if(user_rt < 10000 & user_answer.length > 9){
          return false;
        }
        else if(user_rt < 10000 & user_answer.length == 9){
            alert('Please type your ANSWER or type NEXT before clicking continue')
            return true; //break the loop if correct answer
        }
        else {
            //alert('')
            return true; //else continue looping
        }
    }
}
//{ prompt: 'How likely do you think it is that you correctly solved the previous problem?', 
// labels: ['1 (Not very likely)', '', '', '', '', '', '7 (Very likely)'], required: true},
main.blocks.surveyData = {
  timeline: [
    {
      type: 'survey-likert',
      questions: [{ prompt: 'How difficult would you rate the previous problem to be?', 
      labels: ['1 (Very easy)', '', '', '', '', '', '7 (Very hard)'], required: true},
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
        if(i < 2){ 
            return true; // continue loop if less than 2 because you want to go through all the arrays
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

function shuffle2(obj1) {
  var index = obj1.length;
  var rnd, tmp1

  while (index) {
    rnd = Math.floor(Math.random() * index);
    index -= 1;
    tmp1 = obj1[index];
    obj1[index] = obj1[rnd];
    obj1[rnd] = tmp1;
  }
}
