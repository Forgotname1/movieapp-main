import React from 'react';
import './CardList.css';
import { Space, Layout, Spin, Alert } from 'antd';

import CardItem from '../Card/Card';
import SearchInput from '../SearchInput/SearchInput';

const { Content } = Layout;

export function CardList({ movies, loading, error, text, rate, getMovies }) {
  return (
    <Content>
      {rate || <SearchInput getMovies={getMovies} text={text} />}
      <Space className="contentMovies">
        {error.length && <Alert message={error.message} type="error" showIcon className="error" />}
        {loading && <Spin size="large" spinning={loading} tip="Loading..." />}
        {!loading && movies.results && movies.results.map((movie) => <CardItem key={movie.id} {...movie} />)}
      </Space>
    </Content>
  );
}
// <Input placeholder="Type to search..." value={text} onChange={debounceSearchInput} className="inputText" />
