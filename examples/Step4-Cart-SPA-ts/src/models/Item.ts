export type ItemData = {
  id: string
  name: string
  price: number
  image: string
  description: string
}

export default class Item {
  id: string
  name: string
  price: number
  image: string
  description: string

  constructor(item: ItemData) {
    this.id = item.id
    this.name = item.name
    this.price = item.price
    this.image = item.image
    this.description = item.description
  }
}
