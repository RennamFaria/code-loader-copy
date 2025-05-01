import {get, isEmpty, isNil} from 'lodash';
import api from '../../services/api';

export default async function getAll(token) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  try {
    const response = await api.get(`privileges`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return get(response.data, 'privileges', []).map((privilege) => ({
      id: get(privilege, 'id'),
      type: get(privilege, 'name'),
    }));
  } catch (e) {
    // eslint-disable-next-line no-alert
    alert('Erro ao encontar informações');
    return null;
  }
}
