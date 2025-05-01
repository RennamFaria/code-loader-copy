/* eslint-disable react/prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React, {useState, useMemo, useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';

import {
  Input,
  Select,
  Checkbox,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

import InputMask from 'react-input-mask';
import {debounce, isNil} from 'lodash';
import DatePicker from '../../DatePicker';
import CustomRadio from '../../CustomRadio';

// different input types yields event and value in different property paths/orders
function spreadEventArgumentsByType(type, arg1, arg2) {
  let event;
  let inputValue;

  switch (type) {
    case 'check':
      event = arg1;
      inputValue = event.target.checked;
      break;
    case 'date':
    case 'radio':
      event = arg2;
      inputValue = arg1;
      break;
    case 'numeric':
    case 'select':
    case 'text':
    case 'email':
    case 'password':
    default:
      event = arg1;
      inputValue = event.target.value;
  }

  return [inputValue, event];
}

const DynamicInput = ({
  type,
  value,
  onChange,
  validateOn,
  onValidate,
  required,
  ...props
}) => {
  const {
    // node props
    stackProps,
    // select/radio
    options,
    optionProps,
    custom,
    // text/numeric
    placeholder,
    // text
    mask,
    //
    name,
    label,
    ...inputProps
  } = props;

  // VALUE
  const [controlledValue, setControlledValue] = useState(value);
  useEffect(() => {
    if (controlledValue !== value) setControlledValue(value);
  }, [setControlledValue, controlledValue, value]);

  const propagateOnChange = useCallback(
    (eventValue, event) => {
      setControlledValue(eventValue);
      onChange && onChange(eventValue, event);
    },
    [onChange, setControlledValue],
  );

  const changeHandler = useCallback(
    (arg1, arg2) => {
      const [eventValue, event] = spreadEventArgumentsByType(type, arg1, arg2);

      setControlledValue(eventValue);
      onChange && onChange(eventValue, event);

      return true;
    },
    [type, setControlledValue, onChange],
  );

  // VALIDATION
  const emptyCheck = useMemo(() => {
    switch (type) {
      case 'numeric':
      case 'text':
      case 'email':
      case 'password':
      case 'date':
      case 'select':
        return (v) => isNil(v) || v === '';
      case 'check':
      case 'radio':
      default:
        return (v) => isNil(v);
    }
  }, [type]);

  const validationEvent = useMemo(() => {
    if (!isNil(validateOn)) return validateOn;

    switch (type) {
      case 'numeric':
      case 'text':
      case 'email':
      case 'password':
        return 'onBlur';
      case 'check':
      case 'date':
      case 'radio':
      case 'select':
      default:
        return 'onChange';
    }
  }, [type, validateOn]);

  const debouncedOnValidate = useMemo(() => {
    if (isNil(onValidate)) return () => {};

    return debounce(
      (eventValue, event) => onValidate(eventValue, event, validationEvent),
      500,
    );
  }, [onValidate, validationEvent]);

  const validateHandler = useCallback(
    (arg1, arg2) => {
      const [eventValue, event] = spreadEventArgumentsByType(type, arg1, arg2);

      if (emptyCheck(eventValue)) return;

      // TODO: check if value changed before disptaching validate event
      debouncedOnValidate(eventValue, event);
    },
    [debouncedOnValidate, type, emptyCheck],
  );

  const validationProps = useMemo(() => {
    if (validationEvent === 'onChange')
      return {
        onChange: (arg1, arg2) => {
          const changed = changeHandler(arg1, arg2);
          if (changed) validateHandler(arg1, arg2);
        },
      };

    return {
      [validationEvent]: validateHandler,
    };
  }, [validationEvent, validateHandler, changeHandler]);

  // console.log(`(DynamicInput:${type}) render`, props);
  switch (type) {
    case 'check':
      return (
        <Checkbox
          name={name}
          isChecked={controlledValue}
          onChange={(event) => propagateOnChange(event.target.checked, event)}
          {...validationProps}
          // check props
          color="#000"
          direction="row"
          spacing={4}
          {...inputProps}
        />
      );
    case 'date':
      return (
        <DatePicker
          name={name}
          value={controlledValue}
          onChange={(inputValue, event) =>
            propagateOnChange(new Date(inputValue), event)
          }
          {...validationProps}
          // date props
          dateFormat="dd/MM/yyyy"
          {...inputProps}
        />
      );
    case 'numeric':
      return (
        <NumberInput
          name={name}
          type="numeric"
          value={controlledValue ?? 0}
          onChange={(newValue) => propagateOnChange(parseInt(newValue, 10))}
          {...validationProps}
          // numeric props
          min={0}
          {...inputProps}>
          <NumberInputField color="#000" placeholder={placeholder} />
          <NumberInputStepper>
            <NumberIncrementStepper bg="gray.200" _active={{bg: 'gray.300'}} />
            <NumberDecrementStepper bg="gray.200" _active={{bg: 'gray.300'}} />
          </NumberInputStepper>
        </NumberInput>
      );
    case 'radio':
      return (
        <CustomRadio
          name={name}
          value={controlledValue}
          onChange={(event) => propagateOnChange(event)}
          // radio props
          options={options}
          custom={custom}
          stackProps={stackProps}
          optionProps={optionProps}
          {...validationProps}
          {...inputProps}
        />
      );
    case 'select':
      return (
        <Select
          value={controlledValue}
          onChange={(event) => propagateOnChange(event.target.value, event)}
          {...validationProps}
          // select props
          color="#000"
          direction="row"
          spacing={4}
          {...inputProps}>
          {(options || []).map((option, index) => (
            <option key={index} value={option.value}>
              {option.text || option.value}
            </option>
          ))}
        </Select>
      );
    case 'text':
    case 'email':
    case 'password':
      return (
        <Input
          type={type}
          value={controlledValue || ''}
          onChange={(event) => propagateOnChange(event.target.value, event)}
          {...validationProps}
          // text props
          color="black"
          // maskChar={null}
          as={!isNil(mask) ? InputMask : undefined}
          {...inputProps}
          placeholder={
            placeholder === undefined ? label : placeholder && placeholder
          }
        />
      );
    default:
      return <div>Unknown inputProps type ({type})</div>;
  }
};

DynamicInput.displayName = 'DynamicInput';
DynamicInput.defaultProps = {
  onChange: () => {},
  validateOn: undefined,
  onValidate: undefined,
};

DynamicInput.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func,
  validateOn: PropTypes.string,
  onValidate: PropTypes.func,
};

export default DynamicInput;
