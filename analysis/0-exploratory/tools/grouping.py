import pandas as pd

CONCRETE = '../private/supplementary/word-database.csv'
concrete_file = pd.read_csv(CONCRETE)
DATABASE = dict(zip(concrete_file['Word'], concrete_file['Conc.M']))


def question_type(text):
    """
    :param text: (str) a string representing a question
    :return: (str) a naive classification of the question type, looking for
        key question words
    """
    text = text.lower()
    if 'how' in text:
        return 'How'
    elif 'why' in text:
        return 'Why'
    elif 'what' in text:
        return 'What'
    elif 'when' in text:
        return 'When'
    return ''


def has_negation(text):
    """
    :param text: (str) a string representing a question
    :return: (str) a naive classification of whether or not a question contains
        negation.
    """
    signals = ['not', "n't", 'instead', 'opposed', 'rather']
    for signal in signals:
        if signal in text:
            return 'Negative'
    return 'Positive'


def concrete_score(text):
    """
    :param text: (str) a string representing a question
    :return: (int) the sum of the concreteness scores of each word which are found
        in the database
    """
    words = text.split()
    total = 0
    for word in words:
        if word in DATABASE:
            total += DATABASE[word]
    return total


def concrete_score_avg(text):
    """
    :param text: (str) a string representing a question
    :return: (int) the average of the concreteness scores of each word found in
        the concreteness database
    """
    words = text.split()
    total, number = 0, 0
    for word in words:
        if word in DATABASE:
            total += DATABASE[word]
            number += 1
    return total / number if number else 0


def is_viral(score, threshold):
    """
    :param score: (int) the score or a particular post or submission
    :param threshold (int) the threshold that seperates not viral
    :return: (int) classifies the post as either viral or not, given that
        VIRAL_THRESHOLD is previously set, likely basede on 
    """
    if score > threshold:
        return 1
    return 0
