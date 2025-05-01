import {isEmpty, isNil} from 'lodash';
import api from '../services/api';

export default function login({username, password} = {}) {
  return api.post(
    `auth/login?aud=${process.env.REACT_APP_ME ?? 'plasmedis-web-local'}`,
    {username, password},
  );
}

/**
 * Retorna uma lista de informações sobre o protocolo de login da api
 */
export async function get() {
  try {
    const response = await api.get('auth/login');
    return response.data ?? {};
  } catch {
    return null;
  }
}

export async function me(token) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  try {
    const response = await api.get(`auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e) {
    // eslint-disable-next-line no-alert
    alert('Não foi possível recuperar as informações do usuário autenticado');
    return null;
  }
}
