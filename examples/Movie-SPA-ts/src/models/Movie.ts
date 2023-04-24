export type MovieData = {
  id: string
  title: string
  year: string
  director: string
  genre: string
  runtime: string
  plot: string
  poster: string
}

export default class Movie {
  id: string
  title: string
  year: string
  director: string
  genre: string
  runtime: string
  plot: string
  poster: string

  constructor({ ...movieData }: MovieData) {
    this.id = movieData.id
    this.title = movieData.title
    this.year = movieData.year
    this.director = movieData.director
    this.genre = movieData.genre
    this.runtime = movieData.runtime
    this.plot = movieData.plot
    this.poster = movieData.poster
  }
}
