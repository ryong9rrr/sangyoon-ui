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
    case ActionTypes.TOGGLE_LIKE_ITEM: {
      const targetItem = action.payload
      const existing = state.likeItems.find((item) => item.id === targetItem.id)
      if (existing) {
        return {
          ...state,
          likeItems: state.likeItems.filter(
            (item) => item.id !== targetItem.id,
          ),
        }
      }
      return { ...state, likeItems: [...state.likeItems, targetItem] }
    }
    default: {
      return { ...state }
    }
  }
}
