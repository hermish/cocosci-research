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

// Asks participants for consent
var consentBlock = {
    type: 'survey-multi-choice',
    preamble: [converter.makeHtml(consentPage)],
    required: [true],
    questions: ['Do you consent to participate?'],
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

// Displays intructions
var instructionsBlock = {
    type: 'instructions',
    pages: [converter.makeHtml(instructionsOne)],
    show_clickable_nav: true
};

// PHASE I
// Create template for likert questions randomizing the order of judgements
var randomJudgements = createJudgmentTemplate(judgments);
jsPsych.data.addProperties({randomJudgements: randomJudgements.questions});
var judgementBlock = {
    type: 'survey-likert',
    questions: randomJudgements.questions,
    required: [true, true, true, true, true, true, true],
    randomize_order: false,
    labels: randomJudgements.choices,
    timeline: []
};

// Fills out the template with questions and scores
var questionScores = assignScores(questions);
jsPsych.data.addProperties({questionScores: questionScores});

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

// PHASE II
// Display instructions.
var instructionsTwoBlock = {
    type: 'instructions',
    pages: [converter.makeHtml(instructionsTwo)],
    show_clickable_nav: true
};

// Prompt users for 5 question to see responses for
var chooseBlock = {
    preamble: [converter.makeHtml(choosePage)],
    type: 'survey-multi-choose',
    limit: 5,
    randomize_order: false,
    required: [true, true, true, true, true],
    options: ['Reveal Answer', 'Keep Hidden'],
    questions: []
};

for (var pos = 0; pos < questionScores.length; pos++) {
    var questionText = questionScores[pos][0];
    var questionScore = questionScores[pos][1];
    var text = questionText + ' [' + questionScore.toString() + 
        ' people upvoted this question]';
    chooseBlock.questions.push(text)
}

var bufferBlock = {
    type: 'call-function',
    func: function () {
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
    },
    on_finish: function(data) {
        // Displays Thank You and payement information
        jsPsych.endExperiment(converter.makeHtml(thankYouMessage));
    }
};

/* RUN EXPERIMENT */
var timeline = [
    consentBlock,
    instructionsBlock,
    judgementBlock,
    instructionsTwoBlock,
    chooseBlock,
    bufferBlock
];

jsPsych.init({
    timeline: timeline,
});
