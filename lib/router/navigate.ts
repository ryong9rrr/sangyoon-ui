import { ROUTE_EVENT_TYPE } from './lib/event-type'

export default function navigate(path: string) {
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
