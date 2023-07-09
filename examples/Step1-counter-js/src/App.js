import { Ui } from "sangyoon-ui"

export default class App extends Ui.Component {
  initState() {
    return {
      count: 0,
    }
  }

  template() {
    return `
      <div id="counter-component">
        <h1>${this.state.count}</h1>
        <div class="buttons">
          <button class="decrease">-</button>
          <button class="reset">reset</button>
          <button class="increase">+</button>
        </div>
      </div>
    `
  }

  setEvent() {
    this.addEvent("click", ".decrease", () => {
      this.setState({
        count: this.state.count - 1,
      })
    })

    this.addEvent("click", ".increase", () => {
      this.setState({
        count: this.state.count + 1,
      })
    })

    this.addEvent("click", ".reset", () => {
      this.setState({
        count: 0,
      })
    })
  }
}
