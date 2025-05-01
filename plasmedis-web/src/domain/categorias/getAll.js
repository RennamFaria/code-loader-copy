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
    const categoriesPage = await api.get(
      `categories${stringify(queryString)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!has(categoriesPage, 'data')) return null;

    return {
      categories: get(categoriesPage, 'data.categories', []).map(
        (categoria) => ({
          id: get(categoria, 'id'),
          name: get(categoria, 'name'),
          posts: get(categoria, 'posts'),
        }),
      ),
      count: get(categoriesPage, 'data.count'),
      current: get(categoriesPage, 'data.current'),
      limit: get(categoriesPage, 'data.limit'),
      next: get(categoriesPage, 'data.next'),
      previous: get(categoriesPage, 'data.previous'),
    };
  } catch (error) {
    alert('Erro ao buscar as categorias');
    return null;
  }
}
