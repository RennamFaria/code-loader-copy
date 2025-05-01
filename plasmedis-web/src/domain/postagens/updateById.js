import {isEmpty, isNil, isObject} from 'lodash';
import api from '../../services/api';

export default async function updateById(token, postId, objectToSend) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  let category;

  if (isObject(objectToSend.category)) {
    category = objectToSend.category.id;
  } else {
    category = objectToSend.category;
  }

  const {title, description} = objectToSend;

  const obj = {
    categoria: category,
    titulo: title,
    texto: description,
  };

  try {
    await api.put(`posts/${postId}`, obj, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert('Informações Atualizadas!');
  } catch (e) {
    throw new Error('Erro ao submeter informações');
  }
}
