import {get, has, isEmpty, isNil} from 'lodash';
import api from '../../services/api';

export default async function toggleSelo(token, postagemId) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  try {
    const response = await api.put(`posts/${postagemId}/stamp`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!has(response, 'data')) return null;

    return get(response, 'data.status');
  } catch (e) {
    alert('Erro ao emitir selo');
    return null;
  }
}
