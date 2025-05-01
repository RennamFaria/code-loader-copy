import {isEmpty, isNil} from 'lodash';
import api from '../../services/api';

export default async function create(token, newUser) {
  const {type, username, email, name, password, data} = newUser;

  const objToSend = {
    type,
    username,
    email: isNil(email) || isEmpty(email) ? null : email,
    name,
    password,
    data,
  };

  try {
    await api.post('users', objToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert('Informações Atualizadas!');
  } catch (e) {
    alert('Ocorreu um erro ao criar o usuário. Verifique com o administrador');
  }
}
