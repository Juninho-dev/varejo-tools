import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

import axios, { AxiosError } from 'axios'

import api from '../services/api'
import IApiResponse from '../services/IApiResponse'
import {
  User,
  SessionResponse,
  UserRegisterRequest,
  signIn,
  setApiToken,
  signOut,
  me,
  refreshToken
} from '../services/UserService'
import { config } from '../store/config'
import { setWatcherDirectory } from '../utils/fileWatcher'

export enum SessionState {
  UNAUTHENTICATED,
  AUTHENTICATED,
  AUTHENTICATING,
  VERIFY_EMAIL
}

interface IRequestQueue {
  onSuccess(token: string): void
  onFailed(error: unknown): void
}

interface ISessionContext {
  user: Partial<User> | null
  sessionState: SessionState
  getToken(): Promise<string | undefined | null>
  register(
    data: Omit<UserRegisterRequest, 'fcm_token'>
  ): Promise<SessionResponse>
  login(email: string, password: string): Promise<SessionResponse>
  logout(): Promise<void>
  changeParish(parishID: string): Promise<void>
  addParish(parishID: string): Promise<void>
  verifyLogin(): Promise<void>
  update(data: FormData): Promise<User>
  reloadUser(): Promise<User>
}

const SessionContext = createContext<ISessionContext | null>(null)

export const SessionProvider: FC = ({ children }) => {
  const [userData, setUserData] = useState<Partial<User> | null>(null)
  const [sessionState, setSessionState] = useState<SessionState>(
    SessionState.UNAUTHENTICATED
  )
  const token = useRef('')
  const rootDirectory = useRef('')

  const mergeToken = useCallback(async (newToken: string) => {
    token.current = newToken
    await config.set('token', newToken)
  }, [])

  const getToken = useCallback(async () => {
    try {
      if (token.current) return token.current

      const storageToken = await config.get('token')
      token.current = storageToken || ''

      return storageToken
    } catch (error) {
      console.log(error)
    }
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const { payload } = await signIn({
        email,
        password
      })

      const { access_token, token_type, profile } = payload

      const tokenWithType = `${token_type} ${access_token}`

      await mergeToken(tokenWithType)
      setApiToken(tokenWithType)

      setUserData(profile)

      setSessionState(SessionState.AUTHENTICATED)

      return payload
    },
    [mergeToken]
  )

  const logout = useCallback(async () => {
    await signOut()
    setSessionState(SessionState.UNAUTHENTICATED)

    await mergeToken('')
    setApiToken('')

    setUserData(null)
  }, [mergeToken])

  const verifyRootDirectory = useCallback(async () => {
    if (rootDirectory.current) return

    rootDirectory.current = await config.get('rootDirectory')

    if (rootDirectory.current) {
      setWatcherDirectory(rootDirectory.current)
    }
  }, [])

  const verifyLogin = useCallback(async () => {
    setSessionState(SessionState.AUTHENTICATING)
    try {
      const userToken = await getToken()

      setApiToken(userToken || '')

      const { payload } = await me()
      setUserData(payload)
      verifyRootDirectory()

      setSessionState(SessionState.AUTHENTICATED)
    } catch (e) {
      setSessionState(SessionState.UNAUTHENTICATED)
      throw e
    }
  }, [getToken, verifyRootDirectory])

  const reloadUser = useCallback(async () => {
    const { payload } = await me()

    setUserData(payload)

    return payload
  }, [])

  useEffect(() => {
    let requestQueue: IRequestQueue[] = []
    let isRefreshing = false
    console.log('aqui')
    const interceptor = api.interceptors.response.use(
      response => response,
      (error: AxiosError<IApiResponse>) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401 && !isRefreshing) {
            const originalConfig = error.config
            isRefreshing = true

            refreshToken()
              .then(({ payload: { access_token, token_type } }) => {
                const tokenWithType = `${token_type} ${access_token}`
                setApiToken(tokenWithType)

                requestQueue.forEach(request =>
                  request.onSuccess(tokenWithType)
                )
                requestQueue = []
                mergeToken(tokenWithType)
              })
              .catch(err => {
                requestQueue.forEach(request => request.onFailed(err))
                requestQueue = []
              })
              .finally(() => {
                isRefreshing = false
              })

            return new Promise((resolve, reject) => {
              requestQueue.push({
                onFailed: err => reject(err),
                onSuccess(accessToken) {
                  originalConfig.headers.Authorization = accessToken

                  resolve(api(originalConfig))
                }
              })
            })
          }

          if (error.response?.status === 403) {
            setSessionState(SessionState.VERIFY_EMAIL)
          }
        }

        return Promise.reject(error)
      }
    )

    return () => api.interceptors.response.eject(interceptor)
  }, [mergeToken])

  return (
    <SessionContext.Provider
      value={{
        sessionState,
        user: userData,
        getToken,
        login,
        logout,
        verifyLogin,
        reloadUser
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = (): ISessionContext => {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error('this hook must be used with SessionContext Provider')
  }

  return context
}
