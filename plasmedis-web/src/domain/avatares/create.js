import api from '../../services/api';

export default async function create(token, newAvatar) {
  const {id, avatarImage} = newAvatar;

  const objToSend = {
    id,
    avatarImage,
  };

  try {
    await api.post('avatars', objToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    alert('Ocorreu um erro ao criar o avatar. Verifique com o administrador');
  }
}
