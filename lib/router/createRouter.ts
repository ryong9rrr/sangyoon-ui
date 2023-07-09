import Router from './lib/Router'

export default function createRouter(rootId: string) {
  return Router.getInstance(rootId)
}
