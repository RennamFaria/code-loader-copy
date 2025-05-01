import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {isNull} from 'lodash';

import {Spinner, Box} from '@chakra-ui/react';
import Postagem from '../Postagem';

import * as User from '../../../domain/usuarios';

const Feed = ({
  value,
  user,
  canVerifyPost,
  fetchComments,
  onCreateComment,
  onToggleSelo,
  fetchNextPage,
  hasMorePosts,
} = {}) => {
  const loaderRef = useRef(null);
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadMore(true);
          fetchNextPage();
          setLoadMore(false);
        }
      },
      {threshold: 1},
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [value, loaderRef]);

  if (isNull(value)) {
    return (
      <Box w="100%" textAlign="center" mt={5}>
        <Spinner colorScheme="primary" />
      </Box>
    );
  }

  return (
    <>
      {value.map((postagem, index) => {
        if (index === value.length - 1 && hasMorePosts) {
          return (
            <div key={postagem.id} ref={loaderRef}>
              <Postagem
                item={postagem}
                user={user}
                verifiable={canVerifyPost}
                fetchComments={fetchComments}
                onCreateComment={onCreateComment}
                onToggleSelo={onToggleSelo}
              />
              {loadMore && (
                <Box w="100%" textAlign="center" mt={5}>
                  <Spinner colorScheme="primary" />
                </Box>
              )}
            </div>
          );
        }
        return (
          <Postagem
            key={postagem.id}
            item={postagem}
            user={user}
            verifiable={canVerifyPost}
            fetchComments={fetchComments}
            onCreateComment={onCreateComment}
            onToggleSelo={onToggleSelo}
          />
        );
      })}
    </>
  );
};

Feed.displayName = 'Feed';
Feed.defaultProps = {
  value: [],
  user: User.PropTypes.UserDefault,
  canVerifyPost: false,
  fetchComments: async () => [],
  onCreateComment: () => {},
  onToggleSelo: () => {},
  fetchNextPage: () => {},
  hasMorePosts: false,
};
Feed.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      category: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
      dateTime: PropTypes.object.isRequired, // TODO: invoke moment object type
    }),
  ),
  user: User.PropTypes.User,
  canVerifyPost: PropTypes.bool,
  fetchComments: PropTypes.func,
  onCreateComment: PropTypes.func,
  onToggleSelo: PropTypes.func,
  fetchNextPage: PropTypes.func,
  hasMorePosts: PropTypes.bool,
};

export default Feed;
