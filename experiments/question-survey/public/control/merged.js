/* REVISED PLUGIN */

jsPsych.plugins['survey-likert'] = (function () {
    var plugin = {};
    plugin.trial = function(display_element, trial) {
    // default parameters for the trial
        trial.preamble = typeof trial.preamble === 'undefined' ? "" : trial.preamble;

        // if any trial variables are functions
        // this evaluates the function and replaces
        // it with the output of the function
        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        // show preamble text
        display_element.append($('<div>', {
            "id": 'jspsych-survey-likert-preamble',
            "class": 'jspsych-survey-likert-preamble'
        }));

        $('#jspsych-survey-likert-preamble').html(trial.preamble);

        display_element.append('<form id="jspsych-survey-likert-form">');
        // add likert scale questions
        for (var i = 0; i < trial.questions.length; i++) {
            form_element = $('#jspsych-survey-likert-form');
            // add question
            form_element.append('<label class="jspsych-survey-likert-statement">' + trial.questions[i] + '</label>');
            // add options
            var width = 100 / trial.labels[i].length;
            options_string = '<ul class="jspsych-survey-likert-opts" data-radio-group="Q' + i + '">';
            for (var j = 0; j < trial.labels[i].length; j++) {
                  // modification1: I added "required"
                options_string += '<li style="width:' + width + '%"><input type="radio" name="Q' + i + '" value="' + j + '" required><label class="jspsych-survey-likert-opt-label">' + trial.labels[i][j] + '</label></li>';
            }
            options_string += '</ul>';
            form_element.append(options_string);
        }

        // modification2
        form_element.append($('<input>', {
            'type': 'submit',
            'class': 'jspsych-survey-likert jspsych-btn',
            'value': 'Submit Answers'
        }));

        form_element.submit(function(event) { // modification3
            event.preventDefault(); // modification4

            // measure response time
            var endTime = (new Date()).getTime();
            var response_time = endTime - startTime;

            // create object to hold responses
            var question_data = {};
            $("#jspsych-survey-likert-form .jspsych-survey-likert-opts").each(function(index) {
                var id = $(this).data('radio-group');
                var response = $('input[name="' + id + '"]:checked').val();
                if (typeof response == 'undefined') {
                    response = -1;
                }
                var obje = {};
                obje[id] = response;
                $.extend(question_data, obje);
            });

            // save data
            var trial_data = {
                "rt": response_time,
                "responses": JSON.stringify(question_data)
            };

            display_element.html('');

            // next trial
            jsPsych.finishTrial(trial_data);
        });

        var startTime = (new Date()).getTime();
  };
  return plugin;
})();

/* TEXT LITERALS */
var consentPage = [
    '# Consent to Participate in Research\n',
    '`CPHS# 2013-09-5632`',
    '## Overview\n',
    'This HIT is a psychology experiment being conducted by Rachit Dubey, a graduate student in Professor Tania ' +
        'Lombrozo\'s Concepts and Cognition Lab at the University of California, Berkeley. In order to consent to ' +
        'participate, you MUST meet the following criteria:\n',
    '- 18 years of age or older.',
    '- Fluent speaker of English.',
    '- Have not participated in this experiment before.\n',
    'This study is designed to test hypotheses about the nature of people\'s intuitive theories about the world, how ' +
        'they can be changed, and how they influence judgments and behavior. We also hope to learn about how you ' +
        'conceptually understand the world around you. Our intuitive sense of everyday objects and events in the world ' +
        'play a significant role in our thoughts and behaviors, and we wish to understand the nature of human cognition.',
    'You may be asked to do one or more of the following tasks 1) causal learning tasks (e.g., figuring out what ' +
        'causes what), 2) social tasks (e.g., reasoning about others’ minds and behavior), 3) linguistic tasks (e.g., ' +
        'word associations and learning), 4) imagination tasks (e.g., reasoning about events counter to fact), 5) ' +
        'categorization/association tasks (e.g., grouping objects or stating what comes to mind given a prompt), 6) ' +
        'general cognitive tasks (e.g.,impulse control and searching for hidden objects). You may be asked to make ' +
        'judgments about what you see, answer multiple choice or open-ended questions about your judgments (such as ' +
        'making predictions and providing explanations), observe events, and perform actions yourself (such as grouping ' +
        'objects). Sometimes you might watch a short video clip, look at pictures, or listen to music, and you may be ' +
        'asked to answer questions about how the clip or music made you feel.\n',
    'You may refrain from answering any questions that make you uncomfortable and may withdraw your participation at' +
        ' any time even after completing the experiment without penalty. The study takes about 10 minutes to complete,' +
        ' for which you will receive $1.25.\n',
    'There are no direct benefits to you as a participant, but this research will help us understand various ' +
        'cognitive processes, which may benefit society in a number of ways, including influencing legal and ' +
        'public policy.\n',
    'We will not be asking for any personally identifying information, and we will handle responses as ' +
        'confidentially as possible. Worker IDs will never be tied to your responses on this survey, and IP ' +
        'addresses will not be collected for studies that ask potentially sensitive questions. However, we cannot ' +
        'guarantee the confidentiality of information transmitted over the Internet. To minimize this risk, data ' +
        'containing anything that might be personally identifiable (e.g. Worker IDs) will be encrypted on transfer ' +
        'and storage and will only be accessible to qualified lab personnel. We will be keeping data collected a part ' +
        'of this experiment indefinitely. This anonymized data (containing neither Worker IDs nor IP addresses) may ' +
        'be shared with the scientific community.\n',
    '## Contact\n',
    'If you have any questions about the study, feel free to contact the study investigator: Rachit Dubey at ' +
        '`rach0012@berkeley.edu`, or the principal investigator: Tania Lombrozo at `lombrozo@berkeley.edu`. If you have ' +
        'concerns about your rights as a participant in this experiment, please contact UC Berkeley\'s Committee for ' +
        'Protection of Human Subjects at `(510) 642-7461` or subjects@berkeley.edu.\n',
    '## Consent\n',
    'By selecting the \'consent\' option below, I acknowledge that I am 18 or older, that I am a fluent speaker of ' +
        'English, that I have not completed this experiment before, that I have read this consent form, and that I ' +
        'agree to take part in the research.'
];

var consentFailureMessage = [
    '# Thank you!\n',
    'As you do not consent to participate, please close this window and return this HIT on MTurk so that another ' +
        'worker can accept it. If you selected this option by mistake, you can change your response and continue with ' +
        'the experiment.\n'
];

var instructions = [
    '# Instructions\n',
    'On the following pages, you will see 10 questions that people have asked on a popular online forum. For each ' +
        'question, we will ask you to make a series of judgments. Please press the next button below or the arrow key ' +
        'to proceed.\n'
];

var thankYouMessage = [
    '# Thank you!\n',
    'The survey is now complete, thank you for your participatation. Here is your unique SECRET key: AJFHBG897. ' +
        'Please copy and paste this code in the box of the HIT page for the payment to process.'
];

consentPage = consentPage.join('\n');
consentFailureMessage = consentFailureMessage.join('\n');
instructions = instructions.join('\n');
thankYouMessage = thankYouMessage.join('\n');


var judgments = Object.freeze({
    questions: [
        'How curious are you about the answer to this question?',
        'How confident are you that you know the correct answer to this question?',
        'To what extent would knowing the answer to this question be useful to you in the future?',
        'How popular do you think this question is?',
        'How well-written do you think this question is?'
    ],
    choices: [
        ['not curious at all', '', '', '', '', '', 'very curious'],
        ['not confident at all', '', '', '', '', '', 'very confident'],
        ['not useful at all', '', '', '', '', '', 'very useful'],
        ['not at all', '', '', '', '', '', 'very popular'],
        ['not at all', '', '', '', '', '',  'very well-written']
    ]
});
/* SURVEY QUESTIONS */

var questions = {
    groupA: [
        "Why do you feel sick and not hungry when you haven't eaten?",
        "How does sleep restore the body's energy?",
        'Why waves? All energy transfer in nature from one point to another happens in waves. Light, sound, even ' +
            'gravity travels in waves. Which fundamental property of nature is responsible for wave-like nature? ' +
            'Are there other non-wave-like ways to transfer energy from one point to another?',
        'How do activated carbon filters work?',
        'Why must a country "declare war" before attacking?'
    ],
    groupB: [
        'Why are bubbles round?',
        'How is research carried out in order to constantly develop and improve CPUs and GPUs?',
        'What are the biological advantages and disadvantages of trees shedding their leaves vs keeping them ' +
            'all year round (deciduous vs coniferous)?',
        'How do such small doses of things like cocaine and heroin kill you? How do these small powders have such ' +
            'a big effect on your body?',
        'Why does the eastern half of the United States have colder winters than the western half?',
    ]
};


var HIGH_SCORES = 3365,
    LOW_SCORES = 33,
    STDEV = 10;

/* RANDOMIZATION TOOLS */
function gaussRandom() {
    var r = 0;
    while (r === 0 || r >= 1) {
        var u = 2 * Math.random() - 1,
            v = 2 * Math.random() - 1;
        r = u * u + v * v;
    }
    var c = Math.sqrt(-2 * Math.log(r) / r);
    return u * c;
}

function getNormalRandom(mean, stdev, number) {
    var output = [];
    while (number > 0) {
        output.push(gaussRandom() * stdev + mean);
        number--;
    }
    return output;
}

function createJudgmentTemplate(judgments) {
    var allQuestions = judgments.questions,
        allChoices = judgments.choices;

    var grouped = allQuestions.map(function (element, index) {
        return [element, allChoices[index]];
    });

    var randomGrouped = jsPsych.randomization.shuffle(grouped);
    var randomQuestions = randomGrouped.map(function (pair) {return pair[0]; });
    var randomChoices = randomGrouped.map(function (pair) {return pair[1]; });

    return {
        questions: randomQuestions,
        choices: randomChoices
    };
}

function assignScores(questions) {
    var groupID = jsPsych.randomization.sample(['highA', 'highB'], 1, false)[0];
    jsPsych.data.addProperties({condition: groupID});

    var highScores = getNormalRandom(HIGH_SCORES, STDEV, 5),
        lowScores = getNormalRandom(LOW_SCORES, STDEV, 5);


    var allQuestions = questions.groupA.concat(questions.groupB);
    var allScores = groupID === 'highA' ? highScores.concat(lowScores) :
                lowScores.concat(highScores);

    var grouped = allQuestions.map(function (element, index) {
        return [element, Math.round(allScores[index])];
    });
    
    return jsPsych.randomization.shuffle(grouped);
}


/* SURVEY BLOCKS */
var converter = new showdown.Converter();

var consentBlock = {
    type: 'survey-multi-choice',
    preamble: [converter.makeHtml(consentPage)],
    required: [true],
    questions: [''],
    options: [[
        'I do not consent to participate',
        'I consent to participate'
    ]],
    on_finish: function(data) {
        var resp = JSON.parse(data.responses);
        if (resp.Q0 === "I do not consent to participate") {
            jsPsych.endExperiment(converter.makeHtml(consentFailureMessage));
        }
    }
};

var instructionsBlock = {
    type: 'instructions',
    pages: [converter.makeHtml(instructions)],
    show_clickable_nav: true
};


var randomJudgements = createJudgmentTemplate(judgments);
jsPsych.data.addProperties({randomJudgements: randomJudgements.questions});
var judgementBlock = {
    type: 'survey-likert',
    questions: randomJudgements.questions,
    required: [true, true, true, true, true, true, true],
    randomize_order: false,
    labels: randomJudgements.choices
};

var questionScores = assignScores(questions);
jsPsych.data.addProperties({questionScores: questionScores});

judgementBlock.timeline = [];
for (var pos = 0; pos < questionScores.length; pos++) {
    var questionText = questionScores[pos][0];
    var questionScore = questionScores[pos][1];
    var text = '### Question\n' + '> **' + questionText + '**\n\n' +
        '> **' + questionScore.toString() + '** people upvoted this question\n\n' +
        '### Your Responses';
    judgementBlock.timeline.push(
        {preamble: converter.makeHtml(text)}
    );
}

var bufferBlock = {
    type: 'text',
    text: converter.makeHtml('Press any key to continue.'),
    on_finish: function () {
        $.ajax({
            type: "POST",
            url: "/experiment-data",
            data: JSON.stringify(jsPsych.data.getData()),
            contentType: "application/json"
        })
        .fail(function() {
            alert("A problem occurred while writing to the database.");
            window.location.href = "/";
        })
    }
};

var thankYouBlock = {
    type: 'text',
    text: converter.makeHtml(thankYouMessage),
    cont_key: ['/']
};

/* RUN EXPERIMENT */
var timeline = [
    consentBlock,
    instructionsBlock,
    judgementBlock,
    bufferBlock,
    thankYouBlock
];

jsPsych.init({
    timeline: timeline,
});
