import { Component } from "../../ui"
import { Service, Type } from "../../interfaces"

import { ROUTE_EVENT_TYPE } from "./event-type"
import { RouteTable } from "./types"
import { isMatch } from "./helpers"
import { validateArgIsComponent } from "./validate"

export default class Router {
  private static instance: Router
  static getInstance(rootId: string, _webApiService: Service.WebApiService) {
    if (Router.instance) {
      return this.instance
    }
    this.instance = new Router(rootId, _webApiService)
    return this.instance
  }

  private currentView: Component | null = null
  private rootId: string
  private webApiService: Service.WebApiService
  private routeTable: RouteTable = []
  private notFoundViewClass: Type.ClassType<Component> | null = null

  private constructor(rootId: string, _webApiInterface: Service.WebApiService) {
    this.webApiService = _webApiInterface

    this.rootId = rootId

    this.webApiService.addEventListener("popstate", this.route.bind(this))
    this.webApiService.addEventListener(ROUTE_EVENT_TYPE, (e) => {
      const prevPath = this.webApiService.location.pathname
      const { path } = (e as CustomEvent<{ path: string }>).detail
      if (prevPath !== path) {
        this.webApiService.history.pushState(null, "", path)
        this.route()
      }
    })
  }

  addRoute(path: string, viewClass: Type.ClassType<Component>) {
    validateArgIsComponent(viewClass)
    this.routeTable.push({ path, viewClass })
  }

  setNotFoundView(viewClass: Type.ClassType<Component>) {
    validateArgIsComponent(viewClass)
    this.notFoundViewClass = viewClass
  }

  route() {
    for (const { path: configPath, viewClass } of this.routeTable) {
      if (isMatch(configPath, this.getRealPathname())) {
        this.setCurrentView(new viewClass(this.rootId))
        return
      }
    }

    if (this.notFoundViewClass) {
      this.setCurrentView(new this.notFoundViewClass(this.rootId))
      return
    }

    this.setCurrentView(null)
    this.webApiService.document.querySelector(this.rootId)!.innerHTML = ``
  }

  private getRealPathname() {
    return this.webApiService.location.pathname
  }

  private setCurrentView = (view: Component | null) => {
    if (this.currentView) {
      this.currentView._removeProvider()
    }
    this.currentView = view
  }
}
