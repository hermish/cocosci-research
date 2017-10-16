import json
import scipy.stats
import matplotlib.pyplot as plt
import numpy as np
from statsmodels.tsa.stattools import adfuller
import collections

import seaborn as sns


CURRENT = '../output/2017-10-16*.txt'
TIME = 'created_utc'
PERC_LABELS = ('Bottom', 'Middle', 'Top')


class RedditDataJSON:
    """
    A class representing the parsed reddit data stored as JSON Objects.
    Methods allow for quick analyses of data using matplotlib
    """

    def __init__(self, data):
        """
        :param data:
        """
        self.posts, self.comment_groups = [], []
        for entry in data:
            self.posts.append(entry[0])
            self.comment_groups.append(entry[1:])

    @property
    def best_comments(self):
        """
        :return: [dict]
        """
        return [comments[0] for comments in self.comment_groups]

    @property
    def size(self):
        """
        :return: (int, int) the dimension: number of posts by the number of comments
            per each post (assume these are identical.
        """
        return len(self.posts), len(self.comment_groups[0])

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

    @staticmethod
    def get_axis_label(func, var):
        """
        :param func: (func) the or key function
        :param var: (str) the name of variable
        :return: (str) a descriptive label for the graph
        """
        return func.__name__ + '(' + var + ')'

    @staticmethod
    def get_chunks(sorted_values, width):
        """
        :param width: the number of elements in each group
        :param sorted_values: [obj] a pre-sorted array from which to select objects
        :return: ([obj], [obj], [obj]) a tuple containing the the sorted values for the
            top, middle and bottom group respective
        """
        radius = width // 2
        mid = len(sorted_values) // 2

        return (sorted_values[-width - 1:],
                sorted_values[mid - radius: mid + radius],
                sorted_values[:width])

    @staticmethod
    def get_descriptives(*args):
        """
        :param args: [num]... lists of integer or float values
        :return: (dict) a dictionary of descriptives, whose values are lists containing
            a value for each of the supplied arguments
        """
        means = [np.mean(lst) for lst in args]
        errors = [scipy.stats.sem(lst) for lst in args]
        maxs = [max(lst) for lst in args]
        mins = [min(lst) for lst in args]
        sizes = [len(lst) for lst in args]

        return {'means': means,
                'errors': errors,
                'maxs': maxs,
                'mins': mins,
                'sizes': sizes}

    def get_post_attr(self, attr):
        """
        :param attr: (str) the attribute to retrieve
        :return: [obj] a list containing the specified attribute for each post
        :raise KeyError: when attribute does not match any post attribute
        """
        return [post[attr] for post in self.posts]

    def get_com_attr(self, attr):
        """
        :param attr: (str) the attribute to retrieve
        :return: [obj] a list containing the specified attribute for each post
        :raise KeyError: when attribute does not match any post attribute
        """
        return [post[attr] for post in self.comments]

    def plot_post(self, xvar, yvar, xfunc, yfunc):
        """
        :param xvar: (str) name of the attribute to use as x values
        :param yvar: (str) name of the attribute to use as y values
        :param xfunc: (func) function to apply to each x-value
        :param yfunc: (func) function to apply to each y-value
        :return: (None) plots the images of the x- and y-values
        """
        xs = [xfunc(x) for x in self.get_post_attr(xvar)]
        ys = [yfunc(y) for y in self.get_post_attr(yvar)]

        plt.plot(xs, ys)
        plt.xlabel(xvar)
        plt.ylabel(yvar)
        plt.show()

    def plot_post_scatter(self, xvar, yvar, xfunc, yfunc):
        """
        :param xvar: (str) name of the attribute to use as x values
        :param yvar: (str) name of the attribute to use as y values
        :param xfunc: (func) function to apply to each x-value
        :param yfunc: (func) function to apply to each y-value
        :return: (dict) plots the images of the x- and y-values and returns the
            coefficient of correlation (r squared) for the linear
            regression
        """

        # Generate points
        xs = [xfunc(x) for x in self.get_post_attr(xvar)]
        ys = [yfunc(y) for y in self.get_post_attr(yvar)]

        # Perform analysis
        fit = np.polyfit(xs, ys, 1)
        fit_fn = np.poly1d(fit)
        results = scipy.stats.linregress(xs, ys)
        r_value = results[2]

        # Plot results
        plt.plot(xs, ys, 'yo', xs, fit_fn(xs), '--k')
        plt.xlabel(self.get_axis_label(xfunc, xvar))
        plt.ylabel(self.get_axis_label(yfunc, yvar))
        plt.show()

        return {'r_squared': r_value ** 2}

    def plot_post_hist(self, func, attr):
        """
        :param func: function to apply to each x-value
        :param attr: the attribute to be included in the histogram
        :return: (dict) a list of useful descriptives for the
        list of values
        """
        values = [func(x) for x in self.get_post_attr(attr)]

        plt.hist(values)
        plt.xlabel(self.get_axis_label(func, attr))
        plt.ylabel('count')

        return {'mean': np.mean(values),
                'errors': scipy.stats.sem(values),
                'max': max(values),
                'min': min(values)}

    def post_test_stationary(self, attr, func):
        """
        :param attr: (str) the post attribute to test is stationary with time
        :param func: (func) the function to apply to this attribute
        :return: (dict) plots the time series as a scatter and returns
            descriptive results of running an augmented Dickey–Fuller test
        """
        def identity(x):
            return x

        output = self.plot_post_scatter(TIME, attr, identity, func)
        decorated = [(func(x), time) for x, time in
                     zip(self.get_post_attr(attr), self.get_post_attr(TIME))]
        decorated.sort(key=lambda pair: pair[1])
        values = [pair[0] for pair in decorated]

        adf_result = adfuller(values)
        results_update = {
            'adf_statistic': adf_result[0],
            'p-value': adf_result[1],
            'usedlag': adf_result[2]
        }

        return {**output, **results_update}

    def post_perc_groups(self, perc_range, rank_attr, attr, func):
        """
        :param perc_range: (float) the size of the groups top, middle and bottom
        :param rank_attr: (str) the attribute from which to sort into these groups
        :param attr: (str) the raw attribute to measure for group
        :param func: (func) a function which converts this atrribute into a quantitative
            value to plot
        :return: (dict) a graph of the top, middle and bottom groups along with the
            results of running an ANOVA test
        """
        decorated = [(func(x), rank) for x, rank in
                     zip(self.get_post_attr(attr), self.get_post_attr(rank_attr))]
        decorated.sort(key=lambda pair: pair[1])

        values = [pair[0] for pair in decorated]
        width = int(perc_range * len(decorated))
        top, middle, bottom = self.get_chunks(values, width)
        descriptives = self.get_descriptives(bottom, middle, top)

        # Plots graph
        index = np.arange(3)
        plt.bar(index, descriptives['means'], yerr=descriptives['errors'])
        plt.xlabel('Groups by ' + rank_attr)
        plt.ylabel(self.get_axis_label(func, attr))
        plt.xticks(index, PERC_LABELS)
        plt.show()

        # Performs ANOVA, returns descriptives
        f_val, p_val = scipy.stats.f_oneway(bottom, middle, top)
        additional = {'anova_f': f_val, 'p-value': p_val}
        return {**descriptives, **additional}

    def compare_groups(self, group_labels, group_func, group_attr, attr, func):
        """
        :param group_labels: [str] the names of each of the categories
        :param group_func: (func) a function which takes an attribute and returns either
            the label of the group which it is in, or the empty string, if it is not
            to be include
        :param group_attr: the attribute on which the grouping is based
        :param attr: the attribute which the y-values will be based on
        :param func: a function which takes in this attribute and returns the values
            which compose the height of the graph
        :return:
        """
        num_groups = len(group_labels)
        group_map = {label: num for label, num in
                     zip(group_labels, range(num_groups))}
        groups = [[] for _ in range(num_groups)]
        decorated = [(func(x), group_func(y)) for x, y in
                     zip(self.get_post_attr(attr), self.get_post_attr(group_attr))]
        for value, group in decorated:
            if group:
                groups[group_map[group]].append(value)

        descriptives = self.get_descriptives(*groups)

        index = np.arange(num_groups)
        plt.bar(index, descriptives['means'], yerr=descriptives['errors'])
        plt.xlabel('Groups by ' + self.get_axis_label(group_func, group_attr))
        plt.ylabel(self.get_axis_label(func, attr))
        plt.xticks(index, group_labels)
        plt.show()

        f_val, p_val = scipy.stats.f_oneway(*groups)
        additional = {'anova_f': f_val, 'p-value': p_val, 'vars': group_labels}
        return {**descriptives, **additional}

    def categorical_counts(self, attr, func):
        values = [func(x) for x in self.get_post_attr(attr)]
        counter = collections.Counter(values)
        labels, heights = list(counter.keys()), list(counter.values())

        index = np.arange(len(labels))
        plt.bar(index, heights)
        plt.xlabel(self.get_axis_label(func, attr))
        plt.ylabel('counts')
        plt.xticks(index, labels)
        plt.show()

        return {'counts': heights}

