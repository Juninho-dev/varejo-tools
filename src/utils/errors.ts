import axios from 'axios'

import { ToastShow } from '../context/toast'

const timeoutErrors = ['ECONNABORTED', 'TIMEDOUT']

export const handleError = (
  err: unknown,
  alternativeMessage: string,
  addToast: ToastShow
): void => {
  if (axios.isAxiosError(err)) {
    if (err.code && timeoutErrors.includes(err.code)) {
      addToast({
        title: 'Conexão ruim ou inexistente',
        type: 'error',
        description: 'Você pode estar sem internet ou com internet lenta!'
      })
      return
    }

    if (err.response && err.response.status === 429) {
      addToast({
        title: 'Maximo de requisições excedido',
        type: 'error',
        description:
          'Você excedeu o limite de requisições por minuto, por favor aguarde 5 minutos para tentar novamente!'
      })
      return
    }

    const errorResponse = err.response?.data
    const errorMessage = errorResponse?.message
    const messagePayload = errorResponse?.payload
    const message = messagePayload ? messagePayload.join('\n') : null

    addToast({
      title: 'Ocorreu um erro!',
      type: 'error',
      description: message || errorMessage || alternativeMessage
    })
    return
  }

  addToast({
    title: 'Ocorreu um erro!',
    type: 'error',
    description: alternativeMessage
  })
}
