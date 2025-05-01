import PropTypes from 'prop-types';

export const UserDefault = {
  id: -1,
  name: '????',
  type: 3,
  username: '????',
  email: 'https://bit.ly/dan-abramov',
};

export const User = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.number.isRequired,
  username: PropTypes.string,
  email: PropTypes.string,
  avatar: PropTypes.string,
});

export default {
  User,
  UserDefault,
};
