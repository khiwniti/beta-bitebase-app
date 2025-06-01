import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Initializer = ({ setPlugin }) => {
  const ref = useRef();
  ref.current = setPlugin;

  useEffect(() => {
    ref.current('agent-integration');
  }, []);

  return null;
};

Initializer.propTypes = {
  setPlugin: PropTypes.func.isRequired,
};

export default Initializer; 