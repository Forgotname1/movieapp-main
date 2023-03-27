export default class MovieApi {
    _apiBase = 'https://api.themoviedb.org/3'
    _apiKey = 'api_key=3d5fcff070bf109ad631bfb2abbd8e6e'

    async getResource(url, query) {
        const res = await fetch(`${this._apiBase}${url}?${this._apiKey}&${query}`)

        if (!res.ok) {
            throw new Error(`Could not fetch , received ${res.status}`)
        }

        return await res.json()
    }
}