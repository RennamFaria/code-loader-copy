/* eslint-disable no-alert */
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import anchorme from 'anchorme';
import {Stack, Box, Text, Flex} from '@chakra-ui/layout';
import {Avatar} from '@chakra-ui/avatar';
import {
  IconButton,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import {MdSend, MdVerifiedUser} from 'react-icons/md';
import {FaMicrophone} from 'react-icons/fa';
import ReactHtmlParser from 'react-html-parser';

import {Button} from '@chakra-ui/button';
import Icon from '@chakra-ui/icon';
import {get, isEmpty, isNil, isString} from 'lodash';

import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

import * as User from '../../../domain/usuarios';
import {deleteById} from '../../../domain/postagens';
import * as Comments from '../../../domain/comentarios';

import {TextAnchor, FiTrashIcon} from './styles';

import Comentario from '../Comentario';

import {Context as AuthContext} from '../../stores/Auth';

import Link from '../Link';

const Postagem = ({
  item,
  user,
  verifiable,
  fetchComments,
  onCreateComment,
  onToggleSelo,
} = {}) => {
  const {token} = useContext(AuthContext);
  const [openComments, setOpenComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newCommentInvalid, setNewCommentInvalid] = useState(false);
  const [creatingComment, setCreatingComment] = useState(false);

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const [numberOfComments, setNumberOfComments] = useState(item?.comments);
  const [loadMoreComments, setLoadMoreComments] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const [verifyingPost, setVerifyingPost] = useState(false);

  const {isOpen, onOpen, onClose} = useDisclosure();

  const [messageHeader, setMessageHeader] = useState('');
  const [messageBody, setMessageBody] = useState('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const htmlDescription = useMemo(() => {
    const text = item.description;

    let elements = [];
    const matches = anchorme.list(text);

    if (matches.length === 0) elements = [text];
    else {
      let lastIndex = 0;
      matches.forEach((match, index) => {
        // Push text located before matched string
        if (match.start > lastIndex)
          elements.push(text.substring(lastIndex, match.start));

        // Push Link component
        elements.push(
          <Link
            target="_blank"
            rel="noreferrer noopener"
            key={index}
            href={match.string}
          />,
        );

        lastIndex = match.end;
      });

      // Push remaining text
      if (text.length > lastIndex) elements.push(text.substring(lastIndex));
    }

    return elements.map((element) => {
      if (isString(element)) return ReactHtmlParser(element);
      return element;
    });
  }, [item]);

  const fetchAndUpdateComments = useCallback(
    (id, pageNumber) => {
      if (numberOfComments > 0) setLoadingComments(true);

      fetchComments(id, pageNumber).then((page) => {
        setComments((prevComments) => {
          const newComments = page.comments.filter(
            (comment) =>
              !prevComments.some(
                (prevComment) => prevComment.id === comment.id,
              ),
          );
          return [...prevComments, ...newComments].sort((a, b) => b.id - a.id);
        });
        setCurrentPage(pageNumber >= currentPage ? pageNumber : currentPage);
        setNumberOfComments(page.count);
        setLoadMoreComments(!isEmpty(page.next) && loadMoreComments);
        setLoadingComments(false);
        setCreatingComment(false);
      });
    },
    [fetchComments, numberOfComments, comments, currentPage],
  );

  const checkIfUserCanDeletePost = () => {
    if (user.id === item.author.id || user.type === 1 || user.type === 2) {
      return true;
    }
    return false;
  };

  const showDeleteDialog = async (postId) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Deseja realmente excluir essa postagem?')) {
      deleteById(token, postId)
        .then(() => {
          document.location.reload(true);
        })
        .catch(() => {
          alert('Não foi possível excluir a postagem');
        });
    }
  };

  // se comments está nulo (ainda não houve um fetch com sucesso da api)
  useEffect(() => {
    if (
      openComments &&
      item?.id &&
      numberOfComments > 0 &&
      comments.length === 0
    )
      fetchAndUpdateComments(item?.id, 1);
  }, [openComments, item, comments, numberOfComments, fetchAndUpdateComments]);

  const toggleVerifyPost = useCallback(() => {
    if (!verifiable && item?.id) return;

    setVerifyingPost(true);

    onToggleSelo(item.id).then((newStatus) => {
      if (!isNil(newStatus)) {
        setMessageHeader('Sucesso!');
        setMessageBody(
          newStatus
            ? `A postagem foi verificada com sucesso!`
            : 'A postagem não é mais verificada!',
        );
        item.verified = newStatus;
        onOpen();
      } else {
        setMessageHeader('Erro!');
        setMessageBody(
          'Ocorreu um erro ao verificar a postagem. Verifique com o administrador',
        );
      }

      setVerifyingPost(false);
    });
  }, [verifiable, item, onToggleSelo, onOpen]);

  const onCommentDelete = useCallback(
    (commentId) => {
      if (isNil(comments)) return;
      Comments.delete(token, commentId)
        .then(() => {
          setComments(comments.filter((comment) => comment.id !== commentId));
          setNumberOfComments(numberOfComments - 1);
          alert('Comentário removido');
        })
        .catch(() => {
          alert('Não foi possível remover o comentário');
        });
    },
    [token, comments, setComments],
  );

  return (
    <>
      <Box
        p={{base: 4, lg: 6}}
        mb={6}
        borderRadius={{base: '0px', lg: '10px'}}
        shadow="md"
        bgColor="white">
        <Stack width="100%">
          <Flex mb={4} direction="row" justify="space-between">
            <Flex>
              <Box mr={4}>
                <Avatar
                  name={get(item, 'author.name')}
                  src={get(item, 'author.avatar')}
                />
              </Box>
              <Stack spacing={{base: 0, lg: 1}}>
                <Text fontWeight="bold" fontSize="sm" color="black">
                  {get(item, 'author.name')}
                </Text>
                <Text fontSize="xs" color="gray">
                  {item.dateTime.fromNow()}
                </Text>
              </Stack>
            </Flex>
            {checkIfUserCanDeletePost() ? (
              <FiTrashIcon onClick={() => showDeleteDialog(item.id)} />
            ) : null}
          </Flex>
          <Stack>
            <Flex mb={2} flexDirection="row" align="center">
              <Text fontWeight="bold" size="md" color="black">
                {item.title}
              </Text>
              {(item.verified || verifiable) && (
                <IconButton
                  aria-label={
                    !item.verified && verifiable
                      ? 'Clique aqui para verificar postagem'
                      : 'Postagem verificada'
                  }
                  cursor={item.verified ? 'auto' : 'pointer'}
                  display="flex"
                  icon={
                    <Icon
                      color={!item.verified ? 'gray' : 'green'}
                      boxSize="1em"
                      as={MdVerifiedUser}
                    />
                  }
                  isDisabled={!verifiable}
                  isLoading={verifyingPost}
                  onClick={() => toggleVerifyPost()}
                  variant="unstyled"
                />
              )}
            </Flex>
            <TextAnchor as="div" size="sm" color="black" align="justify">
              {htmlDescription}
            </TextAnchor>
            <Text
              cursor="pointer"
              fontStyle={openComments ? 'italic' : ''}
              fontSize="sm"
              color="gray"
              align="right"
              py={2}
              borderTop="1px solid #eee"
              borderBottom={openComments ? '1px solid #eee' : ''}
              onClick={() => setOpenComments(!openComments)}>
              {numberOfComments > 0
                ? `${numberOfComments} Comentários`
                : 'Comentar'}
            </Text>
            {openComments > 0 && (
              <Box p={4} px={{base: 0, lg: 4}}>
                <Flex
                  flexDirection="row"
                  align="center"
                  mb={numberOfComments > 0 ? 8 : 0}>
                  <Box mr={{base: 2, lg: 4}}>
                    <Avatar name={user.name} src={get(user, 'avatar', null)} />
                  </Box>

                  <Input
                    value={listening ? transcript : newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                    borderRadius="50px"
                    placeholder="Envie um comentário"
                    size="md"
                    isInvalid={newCommentInvalid}
                  />
                  <IconButton
                    isDisabled={creatingComment}
                    ml={4}
                    colorScheme={listening ? 'red' : 'primary'}
                    icon={<Icon fontSize="2xl" as={FaMicrophone} />}
                    isRound
                    onClick={(event) => {
                      if (!browserSupportsSpeechRecognition) {
                        alert(
                          'O seu navegador não suporta a função de aúdio, por favor utilize o Google Chrome',
                        );
                      }

                      if (listening) {
                        SpeechRecognition.stopListening();
                        setNewComment(transcript);
                      } else {
                        resetTranscript();
                        SpeechRecognition.startListening({
                          continuous: true,
                          language: 'pt-BR',
                        });
                      }
                    }}
                  />
                  <IconButton
                    isDisabled={creatingComment}
                    ml={4}
                    colorScheme="primary"
                    icon={<Icon fontSize="2xl" as={MdSend} />}
                    isRound
                    isLoading={creatingComment}
                    onClick={(event) => {
                      if (onCreateComment && newComment) {
                        setNewCommentInvalid(false);
                        onCreateComment(newComment, item.id).then(() => {
                          setNumberOfComments(numberOfComments + 1);
                          fetchAndUpdateComments(item.id, 1);
                        });
                        setNewComment('');
                      } else {
                        setNewCommentInvalid(true);
                      }
                    }}
                  />
                </Flex>
                <Stack spacing={4}>
                  {comments.map((comment, index) => (
                    <Comentario
                      key={index}
                      item={comment}
                      onDelete={() => onCommentDelete(comment.id)}
                    />
                  ))}
                  {loadingComments && (
                    <Box w="100%" textAlign="center">
                      <Spinner colorScheme="primary.main" />
                    </Box>
                  )}
                </Stack>
                {loadMoreComments && currentPage > 0 && (
                  <Flex justify="center" align="center">
                    <Button
                      onClick={() => {
                        setLoadMoreComments(false);
                        fetchAndUpdateComments(item.id, currentPage + 1);
                      }}
                      colorScheme="primary"
                      size="sm"
                      mt={4}>
                      Carregar mais comentários
                    </Button>
                  </Flex>
                )}
              </Box>
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Modal de feedback de Mensagem */}
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{messageHeader}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="sm" color="black" align="justify">
              {messageBody}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

Postagem.displayName = 'Postagem';
Postagem.defaultProps = {
  item: {},
  user: User.PropTypes.UserDefault,
  verifiable: false,
  fetchComments: async () => [],
  onCreateComment: () => {},
  onToggleSelo: () => {},
};
Postagem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    author: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string.isRequired,
    }),
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    dateTime: PropTypes.object.isRequired, // TODO: invoke moment object type
    comments: PropTypes.number,
    verified: PropTypes.bool,
  }),
  user: User.PropTypes.User,
  verifiable: PropTypes.bool,
  fetchComments: PropTypes.func,
  onCreateComment: PropTypes.func,
  onToggleSelo: PropTypes.func,
};

export default Postagem;
