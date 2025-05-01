def get_paginated_list(result_field_name, all_entries, url, page, limit):
    count = len(all_entries)
    start = limit * (page - 1) + 1
    if (start > count or limit < 1 or page < 1) and count != 0:
        return {}

    previous_url = ''
    if start > 1:
        previous_url = url + f"page={page - 1}&limit={limit}"

    next_url = ''
    if start + limit <= count:
        next_url = url + f"page={page + 1}&limit={limit}"

    return {'count': count, 'current': page, 'limit': limit, 'previous': previous_url, 'next': next_url,
            result_field_name: all_entries[(start - 1):(start - 1 + limit)]}
