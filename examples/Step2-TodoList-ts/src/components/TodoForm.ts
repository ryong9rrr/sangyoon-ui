import { Ui } from "sangyoon-ui"

interface TodoFromProps {
  addTodo: (text: string) => void
}

export default class TodoForm extends Ui.Component<TodoFromProps> {
  template() {
    return `
      <form>
        <input placeholder="what todo?" />
        <button type="submit">enter</button>
      </form>
    `
  }

  setEvent() {
    this.addEvent("submit", "form", this.handleSubmit.bind(this))
  }

  get input() {
    return this.$container.querySelector("input") as HTMLInputElement
  }

  handleSubmit(e: Event) {
    e.preventDefault()
    const text = this.input.value
    if (!text || !this.props.addTodo) {
      return
    }
    this.props.addTodo(text)
    this.input.value = ""
    this.input.focus()
  }
}
