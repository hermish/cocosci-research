/* PARTICIPANT JUDGEMENTS */
var judgments = Object.freeze({
    questions: [
        'How curious are you about the answer to this question?',
        'How confident are you that you know the correct answer to this question?',
        'To what extent would knowing the answer to this question be useful to you in the future?',
        'How popular do you think this question is in this social forum?',
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

/* CONSTANTS */
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
