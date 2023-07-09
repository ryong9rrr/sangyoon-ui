import { Ui } from "sangyoon-ui"
import Item from "../models/Item"
import { fetchItem } from "../mock/handlers"
import { cartStore } from "../cart-store"
import * as Actions from "../cart-store/actions"

interface ItemPageState {
  loading: boolean
  error: boolean
  item: Item | null
}

export default class ItemPage extends Ui.Component<{}, ItemPageState> {
  initState() {
    return {
      loading: true,
      error: false,
      item: null,
    }
  }

  template() {
    if (this.state.loading) {
      return `<h1>loading...</h1>`
    }

    if (this.state.error || !this.state.item) {
      return `<h1>There is no corresponding movie.</h1>`
    }

    const { likeItems } = cartStore.getState()

    return `
      <div>
        <img src="${this.state.item.image}" />
            ${this.state.item.name}
            <button class="like-button">${
              likeItems.find((likeItem) => likeItem.id === this.state.item?.id) ? "unlike" : "like"
            }</button>
      </div>
    `
  }

  componentWillMount() {
    this.setProvider(cartStore)
  }

  async componentDidMount() {
    const itemId = window.location.pathname.replace("/item/", "")
    try {
      const item = await fetchItem(itemId)
      this.setState({ ...this.state, item, loading: false })
    } catch (e) {
      this.setState({ ...this.state, loading: false, error: true })
    }
  }

  setEvent() {
    this.addEvent("click", ".like-button", (e) => {
      if (!e.target || !this.state.item) {
        return
      }
      cartStore.dispatch(Actions.toggleLikeItem(this.state.item))
    })
  }
}
