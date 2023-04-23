export const isDiff = <T>(obj: T, nextObj: T) => {
  return JSON.stringify(obj) !== JSON.stringify(nextObj)
}

// 성능상 2뎁스까지의 key만 확인한다.
export function spreadObject<T>(
  obj: T,
  depth = 0,
  result: [string, unknown][] = [],
) {
  if (depth === 2) {
    return Object.entries(obj as Record<string, unknown>)
  }
  result = result.concat(Object.entries(obj as Record<string, unknown>))
  for (const value of Object.values(obj as Record<string, unknown>)) {
    if (
      value &&
      typeof value === "object" &&
      typeof value !== "function" &&
      !Array.isArray(value)
    ) {
      result = result.concat(spreadObject(value, depth + 1))
    }
  }
  return result
}
