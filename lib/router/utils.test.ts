import { isMatch, getParams } from "./utils"

// [realPath, configPath, expected]
const testForIsMatch: [string, string, boolean][] = [
  ["/", "/", true],
  ["/document/asdf", "/document/:id", true],
  ["/document", "/document/:id", false],
  ["/web", "/web", true],
  ["/web/document", "/web/document/:id", false],
  ["/web/document/123", "/web/document/:id", true],
  ["/web/document/", "/web/document", true],
  ["/web/document/123/", "/web/document/:id", true],
  ["/web/document/1234asdf", "/web/document/:id", true],
]

const testForGetParams: {
  configPath: string
  realPath: string
  expected: Record<string, string>
}[] = [
  {
    configPath: "/document/:documentId",
    realPath: "/document/12345",
    expected: {
      documentId: "12345",
    },
  },
  {
    configPath: "/document/:documentId",
    realPath: "/document/12345aaa",
    expected: {
      documentId: "12345aaa",
    },
  },
  {
    configPath: "/:username/document/:documentId",
    realPath: "/yong/document/12345",
    expected: {
      username: "yong",
      documentId: "12345",
    },
  },
]

describe("validate 테스트", () => {
  test("isMatch() : 실제 페이지의 pathname과 view에 설정해둔 path를 비교해서 불리언을 반환한다.", () => {
    testForIsMatch.forEach(([realPath, configPath, expected]) => {
      expect(isMatch(configPath, realPath)).toBe(expected)
    })
  })

  test("useParams() : 동적 url에 대하여 params를 객체형태로 반환한다.", () => {
    testForGetParams.forEach(({ configPath, realPath, expected }) => {
      expect(getParams(configPath, realPath)).toEqual(expected)
    })
  })
})
