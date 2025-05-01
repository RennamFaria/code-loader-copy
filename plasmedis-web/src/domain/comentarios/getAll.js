import {get, has, isEmpty, isNil} from 'lodash';
import moment from 'moment';

import api from '../../services/api';

export default async function getAll(token) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  const comentarios = await api.get('comments', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (comentarios.status === 400) return null;

  return get(comentarios, 'data.comments', []).map((comentario) => ({
    id: get(comentario, 'id'),
    author: {
      id: get(comentario, 'created.user'),
      name: get(comentario, 'created.name'),
      avatar: '<API NÃO ESTÁ ENVIANDO>',
    },
    post: get(comentario, 'postagem'),
    dateTime: moment(get(comentario, 'created.date')),
    body: get(comentario, 'texto'),
  }));
}
