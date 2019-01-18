/* INITIALIZATION */
var main = {
    converter: new showdown.Converter(),
    writeExperimentData: function(input) {
        $.ajax({
            type: "POST",
            url: "/experiment-data",
            data: input,
            contentType: "application/json"
        }).fail(function() {
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
    controlPuzzleTime: 25000,
    controlHintTime: 10000,
    experimentalPuzzleTime: 20000,
    experimentalPreHintTime: 5000,
    experimentalHintTime: 10000
};


/* TIMELINE ELEMENTS */
// Introduction
main.blocks = {};

main.blocks.consentPage = { //Link the consent page here
    type: 'survey-multi-choice',
    preamble: main.converter.makeHtml(literals.consentPage),
    questions: [
        {
            prompt: 'Do you consent to participate?',
            options: [
                'I consent to participate',
                'I do not consent to participate'
            ],
            required: true
        }
    ],
    on_finish: function(data) {
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
    button_label_next: 'Continue',
    post_trial_gap: main.paramters.postInstructionsPause
};

// Experiment
main.blocks.controlTrials = {
    type: 'html-keyboard-response',
    choices: jsPsych.NO_KEYS,
    timeline: [
        {
            stimulus: main.converter.makeHtml(literals.puzzlePage),
            trial_duration: main.paramters.controlPuzzleTime
        },
        {
            stimulus: main.converter.makeHtml(literals.hintPage),
            trial_duration: main.paramters.controlHintTime
        }
    ]
};

main.blocks.experimentalTrials = {
    type: 'html-keyboard-response',
    choices: jsPsych.NO_KEYS,
    timeline: [
        {
            stimulus: main.converter.makeHtml(literals.puzzlePage),
            trial_duration: main.paramters.experimentalPuzzleTime
        },
        {
            stimulus: main.converter.makeHtml(literals.preHintPage),
            trial_duration: main.paramters.experimentalPreHintTime
        },
        {
            stimulus: main.converter.makeHtml(literals.hintPage),
            trial_duration: main.paramters.experimentalHintTime
        }
    ]
};


// Data Collection
main.blocks.riddleFeedback = {
    type: 'survey-multi-choice',
    preamble: main.converter.makeHtml(literals.riddleFeedbackPage),
    questions: [
        {
            prompt: 'Did you figure out the riddle?',
            options: [
                'Yes',
                'No'
            ],
            required: true
        }
    ],
    on_finish: function(data) {
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
            prompt: 'An Aha! moment is when the solution suddenly dawns on you and everything is clear immediately. In a flash. As an example, imagine a light bulb that is switched on all at once in contrast to slowly turning up the lights. Did you experience an Aha! moment upon getting the solution to this puzzle? ',
            labels: ['No', '', '', '', '', '', 'Yes'],
            required: true
        }
    ]
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

        // main.blocks.riddleFeedback,
        // main.blocks.answerDescription,
        main.blocks.surveyData,
        main.blocks.finalDataBuffer
    ]
});
