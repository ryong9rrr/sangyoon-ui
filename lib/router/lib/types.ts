import { Component } from "../../ui"
import { Service, Type } from "../../interfaces"

export type RouterStaticMethodOptions = {
  _webApiService: Service.WebApiService
}

export type RouteTable = {
  path: string
  viewClass: Type.ClassType<Component>
}[]

export interface MyCustomEvent<T> extends CustomEvent {
  detail: T
}
