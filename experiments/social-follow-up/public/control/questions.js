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
var questionsAndAnswers = {
    questions: [
        'Do multivitamins and Omega-3 pills actually do anything? or is it more of a placebo-type thing?',
        "What happens that makes beer taste terrible after warming up and then re-chilling? What makes beer 'skunky'?",
        "Why do some alcoholics suffer life threatening withdrawl symptoms when others with the same drinking habits don't when they quit?",
        "In cartoons, certain clothing patterns such as checkered or plaid, it seems like it's a static pattern that the characters move around on. Why is this, and how is it done?",
        'Why are bubbles round?',
        'How do activated carbon filters work?',
        "How do breeders ensure diversity among their animals' offspring? Wouldn't they have to constantly buy new breeding pairs?",
        'How can alcohol withdrawal or detox kill you?',
        "What gives something it's taste? Does pyrite taste like table salt because they are both cubes?",
        'How does the Federal Reserve figure out how much money to print/mint each year?'
    ],
    answers: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10'
    ]
};
