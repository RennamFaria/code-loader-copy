import {get, isEmpty, isNil} from 'lodash';
import api from '../services/api';

export async function web(token) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  try {
    const response = await api.get(`settings/web`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      id: get(response, 'data.settings.id'),
      version: get(response, 'data.settings.version', '0.0'),
      visible: get(response, 'data.settings.visible', {}),
    };
  } catch {
    return null;
  }
}
