// 제네릭에 typeof 문자열을 넣지않고도 자동추론될 수 있게하면(실제 리덕스처럼) 더 좋았겠지만 타입설계에 어려움을 겪어서 어쩔 수 없이 이렇게...
export default function actionCreator<T extends string, Payload = void>(
  type: T,
) {
  return (payload: Payload) =>
    ({
      type,
      payload,
    } as const)
}
