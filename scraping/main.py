import praw
from utilities import *

CREDENTIALS = 'credentials.txt'
OUTPUTS = ['output.txt']
SUBREDDITS = ['explainlikeimfive']
EXTRACTOR = extract_sub_info

reddit = unauthorized_user(CREDENTIALS)
for sub, out in zip(SUBREDDITS, OUTPUTS):
	download_info(reddit, sub, out, EXTRACTOR)