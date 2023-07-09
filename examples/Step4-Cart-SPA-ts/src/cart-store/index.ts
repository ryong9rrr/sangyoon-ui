import { Flux } from "sangyoon-ui"
import reducer from "./reducer"

export const cartStore = Flux.createStore(reducer)
