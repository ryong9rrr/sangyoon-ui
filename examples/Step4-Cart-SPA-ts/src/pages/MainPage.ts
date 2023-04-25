import { ui, router as Router } from "sangyoon-ui"
import Item from "../models/Item"
import { fetchItems } from "../mock/handlers"
import { cartStore } from "../cart-store"
import * as Actions from "../cart-store/actions"

interface MainPageState {
  loading: boolean
  items: Item[]
}

export default class MainPage extends ui.Component<{}, MainPageState> {
  initState() {
    return {
      loading: true,
      items: [],
    }
  }

  template() {
    if (this.state.loading) {
      return `loading...`
    }

    const { likeItems } = cartStore.getState()

    return `
      <ul>
        ${this.state.items
          .map(
            (item) => `
          <li id="${item.id}">
            <img class="item-image" src="${item.image}" />
            ${item.name}
            <button class="like-button">${
              likeItems.find((likeItem) => likeItem.id === item.id)
                ? "unlike"
                : "like"
            }</button>
          </li>
        `,
          )
          .join("")}
      </ul>
    `
  }

  componentWillMount() {
    this.setProvider(cartStore)
  }

  async componentDidMount() {
    try {
      const fetchedItems = await fetchItems()
      const items = fetchedItems.map((item) => new Item(item))
      this.setState({ items, loading: false })
    } catch (e) {
      console.warn("api fetch error...")
    }
  }

  setEvent() {
    this.addEvent("click", ".like-button", (e) => {
      if (!e.target) {
        return
      }
      const $li = (e.target as HTMLButtonElement).closest("li") as HTMLLIElement
      const itemId = $li.id
      const targetItem = this.state.items.find((item) => item.id === itemId)
      if (targetItem) {
        cartStore.dispatch(Actions.toggleLikeItem(targetItem))
      }
    })

    this.addEvent("click", ".item-image", (e) => {
      if (!e.target) {
        return
      }
      const $li = (e.target as HTMLButtonElement).closest("li") as HTMLLIElement
      const itemId = $li.id
      Router.navigate(`/item/${itemId}`)
    })
  }
}
