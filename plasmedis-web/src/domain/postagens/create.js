import {isEmpty, isNil, isObject} from 'lodash';
import api from '../../services/api';

export default async function create(token, newPostagem) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  let category;

  if (isObject(newPostagem.category)) {
    category = newPostagem.category.id;
  } else {
    category = newPostagem.category;
  }

  const {title, description} = newPostagem;

  const objToSend = {
    texto: description,
    titulo: title,
    categoria: category,
  };

  try {
    await api.post('posts', objToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    alert('Ocorreu um erro ao criar a postagem. Verifique com o administrador');
  }
}
