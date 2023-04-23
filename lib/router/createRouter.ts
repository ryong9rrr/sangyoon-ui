import { Service } from "../interfaces"
import Router from "./lib/Router"

export default function createRouter(
  rootId: string,
  _webApiService: Service.WebApiService = window,
) {
  return Router.getInstance(rootId, _webApiService)
}
