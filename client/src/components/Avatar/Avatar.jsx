import React from 'react';
import PropTypes from 'prop-types';

import './Avatar.scss';

const Avatar = ({ src, children, optionalClass }) => (
  <span className={`avatar ${optionalClass}`}>
    {children || <img src={src} alt="" />}
  </span>
);

Avatar.propTypes = {
  src: PropTypes.string,
  children: PropTypes.node,
  optionalClass: PropTypes.string,
};

Avatar.defaultProps = {
  optionalClass: '',
};

export default Avatar;
