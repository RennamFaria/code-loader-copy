import React, {useState, useContext, useCallback} from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Collapse,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';

import {Button} from '@chakra-ui/button';

import {get} from 'lodash';
import Header from '../../elements/Header';

import {Container, Content, BoxAside} from './styles.js';
import Navigation from '../../elements/Navigation';
import Sidebar from '../../elements/Sidebar';

import {Context as AuthContext} from '../../stores/Auth';

const Default = ({children} = {}) => {
  const [menu, setMenu] = useState(false);
  const {user, hasAcceptedTerms, acceptTerms} = useContext(AuthContext);

  const onClose = useCallback(() => {
    acceptTerms(true);
  }, [acceptTerms]);

  return (
    <>
      <Container bg="#F0F6F8">
        {/* <NavBar /> */}
        <Header open={menu} onMenu={() => setMenu(!menu)}>
          <Collapse in={menu} animateOpacity>
            <Box
              bg={{base: 'primary.600', lg: 'white'}}
              color={{base: 'white', lg: 'primary.600'}}
              zIndex={9}
              // boxShadow="0px 0.25rem 0.25rem 0px rgba(0, 0, 0, 0.25)"
            >
              <Box pb={6} flexBasis={{base: '100%', lg: 'none'}}>
                <Stack
                  spacing={1}
                  align="flex-start"
                  justify="center"
                  direction="column">
                  <Navigation user={user} />
                </Stack>
              </Box>
            </Box>
          </Collapse>
        </Header>
        <Content mt={{base: 0, lg: 2}} p={{base: 0, lg: 4}}>
          <BoxAside width="100%">
            <Sidebar
              name={get(user, 'name', '???')}
              avatar={get(user, 'avatar', 'https://bit.ly/dan-abramov')}>
              <Navigation user={user} />
            </Sidebar>
          </BoxAside>
          <Box width="100%">{children}</Box>
        </Content>
      </Container>

      {/* Modal de Termos de Uso */}
      <Modal
        isOpen={hasAcceptedTerms === false}
        isCentered
        motionPreset="slideInBottom"
        size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Termos de Uso</ModalHeader>
          <ModalBody pb={6}>
            <div>
              <p>
                Olá, integrantes da Comunidade Virtual de Aprendizagem TEA NO
                ENSINO SUPERIOR.
              </p>
              <br />

              <p>
                Esta comunidade tem como objetivo promover a integração entre
                professores universitários de alunos com TEA e especialistas em
                inclusão para o nível superior. Nesta comunidade os
                participantes podem interagir postando mensagens com tema
                especificamente relacionados a pessoas com TEA na fase adulta e
                que estejam cursando universidade. Aqui o integrante poderá
                postar mensagens, curtir e comentar as postagens de outros.
                Também será permitido desabafar sobre as dificuldades pessoais
                em lidar com o tema, bem como oferecer apoio.
              </p>
              <br />

              <p>
                As mensagens podem conter: informações, dúvidas, elogios,
                sugestões, dicas, publicações de eventos e outros assuntos
                referentes ao tema.
              </p>

              <p>
                Nesta comunidade não é permitido postagens inadequadas, com teor
                ofensivo, incitação ao ódio, qualquer tipo de pornografia ou
                mensagem de duplo sentido, violência, aliciamento político, ou
                qualquer outro tipo de mensagem que cause constrangimento ou
                infrinja as leis. Não é permitido postar palavras de baixo
                calão, correntes, ativismo político e/ou religioso.
              </p>
              <br />

              <p>
                Caso uma das regras seja infringida, o conteúdo postado será
                removido, e a pessoa responsável pela postagem será advertida.
                Havendo reincidência, o integrante será excluído.
              </p>
              <br />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="primary" onClick={onClose}>
              Aceitar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

Default.displayName = 'Default';
Default.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Default;
