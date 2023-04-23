export type ClassType<T, A extends any[] = any[]> = Function & {
  new (...args: A): T
}
