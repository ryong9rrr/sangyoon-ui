type Reducer<T> = (state?: T, action?: any) => T

type HandlerFn = () => void

type Action = {
  type: string
  payload?: any
}

function createStore<T>(reducer: Reducer<T>) {
  let state = reducer()
  let handlers: Set<HandlerFn> = new Set()

  const dispatch = (action: Action) => {
    // isDiff는 일단 제외
    state = reducer(state, action)
    handlers.forEach((handler) => handler())
  }

  const getState = () => {
    return Object.freeze(state)
  }

  const subscribe = (handler: HandlerFn) => {
    handlers.add(handler)
  }

  const unsubscribe = (handler: HandlerFn) => {
    handlers.delete(handler)
  }

  const store = {
    getState,
    subscribe,
    unsubscribe,
    dispatch,
  }

  return store
}

// 제네릭에 typeof 문자열을 넣지않고도 자동추론될 수 있게하면(실제 리덕스처럼) 더 좋았겠지만 타입설계에 어려움을 겪어서 어쩔 수 없이 이렇게...
function actionCreator<T extends string, Payload = void>(type: T) {
  return (payload: Payload) =>
    ({
      type,
      payload,
    } as const)
}

export const Flux = {
  createStore,
  actionCreator,
}
