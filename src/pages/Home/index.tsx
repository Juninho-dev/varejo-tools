import React, { FC } from 'react'

import { Container } from '@mui/material'

import MainLayout from '../../components/MainLayout'

const Home: FC = () => {
  return (
    <MainLayout>
      <Container>
        <h1>Bem vindo ao Varejo Tools</h1>
      </Container>
    </MainLayout>
  )
}

export default Home
