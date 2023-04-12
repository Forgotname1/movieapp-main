import React from "react";
import './CardList.css'
import { Space, Input, Layout, Spin, Alert } from 'antd';
import {CardItem} from "../Card/Card";

const { Content } = Layout;

export function CardList({ movies, loading, error, searchInput, text, rate, getResourses }) {
   console.log(movies)
    return (
        <Content>
            {rate || <Input placeholder="Type to search..." value={text} onChange={searchInput} className="inputText" />}
            <Space className="contentMovies">
                {error && <Alert message={error.message} type="error" showIcon className="error" />}
                {loading && <Spin size="large" spinning={loading} tip="Loading..." />}
                {!loading &&
                    movies.results &&
                    movies.results.map((movie) => <CardItem key={movie.id} {...movie} />)}
            </Space>
        </Content>
    );
}