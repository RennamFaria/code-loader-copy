import React, {useMemo} from 'react';
import ReactDatePicker from 'react-datepicker';
import {useColorMode} from '@chakra-ui/react';

import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

import PropTypes from 'prop-types';

const DatePicker = ({
  value,
  onChange,
  isClearable = false,
  showPopperArrow = false,
  ...props
}) => {
  const isLight = useColorMode().colorMode === 'light'; // you can check what theme you are using right now however you want
  // console.log('VALUE DATEPICKER', value, typeof value);
  return (
    // if you don't want to use chakra's colors or you just wwant to use the original ones,
    // set className to "light-theme-original" ↓↓↓↓
    <div className={isLight ? 'light-theme' : 'dark-theme'}>
      <ReactDatePicker
        selected={value}
        onChange={onChange}
        isClearable={isClearable}
        showPopperArrow={showPopperArrow}
        className="react-datapicker__input-text" // input is white by default and there is no already defined class for it so I created a new one
        {...props}
      />
    </div>
  );
};

DatePicker.displayName = 'DatePicker';
DatePicker.defaultProps = {
  isClearable: false,
  showPopperArrow: false,
  value: undefined,
};
DatePicker.propTypes = {
  isClearable: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.instanceOf(Date),
  showPopperArrow: PropTypes.bool,
};

export default DatePicker;
