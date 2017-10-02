import time

TEST_SUB = 'explainlikeimfive'
API_LIMIT = 30
SLEEP_TIME = 60


def map_to_values(func, dictionary):
    """
    :param func: (function) function to be mapped
    :param dictionary: (dict) the original hash map
    :return: (dict) new dictionary with different values,
        mapping the function to the values of the dictionary
    """
    return {key: func(value) for key, value in dictionary.items()}


def respect_limit(requests):
    """
    :param requests: (int) the current number of
    :return: (int) an updated number of requests, sleeping the required amount of
        time and resetting if an additional call would push the requests over the
        specified limit
    """
    if requests + 1 > API_LIMIT:
        time.sleep(SLEEP_TIME)
        return 0
    return requests + 1


def get_posts(reddit, subreddits, mode, time_filter, num_comments):
    """
    :param reddit: (reddit) an possibly unauthenticated reddit instance
    :param subreddits: [str] the subreddits to pull data from
    :param mode: (str) the string referring to browsing mode, for example 'rising'
    :param time_filter: (str) the time period for the mode selected
    :param num_comments: (int) the
    :return: (gen) a generator which returns, at every successive call, list of each
        post and the requested number of top comments until exhaustion
    """
    requests = 0
    for sub in subreddits:
        subreddit = reddit.subreddit(sub)
        post_gen = getattr(subreddit, mode)(time_filter=time_filter)
        requests = respect_limit(requests)
        for submission in post_gen:
            requests = respect_limit(requests)
            output = [map_to_values(str, vars(submission))]
            comments_left = num_comments
            requests = respect_limit(requests)
            for comment in submission.comments:
                requests = respect_limit(requests)
                if not comments_left:
                    break
                output.append(map_to_values(str, vars(comment)))
                comments_left -= 1
            yield output


def test_extractor(reddit):
    """
    :param reddit: (reddit) a possibly unauthenticated reddit instance
    :return: (str) yields 1 submission followed by all its comments
    """
    subreddit = reddit.subreddit(TEST_SUB)
    for submission in subreddit.top(time_filter='all', limit=1):
        yield map_to_values(str, vars(submission))
        for comment in submission.comments:
            yield map_to_values(str, vars(comment))
