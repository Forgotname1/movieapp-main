import React from 'react';
import { Input } from 'antd';
import debounce from 'lodash.debounce';

function SearchInput({ getMovies }) {
  const debounceRequest = debounce((query) => {
    getMovies(query);
  }, 300);

  const onChange = (evt) => {
    debounceRequest(evt.target.value || 'return');
  };

  return <Input placeholder="Type to search..." onChange={(event) => onChange(event)} />;
}

export default SearchInput;
