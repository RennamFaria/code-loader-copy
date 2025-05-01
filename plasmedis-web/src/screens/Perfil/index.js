/* eslint-disable no-alert */
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import {
  Text,
  Box,
  Stack,
  FormHelperText,
  Spinner,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
  Tooltip,
  Avatar,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';

import {get, isEmpty, isNil, pick, set} from 'lodash';
import * as Yup from 'yup';

import * as S from './styles';
import * as Usuario from '../../domain/usuarios';
import * as Privilegio from '../../domain/privilegios';

import {Context as AuthContext} from '../../components/stores/Auth';
import Form from '../../components/elements/Form';

import AvatarSelector from '../../components/elements/AvatarSelector';

const Perfil = (...props) => {
  const dataWarning = useRef(false);
  const {token, hasData, setHasData, user} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [typeData, setTypeData] = useState(null);
  const [avatarData, setAvatarData] = useState({
    name: get(user, 'name', '???'),
    image: get(user, 'avatar', '???'),
    hasChanged: false,
  });

  const [checkingUsernameAvailability, setCheckingUsernameAvailability] =
    useState(false);
  const [usernameChecked, setUsernamedChecked] = useState(null);
  const latestCheckUniqueUsername = useRef(null);

  const {isOpen, onOpen, onClose} = useDisclosure();

  const savedCredentials = useRef({});

  const schema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required('O campo "Nome" é obrigatório'),
      genero: Yup.string().required('O campo "Gênero" é obrigatório'),
      nascimento: Yup.date().required(
        'O campo "Data de Nascimento" é obrigatório',
      ),
      // avatar: Yup.string(),
    });
  }, []);

  const credentialSchema = useMemo(() => {
    return Yup.object().shape({
      username: Yup.string()
        .required('O Nome de Usuário é obrigatório')
        .test(
          'checkUniqueUsername',
          <span>
            Esse nome de usuário <b>não</b> está disponível
          </span>,
          async (value) => {
            if (value === get(savedCredentials.current, 'username'))
              return true;

            setCheckingUsernameAvailability(true);

            if (!isEmpty(value) && !isNil(value)) {
              try {
                await Usuario.verifyUsername(token, value);

                setCheckingUsernameAvailability(false);
                setUsernamedChecked(value);
                latestCheckUniqueUsername.current = true;
                return true;
              } catch (error) {
                const {status} = error.response;
                if (status === 400) {
                  setUsernamedChecked(value);
                  setCheckingUsernameAvailability(false);
                  latestCheckUniqueUsername.current = true;
                  return false;
                }

                alert(
                  'Não foi possível verificar a disponibilidade do nome de usuário',
                ); // TODO: transformar em alert amigável

                setUsernamedChecked(value);
                setCheckingUsernameAvailability(false);
                latestCheckUniqueUsername.current = true;
                return true;
              }
            }

            setCheckingUsernameAvailability(false);
            return false;
          },
        ),
      // email: Yup.string().email('Insira um e-mail válido'),
      name: Yup.string().required('O Nome é obrigatório'),
      current_password: Yup.string(),
      password: Yup.string(),
      confirmation_password: Yup.string(),
    });
  }, [token]);

  // FORM UPKEEPING
  const [errors, setErrors] = useState({});
  const setError = useCallback(
    (name, value) => {
      if (value === errors[name] || (isNil(value) && isNil(errors[name])))
        return;
      setErrors({...errors, [name]: value});
    },
    [setErrors, errors],
  );
  const [credentialErrors, setCredentialErrors] = useState({});
  const setCredentialError = useCallback(
    (name, value) => {
      if (
        value === credentialErrors[name] ||
        (isNil(value) && isNil(credentialErrors[name]))
      )
        return;
      setCredentialErrors({...credentialErrors, [name]: value});
    },
    [setCredentialErrors, credentialErrors],
  );

  const [inputs, setInputs] = useState(null);
  const setInput = useCallback(
    (name, value) => {
      setInputs(set({...inputs}, name, value));
    },
    [setInputs, inputs],
  );

  const form = useMemo(
    () => [
      {
        name: 'name',
        path: 'name',
        label: 'Nome',
        type: 'text',
        required: false,
      },
      {
        name: 'genero',
        path: 'data.genero',
        label: 'Gênero',
        type: 'radio',
        required: false,
        custom: 'Outro',
        options: [
          {
            value: 'Feminino',
            text: 'Feminino',
          },
          {
            value: 'Masculino',
            text: 'Masculino',
          },
        ],
      },
      {
        name: 'nascimento',
        path: 'data.nascimento',
        label: 'Data de Nascimento',
        type: 'date',
        required: false,
      },
    ],
    [],
  );

  const credentialForm = useMemo(
    () => [
      [
        {
          name: 'email',
          path: 'email',
          type: 'email',
          label: 'E-mail',
          helperStatus: 'warning',
          helperText:
            isNil(inputs?.email == null) || inputs?.emaill === ''
              ? 'Caso você não possua um e-mail cadastrado, qualquer pedido de mudança de senha será encaminhado para a moderação da plataforma.'
              : null,
        },
        {
          name: 'username',
          path: 'username',
          type: 'text',
          label: 'Nome de Usuário',
          placeholder: 'nome.sobrenome',
          helperText: (
            <>
              {checkingUsernameAvailability ? (
                <FormHelperText
                  display="flex"
                  flexDirection="row"
                  alignItems="center">
                  <Spinner size="xs" colorScheme="primary" mr={2} />
                  Verificando disponibilidade do nome de usuário
                </FormHelperText>
              ) : inputs?.username === usernameChecked ? (
                <FormHelperText color="green.700">
                  <Alert status="success">
                    <AlertIcon />
                    <AlertDescription>
                      Esse nome de usuário está disponível
                    </AlertDescription>
                  </Alert>
                </FormHelperText>
              ) : null}
            </>
          ),
        },
      ],
      [
        {
          name: 'password',
          path: 'password',
          type: 'password',
          label: 'Nova Senha',
        },
        {
          name: 'confirmationPassword',
          path: 'confirmation_password',
          type: 'password',
          label: 'Confirmação de Senha',
        },
      ],
      {
        name: 'currentPassword',
        path: 'current_password',
        type: 'password',
        label: 'Senha Atual',
      },
    ],
    [checkingUsernameAvailability, inputs, usernameChecked],
  );

  const handleChange = useCallback(
    (name, value, event, input) => setInput(input.path, value),
    [setInput],
  );

  const handleValidate = useCallback(
    (preffix, _schema, _setError) => async (name, value, event, input) => {
      const prefixedName = preffix ? `${preffix}.${name}` : name;

      try {
        await _schema.validateAt(name, {[name]: value});
        _setError(prefixedName, null);
      } catch (error) {
        _setError(prefixedName, error.message);
      }
    },
    [],
  );

  const handleDataFromChild = useCallback((data) => {
    try {
      if (!data?.image) {
        return {ok: false, error: 'Tipo de imagem inválida'};
      }

      setAvatarData((prevData) => ({
        ...prevData,
        name: data.name,
        image: data.image,
        hasChanged: true,
      }));

      return {ok: true};
    } catch (error) {
      console.error(
        'Handling error! Problema ao processar dados do avatar',
        error,
      );
      return {
        ok: false,
        error: `Problema ao processar dados do avatar, ${error}`,
      };
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (isNil(token) || isEmpty(token)) return;

    if (!hasData && dataWarning.current === false) {
      console.error('DATA WARNING');
      // alert(
      //   'Você deve terminar de preencher seu perfil para continuar usando a plataforma.',
      // );
      dataWarning.current = true;
    }

    setLoading(true);

    const fetchPrivileges = async () => {
      const result = await Privilegio.getAll(token);

      setTypeData(result);
    };

    const fetchUserData = async () => {
      const result = await Usuario.getById(token, user.id, true);

      savedCredentials.current = pick(result, 'username', 'email');

      const parsedResult = {
        ...result,
        created: {
          ...result.created,
          date: result.created.date.toDate(),
        },
        updated: {
          ...result.updated,
          date: result.updated.date.toDate(),
        },
        data: {
          ...result.data,
          nascimento: result.data.nascimento.isValid()
            ? result.data.nascimento.toDate()
            : undefined,
        },
      };

      setInputs(parsedResult);
      setLoading(false);
    };

    fetchPrivileges();
    fetchUserData();
  }, [token, setLoading, setTypeData, hasData, user.id, setInputs]);

  {
    /* Encaixar o avatar aqui no onSubmit, preciso criar a inser'cao do avatar no banco de dados */
  }
  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

      let validationPromise = Promise.resolve({});
      // TODO: Encaixar essas validacoes complexas dentro do YUP schema
      if (
        (!isNil(inputs.password) && !isEmpty(inputs.password)) || // senha/confirmacao de senha nao está vazio
        inputs.username !== user.username || // mudou username
        inputs.email !== user.email // mudou email
      ) {
        if (
          isNil(inputs.current_password) ||
          isEmpty(inputs.current_password)
        ) {
          setCredentialError('current_password', 'Informe a senha atual.');
          return;
        }

        if (!isNil(inputs.password) && !isEmpty(inputs.password)) {
          if (inputs.password !== inputs.confirmation_password) {
            setCredentialError(
              'confirmation_password',
              'Os campos "Senha" e "Confirmação de Senha" devem ser iguais.',
            );
            return;
          }
        }

        validationPromise = credentialSchema.validate(inputs, {
          abortEarly: false,
        });
      }

      validationPromise
        .then((credentials) => {
          schema
            .validate(
              {...(inputs?.data || {}), name: inputs.name},
              {abortEarly: false},
            )
            .then((data) => {
              const {name} = data;
              delete data.name;

              Usuario.updateById(token, user.id, {
                ...credentials,
                name,
                data,
              })
                .then(() => {
                  // reset passwords
                  setInputs({
                    ...inputs,
                    current_password: undefined,
                    password: undefined,
                    confirmation_password: undefined,
                  });
                  setHasData(true);
                  setErrors({});
                  setCredentialErrors({});

                  savedCredentials.current = pick(inputs, 'username', 'email');
                })
                .catch(() => {
                  alert('Não foi possível atualizar o perfil.'); // TODO: alert mais amigável com melhor descricao do erro
                });
            })
            .catch((err) => {
              setErrors(
                err.inner.reduce(
                  (obj, error) => ({
                    ...obj,
                    [error.path === 'name' ? 'name' : `data.${error.path}`]:
                      error.message,
                  }),
                  {},
                ),
              );
            });
        })
        .catch((err) => {
          setCredentialErrors(
            err.inner.reduce(
              (obj, error) => ({...obj, [error.path]: error.message}),
              {},
            ),
          );
        });
    },
    [inputs, user, credentialSchema, schema, token, setHasData],
  );

  return (
    <S.Wrapper px={{base: 0, lg: 6}}>
      <Text color="#2f7384" fontSize="2xl" fontWeight={600} marginBottom={4}>
        Meu Perfil
      </Text>
      <Box
        borderRadius={10}
        bg={{base: 'white', lg: 'white'}}
        color={{base: 'white', lg: 'white'}}
        boxShadow="0px 0.25rem 0.25rem 0px rgba(0, 0, 0, 0.25)">
        {!hasData ? (
          <Stack
            mx={6}
            my={5}
            spacing={4}
            align="flex-start"
            justify="center"
            direction="row">
            <Alert status="error">
              <AlertIcon />
              <AlertDescription color="red.700">
                É necessário que você preencha o complemento de dados abaixo
                para continuar usando a plataforma.
              </AlertDescription>
            </Alert>
          </Stack>
        ) : null}
        <Stack
          mx={5}
          my={5}
          spacing={4}
          align="flex-start"
          justify="center"
          direction="column">
          <S.Form
            // eslint-disable-next-line react/jsx-no-bind
            onSubmit={onSubmit}
            autoComplete="off">
            {typeData ? (
              <>
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  py={5}
                  px={10}
                  mb={5}
                  display="flex"
                  alignItems="center"
                  gap={10}>
                  <Avatar
                    size="xl"
                    name={avatarData.name}
                    src={avatarData.image}
                  />
                  <Button
                    colorScheme="primary"
                    px={14}
                    onClick={(event) => {
                      // selectUser(currentUser);
                      onOpen(event);
                    }}>
                    Alterar avatar
                  </Button>
                  {avatarData.hasChanged ? (
                    <Alert status="info">
                      <AlertIcon />
                      <AlertDescription color="blue.700">
                        Salve o avatar para atualizá-lo
                      </AlertDescription>
                    </Alert>
                  ) : null}
                </Box>
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  py={5}
                  px={6}
                  mb={5}>
                  <Form
                    inputs={form}
                    errors={errors}
                    value={inputs}
                    onChange={handleChange}
                    onValidate={handleValidate('data', schema, setError)}
                    spacing={5}
                    noSubmit
                  />
                </Box>
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  py={5}
                  px={6}
                  mb={5}>
                  <Alert status="info" mb={4}>
                    <AlertIcon />
                    <AlertDescription color="blue.700">
                      Para alteral qualquer informação abaixo será necessário
                      informar a senha atual.
                    </AlertDescription>
                  </Alert>
                  <Form
                    inputs={credentialForm}
                    errors={credentialErrors}
                    value={inputs}
                    onChange={handleChange}
                    onValidate={handleValidate(
                      undefined,
                      credentialSchema,
                      setCredentialError,
                    )}
                    spacing={5}
                    noSubmit
                  />
                </Box>
              </>
            ) : !loading ? (
              <p style={{color: 'black', marginBottom: '1rem'}}>
                <i>Ocorreu um erro ao buscar dados na api</i>
              </p>
            ) : (
              ''
            )}
            <Tooltip
              isDisabled={!checkingUsernameAvailability}
              label="Verificando a disponibilidade do nome de usuário...">
              <span>
                <Button
                  disabled={checkingUsernameAvailability}
                  colorScheme="primary"
                  type="submit"
                  isLoading={loading}>
                  Salvar
                </Button>
              </span>
            </Tooltip>
          </S.Form>
        </Stack>
      </Box>

      {/* Modal para escolher avatar */}

      <Modal
        isOpen={isOpen} // talvez nao precise disso
        onClose={onClose}
        size="4xl"
        isCentered
        motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent p={4}>
          <ModalHeader>Alterar avatar</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} isCentered={false}>
            <AvatarSelector
              sendDataToParent={handleDataFromChild}
              onClose={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </S.Wrapper>
  );
};

export default Perfil;
