import { PrototypeError } from "../common-interfaces"
import { Component } from "../ui/Component"

const parseUrlPath = (configPath: string) => {
  return new RegExp("^" + configPath.replace(/\//g, "\\/").replace(/:\w+/g, "[\\w]+") + "\\/?$")
}

export const isMatch = (configPath: string, realPath: string) => {
  return parseUrlPath(configPath).test(realPath)
}

// 사용하지 않는 함수이지만 나중에 hook으로 사용할 수 있다면 좋을듯
export const getParams = (configPath: string, realPath: string) => {
  const result: Record<string, string> = {}
  const configPaths = configPath.split("/")
  const realPaths = realPath.split("/")
  const n = configPaths.length

  if (!isMatch(configPath, realPath) || configPaths.length !== realPaths.length) {
    throw new Error("invalid usecase.")
  }

  for (let i = 0; i < n; i += 1) {
    if (configPaths[i] === "" || configPaths[i][0] !== ":") {
      continue
    }
    const param = configPaths[i].slice(1)
    result[param] = realPaths[i]
  }

  return result
}

const isComponentClass = (arg: any) => {
  return Object.getPrototypeOf(arg) === Component
}

export const validateArgIsComponent = (arg: any) => {
  if (!isComponentClass(arg)) {
    throw new PrototypeError("두 번째 매개변수는 반드시 Component 클래스여야 합니다.")
  }
}
