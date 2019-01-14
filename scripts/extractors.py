import time
import json
from utilities import make_verbose, ContentRow

TEST_SUB = 'explainlikeimfive'
API_LIMIT = 30
SLEEP_TIME = 65


def is_serializable(obj):
    """
    :param obj: object to check
    :return: (bool) whether or not the object can be json serialized
    """
    try:
        json.dumps(obj)
        return True
    except TypeError:
        return False


def change_attributes(dictionary, to_change, func):
    """
    :param dictionary: (dict)
    :param to_change: [str] the dictionary keys which have values to be
        transformed
    :param func: (func) the function to be applied
    :return: (dict) new dictionary with different values, mapping the function
        to the values of the dictionary which are in
    """
    return {key: (func(value) if key in to_change else value) for
            key, value in dictionary.items()}


def map_to_values(func, dictionary):
    """
    :param func: (function) function to be mapped
    :param dictionary: (dict) the original hash map
    :return: (dict) new dictionary with different values,
        mapping the function to the values of the dictionary
    """
    return {key: func(value) for key, value in dictionary.items()}


@make_verbose(True, False)
def respect_limit(requests):
    """
    :param requests: (int) the current number of
    :return: (int) an updated number of requests, sleeping the required amount
        of time and resetting if an additional call would push the requests over
        the specified limit
    """
    if requests + 1 > API_LIMIT:
        time.sleep(SLEEP_TIME)
        return 1
    return requests + 1


def create_limiter(max_calls, sleep_time):
    """
    :param max_calls: (int) the max number of calls which are allowed before the
        function needs to halt.
    :param sleep_time: (int) the time in seconds for the function to halt, if
        going over the max number of calls
    :return: None
    """
    limit = 0

    def limiter():
        nonlocal limit
        limit += 1
        print(limit)
        if limit > max_calls:
            time.sleep(sleep_time)
            limit = 1
    return limiter



def get_posts(reddit, subreddits, mode, time_filter, num_comments, sub_coerce,
              com_coerce):
    """
    :param reddit: (reddit) an possibly unauthenticated reddit instance
    :param subreddits: [str] the subreddits to pull data from
    :param mode: (str) the string referring to browsing mode, for example
        'rising'
    :param time_filter: (str) the time period for the mode selected
    :param num_comments: (int) the number of comments to select
    :param sub_coerce: [str] list of attributes for submissions to coerce to
        strings
    :param com_coerce: [str]list of attributes for comments to coerce to strings
    :return: (gen) a generator which returns, at every successive call, list of
        each post and the requested number of top comments until exhaustion
    """
    requests = 1
    for sub in subreddits:
        subreddit = reddit.subreddit(sub)
        post_gen = getattr(subreddit, mode)(time_filter=time_filter)
        requests = respect_limit(requests)
        for submission in post_gen:
            requests = respect_limit(requests)
            output = [change_attributes(vars(submission), sub_coerce, str)]
            comments_left = num_comments
            requests = respect_limit(requests)
            for comment in submission.comments:
                requests = respect_limit(requests)
                if not comments_left:
                    break
                output.append(change_attributes(vars(comment), com_coerce, str))
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


def get_posts_alt(reddit, subreddits, mode, time_filter, num_comments,
                  sub_coerce, com_coerce):
    """
    :param reddit: (reddit) an possibly unauthenticated reddit instance
    :param subreddits: [str] the subreddits to pull data from
    :param mode: (str) the string referring to browsing mode, for example
        'rising'
    :param time_filter: (str) the time period for the mode selected
    :param num_comments: (int) the number of comments to select
    :param sub_coerce: [str] list of attributes for submissions to coerce to
        strings
    :param com_coerce: [str] list of attributes for comments to coerce to
        strings
    :return: (gen) a generator which returns, at every successive call, list of
        each post and the requested number of top comments until exhaustion
        """
    limiter = create_limiter(API_LIMIT, SLEEP_TIME)
    for sub in subreddits:
        subreddit = reddit.subreddit(sub)
        post_generator = getattr(subreddit, mode)(time_filter=time_filter)
        limiter()
        for submission in post_generator:
            limiter()
            output = [change_attributes(vars(submission), sub_coerce, str)]
            for _, comment in zip(range(num_comments), submission.comments):
                limiter()
                output.append(change_attributes(vars(comment), com_coerce, str))
            yield output


def top_comments(reddit, subreddit, time_filter, num_comments):
    """
    :param reddit: (reddit) an possibly unauthenticated reddit instance
    :param subreddit: (str) the subreddits to pull data from
    :param time_filter: (str) the time period for the mode selected
    :param num_comments: (int) the number of comments to select
    :return:
    """
    limiter = create_limiter(API_LIMIT, SLEEP_TIME)
    sub = reddit.subreddit(subreddit)
    post_generator = sub.top(time_filter=time_filter)
    limiter()
    num = 0
    for submission in post_generator:
        limiter()
        yield ContentRow('post', submission, num)
        for _, comment in zip(range(num_comments), submission.comments):
            limiter()
            yield ContentRow('comment', submission, num)
        num += 1
