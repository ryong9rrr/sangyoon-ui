import { ROUTE_EVENT_TYPE } from "./lib/event-type"
import { RouterStaticMethodOptions } from "./lib/types"

export default function navigate(
  path: string,
  options: RouterStaticMethodOptions = {
    _webApiService: window,
  },
) {
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
