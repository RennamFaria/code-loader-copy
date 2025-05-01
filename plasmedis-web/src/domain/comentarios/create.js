import {isEmpty, isNil} from 'lodash';
import api from '../../services/api';

export default async function create(token, newComentario, postagemId) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  const objToSend = {
    postagem: postagemId,
    texto: newComentario,
    resposta: null,
  };

  try {
    await api.post('comments', objToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    alert(
      'Ocorreu um erro ao adicionar o comentário. Verifique com o administrador',
    );
  }
}
