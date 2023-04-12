 class MovieServise {
    _apiBase = 'https://api.themoviedb.org/3';
    _apiKey = 'api_key=cff84ceb7c46558844a504c83fb71bc0';
    async getResource ( page, query) {
        return  await fetch(`${this._apiBase}/search/movie?${this._apiKey}&query=${query || 'return'}&page=${page || '1'}`).then((res) => {
            if(!res.ok) {
                throw new Error('не получил фильм + ', `received ${res.status}`)
            }
            return res.json();
        })

    }
    // getMovies(query, page) {
    //     return this.getResource('/search/movie', `query=${query}&page=${page}`)
    // }
    async getGenres () {
        const urlGenres = `${this._apiBase}/genre/movie/list?${this._apiKey}`
        return await fetch(urlGenres).then((response) => {
            if(!response.ok) {
                throw new Error('жанры не найдены')
            }
            return response.json();
        })
    }
    async createGuestSession () {
        if (!localStorage.getItem('guestSession')) {
            const urlGuestSession = `${this._apiBase}/authentication/guest_session/new?${this._apiKey}`
            return await fetch(urlGuestSession).then((response) => {
                if (!response.ok) {
                    throw new Error('жанры не найдены')
                }
                return response.json();
            }).then((res)=> localStorage.setItem('guestSession', JSON.stringify(res))
            )

        }
    }
   async getRatedMovies () {
        const { guest_session_id } = JSON.parse(localStorage.getItem('guestSession'));
        const urlRatedMovies = `${this._apiBase}/guest_session/${guest_session_id}/rated/movies?${this._apiKey}&language=en-US&sort_by=created_at.asc`
       return await fetch(urlRatedMovies).then((response) => {
           if (!response.ok) {
               throw new Error('не получили оцененные фильмы')
           }
           return response.json();
       })
   }
   async postRatedMovies (movieId, value, sessionId) {
        const urlRate = `${this._apiBase}/movie/${movieId}/rating?${this._apiKey}&guest_session_id=${sessionId}`;
        const requestOptions = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({value:value})
        }
       return await fetch(urlRate,requestOptions).then((response) => {
           if (!response.ok) {
               throw new Error('произлшел сбой в оценке фильмов')
           }
           return response.json();
       })
   }
}
const service = new MovieServise();
export default service;
