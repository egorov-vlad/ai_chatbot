export type THistory = {
  id: number,
  role: string,
  text: string
}

export type TResponseBody = {
  data?: any
}

export type TResponse = {
  status: number,
  body: TResponseBody,
  headers?: Record<string, string>
}

export type TPostMessageRes = TResponseBody & {

}