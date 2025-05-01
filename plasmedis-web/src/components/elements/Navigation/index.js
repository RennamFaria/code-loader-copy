import React, {useEffect, useContext, useState, useMemo} from 'react';

import {
  mdiHome,
  mdiFormatListChecks,
  mdiAccountBoxMultipleOutline,
  mdiLogout,
  mdiAccountPlus,
  mdiAccountSupervisor,
  mdiApplicationCog,
  mdiAccount,
  mdiInformation,
} from '@mdi/js';

import {Box} from '@chakra-ui/layout';
import {useLocation} from 'react-router-dom';
import {useBreakpointValue} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import {get, isEmpty, isNil} from 'lodash';
import {Menu, Divider} from './styles';

import SidebarItem from '../SidebarItem';

import {Context as AuthContext} from '../../stores/Auth';
import * as Settings from '../../../domain/settings';

const essentialsSection = [
  {
    title: 'Início',
    icon: mdiHome,
    to: '/',
    type_alowed: [1, 2, 3],
  },
  {
    title: 'Perfil',
    icon: mdiAccount,
    to: '/perfil',
  },
  {
    title: 'Guia de uso',
    icon: mdiInformation,
    to: '/guia-de-uso',
    type_alowed: [1, 2, 3],
  },
];

const adminSection = [
  {
    title: 'Controle de usuários',
    icon: mdiAccountSupervisor,
    to: '/admin/controle-de-usuarios',
    type_alowed: [1],
    wait_settings: true,
  },
  {
    title: 'Gerenciar Categorias',
    icon: mdiApplicationCog,
    to: '/categorias',
    type_alowed: [1],
    wait_settings: true,
  },
  {
    title: 'Gerenciar Postagens',
    icon: mdiApplicationCog,
    to: '/postagens',
    type_alowed: [1],
    wait_settings: true,
  },
];

const informationSection = [
  // {
  //   title: 'Complemento de Dados',
  //   icon: mdiAccountBoxMultipleOutline,
  //   to: '/complemento-de-dados',
  //   type_alowed: [1, 2, 3],
  // },
  // {
  //   title: 'Formulário Socioeconômico',
  //   icon: mdiFormatListChecks,
  //   to: '/form',
  //   type_alowed: [1, 2, 3],
  // },
];

const logoutSection = [
  {
    title: 'Sair',
    icon: mdiLogout,
    to: '/logout',
    type_alowed: [1, 2, 3],
  },
];

const Navigation = ({user}) => {
  const {token} = useContext(AuthContext);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (isNil(token) || isEmpty(token)) return;

    setSettings(null);

    const fetchSettings = async () => {
      const obj = await Settings.web(token);
      setSettings(obj);
    };

    fetchSettings();
  }, [token]);

  const location = useLocation();
  const sidebarSections = useBreakpointValue(
    {
      base: [
        essentialsSection,
        adminSection,
        informationSection,
        logoutSection,
      ],
      lg: [essentialsSection, adminSection, informationSection, logoutSection],
    },
    'base',
  );

  const allowedSections = useMemo(() => {
    return sidebarSections
      .map((sectionItems, index) =>
        sectionItems.filter((item) => {
          const byUserPrivilege =
            isNil(item.type_alowed) || item.type_alowed.includes(user.type);

          if (!byUserPrivilege) return false;
          if (isNil(settings) && item.wait_settings) return false;

          // TODO: Descomentar essa parte. Ta comentado por enquanto pra testar com praticidade, mas teoricamente o settings do banco define se a tela aparece ou nao
          // const bySettings = get(settings, `visible.${item.to}`, true); // visible by default
          const bySettings = true;

          return byUserPrivilege && bySettings;
        }),
      )
      .filter((items) => items.length > 0);
  }, [settings, sidebarSections, user]);

  const sidebarList = allowedSections.map((sectionItems, index) => {
    return (
      <Box
        width="100%"
        key={index}
        onClick={() => {
          window.scrollTo(0, 0);
        }}>
        {sectionItems.map((item) => {
          return (
            <SidebarItem
              key={item.title}
              title={item.title}
              icon={item.icon}
              to={item.to}
              selected={location.pathname === item.to}
            />
          );
        })}
        {index < sidebarSections.length - 1 && <Divider />}
      </Box>
    );
  });

  return <Menu>{sidebarList}</Menu>;
};

Navigation.displayName = 'Navigation';
Navigation.propTypes = {
  user: PropTypes.shape({
    type: PropTypes.number,
  }).isRequired,
};

export default Navigation;
