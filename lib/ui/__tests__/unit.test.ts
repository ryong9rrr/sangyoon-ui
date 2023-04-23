import jsdom from "jsdom"
import Component from "../Component"

const { JSDOM } = jsdom
const dom = new JSDOM()

describe("Core 단위 테스트", () => {
  beforeEach(() => {
    dom.window.document.body.innerHTML = `<!DOCTYPE html><div id="root"></div>`
  })

  // modifyPropsOfChildren() : 상위 컴포넌트의 상태가 바뀌면 그 컴포넌트를 구독하고 있는 모든 하위 컴포넌트의 props가 변경된다.
  test("modifyPropsOfChildren() - 테스트 케이스 1", () => {
    const rootComponentState = {
      user: {
        id: "1abcde",
        name: "yong",
        age: 30,
        todoCount: 2,
        todos: [
          {
            id: "1",
            text: "밥먹기",
            isCompleted: true,
          },
          {
            id: "2",
            text: "잠자기",
            isCompleted: false,
          },
        ],
      },
    }

    class SubSubComponent extends Component {
      template() {
        return ``
      }
    }

    class SubComponent extends Component<
      { user: { todos: { id: string; text: string; isCompleted: boolean }[] } },
      {}
    > {
      template() {
        return `
          <div id="SubSubComponent"></div>
        `
      }

      setChildren() {
        this.addComponent(
          SubSubComponent,
          "#SubSubComponent",
          {
            todos: this.props.user.todos,
          },
          dom.window,
        )
      }
    }

    class RootComponent extends Component<{}, typeof rootComponentState> {
      initState() {
        return rootComponentState
      }

      template() {
        return `
          <div id="SubComponent"></div>
        `
      }

      setChildren() {
        this.addComponent(
          SubComponent,
          "#SubComponent",
          {
            user: this.state.user,
          },
          dom.window,
        )
      }

      updateUserInfo() {
        this.setState({
          ...this.state,
          user: { ...this.state.user, name: "sangyoon" },
        })
      }

      popTodo() {
        this.setState({
          ...this.state,
          user: {
            ...this.state.user,
            todos: [
              {
                id: "1",
                text: "밥먹기",
                isCompleted: true,
              },
            ],
          },
        })
      }
    }

    //

    const rootComponent = new RootComponent("#root", {}, dom.window)
    const subComponent = rootComponent._children[0]
    const subsubComponent = subComponent._children[0]

    rootComponent.updateUserInfo()
    expect(subComponent.props).toEqual({
      user: {
        id: "1abcde",
        name: "sangyoon",
        age: 30,
        todoCount: 2,
        todos: [
          {
            id: "1",
            text: "밥먹기",
            isCompleted: true,
          },
          {
            id: "2",
            text: "잠자기",
            isCompleted: false,
          },
        ],
      },
    })

    rootComponent.popTodo()
    expect(subComponent.props).toEqual({
      user: {
        id: "1abcde",
        name: "sangyoon",
        age: 30,
        todoCount: 2,
        todos: [
          {
            id: "1",
            text: "밥먹기",
            isCompleted: true,
          },
        ],
      },
    })

    expect(subsubComponent.props).toEqual({
      todos: [
        {
          id: "1",
          text: "밥먹기",
          isCompleted: true,
        },
      ],
    })

    //
  })

  test("modifyPropsOfChildren() - 테스트 케이스 2", () => {
    const rootComponentState = {
      name: "yong",
      info: {
        age: 20,
        job: "software-engineer",
        family: {
          count: 5,
          location: "Go-Yang",
          numbers: [1, 2, 3, 4],
          sibling: {
            brothers: 1,
            sisters: 1,
          },
        },
      },
    }

    class SubSubComponent extends Component {
      template() {
        return ``
      }
    }

    class SubComponent extends Component<typeof rootComponentState, {}> {
      template() {
        return `
          <div id="SubSubComponent"></div>
        `
      }

      setChildren() {
        this.addComponent(
          SubSubComponent,
          "#SubSubComponent",
          {
            location: this.props.info.family.location,
            brothers: this.props.info.family.sibling.brothers,
            sisters: this.props.info.family.sibling.sisters,
          },
          dom.window,
        )
      }
    }

    class RootComponent extends Component<{}, typeof rootComponentState> {
      initState() {
        return rootComponentState
      }

      template() {
        return `
          <div id="SubComponent"></div>
        `
      }

      setChildren() {
        this.addComponent(
          SubComponent,
          "#SubComponent",
          {
            name: this.state.name,
            info: this.state.info,
          },
          dom.window,
        )
      }

      updateUserInfo() {
        this.setState({
          ...this.state,
          name: "sangyoon",
          info: {
            ...this.state.info,
            age: 50,
          },
        })
      }

      updateLocation() {
        this.setState({
          ...this.state,
          info: {
            ...this.state.info,
            family: {
              ...this.state.info.family,
              location: "hello",
            },
          },
        })
      }

      updateSibling() {
        this.setState({
          ...this.state,
          info: {
            ...this.state.info,
            family: {
              ...this.state.info.family,
              sibling: {
                brothers: 100,
                sisters: 101,
              },
            },
          },
        })
      }
    }

    const rootComponent = new RootComponent("#root", {}, dom.window)
    const subComponent = rootComponent._children[0]
    const subsubComponent = subComponent._children[0]

    rootComponent.updateUserInfo()
    expect(subComponent.props.name).toBe("sangyoon")
    expect(subComponent.props.info.age).toBe(50)

    rootComponent.updateLocation()
    expect(subComponent.props.name).toBe("sangyoon")
    expect(subComponent.props.info.age).toBe(50)
    expect(subComponent.props.info.family.location).toBe("hello")

    rootComponent.updateSibling()
    expect(subComponent.props.name).toBe("sangyoon")
    expect(subComponent.props.info.age).toBe(50)
    expect(subsubComponent.props.brothers).toBe(1) // 뎁스가 3뎁스라 바뀌지 않음
    expect(subsubComponent.props.sisters).toBe(1) // 뎁스가 3뎁스라 바뀌지 않음
  })

  // rerenderChildren() : 상위 컴포넌트의 상태가 바뀌면 그 컴포넌트를 구독하고 있는 모든 하위 컴포넌트는 리렌더링 된다.
  test("rerenderChildren() - 테스트 케이스 1", () => {
    const rootComponentState = {
      user: {
        id: "1abcde",
        name: "yong",
        age: 30,
        todos: [
          {
            id: "1",
            text: "밥먹기",
            completed: true,
          },
          {
            id: "2",
            text: "잠자기",
            completed: false,
          },
        ],
      },
    }

    class SubSubComponent extends Component<
      { todos: { id: string; text: string }[] },
      {}
    > {
      template() {
        return `
          ${this.props.todos.map(
            (todo) => `<li data-id="${todo.id}">${todo.text}</li>`,
          )}
        `
      }
    }

    class SubComponent extends Component<typeof rootComponentState, {}> {
      template() {
        return `
          <h2>${this.props.user.name}</h2>
          <h3>할 일 : ${this.props.user.todos.length}</h3>
          <div id="SubSubComponent"></div>
        `
      }

      setChildren() {
        this.addComponent(
          SubSubComponent,
          "#SubSubComponent",
          {
            todos: this.props.user.todos,
          },
          dom.window,
        )
      }
    }

    class RootComponent extends Component<{}, typeof rootComponentState> {
      initState() {
        return rootComponentState
      }

      template() {
        return `
          <h1>this is RootComponent</h1>
          <div id="SubComponent"></div>
        `
      }

      setChildren() {
        this.addComponent(
          SubComponent,
          "#SubComponent",
          {
            user: this.state.user,
          },
          dom.window,
        )
      }

      updateUserInfo() {
        this.setState({
          ...this.state,
          user: { ...this.state.user, name: "sangyoon" },
        })
      }

      popTodo() {
        this.setState({
          ...this.state,
          user: {
            ...this.state.user,
            todos: [
              {
                id: "1",
                text: "밥먹기",
                completed: true,
              },
            ],
          },
        })
      }
    }

    const rootComponent = new RootComponent("#root", {}, dom.window)

    // 상태 업데이트 전
    expect(dom.window.document.querySelector("h2")!.textContent).toBe("yong")
    expect(dom.window.document.querySelector("h3")!.textContent).toBe(
      "할 일 : 2",
    )
    expect(dom.window.document.querySelectorAll("li").length).toBe(2)

    // 상태 업데이트 후
    rootComponent.updateUserInfo()
    expect(dom.window.document.querySelector("h2")!.textContent).toBe(
      "sangyoon",
    )

    rootComponent.popTodo()
    expect(dom.window.document.querySelector("h3")!.textContent).toBe(
      "할 일 : 1",
    )
    expect(dom.window.document.querySelectorAll("li").length).toBe(1)
  })

  test("rerenderChildren() - 테스트 케이스 2", () => {
    const rootComponentState = {
      name: "yong",
      info: {
        age: 20,
        job: "software-engineer",
        family: {
          count: 5,
          location: "Go-Yang",
          numbers: [1, 2, 3, 4],
          sibling: {
            brothers: 1,
            sisters: 1,
          },
        },
      },
    }

    class SubSubComponent extends Component<{
      location: string
      brothers: number
      sisters: number
    }> {
      template() {
        return `
          <h4>${this.props.location}</h4>
          <h5>형제 : ${this.props.brothers}명</h5>
          <h6>자매 : ${this.props.sisters}명</h6>
        `
      }
    }

    class SubComponent extends Component<typeof rootComponentState> {
      template() {
        return `
          <h2>${this.props.name}</h2>
          <h3>나이 : ${this.props.info.age}</h3>
          <div id="SubSubComponent"></div>
        `
      }

      setChildren() {
        this.addComponent(
          SubSubComponent,
          "#SubSubComponent",
          {
            location: this.props.info.family.location,
            brothers: this.props.info.family.sibling.brothers,
            sisters: this.props.info.family.sibling.sisters,
          },
          dom.window,
        )
      }
    }

    class RootComponent extends Component<{}, typeof rootComponentState> {
      initState() {
        return rootComponentState
      }

      template() {
        return `
          <h1>this is RootComponent</h1>
          <div id="SubComponent"></div>
        `
      }

      setChildren() {
        this.addComponent(
          SubComponent,
          "#SubComponent",
          {
            name: this.state.name,
            info: this.state.info,
          },
          dom.window,
        )
      }

      updateUserInfo() {
        this.setState({
          ...this.state,
          name: "sangyoon",
          info: {
            ...this.state.info,
            age: 50,
          },
        })
      }

      updateLocation() {
        this.setState({
          ...this.state,
          info: {
            ...this.state.info,
            family: {
              ...this.state.info.family,
              location: "hello",
            },
          },
        })
      }

      updateSiblingAndLocation() {
        this.setState({
          ...this.state,
          info: {
            ...this.state.info,
            family: {
              ...this.state.info.family,
              location: "일산",
              sibling: {
                brothers: 100,
                sisters: 101,
              },
            },
          },
        })
      }
    }

    const rootComponent = new RootComponent("#root", {}, dom.window)

    // 상태 업데이트 전
    expect(dom.window.document.querySelector("h2")!.textContent).toBe("yong")
    expect(dom.window.document.querySelector("h4")!.textContent).toBe("Go-Yang")
    expect(dom.window.document.querySelector("h3")!.textContent).toBe(
      "나이 : 20",
    )
    expect(dom.window.document.querySelector("h5")!.textContent).toBe(
      "형제 : 1명",
    )
    expect(dom.window.document.querySelector("h6")!.textContent).toBe(
      "자매 : 1명",
    )

    // 상태 업데이트 후
    rootComponent.updateUserInfo()
    expect(dom.window.document.querySelector("h2")!.textContent).toBe(
      "sangyoon",
    )
    expect(dom.window.document.querySelector("h3")!.textContent).toBe(
      "나이 : 50",
    )
    expect(dom.window.document.querySelector("h5")!.textContent).toBe(
      "형제 : 1명",
    )
    expect(dom.window.document.querySelector("h6")!.textContent).toBe(
      "자매 : 1명",
    )

    rootComponent.updateLocation()
    expect(dom.window.document.querySelector("h2")!.textContent).toBe(
      "sangyoon",
    )
    expect(dom.window.document.querySelector("h3")!.textContent).toBe(
      "나이 : 50",
    )
    expect(dom.window.document.querySelector("h4")!.textContent).toBe("hello")
    expect(dom.window.document.querySelector("h5")!.textContent).toBe(
      "형제 : 1명",
    )
    expect(dom.window.document.querySelector("h6")!.textContent).toBe(
      "자매 : 1명",
    )

    rootComponent.updateSiblingAndLocation()
    expect(dom.window.document.querySelector("h2")!.textContent).toBe(
      "sangyoon",
    )
    expect(dom.window.document.querySelector("h3")!.textContent).toBe(
      "나이 : 50",
    )
    expect(dom.window.document.querySelector("h4")!.textContent).toBe("일산")
    expect(dom.window.document.querySelector("h5")!.textContent).toBe(
      "형제 : 1명",
    ) // 뎁스가 3뎁스라 바뀌지 않음
    expect(dom.window.document.querySelector("h6")!.textContent).toBe(
      "자매 : 1명",
    ) // 뎁스가 3뎁스라 바뀌지 않음
  })

  test("rerenderChildren() - 렌더링과 리렌더링은 레벨순회로 수행된다.", () => {
    const rootComponentState = {
      header: "header",
      numbers: [1, 2, 3, 4, 5],
      footer: "footer",
    }

    let result: any = []
    const expected = [
      "Root",
      "Header",
      "Main",
      "NumberCounter",
      "Numbers",
      "Footer",
    ]

    class FooterComponent extends Component {
      template() {
        result.push("Footer")
        return ``
      }
    }

    class NumberCounterComponent extends Component {
      template() {
        result.push("NumberCounter")
        return ``
      }
    }

    class Numbers extends Component {
      template() {
        result.push("Numbers")
        return ``
      }
    }

    class MainComponent extends Component<{ numbers: number[] }> {
      template() {
        result.push("Main")
        return `
          <div id="NumberCounterComponent"></div>
          <div id="NumbersComponent"></div>
        `
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
        result.push("Header")
        return ``
      }
    }

    class RootComponent extends Component<{}, typeof rootComponentState> {
      initState() {
        return rootComponentState
      }

      template() {
        result.push("Root")
        return `
          <div id="HeaderComponent"></div>
          <div id="MainComponent"></div>
          <div id="FooterComponent"></div>
        `
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

    // 초기 렌더링 결과 확인
    expect(result).toEqual(expected)

    // 모든 상태가 업데이트된 후
    result = []
    rootComponent.updateState()
    expect(result).toEqual(expected)
  })
})
