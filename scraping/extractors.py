TEST_SUB = 'explainlikeimfive'
SUBREDDITS = ['explainlikeimfive']


def map_func(func, dictionary):
    """
    Maps a function to the values of a dictionary without mutation
    :param func: (function) function to be mapped
    :param dictionary: (dict) the original hash map
    :return: (dict) new dictionary with different values
    """
    return {key: func(value) for key, value in dictionary.items()}


def test_extractor(reddit):
    """
    Outputs 2 submission each with at most 3 comments each from the test subreddit defined
    :param reddit: (reddit) an unauthenticated reddit instance
    :return: (str) yields information to be written
    """
    subreddit = reddit.subreddit(TEST_SUB)
    top_gen = subreddit.top(time_filter='all', limit=2)
    for submission in top_gen:
        everything, num = vars(submission), 0
        yield map_func(str, everything)
        for comment in submission.comments:
            if num > 2: break
            yield map_func(str, vars(comment))
            num += 1


def get_explanations(reddit):
    """
    Extract desired information from comments
    :param reddit: (reddit) an unauthenticated reddit instance
    :return:
    """
    pass