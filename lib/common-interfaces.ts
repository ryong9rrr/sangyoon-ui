export class SetterError extends Error {}
export class DOMReferenceError extends ReferenceError {}
export class PrototypeError extends TypeError {}

export interface ProviderImpl {
  subscribe: (fn: () => void) => void
  unsubscribe: (fn: () => void) => void
}

export type ClassType<T, A extends any[] = any[]> = Function & {
  new (...args: A): T
}
