import React, { FC, useEffect } from 'react'
import {
  MemoryRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import { useSession, SessionState } from '../hooks/useSession'
import Home from '../pages/Home'
import Login from '../pages/Login'

const Routes: FC = () => {
  const { verifyLogin, sessionState } = useSession()

  useEffect(() => {
    verifyLogin().catch(() => {
      // do nothing
    })
  }, [verifyLogin])

  const PrivateRoute = ({ component, ...rest }: any) => {
    const routeComponent = (props: any) =>
      SessionState.AUTHENTICATED === sessionState ? (
        React.createElement(component, props)
      ) : (
        <Redirect to={{ pathname: '/' }} />
      )
    return <Route {...rest} render={routeComponent} />
  }
  return (
    <Router>
      <Switch>
        <Route path="/" component={Login} />
        <PrivateRoute path="/home" component={Home} />
      </Switch>
    </Router>
  )
}

export default Routes
