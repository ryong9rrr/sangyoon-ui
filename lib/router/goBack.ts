import { RouterStaticMethodOptions } from "./lib/types"

export default function goBack(
  options: RouterStaticMethodOptions = {
    _webApiService: window,
  },
) {
  options._webApiService.history.back()
}
