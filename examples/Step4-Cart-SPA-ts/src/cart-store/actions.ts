import { flux } from "sangyoon-ui"

import * as ActionTypes from "./action-types"
import Item from "../models/Item"

export const toggleLikeItem = flux.actionCreator<
  typeof ActionTypes.TOGGLE_LIKE_ITEM,
  Item
>(ActionTypes.TOGGLE_LIKE_ITEM)

export type Action = ReturnType<typeof toggleLikeItem>
