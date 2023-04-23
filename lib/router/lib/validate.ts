import { Component } from "../../ui"
import * as Errors from "../../interfaces/errors"

const isComponentClass = (arg: any) => {
  return Object.getPrototypeOf(arg) === Component
}

export const validateArgIsComponent = (arg: any) => {
  if (!isComponentClass(arg)) {
    throw new Errors.PrototypeError(
      "두 번째 매개변수는 반드시 Component 클래스여야 합니다.",
    )
  }
}
