const parseUrlPath = (configPath: string) => {
  return new RegExp(
    "^" + configPath.replace(/\//g, "\\/").replace(/:\w+/g, "[\\w]+") + "\\/?$",
  )
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

  if (
    !isMatch(configPath, realPath) ||
    configPaths.length !== realPaths.length
  ) {
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
