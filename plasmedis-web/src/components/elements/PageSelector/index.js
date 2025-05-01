import React, {
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {Flex} from '@chakra-ui/layout';
import {Button, IconButton} from '@chakra-ui/button';
import {
  MdNavigateBefore,
  MdNavigateNext,
  MdFirstPage,
  MdLastPage,
} from 'react-icons/md';
import {Icon} from '@chakra-ui/react';

const PageSelector = ({metadata, onChangePage} = {}) => {
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    if (metadata.count) {
      setisLoading(false);
    }
  }, [metadata]);

  return isLoading ? null : (
    <Flex mt={6} alignItems="center" justifyContent="center">
      <IconButton
        backgroundColor="#F0F6F8"
        mr={1}
        icon={<Icon as={MdFirstPage} fontSize={25} />}
        onClick={() => onChangePage(1)}
        hidden={metadata.current - 1 <= 1}
      />
      <IconButton
        backgroundColor="#F0F6F8"
        mr={1}
        icon={<Icon as={MdNavigateBefore} fontSize={25} />}
        onClick={() => onChangePage(metadata.current - 1)}
        hidden={!metadata.previous}
      />
      <Button
        backgroundColor="#F0F6F8"
        ml={1}
        onClick={() => onChangePage(metadata.current - 2)}
        hidden={metadata.current - 2 < 1}>
        {metadata.current - 2}
      </Button>
      <Button
        backgroundColor="#F0F6F8"
        mr={1}
        onClick={() => onChangePage(metadata.current - 1)}
        hidden={!metadata.previous}>
        {metadata.current - 1}
      </Button>
      <Button colorScheme="primary">{metadata.current}</Button>
      <Button
        backgroundColor="#F0F6F8"
        ml={1}
        onClick={() => onChangePage(metadata.current + 1)}
        hidden={!metadata.next}>
        {metadata.current + 1}
      </Button>
      <Button
        backgroundColor="#F0F6F8"
        ml={1}
        onClick={() => onChangePage(metadata.current + 2)}
        hidden={(metadata.current + 2) * metadata.limit > metadata.count}>
        {metadata.current + 2}
      </Button>
      <IconButton
        backgroundColor="#F0F6F8"
        ml={1}
        icon={<Icon as={MdNavigateNext} fontSize={25} />}
        onClick={() => onChangePage(metadata.current + 1)}
        hidden={!metadata.next}
      />
      <IconButton
        backgroundColor="#F0F6F8"
        ml={1}
        icon={<Icon as={MdLastPage} fontSize={25} />}
        onClick={() => onChangePage(Math.ceil(metadata.count / metadata.limit))}
        hidden={(metadata.current + 1) * metadata.limit >= metadata.count}
      />
    </Flex>
  );
};

PageSelector.displayName = 'PageSelector';
PageSelector.defaultProps = {
  metadata: {},
  onChangePage: () => {},
};
PageSelector.propTypes = {
  metadata: PropTypes.shape({
    count: PropTypes.number,
    current: PropTypes.number,
    limit: PropTypes.number,
    next: PropTypes.string,
    previous: PropTypes.string,
  }),
  onChangePage: PropTypes.func,
};

export default PageSelector;
