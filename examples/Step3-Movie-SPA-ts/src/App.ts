import { Router } from "sangyoon-ui"

import MainPage from "./pages/MainPage"
import MoviePage from "./pages/MoviePage"
import NotFoundPage from "./pages/NotFoundPage"

export default function App() {
  const router = Router.createRouter("#root")
  router.addRoute("/", MainPage)
  router.addRoute("/movie/:movieId", MoviePage)
  router.setNotFoundView(NotFoundPage)

  router.route()
}
