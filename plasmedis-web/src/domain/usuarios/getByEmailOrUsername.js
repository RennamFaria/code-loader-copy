import {isEmpty, isNil} from 'lodash';
import api from '../../services/api';

export default async function getByEmailOrUsername(
  token,
  emailFilter,
  usernameFilter,
) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  try {
    const filters = [];
    if (emailFilter) {
      filters.push(`email=${emailFilter}`);
    }

    if (usernameFilter) {
      filters.push(`username=${usernameFilter}`);
    }

    const queryFilter = filters.join('&');

    const response = await api.get(`users?${queryFilter}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e) {
    return null;
  }
}
