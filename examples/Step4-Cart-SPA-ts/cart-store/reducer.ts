import { CartState, initialState } from "./state"
import { Action } from "./actions"
import * as ActionTypes from "./action-types"

export default function reducer(
  state: CartState = initialState,
  action?: Action,
) {
  if (!action) {
    return { ...state }
  }

  switch (action.type) {
    case ActionTypes.ADD_ITEM: {
      return { ...state, items: [...state.items, action.payload] }
    }
    case ActionTypes.REMOVE_ITEM: {
      const nextItems = state.items.filter(
        (movie) => movie.id !== action.payload,
      )
      return { ...state, items: nextItems }
    }
    default: {
      return { ...state }
    }
  }
}
