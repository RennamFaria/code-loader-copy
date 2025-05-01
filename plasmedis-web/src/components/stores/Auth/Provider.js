import React, {useState, useEffect, useCallback, useMemo} from 'react';

import jwt from 'jsonwebtoken';

import {get, isEmpty, isNil, isNull} from 'lodash';
import useLocalStorage from '../../../utils/react/storedState';
import Context from './Context';

import * as Auth from '../../../domain/login';

import {updateById} from '../../../domain/usuarios';

const Provider = ({children} = {}) => {
  const [token, setToken] = useLocalStorage('token', null);
  const [user, setUser] = useLocalStorage('user', null);
  const [hasData, setHasData] = useState(null);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(null);

  useEffect(() => {
    if (!isNil(token)) {
      const apiAuthProtocol = Auth.get();
      const decoded = jwt.decode(token);

      // verificar se o token expirou, se estiver, invalidar a sessão
      if (Date.now() > get(decoded, 'exp', 0) * 1000) {
        alert('Sua sessão expirou. Por favor, entre novamente.'); // TODO: deixar mais amigável
        setToken(undefined);
        setUser(undefined);
        return;
      }

      // verificar se o protoculo de autenticacao mudou, se mudou, invalidar a sessão
      apiAuthProtocol.then(({version}) => {
        if (version !== decoded.auth) {
          alert('Sua sessão expirou. Por favor, entre novamente.'); // TODO: deixar mais amigável
          setToken(undefined);
          setUser(undefined);
        }
      });

      Auth.me(token).then((authenticatedUser) => {
        if (isNull(hasData)) {
          console.error('NO hasData');
          // verificar se o usuário possui um perfil completo (data preenchida), se nao possuir, redirecionar para meu perfil com um aviso (redirecionar em PrivateRoute)
          // setHasData(get(authenticatedUser, 'has_data', false));
        }

        if (isNull(hasAcceptedTerms)) {
          console.error('NO hasAcceptedTerms');
          // verificiar se o usuário aceitos os termos de uso, se não aceitou, mostrar o modal com os termos pedindo o acete (no layout default)
          // setHasAcceptedTerms(get(authenticatedUser, 'has_accepted_terms', false));
        }
      });
    }
  }, [
    token,
    setToken,
    setUser,
    hasData,
    setHasData,
    hasAcceptedTerms,
    setHasAcceptedTerms,
  ]);

  const acceptTerms = useCallback(
    (value = true) => {
      setHasAcceptedTerms(value);
      updateById(token, get(user, 'id'), {
        has_accepted_terms: value,
      });
    },
    [token, user, setHasAcceptedTerms],
  );

  useEffect(() => {
    if (isEmpty(user) || isNil(user)) {
      setToken(undefined);
      setUser(undefined);
      setHasAcceptedTerms(null);
      setHasData(null);
    }
  }, [user, setToken, setUser]);

  const memoizedValue = useMemo(
    () => ({
      token,
      setToken,
      user,
      setUser,
      hasData,
      setHasData,
      hasAcceptedTerms,
      acceptTerms,
    }),
    [
      token,
      setToken,
      user,
      setUser,
      hasData,
      setHasData,
      hasAcceptedTerms,
      acceptTerms,
    ],
  );

  return <Context.Provider value={memoizedValue}>{children}</Context.Provider>;
};

export default Provider;
