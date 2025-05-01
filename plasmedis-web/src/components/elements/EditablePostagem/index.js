import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';

import {FormControl, FormLabel, Input, Select} from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Textarea from '../Textarea';

const EditablePostagem = ({value, categories, onPostUpdate} = {}) => {
  return (
    value && (
      <div>
        <FormControl id="title">
          <FormLabel>Título</FormLabel>
          <Input
            colorScheme="primary"
            type="text"
            value={value.title}
            onChange={(event) => {
              onPostUpdate('title', event.target.value);
            }}
          />
          {/* <FormHelperText>Título da sua postagem.</FormHelperText> */}
        </FormControl>
        <FormControl id="description">
          <FormLabel>Descrição</FormLabel>
          <ReactQuill
            theme="snow"
            value={value.description}
            onChange={(newValue) => {
              value.description = newValue;
            }}
          />
          {/* <FormHelperText>Título da sua postagem.</FormHelperText> */}
        </FormControl>

        <FormControl id="category">
          <FormLabel>Categoria</FormLabel>
          <Select
            colorScheme="primary"
            value={value.category.id}
            onChange={(event) => {
              onPostUpdate('category', event.target.value);
            }}>
            {categories.map((category) => {
              return (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              );
            })}
          </Select>
          {/* <FormHelperText>Título da sua postagem.</FormHelperText> */}
        </FormControl>
      </div>
    )
  );
};

EditablePostagem.displayName = 'EditablePostagem';
EditablePostagem.propTypes = {};

export default EditablePostagem;
