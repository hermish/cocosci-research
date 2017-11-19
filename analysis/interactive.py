import os
import pandas as pd
from textstat.textstat import textstat

SUBJECTS = ['Mathematics', 'Biology', 'Economics', 'Culture', 'Chemistry',
            'Physics', 'Engineering', 'Technology', 'Repost', 'Other']
Q_TYPES = ['How', 'Why', 'What', 'When']
NEGATION = ['Positive', 'Negative']
NAMES = ['2017-10-02', '2017-10-16', '2017-10-25', '2017-11-01', '2017-11-13']
CURRENTS = ['../output/' + name + '.txt' for name in NAMES]
CONCRETE = '../supplementary/word-database.csv'

concrete_file = pd.read_csv(CONCRETE)
DATABASE = dict(zip(concrete_file['Word'], concrete_file['Conc.M']))

def reset():
    cwd = os.getcwd()
    target = cwd + '/datajson.py'
    runfile(target)
    return RedditDataJSON.from_filenames(CURRENTS)


# UTILITIES
def identity(x):
    return x


def question_type(text):
    """
    :param text: (str) a string representing a question
    :return: (str) a naive classification of the question type, looking for
        key question words
    """
    if 'how' in text or 'How' in text:
        return 'How'
    if 'why' in text or 'Why' in text:
        return 'Why'
    if 'what' in text or 'What' in text:
        return 'What'
    if 'when' in text or 'When' in text:
        return 'When'
    return ''


def has_negation(text):
    """
    :param text: (str) a string representing a question
    :return: (str) a naive classification of whether or not a question contains
        negation.
    """
    signals = ['not', "n't", 'instead', 'opposed']
    for signal in signals:
        if signal in text:
            return 'Negative'
    return 'Positive'


def concrete_score(text):
    words = text.split()
    total = 0
    for word in words:
        if word in DATABASE:
            total += DATABASE[word]
    return total
