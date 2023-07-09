import { Ui, Router } from "sangyoon-ui"
import Modal from "./Modal"
import { cartStore } from "../cart-store"

interface HeaderState {
  modalVisible: boolean
}

export default class Header extends Ui.Component<{}, HeaderState> {
  initState() {
    return {
      modalVisible: false,
    }
  }

  template() {
    const likeCount = cartStore.getState().likeItems.length

    return `
      <header>
        <div id="ModalComponent"></div>
        <h1>Cart SPA</h1>
        <button>Like : ${likeCount}</button>
      </header>
    `
  }

  componentWillMount() {
    this.setProvider(cartStore)
  }

  setChildren() {
    this.addComponent(Modal, "#ModalComponent", {
      modalVisible: this.state.modalVisible,
      closeModal: this.closeModal.bind(this),
    })
  }

  setEvent() {
    this.addEvent("click", "button", (e) => {
      this.openModal()
    })

    this.addEvent("click", "header", (e) => {
      if ((e.target as HTMLElement).tagName === "H1") {
        Router.navigate("/")
      }
    })
  }

  openModal() {
    this.setState({ ...this.state, modalVisible: true })
  }

  closeModal() {
    this.setState({ ...this.state, modalVisible: false })
  }
}
