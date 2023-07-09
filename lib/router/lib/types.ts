import { Component } from '../../ui'
import { Type } from '../../interfaces'

export type RouteTable = {
  path: string
  viewClass: Type.ClassType<Component>
}[]

export interface MyCustomEvent<T> extends CustomEvent {
  detail: T
}
