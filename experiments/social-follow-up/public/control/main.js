/* CONSTANTS */
var HIGH_SCORES = 3365,
    LOW_SCORES = 33,
    STDEV = 10;

/* RANDOMIZATION TOOLS */
function createJudgmentTemplate(judgments) {
    var allQuestions = judgments.questions,
        allChoices = judgments.choices,
        grouped = allQuestions.map(function (element, index) {
            return [element, allChoices[index]];
        }),
        randomGrouped = jsPsych.randomization.shuffle(grouped),
        randomQuestions = randomGrouped.map(function (pair) {return pair[0]; }),
        randomChoices = randomGrouped.map(function (pair) {return pair[1]; });

    return {
        questions: randomQuestions,
        choices: randomChoices
    };
}

function assignScores(questionsAndAnswers) {
    var groupID = jsPsych.randomization.sample(['highA', 'highB'], 1, false)[0],
        highScores = randomTools.getNormalRandom(HIGH_SCORES, STDEV, 5),
        lowScores = randomTools.getNormalRandom(LOW_SCORES, STDEV, 5),
        // Collects questions, answers and scores
        allQuestions = questionsAndAnswers.questions,
        allAnswers = questionsAndAnswers.answers,
        allScores = groupID === 'highA' ? 
            highScores.concat(lowScores) : 
            lowScores.concat(highScores),
        // Package into group!
        grouped = allQuestions.map(function (element, index) {
            return [element, Math.round(allScores[index]), allAnswers[index]];
        }),
        // Shuffle questions
        questionScores = jsPsych.randomization.shuffle(grouped),
        // Extract the questions and scores to save
        randomQuestions = questionScores.map(function (element) {return element[0]; }),
        randomScores = questionScores.map(function (element) {return element[1]; });

    jsPsych.data.addProperties({condition: groupID});
    jsPsych.data.addProperties({randomQuestions: randomQuestions});
    jsPsych.data.addProperties({randomScores: randomScores});
    return questionScores;
}

function fillJudgementBlock(judgementBlock, questionScores) {
    var pos, questionText, questionScore, text;
    for (pos = 0; pos < questionScores.length; pos++) {
        questionText = questionScores[pos][0];
        questionScore = questionScores[pos][1];
        text = '### Question\n' + 
            '> **' + questionText + '**\n\n' + 
            '> **' + questionScore.toString() + '** people upvoted this question\n\n' +
            '### Your Responses';
        judgementBlock.timeline.push(
            {preamble: converter.makeHtml(text)}
        );
    }
}

function fillChooseBlock(chooseBlock, questionScores) {
    var pos, questionText, questionScore, text;
    for (pos = 0; pos < questionScores.length; pos++) {
        questionText = questionScores[pos][0];
        questionScore = questionScores[pos][1];
        text = questionText + ' [' + questionScore.toString() + ' people upvoted this question]';
        chooseBlock.questions.push(text)
    }
}

function fillDisplayBlock(questionScores, data) {
    var pos, questionText, questionScore, text,
        output = ['### Explanations'],
        resp = JSON.parse(data.responses);
    for (pos = 0; pos < data.responses.length; pos++) {
        if (resp['Q' + pos.toString()] === 'Reveal Answer') {
            questionText = questionScores[pos][0];
            questionScore = questionScores[pos][1];
            questionAnswer = questionScores[pos][2];
            text = '> **' + questionText + '**\n\n' + 
                '> **' + questionScore.toString() + '** people upvoted this question\n\n' +
                questionAnswer;
            output.push(text)
        }
    }
    return [converter.makeHtml(output.join('\n'))];
}

/* SURVEY BLOCKS */
var converter = new showdown.Converter();

// Consent Block
// Asks participants for consent
var consentBlock = {
    type: 'survey-multi-choice',
    preamble: [converter.makeHtml(literals.consentPage)],
    required: [true],
    questions: ['Do you consent to participate?'],
    options: [[
        'I do not consent to participate',
        'I consent to participate'
    ]],
    on_finish: function(data) {
        var resp = JSON.parse(data.responses);
        if (resp.Q0 === "I do not consent to participate") {
            jsPsych.endExperiment(converter.makeHtml(literals.consentFailureMessage));
        }
    }
};

// PHASE I
// Instruction Block
// Displays intructions
var instructionsBlock = {
    type: 'instructions',
    pages: [converter.makeHtml(literals.instructionsOne)],
    show_clickable_nav: true
};

// Likert Questions Block
// Create template for likert questions and fills the judgements in randomized order
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
var questionScores = assignScores(questionsAndAnswers);
fillJudgementBlock(judgementBlock, questionScores);

// PHASE II
// Instruction Block
// Display instructions
var instructionsTwoBlock = {
    type: 'instructions',
    pages: [converter.makeHtml(literals.instructionsTwo)],
    show_clickable_nav: true
};

// Choose Block
// Prompt users for 5 question to see the responses for
var chooseBlock = {
    preamble: [converter.makeHtml(literals.choosePage)],
    type: 'survey-multi-choose',
    limit: 5,
    randomize_order: false,
    required: [true, true, true, true, true],
    options: ['Reveal Answer', 'Keep Hidden'],
    questions: [],
};

fillChooseBlock(chooseBlock, questionScores);

// Displays answers to questions choosen questions
var displayBlock = {
    type: 'instructions',
    pages: function () {
        return fillDisplayBlock( 
            questionScores,
            jsPsych.data.getLastTrialData()
        );
    },
    show_clickable_nav: true
};

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
        jsPsych.endExperiment(converter.makeHtml(literals.thankYouMessage));
    }
};

/* RUN EXPERIMENT */
var timeline = [
    consentBlock,
    instructionsBlock,
    judgementBlock,
    instructionsTwoBlock,
    chooseBlock,
    displayBlock,
    bufferBlock
];

jsPsych.init({
    timeline: timeline,
});
