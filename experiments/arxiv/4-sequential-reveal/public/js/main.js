// New pilot being tried 4.5 -- refer to global README.md

// changes to do -- move quiz at beginning, add text in next on how many configurations to go. maybe change the anagram as well or maybe make the easy one a bit less easy. 
main = {}

/* METHODS */
main.writeExperimentData = function(input) {
  //console.log(input);
   $.ajax({
       type: "POST",
       url: "/experiment-data",
       data: input,
       contentType: "application/json"
     }).fail(function () {
       alert("Error! Please contact the researcher.");
       window.location.href = "repeat";
     });
}

/* CONSTANTS */
main.VIEW_TIME = 4000
main.VIEW_TIME2 = 6000
main.CONVERTER = new showdown.Converter()
main.CONVERTER.setOption('tables', true);

var counter1 = 0 //counter variable for practice to break the first for loop
var counter2 = 0 //counter variable for expected condition to break the second for loop
var counter3 = 0 //counter variable for unexpected condition to break the second for loop
var numTimes1 = 7 //number of times the anagram is randomly configured (including the last one), this is n-1 btw because of python indexing
var numTimes2 = 7 //number of times the anagram is randomly configured for expected (including the last one)
var numTimes3 = 2 //number of times the anagram is randomly configured for unexpected (including the last one)
var time_q1 = '<p> <center> How close are you towards solving this anagram?  </center> </p>'
var time_q2 = '<p> <center> How close are you now? </center> </p>'
var key_choices = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/* PARTICIPANT SETUP */
main.identifier = {
  participantID: jsPsych.randomization.randomID(),
  condition: Math.round(Math.random()) ? 'unexpected' : 'expected'
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

main.blocks.generalInstructions1 = {
  type: 'html-keyboard-response',
  choices: ['n'],
  stimulus: main.CONVERTER.makeHtml(pages.generalInstructionsPage1)
};

main.blocks.generalInstructions2 = {
  type: 'html-keyboard-response',
  choices: ['m'],
  stimulus: main.CONVERTER.makeHtml(pages.generalInstructionsPage2)
};

main.blocks.generalInstructions3 = {
  type: 'html-keyboard-response',
  choices: ['b'],
  stimulus: main.CONVERTER.makeHtml(pages.generalInstructionsPage3)
};

main.blocks.practice_trials = { //flash the practice anagram sequence
  type: 'html-keyboard-response',
  choices: jsPsych.NO_KEYS,
  trial_duration: main.VIEW_TIME,
  stimulus: function(){return '<p><h1>'+stimuli.practice[counter1]+'</h1></p>';} //go through stimulus one at a time
};

main.blocks.close = {
  type: 'survey-likert',
  questions: [    
    {
      prompt: '<p>How close do you feel you are towards solving this anagram (on a scale of 1-10)? </p>',
      labels: ['not close at all', '', '', '', '', '', '', '', '', 'certainly solved'],
      name: 'aha',
      required: true
    },
  ],
  randomize_order: false
};

main.blocks.warm = {
  type: 'html-keyboard-response',
  stimulus: function(){ 
                        if(counter1 == 0){ //for first time show time_q1 question, else q2 
                          return time_q1; } 
                        else { 
                          return time_q2; }},
    choices: key_choices,
    prompt: "<p> <center> Press a key between 0-9 </center> \n <br/><br/><br/> <small><center> 0 - (not close at all) --- 9 (certainly solved) </center></small></p>"
};

main.blocks.next = { //block where you give hint (or not)
type: 'html-keyboard-response',
  choices: jsPsych.NO_KEYS,
  trial_duration: function(){if (counter1 == numTimes1){ //hint depending on the counter
        return 0 ;} //show for 0 seconds if counter is numTimes
      else{return main.VIEW_TIME2;}},
  stimulus: function(){if (counter1 == numTimes1-1){ //hint depending on the counter
        return '<p>We will now show you a much <b>easier</b> configuration of this anagram</p>' ; //hint comes here
      }
      else{
        return '<p>Now we will show you another configuration of the anagram <br><br><center>'+String(numTimes1-counter1-1)+' more to go</center></p>' ;
      }} 
}

main.blocks.practice_loop_node = { //loop node breaks when counter reaches 'n-1'
    timeline: [main.blocks.practice_trials, main.blocks.close, main.blocks.next], 
    loop_function: function(){
        if(counter1 == numTimes1){
            return false; //break the loop once all the anagrams are flashed
        } else {
            counter1 = counter1+1
            return true; //else continue looping
        }
    }
};

main.blocks.surveyData1 = {
  type: 'survey-likert',
  questions: [    
    {
      prompt: '<p>An Aha! moment is when the solution suddenly dawns on you ' +
      'and everything is clear immediately.'+' In a flash.'+' As an example, ' +
      'imagine a light bulb that is switched on all at once in contrast to ' +
      'slowly turning up the lights.</p>' + '<p>Did you experience an Aha! moment (on a scale of 1-7) ' +
      'after the <b>last</b> anagram was shown to you? </p>',
      labels: ['no, not at all', '', '', 'a little aha', '', '', 'yes, very high Aha!'],
      name: 'aha',
      required: true
    },
  ],
  randomize_order: false
};

main.blocks.generalInstructions4 = {
  type: 'html-keyboard-response',
  choices: ['g'],
  stimulus: main.CONVERTER.makeHtml(pages.generalInstructionsPage4)
};

main.blocks.main_trials = { //flash the practice anagram sequence
  type: 'html-keyboard-response',
  choices: jsPsych.NO_KEYS,
  trial_duration: main.VIEW_TIME,
  stimulus: function(){if(main.identifier.condition=='expected'){return '<p><h1>'+stimuli.expected[counter2]+'</h1></p>';}else if(main.identifier.condition=='unexpected'){return '<p><h1>'+stimuli.unexpected[counter3]+'</h1></p>';}
  } //go through stimulus one at a time
};

main.blocks.warm2 = {
  type: 'html-keyboard-response',
  stimulus: function(){if(main.identifier.condition=='expected'){ 
                        if(counter2 == 0){ //for first time show time_q1 question, else q2 
                          return time_q1; } 
                        else { 
                          return time_q2;}}
                      else if(main.identifier.condition=='unexpected'){ 
                        if(counter3 == 0){ //for first time show time_q1 question, else q2 
                          return time_q1;} 
                        else { 
                          return time_q2;}}  
                        },
    choices: key_choices,
    prompt: "<p> <center> Press a key between 0-9 </center> \n <br/><br/><br/> <small><center> 0 - (not close at all) --- 9 (certainly solved) </center></small></p>"
};

main.blocks.next2 = { //block where you give hint (or not)
type: 'html-keyboard-response',
  choices: jsPsych.NO_KEYS,
  trial_duration: function(){
      if(main.identifier.condition=='expected'){ //if condition is expected, then counter stops at numTimes2
      if (counter2 == numTimes2){ //hint depending on the counter
        return 0 ;} //show for 0 seconds if counter is numTimes
      else{
        return main.VIEW_TIME2;
      }}
      else if(main.identifier.condition=='unexpected'){ //else stops at numTimes3
      if (counter3 == numTimes3){ //hint depending on the counter
        return 0 ;} //show for 0 seconds if counter is numTimes
      else{
        return main.VIEW_TIME2;
      }}},
  stimulus: function(){
    if(main.identifier.condition=='expected'){ //if condition is expected, then counter stops at numTimes2
      if (counter2 == numTimes2-1){ //hint depending on the counter
        return '<p>We will now show you a much <b>easier</b> configuration of this anagram</p>' ; //hint comes here
      }
      else{
        return '<p>Now we will show you another configuration of the anagram <br><br><center>'+String(numTimes2-counter2-1)+' more to go</center></p>';
      }}
      else if(main.identifier.condition=='unexpected'){ //for unexpected just tell them another configuration will be shown
        return '<p>Now we will show you another configuration of the anagram <br><br><center>'+String(numTimes2-counter3-1)+' more to go</center></p>';
      }}
};

main.blocks.main_loop_node = { //loop node breaks when counter reaches 'n-1'
    timeline: [main.blocks.main_trials, main.blocks.close, main.blocks.next2], 
    loop_function: function(){
      if(main.identifier.condition=='expected'){
        if(counter2 == numTimes2){
            return false; //break the loop once all the anagrams are flashed
        } else {
            counter2 = counter2+1
            return true; //else continue looping
        }}
      else if(main.identifier.condition=='unexpected'){
        if(counter3 == numTimes3){
            return false; //break the loop once all the anagrams are flashed
        } else {
            counter3 = counter3+1
            return true; //else continue looping
        }}  
    }
};

main.blocks.quiz = {
  type: 'survey-multi-choice',
  preamble: 'Before proceeding, please answer the below question.',
  questions: [
    {prompt: "In how many different configurations will the next anagram be presented to you before the easier configuration is shown to you?", name: 'quiz', options: ["2 configurations", "3 configurations", "7 configurations", "12 configurations", "20 configurations"], required:true},
  ],
};


main.blocks.surveyData2 = {
  type: 'survey-likert',
  questions: [    
    {
      prompt: '<p>An Aha! moment is when the solution suddenly dawns on you ' +
      'and everything is clear immediately.'+' In a flash.'+' As an example, ' +
      'imagine a light bulb that is switched on all at once in contrast to ' +
      'slowly turning up the lights.</p>' + '<p>Did you experience an Aha! moment (on a scale of 1-7) ' +
      'after the <b>last</b> anagram was shown to you? </p>',
      labels: ['no, not at all', '', '', 'a little aha', '', '', 'yes, very high Aha!'],
      name: 'aha',
      required: true
    },
  ],
  randomize_order: false
}

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
    main.blocks.generalInstructions1,
    main.blocks.generalInstructions2,
    main.blocks.generalInstructions3,
    main.blocks.quiz,
    main.blocks.practice_loop_node,
    main.blocks.surveyData1,
    main.blocks.generalInstructions4,    
    main.blocks.main_loop_node,
    main.blocks.surveyData2,
    main.blocks.finalDataBuffer
  ]
});


