from utilities import read_credentials, scrape_data, write_file
from extractors import test_extractor, get_posts


FILE_NAME = 'credentials.txt'
OUTPUT = 'output.txt'
OPTIONS = {'subreddits': ['explainlikeimfive'],
           'mode': 'top',
           'time_filter': 'week',
           'num_comments': 5,
           'ignore_sub': ['_reddit', ],
           'ignore_com': ['_replies', '_reddit']}
EXTRACTOR = lambda reddit: get_posts(reddit, **OPTIONS)

credentials = read_credentials(FILE_NAME)
result = scrape_data(*credentials, EXTRACTOR)
write_file(result, OUTPUT)