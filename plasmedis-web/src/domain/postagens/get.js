import {get, has, isEmpty, isNil, isString} from 'lodash';
import moment from 'moment';

import api from '../../services/api';

// eslint-disable-next-line func-names
export default async function (token, id) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  if (isNil(id) || (isEmpty(id) && isString(id)))
    throw new Error('Id da postagem não foi informado');

  try {
    const post = await api.get(`/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!has(post, 'data')) return null;

    return {
      id: get(post, 'data.id'),
      title: get(post, 'data.titulo'),
      description: get(post, 'data.texto'),
      category: {
        id: get(post, 'data.categoria'),
        name: '<API NÃO ESTÁ ENVIANDO>',
      },
      author: {
        id: get(post, 'data.created.user'),
        name: get(post, 'data.created.name'),
        avatar: '<API NÃO ESTÁ ENVIANDO>',
      },
      dateTime: moment(`${get(post, 'data.created.date')}Z`),
      verified: get(post, 'data.selo'),
      comments: get(post, 'data.comments', []).map((comentario) => ({
        id: comentario.id,
        author: {
          id: get(comentario, 'created.user'),
          name: get(comentario, 'created.name'),
          avatar: '<API NÃO ESTÁ ENVIANDO>',
        },
        post: get(comentario, 'postagem'),
        dateTime: moment(`${get(comentario, 'created.date')}Z`),
        body: get(comentario, 'texto'),
      })),
    };
  } catch (error) {
    alert('Erro ao buscar a postagem');
    return null;
  }
}
