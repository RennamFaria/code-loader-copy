import React, {useRef, useEffect} from 'react';

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value; // assign the value of ref to the argument
  }, [value]); // this code will run when the value of 'value' changes

  return ref; // in the end, return the ref.
}

export default usePrevious;
