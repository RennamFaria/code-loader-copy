import React, {useEffect} from 'react';

const Logout = (...props) => {
  const doLogout = () => {
    localStorage.setItem('token', '');
    window.location = '/entrar';
  };

  useEffect(() => {
    doLogout();
  }, []);

  return <div>Logout</div>;
};

export default Logout;
