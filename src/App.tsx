import React from 'react'
import { render } from 'react-dom'
import Modal from 'react-modal'

import { RecoilRoot } from 'recoil'
import { ThemeProvider } from 'styled-components'

import AppProvider from './context'
import { SessionProvider } from './hooks/useSession'
import Screen from './screen'
import { GlobalStyle } from './styles/GlobalStyle'
import { defaultTheme } from './styles/theme'

import '../i18n'

Modal.setAppElement('#root')

const App = () => {
  return (
    <RecoilRoot>
      <ThemeProvider theme={defaultTheme}>
        <SessionProvider>
          <AppProvider>
            <Screen />
          </AppProvider>
        </SessionProvider>
        <GlobalStyle />
      </ThemeProvider>
    </RecoilRoot>
  )
}

render(<App />, document.getElementById('root'))
