import React, { FC, useEffect } from 'react'
import { HashRouter as Router } from 'react-router-dom'

import { useSession, SessionState } from '../hooks/useSession'
import AppRoutes from './app.routes'
import AuthRoutes from './auth.routes'

const Routes: FC = () => {
  const { verifyLogin, sessionState } = useSession()

  useEffect(() => {
    verifyLogin().catch(() => {
      // do nothing
    })
  }, [verifyLogin])

  return (
    <Router>
      {SessionState.UNAUTHENTICATED === sessionState && <AuthRoutes />}
      {SessionState.AUTHENTICATED === sessionState && <AppRoutes />}
    </Router>
  )
}

export default Routes
