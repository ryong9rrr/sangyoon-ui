import { Service } from "../interfaces"
import Router from "./Router"
import { ROUTE_EVENT_TYPE } from "./event-type"
import { RouterStaticMethodOptions } from "./types"

export const createRouter = (
  rootId: string,
  _webApiService: Service.WebApiService = window,
) => {
  return Router.getInstance(rootId, _webApiService)
}

export const navigate: (
  path: string,
  options?: RouterStaticMethodOptions,
) => void = (
  path,
  options = {
    _webApiService: window,
  } as RouterStaticMethodOptions,
) => {
  if (options._webApiService.location.pathname !== path) {
    options._webApiService.dispatchEvent(
      new CustomEvent(ROUTE_EVENT_TYPE, {
        detail: {
          path,
        },
      }),
    )
  }
}

export const goBack: (options?: RouterStaticMethodOptions) => void = (
  options = {
    _webApiService: window,
  } as RouterStaticMethodOptions,
) => {
  options._webApiService.history.back()
}
