import {isEmpty, isNil} from 'lodash';
import api from '../../services/api';

export default async function verifyUsername(token, username) {
  if (isNil(username) || isEmpty(username)) return false;

  return api.get(`users/verify/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
