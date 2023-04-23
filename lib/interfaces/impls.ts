export interface ProviderImpl {
  subscribe: (fn: () => void) => void
  unsubscribe: (fn: () => void) => void
}
