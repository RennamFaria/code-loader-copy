import React, {useContext, useEffect} from 'react';
import {Switch, Route, BrowserRouter, Redirect} from 'react-router-dom';

import PropTypes from 'prop-types';

import Default from '../components/layouts/default';
import {Context as AuthContext} from '../components/stores/Auth';

const PrivateRoute = ({component: Component, ...rest}) => {
  const {token, hasData} = useContext(AuthContext);

  useEffect(() => {
    if (hasData === false && window.location.pathname !== '/perfil') {
      window.location = '/perfil';
    }
  });

  return (
    <Route
      {...rest}
      render={() =>
        token ? (
          <Default>
            <Component {...rest} />
          </Default>
        ) : (
          <Redirect to="/entrar" />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func,
};

PrivateRoute.defaultProps = {
  component: () => <></>,
};

export default PrivateRoute;
