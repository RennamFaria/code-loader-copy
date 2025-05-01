import api from '../../services/api';

export default async function updateById(token, categoryId, updatedCategory) {
  const {name} = updatedCategory;

  const objToSend = {
    name,
  };

  try {
    await api.put(`categories/${categoryId}`, objToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    alert(
      'Ocorreu um erro ao editar uma categoria. Verifique com o administrador.',
    );
  }
}
