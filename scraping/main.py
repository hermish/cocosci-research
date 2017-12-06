from utilities import ContentRow, read_credentials, scrape_data, write_json_file
from extractors import get_posts, top_comments, get_posts_alt

FILE_NAME = '../credentials/reddit.txt'
OUTPUT = '../output/2017-11-25.txt'

# EXTRACTOR
OPTIONS = {'subreddits': ['explainlikeimfive'],
           'mode': 'top',
           'time_filter': 'week',
           'num_comments': 5,
           'sub_coerce': ['_reddit', 'subreddit', 'author'],
           'com_coerce': ['_replies', '_reddit', '_submission',
                          'author', 'subreddit']}
EXTRACTOR = lambda reddit: get_posts_alt(reddit, **OPTIONS)

credentials = read_credentials(FILE_NAME)
result_gen = scrape_data(*credentials, EXTRACTOR)
write_json_file(result_gen, OUTPUT)

# CSV EXPERIMENTS
# NEW_OPTIONS = {'subreddit': 'explainlikeimfive',
#                'time_filter': 'week',
#                'num_comments': 5}
# NEW_EXTRACTOR = lambda reddit: top_comments(reddit, **NEW_OPTIONS)
# LOCATIONS = {'comment': OUTPUT + 'comment',
#              'post': OUTPUT + 'post'}
