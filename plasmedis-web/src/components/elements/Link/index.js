import React from 'react';

import {getProtocol, truncateText} from './utils';

const Link = ({href, linkComponent, truncate, ...rest}) => {
  const Component = linkComponent ?? 'a';
  const protocol = getProtocol(href);
  const text = truncate ? truncateText(href, truncate) : href;

  return (
    <Component {...rest} href={`${protocol}${href}`}>
      {text}
    </Component>
  );
};

export default Link;
