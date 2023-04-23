import jsdom from "jsdom"
import Component from "../Component"

const { JSDOM } = jsdom
const dom = new JSDOM()

describe("Core 라이프사이클 테스트", () => {
  beforeEach(() => {
    dom.window.document.body.innerHTML = `<!DOCTYPE html><div id="root"></div>`
  })

  test("componentDidMount() : 하위 컴포넌트에서 상위 컴포넌트 순서로 실행된다.", () => {
    const result: any = []
    class SubSubComponent extends Component {
      template() {
        return `<h3>this is SubSubComponent</h3>`
      }

      componentDidMount() {
        result.push("SubSub")
      }
    }

    class SubComponent extends Component {
      template() {
        return `
          <h2>this is SubComponent</h2>
          <div id="SubSubComponent"></div>
        `
      }

      componentDidMount() {
        result.push("Sub")
      }

      setChildren() {
        this.addComponent(SubSubComponent, "#SubSubComponent", {}, dom.window)
      }
    }

    class RootComponent extends Component {
      template() {
        return `
          <h1>this is RootComponent</h1>
          <div id="SubComponent"></div>
        `
      }

      componentDidMount() {
        result.push("Root")
      }

      setChildren() {
        this.addComponent(SubComponent, "#SubComponent", {}, dom.window)
      }
    }

    new RootComponent("#root", {}, dom.window)

    expect(result[0]).toBe("SubSub")
    expect(result[1]).toBe("Sub")
    expect(result[2]).toBe("Root")
  })

  test("componentDidUpdate() : 나의 상태가 변경되면 호출되고, 가장 아래쪽 자식 노드부터 실행된다.", () => {
    const result: any = []
    const expected = [
      "Header",
      "NumberCounter",
      "Numbers",
      "Main",
      "Footer",
      "Root",
    ]

    class FooterComponent extends Component {
      template() {
        return ``
      }

      componentDidUpdate() {
        result.push("Footer")
      }
    }

    class NumberCounterComponent extends Component {
      template() {
        return ``
      }
      componentDidUpdate() {
        result.push("NumberCounter")
      }
    }

    class Numbers extends Component {
      template() {
        return ``
      }

      componentDidUpdate() {
        result.push("Numbers")
      }
    }

    class MainComponent extends Component<{ numbers: number[] }> {
      template() {
        return `
          <div id="NumberCounterComponent"></div>
          <div id="NumbersComponent"></div>
        `
      }

      componentDidUpdate() {
        result.push("Main")
      }

      setChildren() {
        this.addComponent(
          NumberCounterComponent,
          "#NumberCounterComponent",
          {
            numbers: this.props.numbers,
          },
          dom.window,
        )

        this.addComponent(
          Numbers,
          "#NumbersComponent",
          {
            numbers: this.props.numbers,
          },
          dom.window,
        )
      }
    }

    class HeaderComponent extends Component {
      template() {
        return ``
      }

      componentDidUpdate() {
        result.push("Header")
      }
    }

    const rootComponentState = {
      header: "header",
      numbers: [1, 2, 3, 4, 5],
      footer: "footer",
    }

    class RootComponent extends Component<{}, typeof rootComponentState> {
      initState() {
        return rootComponentState
      }

      template() {
        return `
          <div id="HeaderComponent"></div>
          <div id="MainComponent"></div>
          <div id="FooterComponent"></div>
        `
      }

      componentDidUpdate() {
        result.push("Root")
      }

      setChildren() {
        this.addComponent(
          HeaderComponent,
          "#HeaderComponent",
          {
            header: this.state.header,
          },
          dom.window,
        )

        this.addComponent(
          MainComponent,
          "#MainComponent",
          {
            numbers: this.state.numbers,
          },
          dom.window,
        )

        this.addComponent(
          FooterComponent,
          "#FooterComponent",
          {
            footer: this.state.footer,
          },
          dom.window,
        )
      }

      updateState() {
        this.setState({
          header: "updatedHeader",
          numbers: [11, 12, 13, 14, 15],
          footer: "updatedFooter",
        })
      }
    }

    const rootComponent = new RootComponent("#root", {}, dom.window)
    rootComponent.updateState()
    expect(result).toEqual(expected)
  })

  test("componentDidUpdate() : 업데이트 전과 후의 state, props를 알 수 있다.", () => {
    const makePrev = (component: Component) => ({
      state: component.prevState,
      props: component.prevProps,
    })

    const makeCurrent = (component: Component) => ({
      state: component.state,
      props: component.props,
    })

    class FooterComponent extends Component {
      template() {
        return ``
      }

      componentDidUpdate() {
        expect(makePrev(this)).toEqual({
          state: {},
          props: {
            footer: "footer",
          },
        })

        expect(makeCurrent(this)).toEqual({
          state: {},
          props: {
            footer: "updatedFooter",
          },
        })
      }
    }

    class NumberCounterComponent extends Component {
      template() {
        return ``
      }
      componentDidUpdate() {
        expect(makePrev(this)).toEqual({
          state: {},
          props: {
            numbers: [1, 2, 3, 4, 5],
          },
        })

        expect(makeCurrent(this)).toEqual({
          state: {},
          props: {
            numbers: [11, 12, 13, 14, 15],
          },
        })
      }
    }

    class Numbers extends Component {
      template() {
        return ``
      }

      componentDidUpdate() {
        expect(makePrev(this)).toEqual({
          state: {},
          props: {
            numbers: [1, 2, 3, 4, 5],
          },
        })

        expect(makeCurrent(this)).toEqual({
          state: {},
          props: {
            numbers: [11, 12, 13, 14, 15],
          },
        })
      }
    }

    class MainComponent extends Component<{ numbers: number[] }> {
      template() {
        return `
          <div id="NumberCounterComponent"></div>
          <div id="NumbersComponent"></div>
        `
      }

      componentDidUpdate() {
        expect(makePrev(this)).toEqual({
          state: {},
          props: {
            numbers: [1, 2, 3, 4, 5],
          },
        })

        expect(makeCurrent(this)).toEqual({
          state: {},
          props: {
            numbers: [11, 12, 13, 14, 15],
          },
        })
      }

      setChildren() {
        this.addComponent(
          NumberCounterComponent,
          "#NumberCounterComponent",
          {
            numbers: this.props.numbers,
          },
          dom.window,
        )

        this.addComponent(
          Numbers,
          "#NumbersComponent",
          {
            numbers: this.props.numbers,
          },
          dom.window,
        )
      }
    }

    class HeaderComponent extends Component {
      template() {
        return ``
      }

      componentDidUpdate() {
        expect(makePrev(this)).toEqual({
          state: {},
          props: {
            header: "header",
          },
        })

        expect(makeCurrent(this)).toEqual({
          state: {},
          props: {
            header: "updatedHeader",
          },
        })
      }
    }

    const rootComponentState = {
      header: "header",
      numbers: [1, 2, 3, 4, 5],
      footer: "footer",
    }

    class RootComponent extends Component<{}, typeof rootComponentState> {
      initState() {
        return rootComponentState
      }

      template() {
        return `
          <div id="HeaderComponent"></div>
          <div id="MainComponent"></div>
          <div id="FooterComponent"></div>
        `
      }

      componentDidUpdate() {
        expect(makePrev(this)).toEqual({
          state: {
            header: "header",
            numbers: [1, 2, 3, 4, 5],
            footer: "footer",
          },
          props: {},
        })

        expect(makeCurrent(this)).toEqual({
          state: {
            header: "updatedHeader",
            numbers: [11, 12, 13, 14, 15],
            footer: "updatedFooter",
          },
          props: {},
        })
      }

      setChildren() {
        this.addComponent(
          HeaderComponent,
          "#HeaderComponent",
          {
            header: this.state.header,
          },
          dom.window,
        )

        this.addComponent(
          MainComponent,
          "#MainComponent",
          {
            numbers: this.state.numbers,
          },
          dom.window,
        )

        this.addComponent(
          FooterComponent,
          "#FooterComponent",
          {
            footer: this.state.footer,
          },
          dom.window,
        )
      }

      updateState() {
        this.setState({
          header: "updatedHeader",
          numbers: [11, 12, 13, 14, 15],
          footer: "updatedFooter",
        })
      }
    }

    const rootComponent = new RootComponent("#root", {}, dom.window)
    rootComponent.updateState()
  })
})
