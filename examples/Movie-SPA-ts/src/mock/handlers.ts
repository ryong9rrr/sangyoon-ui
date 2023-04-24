import { MovieData } from "../models/Movie"
import movieData from "./movies.json"

// It is fake api...
export const fetchMovies = (): Promise<MovieData[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(movieData.data)
    }, 300)
  })
}

export const fetchMovie = (movieId: string): Promise<MovieData> => {
  const allMovie = movieData.data
  const movie = allMovie.find((movie) => movie.id === movieId)
  if (!movie) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject()
      }, 300)
    })
  } else {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(movie)
      }, 300)
    })
  }
}
