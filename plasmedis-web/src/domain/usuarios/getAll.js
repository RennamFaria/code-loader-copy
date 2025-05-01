import {get, has, isEmpty, isNil} from 'lodash';
import stringify from '../../utils/stringify';
import api from '../../services/api';

export default async function getAll(token, page, limit) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  const queryString = {};
  if (page != null) queryString.page = page;
  if (limit != null) queryString.limit = limit;

  try {
    const usersPage = await api.get(`users${stringify(queryString)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!has(usersPage, 'data')) return null;

    return {
      users: get(usersPage, 'data.users', []).map((user) => ({
        id: get(user, 'id'),
        type: get(user, 'type'),
        name: get(user, 'name'),
        username: get(user, 'username'),
        active: get(user, 'active'),
        email: get(user, 'email'),
        has_data: get(user, 'has_data'),
        has_accepted_terms: get(user, 'has_accepted_terms'),
      })),
      count: get(usersPage, 'data.count'),
      current: get(usersPage, 'data.current'),
      limit: get(usersPage, 'data.limit'),
      next: get(usersPage, 'data.next'),
      previous: get(usersPage, 'data.previous'),
    };
  } catch (e) {
    // eslint-disable-next-line no-alert
    alert('Erro ao encontar informações');
    return null;
  }
}
