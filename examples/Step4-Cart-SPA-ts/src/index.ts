import { router as Router } from "sangyoon-ui"

import App from "./App"
import MainPage from "./pages/MainPage"
import ItemPage from "./pages/ItemPage"

const router = Router.createRouter("main")
router.addRoute("/", MainPage)
router.addRoute("/item/:itemId", ItemPage)

new App("#root")

router.route()
