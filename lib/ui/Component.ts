import { ClassType, DOMReferenceError, PrototypeError, ProviderImpl } from "../common-interfaces"
import { callComponentDidUpdateOfChildren, modifyPropsOfChildren, rerenderChildren } from "./notifies"
import { isDiff } from "./utils"

export abstract class Component<Props = {}, State = {}> {
  private provider: ProviderImpl | null = null
  private providerHandler: (() => void) | null = null

  private containerId: string

  _prevState: State
  _state: State

  _prevProps: Props
  _props: Props

  _children: Component<any, any>[] = []

  constructor(containerId: string, props: Props = {} as Props) {
    this.containerId = containerId
    this._prevState = this._state = this.initState()
    this._prevProps = this._props = props

    this.componentWillMount()
    this.mount()
    this.componentDidMount()
  }

  get prevState() {
    return { ...this._prevState }
  }

  get state() {
    return { ...this._state }
  }

  get prevProps() {
    return { ...this._prevProps }
  }

  get props() {
    return { ...this._props }
  }

  componentWillMount() {}

  componentDidMount() {}

  componentDidUpdate() {}

  setChildren() {}

  addComponent<T>(ComponentClass: ClassType<Component<T, any>>, containerId: string, props: T = {} as T) {
    if (Object.getPrototypeOf(ComponentClass) !== Component) {
      throw new PrototypeError(
        "첫 번째 매개변수는 반드시 Component 클래스의 프로토타입이어야 합니다. Component 클래스를 상속한 클래스를 첫 번째 매개변수로 사용하세요.",
      )
    }
    const componentInstance = new ComponentClass(containerId, props)
    this._children.push(componentInstance)
    return componentInstance
  }

  setEvent() {}

  addEvent<K extends keyof HTMLElementEventMap>(eventType: K, selector: string, listener: (e: Event) => void) {
    const children = Array.from(this.$container.querySelectorAll(selector)) as HTMLElement[]
    const isTarget = (target: HTMLElement) => children.includes(target) || target.closest(selector)
    this.$container.addEventListener(eventType, (e: Event) => {
      if (e.target && isTarget(e.target as HTMLElement)) {
        listener(e)
      }
    })
  }

  initState(): State {
    return {} as State
  }

  setState(nextState: State) {
    if (!isDiff(this._state, nextState)) {
      return
    }

    // 상태가 바뀌면...
    this._prevState = { ...this._state }
    this._state = nextState

    // 하위 컴포넌트에게 알린다.
    this.notify()
  }

  get $container() {
    const $el = window.document.querySelector(this.containerId)
    if (!$el) {
      throw new DOMReferenceError(`${this.containerId}에 해당하는 DOMElement를 찾지 못했어요.`)
    }
    return $el
  }

  private mount() {
    this._render()
    this.setChildren()
  }

  protected notify() {
    this._render()

    // 1. 바뀐 상태를 사용하고 있는 하위 컴포넌트들의 props를 업데이트한다.
    modifyPropsOfChildren(this._state, this)

    // 2. 하위 컴포넌트들도 렌더링한다.
    rerenderChildren(this)

    // 3. 하위 컴포넌트들의 componentDidUpdate()를 호출한다.
    callComponentDidUpdateOfChildren(this)

    this.componentDidUpdate()
  }

  _render() {
    this.$container.replaceWith(this.$container.cloneNode(true))
    this.$container.innerHTML = this.template()
    this.setEvent()
  }

  setProvider(provider: ProviderImpl) {
    this.provider = provider
    this.providerHandler = () => this.notify()
    this.provider.subscribe(this.providerHandler)
  }

  _removeProvider() {
    if (!this.provider || !this.providerHandler) {
      return
    }

    this.provider.unsubscribe(this.providerHandler)

    for (const subComponent of this._children) {
      subComponent._removeProvider()
    }

    this.provider = null
    this.providerHandler = null
  }

  abstract template(): string
}
