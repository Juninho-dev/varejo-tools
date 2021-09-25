import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from '../pages/Home'
import UploadFile from '../pages/UploadFile'

export default function AppRoutes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/upload/file" component={UploadFile} />
    </Switch>
  )
}
