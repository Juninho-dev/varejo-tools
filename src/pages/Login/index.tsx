import React, { FC } from 'react'

import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import {
  Container,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  TextField
} from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'

import { useToast } from '../../context/toast'
import { useSession } from '../../hooks/useSession'
import { handleError } from '../../utils/errors'

const Login: FC = () => {
  const { addToast } = useToast()
  const { login } = useSession()
  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Digite um e-mail válido!')
      .required('E-mail é obrigatório!'),
    password: yup.string().required('Senha é obrigatória')
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async data => {
      try {
        await login(data.email, data.password)
      } catch (error) {
        handleError(
          error,
          'Não foi possivel realizar o acesso, por motivos internos',
          addToast
        )
      }
    }
  })
  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        height: '100%',
        alignItems: 'center'
      }}
    >
      <Card
        sx={{
          width: '80%'
        }}
      >
        <CardContent sx={{ textAlign: 'center' }}>
          <CloudUploadIcon sx={{ fontSize: 60 }} />
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    name="email"
                    label="E-mail"
                    type="email"
                    onChange={formik.handleChange}
                    error={
                      formik.touched.email && Boolean(formik.touched.email)
                    }
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    name="password"
                    type="password"
                    label="Senha"
                    onChange={formik.handleChange}
                    error={
                      formik.touched.password &&
                      Boolean(formik.touched.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" fullWidth type="submit">
                  Acessar
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Login
