import FormData from 'form-data'
import { ReadStream } from 'fs'

import api from './api'
import IApiResponse from './IApiResponse'

export interface User {
  id: number
  name: string
  last_name: string
  email: string
}
interface BaseSessionResponse {
  access_token: string
  token_type: string
  expires_in: string
}

export type UserRegisterRequest = {
  name: string
  last_name: string
  email: string
  password: string
  gender: string
  number: string
  date_of_birth?: string
  cpf_registration?: string
}

export interface SessionResponse extends BaseSessionResponse {
  profile: User
}

export const setApiToken = (token: string) => {
  api.defaults.headers.authorization = token
}

type SignInRequest = {
  email: string
  password: string
}

export const signIn = async (
  signInData: SignInRequest
): Promise<IApiResponse<SessionResponse>> => {
  const { data } = await api.post('/login', signInData)

  return data
}

export const signOut = async (): Promise<IApiResponse> => {
  const { data } = await api.post('auth/logout')

  return data
}

export const me = async (): Promise<IApiResponse<User>> => {
  const { data } = await api.get('auth/me')

  return data
}

export const deployFile = async (
  fileData: ReadStream
): Promise<IApiResponse> => {
  console.log(fileData)

  const formdata = new FormData()
  formdata.append('file', fileData)

  const { data } = await api.post('auth/upload/file', formdata, {
    headers: formdata.getHeaders()
  })
  console.log(data)
  return data
}

export const refreshToken = async (): Promise<
  IApiResponse<BaseSessionResponse>
> => {
  const { data } = await api.post('refresh')

  return data
}
