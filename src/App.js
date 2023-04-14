import React, { Component } from 'react';
import { Alert, Layout, Pagination, Tabs } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import debounce from 'lodash.debounce';
import { Offline, Online } from 'react-detect-offline';

import service from './service/movie-db-api';
import { Context } from './context';
import { CardList } from './components/CardList/CardList';

import 'antd/dist/reset.css';
import './App.css';

class App extends Component {
  state = {
    movies: {},
    ratedMovies: {},
    loading: false,
    error: {},
    // query: '',
    total: 0,
    currentPage: 1,
    genres: [],
    rate: false,
    searchText: '',
  };

  getMovies = (query = 'return', page = 1) => {
    this.setState({ loading: true, currentPage: page });
    service
      .getMovies(query, page)
      .then((data) => {
        this.setState({ movies: data.results, loading: false, query, total: data.total_pages });
      })
      .catch(() => {
        this.setState({ loading: false, error: true });
      });
  };

  componentDidMount() {
    this.setState({ loading: true });
    service
      .getGenres()
      .then((response) => {
        this.setState({ loading: false });
        this.setState({ genres: response });
      })
      .catch((error) => {
        this.setState({ error });
      });
    service.createGuestSession().catch((error) => {
      this.setState({ error });
    });
    service
      .getResource()
      .then((res) => {
        this.setState({ loading: false, movies: res, total: res.total_pages });
      })
      .catch((error) => {
        this.setState({ error });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchText !== this.state.searchText) {
      this.debounceSearchInput();
      // service.getResource('1', this.state.searchText).then((res) => {
      //     this.setState({loading: false, movies: res, total: res.total_pages})
      // })
    }
    if (prevState.currentPage !== this.state.currentPage) {
      service.getResource(this.state.currentPage).then((res) => {
        this.setState({ loading: false, movies: res, total: res.total_pages });
      });
    }
  }

  searchInput = (event) => {
    this.setState({ searchText: event.target.value });
  };

  debounceSearchInput = () => debounce(this.searchInput, 500);

  ratedMovies = (e) => {
    this.setState({ loading: true });
    if (e === '2') {
      this.setState({ rate: true });
      service
        .getRatedMovies()
        .then((res) => {
          this.setState({ loading: false, ratedMovies: res });
        })
        .catch((error) => {
          this.setState({ error });
        });
    }
    if (e === '1') {
      this.setState({ rate: false });
      service
        .getResource()
        .then((res) => {
          this.setState({ loading: false, movies: res });
        })
        .catch((error) => {
          this.setState({ error });
        });
    }
  };

  render() {
    const items = [
      {
        key: '1',
        label: 'Search',
        children: (
          <div className={'page-wrapper'}>
            <CardList
              movies={this.state.movies}
              getResourses={service.getResource}
              loading={this.state.loading}
              error={this.state.error}
              rate={this.state.rate}
              text={this.state.searchText}
              searchInput={this.searchInput}
              getMovies={this.getMovies}
            />
            <Footer>
              <Pagination
                pageSize={20}
                width="100ww"
                defaultCurrent={1}
                current={this.state.currentPage}
                total={this.state.total}
                onChange={(e) => this.setState({ currentPage: e })}
              />
            </Footer>
          </div>
        ),
      },
      {
        key: '2',
        label: 'Rated',
        children: (
          <div className={'page-wrapper'}>
            <CardList
              getResourses={service.getResource}
              movies={this.state.ratedMovies}
              getMovies={this.getMovies}
              loading={this.state.loading}
              error={this.state.error}
              rate={this.state.rate}
              debounceSearchInput={this.debounceSearchInput}
            />
          </div>
        ),
      },
    ];
    // const {loading, error, movies, currentPage, total, rated, genres} = this.state;
    return (
      <div className="app">
        <Offline>
          <Alert message="отсутствует соединения с интернетом, проверьте подключение" type="error" showIcon />
        </Offline>
        <Online>
          <Context.Provider value={this.state.genres}>
            <Layout>
              <Tabs defaultActiveKey="1" centered items={items} onChange={(e) => this.ratedMovies(e)} />
            </Layout>
          </Context.Provider>
        </Online>
      </div>
    );
  }
}

export default App;
