import os
from textstat.textstat import textstat

SUBJECTS = ['Mathematics', 'Biology', 'Economics', 'Culture', 'Chemistry',
            'Physics', 'Engineering', 'Technology', 'Repost', 'Other']
Q_TYPES = ['How', 'Why', 'What', 'When']
NEGATION = ['Positive', 'Negative']
SUFFIXES = ['2017-10-02', '2017-10-16', '2017-10-25', '2017-11-01']
CURRENTS = ['../output/' + suffix + '.txt' for suffix in SUFFIXES]


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
