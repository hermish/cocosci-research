from utilities import read_credentials, scrape_data, write_file
from extractors import test_extractor, get_posts


FILE_NAME = '../credentials/reddit.txt'
OUTPUT = '../output/2017-11-01.txt'
OPTIONS = {'subreddits': ['explainlikeimfive'],
           'mode': 'top',
           'time_filter': 'week',
           'num_comments': 5,
           'sub_coerce': ['_reddit', 'subreddit', 'author'],
           'com_coerce': ['_replies', '_reddit', '_submission',
                          'author', 'subreddit']}
EXTRACTOR = lambda reddit: get_posts(reddit, **OPTIONS)

credentials = read_credentials(FILE_NAME)
result = scrape_data(*credentials, EXTRACTOR)
write_file(result, OUTPUT)
