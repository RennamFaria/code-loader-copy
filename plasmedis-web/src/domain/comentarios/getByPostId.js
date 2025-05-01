import {get, has, isEmpty, isNil, isString} from 'lodash';
import moment from 'moment';
import stringify from '../../utils/stringify';

import api from '../../services/api';

export default async function getAll(token, post, page, limit) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  if (isNil(post) || (isEmpty(post) && isString(post)))
    throw new Error('Id do post não foi informado');

  const queryString = {};
  if (page != null) queryString.page = page;
  if (limit != null) queryString.limit = limit;

  try {
    const comentarios = await api.get(
      `comments/post/${post}${stringify(queryString)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (comentarios.status === 400) return [];

    return {
      count: get(comentarios, 'data.count'),
      current: get(comentarios, 'data.current'),
      limit: get(comentarios, 'data.limit'),
      previous: get(comentarios, 'data.previous', null),
      next: get(comentarios, 'data.next', null),
      comments: get(comentarios, 'data.comments', []).map((comentario) => ({
        id: get(comentario, 'id'),
        body: get(comentario, 'texto'),
        post: get(comentario, 'postagem'),
        author: {
          id: get(comentario, 'created.user'),
          name: get(comentario, 'created.name'),
          avatar: '<API NÃO ESTÁ ENVIANDO>',
        },
        dateTime: moment(`${get(comentario, 'created.date')}Z`),
      })),
    };
  } catch (error) {
    alert('Erro ao buscar os comentários');
    return null;
  }
}
