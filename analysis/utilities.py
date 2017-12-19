import pprint


def compose(outer, inner):
    """
    :param outer: (func) the outer function, which much take exactly one
        argument, which is the output of the inner function
    :param inner: (func) the inner function, which can take an arbitrary
        number of arguments; the domain of the returned function will be
        equivalent to this.
    :return: (func) the function equivalent to outer . inner
    """
    def composed(*args, **kwargs):
        first = inner(*args, **kwargs)
        second = outer(first)
        return second
    return composed


def compose_single(*args):
    """
    :param args: func... an arbitrary number of functions, where all but the
        last must be single-argument arguments
    :return: (func) the function equivalent to applying each this function's
        arguments from right to left on the input(s)
    """
    func_list = args

    def composed(*args, **kwargs):
        func_iter = reversed(func_list)
        output = next(func_iter)(*args, **kwargs)
        for func in func_iter:
            output = func(output)
        return output
    return composed


def value(x):
    """
    :param x: (obj) input
    :return: (int) the integer value of the input
    """
    return int(x)


def identity(x):
    """
    :param x: (obj) arbitrary input
    :return: (obj) the input, acting as the identity function
    """
    return x


def head(lst, num=6, out=False):
    """
    :param lst: [obj] arbitrary list
    :param num: (int) the number of elements to display, set as 6 if not
        specified, but defaults to the entire list if num is greater then the
        length
    :param out: (bool) whether or not the sublist that is printed should also
        returned
    :return: [obj] print and returns the first n elements of the list if out
        is set to True, otherwise returns None
    """
    output = lst[:num]
    pprint.pprint(output)
    if out:
        return output


def tail(lst, num=6, out=False):
    """
    :param lst: [obj] arbitrary list
    :param num: (int) the number of elements to display, set as 6 if not
        specified, but defaults to the entire list if num is greater then the
        length
    :param out: (bool) whether or not the sublist that is printed should also
        returned
    :return: [obj] print and returns the last n elements of the list if out
        is set to True, otherwise returns None
    """
    output = lst[-num - 1:]
    pprint.pprint(output)
    if out:
        return output
