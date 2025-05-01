import React, {useContext, useState, useEffect, useCallback} from 'react';

import {Box} from '@chakra-ui/layout';

import {
  Select,
  Flex,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';

import {MdEdit} from 'react-icons/md';
import {get, isNull} from 'lodash';
import {toast} from 'react-toastify';
import * as Postagens from '../../domain/postagens';
import * as Categories from '../../domain/categorias';
import {Context as AuthContext} from '../../components/stores/Auth';
import PageSelector from '../../components/elements/PageSelector';
import EditablePostagem from '../../components/elements/EditablePostagem';

toast.configure();

function Posts() {
  const {user, token} = useContext(AuthContext);

  const [pageMetadata, setPageMetadata] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [categories, setCategories] = useState([]);

  const {isOpen, onOpen, onClose} = useDisclosure();
  const [savingPost, setSavingPost] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await Categories.getAll(token, 1, 50);
      setCategories(result.categories);
    };
    fetchCategories();
  }, [token]);

  const fetchPosts = useCallback(async () => {
    let result = [];
    result = await Postagens.getAll(token, page, limit);

    setPosts(
      result.posts.map((post) => {
        const category = categories.find((c) => c.id === post.category.id);
        post.category.name = get(category, 'name');
        return post;
      }),
    );
    setPageMetadata({
      count: result.count,
      current: result.current,
      limit: result.limit,
      next: result.next,
      previous: result.previous,
    });
  });

  useEffect(() => {
    if (categories.length > 0) {
      fetchPosts();
    }
  }, [token, page, limit, categories]);

  const handlePostUpdate = (field, value) => {
    setSelectedPost((prevPost) => ({...prevPost, [field]: value}));
  };

  return (
    <>
      <Box px={{base: 0, lg: 6}}>
        <Text color="#2f7384" fontSize="2xl" fontWeight={600} marginBottom={4}>
          Gerenciar Postagens
        </Text>

        <Flex direction="row" mb={4} alignItems="center" justifyContent="right">
          <Text mr={4}>Número de registros</Text>
          <Select
            width={90}
            value={limit}
            onChange={(event) => {
              setLimit(event.target.value);
              setPage(1);
            }}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </Select>
        </Flex>

        <Box
          bg={{base: 'white', lg: 'white'}}
          color={{base: 'white', lg: 'white'}}
          boxShadow="0px 0.25rem 0.25rem 0px rgba(0, 0, 0, 0.25)">
          <Table variant="striped" color="black" colorScheme="blackAlpha">
            <Thead>
              <Tr bg="primary.600">
                <Th color="white">ID</Th>
                <Th color="white">Título</Th>
                <Th color="white">Descrição</Th>
                <Th color="white">Categoria</Th>
                <Th color="white">Autor</Th>
                <Th color="white">Data da postagem</Th>
                <Th color="white">Verificado</Th>
                <Th color="white">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {posts &&
                posts.map((post) => (
                  <Tr key={post.id}>
                    <Td>{post.id}</Td>
                    <Td>{post.title}</Td>
                    <Td>{post.description}</Td>
                    <Td>{post.category.name}</Td>
                    <Td>{post.author.name}</Td>
                    <Td>{new Date(post.dateTime).toLocaleDateString()}</Td>
                    <Td>{post.verified ? 'Sim' : 'Não'}</Td>
                    <Td>
                      <IconButton
                        onClick={(event) => {
                          setSelectedPost({...post});
                          onOpen(event);
                        }}
                        size="sm"
                        mr={2}
                        colorScheme="primary"
                        icon={<Icon as={MdEdit} />}
                      />
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>
        <PageSelector metadata={pageMetadata} onChangePage={setPage} />

        <Modal
          isOpen={isOpen}
          isCentered
          size="md"
          onClose={(event) => {
            setSelectedPost(null);
            onClose(event);
          }}
          motionPreset="slideInBottom">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Editar Postagem</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <EditablePostagem
                value={selectedPost}
                categories={categories}
                onPostUpdate={handlePostUpdate}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="primary"
                mr={3}
                disabled={savingPost}
                onClick={() => {
                  setSavingPost(true);

                  Postagens.updateById(token, selectedPost.id, selectedPost)
                    .then(() => {
                      setSavingPost(false);
                      onClose();
                      fetchPosts();
                    })
                    .catch(() => {
                      toast.error('Não foi possível salvar as alterações.');
                      setSavingPost(false);
                      onClose();
                    });
                }}>
                Salvar
              </Button>
              <Button disabled={savingPost} onClick={onClose}>
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}

export default Posts;
