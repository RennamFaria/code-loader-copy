import {Text} from '@chakra-ui/layout';
import {FiTrash} from 'react-icons/fi';
import styled from 'styled-components';

export const TextAnchor = styled(Text)`
  a,
  a:link {
    text-decoration: underline;
    color: var(--chakra-colors-blue-500);

    &:hover {
      color: var(--chakra-colors-blue-600);
    }

    &:visited {
      color: var(--chakra-colors-purple-700);

      &:hover {
        color: var(--chakra-colors-purple-800);
      }
    }
  }
  white-space: pre-wrap;
  word-break: break-word;
`;

export const FiTrashIcon = styled(FiTrash)`
  cursor: pointer;
`;

export default {
  TextAnchor,
};
