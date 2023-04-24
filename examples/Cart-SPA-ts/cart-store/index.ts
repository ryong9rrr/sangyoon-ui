import { flux } from "sangyoon-ui"
import reducer from "./reducer"

export const cartStore = flux.createStore(reducer)
