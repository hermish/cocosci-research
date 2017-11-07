import os
from textstat.textstat import textstat

SUBJECTS = ['Mathematics', 'Biology', 'Economics', 'Culture', 'Chemistry', 'Physics',
            'Engineering', 'Technology', 'Repost', 'Other']
Q_TYPES = ['How', 'Why', 'What', 'When']
NEGATION = ['Positive', 'Negative']


def reset():
    cwd = os.getcwd()
    target = cwd + '/datajson.py'
    runfile(target)
    return RedditDataJSON.from_filenames(CURRENTS)


def reload():
    cwd = os.getcwd()
    target = cwd + '/interactive.py'
    runfile(target)


# UTILITIES
def identity(x):
    return x


def question_type(text):
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
    signals = ['not', "n't", 'instead', 'opposed']
    for signal in signals:
        if signal in text:
            return 'Negative'
    return 'Positive'
