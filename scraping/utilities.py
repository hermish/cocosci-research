import praw
import json

def read_only_credientials(file_name):
	data = open(file_name)
	information = [line.rstrip() for line in data]
	return information

def unauthorized_user(file_name):
	client_id, secret, agent = read_only_credientials(file_name)
	reddit = praw.Reddit(client_id=client_id,
		client_secret=secret,
		user_agent=agent)
	return reddit

def download_info(reddit, sub, output_file, extractor):
	subreddit = reddit.subreddit(sub)
	top_gen = subreddit.top(time_filter='all')
	outputs = []
	with open(output_file, 'w') as file:
		for submission in top_gen:
			outputs.append(extractor(submission))
		json_str = json.dumps(outputs)
		file.write(json_str)

def extract_sub_info(submission):
	everything = vars(submission)
	printable = {key:str(value) for key, value in everything.items()}
	return printable
