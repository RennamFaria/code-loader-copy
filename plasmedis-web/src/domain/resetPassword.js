import api from '../services/api';

// eslint-disable-next-line camelcase
export default function resetPassword(username_or_email = {}) {
  return api.post(
    `auth/recover?aud=${process.env.REACT_APP_ME ?? 'plasmedis-web-local'}`,
    username_or_email,
  );
}
