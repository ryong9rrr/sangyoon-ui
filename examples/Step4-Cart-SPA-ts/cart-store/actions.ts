import { flux } from "sangyoon-ui"

import * as ActionTypes from "./action-types"
import Movie from "../models/Movie"

export const addItem = flux.actionCreator<typeof ActionTypes.ADD_ITEM, Movie>(
  ActionTypes.ADD_ITEM,
)

export const removeItem = flux.actionCreator<
  typeof ActionTypes.REMOVE_ITEM,
  string
>(ActionTypes.REMOVE_ITEM)

export type Action = ReturnType<typeof addItem> | ReturnType<typeof removeItem>
