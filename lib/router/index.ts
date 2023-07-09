import { Router as RouterCore } from "./Router"
import { ROUTE_EVENT_TYPE } from "./constants"

function createRouter(rootId: string) {
  return RouterCore.getInstance(rootId)
}

function goBack() {
  window.history.back()
}

function navigate(path: string) {
  if (window.location.pathname !== path) {
    window.dispatchEvent(
      new CustomEvent(ROUTE_EVENT_TYPE, {
        detail: {
          path,
        },
      }),
    )
  }
}

export const Router = {
  createRouter,
  goBack,
  navigate,
}
