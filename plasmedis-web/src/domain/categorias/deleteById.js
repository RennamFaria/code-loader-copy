import {isEmpty, isNil, isString} from 'lodash';

import api from '../../services/api';

// eslint-disable-next-line func-names
export default async function (token, id) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  if (isNil(id) || (isEmpty(id) && isString(id)))
    throw new Error('Id da categoria não foi informado');

  try {
    await api.delete(`/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new Error('Não foi possivel excluir categoria');
  }
}
