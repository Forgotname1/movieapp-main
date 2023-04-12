import React, {Component} from "react";
import './App.css';
import 'antd/dist/reset.css';
import service from "../../service/movie-db-api";
import {Context} from "../../context";
import {CardList} from "../CardList/CardList";
import {Layout, Pagination, Tabs} from "antd";
import {Footer} from "antd/es/layout/layout";

export default class App extends Component {
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
    }

    componentDidMount() {
        // this.setState({loading: true})
        service.getGenres().then((response) => {
            this.setState({loading: false})
            this.setState({genres: response})
        }).catch((error) => {
            this.setState({error: error})
        })
        service.createGuestSession().catch((error) => {
            this.setState({error: error})
        });
        service.getResource().then((res) => {

            this.setState({loading: false})
            this.setState(({movies}) => {
                return {movies: res}
            })
        }).catch((error) => {
            this.setState({error: error})
        })

    }

    ratedMovies = (e) => {
        this.setState({loading: true});
        if (e == 2) {
            this.setState({rate: true})
            service.getRatedMovies().then((res) => {
                this.setState({loading: false, ratedMovies: res})
            }).catch((error) => {
                this.setState({error: error})
            })
        }
        if (e == 1) {
            this.setState({rate: false})
            service.getResource().then((res) => {
                this.setState({loading: false, movies: res})
            }).catch((error) => {
                this.setState({error: error})
            })
        }
    }


    items = [{
        key: '1', label: 'Search', children: (<>
            <div className={"page-wrapper"}>
                <CardList
                    movies={this.state.movies}
                    getResourses={service.getResource}
                    loading={this.state.loading}
                    error={this.state.error}
                    rate={this.state.rate}
                />
                <Footer>
                    <Pagination pageSize={20} width={"100ww"} defaultCurrent={1} current={this.state.currentPage}
                                total={this.state.total}
                                onChange={(e) => this.setState({currentPage: e})}/>
                </Footer>
            </div>
        </>)
    },
        {
            key: '2', label: 'Rated', children: (<>
                <div className={"page-wrapper"}>
                    <CardList
                        getResourses={service.getResource}
                        movies={this.state.movies}
                        getMovies={this.getMovies}
                        loading={this.state.loading}
                        error={this.state.error}
                        rated={this.state.rated}
                    />
                </div>
            </>)
        }]


    render() {

        // const {loading, error, movies, currentPage, total, rated, genres} = this.state;
        return (
            <Context.Provider value={this.state.genres}>
                <div className={"app"}>
                    <Layout>
                        <CardList
                            movies={this.state.movies}
                            getResourses={service.getResource}
                            loading={this.state.loading}
                            error={this.state.error}
                            rate={this.state.rate}
                        />
                        <Footer>
                            <Pagination pageSize={20} width={"100ww"} defaultCurrent={1}
                                        current={this.state.currentPage}
                                        total={this.state.total}
                                        onChange={(e) => this.setState({currentPage: e})}/>
                        </Footer>
                    </Layout>
                    <Layout>
                        {/*<Tabs defaultActiveKey='1' centered items={this.items} onChange={(e)=> this.ratedMovies(e)}/>*/}

                    </Layout>
                </div>
            </Context.Provider>
        )
    }
}