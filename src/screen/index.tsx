import React from 'react'

import Routes from '../routes'
import Header from './Header'
import { Container, Content } from './styles'

const screen: React.FC = () => {
  return (
    <Container>
      <Header />
      <Content>
        <Routes />
      </Content>
    </Container>
  )
}

export default screen
