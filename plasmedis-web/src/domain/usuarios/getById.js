import {get, isEmpty, isNil} from 'lodash';
import moment from 'moment';

import api from '../../services/api';
import stringify from '../../utils/stringify';

export default async function getById(token, userId, withData = false) {
  if (isNil(token) || isEmpty(token))
    throw new Error('Token não foi informado');

  const queryString = {};
  if (withData) queryString.with_data = true;

  try {
    const response = await api.get(`users/${userId}${stringify(queryString)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      id: get(response.data.user, 'id'),
      type: get(response.data.user, 'type'),
      name: get(response.data.user, 'name'),
      username: get(response.data.user, 'username'),
      active: get(response.data.user, 'active'),
      email: get(response.data.user, 'email'),
      has_data: get(response.data.user, 'has_data'),
      has_accepted_terms: get(response.data.user, 'has_accepted_terms'),
      //
      created: {
        date: moment(`${get(response.data.user, 'created.date')}`),
        name: get(response.data.user, 'created.name'),
        user: get(response.data.user, 'created.user'),
      },
      updated: {
        date: moment(`${get(response.data.user, 'updated.date')}`),
        name: get(response.data.user, 'updated.name'),
        user: get(response.data.user, 'updated.user'),
      },
      //
      data: {
        genero: get(response.data.user, 'data.genero'),
        nascimento: moment(`${get(response.data.user, 'data.nascimento')}`),
        area_atuacao: get(response.data.user, 'data.area_atuacao'),
        instituicao: get(response.data.user, 'data.instituicao'),
        campus: get(response.data.user, 'data.campus'),
        setor: get(response.data.user, 'data.setor'),
        deficiencia: get(response.data.user, 'data.deficiencia'),
        parente_com_tea: get(response.data.user, 'data.parente_com_tea'),
        freq_convivio_tea: get(response.data.user, 'data.freq_convivio_tea'),
        qtd_alunos_tea: get(response.data.user, 'data.qtd_alunos_tea'),
        tempo_trabalho_tea: get(response.data.user, 'data.tempo_trabalho_tea'),
        qtd_pacientes_tea_ano: get(
          response.data.user,
          'data.qtd_pacientes_tea_ano',
        ),
      },
    };
  } catch (e) {
    alert('Erro ao encontar informações');
    return null;
  }
}
