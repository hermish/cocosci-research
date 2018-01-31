from utilities import read_credentials, scrape_data, write_json_file
from extractors import get_posts_alt

FILE_NAME = '../private/credentials/reddit.txt'
OUTPUT = '../private/output/2018-01-24.txt'

# EXTRACTOR
OPTIONS = {'subreddits': ['explainlikeimfive'],
           'mode': 'top',
           'time_filter': 'week',
           'num_comments': 5,
           'sub_coerce': ['_reddit', 'subreddit', 'author'],
           'com_coerce': ['_replies', '_reddit', '_submission',
                          'author', 'subreddit']}
EXTRACTOR = lambda reddit: get_posts_alt(reddit, **OPTIONS)

if __name__ == '__main__':
    credentials = read_credentials(FILE_NAME)
    result_gen = scrape_data(*credentials, EXTRACTOR)
    write_json_file(result_gen, OUTPUT)
