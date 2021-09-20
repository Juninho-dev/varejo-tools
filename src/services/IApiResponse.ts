export default interface IApiResponse<T = null> {
  code: number
  isSuccess: boolean
  message?: string
  payload: T
}
