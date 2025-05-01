import React, {useCallback, useContext, useMemo} from 'react';
import PropTypes from 'prop-types';
import {Anchorme} from 'react-anchorme';
import {Stack, Box, Text, Flex} from '@chakra-ui/layout';
import {Avatar} from '@chakra-ui/avatar';
import {Context as AuthContext} from '../../stores/Auth';
import {TextAnchor, FiTrashIcon} from './styles.js';

const Comentario = ({item, onDelete: onDeleteProp} = {}) => {
  const {user} = useContext(AuthContext);

  const checkIfIsAbleToDelete = () => {
    if (user.id === item.author.id || user.type === 1 || user.type === 2) {
      return true;
    }

    return false;
  };

  const onDelete = useMemo(() => {
    return onDeleteProp || (() => {});
  }, [onDeleteProp]);

  return (
    <Flex flexDirection="row" align="flex-start">
      <Box mr={{base: 2, lg: 3}}>
        <Avatar name={item.author?.name} src={item.author?.avatar} />
      </Box>
      <Box p={{base: 3, lg: 3}} background="#ddd" borderRadius="10px">
        <Stack direction="row" justifyContent="space-between">
          <Flex direction="column">
            <Text fontWeight="bold" fontSize="xs" color="black">
              {item.author?.name}
            </Text>
            <Text mb={4} fontSize="xs" color="gray">
              {item.dateTime.fromNow()}
            </Text>
          </Flex>
          {checkIfIsAbleToDelete() ? (
            <FiTrashIcon size={15} onClick={onDelete} />
          ) : (
            <></>
          )}
        </Stack>

        <TextAnchor size="sm" color="black" align="justify">
          <Anchorme target="_blank" rel="noreferrer noopener">
            {item.body}
          </Anchorme>
        </TextAnchor>
      </Box>
    </Flex>
  );
};

Comentario.displayName = 'Comentario';
Comentario.defaultProps = {
  item: {},
};
Comentario.propTypes = {
  item: PropTypes.shape({
    author: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
    id: PropTypes.number,
    post: PropTypes.number,
    dateTime: PropTypes.object.isRequired, // TODO: invoke moment object type
    body: PropTypes.string,
  }),
};

export default Comentario;
