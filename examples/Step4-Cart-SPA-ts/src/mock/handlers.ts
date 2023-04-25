import { ItemData } from "../models/Item"
import itemData from "./items.json"

// It is fake api...
export const fetchItems = (): Promise<ItemData[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(itemData.data)
    }, 300)
  })
}

export const fetchItem = (itemId: string): Promise<ItemData> => {
  const allItem = itemData.data
  const item = allItem.find((item) => item.id === itemId)
  if (!item) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject()
      }, 300)
    })
  } else {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(item)
      }, 300)
    })
  }
}
