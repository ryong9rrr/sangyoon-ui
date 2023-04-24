import Movie from "../models/Movie"

export type CartState = {
  items: Movie[]
}

export const initialState: CartState = {
  items: [],
}
