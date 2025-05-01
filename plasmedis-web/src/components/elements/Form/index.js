import React, {useRef, useState, useMemo, useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Radio,
  RadioGroup,
  Select,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
  Checkbox,
  Text,
} from '@chakra-ui/react';
import InputMask from 'react-input-mask';
import {get, isArray, isEmpty, isFunction, isNil, isString} from 'lodash';
import decodeDate from '../../../utils/decodeDate';
import DynamicInput from './DynamicInput';

const CompositeInput = ({
  source,
  name,
  label,
  path,
  error,
  helperText,
  helperStatus: helperStatusProp,
  required,
  onChange,
  onValidate,
  ...props // cant be ...props, it causes unnecessary rerenders
}) => {
  const fallbackLabel = useMemo(() => label || name, [label, name]);

  // memoizing value manually to keep rerenderings from taking place AND allow a memoized lodash get from source
  const value = useMemo(() => get(source, path), [source, path]);
  const memoizedValue = useMemo(() => value, [value]);
  // const memoizedValue = useRef();
  // useEffect(() => {
  //   if (value !== memoizedValue) memoizedValue = value;
  //   // memoizedValue = value;
  // }, [value]);

  const memoizedInput = useMemo(() => {
    return (
      <DynamicInput
        name={name}
        label={fallbackLabel}
        value={memoizedValue}
        required={required}
        {...props}
        onChange={onChange}
        onValidate={onValidate}
      />
    );
  }, [
    name,
    fallbackLabel,
    memoizedValue,
    required,
    props,
    onChange,
    onValidate,
  ]);

  // HELPER
  const helperStatus = useMemo(
    () => helperStatusProp || 'info',
    [helperStatusProp],
  );
  const helperColor = useMemo(
    () =>
      ({
        info: 'blue.700',
        success: 'green.700',
        warning: 'yellow.700',
      }[helperStatus]),
    [helperStatus],
  );

  const helperNode = useMemo(() => {
    // console.log('============  HELPER NODE  ==================');
    if (isEmpty(helperText) || isNil(helperText)) return null;

    if (!isString(helperText)) return helperText;

    return (
      <FormHelperText color={helperColor}>
        <Alert status={helperStatus}>
          <AlertIcon />
          <AlertDescription>{helperText}</AlertDescription>
        </Alert>
      </FormHelperText>
    );
  }, [helperColor, helperStatus, helperText]);

  // console.log('(CompositeInput) render');
  return (
    <FormControl id={name} key={name} isInvalid={!!error} errortext={error}>
      <FormLabel color="#000" display="flex" style={{gap: '5px'}}>
        {fallbackLabel}
        {!required ? null : <Text color="red">*</Text>}
      </FormLabel>
      {memoizedInput}
      <FormErrorMessage>
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </FormErrorMessage>
      {error ? null : helperNode}
    </FormControl>
  );
};
CompositeInput.displayName = 'CompositeInput';

const Form = ({
  inputs,
  errors,
  value,
  submitText = 'Confirmar',
  noSubmit,
  onChange,
  onValidate,
  onSubmit,
  ...stackProps
}) => {
  const isLoading = useMemo(() => {
    return isNil(inputs) || isNil(value);
  }, [inputs, value]);

  // EVENTS
  const handleChange = useMemo(() => onChange, [onChange]);
  const handleValidate = useMemo(() => onValidate, [onValidate]);

  const handleSubmit = useCallback(
    (event) => {
      if (onSubmit) onSubmit(event);
    },
    [onSubmit],
  );

  const renderInput = useCallback(
    (inputData, index) => {
      return (
        <CompositeInput
          key={inputData.name}
          source={value}
          onChange={(_value, event) => {
            handleChange(inputData.name, _value, event, inputData);
          }}
          onValidate={(_value, event, trigger) =>
            handleValidate(inputData.name, _value, event, {
              ...inputData,
              validateOn: trigger,
            })
          }
          {...inputData}
          error={get(errors, inputData.path)}
        />
      );
    },
    [errors, handleChange, handleValidate, value],
  );

  const compositeInputs = useMemo(() => {
    if (isNil(inputs)) return null;

    return inputs.map((inputData, index) => {
      if (isArray(inputData)) {
        return (
          <Stack
            key={index}
            direction="row"
            spacing={4}
            width="100%"
            alignItems="start">
            {inputData.map((nestedInputData) => renderInput(nestedInputData))}
          </Stack>
        );
      }
      return renderInput(inputData);
    });
  }, [inputs, renderInput]);

  // console.log('(Form) render', errors);
  return (
    <Stack
      spacing={4}
      align="flex-start"
      justify="center"
      direction="column"
      {...stackProps}>
      {compositeInputs}
      {!noSubmit ? (
        <Button
          colorScheme="primary"
          isLoading={isLoading}
          type="submit"
          onClick={handleSubmit}>
          {submitText}
        </Button>
      ) : null}
    </Stack>
  );
};

Form.displayName = 'Form';
Form.defaultProps = {
  value: undefined,
  inputs: [],
  submitText: 'Confirmar',
  onChange: () => {},
  onValidate: () => {},
  onSubmit: () => {},
};

Form.propTypes = {
  inputs: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired,
          // name: PropTypes.string.isRequired,
          // placeholder: PropTypes.string,
          // mask: PropTypes.regex,
          // alternatives: PropTypes.arrayOf(
          //   PropTypes.shape({
          //     id: PropTypes.number.isRequired,
          //     value: PropTypes.string.isRequired,
          //   }),
          // ),
        }),
      ),
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
        // name: PropTypes.string.isRequired,
        // placeholder: PropTypes.string,
        // mask: PropTypes.regex,
        // alternatives: PropTypes.arrayOf(
        //   PropTypes.shape({
        //     id: PropTypes.number.isRequired,
        //     value: PropTypes.string.isRequired,
        //   }),
        // ),
      }),
    ]),
  ),
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.object,
  submitText: PropTypes.string,
  onChange: PropTypes.func,
  onValidate: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default Form;
