import { ui, router as Router } from "sangyoon-ui"

import Movie from "../models/Movie"
import { fetchMovies } from "../mock/handlers"

interface MainPageState {
  loading: boolean
  movies: Movie[]
}

export default class MainPage extends ui.Component<{}, MainPageState> {
  initState() {
    return {
      loading: true,
      movies: [],
    }
  }

  template() {
    if (this.state.loading) {
      return `<h1>loading...</h1>`
    }

    return `
      <main>
        <h1>MainPage</h1>
        <ul>
          ${this.state.movies
            .map(
              (movie) => `
              <li class="movie-card" id="${movie.id}">${movie.title}</li>
            `,
            )
            .join("")}
        </ul>
      </main>
    `
  }

  async componentDidMount() {
    try {
      const fetchedMovies = await fetchMovies()
      const movies = fetchedMovies.map((movie) => new Movie({ ...movie }))
      this.setState({ movies, loading: false })
    } catch (e) {
      // if occur error, you can handle error.
      console.warn("api fetch error")
    }
  }

  setEvent() {
    this.addEvent("click", ".movie-card", (e) => {
      if (!e.target) {
        return
      }
      const movieId = (e.target as HTMLLIElement).id
      Router.navigate(`/movie/${movieId}`)
    })
  }
}
