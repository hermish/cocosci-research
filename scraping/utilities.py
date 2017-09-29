import praw
import json


def read_credentials(file_name):
    """
    Reads and return API credentials from a text file.
    :param file_name: (str) the name of the file which hold this information
    :return: [str] the client_id, secret and agent
    """
    data = open(file_name)
    information = [line.rstrip() for line in data]
    return information


def scrape_data(client_id, secret, agent, extractor):
    """
    Creates and returns a generator which provides a sequence of outputs to be written.
    :param client_id: (str) client id for the Reddit API
    :param secret: (str) client secret for the Reddit API
    :param agent: (str) user agent description
    :param extractor: function which extracts the desired information from reddit
    :return: a generator which yields
    """
    reddit = praw.Reddit(client_id=client_id,
                         client_secret=secret,
                         user_agent=agent)
    return extractor(reddit)


def write_file(result_gen, output_file):
    """
    Writes the contents of the generator into the output file.
    :param result_gen: (generator) stream of strings to write
    :param output_file: (str) the name of the file
    :return: none
    """
    with open(output_file, 'a') as file:
        for item in result_gen:
            json_str = json.dumps(item, indent=4)
            file.write(json_str)
