/* eslint-disable no-alert */
import React from 'react';
import {Text, Box} from '@chakra-ui/react';

import * as S from './styles';

const UseGuide = (...props) => {
  return (
    <S.Wrapper px={{base: 0, lg: 6}}>
      <Text color="#2f7384" fontSize="2xl" fontWeight={600} marginBottom={4}>
        Guia de Uso
      </Text>
      <Box
        borderRadius={10}
        bg={{base: 'white', lg: 'white'}}
        color={{base: 'black', lg: 'black'}}
        padding={{base: '20px'}}
        boxShadow="0px 0.25rem 0.25rem 0px rgba(0, 0, 0, 0.25)">
        <div>
          <p>
            <strong>Olá, integrantes do IBEAC</strong>
          </p>
          <br />

          <p>
            Esta comunidade tem como objetivo promover a integração entre as
            mães e gestantes e as Mães Mobilizadoras. Nesta comunidade os
            participantes podem interagir postando mensagens com tema
            especificamente relacionados à gravidez. Aqui o integrante poderá
            postar mensagens e comentar as postagens de outros. Também será
            permitido desabafar sobre as dificuldades pessoais em lidar com o
            tema, bem como oferecer apoio.
          </p>
          <br />

          <p>
            As mensagens podem conter: informações, dúvidas, elogios, sugestões,
            dicas, publicações de eventos e outros assuntos referentes ao tema.
          </p>
          <br />

          <p>
            Nesta comunidade não é permitido postagens inadequadas, com teor
            ofensivo, incitação ao ódio, qualquer tipo de pornografia ou
            mensagem de duplo sentido, violência, aliciamento político, ou
            qualquer outro tipo de mensagem que cause constrangimento ou
            infrinja as leis. Não é permitido postar palavras de baixo calão,
            correntes, ativismo político e/ou religioso.
          </p>
          <br />

          <p>
            Caso uma das regras seja infringida, o conteúdo postado será
            removido, e a pessoa responsável pela postagem será advertida.
            Havendo reincidência, o integrante será excluído.
          </p>
          <br />

          <p>
            <strong>Papel dos participantes</strong>
          </p>
          <br />

          <p>
            As mães e gestantes serão as participantes da comunidade virtual de
            aprendizagem e poderão postar dúvidas, necessidades em relação ao
            tema e pedir ajuda.
          </p>
          <br />

          <p>
            As Mães Mobilizadoras serão as moderadoras que terão como papel
            contribuir com conhecimento a respeito do tema primeira infância,
            responder as perguntas das mães e gestantes e oferecer dicas
            relacionadas ao tema.
          </p>
          <br />
        </div>
      </Box>
    </S.Wrapper>
  );
};

export default UseGuide;
