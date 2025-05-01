import api from '../../services/api';

export default async function create(token, newCategory) {
  const {name} = newCategory;

  const objToSend = {
    name,
  };

  try {
    await api.post('categories', objToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    alert(
      'Ocorreu um erro ao criar uma categoria. Verifique com o administrador.',
    );
  }
}
