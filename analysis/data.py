import json
import scipy.stats
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from textstat.textstat import textstat


CURRENT = '../output/2017-10-06.txt'


class RedditDataJSON:
    """
    A class representing the parsed reddit data stored as JSON Objects.
    Methods allow for quick analyses of data using matplotlib
    """
    post_codes = ['posts', 'post', 'p']
    comment_codes = ['comments', 'comment', 'c', 'com']

    def __init__(self, data):
        """
        :param data:
        """
        self.posts, self.comment_groups, self.comments = [], [], []
        for entry in data:
            self.posts.append(entry[0])
            self.comment_groups.append(entry[1:])
            self.comments.extend(entry[1:])

    @classmethod
    def from_file(cls, file):
        """
        :param file: (file) the which to read data from
        :return: (RedditDataJSON) created object using data
        """
        data = json.load(file)
        return cls(data)

    @classmethod
    def from_filename(cls, filename):
        """
        :param filename: (str) the filme which to read data from
        :return: (RedditDataJSON) created object using data
        """
        file = open(filename, 'r')
        return cls.from_file(file)

    def get_attr(self, attr, sub_type):
        """
        :param attr: (str) the attribute to retrieve
        :param sub_type: (str) a code indicating whether to look at posts or comments
        :return: [obj] a list containing the specied attribute for each type
        :raise TypeError: when type does not match any identifier for posts or comments
        """
        if sub_type in self.post_codes:
            return [post[attr] for post in self.posts]
        elif sub_type in self.comment_codes:
            return [comment[attr] for comment in self.comments]
        raise TypeError

    def plot_attr(self, sub_type, xvar, yvar, xfunc, yfunc):
        """
        :param xvar: (str) name of the attribute to use as x values
        :param yvar: (str) name of the attribute to use as y values
        :param xfunc: (func) function to apply to each x-value
        :param yfunc: (func) function to apply to each y-value
        :return: (None) plots the images of the x- and y-values
        """
        xs = [xfunc(x) for x in self.get_attr(xvar, sub_type)]
        ys = [yfunc(y) for y in self.get_attr(yvar, sub_type)]

        plt.plot(xs, ys)
        plt.xlabel(xvar)
        plt.ylabel(yvar)
        plt.show()

    def plot_lin_regress(self, sub_type, xvar, yvar, xfunc, yfunc):
        """
        :param xvar: (str) name of the attribute to use as x values
        :param yvar: (str) name of the attribute to use as y values
        :param xfunc: (func) function to apply to each x-value
        :param yfunc: (func) function to apply to each y-value
        :return: plots the images of the x- and y-values and returns the
            coefficient of correlation (r squared) for the linear
            regression
        """
        # Generate points
        xs = [xfunc(x) for x in self.get_attr(xvar, sub_type)]
        ys = [yfunc(y) for y in self.get_attr(yvar, sub_type)]

        # Perform analysis
        fit = np.polyfit(xs, ys, 1)
        fit_fn = np.poly1d(fit)
        results = scipy.stats.linregress(xs, ys)
        r_value = results[2]

        # Plot results
        plt.plot(xs, ys, 'yo', xs, fit_fn(xs), '--k')
        plt.xlabel(xfunc.__name__ + '(' + xvar + ')')
        plt.ylabel(yfunc.__name__ + '(' + yvar + ')')
        plt.show()

        return r_value ** 2


def test():
    """
    Function used primarily for interactive testing
    """
    setup = "import os; os.chdir('analysis')"
    exec(setup)
