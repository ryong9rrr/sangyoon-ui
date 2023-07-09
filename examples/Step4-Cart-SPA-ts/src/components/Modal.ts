import { Ui } from "sangyoon-ui"
import { cartStore } from "../cart-store"
import * as Actions from "../cart-store/actions"

interface ModalProps {
  modalVisible: boolean
  closeModal: () => void
}

export default class Modal extends Ui.Component<ModalProps> {
  template() {
    if (!this.props.modalVisible) {
      return ``
    }

    const { likeItems } = cartStore.getState()

    return `
      <div class="modal-overlay">
        <div class="modal-wrapper">
          <div class="modal-contents">
            <h1>Your Like</h1>
            <ul>${likeItems
              .map(
                (item) => `
      <li id="${item.id}">
            <img src="${item.image}" />
            ${item.name}
            <button class="unlike-button">unlike</button>
          </li>        
      `,
              )
              .join("")}</ul>
          </div>
        </div>
      </div>
    `
  }

  componentWillMount() {
    this.setProvider(cartStore)
  }

  setEvent(): void {
    this.addEvent("click", ".modal-wrapper", (e) => {
      const $target = e.target as HTMLElement
      if ($target && !$target.classList.contains("modal-wrapper")) {
        return
      }
      this.props.closeModal()
    })

    this.addEvent("click", ".unlike-button", (e) => {
      if (!e.target) {
        return
      }
      const $li = (e.target as HTMLButtonElement).closest("li") as HTMLLIElement
      const itemId = $li.id
      const targetItem = cartStore.getState().likeItems.find((item) => item.id === itemId)
      if (targetItem) {
        cartStore.dispatch(Actions.toggleLikeItem(targetItem))
      }
    })
  }
}
