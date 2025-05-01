import {isEmpty, isNil} from 'lodash';
import api from '../../services/api';

export default async function create(token, newPrivilege) {
  const {name} = newPrivilege;

  const objToSend = {name};

  try {
    await api.post('privileges', objToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert('Informações Atualizadas!');
  } catch (e) {
    alert(
      'Ocorreu um erro ao criar o nível de privilégio. Verifique com o administrador',
    );
  }
}
