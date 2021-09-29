import React, { FC } from 'react'

import { Container, Button, Box } from '@mui/material'

import MainLayout from '../../components/MainLayout'
import { useConfig } from '../../hooks/useConfig'
import { openDialogDirectory } from '../../utils/fileWatcher'

const UploadFile: FC = () => {
  const currentFolder = useConfig('rootDirectory')

  return (
    <MainLayout>
      <Container>
        <h1>Configurador XML</h1>

        {currentFolder && (
          <Box sx={{ marginTop: 4 }}>
            <h3>Pasta Atual configurada:</h3>
            <h4>{currentFolder}</h4>
          </Box>
        )}

        <Box sx={{ marginTop: 4 }}>
          <h4>Para mudar a pasta clique no botão abaixo</h4>
          <Button
            onClick={openDialogDirectory}
            variant="contained"
            sx={{ marginTop: 2 }}
          >
            Configurar
          </Button>
        </Box>
      </Container>
    </MainLayout>
  )
}

export default UploadFile
