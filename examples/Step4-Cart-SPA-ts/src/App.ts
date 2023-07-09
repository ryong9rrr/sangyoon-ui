import { Ui } from "sangyoon-ui"
import Header from "./components/Header"

export default class App extends Ui.Component {
  template() {
    return `
      <div id="HeaderComponent"></div>
      <main></main>
    `
  }

  setChildren() {
    this.addComponent(Header, "#HeaderComponent")
  }
}
