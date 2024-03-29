export type THistory = {
  id: number,
  role: string,
  text: string
}

export type TResponseBody = {
  data?: any
  success: boolean,
}

export type TResponse = {
  status: number,
  body: TResponseBody,
  headers?: Record<string, string>
}

export type TPostMessageRes = TResponseBody & {

}