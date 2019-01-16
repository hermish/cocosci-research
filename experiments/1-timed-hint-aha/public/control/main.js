var main = {};

/* INITIALIZATION */
main.converter = new showdown.Converter();
main.writeExperimentData = function(input) {
    console.log(input);
    // $.ajax({
    //     type: "POST",
    //     url: "/experiment-data",
    //     data: input,
    //     contentType: "application/json"
    // }).fail(function() {
    //     alert("Error! Please contact the researcher.");
    //     window.location.href = "/";
    // })
};

/* VARIABLES & PARAMETERS */
main.identifier = {
    participantID: jsPsych.randomization.randomID(),
    conditionNumber: Math.round(Math.random())
};
main.paramters = {
    postInstructionsPause: 0,
    timeToHint: 5000,
    preHintTime: 3000,
    hintTime: 10000
};

/* TIMELINE ELEMENTS */

// Introduction
main.blocks = {};
main.blocks.constentPage = {
    type: 'survey-multi-choice',
    preamble: main.converter.makeHtml(literals.consentPageText),
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
            jsPsych.endExperiment(main.converter.makeHtml(literals.noConsentText));
        }
    }
};

main.blocks.initialDataBuffer = {
    type: 'call-function',
    func: function () {
        console.log('first');
        main.writeExperimentData(JSON.stringify({
            responseType: 'start',
            participantID: main.identifier.participantID,
            conditionNumber: main.identifier.conditionNumber
        }));
    }
};

main.blocks.generalInstructions = {
    type: 'instructions',
    pages: [main.converter.makeHtml(literals.generalInstructionsText)],
    show_clickable_nav: true,
    button_label_next: 'Continue',
    post_trial_gap: main.paramters.postInstructionsPause
};

// Puzzle Presentation
main.blocks.puzzlePresentation = {
    type: 'html-button-response',
    stimulus: main.converter.makeHtml(literals.puzzleText),
    prompt: literals.puzzlePromptText,
    choices: ['Got It!'],
    trial_duration: main.paramters.timeToHint,

    // Terminate if completed early
    on_finish: function(data) {
        var response = data.button_pressed;
        if (response !== null) {
            console.log('completedEarly');
            main.writeExperimentData(JSON.stringify({
                responseType: 'completedEarly',
                participantID: main.identifier.participantID,
                conditionNumber: main.identifier.conditionNumber
            }));
            jsPsych.endExperiment(main.converter.makeHtml(literals.thankYouText));
        }
    }
};

main.blocks.hint = {
    type: 'html-button-response',
    timeline: [
        {
            stimulus: main.converter.makeHtml(literals.hintText),
            choices: ['Got It!'],
            trial_duration: main.paramters.hintTime,

            // Terminate if uncompleted
            on_finish: function(data) {
                var response = data.button_pressed;
                if (response === null) {
                    console.log('uncompleted');
                    main.writeExperimentData(JSON.stringify({
                        responseType: 'uncompleted',
                        participantID: main.identifier.participantID,
                        conditionNumber: main.identifier.conditionNumber
                    }));
                    jsPsych.endExperiment(main.converter.makeHtml(literals.thankYouText));
                }
            }
        }
    ]
};

if (main.identifier.conditionNumber === 1) {
    main.blocks.hint.timeline.unshift({
        stimulus: main.converter.makeHtml(literals.preHintText),
        choices: [],
        trial_duration: main.paramters.preHintTime
    });
}

main.blocks.askAnswer = {
    type: 'survey-text',
    questions: [
        {
            prompt: 'Describe the answer in 5 words or less.',
            columns: 50
        }
    ],
    preamble: main.converter.makeHtml(literals.askAnswerPreamble)
};

main.blocks.finalRatings = {
    type: 'survey-likert',
    preamble: main.converter.makeHtml(literals.likertPreamble),
    questions: [
        {
            prompt: 'Aha! Moment?',
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
        jsPsych.endExperiment(main.converter.makeHtml(literals.thankYouText));
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
        main.blocks.constentPage,
        main.blocks.initialDataBuffer,
        main.blocks.generalInstructions,
        main.blocks.puzzlePresentation,
        main.blocks.hint,
        main.blocks.askAnswer,
        main.blocks.finalRatings,
        main.blocks.finalDataBuffer
    ]
});
