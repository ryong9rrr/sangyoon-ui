import Item from "../models/Item"

export type CartState = {
  likeItems: Item[]
}

export const initialState: CartState = {
  likeItems: [],
}
