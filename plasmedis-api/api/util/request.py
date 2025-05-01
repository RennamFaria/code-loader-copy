from flask import request as req


def get_boolean_arg(name, default=True):
    value = req.args.get(name, default=default)
    if value is None:
        return None

    return False if value == 'false' else True


def get_integer_list_arg(name, default=None):
    value = req.args.get(name, None)
    if value is None:
        return default

    return map(int, value.split(','))


def get_string_list_arg(name, default=None):
    value = req.args.get(name, None)
    if value is None:
        return default

    return value.split(',')


def get_path_without_pagination_args():
    path = req.path + '?'
    for arg in req.args.keys():
        if arg not in ['page', 'limit']:
            path += f'{arg}={req.args.get(arg)}&'

    return path

def get_pagination_arg(default_page=1, default_limit=10):
    page = req.args.get("page", default_page)
    limit = req.args.get("limit", default_limit)

    return map(int, [page, limit])
