import React from 'react';
import {Switch, Route, BrowserRouter} from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

import Entrar from '../screens/Entrar';
import Home from '../screens/Home';
import Logout from '../screens/Logout';
import RecoverPassword from '../screens/RecoverPassword';
import UserControl from '../screens/Admin/UserControl';
import Categories from '../screens/Categories';
import UseGuide from '../screens/UseGuide';
import Perfil from '../screens/Perfil';
import Posts from '../screens/Posts';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/entrar" component={Entrar} />
        <Route path="/esqueci-minha-senha" component={RecoverPassword} />
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute path="/perfil" component={Perfil} />
        <PrivateRoute path="/categorias" component={Categories} />
        <PrivateRoute path="/postagens" component={Posts} />
        <PrivateRoute path="/guia-de-uso" component={UseGuide} />
        <PrivateRoute path="/logout" component={Logout} />
        <PrivateRoute
          exact
          path="/admin/controle-de-usuarios"
          component={UserControl}
        />
        <PrivateRoute path="/:category" />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
