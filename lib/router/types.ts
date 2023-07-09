import { ClassType } from "../common-interfaces"
import { Component } from "../ui/Component"

export type RouteTable = {
  path: string
  viewClass: ClassType<Component>
}[]

export interface MyCustomEvent<T> extends CustomEvent {
  detail: T
}
