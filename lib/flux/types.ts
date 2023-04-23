export type Reducer<T> = (state?: T, action?: any) => T

export type HandlerFn = () => void

export type Action = {
  type: string
  payload?: any
}
