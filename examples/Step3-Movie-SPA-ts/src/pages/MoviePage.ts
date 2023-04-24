import { ui } from "sangyoon-ui"
import Movie from "../models/Movie"
import { fetchMovie } from "../mock/handlers"

interface MoviePageState {
  loading: boolean
  error: boolean
  movie: Movie | null
}

export default class MoviePage extends ui.Component<{}, MoviePageState> {
  initState() {
    return {
      loading: true,
      error: false,
      movie: null,
    }
  }

  template() {
    if (this.state.loading) {
      return `<h1>loading...</h1>`
    }

    if (this.state.error || !this.state.movie) {
      return `<h1>There is no corresponding movie.</h1>`
    }

    return `<h1>This is 🎥${this.state.movie.title}🎥 Page.</h1>`
  }

  async componentDidMount() {
    const movieId = window.location.pathname.replace("/movie/", "")
    try {
      const movie = await fetchMovie(movieId)
      this.setState({ ...this.state, movie, loading: false })
    } catch (error) {
      this.setState({ ...this.state, error: true, loading: false })
    }
  }
}
