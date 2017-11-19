import praw
import json


class ContentRow:
    """
    A class representing a row of data in a csv file, generated from arbitrary
    objects, with a label.
    """
    def __init__(self, type, obj, num):
        """
        :param type: (str) the type of the object being described as a row
        :param obj: (obj) the object being coerced into a csv
        :param num: (num) the number corresponding the object, or rather, the
            row number
        """
        self.num = num
        self.type = type
        obj_dict = vars(obj)
        self.attributes = sorted(obj_dict)
        self.values = [obj_dict[key] for key in self.attributes]

    def __str__(self):
        output = [str(item) for item in self.values]
        for pos in range(output):
            updated = repr(output[pos])
            if ',' in output[pos]:
                updated = output[pos]
        prefix = str(self.num) + ','
        return prefix + ','.join(output)

    @staticmethod
    def convert_to_csv(content_iter, file_names):
        """
        :param content_iter: (gen) a generator of content rows, perhaps with
            rows of multiple different types
        :param file_names: {str: str} a dictionary which maps the type of row
            to the corresponding filename in which it belongs
        :return: (None) writes to each of these files
        """
        type_to_file = {type: open(name, 'w') for
                        type, name in file_names.items()}
        for row in content_iter:
            file = type_to_file[row.type]
            file.write(str(row))
            file.write('/n')
        for open_file in type_to_file.values():
            open_file.close()


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
    Creates and returns a generator which provides a sequence of outputs to be
        written.
    :param client_id: (str) client id for the Reddit API
    :param secret: (str) client secret for the Reddit API
    :param agent: (str) user agent description
    :param extractor: function which extracts the desired information from
        reddit
    :return: a generator which yields
    """
    reddit = praw.Reddit(client_id=client_id,
                         client_secret=secret,
                         user_agent=agent)
    return extractor(reddit)


def write_json_file(result_gen, output_file):
    """
    Writes the contents of the generator into the output file.
    :param result_gen: (generator) stream of strings to write
    :param output_file: (str) the name of the file
    :return: none
    """
    later = False
    with open(output_file, 'a') as file:
        file.write('[')
        for item in result_gen:
            if later:
                file.write(',')
            json_str = json.dumps(item, indent=4)
            file.write(json_str)
            later = True
        file.write(']')


def track_call(func):
    """
    :param func: (func) the function to be modified
    :return: (func) a new function with the same behaviour, however with a count
        attribute which keeps track of how many time exactly the function was
        called
    """
    def wrapper(*args, **kwargs):
        wrapper.count += 1
        return func(*args, **kwargs)
    wrapper.count = 0
    return wrapper


def make_verbose(before, after):
    """
    :param before: (bool) whether the arguments should be printed before the
        function call
    :param after: (bool) whether the result should be printed after the
        function call
    :return: (func) a decorator which replaces a function which the verbose
        version as specified by its arguments
    """
    def wrapper(func):
        def verbose(*args, **kwargs):
            if before:
                print(*args, **kwargs)
            output = func(*args, **kwargs)
            if after:
                print(output)
            return output
        return verbose
    return wrapper
